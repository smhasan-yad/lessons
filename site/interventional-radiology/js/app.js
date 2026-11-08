/* Router, navigation, lessons, book viewer, search. */
(function(){
const SECS = window.IR_SECTIONS, main = document.getElementById("main"), nav = document.getElementById("nav");
const esc = s => String(s).replace(/[&<>"]/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const strip = h => h.replace(/<[^>]+>/g," ").replace(/\s+/g," ").normalize("NFD").replace(/[̀-ͯ]/g,"");
const BOOK = [588, 649];
/* The public build (radyssey.com) has no book pages, figures or real runs; the private study build adds them (js/private.js, js/dsa_figs.js). */
const PRIV = !!window.IR_PRIVATE, REAL = (window.IR_DSA||[]).length > 0;
const cite = p => `Core Radiology 2e, p. ${p}`;
const WTITLE = {npo:"Fasting check",checklist:"Pre-procedure checklist",bleedrisk:"Bleeding-risk checker",sizer:"Device size converter",wires:"Guidewire gallery",catheters:"Catheter shapes",balloon:"Balloon angioplasty bench",stent:"Stent sizing & crush test",embolic:"Embolic agent chooser",femoral:"Femoral puncture simulator",barbeau:"Barbeau test",rates:"Injection rates",dsa:"Renal DSA phases",landmarks:"Vertebral level quiz",celiac:"Celiac axis variants",pelvic:"Internal iliac divisions",giflow:"GI bleed pathway",endoleak:"Endoleak explorer",tasc:"TASC-II classifier",tpa:"tPA infusion monitor",compress:"Venous compression syndromes",ivcfilter:"IVC filter placement",lymph:"Lymphatic map",tdesteps:"Thoracic duct embolization",ptcsteps:"Biliary drainage steps",chole:"Cholecystostomy routes",hvpg:"Portal pressure calculator",collaterals:"Portosystemic collaterals",tips:"TIPS step by step",brto:"BRTO step by step",ablation:"Ablation zone simulator",tace:"TACE vs TARE checker",brodel:"Nephrostomy & Brödel's line",dialysis:"Dialysis access decoder",linechooser:"Venous access chooser",picc:"PICC vein picker",gtube:"Gastrostomy steps"};

/* practice that goes with each topic: real angiograms, simulator presets and guided cases */
const PRACTICE = {
  "angio/rates":[["Simulator: try different rates in the celiac trunk","#/dsa?m=sim&c=celiac"],["Case: get a diagnostic celiac run","#/dsa?m=sim&case=rate"]],
  "angio/reading":[["Real runs: the four renal phases","#/dsa?f=p598_0"],["Simulator: watch a renal run phase by phase","#/dsa?m=sim&c=rrenal"],["Case: fix a motion artefact","#/dsa?m=sim&case=motion"]],
  "angio/landmarks":[["Simulator: abdominal aortogram","#/dsa?m=sim&c=abd"]],
  "angio/celiac":[["Real run: celiac axis","#/dsa?f=p599_0"],["Simulator: celiac run","#/dsa?m=sim&c=celiac"]],
  "angio/sma":[["Real run: SMA and IMA","#/dsa?f=p601_3"],["Simulator: SMA run with portal return","#/dsa?m=sim&c=sma"],["Simulator: IMA run","#/dsa?m=sim&c=ima"]],
  "angio/pelvic":[["Real run: pelvis","#/dsa?f=p603_0"],["Simulator: pelvic run","#/dsa?m=sim&c=aortabif"],["Simulator: internal iliac run","#/dsa?m=sim&c=riia"]],
  "arterial/trauma":[["Case: open the aortic arch","#/dsa?m=sim&case=arch"]],
  "arterial/pelvictrauma":[["Simulator: internal iliac run with extravasation","#/dsa?m=sim&c=riia"]],
  "arterial/hemoptysis":[["Simulator: bronchial artery run","#/dsa?m=sim&c=rbronch"]],
  "arterial/ob":[["Simulator: internal iliac run","#/dsa?m=sim&c=riia"]],
  "arterial/gibleed":[["Case: find the lower GI bleed","#/dsa?m=sim&case=bleed"],["Simulator: SMA run","#/dsa?m=sim&c=sma"]],
  "arterial/mesischemia":[["Simulator: SMA run","#/dsa?m=sim&c=sma"]],
  "arterial/visceral":[["Case: which renal artery is narrowed?","#/dsa?m=sim&case=ras"],["Simulator: splenic artery run","#/dsa?m=sim&c=splenic"]],
  "arterial/upperlimb":[["Real runs: arm and hand","#/dsa?f=p616_0"],["Simulator: left subclavian run","#/dsa?m=sim&c=lsubcl"]],
  "arterial/lowerlimb":[["Real runs: leg runoff","#/dsa?f=p618_0"],["Simulator: runoff (add an SFA stenosis, then time–density curves)","#/dsa?m=sim&c=rcfa"]],
  "hepatobiliary/portal":[["Case: indirect portography","#/dsa?m=sim&case=portal"]],
  "onc/tace":[["Simulator: common hepatic artery run","#/dsa?m=sim&c=cha"]],
  "onc/tare":[["Simulator: common hepatic artery run","#/dsa?m=sim&c=cha"]],
  "onc/renalmass":[["Simulator: renal run","#/dsa?m=sim&c=rrenal"]],
  "gu/uae":[["Simulator: internal iliac run","#/dsa?m=sim&c=riia"]],
  "gu/pae":[["Simulator: internal iliac run","#/dsa?m=sim&c=riia"]]
};
function practiceRow(key, t){ const p = (PRACTICE[key+"/"+t.id]||[]).filter(([,h])=>REAL || !/[?&]f=/.test(h)); if (!p.length) return ""; return `<div class="practice"><b>Practise this</b>${p.map(([l,h])=>`<a class="chip" href="${h}">${esc(l)}</a>`).join("")}</div>`; }
/* recall mode: hide numbers and key terms in the lesson text until clicked (retrieval practice) */
function recallOn(){ try { return localStorage.getItem("ir-recall")==="1"; } catch(e){ return false; } }
function cloze(root){
  const skip = el=>el.closest(".widget, svg, button, a, h2, h3, figcaption, .figs, .cloze, .practice, label, .learned");
  root.querySelectorAll(".tb b, .tb strong").forEach(b=>{ const t = b.textContent.trim(); if (!skip(b.parentElement) && t.length && t.length < 48 && !/:$/.test(t)) b.classList.add("cloze"); });
  const re = /\d+(?:[.,]\d+)?(?:\s?[–-]\s?\d+(?:[.,]\d+)?)?(?:\s?(?:%|cm|mm|cc\/s|cc|mL\/min|mL|ml|Fr\b|F\b|mg|g\b|Gy|mmHg|kg|hours?|h\b|days?|weeks?|months?|min\b|s\b|years?|units?|French|°))?/g;
  root.querySelectorAll(".tb").forEach(tb=>{ const w = document.createTreeWalker(tb, NodeFilter.SHOW_TEXT, {acceptNode: n=>(!/\d/.test(n.nodeValue) || skip(n.parentElement)) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT});
    const nodes = []; while (w.nextNode()) nodes.push(w.currentNode);
    nodes.forEach(n=>{ const txt = n.nodeValue; let last = 0, m, frag = document.createDocumentFragment(), any = false; re.lastIndex = 0;
      while ((m = re.exec(txt))){ if (/(p\.|pp\.|page|Figure|Fig\.)\s*$/i.test(txt.slice(Math.max(0, m.index-8), m.index))) continue;
        frag.appendChild(document.createTextNode(txt.slice(last, m.index))); const sp = document.createElement("span"); sp.className = "cloze"; sp.textContent = m[0]; frag.appendChild(sp); last = m.index + m[0].length; any = true; }
      if (!any) return; frag.appendChild(document.createTextNode(txt.slice(last))); n.parentNode.replaceChild(frag, n); }); });
  root.querySelectorAll(".cloze").forEach(c=>c.addEventListener("click", e=>{ e.preventDefault(); c.classList.toggle("shown"); }));
}

/* ---------- nav ---------- */
const IC = {
  home:'<svg viewBox="0 0 20 20"><path d="M3 9.5 10 4l7 5.5V16a1 1 0 0 1-1 1h-3.5v-4.5h-5V17H4a1 1 0 0 1-1-1z"/></svg>',
  cube:'<svg viewBox="0 0 20 20"><path d="m10 2.8 6.5 3.7v7L10 17.2l-6.5-3.7v-7z"/><path d="M3.5 6.5 10 10l6.5-3.5M10 10v7.2"/></svg>',
  tools:'<svg viewBox="0 0 20 20"><path d="M12.5 3.5a3.5 3.5 0 0 0-3.3 4.6L3.8 13.5a1.6 1.6 0 0 0 2.3 2.3l5.4-5.4a3.5 3.5 0 0 0 4.6-3.3l-2 2-2.2-.5-.5-2.2z"/></svg>',
  quiz:'<svg viewBox="0 0 20 20"><rect x="3.5" y="3" width="13" height="14" rx="2"/><path d="m6.5 9 1.6 1.6L11 7.7M6.5 13.5h7"/></svg>',
  cards:'<svg viewBox="0 0 20 20"><rect x="5.5" y="5" width="11" height="12" rx="2"/><path d="M3.5 14V5a2 2 0 0 1 2-2h7"/></svg>',
  book:'<svg viewBox="0 0 20 20"><path d="M10 5.5C8.5 4.3 6 4 3.5 4.3v11c2.5-.3 5 0 6.5 1.2 1.5-1.2 4-1.5 6.5-1.2v-11C14 4 11.5 4.3 10 5.5zM10 5.5v11"/></svg>',
  dsa:'<svg viewBox="0 0 20 20"><rect x="3" y="3" width="14" height="14" rx="3"/><path d="M6 14c2-1 2.5-3 4-4.5S13 8 14 6M10 9.5c.5 1.5 1.8 2.5 3.5 3"/></svg>',
  logo:'<svg viewBox="0 0 24 24"><path d="M12 3v18M12 9 6.5 13.5M12 9l5.5 4.5M12 15l-4 4.5M12 15l4 4.5"/></svg>'
};
function buildNav(){
  nav.innerHTML = `<div class="navtop">${PRIV?"":`<a class="backlink" href="../">‹ Radyssey lessons</a>`}<a href="#/" class="brand"><span class="logo">${IC.logo}</span><span>IR Atlas<small>${PRIV?"Core Radiology, chapter 9":"Interventional radiology"}</small></span></a>
   <input id="q" type="search" placeholder="Search the chapter" autocomplete="off" aria-label="Search the chapter (press /)"></div>
   <div class="navlinks"><a href="#/" data-r="home">${IC.home}Overview</a><a href="#/explorer" data-r="explorer">${IC.cube}3D anatomy</a><a href="#/dsa" data-r="dsa">${IC.dsa}DSA runs</a><a href="#/tools" data-r="tools">${IC.tools}Tools<span class="badge">${Object.keys(WTITLE).length}</span></a><a href="#/quiz" data-r="quiz">${IC.quiz}Questions<span class="badge">${IR_MCQ.length}</span></a><a href="#/cards" data-r="cards">${IC.cards}Flashcards<span class="badge" id="due"></span></a><a href="#/numbers" data-r="numbers">${IC.quiz}Numbers to know</a>${PRIV?`<a href="#/book/588" data-r="book">${IC.book}Book pages</a>`:""}</div>
   <div class="navhead">Sections</div>
   <div class="navsecs">${SECS.map(s=>{ const [l,t] = IRStudy.sectionProgress(s); return `<details class="ns" data-k="${s.key}"><summary><span class="num">${s.num}</span><span class="nt">${s.title}</span><span class="np">${l}/${t}</span></summary>${s.topics.map(t=>`<a href="#/learn/${s.key}/${t.id}" data-t="${s.key}/${t.id}"><span class="tick">${IRStudy.isLearned(s.key+"/"+t.id)?"✓":""}</span>${t.title}</a>`).join("")}</details>`; }).join("")}</div>
   <div class="navfoot"><button id="theme" class="btn sm ghost" style="white-space:nowrap">Appearance</button><span>Progress saves in this browser</span></div>`;
  const due = IRStudy.dueCards().length; document.getElementById("due").textContent = due;
  document.getElementById("q").addEventListener("keydown", e=>{ if (e.key==="Enter") location.hash = "#/search?q="+encodeURIComponent(e.target.value); });
  document.getElementById("theme").onclick = ()=>{ const r = document.documentElement; const cur = r.dataset.theme || (matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"); r.dataset.theme = cur==="dark"?"light":"dark"; try{localStorage.setItem("ir-theme", r.dataset.theme);}catch(e){} };
}
try { const t = localStorage.getItem("ir-theme"); if (t) document.documentElement.dataset.theme = t; } catch(e){}
document.addEventListener("keydown", e=>{ if (e.key==="/" && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) { e.preventDefault(); document.getElementById("q").focus(); } });

function mountWidgets(root){
  root.querySelectorAll(".widget[data-w]").forEach(el=>{ const f = IRW[el.dataset.w]; if (f) { try { f(el); } catch(err){ el.innerHTML = `<p class="warn">Widget error: ${esc(err.message)}</p>`; console.error(err); } } else el.innerHTML = `<p class="warn">Missing widget ${el.dataset.w}</p>`; });
  root.querySelectorAll(".v3d").forEach(s=>{ s.title = "Show in 3D explorer"; s.onclick = ()=>{ location.hash = "#/explorer?v="+s.dataset.v; }; });
}

/* ---------- pages ---------- */
function home(){
  const total = SECS.reduce((a,s)=>a+s.topics.length,0), done = SECS.reduce((a,s)=>a+IRStudy.sectionProgress(s)[0],0);
  const st = IRStudy.mcqStats(); const pct = Math.round(done/total*100);
  const due = IRStudy.dueCards().length;
  let lastL = null; try { lastL = JSON.parse(localStorage.getItem("ir-last")||"null"); } catch(e){}
  const cases = window.IRDSASIM ? IRDSASIM.CASES : [], cdone = window.IRDSASIM ? IRDSASIM.casesDone() : {};
  const nDone = cases.filter(c=>cdone[c.k]).length;
  main.innerHTML = `<div class="page home">
   <section class="hero"><div><h1>Interventional radiology, one vessel at a time</h1>
    <p class="lead">${PRIV?"Chapter 9 of Core Radiology, rebuilt so you can handle it":"IR you can handle"}: rotate the vascular tree, ${REAL?"read the book's own angiograms, ":""}acquire your own DSA runs on a physics simulator, puncture a virtual groin, place a filter, then test yourself until the numbers stick.</p>
    <div class="row">${lastL ? `<a class="btn" href="#/learn/${lastL.key}${lastL.t?"/"+lastL.t:""}">Continue: ${esc(lastL.title)}</a><a class="btn ghost" href="#/learn/intro">Section 1</a>` : `<a class="btn" href="#/learn/intro">Start with section 1</a>`}<a class="btn ghost" href="#/explorer">3D anatomy</a><a class="btn ghost" href="#/dsa?m=sim">DSA simulator</a></div>
    <div class="progressline"><i style="width:${pct}%"></i></div><p class="muted small">${done} of ${total} topics learned, ${st.seen} of ${st.n} questions answered${due?`, ${due} flashcards due`:""}.</p></div>
    <figure class="herorun" style="margin:0"><canvas width="640" height="480" id="herocv" aria-label="Animated selective renal angiogram"></canvas><figcaption id="herocap">Selective renal DSA: arterial phase</figcaption></figure></section>
   <div class="stats"><div><b>10</b>sections</div><div><b>${Object.keys(WTITLE).length}</b>hands-on tools</div><div><b>${IR_MCQ.length}</b>board-style questions</div><div><b>${IR_CARDS.length}</b>spaced-repetition cards</div><div><b>${(window.IR_ANAT?IR_ANAT.meshes.length:0)+IR3D.vessels.length}</b>3D structures</div>${REAL?`<div><b>${IR_DSA.length}</b>real DSA runs</div>`:""}<div><b>${cases.length}</b>simulator cases</div></div>
   <h2>What you can do here</h2>
   <div class="feat">
    <a class="fcard" href="#/explorer"><b>3D anatomy</b><p>Real segmented organs, bones and vessels with the chapter's branch tree on top. Guided tours, cut planes, variants, a name-that-vessel quiz and a catheter route planner.</p></a>
    ${REAL?`<a class="fcard" href="#/dsa"><b>Real angiograms</b><p>${IR_DSA.length} DSA runs from the book with clickable anatomy: explore the labels, then quiz yourself on the unlabelled film. The four renal phases play as a cine loop.</p></a>`:""}
    <a class="fcard hot" href="#/dsa?m=sim"><b>DSA run simulator</b><p>Place the catheter, set rate, volume and C-arm angle, and acquire a run. Contrast follows real flow physics through arterial, parenchymal and venous phases, with reflux, stenosis, extravasation, AV shunt and motion artefact. Workstation tools: remask, pixel shift, roadmap, colour time-to-peak and time–density curves.</p>
      <span class="muted small">Guided cases: ${nDone} of ${cases.length} solved${cases.length?` · next: ${esc((cases.find(c=>!cdone[c.k])||cases[0]).n)}`:""}</span></a>
    <a class="fcard" href="#/tools"><b>${Object.keys(WTITLE).length} hands-on tools</b><p>Femoral puncture, balloon and stent sizing, embolic chooser, TASC, portal pressure, ablation zones, IVC filter placement and more.</p></a>
    <a class="fcard" href="#/quiz"><b>Test yourself</b><p>${IR_MCQ.length} board-style questions${PRIV?" with book quotes":" with explanations"}, ${IR_CARDS.length} spaced-repetition flashcards, a printable numbers sheet, and recall mode in every lesson.</p></a>
   </div>
   <h2>Sections</h2>
   <div class="secgrid">${SECS.map(s=>{ const [l,t] = IRStudy.sectionProgress(s); return `<a class="seccard" href="#/learn/${s.key}"><span class="num">${s.num}</span><h3>${s.title}</h3><span class="meta">p. ${s.pages[0]}–${s.pages[1]}</span><p>${s.sub}</p><div class="pbar"><i style="width:${l/t*100}%"></i></div></a>`; }).join("")}</div>
   <h2>A way through it</h2>
   <div class="plan">
    <div><b>Anatomy first.</b> Take the 3D tours in order: aortic landmarks, celiac axis, mesenteric, pelvis, legs, veins, portal system. Then run the name-that-vessel quiz until you get 4 out of 5.</div>
    <div><b>Then read runs.</b> ${REAL?"Explore each real angiogram with labels on, then take its quiz with labels off. Acquire the same territory on the simulator":"Acquire each territory on the simulator"}, play it phase by phase, and pass its find-the-vessel quiz.</div>
    <div><b>One section per sitting.</b> Read it, use every tool in it, ${PRIV?"open the book page beside it when a figure matters":"read the cited textbook pages for more depth"}, then do the quick check at the end.</div>
    <div><b>Recall before you mark.</b> Switch on recall mode in the lesson: numbers and key terms are hidden until you click them. Mark a topic learned only when you can fill them in and the quick check goes well.</div>
    <div><b>Solve the simulator cases</b> as you reach their sections: injection rates, the arch, GI bleeding, renal artery stenosis, portal venous return and motion artefact.</div>
    <div><b>Ten minutes of flashcards a day</b> keeps injection rates, thresholds, levels and doses fresh.</div>
    <div><b>Timed blocks last.</b> When every section is marked, do 40-question exams across the chapter, then review your mistakes.</div>
   </div>
   <p class="muted small">${PRIV?`Text from <i>Core Radiology: A Visual Approach to Diagnostic Imaging</i>, 2nd ed., chapter 9, with extra points from <i>Sutton, Textbook of Radiology and Imaging</i>. Page images are rendered from your own PDF for personal study.`:`A study companion to <i>Core Radiology: A Visual Approach to Diagnostic Imaging</i>, 2nd ed., chapter 9. Page numbers refer to that book, which is not reproduced here. Extra points are paraphrased from <i>Sutton, Textbook of Radiology and Imaging</i>. For education only, not clinical advice.`} Bones, organs and major vessels in 3D: BodyParts3D, © The Database Center for Life Science, CC BY-SA 2.1 Japan.${PRIV?"":` <a href="CREDITS.txt">Credits and licences</a>.`} <button class="linkbtn" id="exp">Back up progress</button> · <label class="linkbtn">Restore backup<input type="file" accept=".json" id="imp" hidden></label> · <button class="linkbtn" id="reset">Reset progress</button></p></div>`;
  document.getElementById("reset").onclick = ()=>{ if (confirm("Clear all progress, quiz history and card schedules in this browser?")) { IRStudy.reset(); buildNav(); home(); } };
  document.getElementById("exp").onclick = ()=>IRStudy.exportFile();
  document.getElementById("imp").onchange = e=>{ const f = e.target.files[0]; if (f) IRStudy.importFile(f, ok=>{ alert(ok ? "Progress restored." : "That file is not an IR Atlas backup."); buildNav(); home(); }); };
  heroRun(document.getElementById("herocv"), document.getElementById("herocap"));
}
/* One orchestrated moment: a renal DSA run plays once on load. */
function heroRun(cv, cap){
  if (!cv) return; const g = cv.getContext("2d"); let seed = 7; const rnd = ()=>((seed = (seed*16807)%2147483647)/2147483647);
  const segs = []; (function br(x,y,a,len,w,d){ if (d>7) return; const x2 = x+Math.cos(a)*len, y2 = y+Math.sin(a)*len; segs.push({x,y,x2,y2,w,d}); br(x2,y2,a-0.38-rnd()*0.22,len*0.74,w*0.7,d+1); br(x2,y2,a+0.34+rnd()*0.22,len*0.74,w*0.7,d+1); })(70,250,-0.05,92,9,0);
  const vs = segs.map(s=>({x:s.x2+9,y:s.y2+12,x2:s.x+9,y2:s.y+12,w:s.w*1.15,d:s.d}));
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches; const t0 = performance.now(); const DUR = 6500;
  const draw = t=>{
    g.fillStyle = "#e9ebe9"; g.fillRect(0,0,640,480);
    const art = Math.min(1,t/0.33), par = Math.max(0,Math.min(1,(t-0.38)/0.22)), ven = Math.max(0,Math.min(1,(t-0.62)/0.25)), wash = Math.max(0,(t-0.5)/0.5);
    g.save(); g.globalAlpha = 0.42*par*(1-Math.max(0,(t-0.88)*4)); g.fillStyle = "#3a3d40"; g.beginPath(); g.ellipse(330,250,205,160,-0.08,0,7); g.fill(); g.restore();
    g.strokeStyle = "#141618"; g.lineCap = "round";
    segs.forEach(s=>{ const k = Math.min(1, art*8 - s.d); if (k<=0) return; g.globalAlpha = 1-wash*0.88; g.lineWidth = s.w; g.beginPath(); g.moveTo(s.x,s.y); g.lineTo(s.x+(s.x2-s.x)*k, s.y+(s.y2-s.y)*k); g.stroke(); });
    vs.forEach(s=>{ const k = Math.min(1, ven*8-(7-s.d)); if (k<=0) return; g.globalAlpha = .8; g.lineWidth = s.w; g.beginPath(); g.moveTo(s.x,s.y); g.lineTo(s.x+(s.x2-s.x)*k, s.y+(s.y2-s.y)*k); g.stroke(); });
    if (ven>0.85){ g.globalAlpha = .8; g.lineWidth = 18; g.beginPath(); g.moveTo(79,262); g.lineTo(0,262); g.stroke(); }
    g.globalAlpha = 1; g.strokeStyle = "#5d6166"; g.lineWidth = 4; g.beginPath(); g.moveTo(0,250); g.lineTo(70,250); g.stroke();
    cap.textContent = "Selective renal DSA: " + (t<0.3?"early arterial phase":t<0.42?"late arterial phase":t<0.66?"parenchymal phase":"venous phase");
  };
  if (reduce) return draw(0.5);
  (function f(){ if (!document.body.contains(cv)) return; const t = Math.min(1,(performance.now()-t0)/DUR); draw(t); if (t<1) requestAnimationFrame(f); else cv.onclick = ()=>heroRun(cv,cap); })();
}


/* book figures assigned to topics: candidates = topics in the section whose page <= figure page; best caption/title word overlap wins */
let FIGMAP = null;
function figMap(){
  if (FIGMAP) return FIGMAP; FIGMAP = {};
  const words = s => new Set(s.toLowerCase().replace(/[^a-z0-9 ]/g," ").split(/\s+/).filter(w=>w.length>3));
  (window.IR_FIGS||[]).forEach(f=>{
    const sec = SECS.slice().reverse().find(s=>f.page >= s.pages[0]) || SECS[0];
    const cands = sec.topics.filter(t=>t.page <= f.page); if (!cands.length) return;
    const cw = words(f.cap);
    let best = cands[cands.length-1], bs = -1;
    cands.forEach(t=>{ const tw = words(t.title + " " + strip(t.html).slice(0,400)); let sc = 0; cw.forEach(w=>{ if (tw.has(w)) sc++; }); sc -= (f.page - t.page)*3; if (sc > bs) { bs = sc; best = t; } });
    (FIGMAP[sec.key+"/"+best.id] = FIGMAP[sec.key+"/"+best.id] || []).push(f);
  });
  return FIGMAP;
}
function figStrip(key, t){
  const fs = figMap()[key+"/"+t.id]; if (!fs) return "";
  return `<div class="figs" aria-label="Figures from the book">${fs.map(f=>`<figure data-fig="${f.id}"><img loading="lazy" src="book/fig/${f.id}.jpg" alt="Figure from book page ${f.page}"><figcaption>${esc(f.cap||"Book page "+f.page)}</figcaption></figure>`).join("")}</div>`;
}
function lightbox(id){
  const f = (window.IR_FIGS||[]).find(x=>x.id===id); if (!f) return;
  const dsa = (window.IR_DSA||[]).some(d=>d.id===id);
  const box = document.createElement("div"); box.className = "lightbox";
  box.innerHTML = `<div class="lb"><img src="book/fig/${id}.jpg" alt=""><p class="small">${esc(f.cap)}</p><div class="row"><label class="sw inline"><span>Book labels and arrows</span><input type="checkbox" data-l><i></i></label><span class="sp"></span>${dsa?`<a class="btn sm" href="#/dsa?f=${id}">Practise on this run</a>`:""}<a class="btn sm ghost" href="#/book/${f.page}">Book page ${f.page}</a><button class="btn sm ghost" data-x>Close</button></div></div>`;
  document.body.appendChild(box);
  const close = ()=>box.remove();
  box.addEventListener("click", e=>{ if (e.target===box || e.target.closest("[data-x]") || e.target.closest("a")) close(); });
  box.querySelector("[data-l]").onchange = e=>{ box.querySelector("img").src = `book/fig/${id}${e.target.checked?"_lab":""}.jpg`; };
  document.addEventListener("keydown", function k(e){ if (e.key==="Escape"){ close(); document.removeEventListener("keydown", k); } });
}

function learn(key, topicId){
  const s = SECS.find(x=>x.key===key); if (!s) return notFound();
  const sut = (window.IR_SUTTON||[]).filter(x=>x.section===key);
  const idx = SECS.indexOf(s), prev = SECS[idx-1], next = SECS[idx+1];
  main.innerHTML = `<div class="page lesson" style="--c:${s.color}">
   <header class="lhead"><span class="num">${s.num}</span><div><h1>${s.title}</h1><p class="lmeta">${s.sub}. ${PRIV?"Book pages":"Core Radiology 2e, pp."} ${s.pages[0]}–${s.pages[1]}.</p></div>
     <div class="recallbar"><label class="sw inline"><span>Recall mode</span><input type="checkbox" data-recall ${recallOn()?"checked":""}><i></i></label><button class="linkbtn small" data-showall ${recallOn()?"":"hidden"}>Show all</button></div></header>
   <nav class="toc">${s.topics.map(t=>`<a href="#/learn/${key}/${t.id}">${IRStudy.isLearned(key+"/"+t.id)?"✓ ":""}${t.title}</a>`).join("")}${sut.length?`<a href="#/learn/${key}/sutton">From Sutton</a>`:""}<a href="#/learn/${key}/check">Quick check</a></nav>
   ${s.topics.map(t=>`<article class="topic" id="t-${t.id}"><div class="th"><h2>${t.title}</h2>${PRIV?`<button class="pg" data-pg="${t.page}" title="Open book page beside the lesson">Book p. ${t.page}</button>`:`<span class="pg cite">${cite(t.page)}</span>`}</div><div class="tb">${t.html}</div>${practiceRow(key, t)}${figStrip(key, t)}
     <label class="learned"><input type="checkbox" data-l="${key}/${t.id}" ${IRStudy.isLearned(key+"/"+t.id)?"checked":""}> I've learned this</label></article>`).join("")}
   ${sut.length?`<article class="topic sutton" id="t-sutton"><div class="th"><h2>From Sutton: extra points</h2></div><p class="muted">Paraphrased from <i>Sutton, Textbook of Radiology and Imaging</i>. Older text; points marked "older practice" differ from current guidance.</p>${sut.map(x=>`<details><summary><b>${esc(x.topic)}</b> <span class="muted">${esc(x.src)}</span></summary><ul>${x.points.map(p=>`<li>${esc(p)}</li>`).join("")}</ul></details>`).join("")}</article>`:""}
   <article class="topic" id="t-check"><div data-mq></div></article>
   <div class="pn">${prev?`<a class="btn ghost" href="#/learn/${prev.key}">Previous: ${prev.title}</a>`:"<span></span>"}${next?`<a class="btn" href="#/learn/${next.key}">Next: ${next.title}</a>`:`<a class="btn" href="#/quiz">Whole-chapter quiz</a>`}</div></div>`;
  mountWidgets(main);
  if (recallOn()) cloze(main);
  main.querySelector("[data-recall]").onchange = e=>{ try { localStorage.setItem("ir-recall", e.target.checked ? "1" : "0"); } catch(err){} const y = main.scrollTop; learn(key, null); main.scrollTop = y; };
  main.querySelector("[data-showall]").onclick = ()=>main.querySelectorAll(".cloze").forEach(c=>c.classList.add("shown"));
  try { const tt = topicId && s.topics.find(x=>x.id===topicId); localStorage.setItem("ir-last", JSON.stringify({key, t: tt ? tt.id : null, title: `${s.num}. ${s.title}${tt ? " › " + tt.title : ""}`})); } catch(e){}
  main.querySelectorAll("[data-fig]").forEach(f=>f.onclick=()=>lightbox(f.dataset.fig));
  IRStudy.miniQuiz(main.querySelector("[data-mq]"), key, 3);
  main.querySelectorAll("[data-l]").forEach(cb=>cb.onchange=()=>{ IRStudy.setLearned(cb.dataset.l, cb.checked); buildNav(); openNav(key); });
  main.querySelectorAll("[data-pg]").forEach(b=>b.onclick=()=>drawer(+b.dataset.pg));
  if (topicId) { const el = document.getElementById("t-"+topicId); if (el) setTimeout(()=>el.scrollIntoView({behavior:"instant", block:"start"}), 30); } else main.scrollTop = 0;
  openNav(key);
}
function openNav(key){ nav.querySelectorAll(".ns").forEach(d=>d.open = d.dataset.k===key); }

function bookImg(p){ return `book/p${p}.jpg`; }
function drawer(p){
  let d = document.getElementById("drawer"); if (!d) { d = document.createElement("aside"); d.id = "drawer"; document.body.appendChild(d); }
  const draw = ()=>{ d.innerHTML = `<div class="dhead"><button class="btn sm ghost" data-d="-1" aria-label="Previous page">‹</button><b>Book page ${p}</b><button class="btn sm ghost" data-d="1" aria-label="Next page">›</button><span class="sp"></span><a class="btn sm ghost" href="#/book/${p}">Full view</a><button class="btn sm ghost" data-x>✕</button></div><div class="dbody"><img src="${bookImg(p)}" alt="Core Radiology page ${p}"></div>`;
    d.querySelectorAll("[data-d]").forEach(b=>b.onclick=()=>{ p = Math.max(BOOK[0], Math.min(BOOK[1], p + +b.dataset.d)); draw(); });
    d.querySelector("[data-x]").onclick = ()=>{ d.classList.remove("open"); document.body.classList.remove("drawer-open"); }; };
  draw(); d.classList.add("open"); document.body.classList.add("drawer-open");
}
function book(p){
  p = Math.max(BOOK[0], Math.min(BOOK[1], p||BOOK[0]));
  const sec = SECS.slice().reverse().find(s=>p>=s.pages[0]) || SECS[0];
  const topics = []; SECS.forEach(s=>s.topics.forEach(t=>{ if (t.page===p) topics.push([s,t]); }));
  main.innerHTML = `<div class="page bookpage"><div class="row bar"><a class="btn sm ghost" href="#/book/${p-1}" aria-label="Previous page">‹</a><b>Core Radiology 2e, page ${p}</b><a class="btn sm ghost" href="#/book/${p+1}" aria-label="Next page">›</a>
   <input type="range" min="${BOOK[0]}" max="${BOOK[1]}" value="${p}" data-r style="flex:1"><button class="btn sm ghost" data-z>Zoom</button></div>
   <div class="row">${topics.length?"Lessons on this page: "+topics.map(([s,t])=>`<a class="chip" href="#/learn/${s.key}/${t.id}">${t.title}</a>`).join(""):`<a class="chip" href="#/learn/${sec.key}">${sec.num}. ${sec.title}</a>`}</div>
   <div class="bookimg"><img src="${bookImg(p)}" alt="page ${p}"></div></div>`;
  main.querySelector("[data-r]").onchange = e=>location.hash = "#/book/"+e.target.value;
  main.querySelector("[data-z]").onclick = ()=>main.querySelector(".bookimg").classList.toggle("zoom");
}
function tools(){
  const by = SECS.map(s=>({s, ws:[...new Set([...s.topics.map(t=>t.html).join("").matchAll(/data-w="(\w+)"/g)].map(m=>m[1]))]}));
  main.innerHTML = `<div class="page"><h1>Tool bench</h1><p class="lead">Every interactive tool in one place, grouped by section. Open one to use it.</p>
   ${by.map(({s,ws})=>`<h2 style="--c:${s.color}" class="tsec"><span class="num">${s.num}</span>${s.title}</h2><div class="toolgrid">${ws.map(w=>`<details class="tool"><summary>${WTITLE[w]||w}</summary><div class="widget" data-w="${w}" data-lazy></div></details>`).join("")}</div>`).join("")}</div>`;
  main.querySelectorAll("details.tool").forEach(d=>d.addEventListener("toggle", ()=>{ const w = d.querySelector("[data-lazy]"); if (d.open && w) { w.removeAttribute("data-lazy"); IRW[w.dataset.w](w); } }));
}
function search(q){
  const terms = q.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").split(/\s+/).filter(Boolean); const res = [];
  if (terms.length) {
    SECS.forEach(s=>s.topics.forEach(t=>{ const txt = (t.title+" "+strip(t.html)).toLowerCase(); const sc = terms.reduce((a,w)=>a+(txt.split(w).length-1),0); if (terms.every(w=>txt.includes(w))) { const i = txt.indexOf(terms[0]); res.push({sc, s, t, snip: strip(t.html).slice(Math.max(0,i-80), i+160)}); } }));
    (window.IR_SUTTON||[]).forEach(x=>{ const txt = (x.topic+" "+x.points.join(" ")).toLowerCase(); if (terms.every(w=>txt.includes(w))) res.push({sc:0.5, sut:x}); });
  }
  const vs = (window.IR3D? IR3D.vessels:[]).filter(v=>terms.length && terms.every(w=>(v.name+" "+(v.info||"")).toLowerCase().includes(w))).slice(0,12);
  const qn = IR_MCQ.filter(m=>terms.length && terms.every(w=>(m.stem+" "+m.explain).toLowerCase().includes(w))).length;
  const hi = s => terms.reduce((a,w)=>a.replace(new RegExp("("+w.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+")","gi"),"<mark>$1</mark>"), esc(s));
  main.innerHTML = `<div class="page"><h1>Search: “${esc(q)}”</h1>
   ${vs.length?`<div class="row"><b>Vessels:</b> ${vs.map(v=>`<a class="chip" href="#/explorer?v=${v.id}">${esc(v.name)}</a>`).join("")}</div>`:""}
   ${qn?`<p class="muted">${qn} questions mention this.</p>`:""}
   ${res.sort((a,b)=>b.sc-a.sc).map(r=>r.sut?`<div class="sres"><span class="tag">Sutton</span> <b>${esc(r.sut.topic)}</b> <span class="muted">${esc(r.sut.src)}</span><p>${hi(r.sut.points.join(" · ").slice(0,260))}…</p><a href="#/learn/${r.sut.section}/sutton">Open</a></div>`:`<div class="sres"><a href="#/learn/${r.s.key}/${r.t.id}"><b>${r.s.num}. ${r.s.title} › ${r.t.title}</b></a> <span class="muted">${PRIV?"p."+r.t.page:cite(r.t.page)}</span><p>…${hi(r.snip)}…</p></div>`).join("") || "<p>No matches.</p>"}</div>`;
}
function notFound(){ main.innerHTML = `<div class="page"><h1>Not found</h1><a href="#/">Home</a></div>`; }

/* ---------- router ---------- */
let last = "";
function route(){
  const h = location.hash.slice(1) || "/"; const [path, qs] = h.split("?"); const params = new URLSearchParams(qs||""); const parts = path.split("/").filter(Boolean);
  nav.querySelectorAll(".navlinks a").forEach(a=>a.classList.toggle("on", a.dataset.r === (parts[0]||"home")));
  nav.querySelectorAll("[data-t]").forEach(a=>a.classList.toggle("on", a.dataset.t === parts.slice(1,3).join("/")));
  document.body.classList.remove("nav-open");
  const isExp = parts[0]==="explorer";
  if (!isExp && window.IR3D) IR3D.destroy();
  if (parts[0]!=="dsa" && window.IRDSA) IRDSA.destroy();
  document.body.classList.toggle("explorer", isExp);
  const same = last.split("/")[1]===parts[0] && last.split("/")[2]===parts[1] && parts[0]==="learn";
  last = path;
  if (same && parts[2]) { const el = document.getElementById("t-"+parts[2]); if (el) { el.scrollIntoView({behavior:"smooth"}); return; } }
  if (!parts.length) return home();
  switch(parts[0]){
    case "learn": return learn(parts[1], parts[2]);
    case "dsa": IRDSA.destroy(); return IRDSA.render(main, params);
    case "explorer": main.innerHTML = `<div class="xpage"></div>`; return IR3D.mount(main.firstChild, {focus: params.get("v")});
    case "quiz": return IRStudy.renderQuiz(main, params.get("s"));
    case "cards": return IRStudy.renderCards(main);
    case "numbers": return IRStudy.renderNumbers(main);
    case "book": return PRIV ? book(+parts[1]) : notFound();
    case "tools": return tools();
    case "search": return search(params.get("q")||"");
    default: return notFound();
  }
}
document.getElementById("burger").onclick = ()=>document.body.classList.toggle("nav-open");
buildNav(); window.addEventListener("hashchange", route); route();
})();
