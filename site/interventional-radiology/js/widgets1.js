/* Interactive widgets, part 1: shared helpers + intro, tools, angiography. */
window.IRW = window.IRW || {};
(function(){
const W = window.IRW;
const $ = (r,s)=>r.querySelector(s), $$ = (r,s)=>[...r.querySelectorAll(s)];
function frame(title, body, hint){ return `<div class="wcard"><div class="whead"><span class="wtag">Try it</span>${title}</div>${hint?`<div class="whint">${hint}</div>`:""}<div class="wbody">${body}</div></div>`; }
function stepper(host, title, steps){
  host.innerHTML = frame(title, `<div class="stp"><div class="stp-svg"></div><div class="stp-txt"></div></div><div class="row stp-nav"><button class="btn sm ghost" data-p>Back</button><span class="stp-dots"></span><button class="btn sm" data-n>Next</button></div>`);
  let i = 0; const dots = $(host,".stp-dots");
  dots.innerHTML = steps.map((_,k)=>`<i data-k="${k}"></i>`).join("");
  const show = ()=>{ const s = steps[i]; $(host,".stp-svg").innerHTML = s.svg||""; $(host,".stp-txt").innerHTML = `<div class="stp-n">Step ${i+1} of ${steps.length}</div><h5>${s.t}</h5><p>${s.d}</p>`;
    $$(dots,"i").forEach((d,k)=>d.classList.toggle("on",k===i)); $(host,"[data-n]").textContent = i===steps.length-1?"Restart":"Next"; };
  $(host,"[data-p]").onclick = ()=>{ i = Math.max(0,i-1); show(); };
  $(host,"[data-n]").onclick = ()=>{ i = (i+1)%steps.length; show(); };
  $$(dots,"i").forEach(d=>d.onclick=()=>{ i=+d.dataset.k; show(); });
  show();
}
/* scenario drill: items [{q, a:"choiceKey", why}], choices [{k,l}] */
function drill(host, title, items, choices, hint){
  host.innerHTML = frame(title, `<div class="drill"><div class="dq"></div><div class="dchoices">${choices.map(c=>`<button class="btn sm ghost" data-c="${c.k}">${c.l}</button>`).join("")}</div><div class="dfb"></div><div class="row"><span class="muted dscore"></span><span class="sp"></span><button class="btn sm" data-next>Next scenario</button></div></div>`, hint);
  let order = items.map((_,i)=>i).sort(()=>Math.random()-.5), i = 0, sc = 0, n = 0, done = false;
  const show = ()=>{ const it = items[order[i%order.length]]; $(host,".dq").innerHTML = `<b>Scenario:</b> ${it.q}`; $(host,".dfb").innerHTML=""; done=false; $$(host,"[data-c]").forEach(b=>b.className="btn sm ghost"); };
  $$(host,"[data-c]").forEach(b=>b.onclick=()=>{ if (done) return; done=true; n++; const it = items[order[i%order.length]]; const ok = b.dataset.c===it.a; if (ok) sc++;
    b.classList.add(ok?"ok":"bad"); $(host,`[data-c="${it.a}"]`).classList.add("ok");
    $(host,".dfb").innerHTML = `<div class="${ok?"good":"badtxt"}">${ok?"Correct.":"Not quite."}</div> ${it.why}`; $(host,".dscore").textContent = `${sc}/${n}`;
    if (window.IRStudy) IRStudy.logQuiz("drill", ok); });
  $(host,"[data-next]").onclick = ()=>{ i++; show(); };
  show();
}
W._h = {frame, stepper, drill, $, $$};

/* ---------------- INTRO ---------------- */
W.npo = host=>{
  host.innerHTML = frame("Fasting check (ASA)", `<div class="grid3">
   <label>Anesthesia<select data-a><option value="local">Local only</option><option value="sed" selected>Moderate sedation / MAC / GA</option></select></label>
   <label>Last intake<select data-f><option value="8">Full meal (meat, fried, fatty)</option><option value="6">Light meal (toast + clear liquids)</option><option value="2">Clear liquids (water, black coffee)</option></select></label>
   <label>Hours since <input type="range" min="0" max="12" step="0.5" value="4" data-h><output data-o>4 h</output></label></div><div class="verdict" data-v></div>`);
  const up = ()=>{ const a = $(host,"[data-a]").value, f = +$(host,"[data-f]").value, h = +$(host,"[data-h]").value; $(host,"[data-o]").textContent = h+" h";
    const v = $(host,"[data-v]");
    if (a==="local") { v.className="verdict ok"; v.textContent="No fasting needed for local anesthesia."; return; }
    v.className = "verdict "+(h>=f?"ok":"bad"); v.textContent = h>=f ? `Fasted enough (needs ${f} h).` : `Wait ${f-h} more hour${f-h===1?"":"s"}: this intake needs ${f} h before sedation.`; };
  $$(host,"select,input").forEach(x=>x.oninput=up); up();
};

const PROCS = [
 ["Port or tunneled line placement","low","clean",["all","sedation"]],
 ["Diagnostic angiography / angioplasty (<6 Fr)","low","clean",["all","sedation","angio"]],
 ["Arterial intervention with >7 Fr sheath","high","clean",["all","sedation","angio"]],
 ["IVC filter placement","low","clean",["all","sedation","angio","ivc"]],
 ["Complex IVC filter removal","high","clean",["all","sedation","angio","ivc"]],
 ["Dialysis access intervention","low","clean",["all","sedation","angio"]],
 ["Thoracentesis / paracentesis","low","clean",["all"]],
 ["Superficial abscess drainage","low","dirty",["all"]],
 ["Deep abscess drainage","high","dirty",["all","sedation"]],
 ["Lung biopsy","high","clean",["all","sedation","lung","biopsy"]],
 ["Transjugular liver biopsy","low","clean",["all","sedation","tjlb"]],
 ["Catheter-directed thrombolysis","high","clean",["all","sedation","angio","lysis"]],
 ["TIPS","high","cc",["all","sedation","angio","tips"]],
 ["TACE","low","cc",["all","sedation","angio","embo","tace"]],
 ["Uterine fibroid embolization","low","cc",["all","sedation","angio","embo","pelvic","ufe"]],
 ["GI bleed embolization","low","cc",["all","sedation","angio","embo","gi"]],
 ["Biliary drainage (PTC)","high","dirty",["all","sedation","biliary"]],
 ["Cholecystostomy","high","dirty",["all","sedation","biliary"]],
 ["Nephrostomy","high","dirty",["all","sedation","gu"]],
 ["Gastrostomy","high","dirty",["all","sedation","gtube"]],
 ["Tumor ablation","high","cc",["all","sedation","ablation"]]
];
const RISK = {all:"Infection, bleeding, target organ damage", sedation:"Respiratory/cardiac depression, allergy", angio:"Contrast risks; hematoma, pseudoaneurysm, thrombosis, dissection", lung:"Pneumothorax, systemic air embolism", embo:"Nontarget embolization, post-embolization syndrome", biopsy:"Nondiagnostic sample", tace:"Hepatic failure, biloma/abscess", gi:"Bowel infarction", pelvic:"Buttock claudication, rectal/bladder ischemia, impotence", biliary:"Biliary sepsis, bile leak", gu:"Urosepsis", ivc:"Migration, perforation, IVC thrombosis", lysis:"Severe bleeding incl. cerebral hemorrhage, reperfusion syndrome, distal embolization", gtube:"Malposition (peritoneum/colon), bowel damage", tips:"Hepatic failure, encephalopathy, death", tjlb:"Capsular perforation (severe bleeding)", ufe:"Premature menopause, reduced fertility, fibroid expulsion (submucosal)", ablation:"Collateral damage (esp. bowel), biliary stricture, abscess"};
const ABX = {clean:["Clean","Antibiotics generally not needed"], cc:["Clean-contaminated","Consider antibiotics"], dirty:["Dirty","Antibiotics recommended"]};
W.checklist = host=>{
  host.innerHTML = frame("Pre-procedure checklist builder", `<select data-p>${PROCS.map((p,i)=>`<option value="${i}">${p[0]}</option>`).join("")}</select><div data-out class="ckout"></div>`, "Pick a procedure to assemble its bleeding-risk class, antibiotic class and consent risks.");
  const up = ()=>{ const p = PROCS[+$(host,"[data-p]").value]; const b = p[1]==="high";
    $(host,"[data-out]").innerHTML = `<div class="kv"><span>SIR bleeding risk</span><b class="${b?"badtxt":"good"}">${b?"High":"Low"}</b></div>
    <div class="kv"><span>Labs</span><b>${b?"PT/INR, platelets, Hb routinely; correct INR >1.5–1.8, platelets <50":"Not routinely; correct INR >2.0–3.0, platelets <20"}</b></div>
    <div class="kv"><span>Wound class</span><b>${ABX[p[2]][0]} – ${ABX[p[2]][1]}</b></div>
    <div class="kv"><span>Consent risks</span><ul>${p[3].map(k=>`<li>${RISK[k]}</li>`).join("")}</ul></div>`; };
  $(host,"[data-p]").onchange = up; up();
};
W.bleedrisk = host=>{
  host.innerHTML = frame("Is this patient safe to puncture?", `<div class="grid3"><label>Procedure<select data-p>${PROCS.map((p,i)=>`<option value="${i}">${p[0]}</option>`).join("")}</select></label>
   <label>INR <input type="number" step="0.1" value="1.6" data-i></label><label>Platelets (×10⁹/L) <input type="number" value="45" data-pl></label></div><div class="verdict" data-v></div>`, "Thresholds from the SIR 2019 consensus as given in the chapter (the upper end of each INR range is used for the strict cut-off).");
  const up = ()=>{ const p = PROCS[+$(host,"[data-p]").value], inr = +$(host,"[data-i]").value, pl = +$(host,"[data-pl]").value, hi = p[1]==="high";
    const iLo = hi?1.5:2.0, iHi = hi?1.8:3.0, pMin = hi?50:20; const msg=[]; let cls="ok";
    if (inr>iHi){ msg.push(`INR ${inr} is above ${iHi}: correct before a ${hi?"high":"low"}-risk procedure.`); cls="bad"; }
    else if (inr>iLo){ msg.push(`INR ${inr} is in the ${iLo}–${iHi} grey zone: correction usually advised.`); cls = "warn"; }
    if (pl<pMin){ msg.push(`Platelets ${pl} are below ${pMin}: transfuse first.`); cls="bad"; }
    const v = $(host,"[data-v]"); v.className = "verdict "+cls; v.innerHTML = `<b>${hi?"High":"Low"} bleeding-risk procedure.</b> ` + (msg.length?msg.join(" "):"Labs are within thresholds."); };
  $$(host,"select,input").forEach(x=>x.oninput=up); up();
};

/* ---------------- TOOLS ---------------- */
W.sizer = host=>{
  const G = {16:1.65,17:1.47,18:1.27,19:1.07,20:0.91,21:0.82,22:0.72};
  host.innerHTML = frame("Device size converter (to scale)", `<div class="grid3">
  <label>Needle gauge<select data-g>${Object.keys(G).reverse().map(g=>`<option ${g==21?"selected":""}>${g}</option>`).join("")}</select></label>
  <label>Wire<select data-w><option value="0.018">0.018″ microwire</option><option value="0.035" selected>0.035″ standard</option></select></label>
  <label>Catheter / sheath French <input type="range" min="3" max="14" value="6" data-f><output data-fo></output></label></div>
  <svg viewBox="0 0 520 150" class="sizesvg" data-s></svg><div class="verdict" data-v></div>`, "1 Fr = 0.33 mm. Bigger gauge number = smaller needle. Circles are drawn to the same scale.");
  const up = ()=>{ const g = +$(host,"[data-g]").value, w = +$(host,"[data-w]").value, f = +$(host,"[data-f]").value;
    const gmm = G[g], wmm = w*25.4, fmm = f/3, sh = (f+1.5)/3; $(host,"[data-fo]").textContent = `${f} Fr = ${fmm.toFixed(2)} mm`;
    const k = 18, c = (x,lab,mm,cls)=>`<g transform="translate(${x},70)"><circle r="${mm*k}" class="${cls}"/><text y="${Math.max(mm*k,10)+22}" text-anchor="middle">${lab}</text><text y="${Math.max(mm*k,10)+38}" text-anchor="middle" class="muted">${mm.toFixed(2)} mm</text></g>`;
    $(host,"[data-s]").innerHTML = c(70,g+" G needle (OD)",gmm,"s-needle")+c(190,w+"″ wire",wmm,"s-wire")+c(320,f+" Fr catheter (OD)",fmm,"s-cath")+c(450,f+" Fr sheath (≈OD)",sh,"s-sheath");
    const fits = (w===0.018 && g<=22) || (w===0.035 && g<=18);
    const v = $(host,"[data-v]"); v.className = "verdict "+(fits?"ok":"bad");
    v.innerHTML = fits ? `A ${w}″ wire passes a ${g} G needle.` : `A ${w}″ wire will NOT pass a ${g} G needle. ${w===0.035?"Use an 18 G needle (or bigger), or start with an 0.018″ wire and a transitional (micropuncture) set.":"Needs 22 G or bigger."}`; v.innerHTML += ` A ${f} Fr sheath takes a ${f} Fr catheter but measures about ${f+1}–${f+2} Fr outside.`; };
  $$(host,"select,input").forEach(x=>x.oninput=up); up();
};

const WIRES = {
 bentson:{n:"Bentson", path:"M10 60 H260 C300 60 320 52 340 60 C360 68 380 52 400 60 C420 68 440 55 470 60", d:"20 cm floppy tip; standard or stiff shaft. Safe initial access.", cls:"std"},
 rosen:{n:"Rosen (Cook)", path:"M10 60 H400 C430 60 440 60 445 52 C450 44 440 40 435 46", d:"Stiff shaft, short floppy tip, tight 1.5 mm J. Stable support.", cls:"std"},
 glide:{n:"Glidewire (Terumo) / Roadrunner (Cook)", path:"M10 60 H420 L460 40", d:"Hydrophilic, angled. Crosses stenoses; first cannulation of an indwelling device (check-and-change); used to reach small bowel in PTC.", cls:"hyd"},
 amplatz:{n:"Amplatz (Boston Sci) / Lunderquist (Cook)", path:"M10 60 H450 L470 62", d:"Stiff. Use whenever you push something that dilates soft tissue: sheath, biliary drain, nephrostomy.", cls:"stiff"}
};
W.wires = host=>{
  const items = [
   {q:"You need to cross a tight iliac stenosis.", a:"glide", why:"Hydrophilic wires (Glidewire, Roadrunner) cross stenoses."},
   {q:"You are about to advance a 10 Fr nephrostomy dilator over the wire.", a:"amplatz", why:"Stiff wire (Amplatz, Lunderquist) gives the rigidity to dilate the tract."},
   {q:"Routine check-and-change of an indwelling biliary drain: first cannulate through the old tube.", a:"glide", why:"Hydrophilic wires are used for initial cannulation of an indwelling device."},
   {q:"Initial safe insertion through the needle into the CFA.", a:"bentson", why:"Floppy-tip / J wires can be inserted blindly with low risk (then follow on fluoro)."},
   {q:"You want a stiff-shafted wire with a short, tight J for stable support.", a:"rosen", why:"Rosen: stiff shaft, short floppy tip, 1.5 mm J."}];
  const box = document.createElement("div");
  host.innerHTML = frame("Guidewire gallery", `<svg viewBox="0 0 500 ${Object.keys(WIRES).length*44+10}" class="wiresvg">${Object.entries(WIRES).map(([k,w],i)=>`<g class="wire ${w.cls}" data-k="${k}" transform="translate(0,${i*44-38})"><path d="${w.path}"/><text x="12" y="52">${w.n}</text></g>`).join("")}</svg><div class="winfo muted">Click a wire.</div><div data-drill></div>`);
  $$(host,".wire").forEach(g=>g.onclick=()=>{ $$(host,".wire").forEach(x=>x.classList.remove("on")); g.classList.add("on"); const w = WIRES[g.dataset.k]; $(host,".winfo").innerHTML = `<b>${w.n}:</b> ${w.d}`; });
  drill($(host,"[data-drill]"), "Which wire?", items, Object.entries(WIRES).map(([k,w])=>({k,l:w.n.split(" (")[0]})));
};

const CATH = {
 pigtail:{n:"Pigtail / OmniFlush (flush)", p:"M20 140 V40 C20 10 60 10 60 35 C60 55 35 55 35 40", d:"Many sideholes, high flow. Aorta, IVC, pulmonary artery; up-and-over to the contralateral iliac."},
 c2:{n:"C2 (Cobra)", p:"M20 140 V60 C20 30 40 25 55 35 L65 45", d:"The chapter groups C2 with SOS as reverse curved-tip catheters for basic visceral selection (celiac, SMA, renal)."},
 sos:{n:"SOS Omni", p:"M20 140 V40 C20 10 55 10 55 40 L55 75", d:"Reverse curve; basic visceral selection; formed in the aorta and pulled down into the origin."},
 mick:{n:"Mickelson", p:"M20 140 V40 C20 5 70 5 70 40 C70 60 55 70 48 62", d:"For difficult selections: bronchial, intercostal, lumbar arteries. Must be reformed in a large artery."},
 sim:{n:"Simmons (Sidewinder)", p:"M20 140 V30 C20 5 60 5 60 30 L60 95 L72 105", d:"Very stable for difficult selections (acute downward origins). Must be reformed."},
 bern:{n:"Berenstein / Kumpe / MPA", p:"M20 140 V45 L38 25", d:"Angled tip; general purpose, venous work, crossing lesions."}
};
W.catheters = host=>{
  const items = [
   {q:"Selective bronchial artery angiography for hemoptysis.", a:"mick", why:"Mickelson is the chapter's catheter for bronchial, intercostal and lumbar arteries."},
   {q:"Abdominal aortogram, 15 cc/s for 30 cc.", a:"pigtail", why:"Large-vessel runs need a multi-sidehole high-flow (flush) catheter."},
   {q:"Selecting the SMA for a GI bleed workup.", a:"c2", why:"C2 or SOS reverse-curve catheters for basic visceral selection."},
   {q:"From the right groin, enter the left common iliac artery.", a:"pigtail", why:"Up-and-over with a flush catheter (pigtail/OmniFlush) selects the contralateral iliac."},
   {q:"A steeply downward-angled visceral origin where the C2 keeps falling out.", a:"sim", why:"Simmons catheters give excellent stability for difficult selections (must be reformed)."},
   {q:"Inferior vena cavogram before IVC filter placement.", a:"pigtail", why:"Cavogram is done with a high-flow (pigtail) catheter, 20 cc/s for 30 cc."}];
  host.innerHTML = frame("Catheter shapes", `<div class="cathrow">${Object.entries(CATH).map(([k,c])=>`<button class="cathbtn" data-k="${k}"><svg viewBox="0 0 90 150"><path d="${c.p}"/></svg><span>${c.n.split(" (")[0]}</span></button>`).join("")}</div><div class="winfo muted">Click a catheter.</div><div data-drill></div>`);
  $$(host,".cathbtn").forEach(b=>b.onclick=()=>{ $$(host,".cathbtn").forEach(x=>x.classList.remove("on")); b.classList.add("on"); const c = CATH[b.dataset.k]; $(host,".winfo").innerHTML = `<b>${c.n}:</b> ${c.d}`; });
  drill($(host,"[data-drill]"), "Pick the catheter", items, Object.entries(CATH).map(([k,c])=>({k,l:c.n.split(" (")[0]})));
};

W.balloon = host=>{
  host.innerHTML = frame("Balloon angioplasty bench", `<div class="grid3">
   <label>Vessel diameter <input type="range" min="3" max="14" step="0.5" value="8" data-d><output data-do></output></label>
   <label>Balloon type<select data-t><option value="nc">Non-compliant</option><option value="cut">Cutting (non-compliant + blades)</option><option value="c">Compliant</option></select></label>
   <label>Inflation <input type="range" min="0" max="100" value="0" data-p><output data-po></output></label></div>
   <svg viewBox="0 0 520 170" class="balsvg" data-s></svg><div class="verdict" data-v></div>`, "Drag the inflation slider. A non-compliant balloon shows a waist at the stenosis, then effaces it at nominal pressure.");
  const up = ()=>{ const d = +$(host,"[data-d]").value, t = $(host,"[data-t]").value, p = +$(host,"[data-p]").value/100;
    const bal = Math.round(d*1.15*2)/2; $(host,"[data-do]").textContent = d+" mm"; $(host,"[data-po]").textContent = t==="c" ? Math.round(p*100)+"% volume" : (p<0.6?"low":p<0.95?"nominal":"near rated burst");
    const k = 9, vy = d*k/2, by = (t==="c" ? d*k/2*Math.min(1.3,p*1.4) : bal*k/2*Math.min(1,p*1.25)), cx = 260, sten = vy*0.35;
    const waist = t==="c" ? by : (p<0.6 ? Math.min(by, sten + (by-sten)*p*0.6) : (p<0.95? Math.min(by, vy*0.9) : by));
    const lum = Math.max(sten, Math.min(waist, vy));
    $(host,"[data-s]").innerHTML = `
     <path class="vwall" d="M10 ${85-vy} H${cx-70} C${cx-35} ${85-vy} ${cx-25} ${85-lum} ${cx} ${85-lum} C${cx+25} ${85-lum} ${cx+35} ${85-vy} ${cx+70} ${85-vy} H510"/>
     <path class="vwall" d="M10 ${85+vy} H${cx-70} C${cx-35} ${85+vy} ${cx-25} ${85+lum} ${cx} ${85+lum} C${cx+25} ${85+lum} ${cx+35} ${85+vy} ${cx+70} ${85+vy} H510"/>
     <path class="plaque" d="M${cx-60} ${85-vy} C${cx-30} ${85-vy} ${cx-25} ${85-lum} ${cx} ${85-lum} C${cx+25} ${85-lum} ${cx+30} ${85-vy} ${cx+60} ${85-vy} Z"/>
     <line class="wireln" x1="10" y1="85" x2="510" y2="85"/>
     ${p>0?`<path class="bal ${t}" d="M${cx-90} 85 C${cx-85} ${85-by} ${cx-70} ${85-by} ${cx-40} ${85-by} C${cx-15} ${85-by} ${cx-10} ${85-waist} ${cx} ${85-waist} C${cx+10} ${85-waist} ${cx+15} ${85-by} ${cx+40} ${85-by} C${cx+70} ${85-by} ${cx+85} ${85-by} ${cx+90} 85 C${cx+85} ${85+by} ${cx+70} ${85+by} ${cx+40} ${85+by} C${cx+15} ${85+by} ${cx+10} ${85+waist} ${cx} ${85+waist} C${cx-10} ${85+waist} ${cx-15} ${85+by} ${cx-40} ${85+by} C${cx-70} ${85+by} ${cx-85} ${85+by} ${cx-90} 85Z"/>`:""}
     ${t==="cut"&&p>0?`<g class="blades">${[-1,1].map(s=>`<line x1="${cx-40}" x2="${cx+40}" y1="${85+s*waist}" y2="${85+s*waist}"/>`).join("")}</g>`:""}
     <text x="12" y="160" class="muted">${t==="c"?"Compliant: grows with volume, conforms to wall (occlusion, moulding stent-grafts)":"Recommended balloon: "+bal+" mm × length (10–20% over "+d+" mm vessel)"}</text>`;
    const v = $(host,"[data-v]");
    if (t==="c") { v.className="verdict warn"; v.textContent = "Compliant balloons are not for dilating stenoses: they are inflated by volume to occlude or to mould a stent-graft."; }
    else if (p===0) { v.className="verdict"; v.textContent = "Inflate to see the waist."; }
    else if (p<0.6) { v.className="verdict warn"; v.textContent = "Waist visible at the stenosis: keep inflating."; }
    else if (p<0.95) { v.className="verdict ok"; v.textContent = "Waist effaced at nominal pressure. Controlled stretch injury: intima disrupted, plaque pushed into the media. Give heparin."; }
    else { v.className="verdict bad"; v.textContent = "Near rated burst pressure. Risks: rupture, dissection, distal emboli."; } };
  $$(host,"select,input").forEach(x=>x.oninput=up); up();
};

W.stent = host=>{
  host.innerHTML = frame("Stent sizing and crush test", `<div class="grid3">
   <label>Normal lumen (mm) <input type="number" value="8" step="0.5" data-d></label><label>Stenosis length (cm) <input type="number" value="4" step="0.5" data-l></label>
   <label>Bed<select data-b><option value="a">Artery</option><option value="v">Vein</option></select></label></div>
   <div class="verdict" data-v></div>
   <div class="row"><button class="btn sm" data-c>Apply external compression</button><span class="muted">e.g., knee flexion, adductor canal</span></div>
   <svg viewBox="0 0 520 120" class="stentsvg" data-s></svg>`);
  let crushed = false;
  const mesh = (x,y,w,h,cls,dent)=>{ let s=`<g class="${cls}">`; for(let i=0;i<=10;i++){ const xx=x+i*w/10; s+=`<path d="M${xx} ${y} L${xx+w/20} ${y+h/2-(dent&&i>3&&i<7?h*0.25:0)} L${xx} ${y+h}"/>`; } return s+`<rect x="${x}" y="${y+(dent?h*0.12:0)}" width="${w}" height="${h-(dent?h*0.24:0)}" fill="none"/></g>`; };
  const up = ()=>{ const d = +$(host,"[data-d]").value, l = +$(host,"[data-l]").value, b = $(host,"[data-b]").value; const o = b==="a"?1.1:1.2;
    $(host,"[data-v]").className="verdict ok";
    $(host,"[data-v]").innerHTML = `Stent ≈ <b>${(d*o).toFixed(1)} mm</b> (rule of thumb ${b==="a"?"10% arterial":"20% venous"} oversize; chapter range ${d+1}–${d+2} mm) × <b>${l+1}–${l+2} cm</b> long (1–2 cm longer than the stenosis).`;
    $(host,"[data-s]").innerHTML = `<text x="20" y="16">Balloon-expandable</text>${mesh(20,25,200,60,"st be",crushed)}<text x="20" y="108" class="${crushed?"badtxt":"muted"}">${crushed?"Stays crushed: avoid near joints / adductor canal":"High radial force"}</text>
      <text x="290" y="16">Self-expanding</text>${mesh(290,25,200,60,"st se",false)}<text x="290" y="108" class="${crushed?"good":"muted"}">${crushed?"Springs back after compression":"Flexible, trackable through tortuous routes"}</text>`; };
  $(host,"[data-c]").onclick = ()=>{ crushed = !crushed; $(host,"[data-c]").textContent = crushed?"Release":"Apply external compression"; up(); };
  $$(host,"input,select").forEach(x=>x.oninput=up); up();
};

W.embolic = host=>{
  host.innerHTML = `<div data-coil></div><div data-drill></div>`;
  const ch = [{k:"coil",l:"Coils"},{k:"plug",l:"Plug"},{k:"particles",l:"Particles"},{k:"glue",l:"Glue"},{k:"scler",l:"Sclerosant"},{k:"gel",l:"Gelfoam"}];
  const items = [
   {q:"Unstable pelvic fracture with bleeding from several internal iliac branches.", a:"gel", why:"Rapid nonselective Gelfoam of the whole division: temporary (2–6 weeks), quick, collaterals protect the pelvis."},
   {q:"Massive hemoptysis from hypertrophied bronchial arteries in cystic fibrosis.", a:"particles", why:"Particles to near-stasis; coils are avoided because rebleeding is common and coils block re-access."},
   {q:"Pulmonary AVM with a 5 mm feeding artery in a patient with HHT.", a:"coil", why:"Coils are mandatory; particles would cross the right-to-left shunt to the brain."},
   {q:"Splenic artery aneurysm, 3 cm, in a woman planning pregnancy.", a:"coil", why:"Coils: distal to the neck first, then proximal."},
   {q:"Symptomatic uterine fibroids.", a:"particles", why:"Particles (trisacryl gelatin microspheres, PVA) are the US standard for fibroid UAE."},
   {q:"Postpartum hemorrhage from the uterine artery.", a:"gel", why:"Gelatin foam is usually used for postpartum hemorrhage."},
   {q:"High-flow splenic artery injury in a trauma patient; large vessel.", a:"plug", why:"Plugs act like coils in larger, high-flow vessels (splenic trauma, PARTO)."},
   {q:"Thoracic duct leak after esophagectomy, duct already coiled as scaffold.", a:"glue", why:"n-BCA glue mixed 1:1 with lipiodol polymerizes on the coil matrix."},
   {q:"Low-flow venous malformation of the forearm.", a:"scler", why:"Sclerosants (STS, polidocanol, ethanol) damage endothelium; used for lymphovascular malformations and varices."},
   {q:"Pelvic venous congestion: after coils in the inferior ovarian vein, what goes above?", a:"scler", why:"Liquid embolic or foam sclerotherapy above the coils; coils alone recur often."}];
  // coil animation
  const c = $(host,"[data-coil]");
  c.innerHTML = frame("Why coil distal first, then proximal?", `<svg viewBox="0 0 520 160" class="coilsvg"><path class="vwall2" d="M10 70 H510 M10 95 H510"/><ellipse cx="260" cy="58" rx="34" ry="28" class="aneur"/>
   <path class="vwall2" d="M380 95 C390 130 420 140 470 145"/><text x="410" y="138" class="muted">collateral</text>
   <g class="coilL" opacity="0"><path class="coilp" d="M150 75 q5 -10 10 0 q5 10 10 0 q5 -10 10 0 q5 10 10 0"/></g>
   <g class="coilR" opacity="0"><path class="coilp" d="M330 75 q5 -10 10 0 q5 10 10 0 q5 -10 10 0 q5 10 10 0"/></g>
   <g class="flowA"><circle r="4" class="flowdot"/></g><g class="flowB"><circle r="4" class="flowdot back"/></g>
   <text x="12" y="20" data-cap>Aneurysm fed from both directions.</text></svg>
   <div class="row"><button class="btn sm ghost" data-m="prox">Proximal coils only</button><button class="btn sm" data-m="both">Distal then proximal</button><button class="btn sm ghost" data-m="reset">Reset</button></div>`);
  let mode = "none", t0 = performance.now();
  const L = $(c,".coilL"), Rr = $(c,".coilR"), A = $(c,".flowA"), B = $(c,".flowB"), cap = $(c,"[data-cap]");
  $$(c,"[data-m]").forEach(b=>b.onclick=()=>{ mode = b.dataset.m; t0 = performance.now();
    L.setAttribute("opacity", mode==="reset"?0:1); Rr.setAttribute("opacity", mode==="both"?1:0);
    cap.textContent = mode==="prox" ? "Front door closed, back door open: retrograde collaterals keep filling the sac." : mode==="both" ? "Both doors closed: no inflow, no retrograde refilling. Sac thromboses." : "Aneurysm fed from both directions."; });
  (function anim(){ if (!document.body.contains(c)) return; const t = ((performance.now()-t0)/2200)%1;
    const ax = mode==="none"||mode==="reset" ? 20+t*240 : 20+t*120; A.setAttribute("transform",`translate(${ax},82)`); A.style.opacity = (mode==="prox"||mode==="both") && t>0.95?0:1;
    const bx = 470 - t*210; const by = bx>380? 145-(470-bx)*0.55 : 82; B.setAttribute("transform", `translate(${mode==="both"? Math.max(bx,355): bx},${by})`); B.style.opacity = mode==="both" && bx<360 ? 0.2 : 1;
    requestAnimationFrame(anim); })();
  drill($(host,"[data-drill]"), "Choose the embolic agent", items, ch);
};

/* ---------------- ANGIO ---------------- */
W.femoral = host=>{
  host.innerHTML = frame("Femoral puncture simulator", `<svg viewBox="0 0 420 360" class="femsvg" data-s>
    <defs><pattern id="skinp" width="8" height="8" patternUnits="userSpaceOnUse"><path d="M0 8 L8 0" class="hatch"/></pattern></defs>
    <path class="pelvis" d="M30 30 C90 60 150 110 175 150 C150 140 120 135 95 150 C70 120 45 80 30 30Z"/>
    <path class="pelvis" d="M260 150 C290 165 320 175 360 180 L360 205 C320 205 285 200 262 190Z"/>
    <path class="fneck" d="M190 222 L120 265 L105 245 L178 196"/><rect x="80" y="235" width="40" height="120" rx="14" class="fneck"/>
    <circle cx="214" cy="200" r="48" class="fhead"/><text x="120" y="330" class="muted">femur</text><text x="330" y="232" class="muted">pubis</text>
    <text x="296" y="262" class="muted">femoral head ↙</text>
    <line x1="80" y1="70" x2="330" y2="150" class="ligament"/><text x="16" y="22" class="muted">dashed line: inguinal ligament, ASIS to pubic tubercle</text>
    <path class="nerve" d="M190 60 C200 140 205 220 210 350"/><path class="art" d="M222 40 C228 140 232 230 236 300 L238 350"/><path class="art thin" d="M234 255 C250 290 268 320 280 350"/>
    <path class="vein" d="M258 40 C258 140 256 230 250 290 C246 320 240 340 236 360"/>
    <text x="180" y="355" class="lbl">N</text><text x="224" y="30" class="lbl">A</text><text x="256" y="30" class="lbl">V</text><text x="276" y="30" class="lbl">L</text>
    <text x="284" y="345" class="muted">SFA / profunda</text>
    <g data-mark></g></svg>
    <div class="row"><label class="chk"><input type="radio" name="fdir" value="retro" checked> Retrograde (to aorta)</label><label class="chk"><input type="radio" name="fdir" value="ante"> Antegrade (to leg)</label></div>
    <div class="verdict" data-v>Click where you would place the arteriotomy on the artery (red).</div>`, "Lateral → medial: Nerve, Artery, Vein, Lymphatics. Click on or near the artery.");
  const svg = $(host,"[data-s]");
  svg.addEventListener("click", e=>{
    const pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY; const p = pt.matrixTransform(svg.getScreenCTM().inverse());
    const dir = $(host,'input[name="fdir"]:checked').value;
    const ax = 222 + (p.y-40)*0.045; const off = p.x - ax; const ligY = 70 + (ax-80)*0.32;
    let cls="bad", msg="";
    if (Math.abs(off) > 14) msg = off<0 ? "Too lateral: that is the femoral nerve territory (N of NAVL)." : "Too medial: you are in the femoral vein (V).";
    else if (p.y < ligY) msg = "Above the inguinal ligament (external iliac). No bony backstop for compression and high risk of RETROPERITONEAL hematoma, which can be fatal.";
    else if (p.y < 205) msg = "Over the upper femoral head: acceptable, but you are close to the ligament. Aim a little lower, at the inferomedial margin.";
    else if (p.y <= 250) { cls = "ok"; msg = `Inferomedial femoral head: ideal. Hard surface to compress against, artery beside the nerve. Angle the needle 45° ${dir==="retro"?"cranially":"caudally"} for ${dir==="retro"?"retrograde":"antegrade"} access. Hold ≥15 min, ~1 cm above the skin nick.`; }
    else msg = "Below the femoral head: near the bifurcation, no backstop, and the femoral vein lies DEEP to the artery here → risk of AV fistula (and SFA/profunda puncture).";
    $(host,"[data-mark]").innerHTML = `<circle cx="${p.x}" cy="${p.y}" r="7" class="mark ${cls}"/><line x1="${p.x}" y1="${p.y}" x2="${p.x}" y2="${p.y+(dir==="retro"?30:-30)}" class="needle"/>`;
    const v = $(host,"[data-v]"); v.className = "verdict "+cls; v.textContent = msg; if (window.IRStudy && cls==="ok") IRStudy.mark("femoral-ok");
  });
};

W.barbeau = host=>{
  const T = {A:[1,1,1,"No damping of the pleth after radial compression.","Proceed"],B:[1,0.55,0.6,"Damped waveform during compression.","Proceed"],C:[1,0,0.45,"Loss of signal, recovers within 2 minutes.","Proceed with care"],D:[1,0,0,"Absent and non-recruitable flow.","Do NOT use transradial"]};
  host.innerHTML = frame("Barbeau test (oximeter on the thumb)", `<div class="row">${Object.keys(T).map(k=>`<button class="btn sm ghost" data-k="${k}">Type ${k}</button>`).join("")}</div><svg viewBox="0 0 520 130" data-s class="plethsvg"></svg><div class="verdict" data-v></div>`, "Types A–C follow the standard Barbeau classification; the chapter's key point is type D.");
  const wave = (x0,amp)=>{ let d=`M${x0} 80`; for(let i=0;i<4;i++){ const x=x0+i*36; d+=` C${x+6} ${80-50*amp} ${x+14} ${80-50*amp} ${x+18} ${80-20*amp} S${x+30} 80 ${x+36} 80`; } return d; };
  const show = k=>{ const t = T[k]; $$(host,"[data-k]").forEach(b=>b.classList.toggle("on",b.dataset.k===k));
    $(host,"[data-s]").innerHTML = `<path d="${wave(10,t[0])}" class="pleth"/><path d="${wave(185,t[1])}" class="pleth"/><path d="${wave(360,t[2])}" class="pleth"/>
    <text x="20" y="120">Baseline</text><text x="190" y="120">Radial compressed</text><text x="365" y="120">After 2 min</text>`;
    const v = $(host,"[data-v]"); v.className = "verdict "+(k==="D"?"bad":k==="C"?"warn":"ok"); v.innerHTML = `<b>Type ${k}:</b> ${t[3]} → ${t[4]}. For ulnar access use the reverse Barbeau (oximeter on the 5th finger, compress ulnar).`; };
  $$(host,"[data-k]").forEach(b=>b.onclick=()=>show(b.dataset.k)); show("A");
};

W.rates = host=>{
  const R = [["Aortic arch (aortogram)",25,50],["Abdominal aorta",15,30],["Inferior vena cavogram",20,30],["Mesenteric artery",5,25],["Renal artery",5,15],["Distal artery",3,12]];
  host.innerHTML = frame("Injection rates: \"cc/s for total cc\"", `<div class="rates">${R.map(r=>`<div class="rate"><span>${r[0]}</span><div class="bar"><i style="width:${r[1]*4}%"></i></div><b>${r[1]} for ${r[2]}</b></div>`).join("")}</div>
   <div class="drillmini"><b>Recall drill:</b> <span data-q></span> <input data-a placeholder="e.g. 15 for 30" size="10"> <button class="btn sm" data-c>Check</button> <span data-f></span></div>`, "Vessel diameter in mm ≈ rate in cc/s; total volume reflects the size of the vascular bed.");
  let cur; const nq = ()=>{ cur = R[Math.floor(Math.random()*R.length)]; $(host,"[data-q]").textContent = cur[0]+"?"; $(host,"[data-a]").value=""; $(host,"[data-f]").textContent=""; };
  $(host,"[data-c]").onclick = ()=>{ const n = ($(host,"[data-a]").value.match(/\d+/g)||[]).map(Number); const ok = n[0]===cur[1] && n[1]===cur[2];
    $(host,"[data-f]").innerHTML = ok?'<span class="good">✓</span>':`<span class="badtxt">✗ ${cur[1]} for ${cur[2]}</span>`; if (window.IRStudy) IRStudy.logQuiz("rates", ok); setTimeout(nq, ok?800:2200); };
  nq();
};

W.dsa = host=>{
  host.innerHTML = frame("Renal DSA: the four phases", `<canvas width="520" height="300" data-c class="dsacv"></canvas>
   <div class="row"><input type="range" min="0" max="100" value="0" data-t style="flex:1"><button class="btn sm" data-play>Play run</button></div>
   <div class="row"><label class="chk"><input type="checkbox" data-sh> Add an AV shunt (renal AVF)</label><label class="chk"><input type="checkbox" data-ex> Add active extravasation</label></div>
   <div class="verdict" data-v></div>`, "Selective right renal DSA. Watch for veins appearing too early (shunt) and contrast that pools and persists (extravasation).");
  const cv = $(host,"[data-c]"), g = cv.getContext("2d");
  // build tree
  const segs = []; (function br(x,y,a,len,w,d){ if(d>6) return; const x2=x+Math.cos(a)*len, y2=y+Math.sin(a)*len; segs.push({x,y,x2,y2,w,d}); br(x2,y2,a-0.42-Math.random()*0.15,len*0.72,w*0.68,d+1); br(x2,y2,a+0.38+Math.random()*0.15,len*0.72,w*0.68,d+1); })(80,150,0,70,7,0);
  const vsegs = segs.map(s=>({x:s.x2+6, y:s.y2+8, x2:s.x+6, y2:s.y+8, w:s.w*1.1, d:s.d}));
  let t = 0, playing = false;
  const draw = ()=>{
    g.fillStyle = "#e9e9e9"; g.fillRect(0,0,520,300);
    const sh = $(host,"[data-sh]").checked, ex = $(host,"[data-ex]").checked;
    const art = Math.min(1, t/0.35), late = t>0.3, paren = Math.max(0, Math.min(1,(t-0.4)/0.25)), ven = Math.max(0, Math.min(1,(t-0.65)/0.25)), wash = Math.max(0,(t-0.55)/0.45);
    // kidney blush
    g.save(); g.globalAlpha = 0.55*paren*(1-Math.max(0,(t-0.9)*5)); g.fillStyle = "#333"; g.beginPath(); g.ellipse(230,150,150,110,0,0,Math.PI*2); g.fill(); g.restore();
    g.strokeStyle = "#111"; g.lineCap = "round";
    segs.forEach(s=>{ const show = art*7 - s.d; if (show<=0) return; const k = Math.min(1,show); g.globalAlpha = 1 - wash*0.9; g.lineWidth = s.w; g.beginPath(); g.moveTo(s.x,s.y); g.lineTo(s.x+(s.x2-s.x)*k, s.y+(s.y2-s.y)*k); g.stroke(); });
    g.globalAlpha = 1;
    const vfill = sh ? Math.max(ven, Math.min(1,(t-0.12)/0.2)) : ven;
    vsegs.forEach(s=>{ const show = vfill*7 - (6-s.d); if (show<=0) return; g.lineWidth = s.w; g.globalAlpha = 0.85; g.beginPath(); g.moveTo(s.x,s.y); g.lineTo(s.x+(s.x2-s.x)*Math.min(1,show), s.y+(s.y2-s.y)*Math.min(1,show)); g.stroke(); });
    if (vfill>0.8){ g.lineWidth = 14; g.globalAlpha = 0.8; g.beginPath(); g.moveTo(86,158); g.lineTo(10,158); g.stroke(); }
    if (ex && t>0.2){ const r = 6+Math.min(30,(t-0.2)*60); g.globalAlpha = 0.8; g.fillStyle="#111"; g.beginPath(); g.ellipse(300,90,r*1.2,r,0.5,0,Math.PI*2); g.fill(); }
    g.globalAlpha = 1; g.fillStyle = "#000"; g.font = "13px system-ui"; g.fillText("catheter", 8, 140);
    g.strokeStyle="#555"; g.lineWidth=3; g.beginPath(); g.moveTo(0,150); g.lineTo(80,150); g.stroke();
    const ph = t<0.3?"Early arterial: main and segmental arteries":t<0.45?"Late arterial: small cortical branches":t<0.68?"Parenchymal (nephrographic) blush":"Venous: renal vein drains to the IVC";
    const v = $(host,"[data-v]"); let extra = "";
    if (sh && t<0.5 && t>0.15) extra = " ⚠ Vein opacifying in the ARTERIAL phase = shunt (e.g., post-biopsy AVF; RCC also shunts). AML does not shunt.";
    if (ex && t>0.5) extra += " ⚠ Contrast blush persists and grows after arteries wash out = active extravasation.";
    v.className = "verdict"+(extra?" warn":""); v.textContent = ph + "." + extra;
  };
  $(host,"[data-t]").oninput = e=>{ t = e.target.value/100; draw(); };
  $$(host,"input[type=checkbox]").forEach(c=>c.onchange=draw);
  $(host,"[data-play]").onclick = ()=>{ if (playing) return; playing = true; t = 0; const t0 = performance.now(); (function f(){ t = Math.min(1,(performance.now()-t0)/6000); $(host,"[data-t]").value = t*100; draw(); if (t<1 && document.body.contains(cv)) requestAnimationFrame(f); else playing=false; })(); };
  draw();
};

W.landmarks = host=>{
  const LV = ["T10","T11","T12","L1","L2","L3","L4","L5"]; const Q = [["Celiac trunk","T12","body"],["SMA","T12–L1","disc"],["Renal arteries","L1–L2","disc"],["IMA","L3","body"],["Bronchial arteries (thoracic)","T5–T6",null],["Cisterna chyli","L1–L3",null]];
  host.innerHTML = frame("Where does it arise? Click the level", `<div class="lmwrap"><svg viewBox="0 0 260 420" data-s class="lmsvg"></svg><div><div data-q class="lmq"></div><div data-f></div><button class="btn sm" data-n>Next</button><button class="btn sm ghost" data-sh>Show all</button></div></div>`);
  const svg = $(host,"[data-s]"); let s = ""; LV.forEach((n,i)=>{ const y = 20+i*50; s += `<rect x="40" y="${y}" width="70" height="38" rx="8" class="vb" data-lv="${n}"/><text x="30" y="${y+24}" text-anchor="end">${n}</text>`; if(i<LV.length-1) s+=`<rect x="44" y="${y+39}" width="62" height="10" rx="3" class="disc" data-lv="${n}–${LV[i+1]}"/>`; });
  s += `<rect x="135" y="10" width="26" height="340" rx="12" class="aorta"/><g data-br></g>`; svg.innerHTML = s;
  const yOf = lv => { const m = lv.split("–"); const i = LV.indexOf(m[0]); return m.length>1 ? 20+i*50+44 : 20+i*50+19; };
  const branches = [["Celiac","T12"],["SMA","T12–L1"],["Renals","L1–L2"],["IMA","L3"]];
  let cur;
  const next = ()=>{ const pool = Q.filter(q=>q[2]); cur = pool[Math.floor(Math.random()*pool.length)]; $(host,"[data-q]").innerHTML = `Where does the <b>${cur[0]}</b> arise?`; $(host,"[data-f]").innerHTML=""; $$(svg,".vb,.disc").forEach(r=>r.classList.remove("ok","bad")); };
  $$(svg,"[data-lv]").forEach(r=>r.onclick=()=>{ const ok = r.dataset.lv===cur[1]; r.classList.add(ok?"ok":"bad"); if(!ok) $$(svg,`[data-lv="${cur[1]}"]`).forEach(x=>x.classList.add("ok"));
    $(host,"[data-f]").innerHTML = ok?'<span class="good">Correct.</span>':`<span class="badtxt">It is ${cur[1]}.</span>`; if (window.IRStudy) IRStudy.logQuiz("levels", ok); });
  $(host,"[data-n]").onclick = next;
  $(host,"[data-sh]").onclick = ()=>{ $(svg,"[data-br]").innerHTML = branches.map(([n,l])=>`<line x1="161" x2="210" y1="${yOf(l)}" y2="${yOf(l)}" class="brl"/><text x="214" y="${yOf(l)+4}">${n}</text>`).join("") + `<text x="135" y="372" class="muted">Bifurcation ~L4</text>`; };
  next();
};

W.celiac = host=>{
  const base = {celiac:[200,60,200,110], lga:[200,110,150,40], splenic:[200,110,380,110], cha:[200,110,110,130], gda:[110,130,105,215], pha:[110,130,80,80], rha:[80,80,25,60], lha:[80,80,120,35], cystic:[45,68,40,120], rgea:[105,215,250,250], lgea:[380,110,300,248]};
  const lab = {celiac:"celiac trunk", lga:"left gastric", splenic:"splenic", cha:"common hepatic", gda:"GDA", pha:"proper hepatic", rha:"right hepatic", lha:"left hepatic", cystic:"cystic", rgea:"R gastroepiploic", lgea:"L gastroepiploic"};
  host.innerHTML = frame("Celiac axis and hepatic arterial variants", `<div class="row">${[["normal","Classic (75%)"],["rrha","Replaced RHA (10–18%)"],["rlha","Replaced LHA (11–12%)"],["arha","Accessory RHA"],["alha","Accessory LHA"]].map(([k,l])=>`<button class="btn sm ghost" data-k="${k}">${l}</button>`).join("")}</div>
   <svg viewBox="0 0 420 330" class="celsvg" data-s></svg><div class="verdict" data-v></div><div class="row"><a class="btn sm ghost" href="#/explorer?v=celiac">Open in 3D</a></div>`);
  const T = {normal:"Celiac → left gastric, common hepatic, splenic. CHA → GDA → proper hepatic → right + left hepatic; cystic from the RHA.", rrha:"Right hepatic arises from the SMA (no RHA from the proper hepatic). Cystic arises from the RRHA. Know it before lap chole; good for a living right-lobe donor; worse for a recipient.", rlha:"Left hepatic arises from the left gastric. Clinically important in gastrectomy.", arha:"Extra artery from the SMA to the right lobe, with a normal RHA also present.", alha:"Extra artery from the left gastric to the left lobe, with a normal LHA also present."};
  const show = k=>{ $$(host,"[data-k]").forEach(b=>b.classList.toggle("on",b.dataset.k===k)); let s = `<rect x="185" y="20" width="30" height="300" rx="14" class="aorta"/><text x="200" y="14" text-anchor="middle" class="muted">aorta</text>`;
    const line = (id,c,cls)=>`<g class="cl ${cls||""}"><line x1="${c[0]}" y1="${c[1]}" x2="${c[2]}" y2="${c[3]}"/><text x="${(c[0]+c[2])/2+4}" y="${(c[1]+c[3])/2-4}">${lab[id]||id}</text></g>`;
    Object.entries(base).forEach(([id,c])=>{ if (k==="rrha" && (id==="rha"||id==="cystic")) return; if (k==="rlha" && id==="lha") return; s += line(id,c); });
    s += `<g class="cl"><line x1="200" y1="160" x2="230" y2="300"/><text x="236" y="296">SMA</text></g>`;
    if (k==="rrha") s += line("replaced RHA",[205,175,25,60],"var")+line("cystic",[60,95,40,140],"var");
    if (k==="arha") s += line("accessory RHA",[205,175,30,90],"var");
    if (k==="rlha") s += line("replaced LHA",[150,40,120,35],"var");
    if (k==="alha") s += line("accessory LHA",[160,55,110,20],"var");
    $(host,"[data-s]").innerHTML = s; $(host,"[data-v]").className="verdict"; $(host,"[data-v]").textContent = T[k]; };
  $$(host,"[data-k]").forEach(b=>b.onclick=()=>show(b.dataset.k)); show("normal");
};

W.pelvic = host=>{
  host.innerHTML = frame("Internal iliac divisions", `<div class="row"><label class="chk"><input type="checkbox" data-cm> Corona mortis variant</label><span class="muted">Hover or tap a branch</span></div>
   <svg viewBox="0 0 440 330" class="pelsvg" data-s></svg><div class="verdict" data-v>Anterior division = viscera (blue). Posterior division = muscles (orange).</div><div class="row"><a class="btn sm ghost" href="#/explorer?v=riia">Open in 3D</a></div>`);
  const B = [["cia","Common iliac",[220,10,180,80],"m","From the aortic bifurcation."],["eia","External iliac",[180,80,330,250],"m","Inferior epigastric + deep circumflex iliac; becomes the CFA."],["iia","Internal iliac",[180,80,140,140],"m","Splits into anterior and posterior divisions."],
   ["pd","Posterior division",[140,140,60,150],"p","Pelvic and gluteal muscles."],["il","Iliolumbar",[95,146,60,90],"p","Anastomoses with the deep circumflex iliac (external iliac)."],["ls","Lateral sacral",[80,148,70,220],"p","Posterior division."],["sg","Superior gluteal",[60,150,10,170],"p","Largest posterior branch."],
   ["ad","Anterior division",[140,140,150,210],"a","Most pelvic viscera."],["ig","Inferior gluteal",[150,210,90,290],"a","Anterior division."],["ob","Obturator",[148,190,220,250],"a","Anterior division (standard)."],["ip","Internal pudendal",[150,210,170,310],"a","Anterior division; trauma bleeding source in the book's case."],["ut","Uterine / prostatic / vesical / rectal",[148,175,250,190],"a","Variable origins; identify by territory on selective runs."],
   ["ie","Inferior epigastric",[300,215,330,120],"m","Pathway of Winslow; mark before paracentesis."]];
  const draw = ()=>{ const cm = $(host,"[data-cm]").checked; $(host,"[data-s]").innerHTML = B.filter(b=>!(cm && b[0]==="ob")).map(b=>`<g class="pb ${b[3]}" data-i="${b[0]}"><line x1="${b[2][0]}" y1="${b[2][1]}" x2="${b[2][2]}" y2="${b[2][3]}"/><text x="${b[2][2]+4}" y="${b[2][3]+4}">${b[1]}</text></g>`).join("") + (cm?`<g class="pb var" data-i="cm"><line x1="300" y1="225" x2="220" y2="250"/><text x="200" y="270">obturator from EIA = corona mortis</text></g>`:"");
    $$(host,".pb").forEach(g=>{ const f = ()=>{ const b = B.find(x=>x[0]===g.dataset.i); $(host,"[data-v]").textContent = b ? `${b[1]}: ${b[4]}` : "Corona mortis (\"crown of death\"): obturator artery arising from the external iliac. Matters in pelvic trauma and procedural planning."; }; g.onmouseenter = f; g.onclick = f; }); };
  $(host,"[data-cm]").onchange = draw; draw();
};
})();
