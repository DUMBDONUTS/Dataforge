# Think Silently: Alternatives to Chain-of-Thought (BDH-CQ)

**Falsifiable claim:** A model can gain test-time compute by refining a fixed-size recurrent latent state across iterations — trading verbal observability for cheaper scaling — without writing any chain-of-thought tokens.

## Live Demo

Open `index.html` directly or serve locally:

```powershell
cd HACKATHON\KHDS
python -m http.server 8000
```

Then open http://localhost:8000. **No build, no dependencies, no API keys.**

## What the Learner Does (60 seconds)

1. **Sees the claim** immediately in the hero card.
2. **Picks a task** — ARC Visual, Arithmetic, Logic Puzzle, or writes their own.
3. **Side A (CoT):** Clicks Analyze → watches 6 reasoning steps appear with token counter. Toggles error injection → sees one wrong step propagate to wrong answer.
4. **Side B (BDH-CQ):** Clicks "Advance one silent pass" 4 times → watches facts enter 8 slots, combine, derive, decode. Token counter stays at **0**.
5. **Verdict strip** shows Ground Truth | CoT | Latent — all match.
6. **Falsifiability Lab:** Clicks "Reduce capacity → latent fails" → sets capacity=1 → latent fails to decode.
7. **Checkpoint:** Answers the quiz → explains the trade-off aloud.

## Learning Objectives

After using this artifact, a learner can:
1. Explain why CoT is visible written scratch work, not the only form of computation.
2. Compare a CoT trace against a recurrent fixed-state computation on the same task.
3. Predict what fails when a fixed state has too little capacity or too few refinement passes.
4. State the cost-vs-observability trade-off in their own words.
5. Describe how Pathway reports BDH-CQ uses recurrent latent state, without claiming this project reproduces BDH-CQ.

## Project Structure

```
index.html          ← Single-page structure, semantics, accessibility
styles.css          ← Design system, responsive, reduced-motion
app.js              ← CoT generator, BDH-CQ simulator, UI state, falsifiability
data/evidence.json  ← Labeled evidence (PEER/VENDOR/TOY)
README.md           ← This file
DEMO.md             ← Judge walkthrough + 5 Q&A
PROJECT_LOG.md      ← Dated build record
LICENSE             ← MIT
.github/workflows/pages.yml  ← GitHub Pages deploy
```

## Interactive Substrate & Evidence Labels

| Area | What the learner changes | What really runs | Evidence status |
|---|---|---|---|
| Problem selector | Task type (ARC, arithmetic, logic, custom) | Deterministic parser | **Live** |
| CoT panel | Error injection toggle | Generated trace + token count | **Live illustration** (labeled not a live LLM) |
| Latent panel | Passes (1-8), capacity (1-8) | Bounded-state machine with slot writes | **Live toy** |
| Falsifiability lab | Capacity, effort, CoT error, unsupported | Real failure modes | **Live** |
| Evidence cards | None | Precomputed JSON | **Precomputed** (PEER/VENDOR/TOY labeled) |

## Key Citations

- [PEER] **Wei et al. 2022** — *Chain-of-Thought Prompting Elicits Reasoning in Large Language Models* (arXiv 2201.11903)
- [PEER] **Hao et al. 2024** — *Training Large Language Models to Reason in a Continuous Latent Space* / Coconut (arXiv 2412.06769, COLM 2025)
- [VENDOR] **Pathway 2026** — *Introducing BDH-CQ* (research report, Aug 2026)
- [PEER] **Kosowski et al. 2025** — *The Dragon Hatchling* (arXiv 2509.26507)

Full claim-to-source mapping in `data/evidence.json` and `research/papers/citations.md`.

## Honest Limitations

- **CoT side:** Deterministic trace generator for teaching. Not a live LLM. Token counts are transparent word counts.
- **Latent side:** Bounded-state simulator based on BDH-CQ's published mechanism (iterative recurrent state, no CoT tokens). Not the real BDH-CQ model. Real latent states are high-dimensional and not directly interpretable.
- **BDH-CQ numbers:** Vendor-reported (Pathway 2026). Not independently reproduced. Labeled as such everywhere.
- **Parser:** Supports ARC-style, arithmetic, logic, and custom heuristics. Rejects unsupported input honestly.

## AI Assistance & Ownership Disclosure

AI assistance used for: research organization, code scaffolding, copy editing, UI iteration, test scripting.

The author **verified all linked primary sources**, **understands the parser and bounded-state simulator**, and can **explain the live/precomputed/illustrative distinction for every section**.

No third-party model output, private user data, API key, external dataset, or uncredited asset is included.

## License

MIT — see `LICENSE` file.