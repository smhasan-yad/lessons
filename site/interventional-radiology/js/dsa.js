/* DSA page: (1) real angiograms from the book with hotspots, cine and quizzes; (2) a run simulator driven by the 3D vessel tree. */
(function(){
const esc = s => String(s).replace(/[&<>"]/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
let SIM = null;

function render(host, params){
  /* real angiograms exist only in the private study build (js/dsa_figs.js); the public build is simulator-only */
  const REAL = (window.IR_DSA||[]).length > 0;
  const mode = REAL ? (params.get("m") || "real") : "sim";
  host.innerHTML = `<div class="page dsapage"><h1>DSA runs</h1>
   <p class="lead">${REAL?"Read real angiograms from the chapter, then acquire":"Acquire"} your own runs on the 3D anatomy: pick the catheter position, injection and C-arm angle, and watch contrast move through arterial, parenchymal and venous phases.</p>
   ${REAL?`<div class="seg" role="tablist"><button data-m="real" class="${mode==="real"?"on":""}">Real angiograms</button><button data-m="sim" class="${mode==="sim"?"on":""}">Run simulator</button></div>`:""}
   <div data-body></div></div>`;
  host.querySelectorAll("[data-m]").forEach(b=>b.onclick=()=>{ location.hash = "#/dsa?m="+b.dataset.m; });
  const body = host.querySelector("[data-body]");
  if (mode === "sim") sim(body, params); else real(body, params.get("f"));
}
function destroy(){ if (window.IRDSASIM) IRDSASIM.destroy(); }

/* ------------------------------------------------------------------ real angiograms */
const GROUPS = [["Phases of a run",["p598_0","p598_1","p598_2","p598_3"]],["Celiac axis",["p599_0","p599_2"]],["SMA and IMA",["p601_3"]],["Pelvis",["p603_0"]],["Upper limb",["p616_0","p616_1","p616_2","p617_0"]],["Lower limb runoff",["p618_0","p618_1","p618_2","p618_3"]]];
function real(body, start){
  const D = {}; (window.IR_DSA||[]).forEach(f=>D[f.id]=f);
  const first = start && D[start] ? start : "p599_2";
  body.innerHTML = `<div class="dsa-real">
    <nav class="dsa-list">${GROUPS.map(([g,ids])=>`<h4>${g}</h4>${ids.filter(i=>D[i]).map(i=>`<button data-f="${i}">${esc(D[i].title)}</button>`).join("")}`).join("")}</nav>
    <div class="dsa-view">
      <div class="dsa-toolbar"><div class="seg small" data-mode><button data-k="explore" class="on">Explore</button><button data-k="quiz">Find the vessel</button></div>
        <label class="sw inline"><span>Labels</span><input type="checkbox" data-lbl checked><i></i></label><label class="sw inline"><span>Book labels</span><input type="checkbox" data-book><i></i></label><label class="sw inline"><span>Invert</span><input type="checkbox" data-inv><i></i></label>
        <label class="wl">Window <input type="range" min="40" max="260" value="100" data-ct></label><label class="wl">Level <input type="range" min="40" max="180" value="100" data-br></label></div>
      <div class="dsa-stage" tabindex="0"><div class="dsa-pan"><img alt="" draggable="false"><svg class="dsa-hot"></svg></div></div>
      <div class="dsa-q"></div>
      <p class="dsa-cap muted small"></p>
    </div></div>`;
  const stage = body.querySelector(".dsa-stage"), pan = body.querySelector(".dsa-pan"), img = pan.querySelector("img"), svg = pan.querySelector("svg"), qbox = body.querySelector(".dsa-q"), cap = body.querySelector(".dsa-cap");
  let cur = null, mode = "explore", zoom = 1, ox = 0, oy = 0, target = null, score = [0,0], cine = null;
  const applyView = ()=>{ pan.style.transform = `translate(${ox}px,${oy}px) scale(${zoom})`; img.style.filter = `contrast(${body.querySelector("[data-ct]").value}%) brightness(${body.querySelector("[data-br]").value}%)` + (body.querySelector("[data-inv]").checked ? " invert(1)" : ""); };
  ["[data-ct]","[data-br]","[data-inv]"].forEach(s=>body.querySelector(s).addEventListener("input", applyView));
  stage.addEventListener("wheel", e=>{ e.preventDefault(); const r = stage.getBoundingClientRect(); const mx = e.clientX - r.left, my = e.clientY - r.top; const nz = Math.min(5, Math.max(1, zoom*(e.deltaY<0?1.15:1/1.15))); ox = mx - (mx-ox)*nz/zoom; oy = my - (my-oy)*nz/zoom; zoom = nz; if (zoom===1){ox=0;oy=0;} applyView(); }, {passive:false});
  let drag = null; stage.addEventListener("pointerdown", e=>{ drag = [e.clientX, e.clientY, ox, oy, false]; });
  window.addEventListener("pointermove", e=>{ if (!drag || zoom===1) return; drag[4] = true; ox = drag[2] + e.clientX - drag[0]; oy = drag[3] + e.clientY - drag[1]; applyView(); });
  window.addEventListener("pointerup", ()=>{ setTimeout(()=>drag=null, 0); });
  stage.addEventListener("dblclick", ()=>{ zoom = 1; ox = oy = 0; applyView(); });
  const drawHot = ()=>{
    if (!cur || cur.kind !== "labels") { svg.innerHTML = ""; return; }
    const show = body.querySelector("[data-lbl]").checked && mode === "explore";
    svg.setAttribute("viewBox", "0 0 1000 "+Math.round(1000*cur.h/cur.w));
    const H = 1000*cur.h/cur.w;
    svg.innerHTML = cur.hot.map((h,i)=>{ const x = h.x*1000, y = h.y*H, right = h.x < 0.62;
      return `<g class="hs" data-i="${i}"><circle cx="${x}" cy="${y}" r="9"/>${show?`<line x1="${x}" y1="${y}" x2="${x+(right?26:-26)}" y2="${y-14}"/><text x="${x+(right?30:-30)}" y="${y-10}" text-anchor="${right?"start":"end"}">${esc(h.t)}</text>`:""}</g>`; }).join("");
    svg.querySelectorAll(".hs").forEach(g=>{ g.onmouseenter = ()=>{ if (mode==="explore") cap.dataset.h = cur.hot[+g.dataset.i].t, qbox.innerHTML = `<b>${esc(cur.hot[+g.dataset.i].t)}</b>`; }; });
  };
  const nextQ = ()=>{
    if (cur.kind === "phase") {
      const ph = ["p598_0","p598_1","p598_2","p598_3"]; const pick = ph[Math.floor(Math.random()*4)]; load(pick, true);
      qbox.innerHTML = `<b>Which phase is this frame?</b> ${["Early arterial","Late arterial","Parenchymal","Venous"].map(a=>`<button class="btn sm ghost" data-a="${a}">${a}</button>`).join(" ")} <span class="muted">${score[0]} of ${score[1]}</span>`;
      qbox.querySelectorAll("[data-a]").forEach(b=>b.onclick=()=>{ score[1]++; const ok = b.dataset.a===cur.answer; if (ok) score[0]++; b.classList.add(ok?"ok":"bad"); if (!ok) qbox.querySelector(`[data-a="${cur.answer}"]`).classList.add("ok"); if (window.IRStudy) IRStudy.logQuiz("dsa", ok); setTimeout(nextQ, ok?700:1500); });
      return;
    }
    const names = [...new Set(cur.hot.map(h=>h.t))]; target = names[Math.floor(Math.random()*names.length)];
    qbox.innerHTML = `<b>Click the ${esc(target)}.</b> <span class="muted">${score[0]} of ${score[1]}</span> <button class="btn sm ghost" data-skip>Show me</button>`;
    qbox.querySelector("[data-skip]").onclick = ()=>reveal(false, null);
  };
  const reveal = (ok, pt)=>{
    const H = 1000*cur.h/cur.w; let s = svg.innerHTML;
    cur.hot.filter(h=>h.t===target).forEach(h=>{ s += `<circle class="ans" cx="${h.x*1000}" cy="${h.y*H}" r="22"/>`; });
    if (pt) s += `<circle class="${ok?"hit":"miss"}" cx="${pt[0]}" cy="${pt[1]}" r="8"/>`;
    svg.innerHTML = s; setTimeout(()=>{ drawHot(); nextQ(); }, ok?800:1700);
  };
  svg.addEventListener("click", e=>{
    if (mode!=="quiz" || !target || (drag && drag[4])) return;
    const r = svg.getBoundingClientRect(); const x = (e.clientX - r.left)/r.width*1000, y = (e.clientY - r.top)/r.height*(1000*cur.h/cur.w);
    const H = 1000*cur.h/cur.w; const d = Math.min(...cur.hot.filter(h=>h.t===target).map(h=>Math.hypot(h.x*1000-x, h.y*H-y)));
    const ok = d < 75; score[1]++; if (ok) score[0]++; if (window.IRStudy) IRStudy.logQuiz("dsa", ok); reveal(ok, [x,y]);
  });
  function load(id, keepQuiz){
    cur = D[id]; body.querySelectorAll("[data-f]").forEach(b=>b.classList.toggle("on", b.dataset.f===id));
    const book = body.querySelector("[data-book]").checked;
    img.src = `book/fig/${id}${book?"_lab":""}.jpg`; zoom = 1; ox = oy = 0; applyView();
    cap.innerHTML = `${esc(cur.caption||"")} <a href="#/book/${cur.page}">Book page ${cur.page}</a>`;
    if (cine) { clearInterval(cine); cine = null; }
    if (cur.kind === "phase" && !keepQuiz) {
      qbox.innerHTML = `<b>${esc(cur.title)}:</b> ${esc(cur.answer)} phase. <button class="btn sm" data-cine>Play the run</button> <span class="muted small">2 frames per second, like a real acquisition.</span>`;
      qbox.querySelector("[data-cine]").onclick = ()=>{ let k = 0; const ph = ["p598_0","p598_1","p598_2","p598_3"]; if (cine) clearInterval(cine);
        cine = setInterval(()=>{ const f = D[ph[k%4]]; img.src = `book/fig/${f.id}.jpg`; qbox.firstElementChild.textContent = f.answer+" phase"; k++; if (k>11){ clearInterval(cine); cine = null; } }, 500); };
    } else if (!keepQuiz) qbox.innerHTML = mode==="quiz" ? "" : `<span class="muted">Hover a marker to name it. Scroll to zoom, drag to pan, double-click to reset.</span>`;
    drawHot(); if (mode==="quiz" && !keepQuiz) nextQ();
  }
  body.querySelectorAll("[data-f]").forEach(b=>b.onclick=()=>load(b.dataset.f));
  body.querySelectorAll("[data-mode] button").forEach(b=>b.onclick=()=>{ body.querySelectorAll("[data-mode] button").forEach(x=>x.classList.toggle("on",x===b)); mode = b.dataset.k; drawHot(); if (mode==="quiz") nextQ(); else load(cur.id); });
  body.querySelector("[data-lbl]").addEventListener("change", drawHot);
  body.querySelector("[data-book]").addEventListener("change", ()=>{ img.src = `book/fig/${cur.id}${body.querySelector("[data-book]").checked?"_lab":""}.jpg`; });
  img.onload = ()=>{ stage.style.aspectRatio = `${img.naturalWidth} / ${img.naturalHeight}`; };
  load(first);
}

/* ------------------------------------------------------------------ run simulator (js/dsa_sim.js) */
function sim(body, params){ if (window.IRDSASIM) IRDSASIM.mount(body, {cath: params && params.get("c"), case: params && params.get("case")}); else body.innerHTML = '<p class="warn">Simulator script not loaded.</p>'; }
window.IRDSA = {render, destroy};
})();
