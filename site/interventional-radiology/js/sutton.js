/* "From Sutton" supplement boxes for the Interventional Radiology atlas.
   Paraphrased from Sutton, Textbook of Radiology and Imaging: vol 1 ch. 13 (vascular access, cardiac
   intervention) and ch. 15 (arteriography and interventional angiography); vol 2 ch. 29 (urogenital
   interventions) and ch. 34 (gynaecological IR).
   Only points that Core Radiology 2e ch. 9 does not cover. Sutton is older: where it differs from
   current practice the point is labelled "older practice (Sutton)". */
window.IR_SUTTON = [

  /* ---------- intro: pre-procedure care, contrast reactions ---------- */
  { section:"intro", topic:"Contrast reactions: grades and how often they happen",
    points:[
      "Sutton grades reactions as mild (sneezing, limited urticaria, nausea, warmth; no treatment beyond reassurance), intermediate (widespread urticaria, bronchospasm, angio-oedema, moderate hypotension; needs prompt treatment but responds quickly) and severe (cardiopulmonary collapse, pulmonary oedema, refractory bronchospasm, arrhythmia, arrest).",
      "With older high-osmolar media about 12% of patients reacted, mostly trivially; severe reactions were under 0.26% and deaths about 1 in 40 000 injections.",
      "Low-osmolar media cut minor and intermediate reactions to about 3%, and severe reactions also appear rarer.",
      "Proposed mechanisms include anxiety, histamine and serotonin release, complement and coagulation activation, and antigen-antibody reactions."
    ], src:"Sutton vol 1, p420" },

  { section:"intro", topic:"Contrast reaction risk factors and premedication",
    points:[
      "Major risk factors: allergy (especially asthma), age under 1 or over 60, cardiovascular disease, and a previous contrast reaction. Minor ones: diabetes, dehydration, renal impairment, haemoglobinopathy and dysproteinaemia.",
      "Drug risks: beta-blockers predispose to bronchospasm and severe reactions; patients on long-term steroids need extra steroid cover; interleukin-2 therapy can cause contrast hypersensitivity.",
      "A previous minor reaction is not a contraindication; after a severe reaction use another test; after an intermediate reaction repeat only if essential and under close control.",
      "Older practice (Sutton): oral prednisone 50 mg 8-hourly for 3 days, plus ephedrine 25 mg and diphenhydramine 50 mg 1 h before, using only low-osmolar contrast. The current standard (ACR) is prednisone 50 mg at 13, 7 and 1 h before, plus diphenhydramine 50 mg 1 h before.",
      "Small test doses to predict allergy were abandoned: they are unreliable, people have died after a negative test, and test doses have themselves killed."
    ], src:"Sutton vol 1, p420" },

  { section:"intro", topic:"Treating a contrast reaction: vasovagal vs anaphylactoid",
    points:[
      "Emergency drugs and equipment must be at hand wherever contrast is given. Hypotension is treated first with leg elevation, rapid IV fluid and oxygen.",
      "Key distinction: vasovagal collapse gives hypotension with bradycardia and needs atropine 0.6–1.2 mg IV. An anaphylactoid reaction gives hypotension with tachycardia and needs adrenaline.",
      "Sutton warns that adrenaline should not be given for vagal inhibition, where atropine can save the patient's life.",
      "Older practice (Sutton): glottic oedema treated with adrenaline 0.5 mg SC or IM plus a slow IV antihistamine. Current guidance gives adrenaline IM (0.3–0.5 mg of 1 mg/mL); the subcutaneous route is no longer used. Major hypersensitivity: dexamethasone 10–20 mg IV, with positive-pressure ventilation and oxygen if needed."
    ], src:"Sutton vol 1, p420–422" },

  { section:"intro", topic:"Contrast nephrotoxicity and iodism",
    points:[
      "Proposed mechanisms of contrast nephropathy: renal vasoconstriction, a direct toxic effect on tubular cells, and casts blocking the tubules.",
      "Acute renal failure is reported in about 5% of patients with chronic renal failure but under 1% of those with normal function; most cases are non-oliguric and recover.",
      "Risk factors: large contrast doses, dehydration, diabetes, existing renal impairment and myeloma (take care with Bence Jones proteinuria and hyperuricaemia). Do not dehydrate at-risk patients.",
      "Iodism: free iodine upsets radio-iodine thyroid tests, and salivary swelling (iodine mumps), hyperthyroidism or late skin rashes can follow days after the injection."
    ], src:"Sutton vol 1, p420–421" },

  { section:"intro", topic:"Heparin, protamine and sedation during angiography",
    points:[
      "Sutton's routine: once the catheter is in the aorta, give 3000 units of heparin to prevent clot forming on the catheter. This is most useful in long procedures; short diagnostic studies with single-use catheters usually need none.",
      "If the puncture oozes too much at the end, reverse with protamine sulfate 10 mg per 1000 units of heparin given.",
      "Pethidine and similar sedatives can cause hypotension, which can trigger thrombosis across a stenosis, so use them carefully in arteriopaths.",
      "General anaesthesia (usual in children) adds cost and risk, and the patient cannot report a misplaced injection; with a conscious patient you can stop as soon as symptoms appear.",
      "Older practice (Sutton): stop anticoagulants before arteriography and wait until the prothrombin time is normal."
    ], src:"Sutton vol 1, p357, p418–419, p421–422" },

  /* ---------- tools: embolics, complications, retrieval ---------- */
  { section:"tools", topic:"Embolic agents: the ideal agent and particulates",
    points:[
      "An ideal embolic agent is thrombogenic but not toxic, occludes permanently, passes easily through a catheter, and comes sterile and radiopaque in many sizes. No current agent meets all of these, so agents are often combined to block different levels of the vascular tree.",
      "Gelatin sponge (Gelfoam) is the only common agent that is temporary (recanalises within about a month). It is not radiopaque, so it is cut into 1–3 mm pieces and suspended in contrast.",
      "PVA (Ivalon) particles are permanent but also not radiopaque. They come in size bands from roughly 150 to 1000 microns and are suspended in contrast before injection.",
      "Lyophilised dura mater should no longer be used (CJD transmission risk), and tungsten coils were withdrawn because they break down and raise serum tungsten."
    ], src:"Sutton vol 1, p456" },

  { section:"tools", topic:"Coils, detachable balloons, sclerosants and glue",
    points:[
      "Coils are stainless steel or platinum, with helix diameters of about 1–20 mm. Steel coils carry wool, silk or Dacron threads to make them more thrombogenic, and they are pushed out of the catheter with a guide-wire.",
      "Detachable balloons (latex or silicone, 1–2 mm, inflating to 4–8 mm) are not radiopaque, so they are filled with contrast before release from the microcatheter.",
      "Ethanol, sodium tetradecyl sulphate and 50% dextrose are mixed with contrast. Butyl-cyanoacrylate (Bucrylate) is mixed with tantalum powder or ethiodised oil, which makes it radiopaque and slows its polymerisation."
    ], src:"Sutton vol 1, p456" },

  { section:"tools", topic:"Embolisation complications (Sutton's figures)",
    points:[
      "Sutton says post-embolisation syndrome (pain, nausea, fever, malaise, leucocytosis) starts within 24–48 h, lasts 3–7 days, and is worse when more tissue is embolised. Do not mistake an abscess for it; give prophylactic antibiotics and use strict asepsis for solid organs. Gas in necrotic tissue is expected and does not by itself mean an abscess.",
      "Other hazards: infarction larger than planned from retrograde thrombus, reflux of solid agents or seepage of liquid agents into nearby organs, and paradoxical or pulmonary emboli through AV shunts. Misplaced coils or balloons can usually be retrieved.",
      "Embolising functioning carcinoid or insulinoma metastases releases active hormones, so give blocking drugs beforehand.",
      "Large infarcts release toxic radicals that, together with dehydration and high contrast doses, can cause renal failure.",
      "Overall complication rate is 3–10% with 1–2% procedure mortality. Splenic embolisation for hypersplenism is much riskier (about 20% complications, 7% mortality), so it is staged because infarcted spleen readily forms an abscess."
    ], src:"Sutton vol 1, p459–460" },

  { section:"tools", topic:"Retrieving intravascular foreign bodies",
    points:[
      "Pieces of catheter, wire or misplaced coils in veins migrate centrally (right atrium, right ventricle, pulmonary arteries); arterial fragments travel distally and lodge at bifurcations.",
      "If left in place, intravascular foreign bodies carry about a 70% complication rate and 40% mortality (arrhythmia, myocardial perforation, endocarditis, PE, sepsis, mycotic aneurysm), early or years later.",
      "Technique: femoral or jugular venous access (femoral arterial for arterial fragments), with a sheath wide enough to take the object. Grab it with a loop snare, stone basket or biopsy forceps, first nudging it into a better position with a catheter if needed."
    ], src:"Sutton vol 1, p361, p454" },

  /* ---------- angio: access, technique, DSA, contrast, complications ---------- */
  { section:"angio", topic:"Seldinger technique step by step",
    points:[
      "Seldinger described percutaneous catheterisation over a needle and guide-wire in 1953; before that, arteriography needed a surgical cut-down or direct needle injection.",
      "Steps: puncture the artery with a thin-walled needle, see blood spurt back, pass the guide-wire 5–8 cm into the lumen, then pull the needle off the wire while pressing on the site with gauze.",
      "Thread the catheter over the wire, which is longer than the catheter so its back end always sticks out. Remove the wire and keep the catheter flushed with heparinised saline, either by hand or by drip.",
      "In tortuous or diseased arteries, guides with more flexible tips help the catheter through difficult segments.",
      "Most selective work uses catheters of 5 Fr or smaller; superselective access, especially intracranial, uses 2–3 Fr microcatheters passed coaxially through a thin-walled 5–6 Fr catheter."
    ], src:"Sutton vol 1, p418" },

  { section:"angio", topic:"Arterial access sites beyond the femoral",
    points:[
      "Sutton's two standard routes were the femoral and the axillary artery. Brachial, radial, carotid and translumbar routes were kept for special cases.",
      "Radial technique: wrist slightly extended, 20-gauge needle, fine wire, then a dilator for a 5–6 Fr sheath. Give a small vasodilator infusion against spasm, and close by compression on a wrist splint.",
      "Brachial puncture is done just above the antecubital fossa at the strongest pulse; the radial route has largely replaced it.",
      "Older practice (Sutton): closure devices (usually collagen plugs) add cost and are mainly for patients who must stay anticoagulated or need to get up early. Core Radiology (p. 591) says they may improve comfort and early mobility and may reduce bleeding and vascular complications."
    ], src:"Sutton vol 1, p357, p418" },

  { section:"angio", topic:"DSA and CO2 angiography: practical points",
    points:[
      "DSA subtracts a pre-contrast mask, so any movement spoils the image. Abdominal runs used hyoscine butylbromide 20 mg IV to stop peristalsis, and thoracic runs used ECG gating; unsubtracted digital images may be better in patients who cannot keep still.",
      "Compared with cut-film angiography, DSA allows less and more dilute contrast, shorter procedures, 3–5 Fr instead of 6–8 Fr catheters, and lower radiation dose. Its only drawback is poorer spatial resolution.",
      "Intravenous DSA (a large bolus injected into the SVC or right atrium) can show arteries when there are no femoral pulses, but it needs a cooperative patient with normal cardiac output.",
      "CO2 is an arterial contrast option after an iodinated contrast reaction or in renal failure. It dissolves rapidly and works by displacing blood. Give it with a pump injector, and never use it above the diaphragm (coronary or cerebral circulation).",
      "Gadolinium-DTPA can also be injected intra-arterially after a contrast reaction, but Sutton notes it is very expensive."
    ], src:"Sutton vol 1, p415–416" },

  { section:"angio", topic:"Contrast media: osmolality and volumes",
    points:[
      "Osmolality depends on the ratio of iodine atoms to particles in solution: older ionic monomers are 3:2, non-ionic monomers 3:1, and non-ionic dimers 6:1. At about 280 mg I/ml, low-osmolar media are around 480 mOsm/kg, compared with about 1500 for high-osmolar agents and 300 for plasma.",
      "Sutton's dose table states that ionic agents should no longer be used intravascularly. Historical trap: Thorotrast stayed in the reticuloendothelial system for life and caused late cancers; old films show fine stippling in the spleen.",
      "Basic rule: the contrast dose follows the flow in the vessel. High-flow vessels need larger volumes at higher pressure, and small vessels need small hand injections.",
      "Older practice (Sutton): arch about 40 ml at 20 ml/s; high abdominal aorta 30 ml over 1.5–2 s; coeliac or SMA about 30 ml (up to 50 ml if the portal venous phase is wanted); coronary arteries 4–8 ml.",
      "Reduce a suprarenal aortic injection to 20 ml at most if renal function is poor, there is only one kidney, or aortic occlusion will send more contrast to the kidneys."
    ], src:"Sutton vol 1, p419–420" },

  { section:"angio", topic:"Complications of diagnostic arteriography",
    points:[
      "Clot can form on the catheter tip in long procedures and be flushed off by an injection. The danger is greatest with catheters at or proximal to the cerebral vessels (arch, coronary, head-hunter studies). Small catheters, speed and heparin reduce the risk.",
      "Cholesterol embolisation can be triggered in severely atheromatous aortas. To avoid air embolism, load syringes without air and always inject with the nozzle pointing down.",
      "Check the puncture site before discharge and the next morning. After axillary puncture, a haematoma can compress the brachial plexus; progressive weakness needs urgent surgical decompression of the neurovascular sheath.",
      "Paraplegia has followed aortography when too much contrast entered the artery of Adamkiewicz (supplies the cord from about T8 down). Tetraplegia has followed vertebral or thyrocervical injections, and usually transient cortical blindness has followed vertebral angiography.",
      "Hypotension can appear hours after a major procedure and can precipitate coronary or carotid thrombosis in arteriopaths, so monitor patients on the ward."
    ], src:"Sutton vol 1, p421–422" },

  { section:"angio", topic:"Anatomical variants worth knowing",
    points:[
      "About 25% of kidneys have an accessory renal artery, which is why live donors are imaged. Horseshoe and ectopic kidneys often have extra arteries from the aortic bifurcation or iliacs.",
      "Bronchial arteries arise from the front of the aorta just below the carina and are paired on the left in about 60% and on the right in about 30%.",
      "A persistent sciatic artery (a continuation of the internal iliac running behind the femoral neck) can replace a hypoplastic femoral artery. The popliteal may divide above the knee, and the brachial may divide high."
    ], src:"Sutton vol 1, p423" },

  /* ---------- arterial interventions ---------- */
  { section:"arterial", topic:"How angioplasty works and who it is for",
    points:[
      "Dotter and Judkins first dilated stenoses with coaxial catheters in 1964; Gruntzig's PVC balloon catheter (1974) made PTA the commonest vascular intervention.",
      "Electron microscopy showed the balloon splits the plaque, with clefts through the intima into the media but sparing the adventitia. Platelets then coat the injured surface, and over weeks intimal hyperplasia, fibrosis and plaque retraction widen the lumen.",
      "Besides atheroma, PTA suits stenoses from fibromuscular dysplasia, arteritis, intimal hyperplasia, radiation injury and trauma.",
      "Ideal lesion: a short, smooth, central 50–90% stenosis in a large artery (for example the common or external iliac) with good run-off. Fresh thrombus (lyse or aspirate first), total aortic occlusion and long occlusions are relative contraindications."
    ], src:"Sutton vol 1, p447" },

  { section:"arterial", topic:"Peripheral PTA: drugs, approach and balloon size",
    points:[
      "Older practice (Sutton): start an antiplatelet drug 24 h before and continue it for 3–6 months or for life, give 3000–5000 units of heparin intra-arterially during the procedure, and encourage exercise and stopping smoking.",
      "Iliac lesions are treated retrogradely from the same-side femoral artery, which can be punctured without a pulse using fluoroscopy or ultrasound. Alternatives are crossing over from the other groin or a left arm approach. Distal SFA and popliteal lesions are treated antegradely, or from the popliteal artery with the patient prone.",
      "Long SFA or popliteal occlusions (20–30 cm) can be crossed by subintimal angioplasty: the wire deliberately dissects past the block and re-enters the true lumen, and the channel is then ballooned.",
      "Typical balloons: iliac 6–12 mm, SFA and popliteal 4–6 mm, tibial 2–3 mm, aorta 12–16 mm (or two 8–10 mm balloons), with kissing 6–10 mm balloons at the aortic bifurcation. Length is usually 4 cm (range 2–10 cm). Undersizing under-dilates and oversizing can rupture the artery."
    ], src:"Sutton vol 1, p447–448" },

  { section:"arterial", topic:"Pressure gradients to judge an iliac stenosis",
    points:[
      "Measure intra-arterial pressure above and below an aortic or iliac lesion. A resting gradient of 15–20 mmHg or more is significant; up to 10 mmHg is not.",
      "If the resting gradient is borderline, an intra-arterial vasodilator (papaverine, tolazoline or GTN) mimics exercise. A rise to more than 20 mmHg means the stenosis is significant.",
      "The best result is no residual gradient. Pressures are not used in femoral, popliteal or tibial PTA, where the angiographic result is judged instead and slight residual narrowing with good flow is acceptable."
    ], src:"Sutton vol 1, p448–449" },

  { section:"arterial", topic:"PTA results, complications and bail-outs",
    points:[
      "Iliac PTA: success 90–95% for stenoses and 80–90% for occlusions, with 50–85% patency at 5 years. Femoropopliteal PTA: 85–95% and 60–90%, with 20–70% patency at 5 years. Procedural mortality is about 0.1% (30-day about 1% from co-morbidity), and complications occur in 2–5%.",
      "A high antegrade puncture above the inguinal ligament risks retroperitoneal haemorrhage, which can be fatal.",
      "A dissection flap is more likely to occlude the artery in the antegrade direction, because flow lifts the flap, whereas retrograde flow tends to press it closed. Treat with repeat ballooning or a stent.",
      "Perforation inside a femoropopliteal occlusion is usually harmless, but iliac rupture bleeds into the retroperitoneum. Control it with a covered stent or by inflating the balloon at the tear before surgery.",
      "Tibial and popliteal spasm can be treated or prevented with nifedipine, isosorbide dinitrate or tolazoline. Distal emboli are aspirated or lysed, and recurrent stenosis has been treated with brachytherapy."
    ], src:"Sutton vol 1, p449" },

  { section:"arterial", topic:"Renal, carotid, subclavian and mesenteric PTA",
    points:[
      "Only about 4–5% of hypertensive patients have renovascular hypertension. Renal PTA (4–6 mm balloons) succeeds in about 90% of stenoses and 50% of occlusions; complications occur in 5–10%, including renal infarction.",
      "Fibromuscular dysplasia responds best: about 95% benefit (60% cured, 35% improved), compared with about 70% for non-ostial atheroma (30% cured, 40% improved). About 40% of patients with renal failure show a fall in creatinine, and ostial atheroma or restenosis needs a stent.",
      "Transplant renal artery stenosis is approached across the bifurcation from the opposite groin; use an arm approach when a native renal artery leaves the aorta at a very acute angle.",
      "Carotid PTA (ICA 5–6 mm balloon, with a cerebral protection device) has a 1–3% stroke rate and about 0.3% procedural mortality. Subclavian PTA (6–10 mm balloon) succeeds in 80–95%, with 75% patency at 4 years.",
      "Coeliac and SMA stenoses, and even occlusions, in chronic mesenteric ischaemia take 5–7 mm balloons, with about 90% technical success."
    ], src:"Sutton vol 1, p449–450" },

  { section:"arterial", topic:"Arterial stents and older recanalisation devices",
    points:[
      "Sutton's stent indications: a flow-limiting intimal flap after PTA, a persistent pressure gradient across a residual stenosis, recurrent stenosis, aortic, ostial renal and carotid stenoses, and iliac, coronary or renal occlusions.",
      "Iliac stents are 90–95% patent at 2 years. Covered stents were used to seal iliac rupture after PTA and to treat peripheral false aneurysms and traumatic AV fistulas.",
      "Older recanalisation tools (rotational catheters, atherectomy, laser) all still needed ballooning afterwards. Atherectomy had 15–45% restenosis, laser perforated up to 20% of arteries, and all are now rarely used."
    ], src:"Sutton vol 1, p450–451" },

  { section:"arterial", topic:"Intra-arterial thrombolysis: indications and contraindications",
    points:[
      "Dotter (1974) introduced low-dose streptokinase infused through a catheter inside the clot, to avoid the bleeding caused by high-dose systemic lysis.",
      "Best uses: distal (popliteal or tibial) thrombosis or embolus, thrombosed bypass grafts, occlusion at a recent angioplasty site, and proximal iliofemoral thrombosis in patients at high surgical risk. Severe proximal aortoiliac or femoral embolus still goes to surgery.",
      "Contraindications: cerebral infarct within 3 months, major surgery or trauma within a month, active bleeding, bleeding diathesis, pregnancy, diabetic retinopathy, and established muscle necrosis (myoglobin release risks acute renal failure).",
      "Large emboli at the aortic, iliac or femoral bifurcation are removed with a Fogarty balloon. Sutton notes that delaying beyond 24 h significantly raises the amputation rate."
    ], src:"Sutton vol 1, p439, p455" },

  { section:"arterial", topic:"Thrombolysis agents, regimens and outcomes",
    points:[
      "Older low-dose regimens (Sutton): streptokinase 5000 units/h or urokinase 50 000 units/h infused into the thrombus, with check angiograms over 24–48 h. Higher doses shorten lysis to 6–18 h.",
      "Pulse-spray pharmacomechanical lysis forces the drug through multiple side holes or slits along the clot and can achieve lysis in 1–3 h. Any stenosis uncovered as the clot clears is treated with PTA.",
      "Mechanical options: aspiration through a wide-lumen catheter for small fresh clots, an air-turbine impeller at about 150 000 rpm (Amplatz device), or a saline jet that uses the Venturi effect to break up and suck out clot (Hydrolyser).",
      "Complications: groin or retroperitoneal bleeding, bleeding elsewhere, clot forming around the catheter, distal embolisation, renal failure and stroke.",
      "Outcomes in critical limb ischaemia: 70–80% limb salvage, 5–10% amputation and about 10% 30-day mortality."
    ], src:"Sutton vol 1, p455–456" },

  { section:"arterial", topic:"Vasopressin and angiographic clues in GI bleeding",
    points:[
      "Older practice (Sutton): after the bleeding point is found, infuse vasopressin at 0.1–0.2 units/min for 20 min and repeat the angiogram. If extravasation has stopped, continue for 12–24 h and then taper over a further 12–24 h; if not, increase the dose.",
      "Left gastric infusion controlled Mallory-Weiss tears and erosive gastritis in about 80% (20% rebled). SMA or IMA infusion controlled diverticular bleeding in about 90% (30% rebled). It works poorly for chronic peptic ulcers and tumours.",
      "Besides its constrictor effects (hypertension, arrhythmia, MI, limb and gut ischaemia), vasopressin's antidiuretic action causes fluid retention and electrolyte disturbance.",
      "Most bleeding diverticula are in the ascending colon, even though diverticula are commoner on the left. Angiodysplasia is mainly caecal or ascending, bleeds less, and shows early venous filling.",
      "Emergency colectomy carries a high mortality, so even temporary control allows a safer elective operation later."
    ], src:"Sutton vol 1, p440–441, p454" },

  { section:"arterial", topic:"Embolisation for bleeding: choosing the territory",
    points:[
      "The stomach, duodenum and rectum have a dual blood supply (unless previously operated on), so embolising the left gastric, gastroduodenal or superior rectal artery with Gelfoam and coils carries a low risk of infarction.",
      "The small bowel and colon have a single supply, so embolisation there has a high risk of infarction and perforation; vasopressin was the alternative.",
      "Pancreatic false aneurysms (pancreatitis or trauma) are coiled through the GDA or splenic artery. Hepatic false aneurysms after biopsy, trauma, surgery or from metastases are coiled in the relevant hepatic branch.",
      "Pelvic fracture bleeding that continues despite external fixation is controlled by coiling the bleeding internal iliac branch. Life-threatening epistaxis has been treated with Gelfoam in the internal maxillary arteries."
    ], src:"Sutton vol 1, p456–457" },

  { section:"arterial", topic:"Embolising AVMs and traumatic fistulas",
    points:[
      "Limb and head-and-neck AVMs are hard to remove surgically: the field fills with blood, excision is extensive, and incomplete excision recurs. Embolisation alone is often the best treatment, or it can be used before surgery.",
      "Small AVMs can have feeders and nidus treated in one session, but large ones need several sessions.",
      "Lesions with a major arteriovenous component suit Bucrylate or ethanol. Capillary-venous lesions can be treated by direct venous injection of sodium tetradecyl sulphate or ethanol.",
      "Post-traumatic AV fistulas and true or false aneurysms are closed with large devices (coils, detachable balloons) or covered stents."
    ], src:"Sutton vol 1, p458" },

  { section:"arterial", topic:"EVAR: device configurations and complications",
    points:[
      "Parodi performed the first EVAR in Argentina in 1990. Stent-grafts are metal stents covered with graft fabric.",
      "Three configurations: aorto-bi-iliac; aorto-uni-iliac, which needs an occluder in the opposite common iliac and a femoro-femoral crossover graft; and straight aorto-aortic, which is also used for thoracic aneurysms and dissections.",
      "Sizing needs CT or MR angiographic measurements of the aorta and iliacs. Large main-body systems need a femoral cut-down; smaller iliac or popliteal grafts can go in percutaneously.",
      "Complications besides endoleak: iliac or aneurysm rupture during insertion, renal artery cover, distal embolisation, renal failure, limb thrombosis, migration into the sac, and late rupture."
    ], src:"Sutton vol 1, p452" },

  /* ---------- venous ---------- */
  { section:"venous", topic:"IVC filters: Sutton's indications and outcomes",
    points:[
      "Extra indications Sutton lists: DVT in patients with pulmonary arterial hypertension, and prophylaxis in high-risk patients, alongside recurrent PE despite anticoagulation and contraindication to anticoagulation.",
      "Place the filter in the suprarenal IVC if there is thrombus in the renal veins or the infrarenal cava.",
      "Filters cut recurrent PE from about 20% to 4% and associated mortality from about 10% to under 2%.",
      "Older practice (Sutton): most filters were permanent, the Gunther Tulip was retrievable only for about 2 weeks, and temporary catheter-mounted filters were used during venous thrombolysis."
    ], src:"Sutton vol 1, p452–453" },

  { section:"venous", topic:"Venous stents and venous thrombolysis",
    points:[
      "SVC obstruction from bronchial carcinoma or other mediastinal tumour is stented (Wallstent, Gianturco Z) through the basilic, internal jugular or femoral vein. Lyse any thrombus first.",
      "Venous stents have also been used for IVC compression by liver or retroperitoneal tumours, and for hepatic, iliac and subclavian vein stenoses and failing dialysis shunts.",
      "Catheter thrombolysis has been applied to SVC thrombosis (for example with pulse-spray tPA before stenting), leg DVT, hepatic vein thrombosis, upper limb ischaemia, thrombosed dialysis grafts and renal artery occlusion."
    ], src:"Sutton vol 1, p452, p455–456" },

  { section:"venous", topic:"Varicocele embolisation and venous sampling",
    points:[
      "A femoral approach is easier for the patient than a jugular one, and modern low-friction wires make it reliable for reaching the left renal and testicular veins.",
      "The testicular vein goes into spasm easily if manipulated too much, which can make the procedure fail, so handle it gently.",
      "The left gonadal vein is occluded with coils, with or without sodium tetradecyl sulphate. Success is about 80%, similar to surgery with lower morbidity, and sperm count and quality improve.",
      "Venous sampling: renal vein blood for renin assay, and pancreatic drainage vein blood (reached by transhepatic portal catheterisation) to localise hormone-secreting pancreatic tumours.",
      "Adrenal tumours have been ablated by venous infarction in Cushing's and Conn's syndromes."
    ], src:"Sutton vol 1, p445, p458; vol 2, p906" },

  /* ---------- hepatobiliary ---------- */
  { section:"hepatobiliary", topic:"Transjugular liver biopsy: why and how",
    points:[
      "Choose it when percutaneous biopsy carries a high bleeding risk (abnormal clotting, low platelets, ascites) or when portal pressures are measured at the same time.",
      "Access is through the right internal jugular vein under ultrasound, with a guiding catheter in the right hepatic vein. Cores come from the right lobe and are obtained in almost all cases.",
      "Bleeding usually stays inside the liver or drains into the hepatic vein, but a biopsy near the capsule can still bleed into the peritoneum."
    ], src:"Sutton vol 1, p453" },

  { section:"hepatobiliary", topic:"TIPS in Sutton's era",
    points:[
      "Richter performed the first TIPS in Germany in 1988. The portal vein is first confirmed by arterioportography or wedged hepatic venography; a needle is then passed from the right hepatic vein to the right portal vein, and the tract is dilated and stented.",
      "Older practice (Sutton): aim for a portosystemic gradient of about 10–15 mmHg after the shunt (Core Radiology, p. 634: below 12 mmHg); technical success about 90%, procedural mortality 1–3%, 30-day mortality about 15%.",
      "In that era, shunt failure from intimal hyperplasia and thrombosis was a main complication, along with encephalopathy.",
      "Gastric varices can be coiled during TIPS, or through a percutaneous transhepatic portal approach when TIPS is not done."
    ], src:"Sutton vol 1, p453–454, p457" },

  /* ---------- oncologic ---------- */
  { section:"onc", topic:"Preoperative tumour embolisation and timing",
    points:[
      "Purpose: reduce operative blood loss and tumour size so surgery is easier.",
      "For renal cell carcinoma, embolising days before nephrectomy causes inflammation that blurs tissue planes. Do it only a few hours before surgery, or use a balloon occlusion catheter instead.",
      "Other tumours embolised before surgery: meningioma, juvenile nasopharyngeal angiofibroma (external carotid feeders), chemodectomas such as glomus jugulare and carotid body tumours, primary bone tumours and primary liver tumours.",
      "Definitive embolisation has been used for benign bone and liver tumours and for ectopic mediastinal parathyroid adenomas."
    ], src:"Sutton vol 1, p446, p458" },

  { section:"onc", topic:"Hepatic artery embolisation and infusion",
    points:[
      "Normal liver gets about 75% of its blood from the portal vein and 25% from the hepatic artery, whereas tumours get about 90% from the artery. So hepatic artery embolisation is contraindicated if the portal vein is occluded.",
      "Gelfoam and coils control haemobilia from tumour false aneurysms, and shrinking a large tumour-filled liver relieves capsular pain.",
      "Embolising carcinoid metastases relieves serotonin-driven flushing and diarrhoea, with similar benefit for insulinoma, glucagonoma and VIPoma metastases.",
      "Older figures (Sutton): a 5-day hepatic infusion of 5-FU plus mitomycin C or cisplatin gave 45–60% responses in colorectal metastases. In HCC, chemotherapy alone gave about 60%, rising to about 90% when combined with Lipiodol and gelatin sponge.",
      "Because infusion catheters stayed in place for days, the commonest complication was thrombosis of the infused artery."
    ], src:"Sutton vol 1, p455, p458" },

  { section:"onc", topic:"Palliating haematuria and pelvic tumour bleeding",
    points:[
      "Haematuria from inoperable renal cell carcinoma is controlled by renal artery embolisation with PVA, Gelfoam, ethanol and coils (feathered coils, particles or absolute alcohol).",
      "Bleeding bladder tumours, or vaginal bleeding from gynaecological cancers, in patients unfit for surgery is treated by embolising both internal iliac arteries with Gelfoam and coils.",
      "Bladder and prostate angiography is now done almost only before embolisation, for example for bleeding after transurethral prostatectomy."
    ], src:"Sutton vol 1, p456; vol 2, p906" },

  /* ---------- genitourinary ---------- */
  { section:"gu", topic:"Antibiotic cover and preparation for urinary tract procedures",
    points:[
      "Infection is the commonest complication of percutaneous urinary procedures and can be life-threatening.",
      "If there is no sign of infection, one IV dose of a broad-spectrum antibiotic (for example cefuroxime 750 mg) 1–6 h beforehand is enough.",
      "If the tract is known to be infected, there is a real risk of Gram-negative septicaemia and collapse, so ideally give antibiotics for at least 24 h first. Avoid over-distending the collecting system and avoid unnecessary manipulation, both of which can cause bacteraemia.",
      "Check platelets and prothrombin time if liver disease or a clotting tendency is suspected. Most procedures are done under local anaesthesia with IV analgesia, sedation and pulse oximetry, followed by overnight observation."
    ], src:"Sutton vol 2, p900" },

  { section:"gu", topic:"Antegrade pyelography, safe calyceal puncture and endopyelotomy",
    points:[
      "Use antegrade pyelography to show the level and cause of ureteric obstruction when non-invasive imaging has failed, or as the first step of a nephrostomy or Whitaker test.",
      "Position the patient about 45 degrees semiprone and use a 22-gauge needle. Aim through renal parenchyma into a calyx, not straight into the pelvis, which can tear. If the aspirated urine looks infected, drain and treat before injecting contrast.",
      "Make a skin incision at least 5–10 mm long and 10–15 mm deep through the superficial fascia for any procedure beyond a fine needle, and double it for PCNL.",
      "Endopyelotomy for PUJ obstruction cuts the full wall thickness through a percutaneous track. Crossing renal arteries usually run in front of the PUJ, so cut posterolaterally and look for them beforehand with CT angiography."
    ], src:"Sutton vol 2, p901, p903" },

  { section:"gu", topic:"Nephrostomy and suprapubic access options",
    points:[
      "A multi-sidehole 6–8 Fr pigtail is placed for obstruction. Nephrostomy is also used to divert urine from unobstructed kidneys so that ureteric or bladder fistulas can heal.",
      "Single-stab (trocar) technique, usually under ultrasound: the tube is mounted on a cannula. It is the quickest method when it works.",
      "Seldinger alternative: an 18-gauge sheathed needle (often as a second puncture after a fine-needle pyelogram), a 0.035 inch wire coiled in the pelvis or ideally down the ureter, then dilators (8–9 Fr for an 8 Fr drain) and the drain.",
      "Renal or perinephric abscess: a small one can simply be aspirated through a sheathed needle; a larger one gets a pigtail drain, often by single stab under ultrasound or CT.",
      "The bladder wall is very tough, so suprapubic catheters are often better placed with a sheathed needle, stiff wire and serial dilators than by single stab. A Foley balloon that will not deflate can be popped with a fine needle under ultrasound if a stiff wire cannot clear its channel."
    ], src:"Sutton vol 2, p901–902, p905" },

  { section:"gu", topic:"Nephrostogram and antegrade ureteric stenting",
    points:[
      "A nephrostogram through an existing tube rechecks the obstruction (stone still present, tumour response), investigates an unexplained cause, or follows a fistula. Postpone it if the urine is infected.",
      "Stent antegradely when the obstruction will not resolve within a few days (most often malignant) or for postoperative ureteric leak or anastomotic breakdown.",
      "Technique: exchange the tube for an angled catheter such as a cobra, use an angled wire to cross into the bladder, dilate the narrowing (a rigid plastic dilator is simplest), then place a double-J stent. Make sure the upper coil is in the pelvis and not in the parenchyma."
    ], src:"Sutton vol 2, p902–903" },

  { section:"gu", topic:"Percutaneous nephrolithotomy (PCNL) access",
    points:[
      "Indications: stones resistant to lithotripsy (pure calcium phosphate, cystine), stones over about 2.5 cm, or poor drainage such as a ureteric stricture.",
      "Under general anaesthesia, a 5 Fr retrograde ureteric catheter opacifies and distends the system; methylene blue helps tell bloodstained urine from a vascular puncture. The patient lies semiprone at about 45 degrees.",
      "Lower and mid-pole calyces are usually reached below the ribs. A puncture above the 12th rib is generally safe, but avoid going above the 11th rib (pleura).",
      "After an 18-gauge puncture and wire, dilate to 9 Fr, then to 28–30 Fr with a 10 mm high-pressure balloon, plastic dilators or telescopic metal dilators, and place an Amplatz sheath.",
      "Bleeding is common but usually minor. Dilators drifting too deep can injure hilar vessels; traumatic AV fistulas may need embolisation; bowel and pleural injury can occur. A nephrostogram at 3–4 days checks drainage and stone clearance."
    ], src:"Sutton vol 2, p902–903" },

  { section:"gu", topic:"Renal cyst aspiration and sclerotherapy; renal biopsy",
    points:[
      "Diagnostic aspiration of a complex cyst uses a 21–22 gauge needle under US, CT or MRI guidance as an outpatient procedure.",
      "For a large symptomatic simple cyst, aspirate to dryness with an 18-gauge sheathed needle. Inject contrast first to exclude leakage into the retroperitoneum, collecting system or veins.",
      "Sclerosant: absolute alcohol through a small pigtail, drained after about 10 min, or tetracycline 100 mg as an arguably safer option.",
      "Core biopsy is mainly for diffuse renal disease. Biopsy a renal mass only in selected cases, such as a solid mass in a patient with another known cancer, or a renal-bed recurrence after nephrectomy."
    ], src:"Sutton vol 2, p904–905" },

  { section:"gu", topic:"ESWL limits and steinstrasse",
    points:[
      "Stones over about 25 mm respond poorly to shock waves, because the many fragments can re-form stones or block the ureter; PCNL is often better.",
      "A distal ureteric stone lying over the sacrum may be impossible to target. Check drainage (stricture, bladder outflow) first, and consider a retrograde double-J before treatment.",
      "Steinstrasse (a column of fragments in the distal ureter) occurs in up to 10% and usually settles with analgesia and fluids; about a quarter need a stent or nephrostomy.",
      "Other complications: renal contusion, perinephric haematoma, transverse process fracture and possibly long-term hypertension."
    ], src:"Sutton vol 2, p905–906" },

  { section:"gu", topic:"Uterine, pudendal and renal embolisation: Sutton's figures",
    points:[
      "Bilateral uterine embolisation also controls bleeding from pelvic tumours, after radiotherapy, after trauma, and from rare uterine AVMs.",
      "Suspect a uterine AVM when there are recurrent torrential bleeds after miscarriage, D&C or evacuation of retained products. Colour Doppler shows a high-flow, low-impedance vascular area.",
      "For fibroids (PVA with or without Gelfoam), Sutton reports a 40–70% fall in uterine volume, better menstrual bleeding in 80–90%, and infection in 1–2%.",
      "Priapism can be treated by embolising the internal pudendal artery with Gelfoam.",
      "Renal embolisation with coils is the treatment of choice for a renal AVM and for false aneurysms after biopsy or trauma."
    ], src:"Sutton vol 1, p456, p459; vol 2, p1092" },

  { section:"gu", topic:"Gynaecological aspiration and drainage",
    points:[
      "Cysts are often not aspirated for fear of spilling malignant cells, but cysts likely to be benign can be drained through a full bladder or transvaginally.",
      "This relieves pain from functional or adhesion-related peritoneal cysts, but about 15–20% recur.",
      "Large tubo-ovarian abscesses can be aspirated or drained by whichever route suits their position, and ultrasound can guide drainage of an obstructed uterus."
    ], src:"Sutton vol 2, p1092–1093" },

  /* ---------- lines, tubes, drains ---------- */
  { section:"lines", topic:"Central venous catheters and the intra-aortic balloon pump",
    points:[
      "Common central catheter types are the Swan-Ganz, Hickman and Groshong, with single, double or triple lumens.",
      "Besides jugular and subclavian routes, catheters can go in through the common femoral, median basilic or cephalic veins, or even directly into the IVC.",
      "Complications: pneumothorax, mediastinal haematoma, catheter fracture, tunnel infection, septicaemia, catheter-related thrombosis and PE. Fractured fragments embolise centrally and should be snared out.",
      "An intra-aortic balloon pump (a rapidly cycling helium balloon) keeps diastolic aortic pressure up during catheter-lab emergencies. Ideally place it in the lab over a guide-wire under fluoroscopy, so it sits correctly in the descending thoracic aorta."
    ], src:"Sutton vol 1, p361–362, p454" }
];
