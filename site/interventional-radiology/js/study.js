/* Progress, MCQ practice/exam, spaced-repetition flashcards (SM-2). State lives in localStorage (per browser). */
(function(){
const KEY = "ir-atlas-v1";
let S = {learned:{}, marks:{}, mcq:{}, cards:{}, log:[]};
try { const raw = localStorage.getItem(KEY); if (raw) S = Object.assign(S, JSON.parse(raw)); } catch(e){}
const save = ()=>{ try { localStorage.setItem(KEY, JSON.stringify(S)); } catch(e){} };
const today = ()=>Math.floor(Date.now()/86400000);
/* book links and verbatim quotes only in the private study build; the public build cites the page */
const PRIV = !!window.IR_PRIVATE;
const pgLink = (p, cls) => PRIV ? `<a${cls?` class="${cls}"`:""} href="#/book/${p}">p. ${p}</a>` : `<span${cls?` class="${cls}"`:""}>Core Radiology 2e, p. ${p}</span>`;
const srcLine = q => PRIV && q.quote ? `<blockquote>“${esc(q.quote)}” ${pgLink(q.page)}</blockquote>` : `<p class="muted small">${pgLink(q.page)}</p>`;
const secName = k => (window.IR_SECTIONS.find(s=>s.key===k)||{title:k}).title;
const esc = s => String(s).replace(/[&<>"]/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

const IRStudy = window.IRStudy = {
  S, save,
  mark(k){ S.marks[k] = 1; save(); },
  logQuiz(kind, ok){ S.log.push([Date.now(), kind, ok?1:0]); if (S.log.length>2000) S.log.shift(); save(); },
  setLearned(id, v){ if (v) S.learned[id] = today(); else delete S.learned[id]; save(); },
  isLearned(id){ return !!S.learned[id]; },
  sectionProgress(sec){ const t = sec.topics.length, l = sec.topics.filter(x=>S.learned[sec.key+"/"+x.id]).length; return [l,t]; },
  mcqStats(sec){ const qs = IR_MCQ.filter(q=>!sec || q.section===sec); let seen=0, right=0; qs.forEach(q=>{ const r = S.mcq[q.id]; if (r){ seen++; if (r.last) right++; } }); return {n:qs.length, seen, right}; },
  dueCards(secs){ const d = today(); return IR_CARDS.filter(c=>(!secs||secs.includes(c.section)) && (!S.cards[c.id] || S.cards[c.id].due <= d)); },
  reset(){ S.learned={}; S.marks={}; S.mcq={}; S.cards={}; S.log=[]; save(); }
};


function weakTable(){
  const rows = window.IR_SECTIONS.map(sec=>{ const st = IRStudy.mcqStats(sec.key); const qs = IR_MCQ.filter(q=>q.section===sec.key && S.mcq[q.id]); const tot = qs.reduce((a,q)=>a+S.mcq[q.id].n,0), ok = qs.reduce((a,q)=>a+S.mcq[q.id].ok,0); return {sec, seen:st.seen, n:st.n, pct: tot ? Math.round(ok/tot*100) : null}; });
  const tried = rows.filter(r=>r.pct!==null); if (!tried.length) return "";
  const weak = tried.slice().sort((a,b)=>a.pct-b.pct)[0];
  return `<div class="panel"><h3>Where you stand</h3><table class="t"><tr><th>Section</th><th>Seen</th><th>Accuracy</th></tr>${rows.map(r=>`<tr><td>${r.sec.num}. ${r.sec.title}</td><td>${r.seen} of ${r.n}</td><td>${r.pct===null?'<span class="muted">not started</span>':`<span class="${r.pct<60?"badtxt":r.pct<80?"":"good"}">${r.pct}%</span>`}</td></tr>`).join("")}</table>
   <div class="row"><a class="btn sm" href="#/quiz?s=${weak.sec.key}">Drill my weakest: ${weak.sec.title}</a></div></div>`;
}
/* progress backup: export / import as JSON */
IRStudy.exportFile = function(){ const blob = new Blob([JSON.stringify(S,null,1)], {type:"application/json"}); const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "ir-atlas-progress-" + new Date().toISOString().slice(0,10) + ".json"; a.click(); setTimeout(()=>URL.revokeObjectURL(a.href), 2000); };
IRStudy.importFile = function(file, done){ const r = new FileReader(); r.onload = ()=>{ try { const d = JSON.parse(r.result); ["learned","marks","mcq","cards","log"].forEach(k=>{ if (d[k]) S[k] = d[k]; }); save(); done(true); } catch(e){ done(false); } }; r.readAsText(file); };
/* numbers to know: every flashcard whose answer contains a number */
/* numbers from the lessons that have no flashcard of their own */
const NUM_EXTRA = [
 ["tools","Balloon size for angioplasty","10–20% larger than the vessel diameter",594],
 ["arterial","Pelvic volume after a 3 cm symphysis diastasis","doubles, to about 8 L",606],
 ["arterial","Normal pulmonary artery pressure","3–12 mmHg diastolic, 15–30 mmHg systolic",608],
 ["arterial","Bleeding rate needed for a positive angiogram","0.5–1.0 mL/min (tagged RBC scan 0.2–0.4; CTA about 0.35)",610],
 ["arterial","Type II endoleak: treat when the sac grows by","more than 5 mm",614],
 ["arterial","Intra-arterial tPA for acute limb ischemia","0.5 mg/h for 48–72 h",619],
 ["venous","Circumaortic left renal vein","2–10% of people",624],
 ["hepatobiliary","TIPS target portosystemic gradient","below 12 mmHg",634],
 ["hepatobiliary","TIPS tract balloon","8 mm × 3–4 cm",635],
 ["hepatobiliary","BRTO occlusion balloon left in place","4–24 h",636],
 ["gu","Serious complications after UAE","about 1.25%",644],
 ["lines","Surgical AV fistula","85% patent at 2 years; about 30% fail to mature",646],
 ["lines","Fistula intervention goal","venous-to-brachial pressure ratio below 0.4",646],
 ["lines","Thoracentesis limit","no more than 1 L in 24 h (re-expansion edema)",649],
 ["lines","Paracentesis before replacing albumin","up to 5 L",649],
 ["lines","Percutaneous gastrostomy","use after 24 h; keep the tube in at least 1 month",649]
];
IRStudy.renderNumbers = function(host){
  const secs = window.IR_SECTIONS; const has = c=>/\d/.test(c.back);
  host.innerHTML = `<div class="page numbers"><h1>Numbers to know</h1><p class="lead">The chapter's thresholds, doses, rates, sizes and levels: every flashcard with a number, plus figures from the lessons that have no card. Filter it, or print it as a one-page review.</p>
   <div class="row"><input type="search" placeholder="Filter, e.g. INR, cc/s, mm" data-f style="flex:1;max-width:360px"><button class="btn ghost" onclick="window.print()">Print</button></div>
   ${secs.map(sec=>{ const cs = IR_CARDS.filter(c=>c.section===sec.key && has(c)).map(c=>[c.front, c.back, c.page]).concat(NUM_EXTRA.filter(x=>x[0]===sec.key).map(x=>x.slice(1))).sort((a,b)=>a[2]-b[2]); if (!cs.length) return ""; return `<section data-sec><h2>${sec.num}. ${sec.title}</h2><table class="t">${cs.map(([f,b,pg])=>`<tr data-row><td>${esc(f)}</td><td><b>${esc(b)}</b></td><td class="muted">${pgLink(pg)}</td></tr>`).join("")}</table></section>`; }).join("")}</div>`;
  host.querySelector("[data-f]").oninput = e=>{ const q = e.target.value.toLowerCase(); host.querySelectorAll("[data-row]").forEach(r=>r.hidden = q && !r.textContent.toLowerCase().includes(q)); host.querySelectorAll("[data-sec]").forEach(sc=>sc.hidden = ![...sc.querySelectorAll("[data-row]")].some(r=>!r.hidden)); };
};

/* ---------------- MCQ ---------------- */
function shuffle(a){ a = a.slice(); for (let i=a.length-1;i>0;i--){ const j = Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }
IRStudy.renderQuiz = function(host, preset){
  const secs = window.IR_SECTIONS;
  host.innerHTML = `<div class="page"><h1>Question bank <span class="muted">(${IR_MCQ.length} board-style MCQs from the chapter)</span></h1>
  <div class="panel"><div class="secpick">${secs.map(s=>`<label class="chk"><input type="checkbox" value="${s.key}" ${!preset||preset===s.key?"checked":""}> ${s.num}. ${s.title} <span class="muted">(${IRStudy.mcqStats(s.key).n})</span></label>`).join("")}</div>
  <div class="row"><label>Questions <select data-n><option>10</option><option selected>20</option><option>40</option><option value="999">All</option></select></label>
  <label>Mode <select data-m><option value="practice">Practice (instant feedback)</option><option value="exam">Exam (timed, review at end)</option><option value="wrong">Review my mistakes</option><option value="new">Unseen only</option></select></label>
  <button class="btn" data-go>Start</button><button class="btn ghost" data-all>Toggle all</button></div></div>
  ${weakTable()}<div data-q></div></div>`;
  host.querySelector("[data-all]").onclick = ()=>{ const cbs = [...host.querySelectorAll(".secpick input")]; const on = !cbs.every(c=>c.checked); cbs.forEach(c=>c.checked=on); };
  host.querySelector("[data-go]").onclick = ()=>{
    const chosen = [...host.querySelectorAll(".secpick input:checked")].map(c=>c.value), mode = host.querySelector("[data-m]").value, n = +host.querySelector("[data-n]").value;
    let pool = IR_MCQ.filter(q=>chosen.includes(q.section));
    if (mode==="wrong") pool = pool.filter(q=>S.mcq[q.id] && !S.mcq[q.id].last);
    if (mode==="new") pool = pool.filter(q=>!S.mcq[q.id]);
    if (!pool.length) { host.querySelector("[data-q]").innerHTML = `<p class="panel">No questions match. ${mode==="wrong"?"No mistakes recorded yet — nice.":""}</p>`; return; }
    runQuiz(host.querySelector("[data-q]"), shuffle(pool).slice(0,n), mode==="exam");
  };
  if (preset) host.querySelector("[data-go]").click();
};
function runQuiz(box, qs, exam){
  let i = 0, ans = [], t0 = Date.now(), timer;
  const record = (q, ok)=>{ const r = S.mcq[q.id] || {n:0, ok:0}; r.n++; if (ok) r.ok++; r.last = ok?1:0; S.mcq[q.id] = r; save(); IRStudy.logQuiz("mcq", ok); };
  const finish = ()=>{ clearInterval(timer); const score = ans.filter((a,k)=>a===qs[k].answer).length;
    box.innerHTML = `<div class="panel"><h2>Score: ${score}/${qs.length} (${Math.round(score/qs.length*100)}%)</h2><p class="muted">Time ${Math.round((Date.now()-t0)/60000)} min</p>
    ${qs.map((q,k)=>`<details class="rev ${ans[k]===q.answer?"good":"badtxt"}"><summary>${ans[k]===q.answer?"✓":"✗"} ${esc(q.stem)}</summary><p><b>Answer:</b> ${esc(q.options[q.answer])}${ans[k]!==q.answer&&ans[k]!=null?` · you chose ${esc(q.options[ans[k]])}`:""}</p><p>${esc(q.explain)}</p>${srcLine(q)}</details>`).join("")}
    <div class="row"><a class="btn" href="#/quiz">New quiz</a></div></div>`; };
  const show = ()=>{
    const q = qs[i];
    box.innerHTML = `<div class="panel qcard"><div class="row"><span class="tag">${esc(secName(q.section))}</span><span class="muted">Question ${i+1}/${qs.length}</span><span class="sp"></span>${exam?'<span class="timer" data-t></span>':""}${pgLink(q.page, "muted")}</div>
     <p class="stem">${esc(q.stem)}</p><div class="opts">${q.options.map((o,k)=>`<button class="opt" data-k="${k}"><b>${"ABCD"[k]}</b> ${esc(o)}</button>`).join("")}</div><div class="qfb"></div>
     <div class="row"><button class="btn ghost" data-prev ${i?"":"disabled"}>Back</button><span class="sp"></span><button class="btn" data-next>${i===qs.length-1?"Finish":"Next"}</button></div></div>`;
    if (exam) { const t = box.querySelector("[data-t]"); const tick = ()=>{ const s = Math.round((Date.now()-t0)/1000); t.textContent = `${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`; }; tick(); clearInterval(timer); timer = setInterval(tick, 1000); }
    const opts = [...box.querySelectorAll(".opt")];
    if (ans[i]!=null) mark(ans[i], true);
    function mark(k, silent){
      opts.forEach(o=>o.classList.remove("sel","ok","bad"));
      if (exam) { opts[k].classList.add("sel"); return; }
      opts[q.answer].classList.add("ok"); if (k!==q.answer) opts[k].classList.add("bad");
      box.querySelector(".qfb").innerHTML = `<div class="${k===q.answer?"good":"badtxt"}"><b>${k===q.answer?"Correct":"Incorrect"}.</b></div><p>${esc(q.explain)}</p>${srcLine(q)}`;
    }
    opts.forEach(o=>o.onclick=()=>{ const k = +o.dataset.k; if (!exam && ans[i]!=null) return; const first = ans[i]==null; ans[i] = k; if (first || exam) { if (!exam) record(q, k===q.answer); } mark(k); });
    box.querySelector("[data-prev]").onclick = ()=>{ i--; show(); };
    box.querySelector("[data-next]").onclick = ()=>{ if (i===qs.length-1){ if (exam) qs.forEach((qq,k)=>{ if (ans[k]!=null) record(qq, ans[k]===qq.answer); }); finish(); } else { i++; show(); } };
  };
  show();
}
IRStudy.miniQuiz = function(host, sec, n){
  const qs = shuffle(IR_MCQ.filter(q=>q.section===sec)).slice(0, n||3);
  host.innerHTML = `<div class="miniq"><h4>Quick check</h4><div></div><a class="btn sm ghost" href="#/quiz?s=${sec}">Full ${secName(sec)} quiz</a></div>`;
  runQuiz(host.querySelector(".miniq > div"), qs, false);
};

/* ---------------- Flashcards (SM-2) ---------------- */
IRStudy.renderCards = function(host){
  const secs = window.IR_SECTIONS;
  host.innerHTML = `<div class="page"><h1>Flashcards <span class="muted">(${IR_CARDS.length} cards, spaced repetition)</span></h1>
   <div class="panel"><div class="secpick">${secs.map(s=>`<label class="chk"><input type="checkbox" value="${s.key}" checked> ${s.num}. ${s.title} <span class="muted">(${IRStudy.dueCards([s.key]).length} due)</span></label>`).join("")}</div>
   <div class="row"><button class="btn" data-go>Study due cards</button><button class="btn ghost" data-cram>Cram all (ignore schedule)</button></div></div><div data-c></div></div>`;
  const run = cram=>{ const chosen = [...host.querySelectorAll(".secpick input:checked")].map(c=>c.value);
    let deck = cram ? IR_CARDS.filter(c=>chosen.includes(c.section)) : IRStudy.dueCards(chosen);
    deck = shuffle(deck); const box = host.querySelector("[data-c]"); let i = 0;
    if (!deck.length) { box.innerHTML = `<div class="panel">Nothing due. Come back tomorrow, or cram.</div>`; return; }
    const show = ()=>{ if (i>=deck.length) { box.innerHTML = `<div class="panel"><h3>Session done: ${deck.length} cards.</h3></div>`; return; }
      const c = deck[i];
      box.innerHTML = `<div class="flash" tabindex="0"><div class="row"><span class="tag">${esc(secName(c.section))}</span><span class="muted">${i+1}/${deck.length}</span><span class="sp"></span>${pgLink(c.page, "muted")}</div>
       <div class="fface"><div class="front">${esc(c.front)}</div><div class="back" hidden>${esc(c.back)}</div></div>
       <div class="row fbtns"><button class="btn" data-flip>Show answer (space)</button></div></div>`;
      const flip = ()=>{ box.querySelector(".back").hidden = false; box.querySelector(".fbtns").innerHTML = [["again","Again",0],["hard","Hard",3],["good","Good",4],["easy","Easy",5]].map((b,k)=>`<button class="btn ${b[0]==="again"?"ghost":""}" data-g="${b[2]}">${b[1]} <small class="muted">${k+1}</small></button>`).join(""); box.querySelectorAll("[data-g]").forEach(b=>b.onclick=()=>grade(+b.dataset.g)); };
      const grade = q=>{ const r = S.cards[c.id] || {ef:2.5, iv:0, reps:0}; if (q<3){ r.reps = 0; r.iv = 0; deck.push(c); } else { r.reps++; r.iv = r.reps===1?1:r.reps===2?6:Math.round(r.iv*r.ef); r.ef = Math.max(1.3, r.ef + 0.1 - (5-q)*(0.08+(5-q)*0.02)); }
        r.due = today() + r.iv; S.cards[c.id] = r; save(); i++; show(); };
      box.querySelector("[data-flip]").onclick = flip;
      box.querySelector(".flash").onkeydown = e=>{ if (e.code==="Space"){ e.preventDefault(); if (box.querySelector(".back").hidden) flip(); } else if (/^Digit[1-4]$/.test(e.code) && !box.querySelector(".back").hidden) grade([0,3,4,5][+e.code.slice(5)-1]); };
      box.querySelector(".flash").focus();
    };
    show(); };
  host.querySelector("[data-go]").onclick = ()=>run(false);
  host.querySelector("[data-cram]").onclick = ()=>run(true);
};
})();
