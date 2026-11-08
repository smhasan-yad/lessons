# IR Atlas

> **Public and private builds (since 8 Nov 2026).**
> - The code lives only here: `site/interventional-radiology/` is the public lesson at https://www.radyssey.com/lessons/interventional-radiology/. It has no book page images, no figures, no chapter text, no real DSA runs and no verbatim book quotes. Lessons cite "Core Radiology 2e, p. N" instead.
> - The book features are still in the code but switch on only when `window.IR_PRIVATE` is set (and real runs only when `IR_DSA` exists).
> - The private study copy is built by `G:\My Drive\Hasan\06_Projects\Radyssey\Lessons\sources\interventional-radiology\build_study.py`. That folder also holds `book/`, `data/`, `dsa_figs.js` and `private.js`. The build writes the study copy to `Personal_University\02_Medical_Imaging_&_Radiology\Interventional_Radiology_Atlas` (its hub card is unchanged).
> - Tools in `tools/` that read the book (`figextract.py`, `build_dsa.py`) must write their output to the private sources folder, never into `site/`.
> - The rest of this README describes the original study build. Paths such as `book/` and "Book page viewer" refer to the private copy.

Interactive study site for **Core Radiology 2e, Chapter 9: Interventional Radiology** (book pages 588–649).
It runs fully offline: double-click `index.html`. It uses the system font (SF Pro on Apple, Segoe UI on Windows), so it needs no internet.

## What's inside
- **10 lessons** covering every subsection of the chapter (61 topics). Each one links to its book page and ends with a 3-question quick check.
- **3D anatomy** built the way professional viewers are:
  - Real segmented meshes for the skeleton, organs and major vessels (BodyParts3D, 117 structures).
  - The IR branch tree from the chapter, warped onto that real anatomy with a thin-plate-spline fit. Mean landmark error is 2.6 mm.
  - Organs shown as fresnel X-ray ghosts, glossy vessels with studio lighting, and an optional X-ray skeleton.
  - Axial and coronal cut planes, pinned labels with leader lines, an orientation cube, hover names for bones and organs, and isolate mode.
  - Six variants, nine guided tours, a name-that-vessel quiz and a catheter route planner.
  - For key branches, the inspector shows the book's origin level next to the level measured in this body.
- **DSA runs** (`#/dsa`):
  - *Real angiograms:* 16 runs from the chapter (renal phases, celiac early and late, arc of Riolan, pelvis, arm, hand, leg runoff), drawn as clean images.
    - Hotspots come from the book's own labels and arrows.
    - Explore mode, a "find the vessel" quiz, and a cine loop of the four renal phases with a "which phase?" quiz.
    - Window/level, invert, zoom and pan, plus a toggle to show the book's labels.
  - *Run simulator* (`js/dsa_sim.js`): a physics model of a DSA run on the 3D vessel tree. You choose the catheter (14 sites), rate, volume, contrast strength, C-arm angle, frame rate, dose, heart rate, patient motion and an optional stenosis, then acquire.
    - **Flow:** blood flow at the catheter tip comes from textbook resting flows. At each branch it splits by known flows, or by Murray's law (flow ∝ radius³) where none is known. Velocity is flow ÷ lumen area, so transit times come from the anatomy rather than fixed speeds.
    - **Contrast:** contrast mixes with blood at rate ÷ (rate + flow). A rate above about 1.3 × the vessel's own flow refluxes into the parent. The bolus is the injection convolved with an exponentially modified Gaussian, a standard stand-in for the gamma-variate curve, and it spreads with transit time and pulses with the heart rate.
    - **Organs and veins:** organ blush is the arterial input convolved with an exponential residue, using each organ's blood volume and mean transit time. Venous return uses a gamma transit-time distribution and is diluted where veins join. That includes the portal vein after splenic, SMA or IMA runs.
    - **Image formation:** attenuation is summed along each ray (Beer–Lambert law, iodine about 22 cm²/g), as in digitally reconstructed radiograph (DRR) simulators. The image then gets Poisson quantum noise and log subtraction, mask minus live.
      - Overlapping vessels add up, and thin branches fade into the noise.
      - Vessels seen end-on look denser.
      - Bone adds noise.
      - Breathing or a patient movement gives the light-and-dark bone edges of misregistration.
    - **Post-processing, as on an angiography workstation:**
      - Window and level, invert, and remasking to any frame.
      - Pixel shift and landmarking.
      - Native (unsubtracted) view, peak opacification and roadmap.
      - Colour-coded time-to-peak, the parametric "iFlow"-style DSA.
      - Time–density curves from up to four regions of interest, with time to peak, peak and area. For example, a 70% SFA stenosis delays the popliteal peak by several seconds.
    - **Findings:** active extravasation (a pool that grows and persists into the venous phase), an AV shunt (early vein) and stenosis (narrowing, reduced distal flow, late time to peak).
    - **Vessel labels:** No labels, Main labels or All labels, with leader lines placed so they don't overlap. Labels follow the bolus, so a vessel is named only while it holds contrast. Hover over any vessel for its full name.
    - **Find the vessel:** a 10-question quiz on the run you just acquired. Click the named vessel; a wrong click highlights the right one in amber.
    - **Guided cases** (progress is saved): get a diagnostic celiac run, open the aortic arch, indirect portography, find a hidden lower GI bleed, find which renal artery is narrowed, and fix a motion artefact with pixel shift. Each case counts runs and contrast used and ends with a teaching point.
    - **Links:** `#/dsa?m=sim&c=<catheter>` opens a catheter position and `#/dsa?m=sim&case=<case>` opens a case. Lessons link to these through "Practise this" rows, and the 3D inspector has a "Simulate a DSA run" button.
    - **Rates:** the chapter gives injection rates only for the arch, abdominal aorta, mesenteric and renal arteries (p. 597). The other sites (IMA, splenic, common hepatic, bronchial, internal iliac, subclavian, leg runoff) use typical values and are labelled that way.
    - **Limits:** the small branches inside organs are generated, and all flows and transit times are approximate textbook values. The model is for learning how runs behave, not for measurement.
    - **Tests:** `node tools/test_dsa_core.js` checks the physics core: contrast conservation, dispersion, stenosis flow and the catheter table.
- **Book figures in every lesson:** all 137 figures from the chapter (case angiograms, CT, MR, US), with their captions, in a lightbox with a toggle for the book's labels.
- **37 interactive tools**, 235 MCQs (practice, timed, mistakes-only, plus a per-section accuracy table with "drill my weakest"), 296 SM-2 flashcards, a printable "Numbers to know" sheet, and "From Sutton" supplement boxes.
- **Lessons:** a *recall mode* switch hides numbers and key terms until you click them, for retrieval practice. A *Practise this* row links each topic to its real angiograms, simulator presets and cases. The overview remembers where you stopped.
- **Progress backup:** links at the bottom of the home page export or restore progress as a JSON file.
- **Book page viewer** that shows the chapter pages beside the lesson.

Progress is stored in this browser's localStorage.

## Design
The look follows two design skills installed in `06_Projects/.global_skills`: `apple-design-skill` (Apple HIG) and `frontend-design` (Anthropic).
- The light theme is "DSA film": pale cool field and contrast-black ink. Dark mode is the fluoro room.
- There is one amber accent.
- Glass material is used only on controls that float over the 3D view.
- The home hero plays one renal DSA run on load. It is skipped when the system's reduced-motion setting is on.

## Files
| Path | Contents |
|---|---|
| `js/content.js` | Lesson text |
| `js/anatomy3d.js` | Vessel tree (hand-built source coordinates), tours, 3D engine, route planner |
| `js/anatomy_meshes.js` | Generated: BodyParts3D meshes, warped vessel coordinates, vertebral levels |
| `js/widgets1.js`, `js/widgets2.js` | Interactive tools |
| `js/qbank.js`, `js/sutton.js`, `js/study.js` | Questions, Sutton supplement, quiz and flashcard engine |
| `js/dsa.js`, `js/dsa_sim.js` | DSA page: real angiograms; physics run simulator |
| `js/app.js` | Navigation, home, lessons, search, book viewer |
| `tools/` | Mesh build pipeline (see below) |
| `book/` | Rendered book pages (personal study copy) |
| `lib/` | Three.js r128 and OrbitControls |

## Rebuilding the 3D data
You only need to do this if you change vessel coordinates in `js/anatomy3d.js`.
1. Download the STL files listed in `tools/want.txt` from github.com/Kevin-Mattheus-Moerman/BodyParts3D (`assets/BodyParts3D_data/stl/`) into a working folder `<work>/stl/`. Put `want.txt` in `<work>`.
2. Run:
   ```
   node tools/dumpv.js js/anatomy3d.js <work>/myvessels.json
   C:\venvs\Personal_University\Scripts\python.exe tools/build_anat.py <work> js/anatomy_meshes.js
   ```
   The script needs numpy, scipy and fast-simplification, which are installed in the Personal_University venv.
3. Bump the `?v=` number in `index.html`.

## Rebuilding the book figures
Note: captions in `js/dsa_figs.js` were corrected by hand after generation (PDF ligature gaps such as "selecti ve", and the p599 and p603 captions), so rerunning the build overwrites those fixes.
`tools/figextract.py <Core Radiology PDF> <work>` extracts every chapter figure as a clean image and a labelled image, with its caption and the geometry of its labels and arrows. Then `tools/build_dsa.py <work> <site>` writes `js/dsa_figs.js` and copies the images to `book/fig/`. The hotspots for the real DSA runs are defined in `build_dsa.py`.

## Research notes
Everything searched and used while building the site (anatomy data, design skills, DSA simulation methods, audit findings and book errors) is in [RESEARCH_NOTES.md](RESEARCH_NOTES.md).

## Sources for the DSA simulator
Methods, not code, were adapted from:
- DeepDRR (github.com/arcadelab/deepdrr, Unberath et al., MICCAI 2018): projecting attenuation along rays plus a noise model, simplified here to a CPU ray-sum.
- Colour-coded parametric DSA (syngo iFlow; Strother et al. and later clinical studies): time-to-peak colour maps.
- Indicator-dilution theory: gamma-variate or EMG bolus curves, residue functions, and Murray's law for flow splits.
- NIST XCOM for the iodine mass attenuation near 40 keV.
- CathSim (github.com/airvlab/cathsim) was reviewed for catheter navigation. It needs MuJoCo, so it is not used offline here.

## Credits and licence
- Bones, organs and major vessels: BodyParts3D, © The Database Center for Life Science, licensed under CC Attribution-Share Alike 2.1 Japan. Mitsuhashi N et al., Nucleic Acids Res 2009;37:D782–5.
- Text: Core Radiology 2e (primary) and Sutton's Textbook of Radiology and Imaging, paraphrased for personal study.
