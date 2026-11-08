/* Lesson content: Core Radiology 2e, Chapter 9 Interventional Radiology (book pages 588-649).
   Every subsection of the chapter is represented. `page` = printed book page.
   <div class="widget" data-w="name"></div> embeds an interactive tool from widgets.js.
   <span class="v3d" data-v="id">text</span> links to a vessel in the 3D explorer. */
window.IR_SECTIONS = [
{
 key:"intro", num:1, title:"Introduction to IR", sub:"Pre-procedure care, bleeding risk, hemostasis", pages:[589,591], color:"#7dd3fc",
 topics:[
 {id:"prep", title:"Pre-procedure preparation", page:589, html:`
  <p>Every IR procedure starts with a <b>consultation</b>: directed history and examination, discussion of risks and benefits, <b>formal signed consent</b>, and any safety concerns.</p>
  <h4>Anesthesia: three levels</h4>
  <table class="t"><tr><th>Level</th><th>What</th><th>Who / reversal</th></tr>
  <tr><td>Local</td><td>Lidocaine injection, or lidocaine cream/gel</td><td>Operator</td></tr>
  <tr><td>Moderate sedation</td><td>IV <b>midazolam + fentanyl</b></td><td>Non-anesthesiologist staff with continuous monitoring. Reversal: <b>naloxone</b> (opioid, peak 1–2 min), <b>flumazenil</b> (benzodiazepine, peak 6–10 min)</td></tr>
  <tr><td>Anesthesiology</td><td>MAC (deep sedation) or general endotracheal anesthesia</td><td>Anesthesia team</td></tr></table>
  <p>The choice depends on patient factors, patient preference and how invasive the procedure is.</p>
  <h4>Fasting (ASA)</h4>
  <div class="widget" data-w="npo"></div>
  <p>NPO is <b>not needed for local anesthesia</b>. For sedation: <b>8 h</b> full meal (meat, fried, fatty) · <b>6 h</b> light meal (toast + clear liquids) · <b>2 h</b> clear liquids (water, pulp-free juice, black coffee).</p>
  <h4>Allergies</h4>
  <p>Most IR procedures use iodinated contrast, so screen for allergy and premedicate when indicated. Alternatives: <b>gadolinium</b>, <b>barium</b> (and CO₂, used in TIPS).</p>
  <h4>Prophylactic antibiotics</h4>
  <table class="t"><tr><th>Class</th><th>Examples</th><th>Antibiotics</th></tr>
  <tr><td>Clean</td><td>Line/port, angiography/angioplasty, IVC filter, stent</td><td>Generally not needed</td></tr>
  <tr><td>Clean-contaminated</td><td>Solid organ necrosis (embolization, ablation), TIPS</td><td>Consider</td></tr>
  <tr><td>Dirty</td><td>Traverses GI, biliary or urinary tract; known infection (abscess)</td><td>Recommended</td></tr></table>`},
 {id:"consent", title:"Procedural consent risks", page:589, html:`
  <p>Not exhaustive, but these are the main risks to cover in consent, from general to procedure-specific. Use the checklist builder to pull up the ones for a given procedure.</p>
  <div class="widget" data-w="checklist"></div>
  <ul class="cols">
  <li><b>Any procedure:</b> bleeding, infection, injury to the target organ</li>
  <li><b>Sedation:</b> allergy, depressed breathing and circulation</li>
  <li><b>Angiography:</b> contrast reactions; access-vessel injury (hematoma, dissection, pseudoaneurysm, thrombosis)</li>
  <li><b>Ablation:</b> abscess, biliary stricture, collateral injury (bowel above all)</li>
  <li><b>Biliary drainage:</b> bile leak, biliary sepsis</li>
  <li><b>Biopsy:</b> a nondiagnostic sample</li>
  <li><b>Embolization (any):</b> post-embolization syndrome, nontarget embolization</li>
  <li><b>Gastrostomy:</b> bowel injury, tube placed in the colon or peritoneum</li>
  <li><b>GI embolization:</b> bowel infarction</li>
  <li><b>GU procedures:</b> urosepsis</li>
  <li><b>IVC filter:</b> caval thrombosis, filter migration or perforation</li>
  <li><b>Lung procedures:</b> systemic air embolism, pneumothorax</li>
  <li><b>Pelvic embolization:</b> bladder or rectal ischemia, buttock claudication, impotence</li>
  <li><b>TACE:</b> biloma or abscess, liver failure</li>
  <li><b>Thrombolysis:</b> major bleeding including intracranial, distal emboli, reperfusion syndrome</li>
  <li><b>TIPS:</b> encephalopathy, liver failure, death</li>
  <li><b>Transjugular liver biopsy:</b> capsule perforation with major bleeding</li>
  <li><b>Uterine fibroid embolization:</b> expulsion of a submucosal fibroid, lower fertility, early menopause</li></ul>`},
 {id:"bleed", title:"Bleeding risk (SIR 2019)", page:590, html:`
  <p>SIR consensus guidelines (2019) split procedures into two bleeding-risk groups.</p>
  <div class="widget" data-w="bleedrisk"></div>
  <table class="t"><tr><th></th><th>Low bleeding risk</th><th>High bleeding risk</th></tr>
  <tr><td>Screening labs</td><td>PT/INR, platelets, Hb <b>not routinely</b> recommended</td><td><b>Routinely</b> recommended</td></tr>
  <tr><td>Thresholds</td><td>Correct if INR <b>&gt;2.0–3.0</b>; platelets <b>&gt;20</b> ×10⁹/L</td><td>Correct if INR <b>&gt;1.5–1.8</b>; platelets <b>&gt;50</b> ×10⁹/L</td></tr>
  <tr><td>Procedures</td><td>Catheter exchanges · arterial/venous interventions with <b>&lt;6 Fr</b> sheath · dialysis access · IVC filter placement and removal · lumbar puncture · venous access incl. ports · thoracentesis/paracentesis · superficial abscess drainage/biopsy · <b>transjugular liver biopsy</b></td><td>Ablations · arterial interventions with <b>&gt;7 Fr</b> sheath · catheter-directed thrombolysis · new tract through solid organ (deep abscess/biopsy, cholecystostomy, gastrostomy, nephrostomy) · complex IVC filter removal · <b>TIPS</b></td></tr></table>
  <h4>Anticoagulants and reversal</h4>
  <ul><li>For high-risk procedures, stop the drug for several half-lives or reverse it.</li>
  <li><b>Heparin / enoxaparin</b> → protamine sulfate</li>
  <li><b>Warfarin</b> (vitamin K antagonist) → IV vitamin K (at least 6–12 h) plus FFP or prothrombin complex concentrate (Kcentra)</li>
  <li><b>Apixaban, rivaroxaban</b> (factor Xa) → andexanet alfa (AndexXa)</li>
  <li>High thrombosis-risk patients may need <b>bridging</b>: heparin for anticoagulants, <b>cangrelor</b> for antiplatelets.</li></ul>
  <div class="pearl"><b>Trap:</b> transjugular liver biopsy is <i>low</i> risk (the needle stays inside the vein and liver), while TIPS is <i>high</i> risk.</div>`},
 {id:"hemostasis", title:"Achieving hemostasis", page:591, html:`
  <ul><li><b>Manual compression</b> is the standard of care.</li>
  <li><b>Arterial puncture:</b> firm continuous pressure for <b>at least 15 min</b>. Near-occlusive pressure for the first few minutes, then ease off so you can feel flow under your fingers. The arteriotomy lies <b>at least 1 cm above</b> (cranial to) the skin nick, so press there. Release slowly so the platelet plug is not dislodged. If oozing continues, re-apply pressure and do not keep releasing to check.</li>
  <li><b>Venous puncture:</b> usually 5–10 min, depending on venotomy size and clotting status.</li>
  <li><b>Closure devices:</b> more comfort, earlier mobility, fewer bleeding and vascular complications.</li>
  <li><b>Radial access:</b> wrist compression band, removed <b>1–2 h</b> after the procedure; earlier ambulation.</li></ul>`}
 ]},
{
 key:"tools", num:2, title:"Procedural tools", sub:"Needles, wires, catheters, sheaths, balloons, stents, embolics", pages:[592,595], color:"#a78bfa",
 topics:[
 {id:"sizing", title:"Needles, wires and sizing", page:592, html:`
  <div class="widget" data-w="sizer"></div>
  <ul><li><b>Needles: gauge.</b> Bigger number = smaller needle. <b>21–22 G</b>: first access, fine-needle aspiration, small abscesses, small vessels. <b>18 G</b>: large abscesses, large easy vessels, core biopsy.</li>
  <li><b>Wires: diameter in inches.</b> Standard <b>0.035″</b>; microwire <b>0.018″</b>. An 0.018″ wire passes a <b>22 G</b> needle (or bigger); an 0.035″ wire needs an <b>18 G</b> needle (or bigger).</li>
  <li><b>Catheters: outer size in French.</b> 1 Fr = 0.33 mm, so 6 Fr = 2 mm outer diameter (lumen slightly smaller).</li>
  <li><b>Sheaths: inner size in French.</b> A 6 Fr sheath accepts a 6 Fr catheter but is 7–8 Fr on the outside.</li></ul>`},
 {id:"wires", title:"Wire types", page:592, html:`
  <div class="widget" data-w="wires"></div>
  <table class="t"><tr><th>Type</th><th>Examples</th><th>Use</th></tr>
  <tr><td>Standard floppy / J-tip</td><td><b>Bentson</b> (20 cm floppy tip; standard or stiff shaft), <b>Rosen</b> (stiff shaft, short floppy tip, tight 1.5 mm J)</td><td>Safe blind insertion (then follow on fluoro)</td></tr>
  <tr><td>Hydrophilic</td><td><b>Glidewire</b> (Terumo), <b>Roadrunner</b> (Cook)</td><td>Crossing a stenosis; first cannulation of an indwelling device (check-and-change)</td></tr>
  <tr><td>Stiff</td><td><b>Amplatz</b> (Boston Sci), <b>Lunderquist</b> (Cook)</td><td>Rigidity: advancing anything that dilates soft tissue (sheath, biliary drain, nephrostomy)</td></tr></table>`},
 {id:"catheters", title:"Catheters and sheaths", page:593, html:`
  <div class="widget" data-w="catheters"></div>
  <ul><li><b>High-flow (flush)</b>: multiple sideholes; coiled (pigtail, OmniFlush), curved or straight. For large vessels (aorta, IVC) and to go up-and-over into the contralateral iliac.</li>
  <li><b>Selective / superselective</b>: single end hole; tip shape suits the task.
   <ul><li><b>C2, SOS</b>: reverse-curve, basic visceral selection</li>
   <li><b>Mickelson</b>: hard selections (bronchial, intercostal, lumbar); must be reformed in a large artery</li>
   <li><b>Simmons</b>: excellent stability for hard selections; must be reformed</li>
   <li><b>Berenstein, Kumpe, MPA</b>: angled tips</li></ul></li>
  <li><b>Sheaths</b> stabilise access during the procedure; a <b>peel-away sheath</b> holds access while a catheter is placed.</li></ul>`},
 {id:"pta", title:"Balloon angioplasty (PTA)", page:594, html:`
  <div class="widget" data-w="balloon"></div>
  <ul><li>PTA is <b>first-line</b> for a stenosis: a balloon makes a controlled stretch injury that enlarges the lumen. In atherosclerosis the intima ruptures and plaque extends into the media.</li>
  <li><b>Non-compliant</b> balloons (most): fixed diameter regardless of pressure, burst above rated pressure. A stenosis shows as a <b>"waist"</b>. <b>Cutting balloons</b> are non-compliant with microblades for tight strictures.</li>
  <li><b>Compliant</b> balloons inflate by volume and conform to the vessel: occlusion, or moulding a stent-graft to the wall.</li>
  <li>Choose a balloon <b>10–20% larger</b> than the vessel. Size = diameter (mm) × length (cm): "10 × 6" is 10 mm by 6 cm.</li>
  <li>Risks: distal emboli, rupture, dissection. Usually give <b>heparin</b>.</li></ul>`},
 {id:"stents", title:"Stents", page:594, html:`
  <div class="widget" data-w="stent"></div>
  <table class="t"><tr><th></th><th>Balloon-expandable</th><th>Self-expanding</th></tr>
  <tr><td>Radial force</td><td>Higher</td><td>Lower</td></tr>
  <tr><td>If crushed</td><td>Stays deformed</td><td>Springs back</td></tr>
  <tr><td>Best for</td><td>Sites with no external compression, where high radial force is wanted</td><td>Tortuous route; sites of external compression (joints, adductor canal)</td></tr></table>
  <ul><li><b>Bare metal</b>: scaffold; blood flows through the struts. <b>Covered (stent-graft)</b>: impervious new conduit for aneurysm, pseudoaneurysm, rupture, dissection and <b>TIPS</b>.</li>
  <li><b>Drug-eluting</b> stents release antiproliferative drug against in-stent stenosis.</li>
  <li>Sizing: <b>1–2 cm longer</b> than the stenosis, <b>1–2 mm wider</b> than the normal lumen. Rule of thumb: <b>10% oversize arterial</b>, <b>20% oversize venous</b>.</li></ul>`},
 {id:"embolics", title:"Principles of embolization", page:595, html:`
  <div class="widget" data-w="embolic"></div>
  <table class="t"><tr><th>Agent</th><th>Permanence</th><th>Key points</th></tr>
  <tr><td><b>Coils</b></td><td>Permanent</td><td>Thrombosis through stasis. Precise, quick, no distal embolization. Downside: no re-access distally. For a lesion, coil <b>distal first, then proximal</b> (closes the back door against retrograde collaterals).</td></tr>
  <tr><td><b>Plugs</b></td><td>Permanent</td><td>Cylinder baskets for larger, high-flow vessels: splenic trauma, PARTO for gastric varices.</td></tr>
  <tr><td><b>Particles</b></td><td>Permanent</td><td>Microns; trisacryl gelatin or PVA; flow distally to capillaries. Tumors, organs. Watch for nontarget embolization.</td></tr>
  <tr><td><b>Liquid (glue)</b></td><td>Permanent</td><td>Cyanoacrylate, ethylene vinyl alcohol; polymerise on contact with blood.</td></tr>
  <tr><td><b>Sclerosants</b></td><td>Permanent</td><td>Sodium tetradecyl sulfate, polidocanol, ethanol: endothelial damage, vessel shrinks over weeks. Lymphovascular malformations, varices, varicose veins.</td></tr>
  <tr><td><b>Gelatin sponge</b> (Gelfoam)</td><td>Temporary, 2–6 weeks</td><td>Most common temporary agent; emergent trauma bleeding. Post-procedure CT shows gas locules that mimic abscess.</td></tr>
  <tr><td><b>Autologous clot</b></td><td>Temporary</td><td></td></tr></table>
  <h4>Complications</h4>
  <ul><li><b>Post-embolization syndrome</b>: within the first day; pain, cramping, fever, nausea/vomiting from inflammatory mediators released by infarcted tissue. Treat with NSAIDs, opioids if needed, IV fluids.</li>
  <li><b>Nontarget embolization</b>: ovaries in fibroid embolization; brain (stroke) and spinal arteries (paralysis) in bronchial artery embolization.</li></ul>`}
 ]},
{
 key:"angio", num:3, title:"Angiography basics", sub:"Access, complications, injection rates, reading a run, anatomy", pages:[596,603], color:"#34d399",
 topics:[
 {id:"femoral", title:"Femoral arterial access", page:596, html:`
  <div class="widget" data-w="femoral"></div>
  <ul><li>The <b>common femoral artery</b> is the most common access. Check distal pulses and capillary refill before and after.</li>
  <li>The CFA starts below the inguinal ligament. Lateral to medial: <b>NAVL</b> (nerve, artery, vein, lymphatics).</li>
  <li><b>Target: inferomedial margin of the femoral head.</b> (1) The head is a hard backstop for compression. (2) Artery and nerve lie side by side there. Too low and the needle may cross the femoral vein → <b>AV fistula</b>. Too high (above the pelvic brim) → <b>retroperitoneal hematoma</b>.</li>
  <li>Angle the needle <b>45° cranially</b> for retrograde access (toward the aorta) or <b>45° caudally</b> for antegrade access (down the leg).</li></ul>`},
 {id:"radial", title:"Transradial access", page:596, html:`
  <div class="widget" data-w="barbeau"></div>
  <ul><li>Widely used for coronary work; gaining ground in IR, limited by operator experience.</li>
  <li><b>Pros:</b> earlier ambulation, better hemostasis, comfort. <b>Cons:</b> vasospasm (give a cocktail of heparin, nitroglycerin, verapamil); radial artery occlusion in 2–10%.</li>
  <li><b>Barbeau test</b> (alternative to Allen test): pulse oximeter on the ipsilateral <b>thumb</b>; compare the pleth tracing before, immediately after and 2 min after radial compression. <b>Type D</b> (absent, no recovery) → do not use transradial.</li>
  <li><b>Reverse Barbeau</b> for ulnar access: oximeter on the <b>fifth finger</b> while compressing the ulnar artery.</li></ul>`},
 {id:"accesscx", title:"Complications of vascular access", page:597, html:`
  <ul><li><b>Hematoma</b>: superficial (benign course) or <b>retroperitoneal</b> (can be fatal). RP risk rises with a high puncture above the pelvic brim.</li>
  <li><b>Pseudoaneurysm</b>: about 1% of arterial punctures. Color Doppler: swirling <b>yin-yang</b> flow with high-velocity jet at the neck. <b>&lt;1 cm</b>: watch. <b>&gt;1 cm</b>: <b>ultrasound-guided thrombin injection</b> (treatment of choice); US-guided compression is an alternative.</li>
  <li><b>AV fistula</b>: usually silent, may enlarge → high-output heart failure. Risk rises with a <b>low</b> puncture, where the femoral vein runs <i>deep</i> to the artery. Doppler: arterial flow in the vein, loss of triphasic arterial waveform, increased diastolic flow proximal to the fistula.</li></ul>`},
 {id:"rates", title:"Injection rates", page:597, html:`
  <div class="widget" data-w="rates"></div>
  <p>Said as <b>"cc/s for total cc"</b>: "25 for 50" = 25 cc/s, 50 cc total. Vessel diameter in mm ≈ rate in cc/s; total volume depends on the vascular bed.</p>`},
 {id:"air", title:"Air embolism", page:597, html:`
  <ul><li>Rare but potentially fatal. The most dangerous moment of venous access is <b>putting the catheter into the peel-away sheath</b>.</li>
  <li>Suspect it when the patient suddenly becomes hypoxic at that step.</li>
  <li>Place the patient <b>left lateral decubitus</b> (left side down) so air stays antidependent in the right heart; give <b>100% oxygen</b>; look for the bubble on fluoroscopy; aspirate through the catheter if large.</li></ul>`},
 {id:"reading", title:"Reading an angiogram", page:598, html:`
  <div class="widget" data-w="dsa"></div>
  <p>Mnemonic: <b>What, Where, When, VIA</b>.</p>
  <ul><li><b>What?</b> Angiogram, DSA or venogram?</li>
  <li><b>Where?</b> Where is the catheter, in which vessel? Flush catheter in a big vessel, or selective/superselective?</li>
  <li><b>When?</b> Early arterial, late arterial, parenchymal or venous phase? A vein filling in the arterial phase means a <b>shunt</b>.</li>
  <li><b>V – Vessels:</b> contrast where it should not be (extravasation, neovascularity)? Contour: dissection, irregularity, stenosis, encasement?</li>
  <li><b>I – Interventions:</b> stents, grafts, filters, coils, clips, drains?</li>
  <li><b>A – Anything else:</b> e.g., a fracture pointing to trauma.</li></ul>`},
 {id:"landmarks", title:"Abdominal arterial landmarks", page:599, html:`
  <div class="widget" data-w="landmarks"></div>
  <ul><li><span class="v3d" data-v="celiac">Celiac</span>: <b>T12</b> body</li>
  <li><span class="v3d" data-v="sma">SMA</span>: <b>T12–L1</b> disc</li>
  <li><span class="v3d" data-v="lrenal">Renal arteries</span>: <b>L1–L2</b> disc</li>
  <li><span class="v3d" data-v="ima">IMA</span>: <b>L3</b>, left of midline</li></ul>`},
 {id:"celiac", title:"Celiac axis and hepatic variants", page:599, html:`
  <div class="widget" data-w="celiac"></div>
  <ul><li>Classic anatomy in about <b>75%</b>: <span class="v3d" data-v="lga">left gastric</span>, <span class="v3d" data-v="cha">common hepatic</span>, <span class="v3d" data-v="splenic">splenic</span>. The left gastric can bleed in a <b>Mallory-Weiss</b> tear.</li>
  <li>CHA → <span class="v3d" data-v="gda">GDA</span> → continues as <span class="v3d" data-v="pha">proper hepatic</span> → right and left hepatic. <span class="v3d" data-v="cystic">Cystic artery</span> from the right hepatic.</li>
  <li><span class="v3d" data-v="lgea">Left gastroepiploic</span> (from splenic) meets the <span class="v3d" data-v="rgea">right gastroepiploic</span> (from GDA) along the greater curvature.</li>
  <li><b>Replaced right hepatic (RRHA)</b>, 10–18%: RHA arises from the SMA. Matters for laparoscopic cholecystectomy (arterial injury), SMA disease, and transplant: good in a <i>living right-lobe donor</i> (longer, larger artery), more arterial complications in a <i>recipient</i> (smaller CHA). Right-lobe ischemia from SMA stenosis is rarely relevant (collaterals + portal supply).</li>
  <li><b>Replaced left hepatic (RLHA)</b>, 11–12%: LHA arises from the left gastric. Matters for <b>gastrectomy</b>.</li>
  <li><b>Accessory</b> hepatic artery = extra artery while the normal one is also present: accessory right from SMA; accessory left from left gastric.</li></ul>`},
 {id:"sma", title:"SMA and IMA", page:601, html:`
  <ul><li><span class="v3d" data-v="sma">SMA</span> (anterior aorta, T12–L1) supplies the distal duodenum, all small bowel, and colon from cecum to <b>mid-transverse</b>.</li>
  <li>First branch: <span class="v3d" data-v="ipda">inferior pancreaticoduodenal</span>, which collateralises with the celiac (via superior PDA).</li>
  <li><span class="v3d" data-v="midcolic">Middle colic</span> → transverse colon; its collaterals to the IMA are the <b>marginal artery of Drummond</b> (along the colon) and the <b>arc of Riolan</b> (more central).</li>
  <li><span class="v3d" data-v="rcolic">Right colic</span> (retroperitoneal) → right colon and hepatic flexure. Terminal branch: <span class="v3d" data-v="ileocolic">ileocolic</span> → terminal ileum, cecum, appendix.</li>
  <li><span class="v3d" data-v="ima">IMA</span> (left anterior aorta, L3) → <span class="v3d" data-v="lcolic">left colic</span> (descending colon), <span class="v3d" data-v="sigmoid">sigmoid arteries</span> (variable number), terminates as the <span class="v3d" data-v="suprectal">superior rectal</span> (upper rectum).</li></ul>`},
 {id:"pelvic", title:"Iliac branches", page:602, html:`
  <div class="widget" data-w="pelvic"></div>
  <ul><li><b>External iliac:</b> <span class="v3d" data-v="rinfepi">inferior epigastric</span> (anastomoses with the superior epigastric); <b>deep circumflex iliac</b> (anastomoses with the internal iliac via the iliolumbar); continues past the inguinal ligament as the femoral artery.</li>
  <li><b>Internal iliac, anterior division</b> → most pelvic viscera: <b>inferior gluteal, obturator, internal pudendal</b>; variable origins for prostatic or uterine/vaginal, superior/inferior vesical and middle/inferior rectal arteries (identify by territory on selective runs).</li>
  <li><b>Posterior division</b> → pelvic and gluteal muscles: <b>lateral sacral, iliolumbar, superior gluteal</b>. Memory aid: "I Love Sitting" (Iliolumbar, Lateral sacral, Superior gluteal).</li>
  <li><b>Pathway of Winslow</b>: subclavian → internal mammary → superior epigastric → inferior epigastric → external iliac.</li>
  <li>Internal iliac arcades link the superior and middle rectal arteries.</li>
  <li><b>Corona mortis</b> ("crown of death"): obturator artery arising from the <b>external iliac</b>. Important in pelvic trauma and planning.</li></ul>`}
 ]},
{
 key:"arterial", num:4, title:"Arterial interventions", sub:"Trauma, bleeding, ischemia, aneurysms, limbs", pages:[604,619], color:"#f87171",
 topics:[
 {id:"trauma", title:"Trauma: general, aortic, renal", page:604, html:`
  <ul><li>Trauma is the commonest IR emergency; level 1 centers need 24/7 IR.</li>
  <li><b>Stable + low-grade</b> solid organ injury → conservative (resuscitation, vitals, labs, serial exams). <b>Stable + moderate/high grade with CT extravasation or pseudoaneurysm</b> → angiography and embolization, for contained or uncontained bleeding, to avoid surgery. Management of high-grade injuries varies by organ.</li>
  <li><b>Aorta:</b> CTA is the gold standard for diagnosis. Open repair is the gold-standard treatment; <b>endovascular stent-graft</b> repair is increasingly used. Classic site: pseudoaneurysm at the <b>aortic isthmus</b>.</li>
  <li><b>Kidney:</b> blunt in &gt;80%; hematuria usually present. A <b>horseshoe kidney</b> is vulnerable (not shielded by ribs, compressed against the spine). AAST OIS grades:
  <ul><li>I–III: nonexpanding hematoma or laceration without collecting-system injury → conservative</li>
  <li><b>IV</b>: laceration into the collecting system (urine extravasation on delayed CT) or vascular injury with contained bleeding → often <b>coil embolization</b></li>
  <li><b>V</b>: shattered kidney, hilar avulsion → surgery</li></ul></li>
  <li>Not in OIS but important: renal artery thrombosis, renal artery pseudoaneurysm. Endovascular indications: active extravasation, dissection, pseudoaneurysm → <b>superselective coils</b>.</li>
  <li><b>Renal AVF</b>: almost always acquired (trauma, biopsy); mostly silent and heal; if symptomatic, hematuria (also high-output failure, RP bleed). Angio: <b>vein fills in arterial phase</b>. Treat with coils, glue or alcohol.</li></ul>`},
 {id:"pelvictrauma", title:"Pelvic trauma", page:606, html:`
  <ul><li>A patient can exsanguinate into the pelvis: a <b>3 cm symphyseal diastasis doubles</b> pelvic volume to about <b>8 L</b>.</li>
  <li>With active bleeding and pelvic fractures, <b>angiography usually comes before orthopedic surgery</b>.</li>
  <li>Sequence: <b>nonselective pelvic arteriogram</b>, then selective bilateral internal iliac runs of anterior and posterior divisions.</li>
  <li>Rich collaterals make <b>rapid nonselective Gelfoam</b> of a whole anterior or posterior division acceptable. Do not waste time on superselective work when life is at risk.</li></ul>`},
 {id:"hemoptysis", title:"Massive hemoptysis and BAE", page:607, html:`
  <ul><li>Defined as roughly <b>300–600 mL in 24 h</b>. Kills by <b>asphyxia</b>, not shock, so hemodynamics do not measure severity.</li>
  <li><b>90% bronchial arteries</b>, most of the rest pulmonary. If bleeding continues after both, check subclavian, internal mammary, inferior phrenic and celiac.</li>
  <li>Causes: US: <b>cystic fibrosis, malignancy</b>; worldwide: <b>TB, fungal infection</b>. Risk factors: smoking, CF, vasculitis. Chronic inflammation hypertrophies bronchial arteries.</li>
  <li>Position <b>bleeding lung down</b>. Localise first with bronchoscopy or CTA.</li>
  <li><span class="v3d" data-v="rbronch">Bronchial arteries</span>: thoracic aorta at <b>T5–T6</b>, variable, usually 1–2 per side. Catheter: <b>Mickelson</b>.</li>
  <li>Embolize with <b>particles</b> to near-stasis. First exclude a <b>left-to-right shunt</b> (book wording; the real danger is any shunt that lets particles reach the systemic circulation and the brain). <b>Coils are rarely used</b>: rebleeding is common and coils block retreatment.</li>
  <li>Feared complication: nontarget embolization of the <b>anterior spinal artery</b> → paralysis. Document a full neuro exam beforehand.</li>
  <li><b>Book case:</b> hemoptysis from a mediastinal mass; the right bronchial arteries could not be accessed, so the common bronchial trunk was embolized with particles to complete stasis and the extravasation resolved. The mass was a thymoma.</li></ul>`},
 {id:"pulm", title:"Pulmonary angiography and pulmonary AVM", page:608, html:`
  <ul><li>Before pulmonary angiography, check the ECG for <b>LBBB</b>. The catheter can cause transient RBBB; with LBBB this means <b>complete heart block</b>. Place a <b>temporary pacer</b> first.</li>
  <li>Normal pressures: RA 0–8; RV 15–30/0–8; PA 15–30/3–12 mmHg.</li>
  <li><b>Pulmonary AVM</b>: PA-to-pulmonary-vein connection = <b>right-to-left shunt</b> (feeding artery from the pulmonary artery, draining vein to the <b>left atrium</b>). Multiple in <b>HHT</b> (Osler-Weber-Rendu): brain abscess, stroke, recurrent epistaxis.</li>
  <li>Treat with <b>coils</b>; <b>particles are contraindicated</b> (they cross to the brain). Usually one feeder: coil the feeding artery. (Contrast: a peripheral limb AVM needs the whole nidus treated.)</li>
  <li>Indications: asymptomatic with feeder <b>&gt;3 mm</b>, or symptomatic (prior stroke or brain abscess).</li></ul>`},
 {id:"ob", title:"Obstetric emergencies", page:609, html:`
  <ul><li><b>Antepartum hemorrhage</b> (previa, abruption, rupture): usually urgent C-section or hysterectomy. IR places <b>balloon catheters before the OR</b>, limits blood loss, controls hemorrhage, supports cell saver.</li>
  <li><b>Postpartum hemorrhage</b> (inversion, atony, genital tract trauma): IR interrogates the internal iliacs, often finding the <b>uterine artery</b>; embolize (Gelfoam is the usual agent for PPH).</li>
  <li><b>Uterine artery pseudoaneurysm</b>: presents weeks after delivery; diagnosed on US/CT; transcatheter embolization (coils). Alternatives: internal iliac or uterine artery ligation; hysterectomy last.</li></ul>`},
 {id:"gibleed", title:"GI bleeding", page:610, html:`
  <div class="widget" data-w="giflow"></div>
  <ul><li><b>Upper GI</b> (above the ligament of Treitz): <b>endoscopy first</b>. Embolize if endoscopy fails or the patient is too unstable, provided a bleed is seen on CTA or endoscopy.</li>
  <li><b>Empiric embolization</b> of the left gastric or GDA is possible with a negative angiogram, thanks to celiac–SMA collaterals. Not in the lower GI tract: poor collaterals, high infarct risk.</li>
  <li><b>Lower GI, stable</b>: localise first with CTA or tagged RBC scan (both more sensitive than angiography). <b>Unstable</b> with active bleeding: straight to angiography.</li>
  <li>Detection thresholds: <b>angiography 0.5–1.0 mL/min</b> · <b>CTA ~0.35 mL/min</b> · <b>tagged RBC 0.2–0.4 mL/min</b>.</li>
  <li><b>Vasopressin</b> infused into SMA or IMA: <b>0.2–0.4 U/min</b> (100 U in 500 mL saline at 1 mL/min) for up to <b>24 h</b>, then tachyphylaxis. Best for <b>antimesenteric</b> bleeders that catheters cannot reach. High rebleeding after stopping; major complications in up to <b>20%</b> (arrhythmia, pulmonary edema, hypertension).</li>
  <li><b>Diverticular bleeding</b>: most common lower GI bleed in older adults; usually settles. If extravasation: superselective coils or vasopressin. Book case: middle colic bleeder too distal to reach in a non-operative patient; coiled as selectively as possible despite the ischemia risk, bleeding stopped and there was no bowel ischemia.</li>
  <li><b>Angiodysplasia</b>: small age-related vascular malformation, a common cause of unexplained GI bleeding and anemia; most often cecum and ascending colon but can be anywhere in the GI tract; <b>Heyde syndrome</b> = aortic stenosis + angiodysplasia bleeding.</li>
  <li><b>Hemorrhoids</b>: coil (or particle) the distal <span class="v3d" data-v="suprectal">superior rectal</span> branches. Keeps tissue, continence, no wounds. Particles go more distal and may recur less.</li></ul>`},
 {id:"mesischemia", title:"Mesenteric ischemia", page:612, html:`
  <ul><li>Elderly; causes: acute embolism, chronic stenosis, venous occlusion, low flow. Split into acute and chronic.</li>
  <li><b>Acute</b>: catastrophic pain, often lactic acidosis; most often an <b>SMA embolus</b>. Embolus <b>distal to the middle colic</b> is worst (few collaterals). Usually <b>surgery</b> (embolectomy/bypass, inspect and resect bowel). Selected patients without peritonitis: thrombolysis or suction embolectomy (book case: catheter left across an SMA thrombus for overnight tPA, with much less clot and better jejunal flow the next day).</li>
  <li><b>NOMI</b> ("intestinal necrosis with a patent arterial tree"): 70–100% mortality, spasm of multiple branches. Treat with intra-arterial <b>papaverine</b> (60 mg bolus, then 30–60 mg/h).</li>
  <li><b>Chronic</b>: atherosclerosis; <b>postprandial pain out of proportion to exam</b>. Ostial narrowing with post-stenotic dilatation; best seen on <b>lateral aortogram</b>. Needs <b>2 of 3</b> mesenteric arteries diseased. Treat with angioplasty and stenting.</li></ul>`},
 {id:"aneurysm", title:"Aneurysms and endoleaks", page:614, html:`
  <div class="widget" data-w="endoleak"></div>
  <ul><li>Aneurysm = <b>1.5×</b> the normal diameter. True: all 3 layers. Pseudoaneurysm: 1–2 layers (trauma, malignancy, infection). Manage by rupture risk.</li>
  <li><b>EVAR</b>: lower perioperative morbidity and mortality than open repair.</li>
  <li><b>Type I</b>: seal failure at proximal (IA) or distal (IB) landing zone → <b>prompt</b> treatment: balloon the attachment, extra bare stent, or embolize.</li>
  <li><b>Type II</b>: <b>most common</b>; retrograde filling from <b>IMA or lumbars</b>. Often slow and self-thrombosing. Treat if persistent or sac grows <b>&gt;5 mm</b>: transarterial or direct sac puncture, embolize the feeder.</li>
  <li><b>Type III</b>: device failure (rare) → <b>prompt</b> new stent-graft over the defect + angioplasty.</li></ul>`},
 {id:"visceral", title:"Visceral aneurysms and renal artery stenosis", page:615, html:`
  <ul><li><b>Splenic artery aneurysm</b>: most common visceral aneurysm. Multiparous women, portal hypertension; ruptures in pregnancy. Pseudoaneurysm from trauma or pancreatitis.</li>
  <li>Treat if <b>symptomatic, &gt;2.5 cm, or before planned pregnancy</b>. Coils: <b>distal to the neck first, then proximal</b>.</li>
  <li><b>Proximal</b> splenic embolization: less pain, preserves splenic function via collaterals. Do it in the <b>mid splenic artery between the dorsal pancreatic and pancreatica magna</b> to avoid ischemic pancreatitis. Distal embolization = more infarction and pain.</li>
  <li><b>Hepatic artery aneurysm</b>: second most common. Same indications. Embolize the right hepatic <b>distal to the cystic artery</b> (proximal = ischemic cholecystitis in up to 10%).</li>
  <li><b>Renal artery stenosis</b>: atherosclerosis in older adults, at the <b>ostium and proximal third</b>. Benefit of angioplasty is debated; consider PTA ± stent for significant RAS with resistant hypertension, worsening renal function, bilateral disease, unexplained CHF or <b>recurrent flash pulmonary edema</b>.</li></ul>`},
 {id:"upperlimb", title:"Upper extremity", page:616, html:`
  <ul><li>Arch → brachiocephalic (right) or subclavian directly (left). Subclavian branches: <span class="v3d" data-v="lvert">vertebral</span>, <span class="v3d" data-v="lima">internal thoracic</span>, thyrocervical, costocervical, dorsal scapular.</li>
  <li>Past the lateral edge of the <b>first rib</b> → <span class="v3d" data-v="laxill">axillary</span> (3 parts, 6 branches). Past the lower edge of <b>teres major</b> → <span class="v3d" data-v="lbrach">brachial</span> (deep brachial branch) → divides in the antecubital fossa into <span class="v3d" data-v="lradial">radial</span> and <span class="v3d" data-v="lulnar">ulnar</span>.</li>
  <li>Radial and ulnar recurrent arteries anastomose with brachial branches. Common interosseous → anterior and posterior.</li>
  <li>Radial → snuffbox → <b>deep palmar arch</b>. Ulnar → <b>superficial palmar arch</b> → common palmar digital arteries.</li>
  <li><b>Hypothenar hammer</b>: ulnar artery injured over the <b>hamate</b> by repetitive trauma (jackhammer user) → intimal injury, thrombus, (pseudo)aneurysm → ischemia of digits 4–5 with distal emboli (the third finger can be involved too, as in the book case). Treatment is <b>surgical</b> (angio may miss the aneurysm).</li>
  <li><b>Buerger disease</b>: small/medium vessel vasculitis in male smokers; legs more than hands; ischemia, ulceration, even gangrene; small vessel occlusions with <b>corkscrew collaterals</b>.</li>
  <li><b>Raynaud</b>: cold-triggered vasospasm; poor digital perfusion that improves with warming or vasodilator; associated with scleroderma and connective tissue disease.</li></ul>`},
 {id:"lowerlimb", title:"Lower extremity and PAD", page:618, html:`
  <table class="t"><tr><th>TASC-II</th><th>Femoropopliteal lesion</th><th>Treatment</th></tr><tr><td>A</td><td>Single stenosis ≤10 cm</td><td>Endovascular is the treatment of choice</td></tr><tr><td>B</td><td>Multiple lesions each &lt;5 cm; single lesion &lt;15 cm</td><td>Endovascular preferred</td></tr><tr><td>C</td><td>Multiple stenoses or occlusions &gt;15 cm</td><td>Surgery preferred</td></tr><tr><td>D</td><td>Chronic total occlusion</td><td>Surgery is the treatment of choice</td></tr></table>
  <div class="widget" data-w="tasc"></div>
  <ul><li>EIA → <span class="v3d" data-v="rcfa">CFA</span> at the inguinal ligament → <span class="v3d" data-v="rpfa">profunda femoris</span> (posterior; medial and lateral circumflex; thigh and proximal femur) + <span class="v3d" data-v="rsfa">SFA</span>.</li>
  <li>SFA runs in the <b>adductor canal</b>, through the adductor hiatus → <span class="v3d" data-v="rpop">popliteal</span>. Below popliteus: <span class="v3d" data-v="rata">anterior tibial</span> (through interosseous membrane → <span class="v3d" data-v="rdp">dorsalis pedis</span>) and <b>tibioperoneal trunk</b> → <span class="v3d" data-v="rper">peroneal</span> (lateral compartment) + <span class="v3d" data-v="rpta">posterior tibial</span> (tarsal tunnel with tibial nerve → medial and lateral plantar).</li>
  <li><b>Acute limb ischemia</b>: 5 Ps (pain, pallor, poikilothermia, pulselessness, paresthesias). Blue toe syndrome. Upper limb emboli are mostly <b>cardiac (AF)</b>, less often a <b>subclavian artery aneurysm</b>; the typical upper-limb finding is <b>occlusion of the distal small arteries of the hand</b>. A central source gives bilateral emboli; a unilateral lesion gives unilateral emboli. Angio: abrupt cutoff with <b>meniscus sign</b>, often little atherosclerosis.</li>
  <li>Treatment: surgical embolectomy or bypass, or <b>catheter thrombolysis</b>: hydrophilic wire across, multi-sidehole infusion catheter, <b>tPA 0.5 mg/h for 48–72 h</b> in ICU with hematocrit and fibrinogen checks.</li></ul>
  <div class="widget" data-w="tpa"></div>`}
 ]},
{
 key:"venous", num:5, title:"Venous interventions", sub:"Compression syndromes, SVC, IVC filters, insufficiency", pages:[620,626], color:"#60a5fa",
 topics:[
 {id:"compression", title:"Venous compression syndromes", page:620, html:`
  <div class="widget" data-w="compress"></div>
  <h4>Paget-Schroetter (effort thrombosis)</h4>
  <ul><li>Subclavian vein compressed and thrombosed at the thoracic inlet, in <b>muscular young men</b>; intimal hyperplasia → thrombosis; arm swelling/pain worse with effort.</li>
  <li>Venography in <b>neutral and abducted</b> positions, <b>both sides</b> (often bilateral compression).</li>
  <li>Treatment: <b>thrombolysis, then surgical thoracic outlet decompression</b>. Residual stenosis → decompress before angioplasty, unless imaging showed no mechanical cause. <b>Avoid stents</b> (high failure). Book case: no mechanical cause on MRI, so the residual stenosis was dilated with an 8 mm × 4 cm balloon after 24 h of lysis.</li></ul>
  <h4>Nutcracker</h4>
  <ul><li><span class="v3d" data-v="lrv">Left renal vein</span> squeezed between <b>aorta and SMA</b>. Pain, hematuria, orthostatic proteinuria, pelvic congestion, varicocele. Asymptomatic = "nutcracker phenomenon".</li>
  <li>No firm guidelines: <b>observe</b> (hematuria often resolves within 2 years); else renal vein stent or surgery (left renal vein transposition).</li></ul>
  <h4>May-Thurner</h4>
  <ul><li><b>Left common iliac vein</b> compressed by the crossing <b>right common iliac artery</b> → spur, fibrosis, DVT. Equal in both sexes.</li>
  <li>Gold standard diagnosis: venography + <b>IVUS</b>. Treat with catheter-directed thrombolysis then <b>self-expanding stent</b>.</li>
  <li><b>Post-thrombotic syndrome</b> in up to half of DVT patients: edema, pain, ulceration, discoloration, varicose veins.</li></ul>`},
 {id:"svc", title:"SVC syndrome", page:622, html:`
  <ul><li><b>Acute</b> SVC obstruction: face and arm edema, cyanosis; a vascular emergency. <b>Chronic</b>: may be silent; facial edema that improves on standing.</li>
  <li>Causes: <b>thoracic malignancy</b>, catheter thrombosis, <b>fibrosing mediastinitis</b> (histoplasmosis).</li>
  <li>Classic CT sign: hot <b>segment IVa</b> enhancement from collateral flow through the <b>vein of Sappey</b> (falciform region ↔ internal thoracic veins).</li>
  <li>Treatment may need combined jugular + femoral access; <b>stenting</b> is often needed. Book case: small cell lung cancer, 15 mm × 5 cm Gianturco-Rosch stent restored flow.</li></ul>`},
 {id:"ivc", title:"IVC filters", page:623, html:`
  <div class="widget" data-w="ivcfilter"></div>
  <ul><li>Purpose: stop leg DVT reaching the lungs. Indications: DVT/PE with <b>contraindication to anticoagulation</b>; <b>recurrent PE despite anticoagulation</b>; high risk with contraindication (e.g., multitrauma).</li>
  <li>Complications: <b>access-site thrombosis</b> (most common) → IVC thrombosis → perforation (common, usually harmless) → fracture/embolization (rare).</li>
  <li>Step 1: <b>cavogram</b> with a pigtail catheter to choose filter and level.</li>
  <li>Position: <b>just below the lowest renal vein</b>, including variant veins, so the renal vein cannot carry clot around the filter. Pre-existing IVC thrombus may force higher placement.</li>
  <li><b>Duplicated IVC</b>: one filter above the confluence, or one in each IVC. Clue on cavogram: no inflow from the contralateral iliac.</li>
  <li><b>Circumaortic left renal vein</b> (2–10%): anterior and retroaortic limbs. <b>Retroaortic LRV</b> (2–7%): joins the IVC lower than the right renal vein.</li>
  <li><b>IVC interruption with azygos continuation</b>: associated with polysplenia and congenital heart disease; failure of the right subcardinal vein to join the hepatic segment.</li>
  <li>Most filters fit IVC <b>&lt;28–30 mm</b>. <b>Megacava (&gt;30 mm)</b>: Bird's Nest (up to 40 mm, permanent) or a filter in each common iliac vein.</li></ul>`},
 {id:"pcd", title:"Phlegmasia cerulea dolens", page:624, html:`
  <ul><li>Complete thrombotic occlusion of a limb's venous outflow: massive swelling, <b>cyanosis</b>, severe pain → capillary hypertension, ischemia, gangrene.</li>
  <li>Settings: malignancy, trauma, <b>HIT</b>, other prothrombotic states.</li>
  <li>Treatment: IV heparin plus angioplasty, catheter-directed thrombolysis or surgical thrombectomy.</li></ul>`},
 {id:"insuff", title:"Chronic venous insufficiency", page:625, html:`
  <h4>Pelvic venous congestion (ovarian vein reflux)</h4>
  <ul><li>Chronic pelvic pain in multiparous women. <b>Left gonadal vein</b> is usual: its acute angle of drainage predisposes to reflux (the book says "acute angle it makes with the IVC"; anatomically it drains into the left renal vein).</li>
  <li>Jugular or femoral access; venography of internal iliac veins and left renal vein; reflux on <b>Valsalva</b>.</li>
  <li>Coils in the <b>inferior ovarian vein at the inguinal canal</b>, then liquid embolic or foam above. Coils alone have high recurrence. Book case: platinum coils, then 1% sodium tetradecyl sulfate. Rare: coil migration to PA, thrombophlebitis, pain.</li></ul>
  <h4>Varicocele</h4>
  <ul><li>Pampiniform plexus varices. Primary (valve failure, common) vs secondary (mass). Usually <b>left</b>. An <b>isolated right varicocele → look for a retroperitoneal mass</b>.</li>
  <li>US: veins <b>&gt;2 mm</b>, "bag of worms", worse with Valsalva. Treat for pain, infertility, testicular atrophy. Coil embolization = surgical ligation in outcome.</li>
  <li>Access: left varicocele → right femoral or right IJ; right varicocele → IJ or basilic.</li></ul>
  <h4>Lower extremity venous insufficiency</h4>
  <ul><li>Venous hypertension from incompetent valves or prior DVT.</li>
  <li><b>Thermal ablation</b> (laser or RF) or <b>non-thermal</b> (sclerosant): endothelial damage → fibrosis → occlusion.</li>
  <li><b>Tumescent anesthesia</b> (lidocaine + saline + epinephrine) for thermal ablation: anesthetic and <b>heat sink</b> protecting the skin.</li>
  <li>Targets: GSV, SSV, anterior accessory GSV and tributaries. Sclerotherapy for small/superficial veins, perforators, sometimes deep veins. Compression stockings after all.</li></ul>`}
 ]},
{
 key:"lymph", num:6, title:"Lymphatic interventions", sub:"Thoracic duct anatomy and embolization", pages:[627,628], color:"#fbbf24",
 topics:[
 {id:"lymphanat", title:"Lymphatic anatomy", page:627, html:`
  <div class="widget" data-w="lymph"></div>
  <ul><li>The <span class="v3d" data-v="tduct">thoracic duct</span> carries <b>1–2 L/day</b>, mostly intestinal and hepatic lymph; flow rises with fatty meals.</li>
  <li>High hepatic sinusoidal pressure (<b>cirrhosis, right heart failure</b>) increases thoracic duct flow a lot.</li></ul>`},
 {id:"tde", title:"Chylous leak and thoracic duct embolization", page:628, html:`
  <div class="widget" data-w="tdesteps"></div>
  <ul><li>Causes: thoracic surgery (esophagectomy), abdominal surgery, lymphoma, idiopathic.</li>
  <li>First: <b>non-fat diet for 2–3 days</b>. Consent for <b>pancreatitis</b> and nontarget embolization.</li>
  <li><b>5 mL lipiodol per leg</b> (intranodal), then 20 mL saline push. The <span class="v3d" data-v="cchyli">cisterna chyli</span> appears at <b>L1–L3</b>.</li>
  <li>Puncture with a long (spinal/21 G trocar) needle, wire up into the chest, <b>coil the duct</b> as a scaffold, then glue <b>1:1 with lipiodol</b>.</li>
  <li>Watch the glue: if the IVC was crossed, glue can embolize to the <b>pulmonary arteries</b> (may or may not be symptomatic).</li>
  <li>Rare: visceral puncture (peritonitis, bleeding). Long-term: leg edema, chronic diarrhea, ascites.</li></ul>`}
 ]},
{
 key:"hepatobiliary", num:7, title:"Hepatobiliary interventions", sub:"Biopsy, biliary drainage, cholecystostomy, portal hypertension, TIPS, BRTO", pages:[629,636], color:"#4ade80",
 topics:[
 {id:"liver", title:"Cirrhosis and liver biopsy", page:629, html:`
  <ul><li>Angiographic sign of cirrhosis: <b>corkscrew hepatic artery branches</b>. A hypervascular mass in a cirrhotic liver may be <b>HCC</b>.</li>
  <li>Parenchymal biopsy grades fibrosis (cirrhosis, hepatitis, NAFLD, PBC); guides treatment and relapse prediction.</li>
  <li>US-guided, <b>peripheral</b> left or right lobe, avoiding large vessels, dilated ducts and the gallbladder.</li></ul>`},
 {id:"ptc", title:"Percutaneous transhepatic cholangiography and drainage", page:629, html:`
  <div class="widget" data-w="ptcsteps"></div>
  <ul><li>Indications: relieve <b>biliary obstruction</b>; <b>divert bile</b> after duct injury. Less often: stones, pre-surgical catheter to sew around.</li>
  <li><b>Antibiotics</b> (gram-negative, e.g., levofloxacin): stasis breeds bacteria.</li>
  <li><b>Right system</b>: midaxillary, two punctures, needle <b>over the rib</b> (neurovascular bundle runs under each rib). 22 G parallel to table, inject while withdrawing until a duct fills; second 21 G puncture as low as possible; 0.018″ wire → 5–6 Fr sheath → hydrophilic wire to small bowel → stiff wire (Amplatz) → drain. Cut extra sideholes if needed.</li>
  <li><b>Left system</b>: subxiphoid; US often shows the ducts so one puncture is enough.</li>
  <li><b>Never aspirate a biliary drain</b> (pulls bowel content in → cholangitis). Flushing is debated. Change every <b>3 months</b>.</li>
  <li><b>Metal stents</b> for life expectancy <b>&lt;6 months</b> (mostly permanent, patency 6–8 months; covered ones are removable). Plastic stents (endoscopic) can be exchanged. Internal/external drain = alternative, less comfortable.</li>
  <li>Contraindications mostly relative (avoid crossing tumor; drain ascites first).</li>
  <li>Complications: sepsis, hemorrhage, bile leak, <b>hemobilia</b> (arterio-biliary fistula), abscess.</li>
  <li><b>Bile duct injury</b>: mostly <b>laparoscopic cholecystectomy</b>, sometimes liver transplant → divert to a bag so the leak heals.</li></ul>`},
 {id:"psc", title:"Sclerosing cholangitis and malignant obstruction", page:631, html:`
  <ul><li><b>PSC</b>: multifocal intra- and extrahepatic strictures; presents with obstructive jaundice, malaise and abdominal pain; men; <b>ulcerative colitis</b>; leads to biliary cirrhosis and <b>cholangiocarcinoma</b>. Cure = transplant; drains palliate jaundice.</li>
  <li>DDx multifocal strictures: PSC, PBC, multifocal cholangiocarcinoma, chronic bacterial cholangitis, <b>AIDS cholangitis</b> (with papillary stenosis).</li>
  <li><b>Unilateral</b> obstruction (metastasis, duct tumor): usually only the affected side needs drainage.</li>
  <li><b>Hilar obstruction</b> (Klatskin): usually <b>two drains</b> (right and left), unless anatomy (right duct into left) allows one. MRCP helps plan. Cholangiogram: "shouldering" at the hilum.</li></ul>`},
 {id:"chole", title:"Percutaneous cholecystostomy", page:632, html:`
  <div class="widget" data-w="chole"></div>
  <ul><li>For acute calculous or acalculous cholecystitis in <b>non-surgical</b> patients. Temporizing for calculous; may <b>cure acalculous</b>. Cultures negative in 40%. Antibiotics.</li>
  <li><b>Transhepatic</b> (more common): midaxillary entry, intercostal or subcostal, under ultrasound, through the liver to the bare area; less bile leak, more liver laceration risk.</li>
  <li><b>Transperitoneal</b>: subcostal under the liver edge into the <b>fundus</b> (most mobile part); spares liver, more bile leak and incomplete tract.</li>
  <li>Remove only when: patient better · cystic and common ducts patent on cholangiogram · <b>≥6 weeks</b> for a mature tract (either route).</li></ul>`},
 {id:"portal", title:"Portal pressure and collaterals", page:633, html:`
  <div class="widget" data-w="hvpg"></div>
  <ul><li>Direct portal pressure needs a liver puncture, so we use <b>wedged hepatic vein pressure</b> from a jugular catheter (≈ portal pressure).</li>
  <li><b>Corrected sinusoidal gradient = wedged − free hepatic vein pressure</b>. Portal hypertension = gradient <b>&gt;5 mmHg</b>.</li></ul>
  <div class="widget" data-w="collaterals"></div>
  <ul><li>Esophageal varices: <b>coronary (left gastric) vein</b> → azygos/hemiazygos</li>
  <li>Gastric fundal varices: splenic vein → azygos</li>
  <li>Splenorenal shunt: splenic/short gastric → left adrenal/inferior phrenic → <b>left renal vein</b></li>
  <li>Mesenteric varices: SMV/IMV → iliac veins</li>
  <li>Caput medusae: <b>umbilical (paraumbilical) vein</b> → epigastric veins</li>
  <li>Hemorrhoids: IMV → inferior hemorrhoidal veins</li></ul>`},
 {id:"tips", title:"TIPS", page:634, html:`
  <div class="widget" data-w="tips"></div>
  <ul><li>Connects <b>portal vein to hepatic vein</b> to drop portal pressure.</li>
  <li>Indications: <b>variceal bleeding</b> not controlled endoscopically, <b>refractory ascites</b>; also Budd-Chiari, hepatic hydrothorax.</li>
  <li>Assess with <b>Child-Pugh</b> (INR, bilirubin, albumin + ascites, encephalopathy) or <b>MELD</b> (INR, bilirubin, creatinine). Higher MELD = higher post-TIPS mortality.</li>
  <li><b>Absolute contraindications</b>: right heart failure, severe active hepatic failure, severe hepatic encephalopathy.</li>
  <li>Confirm <b>portal vein patency</b> beforehand.</li>
  <li>Usual route: <span class="v3d" data-v="rhv">right hepatic vein</span> → <span class="v3d" data-v="rpv">right portal vein</span>, <b>covered stent</b>.</li>
  <li><b>Wedged balloon CO₂ venography</b> fills the portal vein retrogradely; CO₂ is <b>400× less viscous</b> than iodinated contrast so it crosses sinusoids.</li>
  <li>Hardest step: <b>getting into the portal vein</b>. Dilate tract (8 mm × 3–4 cm balloon), deploy covered stent, aim for gradient <b>&lt;12 mmHg</b>. Embolize varices on the completion venogram if needed. Follow patency with Doppler.</li></ul>`},
 {id:"brto", title:"BRTO", page:636, html:`
  <div class="widget" data-w="brto"></div>
  <ul><li>Balloon-occluded retrograde transvenous obliteration of <b>gastric varices</b>. Common in Asia; in the US/Europe used when endoscopy fails and <b>TIPS is not an option</b> (TIPS is first-line there).</li>
  <li>Needs a <b>gastrorenal or gastrocaval shunt</b>; without one, BRTO is impossible.</li>
  <li>Femoral (usual) or jugular access → left renal vein → shunt; inflate balloon at the outflow; venogram; inject sclerosant upstream; leave balloon <b>4–24 h</b>.</li>
  <li>Closing the shunt <b>raises portal pressure</b>: better liver function and less encephalopathy, but may worsen <b>ascites and esophageal varices</b>.</li>
  <li>Efficacy comparable to TIPS for gastric varices, with less rebleeding, encephalopathy and mortality. Variants use coils or plugs (e.g., PARTO) for shorter procedures.</li>
  <li>Complications: hematuria, worse esophageal varices, ascites, hydrothorax, SBP, portal vein thrombosis.</li></ul>`}
 ]},
{
 key:"onc", num:8, title:"Oncologic interventions", sub:"Ablation, TACE, TARE, portal vein embolization, renal masses", pages:[636,642], color:"#f472b6",
 topics:[
 {id:"ablation", title:"Ablation principles", page:636, html:`
  <div class="widget" data-w="ablation"></div>
  <ul><li>Alternative to resection in selected patients: liver, kidney, lung, bone; expanding to prostate, thyroid.</li>
  <li>Indications: local control of solitary or <b>oligometastatic (1–5)</b> disease; pain palliation. Best for lesions <b>&lt;5 cm</b>.</li>
  <li>Techniques: cryoablation, microwave, radiofrequency; also irreversible electroporation, laser, ethanol.</li>
  <li><b>Heat sink</b>: nearby vessels carry heat away → residual tumor. Affects all thermal methods, RFA most.</li></ul>`},
 {id:"abcompare", title:"RFA vs MWA vs cryoablation", page:637, html:`
  <table class="t"><tr><th></th><th>RFA</th><th>Microwave</th><th>Cryo</th></tr>
  <tr><td>Mechanism</td><td>Alternating current → frictional heat; coagulation necrosis &gt;55 °C; temperature falls <b>exponentially</b> away from the probe; <b>grounding pads</b></td><td>Field flips polar water molecules → heat; &gt;55 °C, can exceed 100 °C; cooled antenna; <b>no pads</b></td><td>Gas expansion cools probe to <b>−190 °C</b>; iceball; ≥2 freeze–slow-thaw cycles of 5–20 min</td></tr>
  <tr><td>Technique</td><td>One cycle 50–100 °C for 6–15 min; heat slowly to avoid charring/microbubbles (↑ impedance)</td><td>One probe, one cycle, 45–80 W for 5–10 min</td><td>CT/MR guided; probes <b>1–2 cm apart</b>; iceball <b>≥0.5 cm beyond tumor</b></td></tr>
  <tr><td>Pros</td><td>Most established, cheapest, short; cauterizes</td><td>Very hot, fast, big volume, works through char; <b>less heat sink</b>; cauterizes; multiple antennas</td><td><b>Iceball visible</b> on CT/MR/US; safer centrally; multiple probes at once; less pain, fewer complications</td></tr>
  <tr><td>Cons</td><td>Needs good conductivity; zone not seen live; <b>most heat sink</b></td><td>Larger probes; zone unpredictable, not seen live; risky near critical structures; less precise for small tumors</td><td>More bleeding (no cautery); longer; <b>cryoshock</b> (hypotension, multiorgan failure, DIC) after big liver ablations; cost</td></tr></table>
  <p>Follow-up: expected peripheral rim enhancement after ablation should stay thin and linear; nodular or expanding enhancement means residual or recurrent tumor. <b>Artificial ascites</b> protects diaphragm and body wall during peripheral liver ablation; subtraction MR helps exclude residual enhancement.</p>`},
 {id:"tace", title:"TACE", page:639, html:`
  <div class="widget" data-w="tace"></div>
  <ul><li>Liver parenchyma: mostly <b>portal</b> supply. HCC: mostly <b>hepatic artery</b>. Transarterial therapy exploits this mismatch. Also a bridge to transplant, and used for cholangiocarcinoma and metastases.</li>
  <li><b>cTACE</b>: intra-arterial chemo then particles/Gelfoam. <b>DEB-TACE</b>: drug-eluting microspheres (e.g., doxorubicin-loaded beads). Both: high local drug dose + ischemia.</li>
  <li><b>Contraindications</b>: portal vein thrombosis · tumor burden &gt;50% · extrahepatic metastases · decompensated cirrhosis (encephalopathy, tense ascites, Child-Pugh C) · bilirubin <b>&gt;3 mg/dL</b>.</li>
  <li>Plan on cross-sectional imaging: variants, extrahepatic supply (e.g., right inferior phrenic).</li>
  <li>Steps: celiac run → selective/superselective (or <b>lobar</b> if multifocal) → inject to stasis → document.</li>
  <li>Book case: recurrent HCC, superselective middle hepatic artery DEB-TACE with two vials of 100–300 µm beads loaded with 100 mg doxorubicin; end-point was pruning of distal branches and no residual tumor blush.</li>
  <li>Avoid early CT (changes mimic abscess). <b>Post-embolization syndrome</b> is very common (RUQ pain, fever, nausea, transaminitis). Also abscess, liver failure, <b>biliary injury</b> (bile ducts are arterial-fed).</li></ul>`},
 {id:"tare", title:"TARE / Y-90", page:641, html:`
  <ul><li>Selective internal radiation therapy: <b>yttrium-90 microspheres</b>. Effect is radiation, not macro-embolization, so it is possible <b>with portal vein thrombosis</b>. Intra-arterial delivery gives the tumor a <b>higher radiation dose</b> than external beam radiation can.</li>
  <li><b>Absolute contraindications</b>: pregnancy, breastfeeding, uncorrectable GI reflux, uncorrectable hepatopulmonary shunting.</li>
  <li>Mapping: angiography, then <b>Tc-MAA</b> injection and nuclear scan; MAA mimics sphere distribution → dose, lung shunt, GI/skin uptake.</li>
  <li><b>Never treat with a shunt to the GI tract</b> (ulcers, enteritis). Coil nearby arteries to prevent nontarget delivery.</li>
  <li><b>No significant post-embolization syndrome.</b></li></ul>`},
 {id:"pve", title:"Portal vein embolization", page:641, html:`
  <ul><li>Before partial hepatectomy: diverts portal flow to the <b>future liver remnant</b> so it hypertrophies.</li>
  <li>The usual target is the <b>right</b> portal vein, before a right hepatectomy, so the left-lobe remnant grows. After a left hepatectomy the right lobe is usually large enough on its own.</li>
  <li>Percutaneous portal access. Avoid in <b>portal hypertension</b> or extensive ipsilateral <b>tumor thrombus</b>.</li></ul>`},
 {id:"renalmass", title:"Renal neoplasms", page:641, html:`
  <table class="t"><tr><th></th><th>RCC</th><th>Oncocytoma</th><th>AML</th></tr>
  <tr><td>Angiography</td><td>Hypervascular, <b>bizarre neovascularity</b>, AV shunting, venous lakes</td><td><b>Spoke-wheel</b> with peritumoral halo; no bizarre vessels</td><td>Tortuous feeders, <b>sunburst</b> parenchymal phase, small aneurysms, <b>no AV shunting</b></td></tr>
  <tr><td>Key point</td><td>RFA in non-operative patients</td><td>Benign; not reliably told from RCC on cross-section</td><td>Macroscopic fat on CT/MR; bleeding risk if <b>&gt;4 cm</b>; particle embolization. Not always distinguishable from RCC on angiography, so an incidental suspected AML needs cross-sectional imaging.</td></tr></table>`}
 ]},
{
 key:"gu", num:9, title:"Genitourinary interventions", sub:"Nephrostomy, UAE, PAE, adrenal vein sampling", pages:[643,645], color:"#fb923c",
 topics:[
 {id:"pcn", title:"Percutaneous nephrostomy", page:643, html:`
  <div class="widget" data-w="brodel"></div>
  <ul><li>Commonest indication: drain an <b>obstructed kidney</b> (stone, malignancy, stricture). <b>Pyonephrosis</b> is emergent. Also antegrade ureteral stent when retrograde fails.</li>
  <li>Need to see the collecting system: usually dilated → US. Not dilated → IV contrast and fluoroscopy.</li>
  <li><b>Prone</b>, 22 G, posterior approach. Enter through the <b>avascular plane of Brödel</b> (between ventral and dorsal arterial branches): <b>posterolateral kidney toward a posterior calyx</b>.</li>
  <li>Complications: bleeding, infection. Transient hematuria is nearly universal; serious bleeding rare. With infection, minimise manipulation (sepsis).</li></ul>`},
 {id:"uae", title:"Uterine artery embolization", page:644, html:`
  <ul><li>Two main indications: <b>symptomatic fibroids</b> and <b>postpartum hemorrhage</b>.</li>
  <li>Fibroids: <b>particles</b> (trisacryl microspheres, PVA). PPH: <b>Gelfoam</b>.</li>
  <li>Goal: infarct the hypervascular fibroids while preserving endometrium/myometrium (fertility). End-point: <b>near-stasis</b> of the uterine artery.</li>
  <li>Serious complications ~<b>1.25%</b>: abscess, endometritis, <b>ovarian insufficiency</b> (nontarget) → amenorrhea or premature menopause. Submucosal fibroids may be expelled.</li></ul>`},
 {id:"pae", title:"Prostate artery embolization", page:645, html:`
  <ul><li>For BPH with moderate–severe obstructive symptoms; ischemic necrosis shrinks the gland.</li>
  <li>Prostate artery origin varies: <b>superior vesical, internal pudendal, obturator</b>, or internal iliac directly. Plan with cross-sectional imaging.</li>
  <li>Antibiotics + anti-inflammatories. Femoral or radial; contralateral internal iliac first, microcatheter into the prostatic artery, look for collaterals, coil anastomoses or go superselective, embolize to near-stasis, then the other side.</li>
  <li>Minor complications: hematuria, hematospermia, dysuria. RCT vs <b>TURP</b>: IPSS similar at 12 weeks, fewer adverse events and less blood loss with PAE.</li></ul>`},
 {id:"avs", title:"Adrenal vein sampling", page:645, html:`
  <ul><li>For <b>hyperaldosteronism</b>: lateralise an adenoma vs bilateral hyperplasia.</li>
  <li>Simultaneous or sequential right and left sampling. <b>Renal double curve (RDC)</b> catheter helps select the adrenal vein.</li></ul>`}
 ]},
{
 key:"lines", num:10, title:"Lines, tubes and drains", sub:"Dialysis access, central lines, ports, PICC, drains, gastrostomy", pages:[646,649], color:"#94a3b8",
 topics:[
 {id:"dialysis", title:"Dialysis access", page:646, html:`
  <div class="widget" data-w="dialysis"></div>
  <table class="t"><tr><th></th><th>AV fistula</th><th>PTFE graft</th></tr>
  <tr><td>Patency at 2 years</td><td><b>85%</b></td><td><b>50%</b></td></tr>
  <tr><td>Ready to use</td><td>Months to mature; ~30% never mature</td><td>Sooner</td></tr>
  <tr><td>Flow to stay open</td><td>Low once mature</td><td>Needs higher flow</td></tr>
  <tr><td>Common sites / failure</td><td>Radial→cephalic (wrist); brachial→forearm veins. Late failure: venous outflow or peri-anastomotic venous stenosis</td><td>Most often venous anastomosis or outflow stenosis</td></tr></table>
  <ul><li>Venous stenoses → angioplasty, often <b>high-pressure or cutting balloons</b>. Goal: palpable thrill and pulse, or venous:brachial pressure ratio <b>&lt;0.4</b>.</li>
  <li>Thrombosis: grafts are easier to declot (clot confined to graft). Treat the underlying venous stenosis. Pharmacologic or mechanical thrombectomy.</li></ul>`},
 {id:"cvc", title:"Central venous access and ports", page:647, html:`
  <div class="widget" data-w="linechooser"></div>
  <ul><li>Indications: poor peripheral access, frequent draws, vesicants (chemo, pressors, TPN), hemodialysis, plasmapheresis.</li>
  <li>Preferred: <b>internal jugular</b> under US (external jugular if IJ occluded). Aspirate blood to confirm, flush with heparinized saline.</li>
  <li>Complications: infection, arterial puncture, bleeding, pneumothorax.</li>
  <li><b>Nontunneled</b>: bedside/ICU, local only, up to 5 lumens, resuscitation and pressure monitoring; avoid for weeks–months (infection); easy removal.</li>
  <li><b>Tunneled</b>: IR suite with sedation; weeks–months–years; chemo, TPN, plasmapheresis, dialysis. Contraindicated with active infection or positive cultures. Cuff about <b>1 cm from the skin exit</b>. Remove the whole cuff; send tip if infection suspected.</li>
  <li><b>Port</b>: months–years; IR uses IJ (surgeons often subclavian); sedation + antibiotics; snug pocket so it cannot flip (some suture it). Access only with a <b>Huber (non-coring) needle</b>.</li></ul>`},
 {id:"picc", title:"PICC placement", page:648, html:`
  <div class="widget" data-w="picc"></div>
  <ul><li>First choice: <b>basilic vein</b> (medial, superficial to the brachial veins). Second: <b>cephalic</b> (extra curve at the axillary/subclavian junction).</li>
  <li>Brachial veins risk the <b>median nerve</b>, which lies superficial to them.</li>
  <li><b>No PICC in chronic renal failure</b> patients who may need a fistula: use neck veins.</li></ul>`},
 {id:"drain", title:"Fluid drainage", page:648, html:`
  <ul><li>Collections: sterile serous or abscess. Hematomas traditionally not drained, though aspiration may speed relief.</li>
  <li><b>Seldinger</b>: catheter over a guidewire. <b>Direct trocar</b>: for large superficial collections; catheter on stylet straight in, remove stylet, aspirate, coil and lock.</li>
  <li>Fresh sterile prep for each collection. Anticipate sepsis. Indwelling catheters can create fistulas.</li>
  <li>Unwalled acute collections: wire or catheter may meet no resistance at the far wall and perforate structures.</li>
  <li>Daily care: check catheter, connections, fixation; flush up to 3×/day; keep site clean and dry.</li></ul>`},
 {id:"thora", title:"Thoracentesis and paracentesis", page:649, html:`
  <ul><li><b>Thoracentesis</b>: US-guided, valved <b>7 Fr</b> catheter. Choose the level with most fluid, fluid above and below the entry. Larger needle for viscous, septated or clotted fluid. Enter <b>just above the rib</b>. Max <b>1 L in 24 h</b> (re-expansion edema). Vaseline gauze on the wound.</li>
  <li><b>Paracentesis</b>: lower quadrants; mark the <b>epigastric vessels</b> on US; watch the needle tip to avoid bowel. Up to <b>5 L</b> before albumin replacement is needed.</li></ul>`},
 {id:"gtube", title:"Percutaneous gastrostomy", page:649, html:`
  <div class="widget" data-w="gtube"></div>
  <ul><li>Indications: esophageal, head and neck, neurologic disease; decompression (malignant obstruction, prolonged ileus). <b>No survival or QoL benefit in elderly dementia patients</b> with poor intake.</li>
  <li><b>Absolute contraindications</b>: no window (colonic interposition), extensive gastric varices, uncorrectable coagulopathy.</li>
  <li>Steps: NG tube under fluoro, insufflate stomach → <b>3 T-fasteners</b> (gastropexy), contrast check after each → puncture and dilate → use after <b>24 h</b> if no peritoneal signs.</li>
  <li>Leave at least <b>1 month</b> for a mature tract.</li></ul>`}
 ]}
];
