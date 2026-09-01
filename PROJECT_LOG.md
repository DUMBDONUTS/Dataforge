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
