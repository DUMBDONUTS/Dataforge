# PROJECT LOG — Think Silently: CoT vs BDH-CQ

> **What is this file?** A dated, honest record of everything we build, decide, and learn during the DataForge 2026 Pathway Track hackathon. Written so the author can re-read it later and understand not just *what* was done, but *why*.

- **Event:** DataForge 2026 — Pathway Track (NeurIPS Education Track style)
- **Team:** Solo
- **Challenge window:** 1 week (started Tue, Sep 1 2026)
- **Deliverables:** public interactive artifact + repo + blog (600–800 words) + README + citations + license record + AI disclosure

---

## Day 0 — Tue, Sep 1 2026: Understanding, choosing, locking, researching

### What we did
1. Extracted and analyzed the full problem statement (8-page PDF).
2. Decoded the judging rubric (100 pts) and mapped it to a build strategy.
3. Compared candidate topics; chose **"Alternatives to Chain-of-Thought"** with BDH-CQ as the concrete alternative.
4. Ran deep research: verified 6 primary sources by fetching them directly (no guessing URLs).

### The one-sentence claim (locked)
> **"A model can gain test-time compute by refining a fixed-size recurrent latent state across iterations — trading verbal observability for cheaper scaling — without writing any chain-of-thought tokens."**

This is falsifiable: if our fixed-state demo model *never* fails at small state sizes, the claim is challenged. If the CoT token counter isn't zero for latent reasoning, it's challenged too.

### Decisions locked
| Decision | Choice | Why |
|---|---|---|
| Topic | Alternatives to Chain-of-Thought | Approved list; BDH-CQ is the flagship example |
| Framing | CoT vs BDH-CQ side-by-side on same task | One central claim, one learning journey |
| Artifact format | Single-page HTML/CSS/JS | Rubric fit: public URL, no sign-in, <1s feedback, mobile |
| Hosting | GitHub Pages | Free, stable links, no sign-in |
| Evidence sources | Wei et al. 2022 (CoT), Hao et al. 2024 (Coconut), Pathway 2026 (BDH-CQ) | 3+ primary papers 2022-2026; evidence levels labeled |
| Stack | Plain HTML/CSS/JS + GitHub Pages | No build, no deps, static hosting, mobile-first |

### Judging rubric → strategy (from problem statement)
- Technical correctness & depth — **25 pts** → verify every claim against primary sources; wrong claim = major penalty
- Technical ownership & live defense — **15 pts** → understand every line we ship; daily "explain it back" habit
- Learning effectiveness — **15 pts** → claim, audience, prerequisites, guided narrative, 60-second test
- Interactive substrate & honesty — **15 pts** → real computation, controls→real variables, truth beside estimate, <1s
- BDH integration & evidence discipline — **10 pts** → sourced from Pathway report + peer papers; label evidence levels
- Craft, robustness, accessibility, provenance — **10 pts** → mobile, loading, licenses
- One-page concept summary — **10 pts** → self-contained briefing for average data scientist
- Explicit weak-list to avoid: generic overviews, chatbots, static decks, scripted animation pretending to be computation, unchanged forks, bolted-on BDH, unsourced claims, unexplainable code

### Research completed (Day 0)
All 6 primary sources fetched and verified:
- [C1] Wei et al. 2022, arXiv 2201.11903 — CoT prompting
- [C2] Hao et al. 2024, arXiv 2412.06769 (COLM 2025) — Coconut continuous thought
- [C3] Pathway BDH-CQ report, Aug 2026 — 150M params, 29.5% pass@2 ARC-AGI-1 @ $0.0007/task
- [C4] Kosowski et al. 2025, arXiv 2509.26507 — BDH architecture
- [C5] Jelassi et al. 2024 — Repeat After Me (copying limits)
- [C6] Arora et al. 2024 — BASED (recall-memory tradeoff)

### What the author learned today (in own words)
- CoT makes reasoning visible but serial and token-costly; one wrong token breaks the chain.
- BDH-CQ uses recurrent latent state updates instead of CoT tokens; Pathway reports 29.5% ARC-AGI-1 at 11× lower cost.
- The trade is fundamental: observability vs. compute efficiency. No free lunch.
- A teaching simulation must be falsifiable: reduce capacity → latent fails; inject error → CoT breaks.

---

## Day 1 — Wed, Sep 2 2026: First scaffold + claim pivot

### Pivot decision
Originally chose "Fixed-State Memory vs KV Cache" (Post-Transformer Architectures). Pivoted to **Alternatives to Chain-of-Thought** because:
- BDH-CQ is explicitly an "alternative to CoT" in the approved topics
- Stronger BDH-CQ integration (it's the flagship example)
- More intuitive for learners: "thinking out loud vs thinking silently"

### Build completed (Day 1)
- Basic dual-panel layout: CoT trace (left) vs latent slider (right)
- Single apple arithmetic problem
- Effort slider, accuracy metric
- Placeholder evidence panel
- GitHub Pages workflow

### Validation
- `node --check app.js` passes
- Evidence JSON valid
- Page loads in headless Chrome

---

## Day 2 — Thu, Sep 3 2026: Complete rebuild as interactive lab

### Why the Day 1 version wasn't enough
- One fixed apple problem → judge couldn't test with different inputs
- Effort slider only, no state capacity control
- Latent side was a chart, not a visible state machine
- BDH-CQ mentioned but not woven through the interaction
- No falsifiability challenges, no checkpoint quiz

### What changed (complete rebuild)
**Architecture:**
- Single-page guided narrative + interactive lab
- Problem carousel: ARC Visual, Arithmetic, Logic, Custom
- Side A: CoT trace generator with token counter + error injection
- Side B: Live bounded-state machine with 8 slots, pass-by-pass advancement, event log
- Falsifiability Lab: 4 challenge buttons (capacity, effort, CoT error, unsupported)
- Mechanism section: visual flow diagrams
- BDH-CQ case study with evidence cards (PEER/VENDOR/TOY)
- Evidence table with source mapping
- 60-second checkpoint quiz
- Responsive, reduced-motion, accessible

**Key technical decisions:**
- Deterministic simulation (seeded RNG) → reproducible, testable
- No external deps, no build step, no API keys
- All evidence loaded from local JSON with evidence levels
- Honest labeling everywhere: "teaching simulation," "not a live LLM," "vendor-reported"
- Falsifiability built into UI: capacity=1 → latent fails; CoT error → trace breaks

**BDH-CQ integration (honest):**
- Case study panel explains Pathway's reported mechanism
- Evidence cards labeled VENDOR (BDH-CQ), PEER (CoT, Coconut), TOY (our simulation)
- Explicit disclaimer: "This simulation is based on published mechanism. Not the real BDH-CQ."

### Validation performed
- `node --check app.js` — PASS
- `data/evidence.json` parses — PASS
- Headless Chrome functional tests:
  - ARC task: CoT 6 steps, Latent 4/4 passes, both match ground truth ✓
  - Capacity=1 → latent fails to decode ✓
  - CoT error injection → trace shows corruption propagation ✓
  - All DOM elements present ✓
- Whitespace/diff check — PASS (only CRLF warnings)

---

## Day 3 — Fri, Sep 4 2026: Polish, docs, QA

### Final polish
- Evidence table with source mapping
- Checkpoint quiz with instant feedback
- Falsifiability lab with 4 challenge buttons
- README with audience, prerequisites, learning objectives, architecture diagram
- DEMO.md with 3-min walkthrough + 5 judge Q&A
- LICENSE (MIT)
- PROJECT_LOG updated

### QA Results (5 Levels)
| Level | Check | Result |
|---|---|---|
| 1 | Syntax & correctness | ✅ `node --check` PASS, JS strict mode |
| 2 | Functional alignment | ✅ All features work per spec |
| 3 | Performance | ✅ <1s interaction, no build, static files |
| 4 | Integration | ✅ HTML/CSS/JS/JSON all load, evidence loads |
| 5 | Security & best practices | ✅ No secrets, no external calls, no user data, CSP-ready |

### Deployment verification
- GitHub Pages workflow configured
- Local `python -m http.server` works instantly
- No build step, no dependencies
- Mobile layout tested (responsive grid collapses)
- Reduced-motion media query respected

### Remaining submission work
- [ ] Record 45s screen capture (ARC task → CoT error → capacity=1 failure → checkpoint)
- [ ] Write blog post (600–800 words) from README + evidence panel
- [ ] One-page concept summary PDF
- [ ] Enable GitHub Pages in repo settings
- [ ] Final smoke test on production URL

---

## Key Architectural Decisions (for defense)

| Decision | Rationale |
|---|---|
| Deterministic seeded RNG | Reproducible, testable, no flaky demos |
| No external deps | Works offline, zero supply-chain risk, judges can audit all code |
| 8-slot state visualization | Legible proxy for "fixed-size recurrent state"; real BDH states are high-dim |
| Pass-by-pass advancement | Learner controls the "effort" variable; sees state evolution |
| Error injection on CoT | Demonstrates CoT brittleness vs latent robustness |
| Capacity=1 failure mode | Directly falsifies "latent always works" — proves bounded state trade-off |
| Evidence levels (PEER/VENDOR/TOY) | Meets rubric's evidence discipline requirement |
| No BDH-CQ checkpoint | Honest: not publicly available; we simulate the *mechanism* not the *model* |

---

## What the Author Can Defend (Ownership)

Every line of `app.js` — parser, CoT generator, latent simulator, UI state.
Every design choice in `styles.css` — responsive grid, color system, reduced motion.
Every claim in `index.html` — traced to `data/evidence.json` → primary sources.
Every limitation acknowledged — labeled in UI, README, DEMO.md.