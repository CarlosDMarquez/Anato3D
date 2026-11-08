# Anato3D — project review and development priorities

Review date: November 1, 2026 (America/Tijuana). Repository baseline: `034429e`.

## Assessment

Anato3D has a substantial atlas foundation: two adult bodies, 12 navigable systems, nearly 3,000 labeled structures per body, a reusable Blender production pipeline, and Spanish/Latin educational content. Its next milestone should be a trustworthy, usable study product with a small, demonstrably useful learning loop.

The greatest gaps are content depth outside muscles, independently reviewed anatomy, reliable asynchronous loading, mobile performance evidence, and active study tools. More visual polish alone will not close those gaps.

Suggested first audience, to validate with users: Spanish-speaking students taking introductory university anatomy. The README's “for everyone” audience is too broad to guide curriculum depth, interface complexity, and assessment difficulty. This is a proposed focus, not an established business finding.

## What was actually checked

- Read the application entry point, viewer, system definitions, UI markup/styles, content resolvers and source references; inspected the model generation/export/audit pipeline and development history.
- Ran the production build successfully. Vite reports a large JavaScript chunk: 1,070.79 kB minified, 286.19 kB gzip.
- Ran the existing card checker successfully: 2,909 male structures, including 481 muscular structures; 2,919 female structures, including 486 muscular structures. Counts include individual sides and subdivisions; they are not counts of distinct named human organs or canonical bones.
- Independently inspected all 24 shipped GLB files, totaling 53.47 MB, and computed mesh/triangle counts from their accessors.
- Resolved every classified structure through the actual content functions to assess descriptions and displayed references.
- Reproduced a delayed-metadata model-switch race with the actual `ensureSystem` function and controlled asynchronous dependencies. This was a logic reproduction, not a browser end-to-end test.
- Imported the current exported base, muscular, and urogenital GLBs into Blender and inspected six new renders: skin, anterior musculature, and anterior urogenital/pelvic context for both bodies.
- Reviewed existing geometry audit JSON files. Did not rerun the full geometric collision audit or independently remeasure pelvis dimensions.

Limitations: the in-app browser could not attach, and native computer-use permissions were unavailable. Therefore live interaction, screenshots of the actual web UI, real mobile performance, screen-reader behavior, and browser compatibility remain unverified. Blender Workbench renders show geometry with simplified materials; they do not reproduce the site's shaders, transparency, context layers, or selection behavior. Skin renders omit the separately loaded external-genital skin assets. This review is not a complete anatomical certification of every structure.

## Foundations worth preserving

- Systems download on demand rather than loading both complete bodies at startup.
- Spanish and Latin names, side labels, region navigation, search over unloaded systems, selection, isolation, hiding, transparency, undo, and camera presets are already implemented.
- Quality is reduced initially on coarse-pointer devices, rendering is gated by scene changes, and anatomical structures remain individually addressable.
- Muscular cards have much stronger coverage than other systems, including innervation and displayed sources.
- The female model has dedicated pelvic and reproductive generation work; it is more than a cosmetic skin swap. Its skeletal fitting nevertheless starts from a male source and needs appropriate validation.
- Blender scripts, original-source backups, model metadata, and geometry audit tools provide a useful foundation for reproducible anatomy development.

## Model review

### Male model

The exported anterior muscular view provides a coherent full-body overview with distinct major muscle groups, tendon regions, and skeletal context. The skin and skeleton-to-muscle placement merit retaining while targeted corrections are made. A whole-body overview is not evidence that each attachment, joint surface, or tiny nerve is correct.

Priorities:

1. Correct inverted geometry in the source/export pipeline. The viewer currently repairs skeletal winding and suppresses affected baked ambient occlusion. The existing male audit flags 109 inverted objects. Those findings need structure-level inspection, especially for open surfaces, rather than indiscriminate normal flipping.
2. Validate hands, feet, cervical region, shoulder girdle, pelvic floor, and muscle attachments at close range. These are high-value study regions where a convincing silhouette can conceal relational errors.
3. Distinguish decorative muscle-fiber shading from validated fascicle direction. `fiberFrame` estimates direction from mesh geometry and a fan heuristic; it should not be treated as authoritative fiber anatomy.
4. Review reproductive anatomy both with and without its external skin, using labeled anterior, lateral, and sectional views. The isolated anterior render is only one view of the relationships.

### Female model

The exported musculature and pelvic view show meaningful differences from the male body and provide a useful base for study. The uterus/adnexal and mammary geometry is procedural; the source explicitly describes it as a first version based on anatomical dimensions and fitted landmarks.

Priorities:

1. Obtain anatomist review of pelvic dimensions, sacrum, subpubic region, pelvic floor, and relationships among bladder, uterus, vagina, rectum, and external structures. The README records an unresolved short anteroposterior pelvic dimension and a compensating uterine orientation. Those are documented issues, not newly measured conclusions from this review.
2. Review the procedural organs against identified references and label simplifications. Do not infer accuracy because the meshes fit inside the skin.
3. Address the documented simplified mammary anatomy: gland form, surrounding fat, supporting ligaments, ducts, and relation to pectoral tissues. Define which are in scope for the launch curriculum before adding detail.
4. Check vascular and nerve paths around sex-specific organs. Reusing and deforming a male-source structure does not by itself establish an appropriate female pathway.
5. Present both models as representative adult examples. Do not imply that their dimensions or shapes define all normal bodies.

### Existing audit results

| Existing report | Male | Female |
|---|---:|---:|
| Objects assessed | 2,870 | 2,877 |
| Reported organ-overlap pairs | 30 | 34 |
| Duplicate-name findings | 0 | 0 |
| Inverted-object flags | 109 | 109 |
| Zero-area faces | 31 | 94 |
| Objects containing zero-area faces | 11 | 13 |
| Empty-object flags | 0 | 0 |

The reports were modified November 1, but they do not carry a source-commit/model-hash provenance contract. They cannot be assumed to certify the current exports. Overlaps and exterior flags include expected relationships, open-mesh ambiguities, eye/oral cavities, and nested structures. Do not turn these counts directly into “anatomical errors.” Classify each finding as a confirmed defect, expected relationship, or measurement limitation; store an explanation and reviewer.

The level audit maps organs to the closest available C/T/L vertebra. Pelvic structures can consequently be assigned L5 even when lower; this is a measurement limitation, not proof of a high-riding organ. Add sacral landmarks and an explicit out-of-range result.

## Content depth is the largest educational gap

Every checked structure has a description, but many descriptions are generic tissue definitions. In the male model, the same generic arterial description is reused 369 times; a ligament definition 331 times; a peripheral-nerve definition 196 times; and a venous definition 188 times. Bilateral reuse is reasonable, but these counts and the resolver fallback logic show that many structures lack specific teaching content.

| System | Male structures | Female structures | Male cards with a displayed references object |
|---|---:|---:|---:|
| Skeletal | 238 | 238 | 0 |
| Connective | 634 | 634 | 24 |
| Muscular | 481 | 486 | 481 |
| Arterial | 436 | 430 | 28 |
| Venous | 230 | 226 | 0 |
| Nervous | 580 | 580 | 53 |
| Respiratory | 48 | 48 | 0 |
| Digestive | 47 | 47 | 0 |
| Urogenital | 22 | 34 | 0 |
| Endocrine | 10 | 10 | 0 |
| Lymphatic | 144 | 144 | 2 |
| Integumentary | 39 | 42 | 37 |

A displayed references object may support only the Latin name; it does not necessarily support the functional or clinical description. Model attribution is also separate from educational-content citation. “0” in this table means no `info.fuentes` object from the current resolver, not that no source exists anywhere in the project.

Expand the content contract with stable structure ID, model applicability, region, synonyms, description, relationships, function, applicable system-specific fields, exact references, review status, reviewer/date, and known simplifications. Keep terminology sources separate from functional/anatomical claim sources.

For the initial curriculum, provide structure-specific material: muscle attachments/action/innervation; nerve origin/course/targets; vessel origin/course/territory or drainage; ligament attachments/role; organ relationships and function. Add clinical correlations only when reviewed and relevant to the learning objective.

Extend `check-cards.mjs` beyond nonempty strings and muscular fields. It should report generic fallbacks, missing claim citations, applicability errors, unresolved IDs, and required content coverage by launch module. Do not auto-fill thousands of authoritative-looking cards just to make a test pass.

## Engineering findings

### P1 — asynchronous loading can still mix models

Evidence: `web/src/main.js:120–146`, especially the metadata wait at line 128; `web/src/viewer.js:389–407`.

`ensureSystem` captures a male definition, then waits for its metadata. If the model changes during that wait, the subsequent `viewer.addSystem` call captures the new viewer generation and accepts the old male URL. The controlled reproduction produced `male-muscular.glb` while the current model was female. Existing generation checks only cover changes after `addSystem` begins.

Fix: capture a model identity and request token before the first await; check it after every asynchronous boundary; scope metadata, UI changes, and system-loaded state to that request. Cancel obsolete work where possible. Test slow metadata, slow GLB downloads, rapid repeated switching, and failed retries.

Related code-review risks: `loadPendingIndex` writes a shared `pendingParts` array without checking model identity; a late index response can replace results for the other model. In `addSystem`, stale compilation cleanup calls `splice(indexOf(scene), 1)` on the current roots array; when the old scene is absent, index -1 removes its last entry. Guard membership and keep request-owned roots. These paths were identified by code inspection, not live-browser reproduction.

### P1 — hidden controls remain keyboard-focusable

Evidence: `.panel` in `web/src/styles.css:59` hides panels with opacity and pointer events; `closePanels` only removes classes. Their buttons and input remain focusable by keyboard. An empty/closed information panel also retains its markup.

Use actual hidden/inert state or equivalent focus management; restore focus to the opener; provide direct keyboard access to layer choices. Add programmatic selected/expanded states to model/system controls and a real label for search. Existing focus-visible styles and several accessible button labels are good foundations. Verify the entire study route with keyboard and screen reader.

### P1 — model builds can hide failures

Evidence: `tools/build_all.sh:5–45` uses `set -e` with Blender output piped through `grep`, without pipefail. A matching error line can make the pipeline appear successful. Blender script exceptions also need a configured nonzero Python exit code.

Use reliable exit propagation, explicit Blender Python error exits, output validation, and temporary export paths followed by promotion only after checks pass. Keep previous valid assets when a generation step fails. Add an intentional-failure test.

### P2 — failed loads offer poor recovery

A failed base model tells the learner to inspect the console and rethrows. Provide Retry, a useful message, and a recoverable state. Check HTTP statuses before parsing metadata. Failed search-index requests are cached as an empty array, so retry requires invalidation/reload. No graceful WebGL-unavailable experience was found.

### P2 — memory and payload budgets need evidence

| Export inventory | Male | Female |
|---|---:|---:|
| Base GLB | 11.41 MB | 11.43 MB |
| All GLBs for one body | 26.68 MB | 26.79 MB |
| Total triangles across files | 3,866,854 | 3,898,184 |
| Total mesh definitions | 2,909 | 2,919 |

Totals are inventory, not simultaneous visible triangles, draw calls, measured GPU memory, or initial network transfer. Lazy loading reduces initial work. Conversely, switching and exploring both models retains assets in unbounded viewer caches; no explicit resource eviction/disposal policy was found.

Measure cold startup, decode/prepare time, long tasks, rendered frame time, draw calls, and memory on a defined midrange phone and desktop. Then optimize the largest bottleneck: lower-detail initial models, region-specific detail, bounded caches, texture compression/resizing, preprocessing fiber data, and code/content splitting where measurements justify them. The build also emits many font subsets; check which are actually downloaded before claiming a network problem.

### P2 — reproducibility and release checks

The installed Blender is 5.4.0 Alpha. The build script hardcodes its Mac application path, and source inputs are excluded from Git. Backups help, but a fresh checkout needs documented, versioned source acquisition, checksums, tool versions, and environment setup. Add automated build/card/asset validation and focused regression tests. No automated browser test suite or CI configuration was found in the reviewed tree.

Use stable content IDs independent of mesh names before building saved lessons or progress. Emit one asset manifest containing release ID, model hashes, source versions, and audit version; deploy matching content and models together.

## Study experience and product direction

The current interface supports exploration. It does not yet implement quizzes, spaced review, saved study progress, bookmarks, or a curriculum. The only local persistence found is the external-genital visibility preference. The web manifest supports app-like presentation; there is no service worker implementing an intentional offline experience.

Build one complete loop first:

1. Choose a short regional lesson with explicit objectives.
2. Explore 5–10 structures with guided camera views and useful neighboring context.
3. Answer identification and relationship questions with labels hidden.
4. Receive explanations and return directly to the relevant 3D view.
5. Save results locally and revisit missed material in a later session.

Retrieval practice and spacing have supporting anatomy-education research; the benefit to this particular app must still be measured. See [Dobson et al., distributed retrieval practice](https://pubmed.ncbi.nlm.nih.gov/27860396/) and [Retrieval Practice for Improving Long-Term Retention in Anatomical Education](https://pmc.ncbi.nlm.nih.gov/articles/PMC8368804/).

Begin with a small reviewed module, such as a regional musculoskeletal lesson, because muscle content is already stronger. Provide a navigable structure list and text study route alongside the canvas. Add orientation cues, onboarding, visible layer controls, and search by common synonyms. Treat cross-sections, comparison views, and motion as later scope; clipping existing surface meshes does not automatically produce anatomically valid internal sections.

Do not make accounts, payments, AI tutoring, or a framework rewrite prerequisites for testing the learning loop. Add them only when the pilot establishes a concrete need. If AI is added later, constrain it to reviewed content, expose citations, and separate educational explanation from diagnosis.

## Credits and release readiness

The app and README acknowledge Z-Anatomy/BodyParts3D and other assets. The in-app credits are mostly plain text; a release should expose direct source/license links, change notices, and an asset inventory. Confirm the exact MakeHuman and other bundled-asset licenses from their source distributions.

For material under CC BY-SA 4.0, the license requires attribution, a license link, indication of changes, and applicable ShareAlike terms for distributed adaptations. It allows commercial use. Do not assume this alone determines the license of all application code. See the [official CC BY-SA 4.0 deed](https://creativecommons.org/licenses/by-sa/4.0/deed.en).

Define hosting/cache behavior, release rollback, asset-version consistency, and a visible report-an-error mechanism. If collecting analytics or accounts, document what is collected, why, retention, and deletion before launching those features. These are release tasks, not evidence that the current local prototype is sending user data.

## Recommended sequence and acceptance gates

| Stage | Deliverable | Exit evidence |
|---|---|---|
| 1. Reliability | Request-scoped loading, recoverable errors, reliable export failures, stable IDs | Model-switch/retry tests pass; no mixed-model objects; failed builds cannot publish assets |
| 2. Trust | Prioritized anatomy issues, reviewer workflow, one sourced curriculum module | Every launch-module item has specific content, supporting sources, applicability, and review status; no unresolved critical errors in its scope |
| 3. Learning | Guided lesson → quiz → explanation → saved progress → review | A learner completes the full route and resumes after reload; answers do not leak through labels |
| 4. Usability | Keyboard/text route, mobile layouts, performance budgets | Measured target-device results; visible controls and readable cards; no hidden focus traps |
| 5. Pilot | Small cohort of students and an anatomy educator | Record onboarding success, lesson completion, return use, reported errors, and delayed recall |
| 6. Release | Attribution inventory, tested deployment/rollback, feedback process | Versioned release checklist and documented limitations; evidence supports the public claims |

Suggested pilot: 10–15 students and one educator, with a comparable delayed identification task after about a week. This is a usability/learning pilot, not a powered efficacy trial. Proposed engineering goals to calibrate after baseline measurement: usable scene within 5 seconds on a named device/network profile, at least 30 fps during representative orbit interactions, and no continuing memory growth after repeated model-switch cycles once the chosen cache limit is reached. These are proposed targets, not achieved results or universal standards.

Track: successful first lesson, time to find a structure, quiz completion, delayed recall, return sessions, anatomical error reports, load failures, and device performance. Set commercial pricing and acquisition spending after learner interviews and pilot evidence. No review or prompt can guarantee market success.

## Suggested next implementation slice

Fix asynchronous model ownership and failed-load retry; add regression tests for that behavior. Then build one reviewed regional lesson using existing models and muscle cards, with a short quiz and saved local results. This creates a concrete improvement in reliability and a testable reason for students to return.

The reusable implementation brief is in `MASTER_PROMPT.md`. The application and source models were not edited during this review.
