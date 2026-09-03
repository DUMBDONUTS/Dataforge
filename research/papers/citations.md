# CITATION RECORD — The Fixed-Memory Machine

> **What is this file?** The numbered source list used by the artifact, README, and blog.
> Rule from the problem statement: ≥3 recent primary papers (2022–2026) that use, extend,
> test, or rely on the selected concept, cited beside technical claims. We exceed this with
> 9 in-window primary papers + 2 vendor technical reports + 2 background sources.
> All links below were fetched and verified on Day 0 (Sep 1, 2026).

## Evidence levels (how we label claims)
- **[PEER]** peer-reviewed venue or widely-cited arXiv primary paper — statements taken from abstract/paper body
- **[VENDOR]** company technical report/blog — statement attributed explicitly to the vendor; flagged where independently validated
- **[CALC]** our own calculation from published model config (labeled as ours wherever used)

---

## In-window primary papers (2022–2026) — the required set

**[C1] RWKV: Reinventing RNNs for the Transformer Era** — Peng et al., EMNLP 2023 (arXiv May 2023).
https://arxiv.org/abs/2305.13048
Claims we cite: linear attention enabling dual Transformer/RNN formulation; constant compute+memory at inference; scaled to 14B params.
Evidence level: [PEER]. License of paper: arXiv (author page); code: Apache-2.0 (RWKV repo — verify before reuse).

**[C2] Retentive Network: A Successor to Transformer for Large Language Models** — Sun et al., 2023 (Microsoft).
https://arxiv.org/abs/2307.08621
Claims: retention with parallel/recurrent/chunkwise paradigms; O(1) inference memory; derived recurrence↔attention connection.
Evidence level: [PEER] (arXiv primary; ICLR 2024 version exists — cite the arXiv v4).

**[C3] Mamba: Linear-Time Sequence Modeling with Selective State Spaces** — Gu & Dao, 2023 (v2 May 2024).
https://arxiv.org/abs/2312.00752
Claims: input-dependent selection ("selectively propagate or forget"); 5× throughput; linear scaling to million-length sequences; Mamba-3B > same-size Transformers, ≈ 2× size.
Evidence level: [PEER] (COLM 2024). Code: Apache-2.0 (state-spaces/mamba — verify before reuse).

**[C4] Transformers are SSMs: Generalized Models and Efficient Algorithms Through Structured State Space Duality** — Dao & Gu, ICML 2024.
https://arxiv.org/abs/2405.21060
Claims: SSMs and attention variants connected via structured semiseparable matrices; Mamba-2 layer 2–8× faster than Mamba-1's selective SSM.
Evidence level: [PEER] (ICML 2024).

**[C5] xLSTM: Extended Long Short-Term Memory** — Beck, Pöppel, Spanring, Auer, Prudnikova, Kopp, Klambauer, Brandstetter, Hochreiter, 2024.
https://arxiv.org/abs/2405.04517
Claims: exponential gating with normalization/stabilization; sLSTM (scalar memory) and mLSTM (matrix memory, covariance update, parallelizable); favorable vs Transformers/SSMs in performance and scaling.
Evidence level: [PEER]. Code: github.com/NX-AI/xlstm (check license before reuse).

**[C6] Jamba: A Hybrid Transformer-Mamba Language Model** — Lieber et al. (AI21 Labs), 2024.
https://arxiv.org/abs/2403.19887
Claims: interleaved Transformer+Mamba blocks with MoE; fits single 80GB GPU; strong results to 256K-token context; small memory footprint vs vanilla Transformer; weights permissive.
Evidence level: [PEER] (arXiv primary). License note for weights: Apache-2.0 per AI21 announcements — verify at build time.

**[C7] The Dragon Hatchling: The Missing Link between the Transformer and Models of the Brain** — Kosowski, Uznański, Chorowski, Stamirowska, Bartoszkiewicz (Pathway), Sep 30, 2025.
https://arxiv.org/abs/2509.26507 | Code: https://github.com/pathwaycom/bdh (MIT)
Claims: scale-free network of locally-interacting spiking neuron particles; working memory entirely via synaptic plasticity (Hebbian); individual synapses strengthen on concept processing; sparse positive activations; demonstrated monosemanticity; high modularity + heavy-tailed degree distribution; Transformer-like scaling; rivals GPT-2 at 10M–1B params; "attention-based state space" formulation with GPU-friendly mode.
Evidence level: [PEER] (arXiv primary). Our BDH panel equations extracted from official `bdh.py` with MIT attribution.

**[C8] Repeat After Me: Transformers are Better than State Space Models at Copying** — Jelassi, Brandfonbrener, Kakade, Malach, 2024 (v2 Jun 2024).
https://arxiv.org/abs/2402.01032
Claims: 2-layer Transformer copies strings of exponential length; GSSMs "fundamentally limited by their fixed-size latent state"; pretrained Transformers dramatically outperform SSMs at copying/context retrieval.
Evidence level: [PEER] (ICML 2024). Basis of demo experiment #2 (copying).

**[C9] Simple linear attention language models balance the recall-throughput tradeoff** — Arora, Eyuboglu, Zhang, Timalsina, Alberti, Zinsley, Zou, Rudra, Ré (Hazy Research), 2024 (v2 Mar 2025).
https://arxiv.org/abs/2402.18668
Claims: key tradeoff between state size and recall; H3/Mamba/RWKV struggle at recall; BASED = linear + sliding-window attention; dialing window/feature dim traverses the Pareto frontier of recall-memory; 1.3B models; +6.22 accuracy points vs Mamba on recall-intensive tasks; 24× throughput vs FlashAttention-2 (1024 tokens, 1.3B).
Evidence level: [PEER]. Basis of demo experiment #3 (MQAR-lite + frontier plot). Code: github.com/HazyResearch/based.

**[C10] The Illusion of State in State-Space Models** — Merrill, Petty, Sabharwal, ICML 2024 (v3 Mar 2025).
https://arxiv.org/abs/2404.08819
Claims: SSM expressiveness limited like Transformers (outside TC⁰); cannot solve permutation composition / certain chess notation / code evaluation / entity tracking; "the 'state' in an SSM is an illusion"; Mamba struggles empirically on state tracking.
Evidence level: [PEER]. Basis of our limitations/misconception section.

**[C11] Efficient Memory Management for Large Language Model Serving with PagedAttention** — Kwon et al., SOSP 2023.
https://arxiv.org/abs/2309.06180
Claims: KV cache per request "is huge and grows and shrinks dynamically"; fragmentation/redundant duplication waste memory; PagedAttention (OS-paging-inspired) → near-zero waste; 2–4× throughput vs FasterTransformer/Orca.
Evidence level: [PEER]. Basis of "why care" cost motivation. Code: github.com/vllm-project/vllm (Apache-2.0).

## Vendor technical reports (BDH-CQ material — labeled as vendor claims)

**[C12] Reasoning at a fraction of the compute (BDH-CQ ARC-AGI-1 report)** — Pathway Team, Aug 11, 2026.
https://www.pathway.com/research/introducing-bdh-cq
Claims: 150M-param BDH-CQ; 29.5% pass@2 on public ARC-AGI-1 at $0.00070 computed inference cost/task; "no previously reported system reached the same accuracy at an equal or lower cost"; GPT Luna 5.6 (Low) 34.2% at ~11× cost; recurrent latent state computation; demonstrations at inference update memory; no chain-of-thought, no per-task retraining; independent black-box evaluation reproduced results (report linked from that page).
Evidence level: [VENDOR] — attribute to Pathway explicitly; note independent black-box reproduction claim. In blog/README, always phrase as "Pathway reports…"

**[C13] Post-transformers: Sudoku Bench (BDH Sudoku Extreme result)** — Pathway.
https://www.pathway.com/research/beyond-transformers-sudoku-bench
Claims: 97.4% top-1 on ~250,000 Sudoku Extreme puzzles without chain-of-thought or backtracking; leading reasoning LLMs ~0% (their cited comparison, arXiv 2506.21734).
Evidence level: [VENDOR] — with explicit caveat: result comes from Pathway's internal BDH implementation, NOT the open-source repo (stated in repo README). BABILong claim (95% @ 32K, 134M model) additionally marked by Pathway as "pending final contamination checks, independent validation, and leaderboard review" — carry that label if used.

**[C14] Chain-of-Thought Prompting Elicits Reasoning in Large Language Models** — Wei et al., 2022.
https://arxiv.org/abs/2201.11903
Claims: prompting with written intermediate reasoning steps improves complex arithmetic, commonsense and symbolic reasoning; a 540B model with eight CoT exemplars reached state of the art on GSM8K at publication.
Evidence level: [PEER] (NeurIPS 2022). Basis of the explainer's definition of written chain-of-thought.

**[C15] Training Large Language Models to Reason in a Continuous Latent Space** — Hao et al., 2024 (COLM 2025).
https://arxiv.org/abs/2412.06769
Claims: Coconut feeds the final hidden state back as the next input embedding rather than decoding it into words; continuous thoughts can retain multiple planning alternatives; paper reports a better accuracy-efficiency tradeoff than CoT on planning-heavy logical reasoning.
Evidence level: [PEER] (COLM 2025). Independent context for latent reasoning; it is not BDH-CQ.

## Background sources (outside 2022–2026 window; not counted toward the ≥3)

**[B1] Attention Is All You Need** — Vaswani et al., NeurIPS 2017.
https://arxiv.org/abs/1706.03762
Background for attention/KV-cache mechanism only.

**[B2] BDH podcast (learning resource)** — SuperDataScience, Adrian Kosowski w/ Jon Krohn (72 min).
https://www.youtube.com/watch?v=mfV44-mtg7c
Learning aid; not cited for technical claims.

---

## Claim → source mapping (used beside technical claims in artifact/blog)

| Claim in our artifact | Source(s) |
|---|---|
| KV cache grows one entry per token per layer → memory O(n) | [C11], [B1], + [CALC] GPT-2-small config example |
| Fixed-size state models exist and match Transformer quality at scale | [C1] RWKV 14B, [C3] Mamba-3B, [C5] xLSTM, [C6] Jamba 256K |
| Attention and SSM/recurrent forms are two views of one math | [C2] RetNet, [C4] SSD |
| Input-dependent forgetting is a feature (selectivity) | [C3] |
| Fixed-state models forget: fail copying/recall vs Transformers | [C8] (theory + LLM evals), [C9] (state-size↔recall Pareto) |
| State size ↔ recall is a dialable tradeoff | [C9] BASED |
| Fixed-state ≠ more expressive reasoning (TC⁰ limit) | [C10] |
| BDH: working memory = Hebbian synaptic plasticity; sparse positive activations; monosemanticity | [C7] |
| BDH-CQ: 29.5% ARC-AGI-1 @ $0.0007/task; latent reasoning, no CoT | [C12] (vendor, independently black-box evaluated per report) |
| BDH Sudoku 97.4% (internal impl., not OSS repo) | [C13] (vendor + repo README caveat) |
| CoT is written intermediate reasoning and improves complex reasoning at scale | [C14] |
| Latent/continuous reasoning can avoid decoding intermediate states into words | [C15] |

## License & provenance to-do (before submission)
- [ ] Confirm licenses of any code we adapt (bdh.py = MIT; RWKV repo; NX-AI xlstm; state-spaces/mamba; based)
- [ ] Record fonts/graphics/icons sources in LICENSES.md
- [ ] AI-assistance disclosure drafted (tool + scope, per problem statement rules)
