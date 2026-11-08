/* DSA run simulator, physics version.
   Methods adapted from the open literature and open-source projects (no code copied):
   - Flow split at bifurcations by measured resting flows where known, otherwise Murray's law (Q ∝ r³); mean velocity = Q / πr².
   - Injected contrast mixes with blood: c = rate / (rate + Q). Reflux when the rate exceeds what the vessel carries.
   - Bolus shape: rectangular injection convolved with an exponentially modified Gaussian, the usual stand-in for a
     gamma-variate indicator-dilution curve; dispersion grows with transit time. Pulsatile advance at the heart rate.
   - Organ blush: arterial input convolved with an exponential residue (indicator-dilution theory). Venous return: input
     convolved with a gamma transit-time distribution.
   - Image formation as in DRR simulators (e.g. DeepDRR): line integrals of attenuation along each ray, Beer–Lambert,
     Poisson quantum noise, log subtraction (mask − live), so overlapping vessels add and thin vessels look faint.
   - Post-processing found on angiography workstations: remasking, pixel shift, landmarking, peak opacification,
     roadmap, colour-coded time-to-peak (as in parametric "iFlow"-style DSA) and region-of-interest time–density curves. */
(function(){
const esc = s => String(s).replace(/[&<>"]/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

/* ---------------- constants (approximate textbook values) ---------------- */
const MU_I = 22;     // cm²/g, iodine mass attenuation near 40 keV effective energy (NIST XCOM ~22)
const MU_W = 0.20;   // cm⁻¹ soft tissue / water, effective for a hardened beam
const MU_B = 0.25;   // cm⁻¹ extra attenuation of whole bone over the soft tissue it replaces, effective
const T0 = 0.7;      // s of mask frames before the injection starts
const CATH = [
 {k:"arch", n:"Aortic arch (pigtail)", v:"aorta_th", at:0.06, rate:25, vol:50, qb:80, flush:1, fov:[28,64,-13,13], carm:[30,0], sten:["lsubcl",0.3]},
 {k:"abd", n:"Abdominal aorta at L1 (pigtail)", v:"aorta_ab", at:0.25, rate:15, vol:30, qb:50, flush:1, fov:[1,27], sten:["rrenal",0.25]},
 {k:"celiac", n:"Celiac trunk", v:"celiac", at:0.2, rate:5, vol:25, qb:12, sten:["cha",0.4]},
 {k:"sma", n:"Superior mesenteric artery", v:"sma", at:0.12, rate:5, vol:25, qb:8, sten:["sma",0.35]},
 {k:"ima", n:"Inferior mesenteric artery", v:"ima", at:0.2, rate:3, vol:15, qb:2.5, est:1, sten:["ima",0.4]},
 {k:"splenic", n:"Splenic artery", v:"splenic", at:0.12, rate:5, vol:25, qb:5, est:1, sten:["splenic",0.45]},
 {k:"cha", n:"Common hepatic artery", v:"cha", at:0.2, rate:5, vol:20, qb:5, est:1, sten:["pha",0.4]},
 {k:"rrenal", n:"Right renal artery", v:"rrenal", at:0.15, rate:5, vol:15, qb:9, sten:["rrenal",0.4]},
 {k:"lrenal", n:"Left renal artery", v:"lrenal", at:0.15, rate:5, vol:15, qb:9, sten:["lrenal",0.4]},
 {k:"rbronch", n:"Right bronchial artery", v:"rbronch", at:0.15, rate:1.5, vol:6, qb:1.2, est:1, sten:["rbronch",0.5]},
 {k:"riia", n:"Right internal iliac artery", v:"riia", at:0.1, rate:5, vol:20, qb:4, est:1, sten:["riia",0.4]},
 {k:"aortabif", n:"Distal aorta, pelvic run (pigtail)", v:"aorta_ab", at:0.82, rate:15, vol:30, qb:16, flush:1, fov:[-18,10], sten:["rcia",0.5]},
 {k:"rcfa", n:"Right CFA, leg runoff", v:"rcfa", at:0.2, rate:5, vol:40, qb:5, est:1, sten:["rsfa",0.7]},
 {k:"lsubcl", n:"Left subclavian artery", v:"lsubcl", at:0.3, rate:5, vol:20, qb:6, est:1, sten:["laxill",0.5]}
];
/* resting flows (cc/s) used to split flow where known; elsewhere Murray's law */
const QREF = {aorta_th:80, aorta_ab:50, bca:12, lcca:6, lsubcl:6, rsubcl:6, rcca:6, rvert:1.8, lvert:1.8, celiac:12, sma:8, rrenal:9, lrenal:9, ima:2.5,
  splenic:5, cha:5, lga:1.5, rbronch:1.2, lbronch:1.2, rcia:7, lcia:7, reia:5, leia:5, riia:4, liia:4, rcfa:5, lcfa:5, rsfa:3, lsfa:3, rpfa:2, lpfa:2,
  rlumb0:0.3, llumb0:0.3, rlumb1:0.3, llumb1:0.3};
const ORGAN_OF = {rrenal:"right kidney", lrenal:"left kidney", splenic:"spleen", pha:"liver", rha:"liver", lha:"liver", cha:"liver", lga:"stomach", rgea:"stomach", lgea:"stomach", gda:"duodenum", spda:"pancreas", ipda:"pancreas", dpanc:"pancreas", pmagna:"pancreas", midcolic:"colon", midcolicL:"colon", rcolic:"colon", ileocolic:"colon", lcolic:"colon", sigmoid:"colon"};
/* blood volume fraction and mean transit time (s) per organ */
const ORG = {"right kidney":{bv:0.12, mtt:3.0}, "left kidney":{bv:0.12, mtt:3.0}, spleen:{bv:0.08, mtt:4.0}, liver:{bv:0.04, mtt:6.0}, stomach:{bv:0.02, mtt:4.5},
  duodenum:{bv:0.02, mtt:4.5}, pancreas:{bv:0.04, mtt:4.0}, colon:{bv:0.015, mtt:5.0}, bladder:{bv:0.02, mtt:5.0}};
const VEINS_OF = {rrenal:["rrv"], lrenal:["lrv"], splenic:["splv"], sma:["smv"], ima:["imv"], lga:["coronary"], ileocolic:["smv"], midcolic:["smv"], rcolic:["smv"], jej1:["smv"], jej2:["smv"], lcolic:["imv"], sigmoid:["imv"], suprectal:["imv"], pha:["rhv","mhv","lhv"], rha:["rhv"], lha:["lhv"], lradial:["lbasilic","lceph"], lulnar:["lbasilic"], lbrach:["lbasilic"]};
/* guided cases: each sets up a run and checks what the learner does */
const CASES = [
 {k:"rate", n:"Get a diagnostic celiac run", cath:"celiac", set:{rate:2, vol:8},
  brief:"The first celiac run was faint. Choose a rate and volume that fill the celiac branches well (at least 80 mgI/ml in the vessel), with no reflux into the aorta and an injection lasting at least 3 s. Then press Acquire.",
  learn:"The injected contrast mixes with the vessel's own flow, so strength ≈ rate ÷ (rate + flow). Too slow and the run is faint; faster than the vessel can carry and it refluxes. Volume = rate × how long you want the branches filled. Chapter guide for mesenteric arteries: 5 cc/s for 25 cc (p. 597)."},
 {k:"arch", n:"Open the aortic arch", cath:"arch", carm:[0,0],
  brief:"In AP the ascending aorta, arch and descending aorta overlap, hiding the branch origins. Rotate the C-arm until the arch opens out and the three great-vessel origins separate, then Acquire.",
  learn:"The arch runs from right-anterior to left-posterior, so a left anterior oblique (LAO) view of about 30–45° lays it out flat. The origins of the brachiocephalic, left common carotid and left subclavian arteries then separate."},
 {k:"portal", n:"Indirect portography", cath:"abd",
  brief:"Show the portal vein without puncturing it. Choose a catheter position, acquire a run and play or scrub it until the portal vein fills.",
  learn:"Contrast injected into the splenic artery or the SMA returns through the splenic vein or SMV into the portal vein in the venous phase (arterial or indirect portography). The run must be long enough: venous return takes several seconds."},
 {k:"bleed", n:"Find the lower GI bleed", cath:"abd", hidden:true, answers:[["celiac","Celiac axis"],["sma","Superior mesenteric artery"],["ima","Inferior mesenteric artery"]],
  brief:"A haemodynamically unstable patient with active lower GI bleeding goes straight to angiography (p. 610). The bleeding branch is hidden. Find the extravasation using as little contrast as you can, then name the territory.",
  learn:"Angiography needs a bleeding rate of about 0.5–1.0 mL/min to show extravasation (p. 610). Extravasation is a blush that grows and persists into the venous phase, unlike a vessel, which washes out. Selective SMA and IMA runs show it better, and with less contrast, than repeated flush aortograms."},
 {k:"ras", n:"Which renal artery is narrowed?", cath:"abd", hidden:true, answers:[["rrenal","Right renal artery"],["lrenal","Left renal artery"]],
  brief:"An older smoker has resistant hypertension and rising creatinine. One renal artery has a significant stenosis near its origin. Acquire runs, use Colour TTP or time–density curves if it helps, then choose the side.",
  learn:"A flow-limiting stenosis (about 70% or more) delays and lowers opacification beyond it: that kidney's arteries peak later and its nephrogram is fainter and later. Atherosclerotic stenosis sits at the ostium or proximal artery; fibromuscular dysplasia affects the mid and distal artery."},
 {k:"motion", n:"Fix a motion artefact", cath:"rrenal", set:{mot:2},
  brief:"The patient moved 3 s into this renal run, so late frames show light and dark bone edges. Go to a frame after 4 s and use Pixel shift x and y to re-register the mask until the bones disappear.",
  learn:"Subtraction assumes nothing moved between the mask and the live frame. Pixel shift slides the mask to match the live frame. It fixes rigid movement, but not bowel peristalsis or breathing that changes from frame to frame, so breath-holds and antispasmodics still matter."}
];
const MAIN_LAB = new Set(["lga","gda","pha","rha","lha","midcolic","rcolic","ileocolic","lcolic","sigmoid","suprectal","rvert","lvert","radiv","rpdiv","ladiv","lpdiv","rata","rper","rpta","lata","lper","lpta","rdp","ldp","rbronch","lbronch","ruterine","luterine","ripud","lipud","rsglut","lsglut"]);
const shortName = n => n.replace(/ \(.*\)/,"").replace(/^Right /,"R. ").replace(/^Left /,"L. ").replace(/ arteries\b/," aa.").replace(/ artery\b/," a.").replace(/ veins\b/," vv.").replace(/ vein\b/," v.");
const casesDone = ()=>{ try { return JSON.parse(localStorage.getItem("ir-simcases")||"{}"); } catch(e){ return {}; } };
const ROI_COL = ["#e8590c","#1c7ed6","#2f9e44","#ae3ec9"];

/* ---------------- maths ---------------- */
function erf(x){ const s = x < 0 ? -1 : 1; x = Math.abs(x); const t = 1/(1+0.3275911*x);
  return s*(1 - (((((1.061405429*t - 1.453152027)*t) + 1.421413741)*t - 0.284496736)*t + 0.254829592)*t*Math.exp(-x*x)); }
const Phi = z => 0.5*(1+erf(z/Math.SQRT2));
/* CDF of an exponentially modified Gaussian (sigma, theta) */
function emgCdf(x, sg, th){ if (x < -6*sg) return 0; const l = 1/th; const z = x/sg;
  const e = -l*x + l*l*sg*sg/2; const p = Phi(z - l*sg); return Math.max(0, Phi(z) - (p < 1e-12 ? 0 : Math.exp(e)*p)); }
/* concentration (fraction of mixed strength) at time x after first arrival, for an injection lasting Ti */
const bolus = (x, Ti, sg, th) => emgCdf(x, sg, th) - emgCdf(x - Ti, sg, th);
const dispersion = tau => [0.12 + 0.07*Math.sqrt(Math.max(0,tau)), 0.18 + 0.09*Math.max(0,tau)];
function gammaPdf(t, mean, k){ if (t <= 0) return 0; const b = mean/k; let g = 1; for (let i=2;i<k;i++) g *= i; return Math.pow(t, k-1)*Math.exp(-t/b)/(g*Math.pow(b,k)); }
function stenFlow(s){ return s <= 0 ? 1 : 1/(1 + 0.02*(Math.pow(1/(1-s), 4) - 1)); } // Poiseuille: short focal narrowing in series with the distal bed
let seedN = 7; const rndN = ()=>((seedN = (seedN*16807)%2147483647)/2147483647);
const NM = (1<<20)-1, NOISE = new Float32Array(NM+1);
for (let i=0;i<=NM;i+=2){ const u = Math.max(1e-9, rndN()), v = rndN(), r = Math.sqrt(-2*Math.log(u)); NOISE[i] = r*Math.cos(2*Math.PI*v); NOISE[i+1] = r*Math.sin(2*Math.PI*v); }

let SIM = null;
function destroy(){ if (SIM) { SIM.alive = false; cancelAnimationFrame(SIM.raf); SIM = null; } }

function mount(body, opts){
  opts = opts || {};
  if (!window.THREE || !window.IR3D) { body.innerHTML = '<p class="warn">3D library not loaded.</p>'; return; }
  destroy();
  body.innerHTML = `<div class="dsa-sim">
   <div class="sim-main">
    <div class="sim-stage"><canvas class="sim-img"></canvas><svg class="sim-labels" viewBox="0 0 448 448" preserveAspectRatio="none"></svg>
      <div class="sim-hud"><span data-fr></span><span data-ph></span></div><div class="sim-busy" data-busy hidden></div><div class="sim-tip"></div></div>
    <div class="sim-bar">
      <div class="seg sm" data-view><button data-v="dsa" class="on">DSA</button><button data-v="native">Native</button><button data-v="mip">Peak opacification</button><button data-v="road">Roadmap</button><button data-v="ttp">Colour TTP</button></div>
      <div class="seg sm" data-labs aria-label="Vessel labels"><button data-lab="off">No labels</button><button data-lab="main" class="on">Main labels</button><button data-lab="all">All labels</button></div>
      <input type="range" min="0" max="10" value="0" data-scrub aria-label="Frame">
    </div>
    <div class="sim-post">
      <div class="sim-learn"><div class="row between"><b>Find the vessel</b><span><button class="btn ghost sm" data-quiz>Start quiz</button></span></div>
        <div class="small" data-qmsg>Ten questions on the run you just acquired: click the vessel that is named. Labels are hidden while you play.</div></div>
      <div class="sim-ttpbar" data-ttpbar hidden><span>early</span><i></i><span>late</span><b data-ttprange></b></div>
      <div class="sim-tdc"><div class="row between"><b>Time–density curves</b><span><button class="btn ghost sm" data-roi>Place ROI</button> <button class="btn ghost sm" data-roiclr>Clear</button></span></div>
        <canvas data-tdc width="640" height="170"></canvas><div class="small muted" data-tdcinfo>Press <b>Place ROI</b>, then click up to four spots on the run. Try one ROI before a stenosis and one after it: the distal curve peaks later and lower.</div></div>
    </div>
   </div>
   <aside class="sim-ctl">
    <h4>Guided case</h4><select data-case><option value="">Free practice</option>${CASES.map(c=>`<option value="${c.k}">${casesDone()[c.k]?"✓ ":""}${c.n}</option>`).join("")}</select>
    <div class="casecard" data-casecard hidden></div>
    <h4>Catheter and injection</h4><select data-cath>${CATH.map(c=>`<option value="${c.k}">${c.n}</option>`).join("")}</select>
    <div class="grid2"><label>Rate (cc/s)<input type="number" min="1" max="40" value="5" data-rate></label><label>Volume (cc)<input type="number" min="4" max="80" value="25" data-vol></label></div>
    <label class="wl">Contrast <select data-mgi><option value="350">350 mgI/ml</option><option value="300" selected>300 mgI/ml</option><option value="240">240 mgI/ml</option><option value="150">150 (half strength)</option></select></label>
    <div class="muted small" data-rec></div>
    <h4>C-arm and exposure</h4>
    <label class="wl">LAO / RAO <input type="range" min="-45" max="45" value="0" data-lao><output data-laoo>AP</output></label>
    <label class="wl">Cranial / caudal <input type="range" min="-35" max="35" value="0" data-cra><output data-crao>0°</output></label>
    <div class="grid2"><label>Frame rate<select data-fps><option>1</option><option>2</option><option selected>3</option><option>4</option><option>6</option><option>15</option></select></label>
      <label>Dose per frame<select data-dose><option value="250">Low</option><option value="800" selected>Normal</option><option value="2500">High</option></select></label></div>
    <h4>Patient</h4>
    <div class="grid2"><label>Heart rate<input type="number" min="40" max="150" value="70" data-hr></label>
      <label>Motion<select data-mot><option value="0">Breath-hold</option><option value="1">Breathing</option><option value="2">Moves at 3 s</option></select></label></div>
    <label class="wl">Stenosis <input type="range" min="0" max="90" step="10" value="0" data-sten><output data-steno>none</output></label>
    <div class="muted small" data-stenwhere></div>
    <label class="sw"><span>Active extravasation</span><input type="checkbox" data-ext><i></i></label>
    <label class="sw"><span>Arteriovenous shunt</span><input type="checkbox" data-avf><i></i></label>
    <div class="row"><button class="btn" data-go>Acquire run</button><button class="btn ghost" data-stop>Stop</button></div>
    <div class="verdict" data-msg>Choose a catheter position and press Acquire.</div>
    <h4>Post-processing</h4>
    <label class="wl">Window <input type="range" min="20" max="400" value="150" data-win><output data-wino></output></label>
    <label class="wl">Level <input type="range" min="-50" max="250" value="60" data-lev><output data-levo></output></label>
    <label class="wl">Mask frame <select data-mask><option value="-1">Auto (pre-contrast)</option></select></label>
    <label class="wl">Pixel shift x <input type="range" min="-12" max="12" step="0.5" value="0" data-shx><output data-shxo>0</output></label>
    <label class="wl">Pixel shift y <input type="range" min="-12" max="12" step="0.5" value="0" data-shy><output data-shyo>0</output></label>
    <label class="wl">Landmark <input type="range" min="0" max="100" value="0" data-lm><output data-lmo>0%</output></label>
    <label class="sw"><span>Invert (white vessels)</span><input type="checkbox" data-inv><i></i></label>
   </aside></div>`;
  const $ = s=>body.querySelector(s), val = s=>+$(s).value;
  const N = 448, NN = N*N;
  const stage = $(".sim-stage"), cv = $(".sim-img"), ctx = cv.getContext("2d"); cv.width = cv.height = N;
  const img = ctx.createImageData(N, N), msg = $("[data-msg]"), svg = $(".sim-labels");
  const V = IR3D.vessels, byId = {}; V.forEach(v=>byId[v.id]=v);
  const SEG = 48;
  SIM = {alive:true, raf:0};
  const me = SIM;

  /* ---------- geometry: centreline segments of every vessel, plus generated intra-organ branches ---------- */
  const segs = [], tube = V.filter(v=>["art","vein","portal"].includes(v.sys) && !v.variant);
  tube.forEach(v=>{ const curve = new THREE.CatmullRomCurve3(v.pts.map(p=>new THREE.Vector3(...p)), false, "centripetal");
    const P = curve.getSpacedPoints(SEG); v._sim = {P, s0:segs.length};
    for (let i=0;i<SEG;i++) segs.push({a:P[i], b:P[i+1], r:Math.max(0.04, v.r*0.8), v, i}); });
  const art = v=>v && v._sim && v.sys==="art";
  const kids = {};
  tube.forEach(v=>{ const par = byId[v.parent]; if (!par || !par._sim) return; let bi = 0, bd = 1e9; par._sim.P.forEach((q,i)=>{ const d = q.distanceTo(v._sim.P[0]); if (d<bd){bd=d;bi=i;} });
    v._sim.ai = Math.min(bi, SEG-1); (kids[par.id] = kids[par.id]||[]).push(v);
    // do not double-count the part of a branch that lies inside its parent's lumen
    const o = par._sim.P[bi]; for (let i=0;i<SEG;i++){ if (v._sim.P[i+1].distanceTo(o) < par.r*0.9) segs[v._sim.s0+i].skip = true; else break; } });
  Object.values(kids).forEach(a=>a.sort((x,y)=>x._sim.ai-y._sim.ai));
  const organG = {}, boneG = [];
  if (window.IR_ANAT) IR_ANAT.meshes.forEach(md=>{
    if (md.g==="bone") boneG.push(IR3D.decodeMesh(md));
    else if (md.g==="organ") { const key = Object.keys(ORG).find(o=>md.n.startsWith(o)); if (key) (organG[key] = organG[key]||[]).push(IR3D.decodeMesh(md)); } });
  const organBox = {}; Object.entries(organG).forEach(([k,gs])=>{ const b = new THREE.Box3(); gs.forEach(g=>{ g.computeBoundingBox(); b.union(g.boundingBox); }); organBox[k] = b; });
  let seed = 11; const rnd = ()=>((seed = (seed*16807)%2147483647)/2147483647);
  const nVesselSegs = segs.length;
  tube.forEach(v=>{
    if (v.sys!=="art" || (kids[v.id]||[]).some(z=>art(z))) return;
    const P = v._sim.P, end = P[SEG], tan = end.clone().sub(P[SEG-3]).normalize();
    const okey = ORGAN_OF[v.id]; const box = okey && organBox[okey];
    const center = box ? box.getCenter(new THREE.Vector3()) : null, size = box ? box.getSize(new THREE.Vector3()) : null;
    const depth = box ? 6 : 4, len0 = box ? Math.max(size.x,size.y,size.z)*0.22 : 1.6, r0 = Math.min(v.r*0.8, 0.16);
    const grow = (p, dir, L, r, d, s)=>{
      if (d > depth) return;
      let q = p.clone().addScaledVector(dir, L);
      if (box) { const rel = q.clone().sub(center); const k = Math.max(Math.abs(rel.x)/(size.x*0.5), Math.abs(rel.y)/(size.y*0.5), Math.abs(rel.z)/(size.z*0.5)); if (k > 0.92) { dir = center.clone().sub(p).normalize().lerp(dir, 0.3).normalize(); q = p.clone().addScaledVector(dir, L*0.8); } }
      segs.push({a:p, b:q, r:Math.max(0.03, r), v, arb:true, s0:s, s1:s+L});
      const axis = new THREE.Vector3(rnd()-0.5, rnd()-0.5, rnd()-0.5).cross(dir).normalize(), ang = 0.38 + rnd()*0.25;
      [1,-1].forEach(sg=>{ const nd = dir.clone().applyAxisAngle(axis, sg*ang*(0.7+rnd()*0.6)).normalize(); grow(q, nd, L*(0.68+rnd()*0.12), r*0.7, d+1, s+L); });
    };
    if (box) { const ax = size.x >= size.y && size.x >= size.z ? new THREE.Vector3(1,0,0) : size.y >= size.z ? new THREE.Vector3(0,1,0) : new THREE.Vector3(0,0,1); const ext = Math.max(size.x,size.y,size.z);
      [-0.3, 0, 0.3].forEach(o=>{ const aim = center.clone().addScaledVector(ax, o*ext); grow(end, aim.sub(end).normalize(), len0*0.9, r0*0.85, 2, 0); }); }
    else grow(end, tan, len0, r0, 1, 0);
  });
  const nS = segs.length;
  const TAU = new Float32Array(nS), SG = new Float32Array(nS), TH = new Float32Array(nS), GAIN = new Float32Array(nS), KIND = new Uint8Array(nS), VC = new Int16Array(nS), VDEL = new Float32Array(nS), RSC = new Float32Array(nS).fill(1);

  /* ---------- state ---------- */
  const st = {t:0, f:0, F:1, fps:3, T:10, Ti:5, n0:800, hr:70, mot:0, playing:false, view:"dsa", rois:[], roiMode:false, an:null, job:0,
    organs:[], ext:null, fovPts:[], phase:{}, maskKey:"", K:6.6, lab:"main", cs:null};
  const Q = {on:false, n:0, ok:0, target:null, flash:null};
  const A = new Float32Array(NN), IOD = new Float32Array(NN), LIVE = new Float32Array(NN), MASK = new Float32Array(NN), TMP = new Float32Array(NN), TMP2 = new Float32Array(NN);
  let P = null; // projection
  let fp = null, orgMaps = {}, seg2d = null, venCurves = [], orgCurves = {}, DT = 0.025;
  const AREF = MU_W*20;

  const cathCfg = ()=>CATH.find(c=>c.k===$("[data-cath]").value);
  function setDefaults(){ const c = cathCfg(); $("[data-rate]").value = c.rate; $("[data-vol]").value = c.vol; $("[data-lao]").value = (c.carm||[0,0])[0]; $("[data-cra]").value = (c.carm||[0,0])[1];
    $("[data-rec]").innerHTML = `${c.est ? `Typical injection (the chapter gives no figure for this site): ${c.rate} cc/s for ${c.vol} cc.` : `Chapter guide for this territory (p. 597): ${c.rate} cc/s for ${c.vol} cc.`} Resting flow at the tip ≈ ${c.qb} cc/s.${c.carm ? ` The C-arm starts at LAO ${c.carm[0]}° to open the arch.` : ""}`;
    const sv = byId[c.sten[0]]; $("[data-stenwhere]").textContent = sv ? `Stenosis is placed in the ${sv.name.replace(/ \(.*\)/,"").replace(/^(Left|Right) /, m=>m.toLowerCase())}.` : ""; }

  /* ---------- physics: transport of contrast over the tree ---------- */
  function compute(){
    const c = cathCfg(), rate = val("[data-rate]"), vol = val("[data-vol]"), mgi = val("[data-mgi]");
    st.K = MU_I*mgi/1000; st.Ti = vol/rate; st.hr = val("[data-hr]"); st.mot = val("[data-mot]"); st.n0 = val("[data-dose]"); st.fps = val("[data-fps]");
    const cov = st.cs && st.cs.sten;
    const sten = cov ? cov[2] : val("[data-sten]")/100, stenV = cov ? cov[0] : c.sten[0], stenI = Math.round((cov ? cov[1] : c.sten[1])*SEG), fS = stenFlow(sten);
    KIND.fill(0); GAIN.fill(0); RSC.fill(1);
    if (sten > 0 && byId[stenV] && byId[stenV]._sim) { const s0 = byId[stenV]._sim.s0; for (let i=0;i<SEG;i++){ const d = Math.abs(i - stenI); if (d < 3) RSC[s0+i] = 1 - sten*(d===0?1:d===1?0.75:0.3); } }
    const reflux = !c.flush && rate > 1.3*c.qb;
    const qTip = reflux ? 1.3*c.qb : c.qb + rate;
    const cmix = Math.min(1, reflux ? 0.95 : rate/(rate + c.qb));
    const endT = {}, endU = {}, endG = {};
    const mark = (s, tau, g)=>{ const [sg, th] = dispersion(tau); TAU[s] = tau; SG[s] = sg; TH[s] = th; GAIN[s] = g; KIND[s] = 1; };
    // directed walk downstream, splitting flow at each branch
    function walk(v, i0, t0, Q, g){
      let t = t0, q = Q, ref = QREF[v.id] || null; const ks = (kids[v.id]||[]).filter(art); let ki = 0;
      while (ki < ks.length && ks[ki]._sim.ai < i0) { if (ref && QREF[ks[ki].id]) ref -= QREF[ks[ki].id]; ki++; }
      for (let i=i0;i<SEG;i++){
        while (ki < ks.length && ks[ki]._sim.ai === i) { const k = ks[ki++]; let qk;
          if (ref && QREF[k.id]) { qk = q*Math.min(1, QREF[k.id]/Math.max(ref, QREF[k.id])); ref -= QREF[k.id]; }
          else { const a = Math.pow(k.r,3), b = Math.pow(v.r,3); qk = q*a/(a+b); }
          q = Math.max(0.05, q - qk); walk(k, 0, t, qk, g); }
        if (sten > 0 && v.id === stenV && i === stenI) q *= fS;
        const s = v._sim.s0 + i, r = v.r*RSC[s]; mark(s, t, g);
        const u = Math.min(90, Math.max(3, q/(Math.PI*v.r*v.r)));
        t += v._sim.P[i].distanceTo(v._sim.P[i+1])/u;
      }
      endT[v.id] = t; endU[v.id] = Math.min(90, Math.max(3, q/(Math.PI*v.r*v.r))); endG[v.id] = g;
    }
    const start = byId[c.v], i0 = Math.round(c.at*SEG);
    walk(start, i0, 0, qTip, cmix);
    // short-range spread (pigtail side holes upstream, or reflux into the parent): geometric search from a node
    function spread(fromV, fromI, limit, g, speed, exclude){
      const best = new Map(); const key = (v,i)=>v.id+"|"+i; const q = [[0, fromV, fromI]];
      while (q.length){ q.sort((a,b)=>a[0]-b[0]); const [d, v, i] = q.shift(); const kk = key(v,i); if (best.has(kk) && best.get(kk) <= d) continue; best.set(kk, d);
        const P = v._sim.P, nb = [];
        if (i > 0) nb.push([v, i-1, P[i].distanceTo(P[i-1])]); if (i < SEG) nb.push([v, i+1, P[i].distanceTo(P[i+1])]);
        (kids[v.id]||[]).forEach(k=>{ if (art(k) && k._sim.ai === i && !exclude.has(k.id)) nb.push([k, 0, 0.01]); });
        if (i === 0 && art(byId[v.parent]) && !exclude.has(v.parent)) nb.push([byId[v.parent], v._sim.ai, 0.01]);
        nb.forEach(([w, j, dd])=>{ if (exclude.has(w.id) || d+dd > limit) return; q.push([d+dd, w, j]); }); }
      best.forEach((d, kk)=>{ const [id, si] = kk.split("|"); const v = byId[id], i = +si; if (i >= SEG) return; const s = v._sim.s0 + i;
        if (KIND[s]) return; const d2 = best.get(id+"|"+(i+1)); if (d2 === undefined) return; mark(s, 0.15 + Math.min(d, d2)/speed, g); });
    }
    const subtree = new Set(); (function w(id){ subtree.add(id); (kids[id]||[]).forEach(k=>w(k.id)); })(c.v);
    if (c.flush) spread(start, i0, 3, cmix*0.85, 15, new Set());
    let cref = 0;
    if (reflux && art(byId[start.parent])) { const par = byId[start.parent], qp = QREF[par.id] || 20, ex = rate - c.qb;
      cref = Math.min(0.7, ex/(ex + qp)); const lim = Math.min(10, 2 + 4*(rate/c.qb - 1.3)); spread(par, start._sim.ai, lim, cref, 12, subtree); }
    // generated intra-organ branches inherit timing from their parent artery
    for (let s=nVesselSegs;s<nS;s++){ const sg = segs[s], v = sg.v; if (endT[v.id] === undefined) continue; const u = Math.max(3, 0.6*endU[v.id]); mark(s, endT[v.id] + sg.s0/u, endG[v.id]); }
    const reached = tube.filter(v=>art(v) && KIND[v._sim.s0+SEG-1]);
    // organ blush and venous return
    st.organs = []; orgCurves = {}; venCurves = [];
    const tMax = 40, nG = Math.round(tMax/DT);
    const inputCurve = (tau)=>{ const [sg, th] = dispersion(tau); const a = new Float32Array(nG); for (let n=0;n<nG;n++) a[n] = bolus(n*DT - tau, st.Ti, sg, th); return a; };
    const conv = (a, h)=>{ const o = new Float32Array(nG); for (let n=0;n<nG;n++){ if (a[n] < 1e-5) continue; for (let m=0;n+m<nG;m++) o[n+m] += a[n]*h[m]*DT; } return o; };
    const byOrgan = {};
    reached.forEach(v=>{ const o = ORGAN_OF[v.id]; if (o && organG[o]) (byOrgan[o] = byOrgan[o]||[]).push(v); });
    Object.entries(byOrgan).forEach(([o, vs])=>{ const tau = Math.min(...vs.map(v=>endT[v.id])) + 0.3, g = Math.max(...vs.map(v=>endG[v.id])); const m = ORG[o].mtt;
      const h = new Float32Array(nG); for (let n=0;n<nG;n++) h[n] = Math.exp(-n*DT/m)/m;
      orgCurves[o] = {curve: conv(inputCurve(tau), h), g: g*ORG[o].bv, tau}; st.organs.push(o); });
    const avf = $("[data-avf]").checked;
    const veinStarts = [];
    reached.forEach(v=>(VEINS_OF[v.id]||[]).forEach(x=>veinStarts.push({x, v})));
    const curveFor = {};
    tube.forEach(v=>{ if (!art(v) && v._sim) for (let i=0;i<SEG;i++) KIND[v._sim.s0+i] = 0; });
    const vq = [];
    veinStarts.forEach(({x, v})=>{ const k = v.id; if (curveFor[k] === undefined) { const m = avf ? 0.5 : (ORG[ORGAN_OF[k]] || {mtt:5}).mtt;
        const h = new Float32Array(nG); for (let n=0;n<nG;n++) h[n] = gammaPdf(n*DT, m, 3); venCurves.push(conv(inputCurve(endT[k] + 0.3), h)); curveFor[k] = venCurves.length-1; }
      vq.push([x, curveFor[k], 0, SEG, endG[k]*(avf ? 0.95 : 0.8), QREF[k] || 3]); });
    const seen = new Set();
    while (vq.length){ const [vid, ci, d0, from, g, Qv] = vq.shift(); const v = byId[vid]; if (!v || !v._sim || seen.has(vid)) continue; seen.add(vid);
      const Pp = v._sim.P; let d = d0; const u = Math.min(40, Math.max(5, Qv/(Math.PI*v.r*v.r)));
      for (let i=Math.min(from, SEG)-1;i>=0;i--){ const s = v._sim.s0+i; KIND[s] = 2; VC[s] = ci; VDEL[s] = d; GAIN[s] = g; d += Pp[i].distanceTo(Pp[i+1])/u; }
      const par = byId[v.parent];
      if (par && par._sim && !art(par)) { const dil = Math.min(1, Math.max(0.12, 1.2*Math.pow(v.r/par.r, 2)));
        vq.push([par.id, ci, d, v.sys==="portal" && par.id==="pv" ? SEG : v._sim.ai, g*dil, Qv]); }
      if (vid==="pv") ["rpv","lpv"].forEach(x=>{ const z = byId[x]; if (!z || !z._sim) return; const PP = z._sim.P; let dd = d; for (let i=0;i<SEG;i++){ const s = z._sim.s0+i; KIND[s] = 2; VC[s] = ci; VDEL[s] = dd; GAIN[s] = g*0.8; dd += PP[i].distanceTo(PP[i+1])/12; } });
    }
    // extravasation from a distal reached branch: contrast pools and stays
    st.ext = null;
    let leaf = null;
    if (st.cs && st.cs.ext) leaf = reached.includes(byId[st.cs.ext]) ? byId[st.cs.ext] : null;
    else if ($("[data-ext]").checked && reached.length) { const leaves = reached.filter(v=>!(kids[v.id]||[]).some(z=>reached.includes(z))).sort((a,b)=>a.r-b.r); leaf = leaves[Math.floor(leaves.length/3)] || reached[0]; }
    if (leaf) { const s = leaf._sim.s0 + Math.round(SEG*0.8);
      const cum = new Float32Array(nG); let acc = 0; for (let n=0;n<nG;n++){ acc += bolus(n*DT - TAU[s], st.Ti, SG[s], TH[s])*DT; cum[n] = acc; }
      st.ext = {p: segs[s].a, t: TAU[s], g: GAIN[s], cum, v: leaf}; }
    // timings for the phase label and run length
    const tArtEnd = Math.max(0, ...reached.map(v=>endT[v.id]));
    st.phase = {organ: Object.values(orgCurves).length ? Math.min(...Object.values(orgCurves).map(o=>o.tau)) + 0.8 : tArtEnd + 1.2,
      vein: venCurves.length ? Math.min(...venCurves.map(a=>{ let m = 0; a.forEach(x=>m = Math.max(m,x)); const n = a.findIndex(x=>x > 0.5*m); return n*DT; })) : 1e9};
    st.T = T0 + Math.min(24, Math.max(tArtEnd + st.Ti + 3, venCurves.length ? tArtEnd + st.Ti + 7 : 0, 8));
    st.F = Math.max(2, Math.floor(st.T*st.fps) + 1);
    $("[data-scrub]").max = st.F - 1;
    const ms = $("[data-mask]"), keep = ms.value; ms.innerHTML = `<option value="-1">Auto (pre-contrast)</option>` + Array.from({length:st.F}, (_,i)=>`<option value="${i}">Frame ${i+1} (${(i/st.fps).toFixed(1)} s)</option>`).join(""); ms.value = +keep < st.F ? keep : "-1";
    st.reached = reached; st.cmix = cmix; st.last = {reflux, strength: Math.round(cmix*mgi), Ti: st.Ti, lao: val("[data-lao]"), cra: val("[data-cra]"), cath: c.k, vol};
    // field of view: everything this injection opacifies
    const pts = []; reached.forEach(v=>v._sim.P.forEach(p=>pts.push(p)));
    for (let s=nVesselSegs;s<nS;s++) if (KIND[s]) pts.push(segs[s].b);
    const firstVeins = new Set(veinStarts.map(o=>o.x)); if (veinStarts.some(({x})=>["splv","smv","imv"].includes(x))) ["pv","rpv","lpv"].forEach(x=>firstVeins.add(x));
    tube.forEach(v=>{ if (!art(v) && KIND[v._sim.s0] && firstVeins.has(v.id)) v._sim.P.forEach(p=>pts.push(p)); });
    for (let s=0;s<nVesselSegs;s++) if (KIND[s] && !reached.includes(segs[s].v)) pts.push(segs[s].a);
    const fp2 = c.fov ? pts.filter(p=>p.y >= c.fov[0] && p.y <= c.fov[1] && (c.fov.length < 4 || p.x >= c.fov[2] && p.x <= c.fov[3])) : pts;
    st.fovPts = fp2.length ? fp2 : pts.length ? pts : [new THREE.Vector3(), new THREE.Vector3(1,1,1)];
    // feedback
    const strength = Math.round(cmix*mgi);
    let f = `<b>${c.n}</b>, ${rate} cc/s for ${vol} cc (${st.Ti.toFixed(1)} s injection). Contrast mixes with about ${c.qb} cc/s of blood, so the vessel holds about <b>${strength} mgI/ml</b>. `;
    if (reflux) f += `<span class="badtxt">Reflux:</span> the rate exceeds what this vessel carries (${c.est ? "typical" : "chapter"}: ${c.rate} for ${c.vol}), so contrast spills back into the ${byId[start.parent].name.replace(/ \(.*\)/,"")}. `;
    else if (!c.flush && cmix < 0.22 || c.flush && cmix < 0.14) f += `<span class="badtxt">Under-filled:</span> too little contrast for this flow; small branches fade into the noise. `;
    else if (rate > 1.5*c.rate) f += `The rate is well above the ${c.est ? "usual" : "chapter's"} ${c.rate} cc/s: denser vessels, but closer to reflux and a higher risk of dissection. `;
    else f += c.est ? `Injection is in the usual range for this site. ` : `Injection matches the chapter's guide. `;
    if (sten > 0 && !(st.cs && st.cs.def.hidden)) f += `A ${Math.round(sten*100)}% stenosis cuts flow beyond it to about ${Math.round(fS*100)}%, so distal filling is late. `;
    if (avf) f += "With an AV shunt, a vein fills during the arterial phase. ";
    const inView = o=>!c.fov || (()=>{ const y = organBox[o].getCenter(new THREE.Vector3()).y; return y >= c.fov[0] && y <= c.fov[1]; })();
    const orgV = st.organs.filter(inView), veinV = c.fov ? [] : veinStarts;
    if (orgV.length) f += `Parenchymal blush expected in the ${orgV.join(", ")}`;
    if (veinV.length) f += `${orgV.length?", then":"Then"} venous return${veinV.some(({x})=>["splv","smv","imv"].includes(x))?" through the portal vein (indirect portography)":""}.`; else if (orgV.length) f += ".";
    msg.className = "verdict"+(reflux || cmix < 0.22 && !c.flush ? " warn" : ""); msg.innerHTML = f;
    st.an = null; st.maskKey = "";
    project();
  }

  /* ---------- projection (orthographic C-arm) and static images ---------- */
  function project(){
    const lao = val("[data-lao]")*Math.PI/180, cra = val("[data-cra]")*Math.PI/180;
    const Z = new THREE.Vector3(Math.sin(lao)*Math.cos(cra), Math.sin(cra), Math.cos(lao)*Math.cos(cra)).normalize();
    const X = new THREE.Vector3(0,1,0).cross(Z).normalize(), Y = Z.clone().cross(X);
    let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9; st.fovPts.forEach(p=>{ const a = p.dot(X), b = p.dot(Y); x0 = Math.min(x0,a); x1 = Math.max(x1,a); y0 = Math.min(y0,b); y1 = Math.max(y1,b); });
    const half = Math.max(x1-x0, y1-y0)/2*1.12 + 2, cx = (x0+x1)/2, cy = (y0+y1)/2;
    const k = N/(2*half);
    P = {X, Y, Z, cx, cy, k, half};
    $("[data-laoo]").textContent = Math.abs(lao)<0.01 ? "AP" : (lao>0?"LAO ":"RAO ")+Math.round(Math.abs(lao*180/Math.PI))+"°";
    $("[data-crao]").textContent = Math.abs(cra)<0.01 ? "0°" : (cra>0?"Cranial ":"Caudal ")+Math.round(Math.abs(cra*180/Math.PI))+"°";
    buildFootprints(); buildAnatomy(); buildOrgans();
    st.an = null; st.maskKey = "";
  }
  const px = p=>[(p.dot(P.X) - P.cx)*P.k + N/2, N/2 - (p.dot(P.Y) - P.cy)*P.k, p.dot(P.Z)];
  /* vessel footprints: per vessel, the union of round-capped segments (max chord, so no gaps at bends and no double
     counting at joints); each pixel is tied to the nearest segment so the bolus front stays sharp */
  const fpBest = new Float32Array(NN), fpSeg = new Int32Array(NN), fpStamp = new Int32Array(NN); let fpGen = 0;
  function buildFootprints(){
    seg2d = new Float32Array(nS*5); const eS = [], eP = [], eW = [];
    const groups = new Map(); for (let s=0;s<nS;s++){ const g = segs[s].v.id + (segs[s].arb ? "#" : ""); if (!groups.has(g)) groups.set(g, []); groups.get(g).push(s); }
    groups.forEach(list=>{ const gen = ++fpGen, touched = [];
      list.forEach(s=>{ const sg = segs[s];
        const [ax, ay] = px(sg.a), [bx, by] = px(sg.b); const rpx0 = sg.r*RSC[s]*P.k;
        seg2d[s*5] = ax; seg2d[s*5+1] = ay; seg2d[s*5+2] = bx; seg2d[s*5+3] = by; seg2d[s*5+4] = rpx0;
        if (sg.skip) return;
        const d3 = sg.b.clone().sub(sg.a), L3 = d3.length(); const cz = L3 > 1e-6 ? d3.dot(P.Z)/L3 : 0; const fore = 1/Math.max(0.17, Math.sqrt(Math.max(0, 1-cz*cz)));
        const reff = Math.max(rpx0, 0.6), thin = rpx0 < 0.6;
        const dx = bx-ax, dy = by-ay, L2 = dx*dx+dy*dy;
        const xa = Math.max(0, Math.floor(Math.min(ax,bx)-reff-1)), xb = Math.min(N-1, Math.ceil(Math.max(ax,bx)+reff+1));
        const ya = Math.max(0, Math.floor(Math.min(ay,by)-reff-1)), yb = Math.min(N-1, Math.ceil(Math.max(ay,by)+reff+1));
        for (let y=ya;y<=yb;y++) for (let x=xa;x<=xb;x++){ const qx = x+0.5, qy = y+0.5;
          const t = L2 > 1e-6 ? Math.max(0, Math.min(1, ((qx-ax)*dx + (qy-ay)*dy)/L2)) : 0.5;
          const ex = qx - (ax + t*dx), ey = qy - (ay + t*dy), d2 = ex*ex + ey*ey; if (d2 > reff*reff) continue;
          const w = (thin ? Math.PI*rpx0*rpx0/(2*reff) : 2*Math.sqrt(rpx0*rpx0 - d2))/P.k*fore, i = y*N + x;
          if (fpStamp[i] !== gen) { fpStamp[i] = gen; fpBest[i] = w; fpSeg[i] = s; touched.push(i); }
          else if (w > fpBest[i]) { fpBest[i] = w; fpSeg[i] = s; } }
      });
      touched.forEach(i=>{ eS.push(fpSeg[i]); eP.push(i); eW.push(fpBest[i]); });
    });
    const start = new Int32Array(nS+1); eS.forEach(s=>start[s+1]++); for (let s=0;s<nS;s++) start[s+1] += start[s];
    const pos = start.slice(0, nS), pix = new Int32Array(eS.length), w = new Float32Array(eS.length);
    for (let j=0;j<eS.length;j++){ const k = pos[eS[j]]++; pix[k] = eP[j]; w[k] = eW[j]; }
    fp = {pix, w, start};
  }
  function rasterThickness(geoms, out){
    geoms.forEach(g=>{ const pos = g.attributes.position.array, idx = g.index ? g.index.array : null, nv = pos.length/3;
      const sx = new Float32Array(nv), sy = new Float32Array(nv), sd = new Float32Array(nv);
      const Xx = P.X.x, Xy = P.X.y, Xz = P.X.z, Yx = P.Y.x, Yy = P.Y.y, Yz = P.Y.z, Zx = P.Z.x, Zy = P.Z.y, Zz = P.Z.z;
      for (let i=0;i<nv;i++){ const x = pos[3*i], y = pos[3*i+1], z = pos[3*i+2]; sx[i] = (x*Xx+y*Xy+z*Xz - P.cx)*P.k + N/2; sy[i] = N/2 - (x*Yx+y*Yy+z*Yz - P.cy)*P.k; sd[i] = x*Zx+y*Zy+z*Zz; }
      const nt = idx ? idx.length/3 : nv/3;
      // orientation from signed volume, so inward-wound meshes still give positive thickness
      let vol = 0; for (let t=0;t<nt;t++){ const a = idx?idx[3*t]:3*t, b = idx?idx[3*t+1]:3*t+1, c = idx?idx[3*t+2]:3*t+2;
        vol += pos[3*a]*(pos[3*b+1]*pos[3*c+2]-pos[3*b+2]*pos[3*c+1]) - pos[3*a+1]*(pos[3*b]*pos[3*c+2]-pos[3*b+2]*pos[3*c]) + pos[3*a+2]*(pos[3*b]*pos[3*c+1]-pos[3*b+1]*pos[3*c]); }
      const flip = vol < 0 ? -1 : 1;
      for (let t=0;t<nt;t++){ const a = idx?idx[3*t]:3*t, b = idx?idx[3*t+1]:3*t+1, c = idx?idx[3*t+2]:3*t+2;
        const x0 = sx[a], y0 = sy[a], x1 = sx[b], y1 = sy[b], x2 = sx[c], y2 = sy[c];
        const area = (x1-x0)*(y2-y0) - (x2-x0)*(y1-y0); if (Math.abs(area) < 1e-9) continue;
        const sign = (area < 0 ? 1 : -1)*flip; // y is down on screen: negative area = facing the camera
        const xa = Math.max(0, Math.floor(Math.min(x0,x1,x2))), xb = Math.min(N-1, Math.ceil(Math.max(x0,x1,x2)));
        const ya = Math.max(0, Math.floor(Math.min(y0,y1,y2))), yb = Math.min(N-1, Math.ceil(Math.max(y0,y1,y2)));
        if (xa > xb || ya > yb) continue; const d0 = sd[a], d1 = sd[b], d2 = sd[c], ia = 1/area;
        for (let y=ya;y<=yb;y++){ const qy = y+0.5+1e-4; for (let x=xa;x<=xb;x++){ const qx = x+0.5+1e-4;
          const w0 = ((x2-x1)*(qy-y1) - (y2-y1)*(qx-x1))*ia; if (w0 < 0) continue;
          const w1 = ((x0-x2)*(qy-y2) - (y0-y2)*(qx-x2))*ia; if (w1 < 0) continue;
          const w2 = 1 - w0 - w1; if (w2 < 0) continue;
          out[y*N+x] += sign*(w0*d0 + w1*d1 + w2*d2); } } }
    });
    for (let i=0;i<out.length;i++) out[i] = Math.min(40, Math.max(0, out[i]));
  }
  function buildAnatomy(){
    TMP.fill(0); rasterThickness(boneG, TMP);
    const Z = P.Z;
    for (let y=0;y<N;y++) for (let x=0;x<N;x++){ const sx = (x+0.5-N/2)/P.k + P.cx, sy = (N/2-y-0.5)/P.k + P.cy;
      const p = P.X.clone().multiplyScalar(sx).addScaledVector(P.Y, sy);
      let L = 0; const ell = (ex, ez, a, b)=>{ const ox = p.x-ex, oz = p.z-ez, A2 = Z.x*Z.x/(a*a)+Z.z*Z.z/(b*b); if (A2 < 1e-6) return 0;
        const B = 2*(ox*Z.x/(a*a)+oz*Z.z/(b*b)), C = ox*ox/(a*a)+oz*oz/(b*b)-1, D = B*B-4*A2*C; return D > 0 ? Math.min(60, Math.sqrt(D)/A2) : 0; };
      if (p.y > -4 && p.y < 58) L = ell(0.5, 0, p.y > 30 ? 17 : 16, 11); else if (p.y <= -4) L = ell(-9, 1, 7, 7) + ell(9, 1, 7, 7);
      A[y*N+x] = MU_W*L + MU_B*TMP[y*N+x]; }
  }
  function buildOrgans(){ orgMaps = {};
    st.organs.forEach(o=>{ TMP.fill(0); rasterThickness(organG[o], TMP); const ix = [], th = []; for (let i=0;i<NN;i++) if (TMP[i] > 0.02) { ix.push(i); th.push(TMP[i]); } orgMaps[o] = {ix: Int32Array.from(ix), th: Float32Array.from(th)}; }); }

  /* ---------- frame synthesis ---------- */
  const ft = t => { const w = 2*Math.PI*st.hr/60; return t - 0.5*Math.sin(w*t)/w; }; // pulsatile advance of the front
  function segConc(s, t, tp){ if (KIND[s] === 1) return GAIN[s]*bolus(tp - TAU[s], st.Ti, SG[s], TH[s]);
    if (KIND[s] === 2) { const x = (t - VDEL[s])/DT, n = Math.floor(x), a = venCurves[VC[s]]; if (n < 0 || n+1 >= a.length) return 0; return GAIN[s]*(a[n] + (a[n+1]-a[n])*(x-n)); } return 0; }
  function curveAt(a, t){ const x = t/DT, n = Math.floor(x); if (n < 0 || n+1 >= a.length) return n < 0 ? 0 : a[a.length-1]; return a[n] + (a[n+1]-a[n])*(x-n); }
  function iodine(t, out){ out.fill(0); if (t <= 0) return; const tp = ft(t); const {pix, w, start} = fp;
    for (let s=0;s<nS;s++){ if (!KIND[s]) continue; const c = segConc(s, t, tp); if (c < 2e-4) continue; for (let j=start[s], e=start[s+1]; j<e; j++) out[pix[j]] += w[j]*c; }
    st.organs.forEach(o=>{ const oc = orgCurves[o], m = orgMaps[o]; if (!m) return; const c = oc.g*curveAt(oc.curve, t); if (c < 1e-4) return; for (let j=0;j<m.ix.length;j++) out[m.ix[j]] += m.th[j]*c; });
    if (st.ext && t > st.ext.t) { const e = st.ext, M = curveAt(e.cum, t)*Math.exp(-(t-e.t)/40); const [ex, ey] = px(e.p);
      const sx = (0.35 + 0.2*Math.sqrt(t-e.t))*P.k, sy = sx*1.6, amp = e.g*0.18*M/(Math.PI*(sx/P.k)*(sy/P.k));
      for (let y=Math.max(0,Math.floor(ey-3*sy)); y<Math.min(N,ey+3*sy); y++) for (let x=Math.max(0,Math.floor(ex-3*sx)); x<Math.min(N,ex+3*sx); x++){ const dx = (x+0.5-ex)/sx, dy = (y+0.5-ey-sy*0.5)/sy; out[y*N+x] += amp*Math.exp(-0.5*(dx*dx+dy*dy)); } }
    const K = st.K; for (let i=0;i<NN;i++) out[i] *= K;
  }
  function motion(t){ if (st.mot === 1) return [0.8*Math.sin(2*Math.PI*t/4.2), 5*Math.sin(2*Math.PI*t/4.2)];
    if (st.mot === 2) { const s = Math.min(1, Math.max(0, (t-3)/0.4)); const e = s*s*(3-2*s); return [6*e, -4*e]; } return [0,0]; }
  function shifted(src, dx, dy, out){ // out(x) = src(x - d), bilinear
    if (Math.abs(dx) < 1e-3 && Math.abs(dy) < 1e-3) { out.set(src); return; }
    const fx = Math.floor(dx), fy = Math.floor(dy), ax = dx - fx, ay = dy - fy;
    for (let y=0;y<N;y++){ const y0 = Math.min(N-1, Math.max(0, y-fy-1)), y1 = Math.min(N-1, Math.max(0, y-fy));
      for (let x=0;x<N;x++){ const x0 = Math.min(N-1, Math.max(0, x-fx-1)), x1 = Math.min(N-1, Math.max(0, x-fx));
        const a = src[y1*N+x1], b = src[y1*N+x0], c = src[y0*N+x1], d = src[y0*N+x0];
        out[y*N+x] = (a*(1-ax) + b*ax)*(1-ay) + (c*(1-ax) + d*ax)*ay; } } }
  function live(f, out){ // log attenuation of frame f: anatomy + iodine, moved by the patient, plus quantum noise
    const t = f/st.fps; iodine(t - T0, IOD); for (let i=0;i<NN;i++) TMP2[i] = A[i] + IOD[i];
    const [mx, my] = motion(t); shifted(TMP2, mx, my, out);
    const off = (f*104729 + 17) & NM, sq = 1/Math.sqrt(st.n0);
    for (let i=0;i<NN;i++){ const L = out[i]; out[i] = L + Math.exp((L - AREF)*0.5)*sq*NOISE[(i+off)&NM]; } }
  function ensureMask(){
    const mf = +$("[data-mask]").value, shx = val("[data-shx]"), shy = val("[data-shy]"), key = `${mf}|${shx}|${shy}|${st.fps}`;
    if (key === st.maskKey) return; st.maskKey = key;
    if (mf < 0) { const n = Math.max(1, Math.floor(T0*st.fps - 1e-6) + 1); TMP.fill(0);
      for (let f=0;f<n;f++){ live(f, LIVE); for (let i=0;i<NN;i++) TMP[i] += LIVE[i]/n; } }
    else { live(mf, LIVE); TMP.set(LIVE); }
    shifted(TMP, shx, shy, MASK); }

  /* ---------- display ---------- */
  function win(){ const w = val("[data-win]")/100, l = val("[data-lev]")/100; return [l - w/2, l + w/2]; }
  function paintGray(fn){ const d = img.data, inv = $("[data-inv]").checked; for (let i=0;i<NN;i++){ let g = fn(i); g = g < 0 ? 0 : g > 1 ? 1 : g; if (inv) g = 1-g; const v = g*255; d[4*i] = d[4*i+1] = d[4*i+2] = v; d[4*i+3] = 255; } ctx.putImageData(img, 0, 0); }
  function hsv(h){ const f = (n)=>{ const k = (n + h/60) % 6; return 1 - Math.max(0, Math.min(k, 4-k, 1)); }; return [f(5), f(3), f(1)]; }
  function draw(){
    if (!fp) return; const f = Math.min(st.F-1, st.f), t = f/st.fps; st.t = t;
    const [lo, hi] = win(), lm = val("[data-lm]")/100*0.35, view = st.view;
    $("[data-ttpbar]").hidden = view !== "ttp";
    if (view === "native") { live(f, LIVE); paintGray(i=>0.66 - 0.3*(LIVE[i] - AREF)); }
    else if (view === "dsa") { ensureMask(); live(f, LIVE); paintGray(i=>1 - ((LIVE[i] - MASK[i] + lm*(A[i]-AREF)) - lo)/(hi - lo)); }
    else { if (!st.an) { analyze(draw); return; } const an = st.an;
      if (view === "mip") paintGray(i=>1 - ((an.mip[i] + lm*(A[i]-AREF)) - lo)/(hi - lo));
      else if (view === "road") { live(f, LIVE); paintGray(i=>0.6 - 0.28*(LIVE[i] - AREF) + 0.8*Math.max(0, Math.min(1, (an.mip[i] - lo)/(hi - lo)))); }
      else { const d = img.data, inv = $("[data-inv]").checked, bg = inv ? 0 : 255, thr = an.thr;
        const vals = []; for (let i=0;i<NN;i+=7) if (an.mip[i] > thr) vals.push(an.ttp[i]); vals.sort((a,b)=>a-b);
        const t0 = vals.length ? vals[Math.floor(vals.length*0.03)] : 0, t1 = vals.length ? Math.max(t0+0.5, vals[Math.floor(vals.length*0.97)]) : 1;
        for (let i=0;i<NN;i++){ const m = an.mip[i]; let r = bg, g = bg, b = bg;
          if (m > thr) { const a = Math.min(1, (m - thr)/(hi*0.6)); const h = 240*Math.min(1, Math.max(0, (an.ttp[i]-t0)/(t1-t0))); const c = hsv(h);
            r = bg*(1-a) + c[0]*255*a; g = bg*(1-a) + c[1]*255*a; b = bg*(1-a) + c[2]*255*a; }
          d[4*i] = r; d[4*i+1] = g; d[4*i+2] = b; d[4*i+3] = 255; }
        ctx.putImageData(img, 0, 0); $("[data-ttprange]").textContent = `time to peak ${t0.toFixed(1)}–${t1.toFixed(1)} s after injection`; } }
    $("[data-fr]").textContent = `Frame ${f+1}/${st.F} · ${t.toFixed(2)} s`;
    const tr = t - T0, ph = view === "mip" || view === "ttp" ? "Whole run" : tr < 0.05 ? "Mask (pre-contrast)" : tr < st.phase.organ ? "Arterial phase" : tr < st.phase.vein ? "Parenchymal phase" : "Venous phase";
    $("[data-ph]").textContent = ph; $("[data-scrub]").value = f;
    overlay(); tdc(); caseTick();
  }
  function segPath(v){ let d = ""; for (let i=0;i<SEG;i++){ const s = v._sim.s0+i; if (segs[s].skip) continue; d += (d ? "L" : "M") + seg2d[s*5].toFixed(1)+","+seg2d[s*5+1].toFixed(1) + "L" + seg2d[s*5+2].toFixed(1)+","+seg2d[s*5+3].toFixed(1); } return d; }
  function overlay(){
    let s = "";
    if (Q.flash) { if (Q.flash.wrong) s += `<path class="qflash qwrong" d="${segPath(Q.flash.wrong)}"/>`; s += `<path class="qflash" d="${segPath(Q.flash.v)}"/>`; }
    if (st.lab !== "off" && st.reached && !Q.on && st.view !== "native") {
      const tr = st.t - T0, tp = ft(tr), whole = st.view === "mip" || st.view === "ttp", boxes = [];
      const hit = r=>r[0] < 2 || r[1] < 14 || r[2] > N-2 || r[3] > N-2 || boxes.some(b=>!(r[2]+2 < b[0] || r[0]-2 > b[2] || r[3]+1 < b[1] || r[1]-1 > b[3]));
      tube.filter(v=>st.lab === "all" ? v.r >= 0.06 : (v.r >= 0.15 || MAIN_LAB.has(v.id))).sort((a,b)=>b.r-a.r).forEach(v=>{
        let sg = -1;
        for (const fr of [0.5,0.35,0.65,0.2,0.8,0.1,0.9]) { const k = v._sim.s0 + Math.floor(SEG*fr); if (!KIND[k] || segs[k].skip) continue; if (!whole && segConc(k, tr, tp) < 0.04) continue;
          const x = (seg2d[k*5]+seg2d[k*5+2])/2, y = (seg2d[k*5+1]+seg2d[k*5+3])/2; if (x < 4 || y < 4 || x > N-4 || y > N-4) continue; sg = k; break; }
        if (sg < 0) return;
        const ax = (seg2d[sg*5]+seg2d[sg*5+2])/2, ay = (seg2d[sg*5+1]+seg2d[sg*5+3])/2; let dx = seg2d[sg*5+2]-seg2d[sg*5], dy = seg2d[sg*5+3]-seg2d[sg*5+1]; const L = Math.hypot(dx,dy) || 1; dx /= L; dy /= L;
        const name = shortName(v.name), w = name.length*5.1 + 3, rr = seg2d[sg*5+4];
        for (const dist of [14, 24, 36, 50]) for (const sgn of [1,-1]) { const tx = ax - dy*(dist+rr)*sgn, ty = ay + dx*(dist+rr)*sgn + 3; const left = tx < ax;
          const rect = left ? [tx-w, ty-9, tx, ty+2] : [tx, ty-9, tx+w, ty+2]; if (hit(rect)) continue; boxes.push(rect);
          s += `<line class="ld" x1="${ax.toFixed(1)}" y1="${ay.toFixed(1)}" x2="${tx.toFixed(1)}" y2="${(ty-3).toFixed(1)}"/><circle class="ldot" cx="${ax.toFixed(1)}" cy="${ay.toFixed(1)}" r="1.6"/><text x="${tx.toFixed(1)}" y="${ty.toFixed(1)}" text-anchor="${left?"end":"start"}">${esc(name)}</text>`; return; }
      }); }
    st.rois.forEach((r,i)=>{ s += `<circle cx="${r[0]}" cy="${r[1]}" r="4.5" fill="none" stroke="${ROI_COL[i]}" stroke-width="2"/><text class="roi" x="${r[0]+7}" y="${r[1]+4}" fill="${ROI_COL[i]}">${i+1}</text>`; });
    svg.innerHTML = s;
  }
  function analyze(done){
    const job = ++st.job, F = st.F, mip = new Float32Array(NN).fill(-1), ttp = new Float32Array(NN), rois = st.rois.slice(), curves = rois.map(()=>new Float32Array(F));
    ensureMask(); const busy = $("[data-busy]"); busy.hidden = false; let f = 0;
    (function step(){ if (!me.alive) return; if (job !== st.job) { st.anPending = false; return; } const end = Math.min(F, f+4);
      for (; f<end; f++){ live(f, LIVE); const t = f/st.fps - T0;
        for (let i=0;i<NN;i++){ const s = LIVE[i] - MASK[i]; if (s > mip[i]) { mip[i] = s; ttp[i] = t; } }
        rois.forEach((r,k)=>{ let a = 0, n = 0; for (let y=r[1]-2;y<=r[1]+2;y++) for (let x=r[0]-2;x<=r[0]+2;x++) if (x>=0&&y>=0&&x<N&&y<N) { a += LIVE[y*N+x] - MASK[y*N+x]; n++; } curves[k][f] = a/n; }); }
      busy.textContent = `Analysing run ${Math.round(f/F*100)}%`;
      if (f < F) setTimeout(step, 0); else { busy.hidden = true; st.an = {mip, ttp, curves, rois, thr: Math.max(0.12, 4.5/Math.sqrt(st.n0))}; done && done(); } })();
  }
  function tdc(){
    const c = $("[data-tdc]"), g = c.getContext("2d"), W = c.width, H = c.height; g.clearRect(0,0,W,H);
    const css = getComputedStyle(body); const ink = css.getPropertyValue("--ink2").trim() || "#555", line = css.getPropertyValue("--line").trim() || "#ccc";
    const L = 44, R = 10, Tp = 10, B = 26; g.strokeStyle = line; g.lineWidth = 1; g.strokeRect(L, Tp, W-L-R, H-Tp-B);
    g.fillStyle = ink; g.font = "12px system-ui, sans-serif";
    const tMax = st.T - T0; for (let s=0; s<=tMax; s+= tMax > 12 ? 4 : 2){ const x = L + (s+T0)/st.T*(W-L-R); g.fillText(s+"s", x-8, H-8); }
    const info = $("[data-tdcinfo]");
    if (!st.rois.length) return;
    if (!st.an || st.an.curves.length !== st.rois.length || st.an.rois && st.an.rois.some((r,i)=>r !== st.rois[i])) { if (!st.anPending) { st.anPending = true; analyze(()=>{ st.anPending = false; tdc(); }); } return; }
    const cs = st.an.curves; const ymax = Math.max(0.3, ...cs.map(a=>Math.max(...a)))*1.1;
    g.fillText(ymax.toFixed(1), 6, Tp+10); g.fillText("0", 30, H-B);
    const xs = f=>L + (f/st.fps)/st.T*(W-L-R), ys = v=>H-B - Math.max(0, v)/ymax*(H-Tp-B);
    g.strokeStyle = line; g.beginPath(); g.moveTo(xs(st.f), Tp); g.lineTo(xs(st.f), H-B); g.stroke();
    const rows = [];
    cs.forEach((a,k)=>{ g.strokeStyle = ROI_COL[k]; g.lineWidth = 2; g.beginPath(); a.forEach((v,f)=>{ f ? g.lineTo(xs(f), ys(v)) : g.moveTo(xs(f), ys(v)); }); g.stroke();
      let mi = 0; a.forEach((v,f)=>{ if (v > a[mi]) mi = f; }); let auc = 0; a.forEach(v=>auc += Math.max(0,v)/st.fps);
      rows.push(`<span style="color:${ROI_COL[k]}">●</span> ROI ${k+1}: peak ${a[mi].toFixed(2)} at <b>${(mi/st.fps - T0).toFixed(1)} s</b>, area ${auc.toFixed(1)}`); });
    const t1 = cs.length > 1 ? (()=>{ const pk = a=>{ let m = 0; a.forEach((v,f)=>{ if (v > a[m]) m = f; }); return m/st.fps; }; return ` · ROI 2 peaks ${(pk(cs[1]) - pk(cs[0])).toFixed(1)} s after ROI 1`; })() : "";
    info.innerHTML = rows.join("<br>") + t1 + `<br><span class="muted">Time-to-peak is from the start of injection; values are log-subtracted iodine signal.</span>`;
  }

  /* ---------- playback and controls ---------- */
  function play(){ st.playing = true; st.f = 0; let last = performance.now(), acc = 0; draw();
    (function loop(now){ if (!me.alive || !st.playing || !document.body.contains(stage)) return; acc += (now-last)/1000; last = now;
      if (acc >= 1/st.fps) { acc = acc % (1/st.fps); if (st.f >= st.F-1) { st.playing = false; return; } st.f++; draw(); }
      me.raf = requestAnimationFrame(loop); })(last); }
  const setView = v=>{ st.view = v; body.querySelectorAll("[data-v]").forEach(b=>b.classList.toggle("on", b.dataset.v===v)); draw(); };
  body.querySelectorAll("[data-v]").forEach(b=>b.onclick = ()=>setView(b.dataset.v));
  $("[data-cath]").onchange = ()=>{ setDefaults(); compute(); st.f = 0; draw(); };
  $("[data-go]").onclick = ()=>{ if (Q.on) stopQuiz("Quiz stopped: a new run was acquired."); compute(); if (st.view === "mip" || st.view === "ttp") setView("dsa"); if (st.cs) { st.cs.runs++; st.cs.cc += val("[data-vol]"); caseAcquired(); } play(); };
  $("[data-stop]").onclick = ()=>{ st.playing = false; };
  $("[data-scrub]").oninput = e=>{ st.playing = false; st.f = +e.target.value; draw(); };
  let rt = 0; const reproj = ()=>{ clearTimeout(rt); const lao = val("[data-lao]"), cra = val("[data-cra]");
    $("[data-laoo]").textContent = lao === 0 ? "AP" : (lao>0?"LAO ":"RAO ")+Math.abs(lao)+"°"; $("[data-crao]").textContent = cra === 0 ? "0°" : (cra>0?"Cranial ":"Caudal ")+Math.abs(cra)+"°";
    rt = setTimeout(()=>{ project(); draw(); }, 120); };
  ["[data-lao]","[data-cra]"].forEach(s=>$(s).oninput = reproj);
  ["[data-ext]","[data-avf]","[data-rate]","[data-vol]","[data-mgi]","[data-sten]","[data-hr]","[data-mot]","[data-dose]","[data-fps]"].forEach(s=>$(s).onchange = ()=>{ st.playing = false; compute(); st.f = Math.min(st.f, st.F-1); draw(); });
  $("[data-sten]").oninput = ()=>{ const v = val("[data-sten]"); $("[data-steno]").textContent = v ? v+"%" : "none"; };
  const outs = ()=>{ $("[data-wino]").textContent = (val("[data-win]")/100).toFixed(2); $("[data-levo]").textContent = (val("[data-lev]")/100).toFixed(2);
    $("[data-shxo]").textContent = val("[data-shx]"); $("[data-shyo]").textContent = val("[data-shy]"); $("[data-lmo]").textContent = val("[data-lm]")+"%"; };
  ["[data-win]","[data-lev]","[data-lm]","[data-inv]"].forEach(s=>$(s).oninput = ()=>{ outs(); draw(); });
  ["[data-shx]","[data-shy]","[data-mask]"].forEach(s=>$(s).oninput = ()=>{ outs(); st.an = null; draw(); });
  $("[data-roi]").onclick = ()=>{ st.roiMode = !st.roiMode; $("[data-roi]").classList.toggle("on", st.roiMode); stage.classList.toggle("roi-mode", st.roiMode); };
  $("[data-roiclr]").onclick = ()=>{ st.rois = []; if (st.an) st.an.curves = []; overlay(); tdc(); $("[data-tdcinfo]").innerHTML = "ROIs cleared."; };
  const toImg = e=>{ const r = cv.getBoundingClientRect(); return [Math.floor((e.clientX-r.left)/r.width*N), Math.floor((e.clientY-r.top)/r.height*N), r]; };
  stage.addEventListener("click", e=>{ if (Q.on && !st.roiMode) return quizClick(e); if (!st.roiMode) return; const [x, y] = toImg(e); if (st.rois.length >= 4) st.rois.shift(); st.rois.push([x, y]); st.an = st.an && {...st.an, curves: []}; overlay(); tdc(); });
  const tip = $(".sim-tip");
  function hitTest(x, y, any){ const tr = st.t - T0, tp = ft(tr); let best = null, bd = 1e9;
    for (let s=0;s<nVesselSegs;s++){ if (!KIND[s] || segs[s].skip) continue; const ax = seg2d[s*5], ay = seg2d[s*5+1], bx = seg2d[s*5+2], by = seg2d[s*5+3], rr = seg2d[s*5+4] + (any ? 5 : 3);
      const dx = bx-ax, dy = by-ay, L2 = dx*dx+dy*dy || 1; const t = Math.max(0, Math.min(1, ((x-ax)*dx + (y-ay)*dy)/L2)); const d = Math.hypot(x-ax-t*dx, y-ay-t*dy);
      if (d < rr && d - seg2d[s*5+4] < bd && (any || st.view === "mip" || st.view === "ttp" || segConc(s, tr, tp) > 0.03)) { bd = d - seg2d[s*5+4]; best = segs[s].v; } }
    return best; }
  stage.addEventListener("pointermove", e=>{ if (!seg2d) return; const [x, y, r] = toImg(e); const best = Q.on ? null : hitTest(x, y, false);
    if (best) { tip.style.display = "block"; tip.textContent = best.name; tip.style.left = (e.clientX-r.left+12)+"px"; tip.style.top = (e.clientY-r.top+8)+"px"; } else tip.style.display = "none"; });
  /* labels */
  body.querySelectorAll("[data-lab]").forEach(b=>b.onclick = ()=>{ st.lab = b.dataset.lab; body.querySelectorAll("[data-lab]").forEach(x=>x.classList.toggle("on", x===b)); try { localStorage.setItem("ir-simlab", st.lab); } catch(e){} overlay(); });
  try { const l = localStorage.getItem("ir-simlab"); if (l) { st.lab = l; body.querySelectorAll("[data-lab]").forEach(x=>x.classList.toggle("on", x.dataset.lab===l)); } } catch(e){}
  /* find-the-vessel quiz on the current run */
  const qmsg = $("[data-qmsg]");
  function quizPool(){ return tube.filter(v=>v.r >= 0.1 && KIND[v._sim.s0 + Math.floor(SEG/2)] && !segs[v._sim.s0 + Math.floor(SEG/2)].skip); }
  function stopQuiz(text){ Q.on = false; Q.flash = null; $("[data-quiz]").textContent = "Start quiz"; qmsg.innerHTML = text; overlay(); }
  const bare = v=>esc(v.name.replace(/ \(.*\)/,""));
  function nextQ(){ Q.flash = null; const pool = quizPool();
    if (Q.n >= 10 || pool.length < 2) { const pct = Q.n ? Math.round(Q.ok/Q.n*100) : 0; stopQuiz(`Done: <b>${Q.ok} of ${Q.n}</b> (${pct}%). ${pct >= 80 ? "Well read." : "Switch labels on, study the run, then try again."} Another catheter position gives new vessels.`); return; }
    Q.used = Q.used || new Set(); let fresh = pool.filter(v=>!Q.used.has(v.id)); if (!fresh.length) { Q.used.clear(); fresh = pool.filter(v=>v !== Q.target); }
    const t = fresh[Math.floor(Math.random()*fresh.length)]; Q.used.add(t.id);
    Q.target = t; qmsg.innerHTML = `Question ${Q.n+1} of 10: click the <b>${bare(t)}</b>. <span class="muted">Score ${Q.ok}/${Q.n}</span>`; overlay(); }
  function quizClick(e){ if (!Q.target || Q.flash) return; const [x, y] = toImg(e); const hit = hitTest(x, y, true);
    if (!hit) { qmsg.innerHTML = `Click on a vessel. Find the <b>${bare(Q.target)}</b>.`; return; }
    const ok = hit === Q.target; Q.n++; if (ok) Q.ok++;
    Q.flash = {v: Q.target, wrong: ok ? null : hit};
    qmsg.innerHTML = ok ? `<span class="goodtxt">Correct:</span> ${bare(Q.target)}.${Q.target.info ? ` <span class="muted">${esc(Q.target.info.split(". ")[0])}.</span>` : ""}` : `<span class="badtxt">That is the ${bare(hit)}.</span> The ${bare(Q.target)} is highlighted in amber.`;
    overlay(); setTimeout(()=>{ if (Q.on) nextQ(); }, ok ? 1600 : 2800); }
  $("[data-quiz]").onclick = ()=>{ if (Q.on) return stopQuiz("Quiz stopped."); if (quizPool().length < 2) { qmsg.textContent = "Acquire a run that fills a few vessels first."; return; }
    Q.on = true; Q.n = 0; Q.ok = 0; Q.target = null; Q.used = new Set(); st.roiMode = false; $("[data-roi]").classList.remove("on"); stage.classList.remove("roi-mode"); $("[data-quiz]").textContent = "Stop quiz"; setView("mip"); nextQ(); };
  /* guided cases */
  const card = $("[data-casecard]");
  function renderCase(result){ const cs = st.cs; if (!cs) { card.hidden = true; return; } const d = cs.def; card.hidden = false;
    card.innerHTML = `<p class="small">${d.brief}</p><p class="small muted">Runs: ${cs.runs} · contrast used: ${cs.cc} cc</p>
      ${d.answers && !cs.done ? `<div class="row wrap">${d.answers.map(([k,l])=>`<button class="btn ghost sm" data-ans="${k}">${l}</button>`).join("")}</div>` : ""}
      ${result ? `<div class="verdict ${result.ok ? "" : "warn"}">${result.text}</div>` : ""}
      ${cs.done || (result && result.reveal) ? `<p class="small"><b>Teaching point.</b> ${d.learn}</p>` : `<button class="linkbtn small" data-reveal>Give up and show the answer</button>`}`;
    card.querySelectorAll("[data-ans]").forEach(b=>b.onclick = ()=>answer(b.dataset.ans));
    const rv = card.querySelector("[data-reveal]"); if (rv) rv.onclick = ()=>renderCase({ok:false, reveal:true, text: revealText()}); }
  function revealText(){ const cs = st.cs, d = cs.def;
    if (d.k === "bleed") return `The bleed was from the ${byId[cs.ext].name} (${d.answers.find(a=>a[0]===cs.ans)[1]} territory).`;
    if (d.k === "ras") return `The stenosis was in the ${d.answers.find(a=>a[0]===cs.ans)[1].toLowerCase()}.`;
    if (d.k === "rate") return "For example 5 cc/s for 25 cc: about 88 mgI/ml, no reflux, a 5 s injection.";
    if (d.k === "arch") return "LAO 30–45° opens the arch.";
    if (d.k === "portal") return "Selective splenic or SMA injection, then play the run to the venous phase (about 6–10 s).";
    if (d.k === "motion") return "Pixel shift x = 6, y = −4 cancels this movement.";
    return ""; }
  function solved(text){ const cs = st.cs; if (!cs || cs.done) return; cs.done = true; cs.doneText = text; const d = casesDone(); d[cs.def.k] = true; try { localStorage.setItem("ir-simcases", JSON.stringify(d)); } catch(e){}
    const o = $("[data-case]").querySelector(`option[value="${cs.def.k}"]`); if (o && !o.textContent.startsWith("✓")) o.textContent = "✓ " + o.textContent; renderCase({ok:true, text}); }
  function answer(k){ const cs = st.cs; if (!cs || cs.done) return; if (!cs.runs) { renderCase({ok:false, text:"Acquire at least one run before you answer."}); return; }
    const used = `${cs.runs} run${cs.runs>1?"s":""} and ${cs.cc} cc of contrast`;
    if (k === cs.ans) solved(cs.def.k === "bleed" ? `Correct: extravasation from the ${byId[cs.ext].name}, found with ${used}.` : `Correct, found with ${used}.`);
    else renderCase({ok:false, text: cs.def.k === "ras" ? "Not that side. Compare when each kidney's arteries peak (Colour TTP, or one ROI on each kidney)." : "Not that one. Look for a blush that grows and stays into the venous phase."}); }
  function caseAcquired(){ const cs = st.cs; if (!cs) return; if (cs.done) { renderCase({ok:true, text: cs.doneText}); return; } const L = st.last, k = cs.def.k;
    if (k === "rate") { if (L.cath !== "celiac") return renderCase({ok:false, text:"Keep the catheter in the celiac trunk."});
      if (L.reflux) return renderCase({ok:false, text:`Reflux into the aorta: ${val("[data-rate]")} cc/s is more than the celiac axis carries.`});
      if (L.strength < 80) return renderCase({ok:false, text:`Still faint: about ${L.strength} mgI/ml in the vessel. Inject faster.`});
      if (L.Ti < 3) return renderCase({ok:false, text:`The injection lasts only ${L.Ti.toFixed(1)} s, so the branches are barely filled. Give more volume.`});
      return solved(`Diagnostic run: about ${L.strength} mgI/ml, no reflux, ${L.Ti.toFixed(1)} s injection.`); }
    if (k === "arch") { if (L.cath !== "arch") return renderCase({ok:false, text:"Keep the pigtail in the arch."});
      if (L.lao >= 20 && L.lao <= 50 && Math.abs(L.cra) <= 15) return solved(`LAO ${L.lao}°: the arch opens and the great-vessel origins separate.`);
      return renderCase({ok:false, text: L.lao < 0 ? "RAO foreshortens the arch further. Rotate the other way." : L.lao < 20 ? "Still overlapping. Rotate further to the left (LAO)." : L.lao > 50 ? "Too steep: the arch starts to fold back. Come back a little." : "Keep the cranial/caudal tilt near zero."}); }
    renderCase(); }
  function caseTick(){ const cs = st.cs; if (!cs || cs.done) return; const k = cs.def.k, tr = st.t - T0;
    if (k === "portal" && cs.runs && byId.pv && byId.pv._sim && tr > 0) { const s = byId.pv._sim.s0 + Math.floor(SEG/2); if (KIND[s] === 2 && segConc(s, tr, ft(tr)) > 0.04) solved(`The portal vein fills ${tr.toFixed(1)} s after injection into the ${CATH.find(c=>c.k===st.last.cath).n.replace(/ \(.*\)/,"").toLowerCase()}.`); }
    if (k === "motion" && st.t > 4 && st.view === "dsa" && Math.abs(val("[data-shx]") - 6) <= 1 && Math.abs(val("[data-shy]") + 4) <= 1) solved(`Mask shifted by (${val("[data-shx]")}, ${val("[data-shy]")}) px: the bone edges cancel again.`); }
  function setCase(k){ if (Q.on) stopQuiz("Quiz stopped."); const d = CASES.find(c=>c.k===k);
    ["[data-sten]","[data-ext]"].forEach(x=>$(x).disabled = false); $("[data-sten]").value = 0; $("[data-steno]").textContent = "none"; $("[data-ext]").checked = false; $("[data-avf]").checked = false; $("[data-mot]").value = 0; $("[data-shx]").value = 0; $("[data-shy]").value = 0;
    st.cs = null;
    if (d) { st.cs = {def:d, runs:0, cc:0, done:false};
      $("[data-cath]").value = d.cath; setDefaults();
      if (d.set) { if (d.set.rate) $("[data-rate]").value = d.set.rate; if (d.set.vol) $("[data-vol]").value = d.set.vol; if (d.set.mot) $("[data-mot]").value = d.set.mot; }
      if (d.carm) { $("[data-lao]").value = d.carm[0]; $("[data-cra]").value = d.carm[1]; }
      if (k === "bleed") { const terr = Math.random() < 0.5 ? "sma" : "ima", desc = []; (function w(id){ (kids[id]||[]).filter(art).forEach(z=>{ desc.push(z); w(z.id); }); })(terr);
        const leaves = desc.filter(v=>!(kids[v.id]||[]).some(art)); st.cs.ext = (leaves[Math.floor(Math.random()*leaves.length)] || byId[terr]).id; st.cs.ans = terr; $("[data-ext]").disabled = true; }
      if (k === "ras") { st.cs.ans = Math.random() < 0.5 ? "rrenal" : "lrenal"; st.cs.sten = [st.cs.ans, 0.2, 0.75]; $("[data-sten]").disabled = true; } }
    outs(); st.an = null; st.maskKey = ""; compute(); st.f = Math.min(st.F-1, Math.round((T0 + 1.2)*st.fps)); draw(); renderCase(); }
  $("[data-case]").onchange = e=>setCase(e.target.value);
  stage.addEventListener("pointerleave", ()=>{ tip.style.display = "none"; });
  if (opts.cath && CATH.some(c=>c.k===opts.cath)) $("[data-cath]").value = opts.cath;
  setDefaults(); outs(); compute(); st.f = Math.min(st.F-1, Math.round((T0 + 1.2)*st.fps)); draw();
  if (opts.case && CASES.some(c=>c.k===opts.case)) { $("[data-case]").value = opts.case; setCase(opts.case); }
  SIM._debug = {st, compute, draw, analyze, segs, KIND, TAU, GAIN, setView, cfg: ()=>cathCfg(), seg2d: ()=>seg2d, byId};
}
window.IRDSASIM = {mount, destroy, CASES, CATH, casesDone, _dbg: ()=>SIM && SIM._debug, _core:{bolus, emgCdf, stenFlow, dispersion, gammaPdf, CATH, QREF}};
})();
