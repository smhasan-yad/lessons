/* Interactive widgets, part 2: arterial, venous, lymphatic, hepatobiliary, oncologic, GU, lines. */
(function(){
const W = window.IRW, {frame, stepper, drill, $, $$} = W._h;

/* ---------------- ARTERIAL ---------------- */
W.giflow = host=>{
  host.innerHTML = frame("GI bleed pathway", `<div class="grid3"><label>Site<select data-s><option value="u">Upper (above ligament of Treitz)</option><option value="l">Lower</option></select></label>
   <label>Hemodynamics<select data-h><option value="s">Stable</option><option value="u">Unstable, actively bleeding</option></select></label>
   <label>Endoscopy result<select data-e><option value="fail">Failed / not possible</option><option value="ok">Hemostasis achieved</option></select></label></div>
   <ol class="flow" data-f></ol>
   <h5>Smallest detectable bleeding rate</h5><div class="rates">${[["Tagged RBC scan",0.2,"0.2–0.4 mL/min"],["CT angiography",0.35,"≈0.35 mL/min"],["Catheter angiography",0.5,"0.5–1.0 mL/min"]].map(r=>`<div class="rate"><span>${r[0]}</span><div class="bar"><i style="width:${r[1]*90}%"></i></div><b>${r[2]}</b></div>`).join("")}</div><p class="muted">Lower bar = more sensitive.</p>`);
  const up = ()=>{ const s = $(host,"[data-s]").value, h = $(host,"[data-h]").value, e = $(host,"[data-e]").value; let st = [];
    $(host,"[data-e]").parentElement.style.display = s==="u" ? "" : "none";
    if (s==="u") { st.push("Endoscopy first: diagnostic and therapeutic.");
      if (e==="ok") st.push("Done: no IR needed unless rebleeding.");
      else st.push("Embolize if a bleed is seen on CTA or endoscopy.", "Negative angiogram? Empiric embolization of the left gastric or GDA is acceptable (rich celiac–SMA collaterals)."); }
    else { if (h==="s") st.push("Localize first: mesenteric CTA (rapid, available) or tagged RBC scan; both more sensitive than angiography.", "Positive → angiography and superselective coil embolization of the bleeding branch.");
      else st.push("Unstable with active bleeding → straight to angiography.");
      st.push("Do NOT embolize empirically in the lower GI tract: poor collaterals, bowel infarction.", "Bleeder unreachable (e.g., antimesenteric)? Intra-arterial vasopressin 0.2–0.4 U/min ≤24 h (rebleeds after stopping; complications up to 20%).", "Diverticulosis is the commonest cause in older adults; angiodysplasia (cecum/ascending colon; Heyde syndrome)."); }
    $(host,"[data-f]").innerHTML = st.map(x=>`<li>${x}</li>`).join(""); };
  $$(host,"select").forEach(x=>x.onchange=up); up();
};

W.endoleak = host=>{
  const T = {IA:["Type IA","Proximal attachment seal failure.","Prompt treatment: balloon the attachment site, extra bare-metal stent, or embolize.","bad"],
   IB:["Type IB","Distal (iliac) attachment seal failure.","Prompt treatment, as for IA.","bad"],
   II:["Type II","Retrograde sac filling from branch vessels (IMA, lumbars). MOST COMMON.","Often slow and self-thromboses. Treat if persistent or sac grows >5 mm: transarterial or direct sac puncture, embolize the feeder.","warn"],
   III:["Type III","Loss of device integrity (fabric tear or junction separation).","Prompt: new stent-graft over the defect, then angioplasty.","bad"],
   IV:["Type IV","Graft porosity (covered in the Vascular chapter).","Not an IR target in this chapter.","muted"], V:["Type V","Endotension: sac grows without a visible leak (Vascular chapter).","Not an IR target in this chapter.","muted"]};
  host.innerHTML = frame("Endoleak explorer", `<div class="row">${Object.keys(T).map(k=>`<button class="btn sm ghost" data-k="${k}">${k}</button>`).join("")}</div>
   <svg viewBox="0 0 360 330" class="evarsvg" data-s></svg><div class="verdict" data-v></div>`);
  const show = k=>{ $$(host,"[data-k]").forEach(b=>b.classList.toggle("on",b.dataset.k===k));
    const leak = {IA:`<path class="leak" d="M150 70 C120 90 110 110 118 140"/>`, IB:`<path class="leak" d="M128 270 C110 240 108 220 116 200"/>`, II:`<path class="leak" d="M290 150 C250 160 230 160 222 165"/><path class="leak" d="M60 200 C90 195 110 190 125 185"/><text x="250" y="140">IMA</text><text x="20" y="216">lumbar</text>`, III:`<path class="leak" d="M180 160 C200 165 210 170 214 180"/>`, IV:`<g class="leak dots">${[0,1,2,3,4,5].map(i=>`<circle cx="${165+i*7}" cy="${130+i*12}" r="2.5"/>`).join("")}</g>`, V:``}[k];
    $(host,"[data-s]").innerHTML = `<path class="sac ${k==="V"?"grow":""}" d="M150 70 C90 110 90 230 135 270 L225 270 C270 230 270 110 210 70Z"/>
     <path class="graft" d="M160 20 V120 C160 170 150 220 140 300 M200 20 V120 C200 170 210 220 220 300 M168 20 V122 C168 170 162 220 154 300 M192 20 V122 C192 170 198 220 206 300"/>
     <text x="215" y="40" class="muted">stent-graft</text><text x="230" y="250" class="muted">excluded sac</text>${leak}`;
    const t = T[k], v = $(host,"[data-v]"); v.className = "verdict "+t[3]; v.innerHTML = `<b>${t[0]}:</b> ${t[1]} <br>${t[2]}`; };
  $$(host,"[data-k]").forEach(b=>b.onclick=()=>show(b.dataset.k)); show("II");
};

W.tasc = host=>{
  host.innerHTML = frame("TASC-II femoropopliteal classifier", `<div class="grid3"><label>Lesions<select data-n><option value="1">Single</option><option value="m">Multiple</option></select></label>
   <label>Type<select data-t><option value="s">Stenosis</option><option value="o">Occlusion</option><option value="cto">Chronic total occlusion</option></select></label>
   <label>Longest lesion (cm) <input type="number" value="8" data-l></label></div><div class="verdict" data-v></div>`, "From the chapter's TASC-II summary: A single stenosis ≤10 cm; B multiple lesions each <5 cm or single <15 cm; C multiple stenoses or occlusions >15 cm; D chronic total occlusion. A single lesion ≥15 cm is not classified in the chapter, so it falls to C here.");
  const up = ()=>{ const n = $(host,"[data-n]").value, t = $(host,"[data-t]").value, l = +$(host,"[data-l]").value; let c, r;
    if (t==="cto") { c="D"; r="Surgery is the treatment of choice."; }
    else if (n==="1" && t==="s" && l<=10) { c="A"; r="Endovascular treatment of choice."; }
    else if ((n==="m" && l<5) || (n==="1" && l<15)) { c="B"; r="Endovascular preferred (depending on comorbidities and preference)."; }
    else { c="C"; r="Surgery preferred (depending on comorbidities and preference)."; }
    const v = $(host,"[data-v]"); v.className = "verdict "+(c<"C"?"ok":"warn"); v.innerHTML = `<b>TASC ${c}:</b> ${r}`; };
  $$(host,"select,input").forEach(x=>x.oninput=up); up();
};

W.tpa = host=>{
  host.innerHTML = frame("Intra-arterial tPA infusion monitor", `<div class="grid3"><label>Fibrinogen (mg/dL) <input type="range" min="60" max="400" value="250" data-f><output data-fo></output></label>
   <label>Hours infused <input type="range" min="0" max="72" value="24" data-h><output data-ho></output></label><div></div></div><div class="verdict" data-v></div>`, "Protocol from the chapter: tPA 0.5 mg/h for 48–72 h via a multi-sidehole catheter, ICU, serial hematocrit and fibrinogen.");
  const up = ()=>{ const f = +$(host,"[data-f]").value, h = +$(host,"[data-h]").value; $(host,"[data-fo]").textContent = f; $(host,"[data-ho]").textContent = h+" h";
    const v = $(host,"[data-v]"); const dose = `Cumulative dose ${(h*0.5).toFixed(1)} mg.`;
    if (f<100) { v.className="verdict bad"; v.textContent = "Fibrinogen <100 mg/dL: STOP the infusion. "+dose; }
    else if (f<150) { v.className="verdict warn"; v.textContent = "Fibrinogen <150 mg/dL: SLOW the infusion. "+dose; }
    else { v.className="verdict ok"; v.textContent = "Continue at 0.5 mg/h with ICU monitoring. "+dose+(h>72?" Beyond the usual 48–72 h window.":""); } };
  $$(host,"input").forEach(x=>x.oninput=up); up();
};

/* ---------------- VENOUS ---------------- */
W.compress = host=>{
  const S = {
   nut:{t:"Nutcracker", svg:(sq)=>`<rect x="80" y="40" width="40" height="250" rx="18" class="aorta"/><text x="62" y="30">aorta</text><path class="art" d="M118 80 C${sq?150:170} 110 ${sq?150:190} 160 200 300" style="stroke-width:16"/><text x="200" y="300">SMA</text><path class="vein" d="M330 150 C260 150 ${sq?160:180} ${sq?150:150} 130 150 C110 150 70 150 30 150" style="stroke-width:${sq?6:16}"/><path class="vein" d="M330 150 C${sq?300:330} 150 300 150 280 150" style="stroke-width:24"/><text x="250" y="130">left renal vein</text><text x="10" y="140">IVC→</text>`, d:"Left renal vein compressed between the aorta and SMA. Hematuria, pain, orthostatic proteinuria, pelvic congestion, varicocele. Usually observe (hematuria often resolves within 2 years); else renal vein stent or LRV transposition.", v:"lrv"},
   mt:{t:"May-Thurner", svg:(sq)=>`<path class="art" d="M200 20 L130 300" style="stroke-width:20"/><text x="140" y="40">right common iliac artery</text><path class="vein" d="M330 230 C250 200 ${sq?200:200} 170 120 150 L60 140" style="stroke-width:${sq?8:20}"/><text x="230" y="250">left common iliac vein</text><path class="vein" d="M60 140 L40 20" style="stroke-width:26"/><text x="10" y="16">IVC</text>${sq?`<g class="clot"><ellipse cx="270" cy="212" rx="40" ry="10"/></g><text x="270" y="190" class="badtxt">DVT</text>`:""}`, d:"Left common iliac vein compressed by the crossing right common iliac artery → spur, intimal proliferation, DVT. Both sexes. Venography + IVUS. Lysis then self-expanding stent. Up to half of DVT patients get post-thrombotic syndrome.", v:"lciv"},
   ps:{t:"Paget-Schroetter", svg:(sq)=>`<path class="bonep" d="M20 ${sq?120:80} C120 ${sq?130:70} 220 ${sq?130:70} 330 ${sq?110:60}" style="stroke-width:22"/><text x="20" y="${sq?105:62}">clavicle</text><path class="bonep" d="M60 230 C150 170 250 170 330 220" style="stroke-width:18"/><text x="40" y="260">first rib</text><path class="vein" d="M10 160 C120 160 ${sq?200:200} ${sq?160:160} 330 165" style="stroke-width:${sq?6:16}"/><text x="230" y="150">subclavian vein</text>${sq?`<ellipse cx="170" cy="160" rx="50" ry="8" class="clot"/>`:""}`, d:"Muscular young men; arm swelling worse with effort. Venography neutral AND abducted, both sides. Thrombolysis, then surgical thoracic outlet decompression. Angioplasty only after decompression (or if no mechanical cause). Avoid stents.", v:"rsubv"}};
  host.innerHTML = frame("Venous compression syndromes", `<div class="row">${Object.entries(S).map(([k,s])=>`<button class="btn sm ghost" data-k="${k}">${s.t}</button>`).join("")}<span class="sp"></span><button class="btn sm" data-sq>Compress</button></div><svg viewBox="0 0 350 320" class="cmpsvg" data-s></svg><div class="verdict" data-v></div><div class="row"><a class="btn sm ghost" data-3d href="#">See it in 3D</a></div>`);
  let k = "nut", sq = false;
  const show = ()=>{ $$(host,"[data-k]").forEach(b=>b.classList.toggle("on",b.dataset.k===k)); $(host,"[data-s]").innerHTML = S[k].svg(sq); $(host,"[data-v]").innerHTML = `<b>${S[k].t}:</b> ${S[k].d}`; $(host,"[data-3d]").href = "#/explorer?v="+S[k].v; $(host,"[data-sq]").textContent = sq?"Release":(k==="ps"?"Abduct arm":"Compress"); };
  $$(host,"[data-k]").forEach(b=>b.onclick=()=>{ k = b.dataset.k; sq=false; show(); });
  $(host,"[data-sq]").onclick = ()=>{ sq=!sq; show(); }; show();
};

W.ivcfilter = host=>{
  const CASES = {
   normal:{t:"Normal anatomy, IVC 22 mm", d:22, lrv:150, rrv:140, ok:[160,200], note:"Tip just below the lowest renal vein (here the left)."},
   retro:{t:"Retroaortic left renal vein, joins low", d:22, lrv:205, rrv:140, ok:[215,250], note:"The retroaortic LRV enters lower than the right. Place the filter below IT, not below the right renal vein."},
   circ:{t:"Circumaortic left renal vein", d:22, lrv:150, lrv2:200, rrv:140, ok:[210,248], note:"Two left renal limbs: stay below the lower (retroaortic) limb so it cannot act as a conduit around the filter."},
   thromb:{t:"Thrombus in the infrarenal IVC up to 210", d:22, lrv:150, rrv:140, thr:210, ok:[95,135], note:"Pre-existing IVC thrombus may force a higher (suprarenal) position."},
   mega:{t:"Megacava, IVC 33 mm", d:33, lrv:150, rrv:140, ok:null, note:"Most filters fit <28–30 mm. Use a Bird's Nest (≤40 mm, permanent) or put a retrievable filter in each common iliac vein."},
   dup:{t:"Duplicated IVC", d:22, lrv:150, rrv:140, dup:true, ok:[95,135], note:"Place one filter above the confluence (left IVC joins at the left renal vein) or a filter in each IVC. Clue on cavography: no inflow from the contralateral iliac."}};
  host.innerHTML = frame("IVC filter placement", `<select data-c>${Object.entries(CASES).map(([k,c])=>`<option value="${k}">${c.t}</option>`).join("")}</select>
   <div class="ivcwrap"><svg viewBox="0 0 300 380" class="ivcsvg" data-s></svg><div><label>Filter tip position<input type="range" min="80" max="300" value="250" data-p orient="vertical" class="vrange"></label></div></div>
   <div class="row"><button class="btn sm" data-chk>Deploy</button><span class="muted">Cavogram first: pigtail, 20 cc/s for 30 cc.</span></div><div class="verdict" data-v></div>`);
  const draw = ()=>{ const c = CASES[$(host,"[data-c]").value], y = +$(host,"[data-p]").value, w = c.d*2.2;
    let s = `<rect x="${130-w/2}" y="20" width="${w}" height="${c.dup?240:300}" rx="${w/2}" class="ivc"/><rect x="165" y="20" width="22" height="320" rx="11" class="aorta"/><text x="190" y="14" class="muted">aorta</text><text x="${105-w/2}" y="14" class="muted">IVC ${c.d} mm</text>`;
    s += `<path class="vein" d="M${130-w/2} ${c.rrv} H20" style="stroke-width:12"/><text x="18" y="${c.rrv-10}">R renal v.</text>`;
    s += c.lrv2||c.lrv>180 ? `<path class="vein" d="M${130+w/2} ${c.lrv} C160 ${c.lrv} 160 ${c.lrv} 210 ${c.lrv-6} H290" style="stroke-width:11" opacity="${c.lrv>180?0.8:1}"/><text x="210" y="${c.lrv-12}">${c.lrv>180?"retroaortic LRV":"pre-aortic LRV"}</text>` : `<path class="vein" d="M${130+w/2} ${c.lrv} H290" style="stroke-width:11"/><text x="220" y="${c.lrv-10}">L renal v.</text>`;
    if (c.lrv2) s += `<path class="vein dashed" d="M${130+w/2} ${c.lrv2} H290" style="stroke-width:10"/><text x="210" y="${c.lrv2+20}">retroaortic limb</text>`;
    if (c.thr) s += `<rect x="${132-w/2}" y="${c.thr}" width="${w-4}" height="${320-c.thr}" class="clot" rx="8"/>`;
    if (c.dup) s += `<path class="vein" d="M${130-w/2+4} 260 C80 300 70 330 60 370" style="stroke-width:${w*0.7}"/><path class="vein" d="M250 ${c.lrv} C250 220 250 300 230 370" style="stroke-width:${w*0.7}"/><text x="240" y="300">left IVC</text>`;
    else s += `<path class="vein" d="M${130-w/2+4} 316 L80 370" style="stroke-width:16"/><path class="vein" d="M${130+w/2-4} 316 L180 370" style="stroke-width:16"/>`;
    s += `<g class="filter" transform="translate(130,${y})"><line x1="0" y1="0" x2="0" y2="8"/>${[-1,-0.5,0.5,1].map(k=>`<line x1="0" y1="0" x2="${k*w*0.45}" y2="46"/>`).join("")}<circle r="3" class="tipdot"/></g>`;
    $(host,"[data-s]").innerHTML = s; return c; };
  $(host,"[data-c]").onchange = ()=>{ $(host,"[data-v]").textContent=""; draw(); }; $(host,"[data-p]").oninput = draw;
  $(host,"[data-chk]").onclick = ()=>{ const c = draw(), y = +$(host,"[data-p]").value, v = $(host,"[data-v]");
    if (!c.ok) { v.className="verdict bad"; v.innerHTML = "This filter will not appose a 33 mm cava. "+c.note; return; }
    const good = y>=c.ok[0] && y<=c.ok[1]; v.className = "verdict "+(good?"ok":"bad");
    v.innerHTML = (good?"Good position. ":(y<c.ok[0]?"Too high. ":"Too low. "))+c.note; if (window.IRStudy) IRStudy.logQuiz("ivc", good); };
  draw();
};

/* ---------------- LYMPH ---------------- */
W.lymph = host=>{
  const P = [["thoracic duct","Carries 1–2 L/day, mostly intestinal and hepatic lymph; ends at the left venous angle.",[150,60,150,260]],["cisterna chyli","Sac at L1–L3, right of the aorta; punctured for TDE.",[150,260,150,300]],["left lumbar trunk","Drains leg and pelvis.",[150,300,190,370]],["right lumbar trunk","Drains leg and pelvis.",[150,300,110,370]],["left jugular / subclavian trunks","Join at the left venous angle.",[150,60,210,40]],["right lymphatic duct","Drains right head, neck, arm and chest into the right venous angle.",[90,60,70,40]]];
  host.innerHTML = frame("Lymphatic map", `<svg viewBox="0 0 300 390" class="lysvg">${P.map((p,i)=>`<g class="ly" data-i="${i}"><line x1="${p[2][0]}" y1="${p[2][1]}" x2="${p[2][2]}" y2="${p[2][3]}"/><text x="${Math.max(p[2][2],p[2][0])+8}" y="${(p[2][1]+p[2][3])/2}">${p[0]}</text></g>`).join("")}<ellipse cx="150" cy="280" rx="12" ry="24" class="cist"/><text x="10" y="290" class="muted">L1–L3</text><text x="10" y="70" class="muted">venous angles</text></svg><div class="verdict" data-v>Tap a structure.</div><div class="row"><a class="btn sm ghost" href="#/explorer?v=tduct">Open in 3D</a></div>`);
  $$(host,".ly").forEach(g=>g.onclick = g.onmouseenter = ()=>{ const p = P[+g.dataset.i]; $(host,"[data-v]").innerHTML = `<b>${p[0]}:</b> ${p[1]} High hepatic sinusoidal pressure (cirrhosis, right heart failure) raises duct flow a lot.`; });
};
const mini = (body)=>`<svg viewBox="0 0 260 200" class="minisvg">${body}</svg>`;
W.tdesteps = host=>stepper(host, "Thoracic duct embolization, step by step", [
 {t:"Conservative first", d:"Non-fat diet for 2–3 days. Consent for pancreatitis, nontarget embolization, and rare long-term edema, diarrhea, ascites.", svg:mini(`<rect x="70" y="40" width="120" height="120" rx="20" class="organ"/><text x="130" y="105" text-anchor="middle">No fat 2–3 d</text>`)},
 {t:"Intranodal lymphangiography", d:"5 mL lipiodol into an inguinal node in each leg, then a 20 mL saline push. Follow the lipiodol up the pelvis.", svg:mini(`<circle cx="80" cy="170" r="10" class="node"/><circle cx="180" cy="170" r="10" class="node"/><path class="lyp" d="M80 170 C90 120 120 110 130 80 M180 170 C170 120 140 110 130 80"/>`)},
 {t:"Find the cisterna chyli", d:"Opacifies at L1–L3.", svg:mini(`<ellipse cx="130" cy="110" rx="14" ry="30" class="cist"/><path class="lyp" d="M130 80 V10"/><text x="160" y="115">L1–L3</text>`)},
 {t:"Direct puncture", d:"Long 21 G trocar (spinal) needle transabdominally into the cisterna; wire (e.g., V18) up into the thoracic duct; inner cannula over the wire.", svg:mini(`<ellipse cx="130" cy="110" rx="14" ry="30" class="cist"/><line x1="40" y1="190" x2="125" y2="115" class="needle"/><path class="wireln" d="M128 110 V10"/>`)},
 {t:"Find the leak", d:"Lymphangiogram of the chest shows pooling at the leak (T8–9 in the book's case).", svg:mini(`<path class="lyp" d="M130 190 V20"/><ellipse cx="150" cy="80" rx="22" ry="14" class="leakfill"/><text x="176" y="84">leak</text>`)},
 {t:"Coil and glue", d:"Coil the duct along its length as a scaffold, then n-BCA glue 1:1 with lipiodol. Watch the glue: if the IVC was crossed it can embolize to the pulmonary arteries.", svg:mini(`<path class="lyp" d="M130 190 V20"/><path class="coilp" d="M120 70 q5 -6 10 0 q5 6 10 0 q-5 -6 -10 0 q-5 6 -10 0 M120 100 q5 -6 10 0 q5 6 10 0"/><rect x="124" y="110" width="12" height="60" class="glue"/>`)}]);

/* ---------------- HEPATOBILIARY ---------------- */
W.ptcsteps = host=>stepper(host, "Right-sided biliary drainage (PTC → drain)", [
 {t:"Prepare", d:"MRCP to plan. Gram-negative antibiotic (e.g., levofloxacin) before the procedure.", svg:mini(`<path class="liver" d="M20 60 C60 20 200 20 240 70 C230 140 120 170 40 140Z"/><path class="duct" d="M130 140 L130 100 L90 70 M130 100 L170 70 M110 85 L80 95 M150 85 L190 95"/>`)},
 {t:"First needle: find a duct", d:"Right midaxillary line, needle OVER the rib (bundle runs under each rib). 22 G Chiba, parallel to the table toward the liver edge. Inject while withdrawing until a duct fills.", svg:mini(`<path class="liver" d="M20 60 C60 20 200 20 240 70 C230 140 120 170 40 140Z"/><path class="duct" d="M130 140 L130 100 L90 70 M130 100 L170 70"/><line x1="250" y1="100" x2="140" y2="96" class="needle"/>`)},
 {t:"Second needle, low and peripheral", d:"Leave the first needle as a roadmap. Puncture a peripheral duct as low as possible with a 21 G needle; 0.018″ wire into the ducts.", svg:mini(`<path class="liver" d="M20 60 C60 20 200 20 240 70 C230 140 120 170 40 140Z"/><path class="duct" d="M130 140 L130 100 L90 70 M130 100 L170 70 M150 85 L195 100"/><line x1="250" y1="112" x2="196" y2="101" class="needle"/>`)},
 {t:"Upsize and cross", d:"Exchange for a 5–6 Fr sheath (transitional dilator); angled catheter + hydrophilic wire (Roadrunner/Glidewire) across the obstruction into the small bowel.", svg:mini(`<path class="liver" d="M20 60 C60 20 200 20 240 70 C230 140 120 170 40 140Z"/><path class="duct" d="M130 140 L130 100 L170 70 M150 85 L195 100"/><path class="wireln" d="M250 112 L196 101 L150 85 L130 100 L130 180 C130 195 160 195 180 190"/>`)},
 {t:"Stiff wire and drain", d:"Exchange for a stiff wire (Amplatz), dilate, place an internal/external drain with sideholes spanning duct to bowel (cut extras if needed). Never aspirate the drain. Routine change every 3 months.", svg:mini(`<path class="liver" d="M20 60 C60 20 200 20 240 70 C230 140 120 170 40 140Z"/><path class="drain" d="M250 112 L196 101 L150 85 L130 100 L130 180 C130 195 160 195 175 185 C185 178 175 170 168 178"/>`)}]);

W.chole = host=>{
  host.innerHTML = frame("Cholecystostomy: which route?", `<div class="row"><button class="btn sm ghost" data-k="th">Transhepatic</button><button class="btn sm ghost" data-k="tp">Transperitoneal</button></div>
   <svg viewBox="0 0 320 220" class="cholesvg" data-s></svg><div class="verdict" data-v></div>`);
  const show = k=>{ $$(host,"[data-k]").forEach(b=>b.classList.toggle("on",b.dataset.k===k));
    $(host,"[data-s]").innerHTML = `<path class="liver" d="M20 40 C80 10 260 10 300 60 C290 110 200 130 60 120Z"/><ellipse cx="170" cy="138" rx="45" ry="24" class="gb"/><text x="150" y="176" class="muted">gallbladder (fundus lowest)</text><text x="230" y="40" class="muted">liver</text><text x="200" y="118" class="muted">bare area</text>
    ${k==="th"?`<line x1="310" y1="80" x2="185" y2="128" class="needle"/><text x="230" y="70">midaxillary, through liver</text>`:`<line x1="230" y1="215" x2="190" y2="150" class="needle"/><text x="236" y="210">subcostal, under liver edge</text>`}`;
    const v = $(host,"[data-v]"); v.className="verdict"; v.innerHTML = k==="th" ? "<b>Transhepatic (more common):</b> through liver into the bare area. Less peritoneal bile leak; more risk of liver laceration." : "<b>Transperitoneal:</b> avoids the liver but enters the mobile fundus. More bile leak and incomplete tract formation → bile peritonitis after removal.";
    v.innerHTML += "<br><b>Remove only when:</b> clinically better; cystic and common ducts patent on cholangiogram; at least 6 weeks (either route)."; };
  $$(host,"[data-k]").forEach(b=>b.onclick=()=>show(b.dataset.k)); show("th");
};

W.hvpg = host=>{
  host.innerHTML = frame("Portal pressure calculator", `<div class="grid3"><label>Wedged hepatic vein pressure (mmHg) <input type="number" value="28" data-w></label><label>Free hepatic vein pressure (mmHg) <input type="number" value="10" data-f></label><label>After TIPS: portosystemic gradient <input type="number" value="" placeholder="optional" data-t></label></div><div class="gauge" data-g></div><div class="verdict" data-v></div>`);
  const up = ()=>{ const w = +$(host,"[data-w]").value, f = +$(host,"[data-f]").value, g = w-f, t = $(host,"[data-t]").value;
    $(host,"[data-g]").innerHTML = `<div class="gbar"><i style="left:${Math.min(100,g/30*100)}%"></i><span style="left:${5/30*100}%">5</span><span style="left:${12/30*100}%">12</span></div>`;
    const v = $(host,"[data-v]"); let s = `Corrected sinusoidal gradient = ${w} − ${f} = <b>${g} mmHg</b>. ` + (g>5 ? "Portal hypertension (>5 mmHg)." : "Normal (≤5 mmHg).");
    if (t!=="") s += +t<12 ? ` Post-TIPS gradient ${t} mmHg: target (<12) reached.` : ` Post-TIPS gradient ${t} mmHg: dilate the stent-graft further (target <12).`;
    v.className = "verdict "+(g>5?"warn":"ok"); v.innerHTML = s; };
  $$(host,"input").forEach(x=>x.oninput=up); up();
};

W.collaterals = host=>{
  const C = [["Esophageal varices","coronary (left gastric) vein → azygos / hemiazygos",[150,150,150,40]],["Gastric fundal varices","book: splenic vein → azygos; usually drain via a gastrorenal shunt to the left renal vein",[220,160,200,60]],["Splenorenal / gastrorenal shunt","splenic or short gastric → left adrenal / inferior phrenic → left renal vein (BRTO route)",[260,170,270,250]],["Caput medusae","paraumbilical (umbilical) vein → epigastric veins",[110,190,60,270]],["Mesenteric varices","SMV / IMV → iliac veins",[150,230,190,330]],["Hemorrhoids","IMV → inferior hemorrhoidal veins",[180,250,180,370]]];
  host.innerHTML = frame("Portosystemic collaterals", `<svg viewBox="0 0 340 390" class="colsvg"><path class="portalv" d="M80 160 L150 170 L260 170 M150 170 L150 260 M180 170 L180 270"/><text x="40" y="150">liver</text><ellipse cx="70" cy="140" rx="55" ry="35" class="organ"/><text x="270" y="160">spleen</text><circle cx="290" cy="170" r="18" class="organ"/>
   ${C.map((c,i)=>`<g class="col" data-i="${i}"><path d="M${c[2][0]} ${c[2][1]} C${c[2][0]+20} ${(c[2][1]+c[2][3])/2} ${c[2][2]-20} ${(c[2][1]+c[2][3])/2} ${c[2][2]} ${c[2][3]}"/><circle cx="${c[2][2]}" cy="${c[2][3]}" r="6"/></g>`).join("")}
   <text x="10" y="380" class="muted">purple: portal, blue: systemic</text></svg><div class="verdict" data-v>Tap a collateral.</div>`);
  $$(host,".col").forEach(g=>g.onclick = g.onmouseenter = ()=>{ const c = C[+g.dataset.i]; $$(host,".col").forEach(x=>x.classList.remove("on")); g.classList.add("on"); $(host,"[data-v]").innerHTML = `<b>${c[0]}:</b> ${c[1]}`; });
};

const liv = `<path class="liver" d="M20 50 C80 10 240 15 255 60 C250 130 160 175 40 150Z"/>`;
const hv = `<path class="vein" d="M130 0 V40 L190 70" style="stroke-width:10"/>`, pvp = `<path class="portalv" d="M150 200 L120 150 L170 115" style="stroke-width:11"/>`;
W.tips = host=>stepper(host, "TIPS, step by step", [
 {t:"Right hepatic venography", d:"Right internal jugular access → SVC → right atrium → IVC → right hepatic vein. Confirm portal vein patency on prior imaging. Absolute contraindications: right heart failure, severe hepatic failure, severe encephalopathy.", svg:mini(liv+hv+pvp+`<path class="wireln" d="M130 0 V40 L185 68"/>`)},
 {t:"Wedged CO₂ portography", d:"Wedge an occlusion balloon in a distal hepatic vein and inject CO₂: 400× less viscous than iodinated contrast, so it crosses the sinusoids and outlines the portal vein. Measure wedged and free pressures.", svg:mini(liv+hv+pvp+`<circle cx="186" cy="68" r="7" class="bal"/><path class="co2" d="M186 72 C180 95 170 105 168 115 M186 72 C160 100 130 130 122 150"/>`)},
 {t:"Puncture the portal vein", d:"The hardest step: a curved needle from the right hepatic vein through liver parenchyma into the right portal vein, guided by the CO₂ map.", svg:mini(liv+hv+pvp+`<path class="needle" d="M175 62 C175 90 170 105 165 117"/>`)},
 {t:"Dilate the tract", d:"Wire into the main portal vein; dilate the parenchymal tract with an 8 mm × 3–4 cm balloon.", svg:mini(liv+hv+pvp+`<rect x="160" y="78" width="14" height="36" rx="6" class="bal"/>`)},
 {t:"Covered stent-graft", d:"Deploy a covered (usually self-expanding) stent-graft from portal vein to hepatic vein. Dilate until the portal-to-IVC gradient is <12 mmHg.", svg:mini(liv+hv+pvp+`<path class="stentg" d="M140 140 C150 120 165 95 182 66" />`)},
 {t:"Completion portogram", d:"Contrast flows portal vein → shunt → hepatic vein → IVC. Embolize any varices that still fill. Follow patency with Doppler US. Risks: hepatic failure, encephalopathy, death.", svg:mini(liv+hv+pvp+`<path class="stentg" d="M140 140 C150 120 165 95 182 66"/><path class="flow" d="M120 160 C140 130 160 100 185 66 L135 30"/>`)}]);

W.brto = host=>stepper(host, "BRTO, step by step", [
 {t:"Is there a shunt?", d:"BRTO needs a spontaneous gastrorenal (or gastrocaval) shunt. No shunt, no BRTO. In the US/Europe it is used when endoscopy fails and TIPS is not an option.", svg:mini(`<ellipse cx="80" cy="60" rx="50" ry="35" class="organ"/><text x="50" y="64">stomach</text><circle cx="95" cy="80" r="10" class="varix"/><path class="vein" d="M100 88 C130 120 160 140 200 150" style="stroke-width:8"/><path class="vein" d="M200 150 H260 M200 150 H140" style="stroke-width:14"/><text x="190" y="175">left renal vein</text>`)},
 {t:"Catheterize the shunt", d:"Femoral (usual) or jugular venous access → IVC → left renal vein → into the gastrorenal shunt.", svg:mini(`<circle cx="95" cy="80" r="10" class="varix"/><path class="vein" d="M100 88 C130 120 160 140 200 150" style="stroke-width:8"/><path class="vein" d="M140 150 H260" style="stroke-width:14"/><path class="wireln" d="M260 150 H205 C170 140 135 118 108 92"/>`)},
 {t:"Balloon occlusion + venogram", d:"Inflate a balloon at the shunt outflow and map the varices with a shunt venogram.", svg:mini(`<circle cx="95" cy="80" r="10" class="varix"/><path class="vein" d="M100 88 C130 120 160 140 200 150" style="stroke-width:8"/><path class="vein" d="M140 150 H260" style="stroke-width:14"/><ellipse cx="170" cy="134" rx="12" ry="8" class="bal"/>`)},
 {t:"Sclerosant, dwell 4–24 h", d:"Inject sclerosant upstream into the varices; leave the balloon 4–24 h until stasis. Variants use coils or plugs (e.g., PARTO) to shorten this.", svg:mini(`<circle cx="95" cy="80" r="12" class="varix scl"/><path class="vein scl" d="M100 88 C130 120 150 130 160 130" style="stroke-width:8"/><ellipse cx="170" cy="134" rx="12" ry="8" class="bal"/>`)},
 {t:"Physiology and complications", d:"Closing the shunt raises portal pressure: liver function and encephalopathy improve, but ascites and esophageal varices can worsen. Also hematuria, hydrothorax, SBP, portal vein thrombosis. Less rebleeding, encephalopathy and mortality than TIPS for gastric varices.", svg:mini(`<text x="20" y="60">Portal pressure ↑</text><text x="20" y="100" class="good">✓ liver function, encephalopathy</text><text x="20" y="140" class="badtxt">✗ ascites, esophageal varices</text>`)}]);

/* ---------------- ONCOLOGY ---------------- */
W.ablation = host=>{
  host.innerHTML = frame("Ablation zone simulator", `<div class="grid3">
   <label>Modality<select data-m><option value="rfa">Radiofrequency</option><option value="mwa">Microwave</option><option value="cryo">Cryoablation</option></select></label>
   <label>Tumor diameter (cm) <input type="range" min="1" max="6" step="0.5" value="2.5" data-t><output data-to></output></label>
   <label>Vessel distance from tumor edge (mm) <input type="range" min="0" max="20" value="4" data-vd><output data-vo></output></label>
   <label>Energy / time <input type="range" min="20" max="100" value="60" data-e><output data-eo></output></label>
   <label>Probes <input type="range" min="1" max="4" value="1" data-n><output data-no></output></label>
   <label class="chk"><input type="checkbox" data-live checked> Intra-procedural CT view</label></div>
   <canvas width="520" height="320" data-c class="ablcv"></canvas><div class="verdict" data-v></div>`, "Toy model for intuition, not dosimetry. Heat sink pulls the zone in on the vessel side: RFA most, MWA less.");
  const cv = $(host,"[data-c]"), g = cv.getContext("2d");
  const up = ()=>{ const m = $(host,"[data-m]").value, t = +$(host,"[data-t]").value, vd = +$(host,"[data-vd]").value, e = +$(host,"[data-e]").value, n = +$(host,"[data-n]").value, live = $(host,"[data-live]").checked;
    $(host,"[data-to]").textContent = t+" cm"; $(host,"[data-vo]").textContent = vd+" mm"; $(host,"[data-eo]").textContent = m==="rfa"?`${Math.round(6+e*0.09)} min`:m==="mwa"?`${Math.round(45+e*0.35)} W`:`${Math.round(5+e*0.15)} min × 2 cycles`; $(host,"[data-no]").textContent = n;
    const px = 30, cx = 230, cy = 160; // px per cm
    const base = {rfa:1.1, mwa:1.6, cryo:1.25}[m] * (0.5+e/100) * (1+ (n-1)*(m==="cryo"?0.35:m==="mwa"?0.3:0.25));
    const sinkK = {rfa:0.6, mwa:0.25, cryo:0.35}[m] * Math.max(0, 1 - vd/15);
    const vx = cx + (t/2)*px + vd/10*px + 10;
    g.fillStyle = "#1a1a1a"; g.fillRect(0,0,520,320);
    g.fillStyle = "#3a3a3a"; g.beginPath(); g.ellipse(cx,cy,220,150,0,0,Math.PI*2); g.fill();
    // vessel
    g.fillStyle = "#cfcfcf"; g.fillRect(vx-8, 0, 16, 320);
    // zone
    const R = base*px*(t/2.5*0.4+0.8); const zone = [];
    for (let a=0;a<Math.PI*2;a+=0.05){ const toward = Math.max(0, Math.cos(a)); let r = R*(1 - sinkK*toward*toward); const x = cx+Math.cos(a)*r; zone.push([Math.min(x, vx-9), cy+Math.sin(a)*r*0.92]); }
    const showZone = !live || m==="cryo";
    if (showZone){ g.fillStyle = m==="cryo" ? "rgba(20,20,20,0.85)" : "rgba(240,240,240,0.25)"; g.beginPath(); zone.forEach((p,i)=>i?g.lineTo(...p):g.moveTo(...p)); g.closePath(); g.fill(); g.strokeStyle = m==="cryo" ? "#7dd3fc" : "#fbbf24"; g.lineWidth = 2; g.stroke(); }
    // tumor
    g.fillStyle = "#8a8a8a"; g.beginPath(); g.arc(cx,cy,t/2*px,0,Math.PI*2); g.fill(); g.strokeStyle="#f87171"; g.setLineDash([4,4]); g.stroke(); g.setLineDash([]);
    // probes
    g.strokeStyle = "#fff"; g.lineWidth = m==="mwa"?4:2.5; for (let i=0;i<n;i++){ const off = (i-(n-1)/2)*px*1.4; g.beginPath(); g.moveTo(40, 30+off*0.2); g.lineTo(cx+off*0.3, cy+off); g.stroke(); }
    if (m==="rfa"){ g.fillStyle="#fbbf24"; g.fillRect(470,280,40,20); g.fillStyle="#000"; g.font="10px system-ui"; g.fillText("pad",478,294); }
    g.fillStyle="#ddd"; g.font="12px system-ui"; g.fillText("vessel", vx+12, 20); g.fillText(live && m!=="cryo" ? "Zone NOT visible during heating — imagine post-contrast CT" : (m==="cryo"?"Iceball visible in real time":"Post-ablation zone"), 12, 312);
    // margin check: min distance zone - tumor edge
    const minR = Math.min(...zone.map(p=>Math.hypot(p[0]-cx,(p[1]-cy)/0.92))); const marginMm = (minR - t/2*px)/px*10;
    const v = $(host,"[data-v]"); const need = 5; /* chapter: iceball ≥0.5 cm beyond tumor (cryo); 5 mm for heat ablation is common practice, not in the chapter */ const msgs = [];
    if (marginMm < 0) msgs.push(`<b class="badtxt">Residual tumor</b> on the vessel side (zone falls ${(-marginMm).toFixed(0)} mm short)${sinkK>0.2?": heat sink.":"."}`);
    else if (marginMm < need) msgs.push(`Covered, but the thinnest margin is only ${marginMm.toFixed(0)} mm${m==="cryo"?" (chapter: iceball should extend ≥5 mm beyond tumor)":" (5 mm is a common target for heat ablation; the chapter gives a margin only for cryo)"}.`);
    else msgs.push(`Complete coverage with ≥${marginMm.toFixed(0)} mm margin.`);
    if (t>5) msgs.push("Tumor >5 cm: local control outcomes fall; consider debulking/palliation goals.");
    if (m==="cryo" && n>1) msgs.push("Cryo probes 1–2 cm apart, frozen simultaneously. Large liver cryo volumes risk cryoshock.");
    if (m==="rfa" && e>85) msgs.push("Heating too fast chars tissue and makes microbubbles → impedance rises and the zone shrinks.");
    v.className = "verdict "+(marginMm<0?"bad":marginMm<need?"warn":"ok"); v.innerHTML = msgs.join(" ");
  };
  $$(host,"select,input").forEach(x=>x.oninput=up); up();
};

W.tace = host=>{
  const C = [["pvt","Portal vein thrombosis","tace"],["burden","Tumor burden >50%","tace"],["ehm","Extrahepatic metastases","tace"],["decomp","Decompensated cirrhosis (encephalopathy, tense ascites, Child-Pugh C)","tace"],["bili","Bilirubin >3 mg/dL","tace"],["preg","Pregnancy or breastfeeding","tare"],["gi","Uncorrectable GI reflux / shunt on MAA","tare"],["lung","Uncorrectable hepatopulmonary shunting","tare"]];
  host.innerHTML = frame("TACE or TARE? Eligibility checker", `<div class="cklist">${C.map(c=>`<label class="chk"><input type="checkbox" data-k="${c[0]}"> ${c[1]}</label>`).join("")}</div><div class="grid2"><div class="verdict" data-a></div><div class="verdict" data-b></div></div>`, "TACE contraindications are listed as 'common'; TARE contraindications as 'absolute' in the chapter.");
  const up = ()=>{ const on = C.filter(c=>$(host,`[data-k="${c[0]}"]`).checked); const ta = on.filter(c=>c[2]==="tace"), tr = on.filter(c=>c[2]==="tare");
    const a = $(host,"[data-a]"), b = $(host,"[data-b]");
    a.className = "verdict "+(ta.length?"bad":"ok"); a.innerHTML = `<b>TACE</b> (cTACE or DEB-TACE): ${ta.length?"contraindicated — "+ta.map(c=>c[1]).join("; "):"no listed contraindication. Expect post-embolization syndrome."}`;
    b.className = "verdict "+(tr.length?"bad":"ok"); b.innerHTML = `<b>TARE / Y-90</b>: ${tr.length?"contraindicated — "+tr.map(c=>c[1]).join("; "):"possible"+(on.some(c=>c[0]==="pvt")?" — works despite portal vein thrombosis (no macro-embolization).":".")+" Needs MAA mapping; no significant post-embolization syndrome."}`; };
  $$(host,"input").forEach(x=>x.onchange=up); up();
};

/* ---------------- GU ---------------- */
W.brodel = host=>{
  host.innerHTML = frame("Nephrostomy: find Brödel's line", `<svg viewBox="0 0 420 320" class="brsvg" data-s>
    <text x="10" y="20" class="muted">Axial, patient PRONE (posterior is up)</text><line x1="0" y1="40" x2="420" y2="40" class="skin"/><text x="360" y="34" class="muted">skin</text>
    <g transform="translate(220,170) rotate(-30)"><ellipse rx="110" ry="70" class="kid"/><path class="sinus" d="M-30 -10 C10 -40 50 -20 70 0 C50 20 10 40 -30 10Z"/>
     <ellipse cx="20" cy="-48" rx="16" ry="10" class="calyx"/><ellipse cx="60" cy="-40" rx="14" ry="9" class="calyx"/><ellipse cx="20" cy="48" rx="16" ry="10" class="calyx"/><ellipse cx="60" cy="40" rx="14" ry="9" class="calyx"/>
     <path class="artb" d="M110 0 C60 -10 20 -30 -60 -45"/><path class="artb" d="M110 0 C60 10 20 30 -60 60"/><line x1="-110" y1="-14" x2="20" y2="-4" class="brline"/></g>
    <text x="40" y="128" class="muted">posterior branches</text><text x="250" y="300" class="muted">anterior (ventral) branches</text><text x="20" y="160" class="brtxt">Brödel</text>
    <rect x="370" y="140" width="40" height="70" rx="10" class="spine"/><text x="372" y="230" class="muted">spine</text><g data-n></g></svg>
    <div class="verdict" data-v>Click a point on the skin line to choose your entry; the needle aims at the posterior calyx.</div>`);
  const svg = $(host,"[data-s]");
  svg.addEventListener("click", e=>{ const pt = svg.createSVGPoint(); pt.x=e.clientX; pt.y=e.clientY; const p = pt.matrixTransform(svg.getScreenCTM().inverse()); if (p.y>80) return;
    const tx = 220 + 20*Math.cos(-0.52) - (-48)*Math.sin(-0.52), ty = 170 + 20*Math.sin(-0.52) + (-48)*Math.cos(-0.52);
    $(svg,"[data-n]").innerHTML = `<line x1="${p.x}" y1="40" x2="${tx}" y2="${ty}" class="needle"/><circle cx="${p.x}" cy="40" r="5" class="mark"/>`;
    const v = $(host,"[data-v]"); let cls, msg;
    if (p.x > 330) { cls="bad"; msg = "Too medial/vertical: you cross the renal sinus and hilar vessels near the spine."; }
    else if (p.x < 60) { cls="bad"; msg = "Too lateral: risk of colon (retrorenal) and you enter anterior to Brödel's plane through ventral branches."; }
    else if (p.x <= 200) { cls="ok"; msg = "Posterolateral approach toward a posterior calyx along Brödel's relatively avascular plane, between ventral and dorsal arterial branches. 22 G needle, prone. Transient hematuria is expected; serious bleeding is rare."; }
    else { cls="warn"; msg = "Acceptable but steep: aim a little more lateral (posterolateral) so the tract runs along Brödel's plane into the calyx tip."; }
    v.className="verdict "+cls; v.textContent = msg; });
};

/* ---------------- LINES ---------------- */
W.dialysis = host=>{
  const F = [["Pulsatile, no thrill","Venous outflow obstruction"],["High recirculation at dialysis","Venous outflow stenosis"],["Weak pulse, poor thrill","Arterial inflow stenosis"],["No pulse (artery)","Arterial thrombosis"],["Pulseless fistula","Thrombosed fistula"]];
  host.innerHTML = frame("Dialysis access exam decoder", `<div class="row">${F.map((f,i)=>`<button class="btn sm ghost" data-i="${i}">${f[0]}</button>`).join("")}</div><div class="verdict" data-v>Pick a finding.</div>`);
  $$(host,"[data-i]").forEach(b=>b.onclick=()=>{ $$(host,"[data-i]").forEach(x=>x.classList.remove("on")); b.classList.add("on"); const f = F[+b.dataset.i]; const v = $(host,"[data-v]");
    v.className="verdict warn"; v.innerHTML = `<b>${f[0]}</b> → ${f[1]}. ` + (/stenosis|obstruction/.test(f[1])?"Treat with angioplasty (often high-pressure or cutting balloon). Goal: palpable thrill and pulse, or venous:brachial pressure ratio <0.4.":"Declot (pharmacologic or mechanical) and treat the underlying venous stenosis. Grafts are easier to declot than fistulas."); });
};
W.linechooser = host=>{
  host.innerHTML = frame("Which venous access device?", `<div class="grid3"><label>Duration<select data-d><option value="d">Days</option><option value="w">Weeks–months</option><option value="y">Months–years, intermittent</option></select></label>
   <label>Setting / use<select data-u><option value="icu">ICU resuscitation, pressure monitoring</option><option value="chemo">Chemotherapy / TPN</option><option value="hd">Hemodialysis / plasmapheresis</option><option value="abx">IV antibiotics</option></select></label>
   <label>Patient<select data-p><option value="n">No special factors</option><option value="ckd">Chronic kidney disease (future fistula)</option><option value="inf">Bacteremia / positive cultures</option></select></label></div><div class="verdict" data-v></div>`);
  const up = ()=>{ const d = $(host,"[data-d]").value, u = $(host,"[data-u]").value, p = $(host,"[data-p]").value; let r;
    if (u==="icu" || d==="d") r = "<b>Nontunneled central catheter</b> (bedside, local anesthesia, up to 5 lumens). Avoid leaving it for weeks–months (infection).";
    else if (d==="y" && u!=="hd") r = "<b>Subcutaneous port</b> via the internal jugular (IR). Sedation + antibiotic prophylaxis, snug pocket, access only with a Huber needle.";
    else if (u==="hd" || d==="w") r = "<b>Tunneled catheter</b> (IR suite, sedation). Cuff ~1 cm from the skin exit. Lasts weeks–months (sometimes years).";
    if (u==="abx" && d==="w" && p!=="ckd") r += " A <b>PICC</b> (basilic vein first) is also reasonable.";
    if (p==="ckd") r += " <b class='badtxt'>No PICC</b>: preserve arm veins for a fistula; use neck veins.";
    if (p==="inf" && !/Nontunneled/.test(r)) r = "<b class='badtxt'>Do not place a tunneled line or port</b> with ongoing infection or positive blood cultures. Use a temporary nontunneled catheter until cultures clear.";
    $(host,"[data-v]").className="verdict"; $(host,"[data-v]").innerHTML = r + " Preferred vein: internal jugular, under US; aspirate to confirm, flush with heparinized saline."; };
  $$(host,"select").forEach(x=>x.onchange=up); up();
};
W.picc = host=>{
  const S = [["basilic","Basilic vein",270,95,16,"vein","FIRST choice: medial and superficial to the brachial veins."],["brachv","Brachial veins",200,150,9,"vein","Avoid: the median nerve lies superficial to them."],["brachv2","Brachial veins",228,150,9,"vein","Avoid: median nerve risk."],["brachart","Brachial artery",214,140,11,"art","Do not puncture."],["median","Median nerve",214,118,8,"nerve","Lies superficial to the brachial veins."],["ceph","Cephalic vein",90,80,12,"vein","Second choice: extra curve where it joins the axillary/subclavian."],["radialn","Radial nerve",120,200,7,"nerve","Posterior, near the humerus."]];
  host.innerHTML = frame("PICC: pick the vein (upper arm cross-section)", `<svg viewBox="0 0 340 260" class="piccsvg"><ellipse cx="170" cy="140" rx="160" ry="110" class="armskin"/><circle cx="150" cy="170" r="30" class="humerus"/><text x="132" y="174" class="muted">humerus</text><text x="290" y="40" class="muted">medial</text><text x="10" y="40" class="muted">lateral</text>
   ${S.map(s=>`<g class="pc ${s[5]}" data-k="${s[0]}"><circle cx="${s[2]}" cy="${s[3]}" r="${s[4]}"/></g>`).join("")}</svg><div class="verdict" data-v>Tap the structure you would cannulate.</div>`, "Anterior is up.");
  $$(host,".pc").forEach(g=>g.onclick=()=>{ const s = S.find(x=>x[0]===g.dataset.k); const v = $(host,"[data-v]"); v.className = "verdict "+(s[0]==="basilic"?"ok":s[0]==="ceph"?"warn":"bad"); v.innerHTML = `<b>${s[1]}:</b> ${s[6]} No PICC in CKD patients who may need a fistula.`; });
};
W.gtube = host=>stepper(host, "Percutaneous gastrostomy", [
 {t:"Check the window", d:"Absolute contraindications: no safe window (colonic interposition), extensive gastric varices, uncorrectable coagulopathy. Note: no survival/QoL benefit in elderly dementia patients with poor intake.", svg:mini(`<ellipse cx="130" cy="110" rx="70" ry="45" class="organ"/><text x="100" y="114">stomach</text><line x1="0" y1="40" x2="260" y2="40" class="skin"/><path class="colon" d="M40 70 C90 60 170 60 220 70"/><text x="200" y="62" class="muted">colon?</text>`)},
 {t:"Insufflate", d:"NG tube under fluoroscopy; insufflate the stomach with air so it lies against the anterior abdominal wall.", svg:mini(`<ellipse cx="130" cy="85" rx="90" ry="45" class="organ"/><line x1="0" y1="40" x2="260" y2="40" class="skin"/><path class="wireln" d="M20 0 C40 40 60 70 90 85"/>`)},
 {t:"Gastropexy", d:"Deploy three T-fasteners to pin the anterior gastric wall to the abdominal wall; inject a little contrast after each to confirm intragastric position.", svg:mini(`<ellipse cx="130" cy="85" rx="90" ry="45" class="organ"/><line x1="0" y1="40" x2="260" y2="40" class="skin"/>${[100,130,160].map(x=>`<line x1="${x}" y1="20" x2="${x}" y2="55" class="needle"/><line x1="${x-8}" y1="55" x2="${x+8}" y2="55" class="tfast"/>`).join("")}`)},
 {t:"Puncture, dilate, place tube", d:"Definitive puncture in the middle of the pexy triangle, serial dilation, gastrostomy tube placed.", svg:mini(`<ellipse cx="130" cy="85" rx="90" ry="45" class="organ"/><line x1="0" y1="40" x2="260" y2="40" class="skin"/><path class="drain" d="M130 0 V80 C130 95 150 95 150 82 C150 72 135 72 132 80"/>`)},
 {t:"Aftercare", d:"Use after 24 h if there are no peritoneal signs. Leave in place at least 1 month for a mature transperitoneal tract.", svg:mini(`<text x="30" y="80">24 h → feed</text><text x="30" y="120">≥ 1 month → mature tract</text>`)}]);
})();
