# LEARN.md — Day 0 Study Course: "How AI Reads, Remembers, and Forgets"

> **Purpose:** the full concept course behind our project, written for a beginner.
> Read top to bottom — every section builds on the previous one. Study questions at the end.
> If you can answer the questions in your own words, you can defend this project to any judge.
> Sources: see `papers/citations.md` — [C#] markers refer to that list.

---

## 1. What a language model does

- Job: **predict the next token** given previous text. "The cat sat on the ___" → probability for every possible next token.
- Tokens = words or word-chunks. Each token becomes a **vector** (a list of numbers) representing its meaning. Meaning is geometry: similar words → similar vectors.
- To predict well, the model must **hold the meaning of everything read so far**. Where and how it holds that = the entire subject of our project.

## 2. Attention (Transformer, 2017) — direct lookup of the whole past

- Older models (RNNs) read through a "drinking straw": one memory channel, each word squeezed through it. Long-range detail washed out.
- Attention instead lets every word **look back at every previous word directly** and weigh what's relevant.
- Search-engine analogy:
  - **Query (Q)** = your search text ("what am I looking for?")
  - **Key (K)** = each page's title ("what I'm about")
  - **Value (V)** = the page content ("what you get")
  - Query compared against all keys → scores → weighted blend of values.
- Math: `Attention(Q,K,V) = softmax(Q·Kᵀ / √d) · V` — the softmax turns match-scores into percentages that sum to 1.
- Masked version: when generating, a word can only look *backwards* (no peeking at the future).

## 3. The KV cache — the growing memory (our "photo gallery")

- Recomputing all past words' K and V every step would be wasteful, so the model **caches each token's K and V** on arrival → the **KV cache**.
- Arithmetic (GPT-2-small config — our own calculation, labeled [CALC]):
  - 12 layers × 2 (K,V) × 768 numbers × 2 bytes (fp16) ≈ **36 KB per token**
  - 1,000 tokens ≈ 36 MB; 128K-token contexts → gigabytes per request
- The cache **grows one entry per token per layer, forever**. Never shrinks.
- Real-world consequence: serving systems (vLLM/PagedAttention [C11]) exist almost entirely to manage this pile; the paper: KV cache per request "is huge and grows and shrinks dynamically."
- **This is the cost side of our claim.**

## 4. The notebook — fixed-size state (our "one page, constantly rewritten")

- Alternative: keep ONE box of numbers (the **state**) and rewrite it after every token:
  `state ← update(state, new_token)`. Same size at token 10 and token 10,000,000 → O(1) memory.
- Historical problem: training such recurrent models suffered vanishing gradients (the fading also faded the learning signal). Transformers won in 2017 because training was parallel and stable.
- The 2023–2025 renaissance (what each paper added):
  - **Linear attention / RetNet / Mamba-2:** the attention computation can be rewritten as a running matrix sum `S ← decay·S + key·valueᵀ`. Writing it = parallel attention; running it = notebook. **Attention and recurrence are two views of one math** — the bridge that legitimizes our whole story. [C2, C4]
  - **Mamba:** decay/gates become functions of the *content* → **selective forgetting**; model chooses what to fade. 5× throughput, linear scaling. [C3]
  - **RWKV:** trains like a Transformer, runs like an RNN; scaled to 14B params. [C1]
  - **xLSTM:** the state can be a **matrix** (mLSTM) with exponential gating. [C5]
  - **Jamba:** hybrid — interleave Transformer layers and Mamba layers (+ MoE). [C6]
- **Family album summary:** six papers, one idea — *stop storing everything; rewrite one bounded state.*

## 5. Interference — why forgetting is real (the deep mechanism)

- The state is a fixed-size sum of `key·value` products. New memories **add onto** old ones. Overlapping keys blur each other — like overwriting a whiteboard without erasing.
- Evidence (the falsifiable-claim trio):
  - **Repeat After Me [C8]:** 2-layer Transformer copies strings of exponential length; GSSMs (fixed-state models) are *provably* limited by their fixed-size state. Pretrained SSMs dramatically worse at copying/context retrieval.
  - **Based [C9]:** the tradeoff is measurable and dialable: state size ↔ recall, a Pareto frontier. Bigger state → better recall → more memory. (Their MQAR task = our demo quiz.)
  - **Illusion of State [C10]:** fixed-state models are limited *like Transformers* (both outside complexity class TC⁰) — the state gives cheap memory, NOT new reasoning power (no state tracking: chess notation, code evaluation).
- **Our one-sentence claim restated:** fixed-size state works and is cheap — and provably forgets through interference.

## 6. BDH — the brain's notebook

- BDH (Pathway, arXiv 2509.26507 [C7]): a graph of **spiking neurons** — units that fire only when input crosses a threshold.
- Neurons talk only to **neighbors** via **synapses**. No global attention lookup; attention-like behavior *emerges* from local interactions.
- **Memory = the synapses.** Hebbian rule: co-firing strengthens a connection ("fire together, wire together"); inactivity weakens it. Synapse-strength matrix = **a fixed-size state** — our notebook story in brain form.
- Empirical (from the paper): individual synapses strengthen when a specific concept is processed; activations are sparse and positive; demonstrated monosemanticity; rivals GPT-2 at equal params (10M–1B); graph has high modularity + heavy-tailed degree distribution (scale-free, like biological brains).
- 5-step cycle (Pathway research page): Encoding → Local firing → Integration → **Synaptic memory** → Decoding.
- **BDH-CQ [C12]** (Pathway report, Aug 2026): reasoning *inside the state* (recurrent latent reasoning) instead of emitting chain-of-thought tokens; demonstrations at inference update memory. Pathway reports: 150M params, 29.5% pass@2 ARC-AGI-1 at $0.0007/task, independently black-box reproduced per their report. Sudoku Extreme 97.4% (internal implementation — NOT the open-source repo [C13]). **Evidence discipline: vendor claims are labeled vendor claims.**

## 7. What our artifact teaches, scene by scene

1. **Cost scene:** tiny model reads a sentence in both modes; KV-cache bar grows per word vs notebook stays flat. ([C11], [CALC])
2. **Forgetting scene (copying):** model echoes your text; accuracy decays with length / small state. ([C8])
3. **Tradeoff scene (MQAR-lite):** learn pairs → quiz → dial state size → live Pareto curve. ([C9])
4. **BDH finale (3D constellation):** neuron graph reads a repeated concept; co-firing synapses visibly strengthen. Same equations as the Python core. ([C7])
5. **Family album strip:** RWKV · RetNet · Mamba · xLSTM · Jamba — 2–3 sentences each, same move, different handwriting. ([C1–C6])
6. **Limits panel:** Illusion of State + evidence labels. ([C10], [C12], [C13])

## 8. Key equations (we implement exactly these)

- Attention with cache: `S_t = { (K_1,V_1), ..., (K_t,V_t) }` — grows by 1 pair per token, per layer.
- Linear-attention notebook (our toy "fixed-state" model):
  `S_t = decay · S_{t-1} + φ(k_t)ᵀ v_t`  (S is fixed-size d×d; decay ∈ [0,1])
  recall: `answer ≈ S · φ(q)` — the nearest stored value by key-similarity.
- Interference intuition: `S` accumulates sums of outer products; overlapping keys blur stored values.
- Hebbian learning (BDH-style, simplified for our demo):
  `W ← W + η · (pre_activity ⊗ post_activity)` — exact form extracted from official `bdh.py` (MIT) on Day 5, cited then.

## 9. Study questions (the "explain it back" test)

Try answering aloud, in your own words. Answers below (no peeking).

1. Why does a Transformer's memory grow with text length, exactly?
2. What stays constant in a fixed-state model — and what's the price?
3. Why is forgetting *guaranteed* by the math, not just likely?
4. What did Mamba change about forgetting?
5. Name the two views of the same computation that Mamba-2/RetNet proved equivalent.
6. How does BDH store working memory, and which older learning rule is that?
7. What does BDH-CQ do differently from ChatGPT-style reasoning?
8. Your demo has four scenes — what concept does each teach?

### Answers
1. The KV cache stores one Key+Value pair per token per layer so attention can look back without recomputing; entries are never removed → memory grows linearly with context.
2. One fixed-size state, rewritten every token (O(1) memory, faster inference). The price: interference → old memories blur and fade; provable failures on copying/state-tracking.
3. Because the state is a *bounded sum* of key·value products: two memories with similar keys overlap in the same slots; past a capacity, adding information mathematically degrades stored information (shown empirically by [C8] and the state-size↔recall curve in [C9]).
4. Made the decay/forgetting *input-dependent* ("selective"): the model learns per-token how fast to fade, so important info persists and filler fades — forgetting becomes a learned feature. [C3]
5. Parallel attention form (training) and recurrent fixed-state form (inference) — proven equivalent via linear attention / structured state-space duality. [C2, C4]
6. In synapse strengths, updated by Hebbian plasticity — co-firing neurons strengthen their connection. [C7]
7. It iterates computation inside its recurrent latent state and only decodes answers — no emitted chain-of-thought tokens; demonstrations shown at inference update its memory. [C12]
8. (1) cost/growth, (2) forgetting, (3) the state-size tradeoff dial, (4) the brain's fixed-state memory (BDH). The family album = breadth; limits panel = honesty.

## 10. Words you can now use comfortably

token · vector/embedding · attention · Query/Key/Value · KV cache · recurrent state · linear attention · state space model · selective forgetting · interference · Pareto frontier · parallel vs recurrent form · spiking neuron · synapse · Hebbian learning · synaptic plasticity · monosemanticity · latent reasoning · chain-of-thought (and why BDH-CQ avoids it) · evidence level

---
*Written Day 0. Companion files: `NOTES.md` (research), `papers/citations.md` (sources).*
