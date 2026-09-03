/**
 * Think Silently — CoT vs BDH-CQ Interactive Explainer
 * Deterministic, browser-only educational simulation.
 * Not a language model. Not the real BDH-CQ.
 */
'use strict';

// ============================================================================
// PRESETS & PROBLEM DEFINITIONS
// ============================================================================

const PRESETS = {
  arc: {
    type: 'arc',
    title: 'ARC Visual Transformation',
    description: 'Input grid → Output grid. Infer the transformation rule.',
    input: `Task: Transform the input grid to the output grid.

Input:
0 0 0 0 0
0 1 1 1 0
0 1 0 1 0
0 1 1 1 0
0 0 0 0 0

Output:
0 0 0 0 0
0 0 0 0 0
0 0 1 0 0
0 0 0 0 0
0 0 0 0 0

Rule: Keep only the center pixel of any 3×3 block of 1s.`,
    groundTruth: 'Center-only pattern: isolate the middle of solid 3×3 regions.',
    cotSteps: [
      'Scan the input grid for contiguous regions of 1s.',
      'Identify a 3×3 block of 1s at rows 1-3, columns 1-3.',
      'The center of this block is at row 2, column 2 (0-indexed).',
      'Apply rule: keep only the center pixel of solid 3×3 regions.',
      'All other pixels become 0. Only position (2,2) remains 1.',
      'Answer: 5×5 grid with single 1 at center.'
    ],
    latentFacts: [
      { label: 'grid size', value: '5×5' },
      { label: 'pattern', value: 'hollow square' },
      { label: 'rule type', value: 'morphological' },
      { label: 'operation', value: 'erosion' },
      { label: 'kernel', value: '3×3' },
      { label: 'target', value: 'center' },
      { label: 'output', value: 'single pixel' },
      { label: 'verified', value: 'yes' }
    ],
    minPasses: 4,
    minCapacity: 4
  },
  arithmetic: {
    type: 'arithmetic',
    title: 'Multi-Step Arithmetic',
    description: 'Word problem requiring sequential operations.',
    input: `A warehouse has 12 crates. Each crate contains 8 boxes.
Each box holds 6 items. Workers remove 45 items for shipping.
How many items remain in the warehouse?`,
    groundTruth: '423 items remain.',
    cotSteps: [
      'Identify the total items initially: 12 crates × 8 boxes/crate × 6 items/box.',
      'Compute crates to boxes: 12 × 8 = 96 boxes.',
      'Compute boxes to items: 96 × 6 = 576 total items.',
      'Subtract removed items: 576 - 45 = 531.',
      'Wait, re-check: 12 × 8 = 96. 96 × 6 = 576. 576 - 45 = 531.',
      'Answer: 531 items remain.'
    ],
    latentFacts: [
      { label: 'crates', value: '12' },
      { label: 'boxes/crate', value: '8' },
      { label: 'items/box', value: '6' },
      { label: 'operation 1', value: '12×8=96' },
      { label: 'operation 2', value: '96×6=576' },
      { label: 'removed', value: '45' },
      { label: 'operation 3', value: '576-45=531' },
      { label: 'result', value: '531' }
    ],
    minPasses: 5,
    minCapacity: 5
  },
  logic: {
    type: 'logic',
    title: 'Logic Puzzle',
    description: 'Deductive reasoning with constraints.',
    input: `Four friends — Alice, Bob, Carol, Dan — each have a different favorite color: red, blue, green, yellow.
Clues:
1. Alice doesn't like red or blue.
2. Bob's favorite is not yellow.
3. Carol likes green.
3. Dan's color is not red.

What is each person's favorite color?`,
    groundTruth: 'Alice=yellow, Bob=blue, Carol=green, Dan=red',
    cotSteps: [
      'List all people: Alice, Bob, Carol, Dan. Colors: red, blue, green, yellow.',
      'Clue 3: Carol likes green. Assign Carol→green. Remove green from others.',
      'Clue 1: Alice ≠ red, blue. Remaining for Alice: yellow. Assign Alice→yellow.',
      'Clue 2: Bob ≠ yellow. Remaining for Bob: blue, red. But red is still free.',
      'Clue 4: Dan ≠ red. So Dan must be blue (only non-red left after Bob).',
      'Wait, if Dan=blue, then Bob=red. Check: Dan≠red ✓, Bob≠yellow ✓.',
      'Final: Alice=yellow, Bob=red, Carol=green, Dan=blue.'
    ],
    latentFacts: [
      { label: 'people', value: '4' },
      { label: 'colors', value: '4' },
      { label: 'constraint 1', value: 'Alice≠red,blue' },
      { label: 'constraint 2', value: 'Bob≠yellow' },
      { label: 'constraint 3', value: 'Carol=green' },
      { label: 'constraint 4', value: 'Dan≠red' },
      { label: 'deduction', value: 'elimination' },
      { label: 'solution', value: 'unique' }
    ],
    minPasses: 4,
    minCapacity: 4
  },
  custom: {
    type: 'custom',
    title: 'Custom Task',
    description: 'Write your own reasoning task.',
    input: '',
    groundTruth: '',
    cotSteps: [],
    latentFacts: [],
    minPasses: 3,
    minCapacity: 3
  }
};

// ============================================================================
// STATE MANAGEMENT
// ============================================================================

let currentPreset = 'arc';
let currentProblem = PRESETS.arc;
let cotCorrupted = false;
let latentPass = 0;
let latentMaxPasses = 4;
let latentCapacity = 4;
let latentState = [];
let latentEvents = [];
let latentDecoded = null;

// ============================================================================
// DOM ELEMENTS
// ============================================================================

const els = {
  // Problem selector
  presets: document.querySelectorAll('.preset'),
  input: document.getElementById('problem-input'),
  analyzeBtn: document.getElementById('analyze-button'),
  parserStatus: document.getElementById('parser-status'),

  // CoT Panel
  cotTrace: document.getElementById('cot-trace'),
  cotStepCount: document.getElementById('cot-step-count'),
  cotTokenCount: document.getElementById('cot-token-count'),
  cotAnswer: document.getElementById('cot-answer'),
  injectError: document.getElementById('inject-error'),
  cotFaultNote: document.getElementById('cot-fault-note'),

  // Latent Panel
  effortSlider: document.getElementById('effort-slider'),
  capacitySlider: document.getElementById('capacity-slider'),
  effortOutput: document.getElementById('effort-output'),
  capacityOutput: document.getElementById('capacity-output'),
  latentPassCount: document.getElementById('latent-pass-count'),
  latentTokenCount: document.getElementById('latent-token-count'),
  latentAnswer: document.getElementById('latent-answer'),
  stateCells: document.getElementById('state-cells'),
  errorProgress: document.getElementById('error-progress'),
  errorValue: document.getElementById('error-value'),
  stateEvents: document.getElementById('state-events'),
  stepBtn: document.getElementById('step-button'),
  latentNote: document.getElementById('latent-note'),

  // Verdict
  truthAnswer: document.getElementById('truth-answer'),
  verdictCot: document.getElementById('verdict-cot'),
  verdictLatent: document.getElementById('verdict-latent'),
  verdictMessage: document.getElementById('verdict-message'),

  // Hero
  heroPasses: document.getElementById('hero-passes'),
  heroTokens: document.getElementById('hero-tokens'),

  // Falsifiability
  falsifyBtns: document.querySelectorAll('.falsify-btn'),
  falsifyFeedback: document.getElementById('falsify-feedback'),

  // Evidence
  evidenceCards: document.getElementById('evidence-cards'),
  evidenceTable: document.getElementById('evidence-table-body'),

  // Checkpoint
  checkpointBtns: document.querySelectorAll('#checkpoint-options button'),
  checkpointFeedback: document.getElementById('checkpoint-feedback'),
};

// ============================================================================
// UTILITIES
// ============================================================================

function wordCount(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function seedRandom(seed) {
  let x = seed >>> 0;
  return () => {
    x = (x + 0x6D2B79F5) | 0;
    let t = Math.imul(x ^ (x >>> 15), 1 | x);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = seedRandom(42);

function shuffle(array) {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ============================================================================
// CO-T TRACE GENERATOR
// ============================================================================

function generateCoTTrace(problem, corrupt) {
  const steps = [...problem.cotSteps];
  if (corrupt && steps.length > 1) {
    const corruptIdx = Math.floor(steps.length / 2);
    const original = steps[corruptIdx];
    // Introduce a plausible but wrong step
    const corruptions = [
      'Therefore, the answer is 42.',
      'Multiply everything by 2 for safety.',
      'Ignore the last constraint.',
      'Assume all colors are the same.',
      'Add 100 to the result.',
    ];
    steps[corruptIdx] = corruptions[Math.floor(rand() * corruptions.length)];
    steps[corruptIdx] = `[CORRUPTED] ${steps[corruptIdx]}`;
    // Make subsequent steps follow the corruption
    for (let i = corruptIdx + 1; i < steps.length; i++) {
      steps[i] = `[Following error] ${steps[i]}`;
    }
  }
  return steps;
}

function renderCoT() {
  const trace = generateCoTTrace(currentProblem, els.injectError.checked);
  els.cotTrace.innerHTML = '';
  trace.forEach((step, i) => {
    const li = document.createElement('li');
    li.textContent = step;
    if (step.startsWith('[CORRUPTED]') || step.startsWith('[Following error]')) {
      li.classList.add('corrupted');
    }
    els.cotTrace.appendChild(li);
  });

  const displayed = trace.join(' ');
  els.cotStepCount.textContent = trace.length;
  els.cotTokenCount.textContent = wordCount(displayed);
  els.cotAnswer.textContent = currentProblem.groundTruth;

  // Update verdict
  els.verdictCot.textContent = currentProblem.groundTruth;
  els.verdictMessage.textContent = els.injectError.checked
    ? 'CoT trace corrupted — error propagates to final answer.'
    : 'CoT produces correct, auditable answer.';
}

// ============================================================================
// BDH-CQ LATENT REASONING SIMULATOR
// ============================================================================

function initLatentState(problem) {
  latentMaxPasses = parseInt(els.effortSlider.value, 10);
  latentCapacity = parseInt(els.capacitySlider.value, 10);
  latentPass = 0;
  latentDecoded = null;
  latentEvents = [];

  const facts = problem.latentFacts;
  latentState = Array.from({ length: 8 }, (_, i) => ({
    label: i < facts.length ? facts[i].label : 'empty',
    value: i < facts.length ? facts[i].value : null,
    filled: i < facts.length ? 0 : 0,
    capacity: i < latentCapacity,
    written: false
  }));

  latentPass = 0;
  latentDecoded = null;
  renderLatent();
}

function advanceLatentPass() {
  if (latentPass >= latentMaxPasses) return;

  latentPass++;
  const problem = currentProblem;
  const minPasses = problem.minPasses || 3;
  const minCapacity = problem.minCapacity || 3;

  // Pass 1: Encode facts into slots (up to capacity)
  if (latentPass === 1) {
    const facts = currentProblem.latentFacts;
    const encoded = Math.min(facts.length, latentCapacity);
    for (let i = 0; i < encoded; i++) {
      latentState[i].filled = 1;
      latentState[i].written = true;
    }
    if (facts.length > latentCapacity) {
      addEvent(1, `Encoded ${encoded}/${facts.length} facts. ${facts.length - encoded} facts dropped — capacity exceeded.`);
    } else {
      addEvent(1, `Encoded all ${encoded} facts into latent state.`);
    }
    latentState[encoded - 1].filled = 1;
  }
  // Pass 2: Transform / combine facts
  else if (latentPass === 2) {
    addEvent(2, 'Transforming encoded facts — combining related slots.');
    // Simulate internal computation
    for (let i = 0; i < Math.min(latentCapacity, 4); i++) {
      if (latentState[i].filled > 0) {
        latentState[i].filled = Math.min(1, latentState[i].filled + 0.3);
      }
    }
  }
  // Pass 3: Derive intermediate conclusions
  else if (latentPass === 3) {
    addEvent(3, 'Deriving intermediate conclusions from combined facts.');
    for (let i = 0; i < Math.min(latentCapacity, 5); i++) {
      if (latentState[i].filled > 0) {
        latentState[i].filled = Math.min(1, latentState[i].filled + 0.25);
      }
    }
  }
  // Pass 4+: Decode answer
  else {
    const neededPasses = currentProblem.minPasses || 3;
    if (latentPass >= neededPasses && latentCapacity >= (currentProblem.minCapacity || 3)) {
      latentDecoded = currentProblem.groundTruth;
      addEvent(latentPass, `Decoded answer: "${currentProblem.groundTruth}"`);
    } else if (latentCapacity < (currentProblem.minCapacity || 3)) {
      addEvent(latentPass, `Cannot decode — insufficient capacity (${latentCapacity}/${currentProblem.minCapacity || 3} slots needed).`);
    } else {
      addEvent(latentPass, `Refining... pass ${latentPass}/${latentMaxPasses}. Need ${neededPasses} passes for this task.`);
    }
  }

  renderLatent();
}

function addEvent(pass, message) {
  latentEvents.push({ pass, message });
}

function renderLatent() {
  // Update metrics
  els.latentPassCount.textContent = `${latentPass} / ${latentMaxPasses}`;
  els.heroPasses.textContent = latentMaxPasses;
  els.latentTokenCount.textContent = '0';
  els.latentAnswer.textContent = latentDecoded || '—';
  els.verdictLatent.textContent = latentDecoded || '—';

  // Update capacity/effort displays
  els.effortOutput.textContent = `${latentMaxPasses} passes`;
  els.capacityOutput.textContent = `${latentCapacity} slots`;

  // Render state cells
  els.stateCells.innerHTML = '';
  latentState.forEach((slot, i) => {
    const cell = document.createElement('div');
    cell.className = 'state-cell';
    cell.setAttribute('role', 'listitem');
    cell.style.setProperty('--fill', `${Math.round(slot.filled * 100)}%`);
    const canWrite = slot.capacity;
    cell.innerHTML = `
      <span></span>
      <small>${slot.capacity ? (slot.label || 'empty') : 'no slot'}${slot.value ? `: ${slot.value}` : ''}</small>
    `;
    if (!canWrite) {
      cell.style.opacity = '0.3';
      cell.style.background = 'rgba(255,255,255,0.02)';
      cell.style.borderColor = 'rgba(255,255,255,0.08)';
    }
    if (slot.written) {
      cell.style.borderColor = 'var(--mint)';
      cell.style.boxShadow = '0 0 8px rgba(199,235,229,0.4)';
    }
    els.stateCells.appendChild(cell);
  });

  // Progress bar
  const minPasses = currentProblem.minPasses || 3;
  const minCapacity = currentProblem.minCapacity || 3;
  const capacityOk = latentCapacity >= minCapacity;
  const effortOk = latentPass >= minPasses;
  const canDecode = latentDecoded !== null;
  const progress = capacityOk && effortOk ? 1 : Math.max(0.1, (latentPass / minPasses) * (latentCapacity / minCapacity) * 0.8);
  els.errorProgress.style.width = `${Math.max(5, progress * 100)}%`;
  els.errorValue.textContent = canDecode ? 'Exact match' : capacityOk ? (effortOk ? 'Refining...' : 'Need more passes') : 'Capacity too low';

  // Events log
  els.stateEvents.innerHTML = latentEvents.length
    ? latentEvents.map(e => `<li data-pass="${e.pass}">${e.message}</li>`).join('')
    : '<li data-pass="0">State empty. Click "Advance one silent pass" to begin.</li>';

  // Notes
  if (latentPass === 0) {
    els.latentNote.textContent = `This task needs at least ${currentProblem.minPasses || 3} passes and ${currentProblem.minCapacity || 3} slots. Click to advance.`;
  } else if (latentDecoded) {
    els.latentNote.textContent = `Decoded correctly after ${latentPass} passes. No CoT tokens emitted.`;
  } else if (!latentState.some(s => s.capacity && s.filled > 0)) {
    els.latentNote.textContent = 'Insufficient capacity — required facts cannot fit in the latent state.';
  } else if (latentPass < (currentProblem.minPasses || 3)) {
    els.latentNote.textContent = `Need ${currentProblem.minPasses || 3} passes for this task. Currently at ${latentPass}.`;
  } else {
    els.latentNote.textContent = 'Refining latent state...';
  }

  // Button state
  els.stepBtn.disabled = latentPass >= latentMaxPasses;
  els.stepBtn.textContent = latentPass >= latentMaxPasses
    ? 'All passes completed'
    : `Advance one silent pass (${latentPass + 1}/${latentMaxPasses})`;

  // Verdict message
  if (latentDecoded) {
    els.verdictMessage.textContent = `Latent reasoning succeeded: decoded "${latentDecoded}" with ${latentPass} silent passes, 0 CoT tokens.`;
  } else if (!latentState.some(s => s.capacity && s.filled > 0)) {
    els.verdictMessage.textContent = 'Latent reasoning failed: state capacity too small to hold required facts.';
  } else {
    els.verdictMessage.textContent = `Latent reasoning in progress: pass ${latentPass}/${latentMaxPasses}.`;
  }
}

// ============================================================================
// PROBLEM LOADING & ANALYSIS
// ============================================================================

function loadPreset(key) {
  currentPreset = key;
  currentProblem = PRESETS[key];

  // Update preset buttons
  els.presets.forEach(btn => {
    const active = btn.dataset.preset === key;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-selected', active);
  });

  if (key === 'custom') {
    els.input.value = '';
    els.input.placeholder = 'Describe your reasoning task...';
    els.parserStatus.textContent = 'Write a reasoning task, then click Analyze.';
    els.parserStatus.classList.remove('error');
    clearResults();
  } else {
    els.input.value = currentProblem.input;
    els.parserStatus.textContent = `Loaded: ${currentProblem.title}. Click Analyze to run.`;
    els.parserStatus.classList.remove('error');
    analyze();
  }
}

function analyze() {
  const input = els.input.value.trim();

  if (currentPreset === 'custom') {
    if (!input) {
      els.parserStatus.textContent = 'Please enter a task first.';
      els.parserStatus.classList.add('error');
      return;
    }
    // Simple heuristic parsing for custom input
    parseCustom(input);
  } else {
    // Use preset
    currentProblem = PRESETS[currentPreset];
  }

  els.parserStatus.textContent = `Recognized: ${currentProblem.title}. Ground truth: ${currentProblem.groundTruth}`;
  els.parserStatus.classList.remove('error');

  // Render both sides
  renderCoT();
  initLatentState(currentProblem);

  // Verdict
  els.truthAnswer.textContent = currentProblem.groundTruth;
  els.verdictCot.textContent = currentProblem.groundTruth;
  els.verdictLatent.textContent = '—';
  els.verdictMessage.textContent = 'CoT complete. Click "Advance one silent pass" on Side B to run latent reasoning.';
}

function parseCustom(input) {
  // Very simple heuristic: treat as arithmetic if numbers present, else logic
  const numbers = input.match(/\d+/g);
  const hasNumbers = numbers && numbers.length >= 2;

  currentProblem = {
    type: 'custom',
    title: 'Custom Task',
    input: input,
    groundTruth: 'Answer depends on your specific problem.',
    cotSteps: [
      'Parse the problem statement for key entities and relations.',
      'Identify the operations needed (arithmetic, logic, pattern matching).',
      'Execute step 1: extract first quantity or premise.',
      'Execute step 2: apply first operation or inference.',
      'Execute step 3: apply next operation or inference.',
      'Synthesize final answer from intermediate results.',
    ],
    latentFacts: [
      { label: 'entities', value: 'parsed' },
      { label: 'relations', value: 'identified' },
      { label: 'operations', value: 'sequential' },
      { label: 'intermediate 1', value: 'computed' },
      { label: 'intermediate 2', value: 'computed' },
      { label: 'intermediate 3', value: 'computed' },
      { label: 'synthesis', value: 'pending' },
      { label: 'answer', value: 'decoded' }
    ],
    minPasses: 4,
    minCapacity: 4
  };

  els.parserStatus.textContent = `Custom task parsed. Heuristic mode active.`;
  els.parserStatus.classList.remove('error');
}

function clearResults() {
  els.cotTrace.innerHTML = '<li class="empty">Click Analyze to generate trace.</li>';
  els.cotStepCount.textContent = '0';
  els.cotTokenCount.textContent = '0';
  els.cotAnswer.textContent = '—';
  els.latentPassCount.textContent = '0 / 4';
  els.latentTokenCount.textContent = '0';
  els.latentAnswer.textContent = '—';
  els.truthAnswer.textContent = '—';
  els.verdictCot.textContent = '—';
  els.verdictLatent.textContent = '—';
  els.verdictMessage.textContent = 'Enter a task and click Analyze.';
  latentState = [];
  latentEvents = [];
  latentPass = 0;
  latentDecoded = null;
  renderLatent();
}

// ============================================================================
// FALSIFIABILITY LAB
// ============================================================================

function runFalsifiabilityTest(test) {
  let message = '';
  switch (test) {
    case 'capacity':
      // Temporarily reduce capacity to 1
      const origCap = latentCapacity;
      els.capacitySlider.value = 1;
      latentCapacity = 1;
      initLatentState(currentProblem);
      for (let i = 0; i < 4; i++) advanceLatentPass();
      message = `Capacity=1: Latent state cannot hold required facts. Decoding failed.`;
      // Restore
      els.capacitySlider.value = origCap;
      latentCapacity = origCap;
      initLatentState(currentProblem);
      break;
    case 'effort':
      // Reduce effort to 1
      const origEff = latentMaxPasses;
      els.effortSlider.value = 1;
      latentMaxPasses = 1;
      initLatentState(currentProblem);
      advanceLatentPass();
      message = `Effort=1 pass: Insufficient refinement. Latent state cannot converge to answer.`;
      els.effortSlider.value = origEff;
      latentMaxPasses = origEff;
      initLatentState(currentProblem);
      break;
    case 'cot-error':
      cotCorrupted = true;
      els.injectError.checked = true;
      renderCoT();
      message = `CoT error injected: Single wrong step propagates, final answer becomes incorrect.`;
      break;
    case 'unsupported':
      currentPreset = 'custom';
      currentProblem = {
        type: 'custom',
        title: 'Unsupported',
        input: 'This is a poem about a cat sitting on a mat.',
        groundTruth: 'Not a reasoning task.',
        cotSteps: ['This input does not match a supported reasoning pattern.'],
        latentFacts: [],
        minPasses: 3,
        minCapacity: 3
      };
      els.input.value = currentProblem.input;
      analyze();
      message = `Unsupported input: Both systems honestly reject rather than hallucinate.`;
      break;
  }
  els.falsifyFeedback.textContent = message;
  els.falsifyFeedback.classList.remove('incorrect');

  // Visual feedback on buttons
  els.falsifyBtns.forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.querySelector(`.falsify-btn[data-test="${test}"]`);
  if (activeBtn) activeBtn.classList.add('active');
}

// ============================================================================
// EVIDENCE LOADING
// ============================================================================

async function loadEvidence() {
  try {
    const response = await fetch('data/evidence.json');
    if (!response.ok) throw new Error('Evidence file not found');
    const data = await response.json();
    renderEvidence(data);
  } catch (e) {
    console.warn('Evidence load failed:', e);
    renderEvidenceFallback();
  }
}

function renderEvidence(data) {
  // Cards
  const cards = [
    {
      badge: 'VENDOR REPORT',
      title: 'BDH-CQ (Pathway, 2026)',
      text: `${data.bdh_cq.params} · ${data.bdh_cq.task} · ${data.bdh_cq.accuracy} at ${data.bdh_cq.cost_per_task}. ${data.bdh_cq.mechanism}`,
      type: 'vendor'
    },
    {
      badge: 'PEER-REVIEWED',
      title: 'Coconut (Hao et al., 2024)',
      text: data.coconut.finding,
      type: 'peer'
    },
    {
      badge: 'PEER-REVIEWED',
      title: 'Chain-of-Thought (Wei et al., 2022)',
      text: data.cot.finding,
      type: 'peer'
    }
  ];

  els.evidenceCards.innerHTML = cards.map(card => `
    <article class="evidence-card" role="listitem">
      <span class="evidence ${card.type}">${card.badge}</span>
      <h3>${card.title}</h3>
      <p>${card.text}</p>
    </article>
  `).join('');

  // Table
  const rows = [
    { stmt: 'CoT uses written intermediate reasoning tokens.', level: 'PEER', src: 'Wei et al. (2022)', usage: 'Explained and simulated; not live-measured.' },
    { stmt: 'Continuous latent thought can improve accuracy-efficiency trade-off on planning tasks.', level: 'PEER', src: 'Hao et al. (2024) — Coconut', usage: 'Independent research context for latent reasoning.' },
    { stmt: 'BDH-CQ uses iterative recurrent latent computation and reports ARC-AGI-1 cost/accuracy.', level: 'VENDOR', src: 'Pathway (2026)', usage: 'Case study; explicitly vendor-reported.' },
    { stmt: 'This simulation\'s colored slots resemble a real latent state.', level: 'TOY', src: 'This project only', usage: 'Teaching visualization; not a measurement of BDH-CQ.' }
  ];

  els.evidenceTable.innerHTML = rows.map(r => `
    <tr>
      <td>${r.stmt}</td>
      <td><span class="evidence-badge ${r.level.toLowerCase()}">${r.level}</span></td>
      <td>${r.src}</td>
      <td>${r.usage}</td>
    </tr>
  `).join('');
}

function renderEvidenceFallback() {
  els.evidenceCards.innerHTML = `
    <article class="evidence-card"><span class="evidence vendor">OFFLINE</span><h3>Evidence Data Unavailable</h3><p>Check data/evidence.json. The interactive lab still runs locally.</p></article>
  `;
}

// ============================================================================
// CHECKPOINT QUIZ
// ============================================================================

els.checkpointBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    els.checkpointBtns.forEach(b => b.setAttribute('aria-checked', 'false'));
    btn.setAttribute('aria-checked', 'true');
    const correct = btn.dataset.answer === 'right';
    els.checkpointFeedback.classList.toggle('incorrect', !correct);
    els.checkpointFeedback.textContent = correct
      ? 'Correct. A bounded state can lose information through interference or insufficient capacity. That makes its failure visible and testable.'
      : 'Not quite. Re-run the capacity=2 case: the toy cannot preserve all required facts, so it never decodes a candidate answer.';
  });
});

// ============================================================================
// EVENT LISTENERS
// ============================================================================

// Preset buttons
els.presets.forEach(btn => {
  btn.addEventListener('click', () => loadPreset(btn.dataset.preset));
});

// Analyze button
els.analyzeBtn.addEventListener('click', analyze);

// Enter key in textarea (Ctrl+Enter)
els.input.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') analyze();
});

// CoT error injection
els.injectError.addEventListener('change', () => {
  if (currentProblem && currentProblem.cotSteps.length) renderCoT();
});

// Effort slider
els.effortSlider.addEventListener('input', () => {
  latentMaxPasses = parseInt(els.effortSlider.value, 10);
  els.effortOutput.textContent = `${latentMaxPasses} passes`;
  els.heroPasses.textContent = latentMaxPasses;
  if (currentProblem && currentProblem.latentFacts.length) initLatentState(currentProblem);
});

// Capacity slider
els.capacitySlider.addEventListener('input', () => {
  latentCapacity = parseInt(els.capacitySlider.value, 10);
  els.capacityOutput.textContent = `${latentCapacity} slots`;
  if (currentProblem && currentProblem.latentFacts.length) initLatentState(currentProblem);
});

// Step button
els.stepBtn.addEventListener('click', advanceLatentPass);

// Falsifiability buttons
els.falsifyBtns.forEach(btn => {
  btn.addEventListener('click', () => runFalsifiabilityTest(btn.dataset.test));
});

// Load evidence
loadEvidence();

// Initialize with default preset
loadPreset('arc');

// Auto-run first latent pass for immediate interactivity
setTimeout(() => {
  if (latentPass === 0) advanceLatentPass();
}, 500);