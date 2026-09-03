# Think Silently — Alternatives to Chain-of-Thought (Toy Explainer)

**Falsifiable claim:** A model can gain test-time compute by refining a fixed-size
recurrent latent state across iterations — trading verbal observability for cheaper
scaling — without writing any chain-of-thought tokens.

**Live demo:** open `index.html` (or the GitHub Pages URL). No sign-in, no keys, no backend.

## What the learner does (60 seconds)
1. Press **Run thinking-out-loud** (Side A): watch scripted reasoning steps appear with a
   ticking token counter. Answer: 14. Cost: every word generated.
2. Move the **silent effort slider** (Side B) from 1 → 12 and press **Run silent trials**:
   toy accuracy climbs; reasoning-tokens badge stays **0**.
3. Read the **evidence panel**: BDH-CQ vendor-reported numbers + Coconut + CoT origin.
4. Answer aloud: *when would you still choose Side A?* (Answer: when you must audit why.)

## Project layout
| File | Role | Live / precomputed / illustrative |
|---|---|---|
| `index.html` | Single-page artifact | — |
| `styles.css` | Styling, mobile layout, reduced-motion | — |
| `app.js` | Toy latent refiner (seeded, real computation) + scripted CoT trace | Side B live · Side A illustrative (labeled) |
| `data/evidence.json` | BDH-CQ / Coconut / CoT published findings | Precomputed, labeled |
| `research/` | Day 0–3 notes, course, citations | — |
| `PROJECT_LOG.md` | Dated build record | — |

## Reproduce
No build step. Any static server works, e.g. `python -m http.server` in this folder,
then open http://localhost:8000. Same seed (42) → same Side B curve every load.

## Audience & prerequisites
Curious beginner–intermediate learner. Prerequisites: what a token is; what an average is.
Learning objectives: (1) distinguish CoT tokens from latent passes as test-time compute;
(2) predict the slider effect, then verify; (3) state the cost/observability trade-off;
(4) name one limitation.

## Key citations (full list: `research/papers/citations.md`)
- [C14] Wei et al. 2022, arXiv 2201.11903 — chain-of-thought prompting.
- [C15] Hao et al. 2024, arXiv 2412.06769 (COLM 2025) — Coconut continuous thought.
- [C12] Pathway BDH-CQ report, Aug 2026 — 150M params, 29.5% pass@2 ARC-AGI-1 @ $0.0007/task
  (vendor-reported; labeled as such everywhere).
- [C7] BDH paper, arXiv 2509.26507 + official MIT code `github.com/pathwaycom/bdh`.

## Licenses & disclosure
Own code: MIT (see LICENSE — TODO: add file). BDH equations/code referenced with
attribution (MIT). No user data collected. AI-assisted coding/writing throughout;
the author understands and can defend every component (see `research/LEARN.md`
study questions).
