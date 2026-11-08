// Checks for the DSA simulator's physics core. Run: node tools/test_dsa_core.js
global.window = {};
require("../js/dsa_sim.js");
const C = window.IRDSASIM._core;
let ok = true;
const chk = (name, cond) => { console.log((cond ? "PASS " : "FAIL ") + name); ok = ok && cond; };

// 1. Mass conservation: the time integral of the bolus equals the injection duration, whatever the dispersion.
for (const [Ti, tau] of [[3, 0], [5, 2], [4, 6]]) {
  const [sg, th] = C.dispersion(tau); let a = 0;
  for (let x = -5; x < 60; x += 0.01) a += C.bolus(x, Ti, sg, th) * 0.01;
  chk(`bolus area = injection time (Ti ${Ti}, transit ${tau} s): ${a.toFixed(3)}`, Math.abs(a - Ti) < 0.02);
}
// 2. Concentration never exceeds the mixed strength.
let mx = 0; for (let x = -2; x < 20; x += 0.01) mx = Math.max(mx, C.bolus(x, 5, 0.12, 0.18));
chk(`bolus never exceeds 1 (${mx.toFixed(3)})`, mx <= 1.0001);
// 3. Dispersion: a short bolus far downstream peaks lower and later.
const peak = tau => { const [sg, th] = C.dispersion(tau); let m = 0, mt = 0; for (let x = 0; x < 30; x += 0.01) { const v = C.bolus(x, 1, sg, th); if (v > m) { m = v; mt = x; } } return [m, mt]; };
const p0 = peak(0), p8 = peak(8);
chk(`dispersion lowers the peak (${p0[0].toFixed(2)} -> ${p8[0].toFixed(2)})`, p0[0] > p8[0]);
chk(`dispersion delays the peak (${p0[1].toFixed(2)} -> ${p8[1].toFixed(2)} s after arrival)`, p0[1] < p8[1]);
// 4. Stenosis: little flow loss at 50%, critical near 70%, near-occlusive at 90%.
chk(`50% stenosis keeps most flow (${C.stenFlow(0.5).toFixed(2)})`, C.stenFlow(0.5) > 0.7);
chk(`70% stenosis is flow-limiting (${C.stenFlow(0.7).toFixed(2)})`, C.stenFlow(0.7) < 0.4);
chk(`90% stenosis is near-occlusive (${C.stenFlow(0.9).toFixed(3)})`, C.stenFlow(0.9) < 0.01);
// 5. Venous transit-time distribution is a proper density.
let g = 0; for (let t = 0; t < 60; t += 0.01) g += C.gammaPdf(t, 4, 3) * 0.01;
chk(`gamma transit-time density integrates to 1 (${g.toFixed(3)})`, Math.abs(g - 1) < 0.01);
// 6. Every catheter position has a flow, a chapter rate and a stenosis target.
chk("catheter table complete", C.CATH.every(c => c.qb > 0 && c.rate > 0 && c.vol > 0 && c.sten && c.sten[0]));
// 7. The chapter's guide rate never refluxes (reflux threshold is 1.3 × resting flow for selective runs).
chk("chapter guide rates do not reflux", C.CATH.every(c => c.flush || c.rate <= 1.3 * c.qb));
process.exit(ok ? 0 : 1);
