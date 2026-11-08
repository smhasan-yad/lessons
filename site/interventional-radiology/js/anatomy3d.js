/* 3D vascular explorer (Three.js r128, classic scripts so it runs from file://).
   Coordinates: +x = patient LEFT (appears on screen right in a frontal view, like a radiograph),
   +y = cranial, +z = anterior. 1 unit ~ 1 cm. Vertebral centres: T1 y=51, each level 3 units lower
   (T12 = 18, L1 = 15, L2 = 12, L3 = 9, L4 = 6, L5 = 3).
   Every vessel's first point lies on its parent, so routes can be traced through the tree. */
(function(){
const LV = ["T1","T2","T3","T4","T5","T6","T7","T8","T9","T10","T11","T12","L1","L2","L3","L4","L5"];
const lvY = i => 51 - 3*i;
function levelAt(y){
  if (y < 1.5) return "sacrum / pelvis";
  if (y > 52.5) return "cervical";
  const f = (51 - y)/3, i = Math.round(f);
  if (Math.abs(f - i) > 0.33) { const a = Math.floor(f), b = a+1; if (LV[a] && LV[b]) return LV[a]+"–"+LV[b]+" disc"; }
  return (LV[Math.max(0,Math.min(16,i))]) + " body";
}

/* ---------- vessel data ---------- */
const V = [];
function add(o){ V.push(o); return o; }
// helper for bilateral: define right side (x<0), mirror for left
function bi(base){
  const r = Object.assign({}, base, {id:"r"+base.id, name:"Right "+base.name, parent: base.parent ? (base.parentBi===false? base.parent : "r"+base.parent) : null, pts: base.pts});
  const l = Object.assign({}, base, {id:"l"+base.id, name:"Left "+base.name, parent: base.parent ? (base.parentBi===false? base.parent : "l"+base.parent) : null, pts: base.pts.map(p=>[-p[0],p[1],p[2]])});
  if (base.lparent) l.parent = base.lparent, l.pts = (base.lpts || l.pts);
  if (base.rparent) r.parent = base.rparent;
  delete r.lparent; delete r.rparent;
  add(r); add(l);
}

/* Arteries */
add({id:"aorta_th", name:"Thoracic aorta (ascending, arch, descending)", sys:"art", r:1.15, parent:null,
 pts:[[-0.6,37,5.2],[-1,41,5.6],[-0.8,45,5.2],[0,47.6,4],[1.3,47,2.6],[1.8,44,2],[1.8,38,2.2],[1.4,30,2.6],[1.0,22,3]],
 info:"Arch gives the brachiocephalic, left common carotid and left subclavian arteries. Traumatic pseudoaneurysm classically at the isthmus, just beyond the left subclavian (the book's case caption says “distal to the brachiocephalic artery”). Aortogram: 25 cc/s for 50 cc (pigtail).", page:604, cath:"Pigtail / flush catheter"});
add({id:"aorta_ab", name:"Abdominal aorta", sys:"art", r:0.95, parent:"aorta_th",
 pts:[[1.0,22,3],[0.8,18,3.2],[0.6,14,3.3],[0.5,10,3.3],[0.4,6,3.3]],
 info:"Celiac T12, SMA T12–L1, renals L1–L2, IMA L3 (left of midline), bifurcation about L4. Abdominal aortogram: 15 cc/s for 30 cc. EVAR endoleaks: type II (IMA, lumbars) most common.", page:599, cath:"Pigtail / flush catheter"});
add({id:"bca", name:"Brachiocephalic trunk", sys:"art", r:0.55, parent:"aorta_th", pts:[[-0.6,47,4.6],[-1.5,50,4.4],[-2.2,52.5,4]], info:"First arch branch; divides into right subclavian and right common carotid.", page:616});
add({id:"rsubcl", name:"Right subclavian artery", sys:"art", r:0.4, parent:"bca", pts:[[-2.2,52.5,4],[-4,54,3.6],[-7,54,3],[-9.5,53,2.6]], info:"Branches: vertebral, internal thoracic (mammary), thyrocervical, costocervical, dorsal scapular. Becomes axillary at the lateral margin of the 1st rib. Check it if hemoptysis persists after bronchial/pulmonary evaluation (p. 607).", page:616});
add({id:"lsubcl", name:"Left subclavian artery", sys:"art", r:0.4, parent:"aorta_th", pts:[[1.1,47.2,2.9],[1.8,50,3],[2.5,53,3.2],[4,54,3.4],[7,54,3],[9.5,53,2.6]], info:"Arises directly from the arch. Same five branches as the right. Becomes axillary at the lateral margin of the 1st rib.", page:616});
add({id:"rcca", name:"Right common carotid", sys:"art", r:0.4, parent:"bca", pts:[[-2.2,52.5,4],[-2.4,57,4],[-2.6,63,3.6]], info:"From the brachiocephalic trunk.", page:616});
add({id:"lcca", name:"Left common carotid", sys:"art", r:0.4, parent:"aorta_th", pts:[[0.2,47.8,3.8],[1.5,52,4],[2.4,57,4],[2.6,63,3.6]], info:"Second arch branch.", page:616});
add({id:"rvert", name:"Right vertebral artery", sys:"art", r:0.22, parent:"rsubcl", pts:[[-4,54,3.6],[-2.6,58,1.6],[-2.2,64,1]], info:"First subclavian branch.", page:616});
add({id:"lvert", name:"Left vertebral artery", sys:"art", r:0.22, parent:"lsubcl", pts:[[4,54,3.4],[2.6,58,1.6],[2.2,64,1]], info:"First subclavian branch.", page:616});
add({id:"rima", name:"Right internal thoracic (mammary) → superior epigastric", sys:"art", r:0.16, parent:"rsubcl", pts:[[-5,54,3.4],[-4.6,50,6],[-4.2,40,8],[-4,30,8.6],[-4.2,21,9.6],[-4.5,12,10]], info:"Runs down behind the anterior chest wall, continues as the superior epigastric, which anastomoses with the inferior epigastric: the pathway of Winslow (subclavian → internal mammary (internal thoracic) → superior epigastric → inferior epigastric → external iliac).", page:603});
add({id:"lima", name:"Left internal thoracic (mammary) → superior epigastric", sys:"art", r:0.16, parent:"lsubcl", pts:[[5,54,3.4],[4.6,50,6],[4.2,40,8],[4,30,8.6],[4.2,21,9.6],[4.5,12,10]], info:"Part of the pathway of Winslow collateral route to the legs.", page:603});
bi({id:"axill", name:"axillary artery", sys:"art", r:0.36, parent:"subcl", pts:[[-9.5,53,2.6],[-12,51,2],[-13.5,48,1.8]], info:"From the lateral margin of the 1st rib to the inferior margin of teres major; 3 parts, 6 branches.", page:616});
bi({id:"brach", name:"brachial artery", sys:"art", r:0.32, parent:"axill", pts:[[-13.5,48,1.8],[-14.5,40,1.5],[-15,33,1.8]], info:"Medial upper arm; gives the deep brachial; divides in the antecubital fossa into radial and ulnar. Brachial artery → forearm vein is a dialysis fistula site.", page:616});
bi({id:"radial", name:"radial artery", sys:"art", r:0.2, parent:"brach", pts:[[-15,33,1.8],[-16.5,26,2.2],[-17.4,19.5,2.4],[-16.8,17.6,2.4],[-15.4,17.4,2.2]], info:"Lateral forearm → anatomical snuffbox → deep palmar arch. Transradial access: Barbeau test (oximeter on thumb); type D = do not use. Spasm cocktail: heparin, nitroglycerin, verapamil. Radial → cephalic is the wrist dialysis fistula.", page:596});
bi({id:"ulnar", name:"ulnar artery", sys:"art", r:0.2, parent:"brach", pts:[[-15,33,1.8],[-14.8,26,1.8],[-15,19.5,2],[-15.6,16.6,2.6],[-17,16.4,2.6]], info:"Medial forearm → superficial palmar arch → common palmar digital arteries. Hypothenar hammer: injured as it crosses the hamate (jackhammer users) → digits 4–5 ischemia; treatment surgical. Reverse Barbeau: oximeter on 5th finger.", page:617});
add({id:"rbronch", level:"T5–T6", name:"Right bronchial artery", sys:"art", r:0.17, parent:"aorta_th", pts:[[1.7,37.6,2.3],[0.2,38,3.4],[-1.8,38.6,3.8],[-3.6,38.8,3.4]], info:"Bronchial arteries arise from the descending thoracic aorta at T5–T6 (variable; 1–2 per side). Source of 90% of massive hemoptysis. Embolize with particles to near-stasis; first exclude bronchial-to-pulmonary-vein shunting, which would carry particles to the brain (the book calls this a “left-to-right shunt”); beware anterior spinal artery. Catheter: Mickelson.", page:608, cath:"Mickelson (reform in the aorta), then microcatheter"});
add({id:"lbronch", level:"T5–T6", name:"Left bronchial artery", sys:"art", r:0.17, parent:"aorta_th", pts:[[1.9,36.6,2.4],[3,37,3.2],[4,37.4,3.4]], info:"T5–T6 origin. Coils are rarely used in BAE because rebleeding is common and coils block retreatment.", page:608, cath:"Mickelson, then microcatheter"});
// celiac axis
add({id:"celiac", level:"T12", name:"Celiac trunk", sys:"art", r:0.45, parent:"aorta_ab", pts:[[0.8,18,3.6],[0.8,18.3,5.8]], info:"Arises at T12. Classic trifurcation (about 75%): left gastric, common hepatic, splenic. Celiac–SMA collaterals (pancreaticoduodenal arcades) allow empiric upper GI embolization.", page:599, cath:"C2 (Cobra, a simple curve) or SOS (reverse curve); the chapter groups them together"});
add({id:"lga", name:"Left gastric artery", sys:"art", r:0.24, parent:"celiac", pts:[[0.8,18.3,5.8],[1.6,20.5,6.5],[2.4,22.5,6.2]], info:"Source of bleeding in Mallory-Weiss tear; may be embolized empirically for upper GI bleeding. Gives a replaced (11–12%) or accessory left hepatic artery.", page:599});
add({id:"splenic", name:"Splenic artery", sys:"art", r:0.34, parent:"celiac", pts:[[0.8,18.3,5.8],[2.5,18.6,5.4],[4,17.8,4.6],[5.5,19,3.6],[7.2,18.6,2.4],[8.5,19.6,1.5]], info:"Tortuous. Splenic artery aneurysm = most common visceral aneurysm (multiparous women, portal hypertension, ruptures in pregnancy). Treat if symptomatic, >2.5 cm, or before pregnancy: coil distal to the neck, then proximal. Proximal splenic embolization between the dorsal pancreatic and pancreatica magna preserves the spleen and avoids pancreatitis. Plugs for splenic trauma.", page:615});
add({id:"dpanc", name:"Dorsal pancreatic artery", sys:"art", r:0.11, parent:"splenic", pts:[[2.3,18.6,5.4],[2.6,16.8,5.2]], info:"Proximal landmark for proximal splenic artery embolization.", page:615});
add({id:"pmagna", name:"Pancreatica magna artery", sys:"art", r:0.11, parent:"splenic", pts:[[5.5,19,3.6],[5.7,17.4,3.9]], info:"Distal landmark: embolize the mid splenic artery between dorsal pancreatic and pancreatica magna.", page:615});
add({id:"cha", name:"Common hepatic artery", sys:"art", r:0.32, parent:"celiac", pts:[[0.8,18.3,5.8],[-1,18.2,6.2],[-2.6,18.4,6.2]], info:"Gives the GDA, then continues as the proper hepatic artery.", page:600});
add({id:"gda", name:"Gastroduodenal artery (GDA)", sys:"art", r:0.22, parent:"cha", pts:[[-2.6,18.4,6.2],[-2.9,16.5,7],[-3,14.6,7.4]], info:"Classic target for empiric embolization in duodenal ulcer bleeding (upper GI). Gives the superior pancreaticoduodenal and right gastroepiploic arteries.", page:610});
add({id:"spda", name:"Superior pancreaticoduodenal artery", sys:"art", r:0.1, parent:"gda", pts:[[-2.95,15.6,7.2],[-3.6,14.6,6.4],[-3.2,13.4,5.6]], info:"Forms the pancreaticoduodenal arcade with the inferior pancreaticoduodenal (SMA): the key celiac–SMA collateral.", page:601});
add({id:"rgea", name:"Right gastroepiploic artery", sys:"art", r:0.15, parent:"gda", pts:[[-3,14.6,7.4],[-1,13.4,8.4],[1.5,13.2,8.8],[3.5,14,8.4]], info:"From the GDA; meets the left gastroepiploic along the greater curvature.", page:600});
add({id:"lgea", name:"Left gastroepiploic artery", sys:"art", r:0.13, parent:"splenic", pts:[[7.2,18.6,2.4],[6.5,16,5.5],[5,14.4,7.8],[3.6,14,8.4]], info:"From the splenic artery; anastomoses with the right gastroepiploic along the greater curvature.", page:600});
add({id:"pha", name:"Proper hepatic artery", sys:"art", r:0.25, parent:"cha", pts:[[-2.6,18.4,6.2],[-3.4,19.8,5.8],[-4,21,5.4]], info:"Continuation of the CHA after the GDA (classic in ~75%). Divides into right and left hepatic arteries.", page:600});
add({id:"rha", name:"Right hepatic artery", sys:"art", r:0.21, parent:"pha", hideIn:["rrha"], pts:[[-4,21,5.4],[-5.6,21.6,4.6],[-7.4,22,3.6]], info:"Gives the cystic artery. For hepatic aneurysm, embolize distal to the cystic artery (proximal → ischemic cholecystitis in up to 10%).", page:615});
add({id:"lha", name:"Left hepatic artery", sys:"art", r:0.18, parent:"pha", hideIn:["rlha"], pts:[[-4,21,5.4],[-3.4,22.4,5.6],[-1.8,23.4,5.4]], info:"From the proper hepatic artery in classic anatomy.", page:600});
add({id:"cystic", name:"Cystic artery", sys:"art", r:0.1, parent:"rha", hideIn:["rrha"], pts:[[-5.4,21.5,4.7],[-5.8,20,6],[-6,18.8,6.6]], info:"From the right hepatic artery; supplies the gallbladder.", page:600});
add({id:"rrha", name:"Replaced right hepatic artery (from SMA)", sys:"art", r:0.2, parent:"sma", variant:"rrha", pts:[[0.7,15.6,5.8],[-1.8,16.6,5.2],[-4,19,4.2],[-5.6,21.6,4.6],[-7.4,22,3.6]], info:"Variant in 10–18%. Surgeon must know before laparoscopic cholecystectomy. Good for a living right-lobe donor (longer, larger); more arterial complications in a recipient. Accessory right hepatic = extra SMA branch with a normal RHA present.", page:600});
add({id:"cystic_r", name:"Cystic artery (from replaced RHA)", sys:"art", r:0.1, parent:"rrha", variant:"rrha", pts:[[-5.0,20.4,4.4],[-5.8,20,6],[-6,18.8,6.6]], info:"With a RRHA, the cystic artery arises from it.", page:600});
add({id:"rlha", name:"Replaced left hepatic artery (from left gastric)", sys:"art", r:0.17, parent:"lga", variant:"rlha", pts:[[1.6,20.5,6.5],[0.6,22,6.6],[-1.8,23.4,5.4]], info:"Variant in 11–12%. Matters in gastrectomy: resecting it may injure the liver. Accessory left hepatic = extra branch of the left gastric with a normal LHA present.", page:601});
// SMA
add({id:"sma", level:"T12–L1 disc", name:"Superior mesenteric artery (SMA)", sys:"art", r:0.44, parent:"aorta_ab", pts:[[0.6,16.5,3.5],[0.7,15.8,5.6],[0.5,13,7],[0,9,7.6],[-1.2,5,7.6]], info:"Anterior aorta at T12–L1. Supplies distal duodenum, all small bowel, colon to mid-transverse. Acute mesenteric ischemia is most often an SMA embolus; worst when distal to the middle colic. Mesenteric run: 5 cc/s for 25 cc. Lateral aortogram best shows its origin.", page:601, cath:"C2 / SOS (or Simmons)"});
add({id:"ipda", name:"Inferior pancreaticoduodenal artery", sys:"art", r:0.12, parent:"sma", pts:[[0.65,15.2,6.2],[-1.6,14.4,6.4],[-3.2,13.4,5.6]], info:"First SMA branch; collateral with the celiac via the superior pancreaticoduodenal.", page:601});
add({id:"midcolic", name:"Middle colic artery", sys:"art", r:0.17, parent:"sma", pts:[[0.6,14.2,6.8],[0.4,13.3,9.2],[-2.5,13,10],[-5.5,13.2,9]], info:"Supplies the transverse colon. Anastomoses with the IMA through the marginal artery of Drummond and the arc of Riolan.", page:601});
add({id:"midcolicL", name:"Middle colic, left branch → marginal artery of Drummond", sys:"art", r:0.12, parent:"midcolic", pts:[[0.4,13.3,9.2],[3,13.2,10],[6,13.4,9],[8,11.6,7],[8.3,8,6],[7.8,4,5.8],[5.6,2.6,5.6]], info:"The marginal artery of Drummond runs along the colon, linking SMA and IMA territories.", page:601});
add({id:"riolan", name:"Arc of Riolan", sys:"art", r:0.12, parent:"midcolic", collateral:true, pts:[[0.6,14,7.2],[2.5,12.8,5.8],[4.6,11.4,5.2],[5.6,10.6,5.1]], info:"Central SMA–IMA collateral (middle colic ↔ left colic). Enlarges when the IMA or SMA origin is occluded.", page:601});
add({id:"rcolic", name:"Right colic artery", sys:"art", r:0.15, parent:"sma", pts:[[0.2,11.5,7.4],[-3,11,6.8],[-6.5,11.5,6]], info:"Retroperitoneal; supplies the right colon and hepatic flexure.", page:601});
add({id:"ileocolic", name:"Ileocolic artery", sys:"art", r:0.2, parent:"sma", pts:[[-1.2,5,7.6],[-4,4,6.8],[-6,3,6]], info:"Terminal SMA branch: terminal ileum, cecum, appendix. Angiodysplasia favours cecum/ascending colon.", page:601});
add({id:"jej1", name:"Jejunal branches", sys:"art", r:0.12, parent:"sma", pts:[[0.55,12.5,7.2],[3.5,11.5,8.5],[5,9.5,8.4]], info:"Small bowel branches arise from the left side of the SMA.", page:601});
add({id:"jej2", name:"Ileal branches", sys:"art", r:0.12, parent:"sma", pts:[[0.2,9.8,7.5],[3,8,8.6],[4,5.5,8.6]], info:"Small bowel branches.", page:601});
// renal, IMA
add({id:"rrenal", level:"L1–L2 disc", name:"Right renal artery", sys:"art", r:0.3, parent:"aorta_ab", pts:[[0.3,13.6,2.9],[-2,13.4,2.2],[-4.5,13.2,1.2],[-6,13,0.6]], info:"Arise at L1–L2 disc. Passes behind the IVC. Renal run: 5 cc/s for 15 cc. Atherosclerotic RAS hits the ostium and proximal third. Trauma: superselective coils for extravasation, dissection, pseudoaneurysm (OIS IV).", page:599, cath:"C2 / SOS; RDC also used for renal/adrenal veins"});
add({id:"lrenal", level:"L1–L2 disc", name:"Left renal artery", sys:"art", r:0.3, parent:"aorta_ab", pts:[[0.8,13.6,2.9],[3,13.6,2.2],[4.8,13.3,1.2],[6.2,13.1,0.6]], info:"L1–L2 disc. Renal AVF (biopsy, trauma): vein fills in arterial phase; coils, glue or alcohol.", page:599, cath:"C2 / SOS"});
add({id:"ima", level:"L3", name:"Inferior mesenteric artery (IMA)", sys:"art", r:0.22, parent:"aorta_ab", pts:[[1.2,9,3.4],[2.2,8.4,5],[3,7.6,5.6]], info:"Left anterior aorta at L3. Gives left colic, sigmoid arteries, ends as superior rectal. Common source of type II endoleak after EVAR.", page:602, cath:"C2 / SOS"});
add({id:"lcolic", name:"Left colic artery", sys:"art", r:0.14, parent:"ima", pts:[[3,7.6,5.6],[5,9.5,5.2],[6.6,11.4,5]], info:"Supplies the descending colon.", page:602});
add({id:"sigmoid", name:"Sigmoid arteries", sys:"art", r:0.13, parent:"ima", pts:[[3,7.6,5.6],[4,5,6],[4.6,2.4,5.6]], info:"Variable number, in the sigmoid mesocolon.", page:602});
add({id:"suprectal", name:"Superior rectal (hemorrhoidal) artery", sys:"art", r:0.15, parent:"ima", pts:[[3,7.6,5.6],[2.2,4,5.2],[1,0,4.4],[0.3,-4,3.4]], info:"IMA termination; upper rectum. Hemorrhoid embolization: coil (or particle) its distal branches. Collateral with middle rectal via internal iliac arcades.", page:612});
[12,9].forEach((y,k)=>{ ["r","l"].forEach(s=>{ const sx = s==="r"?-1:1; add({id:s+"lumb"+k, name:(s==="r"?"Right":"Left")+" lumbar artery ("+(k?"L3":"L2")+")", sys:"art", r:0.1, parent:"aorta_ab", pts:[[0.45+sx*0.3,y,2.5],[sx*1.8,y,1.6],[sx*2.9,y,-0.2]], info:"Lumbar arteries arise posteriorly from the aorta. With the IMA, they are the usual source of type II endoleak.", page:614}); }); });
// iliacs (right then left)
add({id:"rcia", name:"Right common iliac artery", sys:"art", r:0.5, parent:"aorta_ab", pts:[[0.4,6,3.3],[-1.6,3.8,3.5],[-3.6,1.2,3.6]], info:"Crosses in front of the left common iliac vein near the confluence: May-Thurner compression.", page:621});
add({id:"lcia", name:"Left common iliac artery", sys:"art", r:0.5, parent:"aorta_ab", pts:[[0.4,6,3.3],[2.4,3.4,3.5],[4.2,1.2,3.6]], info:"From the aortic bifurcation (about L4).", page:602});
bi({id:"eia", name:"external iliac artery", sys:"art", r:0.4, parent:"cia", pts:[[-3.6,1.2,3.6],[-5.2,-1.6,4],[-6.6,-4,4.6],[-7.1,-5.2,5]], lpts:[[4.2,1.2,3.6],[5.4,-1.6,4],[6.6,-4,4.6],[7.1,-5.2,5]], info:"Branches: inferior epigastric and deep circumflex iliac. Becomes the CFA behind the inguinal ligament.", page:602});
bi({id:"iia", name:"internal iliac artery", sys:"art", r:0.32, parent:"cia", pts:[[-3.6,1.2,3.6],[-4,-0.5,2.4],[-4.4,-2,1.6]], lpts:[[4.2,1.2,3.6],[4.2,-0.5,2.4],[4.4,-2,1.6]], info:"Anterior division (viscera) and posterior division (muscles). Pelvic trauma: nonselective Gelfoam of a whole division is acceptable when life is at risk.", page:603, cath:"From R CFA: up-and-over (flush/OmniFlush) for the left side, then selective"});
bi({id:"adiv", name:"internal iliac anterior division", sys:"art", r:0.24, parent:"iia", pts:[[-4.4,-2,1.6],[-4.6,-4,2]], info:"Supplies most pelvic viscera: inferior gluteal, obturator, internal pudendal; variable uterine/prostatic, vesical and rectal branches.", page:603});
bi({id:"pdiv", name:"internal iliac posterior division", sys:"art", r:0.24, parent:"iia", pts:[[-4.4,-2,1.6],[-5,-2.6,0.4]], info:"Supplies pelvic and gluteal muscles: iliolumbar, lateral sacral, superior gluteal.", page:603});
bi({id:"sglut", name:"superior gluteal artery", sys:"art", r:0.2, parent:"pdiv", pts:[[-5,-2.6,0.4],[-6,-3,-1.2],[-7.4,-2.6,-2.8]], info:"Largest posterior division branch; exits above piriformis.", page:603});
bi({id:"iliolumb", name:"iliolumbar artery", sys:"art", r:0.12, parent:"pdiv", pts:[[-4.9,-2.4,0.6],[-5.2,0.4,0.2],[-6.6,2,0]], info:"Posterior division; anastomoses with the deep circumflex iliac (external iliac).", page:603});
bi({id:"latsac", name:"lateral sacral artery", sys:"art", r:0.1, parent:"pdiv", pts:[[-4.9,-2.5,0.5],[-3.2,-4,-0.8],[-2.6,-7,-1]], info:"Posterior division.", page:603});
bi({id:"iglut", name:"inferior gluteal artery", sys:"art", r:0.17, parent:"adiv", pts:[[-4.6,-4,2],[-5.2,-6,0.4],[-6.2,-8,-1.2]], info:"Anterior division.", page:603});
bi({id:"obt", name:"obturator artery", sys:"art", r:0.13, parent:"adiv", hideIn:["corona"], pts:[[-4.55,-3.4,1.9],[-5.6,-5,3],[-5.4,-8,3.6]], info:"Anterior division in standard anatomy; runs to the obturator foramen. Possible prostatic artery origin.", page:603});
bi({id:"ipud", name:"internal pudendal artery", sys:"art", r:0.14, parent:"adiv", pts:[[-4.6,-4,2],[-4.2,-7,1],[-3.4,-10,1.8]], info:"Anterior division. Bleeding source in the pelvic trauma case in the book. Possible prostatic artery origin.", page:606});
bi({id:"uterine", name:"uterine / prostatic artery", sys:"art", r:0.12, parent:"adiv", pts:[[-4.55,-3.6,2.1],[-3,-4.4,3.4],[-1.4,-4,3.8]], info:"Variable origin; identify by territory. UAE: particles for fibroids, Gelfoam for PPH; end-point near-stasis; risk ovarian nontarget embolization. PAE: prostatic artery may arise from superior vesical, internal pudendal, obturator or internal iliac.", page:644, cath:"Microcatheter (superselective)"});
bi({id:"corona", name:"obturator artery from external iliac (corona mortis)", sys:"art", r:0.13, parent:"eia", variant:"corona", pts:[[-6.8,-4.6,4.8],[-6.4,-5.8,4.2],[-5.4,-8,3.6]], lpts:[[6.8,-4.6,4.8],[6.4,-5.8,4.2],[5.4,-8,3.6]], info:"\"Crown of death\": obturator artery arising from the external iliac. Important in pelvic trauma and surgical/IR planning.", page:603});
bi({id:"infepi", name:"inferior epigastric artery", sys:"art", r:0.13, parent:"eia", pts:[[-7.0,-4.9,4.9],[-6.2,-3,6.6],[-5.4,2,8.8],[-4.6,10,10]], lpts:[[7.0,-4.9,4.9],[6.2,-3,6.6],[5.4,2,8.8],[4.6,10,10]], info:"From the distal EIA; anastomoses with the superior epigastric (pathway of Winslow). Mark it on US before paracentesis.", page:602});
bi({id:"dcia", name:"deep circumflex iliac artery", sys:"art", r:0.1, parent:"eia", pts:[[-6.9,-4.7,4.8],[-8.4,-4,4],[-9.4,-1.6,3]], lpts:[[6.9,-4.7,4.8],[8.4,-4,4],[9.4,-1.6,3]], info:"Anastomoses with the iliolumbar (internal iliac).", page:602});
bi({id:"cfa", name:"common femoral artery", sys:"art", r:0.4, parent:"eia", pts:[[-7.1,-5.2,5],[-7.4,-8,5.2],[-7.6,-11,5]], info:"Most common arterial access. Puncture over the inferomedial femoral head: a hard backstop for compression, and artery beside nerve. Too high → retroperitoneal hematoma; too low → AV fistula (vein runs deep to artery). NAVL lateral→medial.", page:596, cath:"Access site"});
bi({id:"pfa", name:"profunda femoris artery", sys:"art", r:0.3, parent:"cfa", pts:[[-7.6,-11,5],[-8.3,-12.5,3.6],[-8.6,-17,2.4],[-8.4,-24,2]], info:"Posterior CFA branch; medial and posterior thigh and proximal femur via medial and lateral circumflex femoral arteries.", page:618});
bi({id:"sfa", name:"superficial femoral artery", sys:"art", r:0.3, parent:"cfa", pts:[[-7.6,-11,5],[-7.4,-16,4.6],[-6.8,-24,3.4],[-6.2,-30,1.6],[-6,-33,0]], info:"Runs in the adductor canal (avoid balloon-expandable stents here: external compression), exits the adductor hiatus to become the popliteal. TASC-II femoropopliteal classes A–D.", page:618});
bi({id:"pop", name:"popliteal artery", sys:"art", r:0.28, parent:"sfa", pts:[[-6,-33,0],[-6,-36,-1.2],[-6.1,-39,-1.2]], info:"Behind the knee (a joint: prefer self-expanding stents). Divides below popliteus into the anterior tibial and tibioperoneal trunk.", page:618});
bi({id:"ata", name:"anterior tibial artery", sys:"art", r:0.17, parent:"pop", pts:[[-6.1,-39,-1.2],[-6.9,-39.8,0.4],[-7.1,-46,1.4],[-7.1,-54,1.8],[-7,-57,2.2]], info:"Pierces the interosseous membrane into the anterior compartment; continues as dorsalis pedis.", page:618});
bi({id:"dp", name:"dorsalis pedis artery", sys:"art", r:0.13, parent:"ata", pts:[[-7,-57,2.2],[-6.8,-58.5,4],[-6.4,-59,6.6]], info:"Continuation of the ATA on the dorsum of the foot.", page:618});
bi({id:"tpt", name:"tibioperoneal trunk", sys:"art", r:0.22, parent:"pop", pts:[[-6.1,-39,-1.2],[-6,-41,-1.2]], info:"Divides into peroneal and posterior tibial arteries.", page:618});
bi({id:"per", name:"peroneal artery", sys:"art", r:0.14, parent:"tpt", pts:[[-6,-41,-1.2],[-6.9,-46,-1],[-7.4,-54,-0.6]], info:"Lateral compartment of the leg.", page:618});
bi({id:"pta", name:"posterior tibial artery", sys:"art", r:0.15, parent:"tpt", pts:[[-6,-41,-1.2],[-5.3,-46,-1.4],[-4.9,-55,-1],[-4.8,-57.5,0],[-5,-58.6,2.5],[-5.8,-59.2,5]], info:"Deep posterior compartment; through the tarsal tunnel with the tibial nerve; divides into medial and lateral plantar arteries.", page:618});

/* Veins (central → peripheral) */
add({id:"ivc", name:"Inferior vena cava", sys:"vein", r:0.9, parent:null, pts:[[-1.2,3,2],[-1.8,8,2.2],[-2.2,13.6,2.4],[-2.4,18,3],[-2.6,24,3.4],[-2.4,29,4]], info:"Cavogram (20 cc/s for 30 cc, pigtail) before any filter. Filter just below the lowest renal vein. Most filters fit <28–30 mm; megacava >30 mm → Bird's Nest (≤40 mm, permanent) or bilateral iliac filters.", page:623, cath:"Pigtail for cavogram"});
add({id:"svc", name:"Superior vena cava (via right atrium)", sys:"vein", r:0.8, parent:"ivc", pts:[[-2.4,29,4],[-2.4,34,4.2],[-2.4,38,4.2],[-2.6,42,4.4],[-2.8,46,4.6]], info:"SVC syndrome: malignancy, catheter thrombosis, fibrosing mediastinitis. CT clue: hot segment IVa via vein of Sappey. Often stented, may need jugular + femoral access.", page:622});
add({id:"azygos", name:"Azygos vein", sys:"vein", r:0.28, parent:"svc", pts:[[-2.6,43,4.4],[-1.6,43,3],[-1,40,1.4],[-0.9,30,1],[-0.8,16,0.6]], info:"Receives esophageal varices (coronary vein → azygos/hemiazygos) (the book also lists gastric fundal varices here, though these usually drain via a gastrorenal shunt to the left renal vein). IVC interruption with azygos continuation: polysplenia, congenital heart disease.", page:633});
bi({id:"brv", name:"brachiocephalic vein", sys:"vein", r:0.5, parent:"svc", parentBi:false, pts:[[-2.8,46,4.6],[-3.6,50,4.4],[-4.4,52.4,4.2]], lpts:[[-2.8,46,4.6],[0,48.8,5.4],[3,51,5],[4.4,52.4,4.2]], info:"Left brachiocephalic crosses in front of the arch branches. The subclavian/brachiocephalic confluence is the usual residual stenosis site in Paget-Schroetter.", page:620});
bi({id:"ij", name:"internal jugular vein", sys:"vein", r:0.45, parent:"brv", pts:[[-4.4,52.4,4.2],[-3.6,57,4.4],[-3.4,63,4]], info:"Preferred vein for central lines, tunneled catheters and ports (IR), and the route for TIPS and transjugular liver biopsy. Right IJ also used for left varicocele embolization.", page:647, cath:"Access site"});
bi({id:"subv", name:"subclavian vein", sys:"vein", r:0.4, parent:"brv", pts:[[-4.4,52.4,4.2],[-7,53.4,3.6],[-9.5,52.6,3]], info:"Paget-Schroetter: compression and effort thrombosis at the thoracic inlet in muscular young men. Thrombolysis, then surgical decompression; avoid stents. Surgeons often place ports via the subclavian.", page:620});
bi({id:"axv", name:"axillary vein", sys:"vein", r:0.34, parent:"subv", pts:[[-9.5,52.6,3],[-12.4,50.6,2.6],[-13.6,48.2,2.4]], info:"Formed by the basilic vein joining the brachial veins at the lower border of teres major; becomes the subclavian vein at the outer border of the 1st rib.", page:648});
bi({id:"basilic", name:"basilic vein", sys:"vein", r:0.22, parent:"axv", pts:[[-13.6,48.2,2.4],[-13.4,42,2.6],[-14,34,2.8]], info:"First choice for PICC: medial and superficial to the brachial veins. Brachial veins risk the median nerve. Avoid PICCs in CKD patients who may need a fistula.", page:648, cath:"PICC access"});
bi({id:"ceph", name:"cephalic vein", sys:"vein", r:0.18, parent:"subv", pts:[[-9.2,52.8,3.4],[-11.4,51.2,4.4],[-13.8,48,3.6],[-15.8,42,2.8],[-16.2,34,2.6]], info:"Second choice for PICC (extra curve where it joins the axillary/subclavian). Radial artery → cephalic vein = wrist dialysis fistula.", page:648});
add({id:"rhv", name:"Right hepatic vein", sys:"vein", r:0.42, parent:"ivc", pts:[[-2.6,24.8,3.4],[-4.5,24.4,2.8],[-7,24,2]], info:"TIPS usually connects the right hepatic vein to the right portal vein (constant anatomy, larger than the left). Wedged hepatic vein pressure ≈ portal pressure; gradient = wedged − free. Budd-Chiari = hepatic vein thrombosis.", page:634});
add({id:"mhv", name:"Middle hepatic vein", sys:"vein", r:0.3, parent:"ivc", pts:[[-2.6,25,3.6],[-3.2,23.6,4.6],[-4,21,6]], info:"Hepatic venous outflow.", page:634});
add({id:"lhv", name:"Left hepatic vein", sys:"vein", r:0.28, parent:"ivc", pts:[[-2.5,25.2,3.6],[-1,24.4,4.8],[0.5,22,6.5]], info:"Smaller and more variable than the right hepatic vein.", page:634});
add({id:"rrv", name:"Right renal vein", sys:"vein", r:0.34, parent:"ivc", pts:[[-2.2,13.8,2.4],[-4,13.4,1.6],[-6,13,0.8]], info:"Short; drains directly into the IVC.", page:624});
add({id:"lrv", name:"Left renal vein (pre-aortic)", sys:"vein", r:0.32, parent:"ivc", hideIn:["retro"], pts:[[-2.2,14,2.6],[-1,14.4,3.6],[0.4,14.7,5],[1.6,14.4,4.6],[3.6,13.8,2.6],[6.2,13.2,0.8]], info:"Crosses between the aorta (behind) and SMA (in front): nutcracker syndrome when compressed (hematuria, pain, orthostatic proteinuria, pelvic congestion, varicocele). Receives the left gonadal vein at an acute angle (left varicocele, pelvic congestion).", page:621});
add({id:"lrv_retro", name:"Retroaortic left renal vein (variant)", sys:"vein", r:0.28, parent:"ivc", variant:"retro", variant2:"circum", pts:[[-2.2,10.2,2.2],[0.5,10.6,1.9],[3,11.4,1.6],[6.2,12.8,0.6]], info:"Retroaortic LRV (2–7%) passes behind the aorta and joins the IVC lower than the right renal vein. In a circumaortic LRV (2–10%) both this limb and the normal pre-aortic limb exist. Place the filter below the lowest renal vein.", page:624});
add({id:"livc", name:"Left IVC (duplication variant)", sys:"vein", r:0.6, parent:"lrv", variant:"dup", pts:[[3.6,13.8,2.6],[2.8,10,2.2],[2.6,5,2.2],[3.6,0.6,2.4]], info:"Duplicated IVC: the left IVC drains into the left renal vein. Filter above the confluence or one in each IVC. Clue on cavography: no inflow from the contralateral iliac vein.", page:623});
add({id:"rgonv", name:"Right gonadal vein", sys:"vein", r:0.13, parent:"ivc", pts:[[-1.9,10,2.3],[-3.4,4,3],[-5,-4,4]], info:"Drains directly into the IVC, entering obliquely (an acute angle), so reflux is less common than on the left.", page:626});
add({id:"lgonv", name:"Left gonadal vein", sys:"vein", r:0.14, parent:"lrv", pts:[[4,13.7,2.3],[4,10,2.4],[4.4,4,3.2],[5,-4,4]], info:"Drains into the left renal vein at an acute angle → reflux. Left varicocele; pelvic venous congestion (coils at the inguinal canal + liquid/foam above). Isolated RIGHT varicocele → look for a retroperitoneal mass.", page:625});
add({id:"rciv", name:"Right common iliac vein", sys:"vein", r:0.55, parent:"ivc", pts:[[-1.2,3,2],[-2.4,1.2,2.2],[-3.8,-1,2.6]], info:"Joins the left CIV to form the IVC.", page:621});
add({id:"lciv", name:"Left common iliac vein", sys:"vein", r:0.55, parent:"ivc", pts:[[-1.2,3,2],[1.5,2,1.9],[4,0,2.4],[4.6,-1.2,2.6]], info:"May-Thurner: compressed by the crossing right common iliac artery → spur, DVT. Diagnose with venography + IVUS; thrombolysis then self-expanding stent.", page:621});
bi({id:"eiv", name:"external iliac vein", sys:"vein", r:0.45, parent:"civ", pts:[[-3.8,-1,2.6],[-5,-4,3.6],[-6,-6.4,4.6]], lpts:[[4.6,-1.2,2.6],[5.6,-4,3.6],[6,-6.4,4.6]], info:"Continuation of the common femoral vein.", page:621});
bi({id:"cfv", name:"common femoral vein", sys:"vein", r:0.42, parent:"eiv", pts:[[-6,-6.4,4.6],[-6.2,-9,4.8],[-6.3,-11.5,4.6],[-6.6,-14,3.6]], info:"Medial to the CFA (NAVL). Below the standard puncture level the vein runs deep to the artery → risk of AV fistula with a low arterial stick. Access for IVC filters (right CFV), varicocele (right CFV for a left varicocele), BRTO.", page:596, cath:"Access site"});
/* Portal (central → peripheral) */
add({id:"pv", name:"Main portal vein", sys:"portal", r:0.55, parent:null, pts:[[-1.2,16,6],[-2.4,18.2,5.6],[-3.4,20,5]], info:"Formed by SMV + splenic vein. Normal liver gets most blood from the portal vein; HCC from the hepatic artery. Portal vein thrombosis contraindicates TACE (not TARE). Confirm patency before TIPS.", page:633});
add({id:"rpv", name:"Right portal vein", sys:"portal", r:0.38, parent:"pv", pts:[[-3.4,20,5],[-5,20.6,4.4],[-6.8,20.8,3.6]], info:"TIPS target (from the right hepatic vein). Usual target for portal vein embolization before right hepatectomy (future liver remnant hypertrophies; book p641).", page:635});
add({id:"lpv", name:"Left portal vein", sys:"portal", r:0.3, parent:"pv", pts:[[-3.4,20,5],[-2.4,21.6,5.6],[-0.8,22.2,6]], info:"Gives the paraumbilical vein (caput medusae collateral).", page:633});
add({id:"smv", name:"Superior mesenteric vein", sys:"portal", r:0.4, parent:"pv", pts:[[-1.2,16,6],[-0.8,13.4,6.8],[-1.4,9,7.4],[-2.4,4,7.4]], info:"Lies to the right of the SMA. Mesenteric varices: SMV/IMV → iliac veins.", page:633});
add({id:"splv", name:"Splenic vein", sys:"portal", r:0.35, parent:"pv", pts:[[-1.2,16,6],[0.4,16.4,5.6],[3.4,17,4.8],[6,18.4,3.2],[8.2,19.2,1.6]], info:"Gastric fundal varices: the book draws them as splenic vein → azygos, but they usually drain through a gastrorenal shunt to the left renal vein, which is why BRTO goes in from the left renal vein (p. 636).", page:633});
add({id:"imv", name:"Inferior mesenteric vein", sys:"portal", r:0.2, parent:"splv", pts:[[2.8,16.9,4.9],[3.4,12,5],[3.2,6,5],[1.4,-2,4.6]], info:"Hemorrhoids: IMV → inferior hemorrhoidal veins.", page:633});
add({id:"coronary", name:"Coronary (left gastric) vein", sys:"portal", r:0.17, parent:"splv", collateral:true, pts:[[0.4,16.4,5.6],[1.4,19.4,5.6],[1.8,23,4],[1.4,26,2.4],[-0.9,28,1]], info:"Esophageal varices: coronary vein → azygos/hemiazygos. Most important portosystemic collateral to know.", page:633});
add({id:"paraumb", name:"Paraumbilical vein", sys:"portal", r:0.11, parent:"lpv", collateral:true, pts:[[-0.8,22.2,6],[-0.6,16,9.2],[0,6,10.4]], info:"Caput medusae: umbilical vein → epigastric veins.", page:633});
add({id:"grshunt", name:"Gastrorenal shunt", sys:"portal", r:0.2, parent:"splv", collateral:true, pts:[[5.6,18.2,3.4],[5.4,16.4,2.4],[4.6,14.2,2.4]], info:"Spontaneous shunt from gastric varices to the left renal vein. Required for BRTO: balloon in the shunt outflow (via LRV), sclerosant upstream, balloon left 4–24 h.", page:636});
/* Lymphatics */
add({id:"cchyli", name:"Cisterna chyli", sys:"lymph", r:0.55, parent:null, pts:[[-0.6,11,1.9],[-0.6,15,2]], info:"Seen at L1–L3 after intranodal lipiodol (5 mL per leg + 20 mL saline). Punctured directly with a long 21 G needle for thoracic duct embolization.", page:628});
add({id:"tduct", name:"Thoracic duct", sys:"lymph", r:0.15, parent:"cchyli", pts:[[-0.6,15,2],[-0.4,22,1.4],[0,32,1.4],[1,42,1.8],[2,50,2.4],[3.2,54,3.4],[4.2,52.8,4]], info:"Carries 1–2 L/day (p. 627); empties at the left venous angle (IJ/subclavian). TDE: coil the duct then glue 1:1 with lipiodol. If the IVC was crossed, glue may embolize to the pulmonary arteries.", page:628});
bi({id:"lumbtrunk", name:"lumbar lymphatic trunk", sys:"lymph", r:0.12, parent:"cchyli", parentBi:false, pts:[[-0.6,11,1.9],[-2,6,1.8],[-3.4,0,2.2]], info:"Drains the legs and pelvis into the cisterna chyli.", page:627});
/* Nerves (for NAVL) */
bi({id:"fnerve", name:"femoral nerve", sys:"nerve", r:0.14, parent:null, pts:[[-8.5,-4,4],[-8.7,-8,5],[-8.9,-12,4.6]], info:"Most lateral in NAVL. At the femoral head level the artery and nerve lie side by side.", page:596});

/* ---------- organs and bones ---------- */
const ORG = [
 {n:"Liver", c:[-4.6,21.5,3.6], s:[6,3.6,4.2], col:0x8b4a3a},
 {n:"Spleen", c:[8.6,19.6,0.8], s:[1.6,2.8,2.2], col:0x7a3b5a},
 {n:"Right kidney", c:[-7.2,12.6,0], s:[1.6,2.6,1.4], col:0x9a5040},
 {n:"Left kidney", c:[7.2,13.2,0], s:[1.6,2.6,1.4], col:0x9a5040},
 {n:"Heart", c:[-0.4,33,6], s:[3.6,3.2,3], col:0xa03a3a},
 {n:"Stomach", c:[3.4,18.4,7], s:[3,2.2,1.8], col:0xb08a6a},
 {n:"Bladder", c:[0,-7,5], s:[2,1.6,1.8], col:0xc0a060}
];
const BONES = [ // tubes
 [[-1.4,1.5,-2.2],[-5,4,-2.4],[-8.6,3.5,-0.5],[-9.6,0,2.6],[-9.4,-3,4.4]],
 [[1.4,1.5,-2.2],[5,4,-2.4],[8.6,3.5,-0.5],[9.6,0,2.6],[9.4,-3,4.4]],
 [[-1.4,0.5,-1.6],[-4.8,-1.6,-0.4],[-6.6,-4.4,1.6],[-5.4,-7.6,4.4],[-2.2,-9.2,5.4],[0,-9.4,5.6]],
 [[1.4,0.5,-1.6],[4.8,-1.6,-0.4],[6.6,-4.4,1.6],[5.4,-7.6,4.4],[2.2,-9.2,5.4],[0,-9.4,5.6]],
 [[-6.6,-4.4,1.6],[-7.2,-8,0.8],[-6.2,-11.6,1.4],[-3.4,-11.4,3.4],[-2.2,-9.2,5.4]],
 [[6.6,-4.4,1.6],[7.2,-8,0.8],[6.2,-11.6,1.4],[3.4,-11.4,3.4],[2.2,-9.2,5.4]],
 [[-7.9,-9.8,2.8],[-9.6,-11.6,2.6],[-8.4,-22,2],[-6.4,-34,1]], [[7.9,-9.8,2.8],[9.6,-11.6,2.6],[8.4,-22,2],[6.4,-34,1]],
 [[-5.8,-36.5,1],[-5.8,-56,1.4]], [[5.8,-36.5,1],[5.8,-56,1.4]],
 [[-8.2,-37.5,-0.4],[-8,-56.5,0.2]], [[8.2,-37.5,-0.4],[8,-56.5,0.2]],
 [[-11.5,52,1.6],[-13.8,46,1.4],[-14.6,33,1.2]], [[11.5,52,1.6],[13.8,46,1.4],[14.6,33,1.2]],
 [[-15.6,32,1.6],[-17,19.6,2]], [[15.6,32,1.6],[17,19.6,2]], [[-14.4,32.4,1],[-15,19.6,1.4]], [[14.4,32.4,1],[15,19.6,1.4]],
 [[-1.8,50.2,5.6],[-6,51.6,5.2],[-10,53.6,3.4]], [[1.8,50.2,5.6],[6,51.6,5.2],[10,53.6,3.4]],
 [[-1.2,50.4,-0.2],[-5,52,0.8],[-8.6,51.8,3.2],[-6,50.6,5.2],[-2.4,49.8,5.8]], [[1.2,50.4,-0.2],[5,52,0.8],[8.6,51.8,3.2],[6,50.6,5.2],[2.4,49.8,5.8]]
];

/* ---------- tours ---------- */
const TOURS = {
 landmarks:{t:"Aortic landmarks top to bottom", ids:["aorta_th","rbronch","celiac","sma","lrenal","ima","rcia"]},
 celiac:{t:"Celiac axis piece by piece", ids:["celiac","lga","splenic","dpanc","pmagna","lgea","cha","gda","spda","rgea","pha","rha","cystic","lha"]},
 mesenteric:{t:"SMA, IMA and their collaterals", ids:["sma","ipda","midcolic","riolan","midcolicL","rcolic","ileocolic","ima","lcolic","sigmoid","suprectal"]},
 pelvis:{t:"Pelvis: internal and external iliac", ids:["rcia","riia","rpdiv","riliolumb","rlatsac","rsglut","radiv","riglut","robt","ripud","ruterine","reia","rinfepi","rdcia","rcfa"]},
 leg:{t:"Leg runoff", ids:["rcfa","rpfa","rsfa","rpop","rata","rdp","rtpt","rper","rpta"]},
 arm:{t:"Upper extremity", ids:["bca","rsubcl","rvert","rima","raxill","rbrach","rradial","rulnar"]},
 veins:{t:"Veins and compression syndromes", ids:["ivc","rrv","lrv","lgonv","rciv","lciv","rcfv","svc","rbrv","rij","rsubv","rbasilic","rceph","azygos"]},
 portal:{t:"Portal system and collaterals", ids:["pv","smv","splv","imv","rpv","lpv","coronary","paraumb","grshunt","rhv"]},
 lymph:{t:"Lymphatics", ids:["rlumbtrunk","cchyli","tduct"]}
};

/* ---------- engine ---------- */
let R = null; // runtime state
const COL = {art:0xd23c46, vein:0x2f6fc4, portal:0x7b55d6, lymph:0xe0b23a, nerve:0xe6d64f};
const ORGCOL = {liver:0x9a4636, spleen:0x7a3456, kidney:0x9b5040, stomach:0xc99c7c, pancreas:0xd8b06a, gallbladder:0x4f9a5c, duodenum:0xc7957a, bladder:0xd9c17a, heart:0xb13b42, lung:0xc98f9a, colon:0xb98a6e};
const HAS = !!window.IR_ANAT;
const lin = hex => new THREE.Color(hex).convertSRGBToLinear();
if (HAS && !V._warped) { V.forEach(v=>{ const w = IR_ANAT.warp[v.id]; if (w) v.pts = w; }); V._warped = true; }
const LEVELS = HAS ? IR_ANAT.levels : LV.map((n,i)=>({n, y:lvY(i), z:-0.6}));
function levelAt2(y){
  const L = LEVELS; if (y > L[0].y + 1.6) return "above T1 (cervical)"; if (y < L[16].y - 1.8) return "sacrum / pelvis";
  let best = 0; L.forEach((l,i)=>{ if (Math.abs(l.y-y) < Math.abs(L[best].y-y)) best = i; });
  const nb = y > L[best].y ? best-1 : best+1;
  if (nb>=0 && nb<17){ const half = Math.abs(L[nb].y - L[best].y)/2; if (Math.abs(y - L[best].y) > half*0.62) { const a = Math.min(best,nb); return L[a].n+"–"+L[a+1].n+" disc"; } }
  return L[best].n+" body";
}
const yOf = n => (LEVELS.find(l=>l.n===n)||LEVELS[11]).y;

/* fresnel "x-ray ghost" material, clipping-aware */
function ghostMat(color, op){
  return new THREE.ShaderMaterial({
    uniforms:{color:{value:new THREE.Color(color)}, op:{value:op}}, transparent:true, depthWrite:false, side:THREE.DoubleSide, clipping:true,
    vertexShader:`#include <clipping_planes_pars_vertex>
      varying vec3 vN; varying vec3 vV;
      void main(){ vec4 mvPosition = modelViewMatrix*vec4(position,1.0); vN = normalize(normalMatrix*normal); vV = normalize(-mvPosition.xyz); gl_Position = projectionMatrix*mvPosition;
      #include <clipping_planes_vertex>
      }`,
    fragmentShader:`#include <clipping_planes_pars_fragment>
      uniform vec3 color; uniform float op; varying vec3 vN; varying vec3 vV;
      void main(){
      #include <clipping_planes_fragment>
      float f = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 2.2); gl_FragColor = vec4(color*(0.55+0.9*f), op*(0.12+0.88*f)); }`
  });
}
function decodeMesh(m){
  const b = atob(m.p), q = new Uint16Array(b.length/2); for (let i=0;i<q.length;i++) q[i] = b.charCodeAt(2*i) | (b.charCodeAt(2*i+1)<<8);
  const pos = new Float32Array(q.length); for (let i=0;i<q.length;i+=3){ pos[i] = m.lo[0]+q[i]*m.s; pos[i+1] = m.lo[1]+q[i+1]*m.s; pos[i+2] = m.lo[2]+q[i+2]*m.s; }
  const fb = atob(m.f); const bytes = new Uint8Array(fb.length); for (let i=0;i<fb.length;i++) bytes[i] = fb.charCodeAt(i);
  const idx = m.i32 ? new Uint32Array(bytes.buffer) : new Uint16Array(bytes.buffer);
  const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.BufferAttribute(pos,3)); g.setIndex(new THREE.BufferAttribute(idx,1)); g.computeVertexNormals(); return g;
}
function taper(geo, curve, seg, rad, f1){
  const pos = geo.attributes.position, n = rad+1, t = new THREE.Vector3();
  for (let i=0;i<=seg;i++){ const c = curve.getPointAt(i/seg), f = 1 + (f1-1)*(i/seg); for (let j=0;j<=rad;j++){ const k = i*n+j; t.fromBufferAttribute(pos,k).sub(c).multiplyScalar(f).add(c); pos.setXYZ(k,t.x,t.y,t.z); } }
  pos.needsUpdate = true; geo.computeVertexNormals();
}
function studioEnv(renderer){
  const pm = new THREE.PMREMGenerator(renderer), s = new THREE.Scene();
  const g = new THREE.SphereGeometry(50, 32, 16), cols = []; const pos = g.attributes.position;
  for (let i=0;i<pos.count;i++){ const y = pos.getY(i)/50; const c = new THREE.Color().setHSL(0.6, 0.1, 0.18 + 0.55*Math.max(0,y)); cols.push(c.r,c.g,c.b); }
  g.setAttribute("color", new THREE.Float32BufferAttribute(cols,3));
  s.add(new THREE.Mesh(g, new THREE.MeshBasicMaterial({vertexColors:true, side:THREE.BackSide})));
  [[0,40,10,3],[30,10,30,1.4],[-30,5,-20,1]].forEach(([x,y,z,k])=>{ const p = new THREE.Mesh(new THREE.PlaneGeometry(26,16), new THREE.MeshBasicMaterial({color:new THREE.Color(k,k,k)})); p.position.set(x,y,z); p.lookAt(0,0,0); s.add(p); });
  const rt = pm.fromScene(s, 0.04); pm.dispose(); return rt.texture;
}

function mount(host, opts){
  if (!window.THREE) { host.innerHTML = '<p class="warn">Three.js did not load (lib/three.min.js).</p>'; return; }
  if (R && R.host === host) { if (opts && opts.focus) focus(opts.focus); return; }
  if (R) destroy();
  host.innerHTML = UI();
  const stage = host.querySelector(".x3-stage");
  const W = () => stage.clientWidth, H = () => stage.clientHeight;
  const renderer = new THREE.WebGLRenderer({antialias:true, alpha:true, preserveDrawingBuffer:true});
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio||1)); renderer.setSize(W(), H());
  renderer.outputEncoding = THREE.sRGBEncoding; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
  renderer.localClippingEnabled = true; renderer.autoClear = false;
  stage.prepend(renderer.domElement);
  const scene = new THREE.Scene(); scene.environment = studioEnv(renderer);
  const camera = new THREE.PerspectiveCamera(36, W()/H(), 0.1, 2000);
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; controls.dampingFactor = 0.08; controls.rotateSpeed = 0.7; controls.minDistance = 8; controls.maxDistance = 260;
  scene.add(new THREE.HemisphereLight(0xffffff, 0x2a3240, 0.55));
  const key = new THREE.DirectionalLight(0xfff4e6, 1.1); key.position.set(30, 60, 80); scene.add(key);
  const rim = new THREE.DirectionalLight(0xbcd4ff, 0.6); rim.position.set(-40, 10, -60); scene.add(rim);

  const groups = {art:new THREE.Group(), vein:new THREE.Group(), portal:new THREE.Group(), lymph:new THREE.Group(), nerve:new THREE.Group(), bone:new THREE.Group(), organ:new THREE.Group(), label:new THREE.Group(), route:new THREE.Group()};
  Object.values(groups).forEach(g=>scene.add(g));
  const byId = {}; const pickables = [];
  const hide = new Set(HAS ? IR_ANAT.hide : []);
  V.forEach(v=>{
    const curve = new THREE.CatmullRomCurve3(v.pts.map(p=>new THREE.Vector3(p[0],p[1],p[2])), false, "centripetal");
    v.curve = curve; v.pts3 = curve.getSpacedPoints(120); byId[v.id] = v; v.objs = []; v.mats = [];
    v.kids = V.filter(k=>k.parent===v.id).map(k=>k.id);
    if (hide.has(v.id)) return;
    const seg = Math.max(16, v.pts.length*16), rad = 14;
    const geo = new THREE.TubeGeometry(curve, seg, v.r, rad, false);
    taper(geo, curve, seg, rad, v.kids.length ? 0.92 : 0.7);
    const mat = new THREE.MeshPhysicalMaterial({color:lin(COL[v.sys]), roughness:0.34, metalness:0.0, clearcoat:0.6, clearcoatRoughness:0.25, envMapIntensity:0.7, transparent:true, opacity:1});
    const m = new THREE.Mesh(geo, mat); m.userData.v = v;
    const cap = new THREE.Mesh(new THREE.SphereGeometry(v.r, 14, 10), mat); cap.position.copy(curve.getPointAt(0)); cap.userData.v = v; m.add(cap);
    groups[v.sys].add(m); v.objs.push(m); v.mats.push(mat); pickables.push(m);
  });
  if (HAS) {
    const boneMat = new THREE.MeshStandardMaterial({color:lin(0xe6dccb), roughness:0.62, metalness:0, envMapIntensity:0.8, transparent:true, opacity:1});
    const boneGhost = ghostMat(0xf2ead9, 0.55);
    IR_ANAT.meshes.forEach(md=>{
      const g = decodeMesh(md);
      if (md.g === "bone") { const m = new THREE.Mesh(g, boneMat); m.userData.ctx = md.n; m.userData.ghost = boneGhost; m.userData.solid = boneMat; groups.bone.add(m); pickables.push(m); return; }
      if (md.g === "organ") { const k = Object.keys(ORGCOL).find(k=>md.n.includes(k)) || "liver"; const m = new THREE.Mesh(g, ghostMat(ORGCOL[k], 0.75)); m.userData.ctx = md.n.replace(", nsn",""); m.renderOrder = 2; groups.organ.add(m); pickables.push(m); return; }
      const v = md.v && byId[md.v];
      if (!v || !hide.has(v.id)) { if (!md.v) { const m = new THREE.Mesh(g, new THREE.MeshPhysicalMaterial({color:lin(COL[md.g]), roughness:.35, clearcoat:.6, envMapIntensity:0.7, transparent:true})); m.userData.ctx = md.n; groups[md.g].add(m); pickables.push(m); } return; }
      const mat = new THREE.MeshPhysicalMaterial({color:lin(COL[v.sys]), roughness:0.34, clearcoat:0.6, clearcoatRoughness:0.25, envMapIntensity:0.7, transparent:true, opacity:1});
      const m = new THREE.Mesh(g, mat); m.userData.v = v; groups[v.sys].add(m); v.objs.push(m); v.mats.push(mat); pickables.push(m);
    });
  } else {
    const boneMat = new THREE.MeshStandardMaterial({color:0xd9d2c3, roughness:0.85, transparent:true, opacity:0.55});
    LV.forEach((n,i)=>{ const y = lvY(i), rad = i<12 ? 1.5+i*0.03 : 1.9+(i-12)*0.05; const m = new THREE.Mesh(new THREE.CylinderGeometry(rad,rad,2.3,20), boneMat); m.position.set(0,y,-0.6); groups.bone.add(m); });
    BONES.forEach(b=>{ const c = new THREE.CatmullRomCurve3(b.map(p=>new THREE.Vector3(...p))); groups.bone.add(new THREE.Mesh(new THREE.TubeGeometry(c, 40, b.length<3?0.5:0.32, 8, false), boneMat)); });
    ORG.forEach(o=>{ const m = new THREE.Mesh(new THREE.SphereGeometry(1,28,20), ghostMat(o.col, .6)); m.position.set(...o.c); m.scale.set(...o.s); m.userData.ctx = o.n; groups.organ.add(m); });
  }
  LEVELS.forEach((l,i)=>groups.label.add(textSprite(l.n, -3.4, l.y, l.z, i===11||i===12)));

  // orientation cube (anatomical directions)
  const gScene = new THREE.Scene(), gCam = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  const cube = new THREE.Mesh(new THREE.BoxGeometry(1.6,1.6,1.6), ["L","R","S","I","A","P"].map(t=>new THREE.MeshBasicMaterial({map:faceTex(t)})));
  // BoxGeometry face order: +x, -x, +y, -y, +z, -z  →  patient Left, Right, Superior, Inferior, Anterior, Posterior
  gScene.add(cube);

  R = {host, stage, renderer, scene, camera, controls, groups, byId, pickables, sel:null, hover:null, variants:new Set(), raf:0, anim:null, quiz:null, tour:null, route:null, dsa:false, gScene, gCam, clip:null, labels:true};
  applyVariants(); wireUI(host);
  const ray = new THREE.Raycaster(), mouse = new THREE.Vector2(); const tip = host.querySelector(".x3-tip");
  function pick(ev){
    const r = renderer.domElement.getBoundingClientRect();
    mouse.x = ((ev.clientX - r.left)/r.width)*2-1; mouse.y = -((ev.clientY - r.top)/r.height)*2+1;
    ray.setFromCamera(mouse, camera);
    const vis = pickables.filter(m=>m.visible && m.parent.visible && !(m.userData.ctx && R.dsa));
    const hits = ray.intersectObjects(vis, true).filter(h=>!R.clip || R.clip.distanceToPoint(h.point) >= 0 || (h.object.userData.v));
    const hv = hits.find(h=>(h.object.userData.v || (h.object.parent && h.object.parent.userData.v)));
    const h = hv || hits[0]; if (!h) return null;
    const v = h.object.userData.v || (h.object.parent && h.object.parent.userData.v);
    return v ? {v} : {ctx:h.object.userData.ctx};
  }
  let down = null;
  renderer.domElement.addEventListener("pointerdown", e=>{ down = [e.clientX, e.clientY]; });
  renderer.domElement.addEventListener("pointerup", e=>{
    if (!down || Math.hypot(e.clientX-down[0], e.clientY-down[1]) > 5) return;
    if (R.quiz) return; const p = pick(e); if (p && p.v) select(p.v.id, false); else if (p && p.ctx) showCtx(p.ctx);
  });
  renderer.domElement.addEventListener("pointermove", e=>{
    const p = pick(e); const r = stage.getBoundingClientRect();
    const v = p && p.v; if (R.hover !== v) { R.hover = v; refreshHighlight(); }
    if (p && !R.quiz) { tip.style.display="block"; tip.textContent = v ? v.name : p.ctx; tip.style.left = (e.clientX-r.left+14)+"px"; tip.style.top = (e.clientY-r.top+10)+"px"; renderer.domElement.style.cursor = v ? "pointer" : "default"; }
    else { tip.style.display="none"; renderer.domElement.style.cursor="grab"; }
  });
  const ro = new ResizeObserver(()=>{ renderer.setSize(W(), H()); camera.aspect = W()/H(); camera.updateProjectionMatrix(); });
  ro.observe(stage); R.ro = ro;
  view("ap", true);
  (function loop(){ R.raf = requestAnimationFrame(loop); step(); controls.update(); render(); })();
  if (opts && opts.focus) setTimeout(()=>focus(opts.focus), 60);
}
function render(){
  const r = R.renderer, w = R.stage.clientWidth, h = R.stage.clientHeight;
  r.setViewport(0,0,w,h); r.setScissorTest(false); r.clear(); r.render(R.scene, R.camera);
  // gizmo
  const s = 86; r.clearDepth(); r.setScissorTest(true); r.setScissor(14, 14, s, s); r.setViewport(14, 14, s, s);
  const dir = new THREE.Vector3().subVectors(R.camera.position, R.controls.target).normalize().multiplyScalar(5.2);
  R.gCam.position.copy(dir); R.gCam.up.copy(R.camera.up); R.gCam.lookAt(0,0,0); r.render(R.gScene, R.gCam); r.setScissorTest(false);
  updateLabels();
}
function faceTex(t){
  const c = document.createElement("canvas"); c.width = c.height = 128; const g = c.getContext("2d");
  g.fillStyle = "rgba(248,248,246,0.96)"; g.fillRect(0,0,128,128); g.strokeStyle = "#9aa1a9"; g.lineWidth = 6; g.strokeRect(3,3,122,122);
  g.fillStyle = "#1d2228"; g.font = "600 64px -apple-system, 'Segoe UI', sans-serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(t, 64, 68);
  const tx = new THREE.CanvasTexture(c); tx.encoding = THREE.sRGBEncoding; return tx;
}
function destroy(){ if (!R) return; cancelAnimationFrame(R.raf); R.ro.disconnect(); R.renderer.dispose(); R = null; }

function textSprite(txt, x, y, z, strong){
  const c = document.createElement("canvas"); c.width = 128; c.height = 64; const g = c.getContext("2d");
  g.font = (strong?"600 ":"500 ")+"30px -apple-system, 'Segoe UI', sans-serif"; g.fillStyle = strong ? "#f2c14e" : "#c9ced6"; g.textAlign="right"; g.textBaseline="middle"; g.fillText(txt, 124, 32);
  const s = new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c), depthTest:false, transparent:true}));
  s.scale.set(2.3,1.15,1); s.material.opacity = 0.8; s.position.set(x-1.0,y,z); return s;
}

const ICON = {
  layers:'<svg viewBox="0 0 20 20"><path d="M10 3 2 7l8 4 8-4-8-4Zm-8 7 8 4 8-4M2 13l8 4 8-4"/></svg>',
  tour:'<svg viewBox="0 0 20 20"><path d="M4 16V4l12 6-12 6Z"/></svg>',
  route:'<svg viewBox="0 0 20 20"><circle cx="5" cy="15" r="2"/><circle cx="15" cy="5" r="2"/><path d="M6.5 13.5C9 11 7 8 10 7s3.5-.5 3.5-.5"/></svg>',
  info:'<svg viewBox="0 0 20 20"><circle cx="10" cy="10" r="7.5"/><path d="M10 9v5M10 6.2v.1"/></svg>',
  search:'<svg viewBox="0 0 20 20"><circle cx="8.5" cy="8.5" r="5.5"/><path d="m13 13 4.5 4.5"/></svg>'
};
function UI(){
  const tours = Object.entries(TOURS).map(([k,t])=>`<option value="${k}">${t.t}</option>`).join("");
  const targ = V.filter(v=>["art","vein","portal"].includes(v.sys)).sort((a,b)=>a.name.localeCompare(b.name)).map(v=>`<option value="${v.id}">${v.name}</option>`).join("");
  const sw = (attr, label, on) => `<label class="sw"><span>${label}</span><input type="checkbox" ${attr} ${on?"checked":""}><i></i></label>`;
  return `<div class="x3">
  <div class="x3-stage"><div class="x3-tip"></div><svg class="x3-lab"></svg>
    <div class="x3-views seg" role="tablist">${[["ap","Front"],["lat","Side"],["obl","Oblique"],["chest","Chest"],["abd","Abdomen"],["pelvis","Pelvis"],["leg","Legs"]].map(([k,l])=>`<button data-view="${k}">${l}</button>`).join("")}</div>
    <div class="x3-quizbar" hidden></div>
    <div class="x3-legend"><span class="dot art"></span>Artery<span class="dot vein"></span>Vein<span class="dot portal"></span>Portal<span class="dot lymph"></span>Lymph</div>
    <div class="x3-credit">Bones, organs and major vessels: BodyParts3D © DBCLS, CC BY-SA 2.1 JP. Branches: modelled from Core Radiology.</div>
  </div>
  <aside class="x3-side glass">
    <div class="tabs seg small" role="tablist"><button data-tab="info" class="on">${ICON.info}Inspector</button><button data-tab="layers">${ICON.layers}View</button><button data-tab="learn">${ICON.tour}Learn</button><button data-tab="route">${ICON.route}Route</button></div>
    <section data-pane="info">
      <div class="x3-search">${ICON.search}<input class="x3-find" placeholder="Find a structure"></div><div class="x3-found"></div>
      <div class="x3-info"><p class="muted">Click any vessel to see its origin level, territory and IR relevance. Hover bones and organs to name them.</p></div>
    </section>
    <section data-pane="layers" hidden>
      <h4>Systems</h4>
      ${sw('data-layer="art"',"Arteries",1)}${sw('data-layer="vein"',"Veins",1)}${sw('data-layer="portal"',"Portal veins",1)}${sw('data-layer="lymph"',"Lymphatics",1)}${sw('data-layer="nerve"',"Nerves",1)}${sw('data-layer="organ"',"Organs (x-ray)",1)}${sw('data-layer="bone"',"Skeleton",1)}${sw('data-layer="label"',"Vertebral levels",1)}
      <h4>Display</h4>
      ${sw("data-bghost","Skeleton as x-ray",0)}${sw("data-pins","Pinned labels",1)}${sw("data-isolate","Isolate selected branch",0)}${sw("data-dsa","DSA look",0)}
      <h4>Cut away</h4>
      <div class="seg small" data-cutmode><button data-cut="none" class="on">None</button><button data-cut="axial">Axial</button><button data-cut="coronal">Coronal</button></div>
      <input type="range" min="0" max="100" value="60" data-cutpos disabled><div class="muted small" data-cutlbl>Removes bone and organs on one side of a plane; vessels stay.</div>
      <h4>Variants</h4>
      ${[["rrha","Replaced right hepatic (SMA), 10–18%"],["rlha","Replaced left hepatic (LGA), 11–12%"],["corona","Corona mortis"],["retro","Retroaortic left renal vein"],["circum","Circumaortic left renal vein"],["dup","Duplicated IVC"]].map(([k,l])=>sw(`data-var="${k}"`,l,0)).join("")}
    </section>
    <section data-pane="learn" hidden>
      <h4>Guided tours</h4><p class="muted small">Step through one region, a vessel at a time.</p>
      <select class="x3-tours">${tours}</select>
      <div class="row"><button class="btn sm" data-act="tour">Start tour</button></div>
      <h4>Self-test</h4><p class="muted small">A vessel pulses; pick its name from four options.</p>
      <button class="btn sm ghost" data-act="quiz">Start name-that-vessel</button>
    </section>
    <section data-pane="route" hidden>
      <h4>Catheter route planner</h4>
      <label class="lbl">Access</label><select class="x3-access"><option value="rcfa">Right CFA (retrograde)</option><option value="lradial">Left radial artery</option><option value="rcfv">Right common femoral vein</option><option value="rij">Right internal jugular vein</option><option value="rbasilic">Right basilic vein (PICC)</option></select>
      <label class="lbl">Target</label><select class="x3-target">${targ}</select>
      <div class="row"><button class="btn sm" data-act="route">Trace route</button><button class="btn sm ghost" data-act="clearroute">Clear</button></div>
      <div class="x3-routeinfo"></div>
    </section>
  </aside></div>`;
}
function tab(k){ R.host.querySelectorAll("[data-tab]").forEach(b=>b.classList.toggle("on", b.dataset.tab===k)); R.host.querySelectorAll("[data-pane]").forEach(p=>p.hidden = p.dataset.pane!==k); }

function wireUI(host){
  host.querySelectorAll("[data-tab]").forEach(b=>b.addEventListener("click", ()=>tab(b.dataset.tab)));
  host.querySelectorAll("[data-layer]").forEach(cb=>cb.addEventListener("change", ()=>{ R.groups[cb.dataset.layer].visible = cb.checked; }));
  host.querySelector("[data-dsa]").addEventListener("change", e=>setDSA(e.target.checked));
  host.querySelector("[data-isolate]").addEventListener("change", ()=>refreshHighlight());
  host.querySelector("[data-pins]").addEventListener("change", e=>{ R.labels = e.target.checked; });
  host.querySelector("[data-bghost]").addEventListener("change", e=>{ R.groups.bone.children.forEach(m=>{ if (m.userData.ghost) m.material = e.target.checked ? m.userData.ghost : m.userData.solid; }); applyClip(); });
  host.querySelectorAll("[data-var]").forEach(cb=>cb.addEventListener("change", ()=>{ cb.checked ? R.variants.add(cb.dataset.var) : R.variants.delete(cb.dataset.var); applyVariants(); }));
  host.querySelectorAll("[data-view]").forEach(b=>b.addEventListener("click", ()=>view(b.dataset.view)));
  host.querySelectorAll("[data-cut]").forEach(b=>b.addEventListener("click", ()=>{ host.querySelectorAll("[data-cut]").forEach(x=>x.classList.toggle("on", x===b)); host.querySelector("[data-cutpos]").disabled = b.dataset.cut==="none"; applyClip(); }));
  host.querySelector("[data-cutpos]").addEventListener("input", applyClip);
  host.querySelector('[data-act="tour"]').addEventListener("click", ()=>startTour(host.querySelector(".x3-tours").value));
  host.querySelector('[data-act="quiz"]').addEventListener("click", startQuiz);
  host.querySelector('[data-act="route"]').addEventListener("click", ()=>traceRoute(host.querySelector(".x3-access").value, host.querySelector(".x3-target").value));
  host.querySelector('[data-act="clearroute"]').addEventListener("click", clearRoute);
  const f = host.querySelector(".x3-find"), out = host.querySelector(".x3-found");
  f.addEventListener("input", ()=>{ const q = f.value.trim().toLowerCase(); out.innerHTML = !q ? "" : V.filter(v=>v.name.toLowerCase().includes(q)).slice(0,10).map(v=>`<button class="chip" data-go="${v.id}">${v.name}</button>`).join(""); });
  out.addEventListener("click", e=>{ const b = e.target.closest("[data-go]"); if (b) { select(b.dataset.go, true); out.innerHTML = ""; f.value = ""; } });
}
function applyClip(){
  const mode = R.host.querySelector("[data-cut].on").dataset.cut, k = +R.host.querySelector("[data-cutpos]").value/100, lbl = R.host.querySelector("[data-cutlbl]");
  let plane = null;
  if (mode==="axial") { const y = -60 + k*115; plane = new THREE.Plane(new THREE.Vector3(0,-1,0), y); lbl.textContent = "Bone and organs above "+levelAt2(y)+" removed."; }
  else if (mode==="coronal") { const z = -8 + k*22; plane = new THREE.Plane(new THREE.Vector3(0,0,-1), z); lbl.textContent = "Front "+Math.round((1-k)*100)+"% of bone and organs removed."; }
  else lbl.textContent = "Removes bone and organs on one side of a plane; vessels stay.";
  R.clip = plane;
  [R.groups.bone, R.groups.organ].forEach(g=>g.children.forEach(m=>{ const ms = [m.material, m.userData.ghost, m.userData.solid].filter(Boolean); ms.forEach(mt=>{ mt.clippingPlanes = plane ? [plane] : []; mt.needsUpdate = true; }); }));
}

function applyVariants(){
  V.forEach(v=>{
    let show = true;
    if (v.variant) show = R.variants.has(v.variant) || (v.variant2 && R.variants.has(v.variant2));
    if (v.hideIn && v.hideIn.some(k=>R.variants.has(k))) show = false;
    if (v.id==="lrv" && R.variants.has("circum")) show = true;
    v.objs.forEach(o=>o.visible = show); v.hidden = !show;
  });
}
function setDSA(on){
  R.dsa = on;
  R.stage.classList.toggle("dsa", on);
  V.forEach(v=>v.mats.forEach(m=>m.color.copy(on ? lin(0x161616) : lin(COL[v.sys]))));
  ["bone","organ","label"].forEach(k=>{ R.groups[k].visible = !on && R.host.querySelector(`[data-layer="${k}"]`).checked; });
  refreshHighlight();
}
function regionView(k){
  const T = yOf("T4"), L1 = yOf("L1"), L5 = yOf("L5");
  return {ap:[[0,(T+L5)/2-12,150],[0,(T+L5)/2-12,2]], lat:[[150,(T+L5)/2-8,2],[0,(T+L5)/2-8,2]], obl:[[95,(T+L5)/2,110],[0,(T+L5)/2-6,2]],
    chest:[[0,T,60],[0,T,2]], abd:[[0,L1+1,56],[0,L1+1,3]], pelvis:[[0,L5-8,58],[0,L5-8,2]], leg:[[0,-55,120],[0,-55,1]]}[k];
}
function view(k, instant){ const P = regionView(k); if (instant){ R.camera.position.set(...P[0]); R.controls.target.set(...P[1]); } else fly(P[0], P[1]); R.host.querySelectorAll("[data-view]").forEach(b=>b.classList.toggle("on", b.dataset.view===k)); }
function fly(pos, tgt, ms){
  const c = R.camera, t = R.controls.target;
  R.anim = {t0:performance.now(), ms:ms||900, p0:c.position.clone(), p1:new THREE.Vector3(...pos), q0:t.clone(), q1:new THREE.Vector3(...tgt)};
}
function step(){
  const a = R.anim;
  if (a) { const k = Math.min(1,(performance.now()-a.t0)/a.ms), e = k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;
    R.camera.position.lerpVectors(a.p0,a.p1,e); R.controls.target.lerpVectors(a.q0,a.q1,e); if (k>=1) R.anim = null; }
  if (R.route && R.route.k < 1) { R.route.k = Math.min(1, (performance.now()-R.route.t0)/2800); const n = Math.floor(R.route.count*R.route.k); R.route.mesh.geometry.setDrawRange(0, n*6*8); R.route.tip.position.copy(R.route.curve.getPointAt(R.route.k)); }
  const pulse = 0.5+0.5*Math.sin(performance.now()/260);
  if (R.sel && !R.dsa) R.sel.mats.forEach(m=>m.emissive.setRGB(0.32*pulse+0.18, 0.26*pulse+0.14, 0.04));
}
function short(v){ const twin = /^[rl]/.test(v.id) && R && R.byId[(v.id[0]==='r'?'l':'r')+v.id.slice(1)]; return twin ? v.name.replace(/^(Right|Left) /,"") : v.name; }
function lineage(id){ const out = new Set(); let v = R.byId[id]; while (v){ out.add(v.id); v = R.byId[v.parent]; } return out; }
function descendants(id, out){ out = out || new Set(); out.add(id); (R.byId[id].kids||[]).forEach(k=>descendants(k,out)); return out; }
function refreshHighlight(){
  const iso = R.host.querySelector("[data-isolate]").checked && R.sel;
  const keep = iso ? new Set([...lineage(R.sel.id), ...descendants(R.sel.id)]) : null;
  V.forEach(v=>v.mats.forEach(m=>{ m.emissive.setRGB(0,0,0); m.opacity = keep ? (keep.has(v.id)?1:0.07) : 1; m.depthWrite = m.opacity === 1; }));
  if (R.hover && R.hover !== R.sel && !R.dsa) R.hover.mats.forEach(m=>m.emissive.setRGB(0.12,0.12,0.12));
}
/* pinned labels: selected structure + its branches, with leader lines */
function updateLabels(){
  const svg = R.host.querySelector(".x3-lab"); if (!svg) return;
  if (!R.labels || !R.sel || R.quiz) { if (svg.childElementCount) svg.innerHTML = ""; return; }
  const w = R.stage.clientWidth, h = R.stage.clientHeight, cam = R.camera;
  const ids = [R.sel.id, ...R.sel.kids.filter(k=>!R.byId[k].hidden)].slice(0, 9);
  const used = []; let out = "";
  ids.forEach((id,i)=>{
    const v = R.byId[id]; const p = v.curve.getPointAt(i===0 ? 0.5 : 0.75).clone().project(cam);
    if (p.z > 1) return; const x = (p.x*0.5+0.5)*w, y = (-p.y*0.5+0.5)*h;
    const right = x > w*0.45; let ly = y - 28; while (used.some(u=>Math.abs(u-ly) < 22)) ly -= 22; used.push(ly);
    const lx = right ? x + 46 : x - 46; const name = i===0 ? v.name : short(v);
    out += `<g class="${i===0?"main":""}"><circle cx="${x}" cy="${y}" r="3.5"/><polyline points="${x},${y} ${lx},${ly} ${lx+(right?8:-8)},${ly}"/><text x="${lx+(right?12:-12)}" y="${ly+4}" text-anchor="${right?"start":"end"}">${name}</text></g>`;
  });
  svg.innerHTML = out;
}
function showCtx(n){
  tab("info");
  R.host.querySelector(".x3-info").innerHTML = `<h3>${n.charAt(0).toUpperCase()+n.slice(1)}</h3><p class="muted">Context structure (BodyParts3D). Useful for orientation: vessels are what the chapter tests.</p>`;
}
function select(id, flyTo){
  const v = R.byId[id]; if (!v) return;
  if (v.hidden && v.variant) { R.variants.add(v.variant); const cb = R.host.querySelector(`[data-var="${v.variant}"]`); if (cb) cb.checked = true; applyVariants(); }
  if (!R.groups[v.sys].visible) { R.groups[v.sys].visible = true; const cb = R.host.querySelector(`[data-layer="${v.sys}"]`); if (cb) cb.checked = true; }
  R.sel = v; refreshHighlight(); tab("info");
  const box = R.host.querySelector(".x3-info");
  const par = R.byId[v.parent];
  const meas = levelAt2(v.pts[0][1]);
  const lvl = v.sys==="art" && par && (par.id==="aorta_ab"||par.id==="aorta_th") ? `<div class="kv2"><span>Origin level</span><span><b>${v.level || meas}</b>${v.level ? ` <span class="muted small">(book)${v.level!==meas && HAS ? `; ${meas} in this body` : ""}</span>` : ""}</span></div>` : "";
  const simC = (()=>{ if (!window.IRDSASIM || v.sys!=="art") return null; let x = v; while (x) { const c = IRDSASIM.CATH.find(c=>c.v===x.id && (!c.flush || x.id===v.id)); if (c) return c; x = R.byId[x.parent]; } return null; })();
  box.innerHTML = `<h3>${v.name}</h3>
   <div class="tagrow"><span class="tag ${v.sys}">${{art:"Artery",vein:"Vein",portal:"Portal vein",lymph:"Lymphatic",nerve:"Nerve"}[v.sys]}</span>${v.collateral?'<span class="tag">Collateral</span>':""}${v.variant?'<span class="tag warn">Variant</span>':""}${HAS && IR_ANAT.hide.includes(v.id)?'<span class="tag">Real mesh</span>':""}</div>
   ${lvl}${par?`<div class="kv2"><span>Arises from</span><a href="#" data-go="${par.id}">${par.name}</a></div>`:""}
   ${v.kids.length?`<div class="kv2"><span>Branches</span><span>${v.kids.filter(k=>!R.byId[k].hidden).map(k=>`<a href="#" data-go="${k}">${short(R.byId[k])}</a>`).join(", ")}</span></div>`:""}
   <p>${v.info||""}</p>${v.cath?`<div class="cath"><b>Catheter</b> ${v.cath}</div>`:""}
   <div class="row">${window.IR_PRIVATE?`<a class="btn sm ghost" href="#/book/${v.page}">Book page ${v.page}</a>`:`<span class="muted small">Core Radiology 2e, p. ${v.page}</span>`}<button class="btn sm ghost" data-routeto="${v.id}">Route here</button>${simC?`<a class="btn sm ghost" href="#/dsa?m=sim&c=${simC.k}" title="Inject from: ${simC.n}">Simulate a DSA run</a>`:""}</div>`;
  box.querySelectorAll("[data-go]").forEach(a=>a.addEventListener("click", e=>{ e.preventDefault(); select(a.dataset.go, true); }));
  const rt = box.querySelector("[data-routeto]"); if (rt) rt.addEventListener("click", ()=>{ R.host.querySelector(".x3-target").value = v.id; const acc = v.sys==="art" ? "rcfa" : (v.sys==="portal"||["rhv","mhv","lhv","svc","azygos"].includes(v.id) ? "rij" : "rcfv"); R.host.querySelector(".x3-access").value = acc; tab("route"); traceRoute(acc, v.id); });
  if (flyTo) { const c = v.curve.getPointAt(0.5); const d = Math.max(34, v.curve.getLength()*1.6); fly([c.x+d*0.15, c.y+d*0.1, c.z+d], [c.x,c.y,c.z]); }
  if (window.IRStudy) IRStudy.mark("v3d:"+id);
}
function focus(id){ if (R) select(id, true); }

/* ----- tours ----- */
function startTour(k){
  R.quiz = null; const T = TOURS[k]; R.tour = {k, i:0};
  const bar = R.host.querySelector(".x3-quizbar"); bar.hidden = false;
  const show = ()=>{ const id = T.ids[R.tour.i]; select(id, true);
    bar.innerHTML = `<b>${T.t}</b><span class="muted">${R.tour.i+1} of ${T.ids.length}</span><span>${R.byId[id].name}</span>
    <span class="sp"></span><button class="btn sm ghost" data-t="prev">Back</button><button class="btn sm" data-t="next">${R.tour.i===T.ids.length-1?"Finish":"Next"}</button><button class="btn sm ghost" data-t="end" aria-label="Close">✕</button>`;
    bar.querySelector('[data-t="prev"]').onclick = ()=>{ R.tour.i = Math.max(0,R.tour.i-1); show(); };
    bar.querySelector('[data-t="next"]').onclick = ()=>{ if (R.tour.i===T.ids.length-1) return endBar(); R.tour.i++; show(); };
    bar.querySelector('[data-t="end"]').onclick = endBar; };
  show();
}
function endBar(){ const bar = R.host.querySelector(".x3-quizbar"); bar.hidden = true; R.tour = null; R.quiz = null; }

/* ----- quiz ----- */
function startQuiz(){ R.tour = null; R.quiz = {score:0, n:0}; nextQ(); }
function nextQ(){
  const pool = V.filter(v=>!v.hidden && v.objs.length && R.groups[v.sys].visible && ["art","vein","portal","lymph"].includes(v.sys) && !/lumbar artery|Jejunal|Ileal/.test(v.name));
  const ans = pool[Math.floor(Math.random()*pool.length)];
  const same = pool.filter(v=>v!==ans && v.sys===ans.sys); const opts = [ans];
  while (opts.length<4 && same.length){ const o = same.splice(Math.floor(Math.random()*same.length),1)[0]; if (!opts.some(x=>x.name.replace(/^(Right|Left) /,"")===o.name.replace(/^(Right|Left) /,""))) opts.push(o); }
  opts.sort(()=>Math.random()-.5);
  R.quiz.ans = ans; R.sel = ans; refreshHighlight();
  const c = ans.curve.getPointAt(0.5); fly([c.x+6, c.y+5, c.z+40], [c.x,c.y,c.z], 700);
  const bar = R.host.querySelector(".x3-quizbar"); bar.hidden = false;
  bar.innerHTML = `<b>Which vessel is pulsing?</b><span class="muted">${R.quiz.score} of ${R.quiz.n}</span><span class="sp"></span>` + opts.map(o=>`<button class="btn sm ghost" data-q="${o.id}">${o.name}</button>`).join("") + `<button class="btn sm ghost" data-q="__end" aria-label="Close">✕</button>`;
  bar.querySelectorAll("[data-q]").forEach(b=>b.onclick = ()=>{
    if (b.dataset.q==="__end") return endBar();
    R.quiz.n++; const ok = b.dataset.q === ans.id; if (ok) R.quiz.score++;
    b.classList.add(ok?"ok":"bad"); if (!ok) bar.querySelector(`[data-q="${ans.id}"]`).classList.add("ok");
    if (window.IRStudy) IRStudy.logQuiz("3d", ok);
    setTimeout(()=>{ if (R.quiz) nextQ(); }, ok?700:1600);
  });
}

/* ----- route planner ----- */
function nearestIdx(v, p){ let best=0, bd=1e9; v.pts3.forEach((q,i)=>{ const d = q.distanceToSquared(p); if (d<bd){bd=d;best=i;} }); return best; }
function chainUp(id){ const out=[]; let v = R.byId[id]; while(v){ out.push(v.id); v = R.byId[v.parent]; } return out; }
function seg(v, a, b){ const P = v.pts3; const out=[]; if (a<=b) for(let i=a;i<=b;i++) out.push(P[i]); else for(let i=a;i>=b;i--) out.push(P[i]); return out; }
function routePoints(fromId, fromIdx, toId){
  const up = chainUp(fromId), down = chainUp(toId); const lca = up.find(x=>down.includes(x));
  if (!lca) return null;
  const pts = [], names = [];
  let cur = fromId, idx = fromIdx;
  while (cur !== lca){ const v = R.byId[cur]; pts.push(...seg(v, idx, 0)); names.push(v.name); const par = R.byId[v.parent]; idx = nearestIdx(par, v.pts3[0]); cur = par.id; }
  const path = down.slice(0, down.indexOf(lca)).reverse();
  const L = R.byId[lca]; const exitIdx = path.length ? nearestIdx(L, R.byId[path[0]].pts3[0]) : 120;
  pts.push(...seg(L, idx, exitIdx)); names.push(L.name);
  path.forEach((id,k)=>{ const v = R.byId[id]; const end = k<path.length-1 ? nearestIdx(v, R.byId[path[k+1]].pts3[0]) : 120; pts.push(...seg(v, 0, end)); names.push(v.name); });
  return {pts, names};
}
function catheterAdvice(acc, t, names){
  const v = R.byId[t];
  if (v.sys==="portal") return "TIPS-type route: jugular access, right hepatic vein, needle across the liver into the right portal vein (CO₂ wedged venography to target), then into the portal tree.";
  if (v.sys==="vein") return (v.id==="ivc") ? "Pigtail catheter for the cavogram (20 cc/s for 30 cc)." : "Angled selective catheter (Kumpe, Berenstein, MPA); RDC for renal and adrenal veins.";
  if (["aorta_th","aorta_ab"].includes(t)) return "Pigtail or flush catheter (arch 25 for 50; abdominal 15 for 30).";
  if (v.cath) return v.cath + (names.length>5 ? ". Beyond first-order branches, advance a microcatheter coaxially (superselective)." : "");
  const crossed = acc==="rcfa" && chainUp(t).includes("lcia");
  const depth = chainUp(t).length;
  let s = crossed ? "Contralateral side from the right groin: go up and over with a flush catheter (OmniFlush or pigtail), then exchange for a selective catheter. " : "";
  s += depth<=3 ? "Selective catheter (C2 or SOS for visceral; Simmons if the angle is hard)." : "Selective catheter into the parent trunk, then a microcatheter for superselective work.";
  return s;
}
function traceRoute(acc, t){
  clearRoute();
  const A = R.byId[acc], T = R.byId[t]; if (!A || !T) return;
  const info = R.host.querySelector(".x3-routeinfo");
  const art = A.sys==="art";
  let res = null;
  if (T.sys==="portal") {
    if (art) { info.innerHTML = '<p class="warn">Portal veins are reached from a vein (jugular for TIPS) or by direct percutaneous puncture, not from an artery.</p>'; return; }
    if (acc !== "rij") { info.innerHTML = '<p class="warn">TIPS is done from the right internal jugular vein (pp. 634–635): the straight path down the SVC and IVC into the right hepatic vein lets the needle cross the liver into the portal vein. Choose the right internal jugular vein as access.</p>'; return; }
    const a = routePoints(acc, accIdx(acc), "rhv"); const ti = 60;
    const p1 = a.pts.slice(0, a.pts.length - (120-ti));
    const rpv = R.byId.rpv; const j = nearestIdx(rpv, R.byId.rpv.curve.getPointAt(0.45));
    const b = routePoints("rpv", j, t);
    res = {pts:[...p1, ...b.pts], names:[...a.names, "TIPS tract through the liver", ...b.names]};
  } else {
    if (art !== (T.sys==="art")) { info.innerHTML = `<p class="warn">${art?"Arterial":"Venous"} access cannot reach a ${T.sys==="art"?"artery":"vein"} through the vessel tree. Pick a ${T.sys==="art"?"femoral or radial artery":"femoral, jugular or basilic vein"} access.</p>`; return; }
    res = routePoints(acc, accIdx(acc), t);
  }
  if (!res || res.pts.length<2) { info.innerHTML = '<p class="warn">No route found.</p>'; return; }
  const clean = res.pts.filter((p,i,a)=>i===0 || p.distanceTo(a[i-1])>0.05);
  const curve = new THREE.CatmullRomCurve3(clean, false, "centripetal");
  const count = Math.max(60, clean.length);
  const geo = new THREE.TubeGeometry(curve, count, 0.22, 8, false);
  const mesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({color:0x7de3f4, depthTest:false, transparent:true, opacity:0.95}));
  mesh.renderOrder = 10; geo.setDrawRange(0,0);
  const tip = new THREE.Mesh(new THREE.SphereGeometry(0.34,12,10), new THREE.MeshBasicMaterial({color:0xffffff, depthTest:false})); tip.renderOrder = 11;
  R.groups.route.add(mesh); R.groups.route.add(tip);
  R.route = {mesh, tip, curve, count, k:0, t0:performance.now()};
  const steps = res.names.filter((n,i,a)=>n!==a[i-1]);
  info.innerHTML = `<ol class="route">${steps.map(n=>`<li>${n}</li>`).join("")}</ol><div class="cath"><b>Suggested kit</b> ${catheterAdvice(acc, t, steps)}</div>`;
  const b = new THREE.Box3().setFromPoints(clean), c = b.getCenter(new THREE.Vector3()), s = b.getSize(new THREE.Vector3());
  fly([c.x, c.y, c.z + Math.max(s.x, s.y)*1.5 + 18], [c.x, c.y, c.z]);
  if (window.IRStudy) IRStudy.mark("route:"+t);
}
function accIdx(acc){ return {rcfa:60, lradial:20, rcfv:60, rij:100, rbasilic:110}[acc] || 120; }
function clearRoute(){ if (!R) return; R.groups.route.children.slice().forEach(c=>R.groups.route.remove(c)); R.route = null; const i = R.host.querySelector(".x3-routeinfo"); if (i) i.innerHTML = ""; }

window.IR3D = {mount, focus, destroy, vessels:V, levelAt:levelAt2, decodeMesh, _state:()=>R};
})();
