# PROJECT LOG — The Fixed-Memory Machine

> **What is this file?** A dated, honest record of everything we build, decide, and learn during
> the DataForge 2026 Pathway Track hackathon. Written so the author can re-read it later and
> understand not just *what* was done, but *why*.

- **Event:** DataForge 2026 — Pathway Track (NeurIPS Education Track style)
- **Team:** Solo
- **Challenge window:** 1 week (started Tue, Sep 1 2026)
- **Deliverables:** public interactive artifact + repo + blog (600–800 words) + README + citations + license record + AI disclosure

---

## Day 0 — Tue, Sep 1 2026: Understanding, choosing, locking, researching

### What we did
1. Extracted and analyzed the full problem statement (8-page PDF).
2. Decoded the judging rubric (100 pts) and mapped it to a build strategy.
3. Compared candidate topics; chose **"Post Transformer architectures"** with a deliberately
   narrow framing to keep the build tractable while the story stays ambitious.
4. Ran deep research: verified 12 primary sources by fetching them directly (no guessing URLs).

### The one-sentence claim (locked)
> **"A model can replace growing per-word memory with one fixed-size state that it rewrites
> as it reads — gaining speed at the cost of forgetting."**

This is falsifiable: if our fixed-state demo model *never* forgets at small state sizes,
the claim is challenged. If the Transformer-mode memory bar doesn't grow, it's challenged too.

### Decisions locked
| Decision | Choice | Why |
|---|---|---|
| Topic | Post Transformer architectures (approved list) | Ambitious story, natural BDH integration |
| Narrow framing | fixed-size state vs growing memory (KV cache) | One central claim, one learning journey (rule-compliant) |
| Artifact format | HTML/JS webpage + Python reference core | Rubric fit: public URL, no sign-in, <1s feedback, mobile |
| Hosting | GitHub Pages | Free, stable links, no sign-in |
| Family album cast | RWKV, RetNet, Mamba (+Mamba-2), xLSTM, Jamba | 2–3 sentence cameos each |
| Finale | BDH (synaptic memory) + BDH-CQ (latent reasoning) | Mandatory module; strong primary sources exist |

### Judging rubric → strategy (from problem statement)
- Technical correctness & depth — **25 pts** → verify every claim against primary sources; wrong claim = major penalty
- Technical ownership & live defense — **15 pts** → understand every line we ship; daily "explain it back" habit
- Learning effectiveness — **15 pts** → claim, audience, prerequisites, guided narrative, 60-second test
- Interactive substrate & honesty — **15 pts** → real computation, controls→real variables, truth beside estimate, <1s
- BDH integration & evidence discipline — **10 pts** → sourced from arXiv 2509.26507 + Pathway reports; label evidence levels
- Craft, robustness, accessibility, provenance — **10 pts** → mobile, loading, licenses
- Blog post — **10 pts (+10 bonus)** → cheap points; treat seriously
- Explicit weak-list to avoid: generic overviews, chatbots, static decks, scripted animation
  pretending to be computation, unchanged forks, bolted-on BDH, unsourced claims, unexplainable code

### Research completed (Day 0)
All 12 primary sources fetched and verified — see `research/NOTES.md` (notes) and
`research/papers/citations.md` (citation list + claim mapping + evidence levels).

Highlights discovered:
- Our claim is *published science*, not an invention: the Based paper (arXiv 2402.18668)
  states the exact state-size ↔ recall tradeoff we will teach.
- Two published toy tasks (string copying; MQAR associative recall) can be implemented at
  tiny scale as our honest experiments.
- BDH's official code is MIT-licensed (`github.com/pathwaycom/bdh`) — we can ground our BDH
  panel in the actual equations, with attribution.
- Evidence-discipline catch: the Sudoku 97.4% result comes from Pathway's *internal* BDH
  implementation, not the open-source repo — we must label this carefully everywhere.

### What the author learned today (in own words, kept honest)
- Attention keeps a Key-Value cache: memory grows with every token — this is *why* long
  context is expensive.
- "Post-Transformer" models all share one move: keep ONE fixed-size state and rewrite it
  each step. Different papers = different ways of writing that state.
- BDH does the same thing brain-style: synapses (connections) ARE the memory, updated by a
  local Hebbian rule.

### Next up (Day 1)
- [ ] Set up GitHub repo + GitHub Pages workflow
- [ ] Write audience definition, prerequisites, learning objectives (README draft)
- [ ] Extract exact equations from `bdh.py` (official repo) + from attention/linear-attention forms
- [ ] Draft the guided narrative storyboard (guide mode → sandbox mode)

---

## Day 3 — Thu, Sep 3 2026: Claim pivot (locked) + single-page build

### Pivot decision (locked after team review)
- **Old claim (Day 0):** fixed-size state vs growing KV-cache memory.
- **New claim (final):** *"A model can gain test-time compute by refining a fixed-size
  recurrent latent state across iterations — trading verbal observability for cheaper
  scaling — without writing any chain-of-thought tokens."*
- **Why:** "Alternatives to Chain-of-Thought" is the approved topic with the strongest
  BDH-CQ anchor (C12: no-CoT iterative latent reasoning, vendor-reported numbers) plus
  independent literature (C15 Coconut: continuous thought beats CoT on planning-heavy
  logic with better accuracy-efficiency tradeoff; C14 CoT origin: Wei et al. 2022).
- **What reuses Day 0:** the fixed-recurrent-state mechanism, BDH synaptic-memory framing,
  evidence-discipline labels, family-album context. Memory material becomes *supporting*
  evidence (why latent passes are cheap: no growing cache), not the claim.
- **Artifact scope:** single page, two panels (Side A scripted CoT trace vs Side B live
  toy latent refiner + effort slider), truth-beside-estimate evidence panel, limitations box.
- **Stack (StarkData Phase 0.5 locked):** static HTML/CSS/JS, no backend, GitHub Pages.

### New verified sources (fetched directly, no guessing)
- [C14] Wei et al. 2022, arXiv 2201.11903 — CoT prompting; 540B + 8 exemplars → GSM8K SOTA.
- [C15] Hao et al. 2024, arXiv 2412.06769 (COLM 2025) — Coconut continuous thought;
  latent BFS over alternatives; outperforms CoT on planning-heavy logic, better tradeoff.

### Build completed (verified)
- `index.html` + `styles.css` + `app.js` + `data/evidence.json` — opens with toy pre-run.
- Side A: scripted CoT trace with live token counter (labeled illustration, not a live LLM).
- Side B: seeded live toy (300 trials, effort slider 1–12, accuracy + error trajectory).
- QA: JS syntax check passed; evidence JSON valid; file layout verified.

### Next up
- [ ] README + citations update (C14, C15) + license record + AI disclosure
- [ ] GitHub Pages workflow + public URL smoke test
- [ ] Blog draft (600–800 words) + one-page concept summary
- [ ] Defense rehearsal: explain contraction factor, token math, evidence levels aloud

---

## Day 0 addendum — Reference study + 3D decision

### Reference studied: Transformer Explainer (Georgia Tech, Polo Chau lab)
Link: https://poloclub.github.io/transformer-explainer/ | Repo: https://github.com/poloclub/transformer-explainer (MIT, 8.5k stars, CHI 2026 paper)
This is one of the three reference projects NAMED in the problem statement — so studying it = studying the judges' gold standard.

**What it does:** whole GPT-2 (124M params) running live in-browser (ONNX Runtime, converted from Karpathy's nanoGPT), Svelte + D3.js, GitHub Pages. Opens pre-running with preset text; controls (temperature, top-k, top-p, attention hover) all touch real model internals.

**Design takeaways we adopt (ours is same genre, different lesson):**
1. Open with preset already running — page is alive before the learner touches anything
2. Scrolling visual essay: text sections beside a live diagram that responds
3. Every control maps to a real variable; numbers update live
4. Static hosting on GitHub Pages, no backend
5. Their scope is the WHOLE Transformer; we deliberately go narrow (one claim) — per problem statement's "one central claim" rule

**Fun lineage:** their GPT-2 derives from nanoGPT; BDH's official code is also nanoGPT-based — same family tree our artifact teaches.

### Decision locked: "2D-first page + 3D BDH finale"
- ~95% of page: clean fast 2D (memory bars, mode toggle, recall quiz) — legible, mobile-safe, <1s
- ONE hero 3D scene: BDH neuron constellation (Three.js via CDN, OrbitControls drag/zoom):
  glowing nodes, pulses traveling along edges, synapses visibly thickening/brightening
  when they co-fire (Hebbian learning made visible)
- Rationale: BDH is literally a graph of locally-interacting neurons — 3D *is* the concept there,
  not decoration. Problem statement rule "cut anything that doesn't serve the claim" respected:
  memory bars stay 2D (2D shows O(n) vs O(1) more legibly than 3D).
- Safety nets for rubric: 2D fallback diagram of the same BDH panel + "reduce motion" toggle
  (mobile usability + accessibility points), precomputed where expensive, live where cheap
- Defense note: the 3D scene is ~100–200 nodes + edges — simple scene graph, explainable

### Stack addition (final)
- 3D: Three.js (CDN import, no build step) — only inside the BDH panel
- Everything else: plain HTML/CSS/JS + Python core for reference implementation & precomputed data
