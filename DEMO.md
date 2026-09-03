# DEMO.md — Judge Walkthrough and Defense Notes

## One-Command Start

```powershell
cd HACKATHON\KHDS
python -m http.server 8000
```

Open [http://localhost:8000](http://localhost:8000). Fully local: no API keys, no backend, no CDN.

## 3-Minute Walkthrough

### 1. Hook — The Claim (20 seconds)
Point to the claim card in the hero:
> "A model can gain test-time compute by refining a fixed-size recurrent latent state across iterations — trading verbal observability for cheaper scaling — without writing any chain-of-thought tokens."

Say: "This is the falsifiable claim. Every widget below tests it."

### 2. Live Comparison — Same Task, Two Minds (90 seconds)

**Pick a task** — click **ARC Visual** (default), **Arithmetic**, **Logic Puzzle**, or **Custom**.

**Side A — Chain-of-Thought** (left):
- Click **Analyze** → 6 reasoning steps appear with token counter
- Enable **Inject a deliberate reasoning error** → watch one wrong step propagate, final answer becomes wrong
- Say: "CoT is auditable — you see every step. But one wrong token poisons everything after."

**Side B — BDH-CQ Latent Reasoning** (right):
- Leave **4 passes / 4 slots** (defaults) → click **Advance one silent pass** 4 times
- Watch facts enter slots → combine → derive → decode answer
- Token counter stays **0** throughout
- Say: "Same task, zero reasoning tokens. The model thinks in latent space, only decodes the answer."

**Verdict strip** (bottom): Ground truth | CoT result | Latent result — all match.

### 3. Falsifiability Lab — Break the Claim (40 seconds)

Click each challenge button and watch:

| Challenge | What Happens | Teaching Point |
|---|---|---|
| **Reduce capacity → latent fails** | Set capacity=1, re-analyze, advance passes → latent shows "—", note says "insufficient capacity" | Bounded state drops required facts → cannot decode |
| **Reduce effort → latent incomplete** | Set effort=1, re-analyze, advance → latent stops at pass 1, note says "need more passes" | Insufficient refinement → no convergence |
| **Inject CoT error → trace breaks** | Toggle error injection, re-analyze → CoT trace shows red corrupted step, wrong final answer | Single token error propagates in CoT |
| **Unsupported task → both reject** | Click Custom, enter nonsense → both sides show "not a reasoning task" | Honest rejection, no hallucination |

### 4. Mechanism & Evidence (20 seconds)

Scroll to **Mechanism** — visual flow diagrams.
Scroll to **BDH-CQ** — vendor-reported case study with evidence cards (PEER/VENDOR/TOY labeled).
Scroll to **Evidence** — table with source mapping.

### 5. 60-Second Checkpoint (10 seconds)

Visitor answers the multiple choice → gets instant feedback → explains trade-off aloud.

---

## Five Judge Questions & Answers

| Question | Answer |
|---|---|
| **Is this a real LLM / BDH-CQ model?** | No. It's a transparent, deterministic teaching simulation. Side A is a labeled CoT trace generator. Side B is a deterministic bounded-state simulator based on BDH-CQ's published mechanism. We explicitly label both as teaching tools, not the real models. |
| **Why is this more than a slider demo?** | The learner can: (1) choose/enter any supported task, (2) inject CoT errors, (3) reduce capacity/effort to see failure modes, (4) inspect actual state writes/overwrites, (5) compare decoded output against ground truth. All controls map to real mechanism variables. |
| **Why BDH-CQ as the alternative?** | Pathway's 2026 report is the only published system claiming iterative latent reasoning on ARC-AGI-1 with no CoT tokens. Coconut (COLM 2025) independently validates the latent-reasoning paradigm. We cite both, label evidence levels. |
| **When is CoT still better?** | Audit-required domains (medical, legal, financial) where visible intermediate reasoning is worth the compute cost. Latent reasoning trades observability for efficiency. |
| **What evidence supports the premise?** | [PEER] Wei et al. 2022 (CoT), [PEER] Hao et al. 2024 Coconut (latent reasoning), [VENDOR] Pathway 2026 BDH-CQ report. All cited with evidence levels. |

---

## Demo Fallback

- **Fully local** — run `python -m http.server 8000`, works offline after first load
- **No external dependencies** — no CDN, no fonts, no API calls
- **Screen recording** — record 45s covering: ARC task → CoT error → capacity=1 failure → checkpoint
- **Screenshots** — add to `docs/screenshots/` before submission