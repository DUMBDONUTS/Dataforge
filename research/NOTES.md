# RESEARCH NOTES — The Fixed-Memory Machine

> **What is this file?** All research findings for the project, in plain language, with
> verified primary sources. Every fact here was checked against the source listed beside it.
> Written Day 0 (Sep 1, 2026). Companion file: `papers/citations.md` (numbered citations).

---

## 0. The central claim we teach

> **"A model can replace growing per-word memory with one fixed-size state that it rewrites
> as it reads — gaining speed at the cost of forgetting."**

Three parts, each backed by published evidence:
1. **Growing memory (KV cache)** — attention keeps every token's keys/values; memory grows O(n). [C11]
2. **Fixed-size state works** — RWKV/RetNet/Mamba/xLSTM/Jamba/BDH all keep one bounded state; quality rivals Transformers at scale. [C1–C7]
3. **…but forgetting is real** — fixed-state models provably fail at copying/recall/state-tracking tasks; state size ↔ recall is a measured Pareto tradeoff. [C8–C10]

---

## 1. Prerequisite concepts (the learner's vocabulary)

| Term | Plain meaning | Why it matters here |
|---|---|---|
| **Attention** | For each new word, the model looks back at ALL previous words and decides which matter | The mechanism whose memory cost we're studying |
| **KV cache** | During generation, attention stores a Key and Value vector for every past token so it never has to re-read them | The "growing memory bar" in our demo. Real numbers: for a GPT-2-small-sized model (12 layers, d=768, fp16), the cache holds 12 × 2 × 768 × 2 bytes ≈ 36 KB **per token** (computed from model config — labeled as our own calculation) |
| **Recurrent state** | ONE fixed box of numbers that gets rewritten after each token: `state = update(state, token)` | The alternative: cost stays O(1) forever |
| **Linear attention** | Attention rewritten so the "look back" step becomes a running matrix sum → can be computed as a recurrence | The mathematical bridge between attention and fixed-state models [C1, C4] |
| **State space model (SSM)** | A system with hidden state evolving per step, borrowed from control theory; "selective" = gates depend on input | Mamba's family [C3] |
| **Hebbian learning / synaptic plasticity** | "Neurons that fire together, wire together" — connection strength grows when both ends are active | BDH's working memory [C7] |
| **Spiking neuron** | A neuron that emits discrete pulses when activation crosses a threshold | BDH's neuron model [C7] |
| **Monosemanticity** | One neuron/feature ≈ one meaningful concept (vs superposition where features are tangled) | BDH claims architecture-intrinsic monosemanticity [C7] |
| **MQAR** | Multi-Query Associative Recall: memorize pairs, then answer "what was X's attribute?" | Our recall experiment (from Based) [C9] |
| **TC⁰ (pronounced T-C-zero)** | A complexity class: circuits of threshold gates with fixed depth. Problems *outside* it provably can't be solved by Transformers or SSMs | The formal limit in Illusion of State [C10] |

---

## 2. The family album (one idea, six costumes)

**The shared move:** replace "store every token" (KV cache, O(n) memory) with
"keep one bounded state and rewrite it each step" (O(1) memory). The papers differ in HOW they write the state.

### 2.1 The baseline: Transformer + KV cache
- Attention reads ALL previous tokens each step (parallel training ✓).
- Inference needs the KV cache: one K,V pair per token per layer → memory grows linearly with context.
- Strength: lossless access to the whole context (within the window) → excellent copying/recall [C8, C9].
- Cost: memory + per-step work grow with sequence length; serving systems need OS-style paging tricks (vLLM/PagedAttention: KV cache "for each request is huge and grows and shrinks dynamically"; 2–4× throughput gain just by *managing* this memory better) [C11].
- Original source: Vaswani et al. 2017, "Attention Is All You Need" (arXiv 1706.03762) — predates the 2022–2026 window; cited as background only, not counted toward the ≥3 requirement.

### 2.2 RWKV (2023) — the pragmatic hybrid [C1]
- Linear attention mechanism → the SAME model can be written as a Transformer (parallel, for training) or an RNN (constant memory, for inference).
- Scaled to 14B params — largest dense RNN at publication; on par with same-size Transformers.
- Demo relevance: cleanest example of "dual form" — same math, two run modes.

### 2.3 RetNet (2023, Microsoft) — the theorist's bridge [C2]
- "Retention" mechanism with three computation paradigms: parallel, recurrent, chunkwise-recurrent.
- Derives the connection between recurrence and attention; O(1) inference memory.
- Demo relevance: the "three modes" idea mirrors our demo's toggle (one model, two views).

### 2.4 Mamba (2023) — the poster child [C3]
- Selective SSM: SSM parameters become functions of the input → model can **selectively propagate or forget** information depending on the current token.
- No attention, no MLP blocks; hardware-aware recurrent scan.
- 5× higher throughput than Transformers; linear scaling to million-length sequences; Mamba-3B beats same-size Transformers and matches 2× size on language.
- Demo relevance: forgetting as a *feature* (input-dependent gates), not a bug.

### 2.5 Mamba-2 / SSD (2024, ICML) — the unifier [C4]
- Proves deep theoretical connections between SSMs and attention variants ("structured state space duality") via structured semiseparable matrices.
- Title says it: **"Transformers are SSMs."** Core layer is 2–8× faster than Mamba-1's.
- Demo relevance: the proof that our story is ONE story, not six.

### 2.6 xLSTM (2024, NX-AI / Hochreiter) — the comeback kid [C5]
- 1990s LSTM rebuilt: **exponential gating** + new memory structures.
  - sLSTM: scalar memory + new memory mixing.
  - **mLSTM: matrix memory + covariance update rule** (fully parallelizable).
- Competitive with Transformers and SSMs at scale.
- Demo relevance: shows the "fixed state" can even be a matrix (like our toy model's outer-product state).

### 2.7 Jamba (2024, AI21) — why not both [C6]
- Hybrid: interleaves blocks of **Transformer layers and Mamba layers**, plus Mixture-of-Experts in some layers.
- Fits a 80GB GPU at large scale; strong results up to 256K-token contexts; small memory footprint vs vanilla Transformer.
- Demo relevance: the engineering answer — attention where recall matters, fixed-state where speed matters.

### 2.8 BDH / Dragon Hatchling (2025, Pathway) — the brain-style finale ⭐ [C7]
Primary source: arXiv 2509.26507 + official code `github.com/pathwaycom/bdh` (MIT).
- A **scale-free biologically inspired network of n locally-interacting neuron particles** (graph with high modularity, heavy-tailed degree distribution).
- Formally: "a practical, performant state-of-the-art **attention-based state space** sequence learning architecture" with a GPU-friendly formulation — i.e., BDH lives in the same family as our other characters.
- **Working memory relies entirely on synaptic plasticity**: Hebbian learning with spiking neurons. Empirically, specific individual synapses strengthen when the model processes a specific concept.
- **Sparse positive activations**; demonstrated monosemanticity; "interpretability of state" as an architectural feature.
- Transformer-like scaling laws; rivals GPT-2 on language + translation at equal params (10M–1B).
- The 5-step cycle (from Pathway's research page): Encoding → Local firing → Integration → **Synaptic memory** (reciprocal activity strengthens useful connections; inactive one-way connections weaken) → Decoding.
- **Our framing:** BDH's synapse matrix IS a fixed-size recurrent state — the brain's answer to the same tradeoff. Attention-like behavior *emerges* from local neuron interactions rather than a global attention module.
- Code grounding: `bdh.py` in the official repo (nanoGPT-based, MIT) — we will extract the exact neuron/synapse update equations from this file for our BDH panel.

### 2.9 BDH-CQ (2026, Pathway) — the "so what" [C12]
Primary source: pathway.com/research/introducing-bdh-cq (Aug 11, 2026).
- 150M-param reasoning model on BDH architecture.
- **29.5% pass@2 on public ARC-AGI-1 at $0.00070 computed inference cost per task** — "no previously reported system reached the same accuracy at an equal or lower cost"; comparison model (GPT Luna 5.6 Low) scores 34.2% at ~11× the cost.
- Mechanism: **iterative computation in a recurrent latent state**, decodes only candidate answers; demonstrations shown at inference update its memory; **no chain-of-thought tokens, no per-task retraining**.
- Also claimed (Pathway pages): 97.4% on ~250K Sudoku Extreme (no CoT/backtracking) [C13]; BABILong 95% @ 32K context (134M model).
- ⚠️ Evidence-discipline notes (judges reward this): (a) Sudoku result is from Pathway's *internal* BDH, not the open-source repo — stated in the repo README; (b) BABILong results "pending final contamination checks, independent validation, and leaderboard review" — stated on Pathway's page. We must carry these labels into our artifact and blog.

---

## 3. The evidence: why "forgetting" is real (falsifiable-claim support)

### 3.1 Repeat After Me (2024) [C8] — the copying limit
- Defines **GSSM** (generalized state space model) = fixed-size latent state independent of sequence length.
- Theory: a 2-layer Transformer can copy strings of **exponential** length; GSSMs are **fundamentally limited by their fixed-size latent state**.
- Empirics: Transformers beat SSMs (Mamba-family) on synthetic copying tasks AND on copying/retrieval in pretrained LLMs.
- → Our demo experiment #2: string copying. Truth (the input string) sits beside the fixed-state model's echo; accuracy decays as length grows or state shrinks. Falsifies-or-supports our claim live.

### 3.2 Based (2024, Hazy Research) [C9] — the tradeoff, measured
- Identifies "a key tradeoff between a model's **state size and recall ability**."
- Efficient alternatives (H3, Mamba, RWKV) keep fixed-size recurrent state but "struggle at recall."
- BASED = linear attention + sliding-window attention; by dialing window size / feature dimension you "traverse the Pareto frontier of the recall-memory tradeoff."
- Numbers: 1.3B-param models; +6.22 accuracy points over Mamba on real-world recall-intensive tasks; IO-aware kernels give 24× higher generation throughput than FlashAttention-2 (1024 tokens, 1.3B).
- → Our demo experiment #3 (MQAR-lite): teach pairs, test recall, plot the frontier as the learner dials state size. Their MQAR task at toy scale.

### 3.3 The Illusion of State (ICML 2024) [C10] — the expressivity limit
- SSMs' expressive power is limited like Transformers': outside **TC⁰** → provably cannot solve simple state-tracking like permutation composition.
- Concrete failures: tracking chess moves with certain notation, evaluating code, tracking entities in narratives. Mamba-style models struggle empirically.
- Key nuance: "the 'state' in an SSM is an **illusion**" — the state exists as memory but doesn't buy the expressivity of true recurrence.
- → Our "limitation / misconception" section: fixed-size state helps *cost*, it does not confer new *reasoning power*. (Distinguishing memory capacity from computational expressivity = a subtle point most explainers miss.)

### 3.4 PagedAttention / vLLM (SOSP 2023) [C11] — the cost motivation
- KV cache per request is huge and dynamic; fragmentation/redundancy waste memory; managing it OS-style yields 2–4× throughput.
- → Our "why should I care" intro: real deployed systems spend engineering effort precisely on this memory problem.

---

## 4. Demo blueprint (rubric-mapped)

**Artifact:** single-page web app, opens with preset running. Python core (`core/`) holds the reference implementation; webpage re-runs the same tiny math live (<1s) and loads precomputed curves as JSON.

| # | Interaction | Concept variable | Immediate consequence | Truth beside estimate | Rubric |
|---|---|---|---|---|---|
| 1 | Watch a tiny model read a preset sentence word-by-word, in two toggleable modes | Mode: Attention (KV cache) vs Fixed-state | Memory bar: O(n) growth vs O(1) flat line | Both modes' memory sizes shown numerically | Substrate (15), catchy open |
| 2 | Type/extend the input string; fixed-state model must echo it | State size (2–16 slots) | Recall accuracy decays with length / small state | The actual input string shown beside the echo | Truth-beside-estimate, falsifiability [C8] |
| 3 | MQAR-lite: learn pairs ("apple → red"), then quiz | State size + number of distractor pairs | Recall %; plot state-size vs recall (Pareto curve) | Correct answer shown beside model's answer | Real variable → real consequence [C9] |
| 4 | BDH panel: tiny neuron graph "reads" a repeated concept; synapse strengths heat up | Repetition / learning rate | Synapse weights visibly strengthen (Hebbian) | Highlight the exact BDH equation driving it (from bdh.py) | BDH integration (10), woven mid-journey [C7] |
| 4b | **3D BDH constellation (hero scene):** rotating neuron graph; pulses travel along edges; co-firing synapses thicken/brighten in real time | Same as 4 (same computation, richer view) | Network visibly "learns" the repeated concept | Equation overlay + numeric synapse-strength readout beside the scene | Substrate wow-factor; 2D fallback + reduce-motion toggle for mobile/accessibility [C7] |
| 5 | "Family album" strip | — (narrative) | — | RWKV/RetNet/Mamba/xLSTM/Jamba as 2–3-sentence cameos with mini-diagrams | Depth (25) breadth, one claim kept central |

**Narrative arc (guide → sandbox):**
1. Hook: preset running, memory bar racing (Transformer mode).
2. Toggle to fixed-state → bar goes flat. Aha #1: same job, constant memory.
3. Sandbox: shrink state, watch forgetting (copying + MQAR). Aha #2: the price is recall.
4. Family album: five architectures, same move.
5. BDH finale: the brain's version — synapses as the fixed state. Aha #3: memory and computation live in the same fabric.
6. Honest limits: Illusion of State + evidence labels.
7. 60-second test: learner explains the claim back in their own words.

---

## 5. Misconceptions to explicitly bust (from the papers)

1. **"Fixed-state models are just worse Transformers."** — No: they win on throughput/memory (Mamba 5×, BASED 24× vs FlashAttention-2 in its setting) and match quality at scale; the right frame is a *tradeoff*, not a ranking. [C3, C9]
2. **"Fixed-state models have no state."** — Illusion of State's point is subtler: the state exists as memory, but doesn't add expressivity (TC⁰ limit). Memory ≠ expressivity. [C10]
3. **"Attention remembers everything perfectly."** — Within its window, yes, but it *pays memory per token forever* (vLLM exists because of this), and beyond the window it remembers nothing. [C11]
4. **"Forgetting is a bug."** — In Mamba-style selective SSMs, input-dependent forgetting is the mechanism that preserves what matters. [C3]
5. **"BDH is attention with a brain sticker."** — BDH's attention-like behavior *emerges from local synaptic interactions*; the substrate is a spiking neuron graph with Hebbian memory, and interpretability of state is architectural. [C7]

## 6. Open questions (honest unknowns for blog/defense)

- How do hybrid layer ratios (Jamba) affect recall vs throughput in practice? (Their ablations exist; we cite, not re-run.)
- Does BDH-CQ's ARC-AGI-1 cost-accuracy frontier hold as it scales? (Pathway: "early in the journey"; scaling to ARC-AGI-2 is future work.)
- Does the SSD duality (Mamba-2) extend to all linear-attention variants? (Framework is new; active research.)
- Where exactly does the Pareto frontier sit for small models? (Based gives 1.3B-scale numbers; our toy model shows the *shape*, not the exact curve — we label it as such.)

## 7. Glossary check (60-second test bank)

Learner should be able to answer, after using the artifact:
- Why does Transformer memory grow with text length? (KV cache: one K,V per token per layer)
- What stays constant in a fixed-state model? (one state box, rewritten each step)
- What's the price of the constant memory? (interference → forgetting; measured in copying/recall tasks)
- Name two architectures from the fixed-state family. (RWKV, Mamba, xLSTM, RetNet, Jamba…)
- How does BDH store working memory? (synaptic weights, strengthened by Hebbian plasticity — no growing cache)
- What CAN'T fixed-state models do? (state tracking / long copying — TC⁰-style limits [C10])

---

## Source index
See `papers/citations.md` for the numbered citation list [C1]–[C13], full links, evidence levels, and license notes.
