# IR Atlas: research notes and resources

What was searched, read and used while building the Interventional Radiology Atlas (sessions up to 8 Nov 2026), and why. The site runs offline, so it uses an outside resource only when the data or method could be brought into a static page. Everything else was used as a reference.

Contents
1. Book sources
2. 3D anatomy: data and how anatomy websites are built
3. Design: Apple HIG and design skills
4. DSA run simulation: methods and projects
5. Physics and physiology values used in the simulator
6. Content audit: findings and errors in the book itself
7. Ideas not yet built
8. Web searches that were run

---

## 1. Book sources

| Source | Used for |
|---|---|
| *Core Radiology: A Visual Approach to Diagnostic Imaging*, 2nd ed., chapter 9, Interventional Radiology, pp. 588–649 (your PDF) | All lesson text, 235 MCQs with quotes, 296 flashcards, page links, 137 figures, and the 16 real DSA runs with hotspots taken from the book's labels and arrows |
| *Sutton, Textbook of Radiology and Imaging* (vol 1 and the interventional chapters, your library) | "From Sutton" boxes. These hold older practice, labelled as such where it differs from current guidance |

Notes on the PDF:
- PDF page = book page + 12. For example, the book's p. 610 is PDF page 622.
- The text layer splits the "ti", "fi" and "fl" ligatures ("selecti ve", "identi fi ed"), so extracted text needs these joined again.

## 2. 3D anatomy: data and how anatomy websites are built

### Data used
- **BodyParts3D** (Database Center for Life Science, Japan). This is the source of the real meshes for the bones, organs and major vessels.
  - Licence: CC BY-SA 2.1 Japan, https://creativecommons.org/licenses/by-sa/2.1/jp/deed.en
  - Licence pages: http://lifesciencedb.jp/bp3d/info_en/license/index.html and http://dbarchive.biosciencedbc.jp/en/bodyparts3d/lic.html
  - Citation: Mitsuhashi N et al. *Nucleic Acids Res* 2009;37:D782–5, https://doi.org/10.1093/nar/gkn613. Data DOI: http://doi.org/10.18908/lsdba.nbdc00837-000
  - Archive: https://dbarchive.biosciencedbc.jp/data/bodyparts3d/20110915/
  - STL files were downloaded from the GitHub mirror https://github.com/Kevin-Mattheus-Moerman/BodyParts3D (`assets/BodyParts3D_data/stl/`, parts list `parts_list_e.txt`).
  - Pipeline (`tools/build_anat.py`): decimate with fast-simplification, quantise to Uint16 and base64, then warp the hand-built IR vessel tree onto the real anatomy with a thin-plate spline (scipy RBFInterpolator). Mean landmark error is 2.6 mm.
  - It is based on the Foundational Model of Anatomy ontology, https://en.wikipedia.org/wiki/Foundational_Model_of_Anatomy

### Reviewed, not used
- **Z-Anatomy**, an open-source Blender anatomy atlas built on BodyParts3D: https://github.com/Z-Anatomy/Models-of-human-anatomy and https://github.com/Z-Anatomy/The-blend
  - Coverage: https://www.cgchannel.com/2022/05/check-out-amazing-free-3d-anatomy-reference-z-anatomy/2/, https://www.blendernation.com/2022/05/25/amazing-open-source-anatomy-project-for-blender/
  - Talk: https://conference.blender.org/2022/presentations/1365/
  - Not used: BodyParts3D already gave what was needed, without converting from Blender.
- Free and paid anatomy models: 3dart (https://3dart.it/en/free-3d-anatomy) and CGTrader artery models, which are paid. Not used because of the licence and cost.
- Slicer forum thread on open anatomy atlases: https://discourse.slicer.org/t/open-source-human-anatomy-atlas/17734?page=2

### How professional web anatomy viewers are built
Reviewed: ZygoteBody, formerly Google Body Browser (https://en.wikipedia.org/wiki/ZygoteBody, https://experiments.withgoogle.com/body-browser); BioDigital Human; and a three.js layered anatomy explorer (https://discourse.threejs.org/t/a-3d-interactive-system-for-exploring-human-anatomy-by-anatomical-layers/88813).

Techniques taken into the site's 3D view:
- **Layers:** skin, muscle, organs, vessels and bone, with layer toggles and isolate mode.
- **X-ray ghost organs:** a fresnel rim shader, so vessels stay visible through organs.
- **Glossy vessels:** physically based clear-coat material with studio lighting (a PMREM environment), ACES tone mapping and correct sRGB colour conversion.
- **Pinned labels:** labels with leader lines that stay attached as the model turns.
- **Orientation:** an orientation cube, plus axial and coronal cut planes.
- **Interaction:** hover names, guided tours, and a quiz mode.
- Library: three.js r128 (https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js), kept locally in `lib/`.

## 3. Design: Apple HIG and design skills

Apple Human Interface Guidelines pages read:
- Design principles: https://developer.apple.com/design/human-interface-guidelines/design-principles
- Typography: https://developer.apple.com/design/human-interface-guidelines/typography
- Materials: https://developer.apple.com/design/human-interface-guidelines/materials
- Layout: https://developer.apple.com/design/human-interface-guidelines/layout
- Resources and fonts: https://developer.apple.com/design/resources/ and https://developer.apple.com/fonts/

Skills reviewed and installed in `06_Projects/.global_skills`:
- **apple-design-skill**: https://github.com/nutshellengineering/apple-design-skill (installed)
- **frontend-design** (Anthropic): https://github.com/anthropics/skills (installed)
- Also looked at, not installed: raintree-technology apple-hig-skills, axiaoge2/apple-hig-designer, Ksanbal/apple-hig-codex-skill

Rules taken from them:
- Use the system font (SF Pro on Apple, Segoe UI on Windows), so no web font is needed offline.
- Use the glass material only on controls that float over the 3D view.
- Use one accent colour (amber).
- Light theme is "DSA film" and dark theme is the "fluoro room".
- Avoid generic AI-design habits, such as gradient hero sections and emoji icons.

## 4. DSA run simulation: methods and projects

### Finding
No open-source DSA simulator was found that could run in an offline web page. The relevant projects are Python or GPU tools, so their *methods* were re-implemented in JavaScript (`js/dsa_sim.js`). No code was copied.

| Resource | What it is | What the site took from it |
|---|---|---|
| **DeepDRR**, https://github.com/arcadelab/deepdrr; paper https://arxiv.org/pdf/1803.08606 (Unberath et al., MICCAI 2018); docs https://deepdrr.readthedocs.io/README.html | GPU simulator of X-ray images from CT: projection, material decomposition, scatter and noise. Needs an NVIDIA GPU. | Image formation by summing attenuation along each ray, with a noise model. Re-implemented as a CPU ray-sum over vessel centrelines and mesh thickness. |
| **CathSim**, https://github.com/airvlab/cathsim (earlier repos: robotvisionlabs/cathsim, tudorjnu/cathsim); paper https://ar5iv.labs.arxiv.org/html/2208.01455 | MuJoCo endovascular catheter-navigation simulator for robot learning | Reviewed only. It needs MuJoCo, so it can't run offline in a browser. A possible future reference for catheter physics. |
| **Colour-coded parametric DSA (syngo iFlow)**: PMC11222601 https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11222601/; patent US8929632 https://patents.google.com/patent/US8929632; MDPI J Imaging 2024 https://mdpi.com/2313-433X/10/10/260; BMC Med Imaging 2022 https://link.springer.com/10.1186/s12880-022-00744-2; PMC7964755 | A whole run shown as one colour image, with each pixel coloured by time to peak | The "Colour TTP" view (red is early, blue is late) and the teaching point that time to peak is delayed beyond a significant stenosis |
| Time–density curves (same sources) | Per-pixel or ROI contrast against time; TTP, peak and area under the curve | ROI tool with up to 4 curves and the TTP, peak and area readouts |
| **Murray's law and flow splitting**: 3D-1D microvascular model https://arxiv.org/pdf/2001.07186; arterial-input-function dispersion in vascular trees (PMC5489236) | Radius cubed is proportional to flow at bifurcations; contrast disperses as it travels | Flow split by measured resting flows where known, by Murray's law elsewhere; velocity = flow ÷ area; dispersion grows with transit time |
| **Indicator-dilution theory** (gamma-variate and EMG bolus curves, residue functions); patent US11640682 discusses gamma-variate fitting limits | Standard bolus models | Bolus = rectangular injection convolved with an exponentially modified Gaussian; organ blush = input ⊗ exponential residue; venous return = input ⊗ gamma transit time |
| **Log subtraction and quantum noise**: K-edge and log-subtraction papers (https://arxiv.org/pdf/1709.08913, patent US4686695); kVp and dose in DSA (Med Phys 2002) | The subtracted signal is proportional to iodine thickness; subtraction raises noise by about √2; quantum-limited detection | Beer–Lambert law, Poisson noise that depends on dose and attenuation, log subtraction of mask minus live |
| **Vascular Model Repository** (vascularmodel.com) and the AAA-100 dataset (https://zenodo.org/records/10932957) | Patient-specific 3D vessel models with centrelines (aorta, iliacs, renals) | Reviewed, not used: the downloads are large and include imaging, and the licence terms are for research use. A possible upgrade for real aortic centrelines. |
| **Synthetic DSA with machine learning**: pix2pix GAN (BMC Med Imaging 2024), diffusion models (https://arxiv.org/html/2602.11703v1), TwoViewsDSAReg, DeepSA | Learned DSA synthesis or registration | Not used: needs trained models. Shows that physics-based simulation is a reasonable choice for teaching. |
| CFD-assisted 4D DSA, patent US10580172 | Flow simulation combined with DSA reconstruction | Background only |

### Workstation features modelled
Native (unsubtracted) view, window/level, invert, remasking to any frame, pixel shift, landmarking, peak opacification (MIP), roadmap, colour TTP and ROI time–density curves. Simulated artefacts: breathing and patient-movement misregistration, plus the extra noise over bone.

## 5. Physics and physiology values used in the simulator

These are approximate textbook values, for teaching, not measurement.

| Quantity | Value | Basis |
|---|---|---|
| Iodine mass attenuation | about 22 cm²/g (effective energy about 40 keV) | NIST XCOM table for iodine |
| Soft tissue / bone (excess over soft tissue) | 0.20 / 0.25 cm⁻¹ effective | Hardened-beam approximation |
| Contrast mixing | strength = rate ÷ (rate + vessel flow) | Simple mixing model |
| Reflux threshold (selective runs) | rate > 1.3 × resting flow at the tip | Teaching rule |
| Resting flows (cc/s) | aorta 80 (arch) / 50 (L1), celiac 12, SMA 8, renal 9 each, IMA 2.5, splenic 5, common hepatic 5, internal iliac 4, CFA 5, subclavian 6, bronchial 1.2 | Typical textbook values |
| Organ blood volume / mean transit time | kidney 0.12 / 3 s, spleen 0.08 / 4 s, liver (arterial) 0.04 / 6 s, bowel 0.015–0.02 / 4.5–5 s | Approximate |
| Stenosis flow | 1 ÷ (1 + 0.02((1/(1−s))⁴ − 1)); 50% keeps 77%, 70% keeps 29%, 90% keeps 0.5% | Poiseuille resistance in series with the distal bed |
| Injection guides | arch 25/50, abdominal aorta 15/30, mesenteric 5/25, renal 5/15 (p. 597). IMA 3/15, splenic 5/25, common hepatic 5/20, bronchial 1.5/6, internal iliac 5/20, subclavian 5/20, runoff 5/40 are typical values, not from the chapter | Book and typical practice |
| Angiographic detection of bleeding | 0.5–1.0 mL/min (tagged RBC scan 0.2–0.4; CTA about 0.35) | Book p. 610 |

The physics checks are in `node tools/test_dsa_core.js`: bolus mass conservation, dispersion, stenosis flow, the gamma density and the catheter table.

## 6. Content audit: findings and errors in the book itself

Two audits were run against the chapter text: one on the lessons and question bank, and one on the 3D notes, Sutton boxes, numbers sheet, simulator, figures and tools. All the fixes listed below have been applied to the site.

Second audit, fixed:
- "IMA" meaning internal mammary in the pathway-of-Winslow note now reads "internal mammary (internal thoracic)".
- Bronchial embolization: the danger is now stated as bronchial-to-pulmonary-vein shunting carrying particles to the brain.
- Right gonadal vein: it enters the IVC obliquely (an acute angle), not at an obtuse angle.
- Axillary vein: formed by the basilic and brachial veins at teres major.
- The route planner now refuses portal targets unless the access is the right internal jugular vein (TIPS, pp. 634–635).
- C2 is described as a simple curve; the SOS is the reverse curve.
- Page references corrected: subclavian hemoptysis note (p. 607), thoracic duct flow (p. 627), GI bleed detection (p. 610), injection rates (p. 597).
- Sutton boxes: adrenaline (SC is older practice; give it IM now), steroid premedication (current ACR regimen added), closure devices (Core Radiology's view added), and "portal pressure" corrected to portosystemic gradient.
- The numbers sheet gained 16 figures that had no flashcard: TIPS <12 mmHg, the 8 mm × 3–4 cm tract balloon, tPA 0.5 mg/h for 48–72 h, PA pressures, bleed detection, fistula patency, and others.
- Simulator: realistic flows for the bronchial, IMA and internal iliac arteries; non-book injection rates labelled as typical; a uterine-to-bladder blush error removed; brachiocephalic flow made consistent with its branches.
- Figures: p599 early/late arterial captions, the p603 caption, and about 230 ligature gaps in the captions.
- The tool bench's bleeding-risk checker now classes TACE as low risk, by the chapter's rule that arterial access under 6 Fr is low risk.

Errors or outdated statements in the book (worth knowing for exams):
- **p604 caption:** the aortic isthmus is distal to the *left subclavian* artery, not the brachiocephalic.
- **p616:** the ulnar artery does not arise from the common interosseous artery; it is the other way round.
- **p608:** the risk in bronchial artery embolization is bronchial-to-pulmonary-vein (systemic) or right-to-left shunting, not a "left-to-right shunt".
- **p593:** French size is the outer *diameter* in mm × 3, not the circumference.
- **p593:** the C2 (Cobra) catheter is a simple curve, not a reverse curve.
- **p619:** in TASC-II femoropopliteal disease, type D is not simply "any chronic total occlusion". It is a CFA/SFA occlusion over 20 cm involving the popliteal, or popliteal and trifurcation occlusion; a single occlusion of 5 cm or less is type A.
- **p633:** gastric fundal varices usually drain through a gastrorenal shunt to the left renal vein, which is the basis of BRTO on p636, rather than "splenic vein → azygos".
- **p625:** the left gonadal vein drains into the left renal vein at a right angle.

## 7. Ideas not yet built

- **Bolus-chase runoff:** a stepping table for leg runoff, following the contrast front station by station.
- **Real aortic centrelines:** from the Vascular Model Repository, if the licence allows.
- **CO₂ angiography:** negative contrast, buoyancy and the rule never to use it above the diaphragm.
- **More cases:** a type II endoleak after EVAR, a pulmonary AVM, a hepatic tumour blush for TACE planning, and splenic trauma.
- **Catheter shapes in the simulator:** show the catheter on native and roadmap frames, using the curves from the catheter gallery.

## 8. Web searches that were run

- Apple Human Interface Guidelines design skill for Claude Code (SKILL.md)
- Claude skill frontend design: SKILL.md, github anthropics skills frontend-design
- How BioDigital Human and ZygoteBody are built: WebGL, three.js, glTF, X-ray, isolate, labels
- BodyParts3D and Z-Anatomy: open 3D anatomy model downloads, licences, arteries
- Femoral puncture simulator
- Open-source synthetic DSA simulation on GitHub
- Colour-coded parametric DSA: time to peak, syngo iFlow, time–density curves
- Gamma-variate bolus, Murray's law flow split, vascular tree simulation on GitHub
- DeepDRR: digitally reconstructed radiographs and fluoroscopy simulation
- Vascular Model Repository: abdominal aorta, renal and mesenteric centrelines, licence
- CathSim: endovascular catheter simulator
- Iodine X-ray attenuation, DSA log subtraction, Poisson quantum noise
