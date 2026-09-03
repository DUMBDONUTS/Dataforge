/* Think Silently — toy computation runs live in-browser. No backend, no keys. */
'use strict';

// Seeded RNG (mulberry32) so the demo is reproducible: same seed, same curve.
function rng32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const gauss = (r) => (r() + r() + r() + r() - 2) * 1.2; // approx normal

/* ---------- Side A: scripted illustrative CoT trace ---------- */
const COT_STEPS = [
  'Read: 4 boxes, 6 apples each → total 4 × 6.',
  'Compute: 4 × 6 = 24 apples.',
  'Subtract sold: 24 − 10 = 14.',
  'Answer: 14 apples left.'
];
const countTokens = (s) => s.trim().split(/\s+/).length;

document.getElementById('cot-run').addEventListener('click', () => {
  const ol = document.getElementById('cot-steps');
  ol.innerHTML = '';
  let total = 0, i = 0;
  document.getElementById('cot-answer').textContent = '–';
  const tick = () => {
    if (i >= COT_STEPS.length) {
      document.getElementById('cot-answer').textContent = '14';
      return;
    }
    const li = document.createElement('li');
    li.textContent = COT_STEPS[i];
    li.className = 'done';
    ol.appendChild(li);
    total += countTokens(COT_STEPS[i]);
    document.getElementById('cot-tokens').textContent = total;
    i++;
    setTimeout(tick, 450);
  };
  document.getElementById('cot-tokens').textContent = '0';
  tick();
});

/* ---------- Side B: live toy latent refiner ---------- */
const DIM = 8;
function runTrial(rand, effort) {
  // Hidden target + fixed-size state; contraction 0.55 < 1 shrinks expected error.
  const target = Array.from({ length: DIM }, () => gauss(rand));
  const n = Math.hypot(...target) || 1;
  const tgt = target.map((v) => v / n);
  let h = Array.from({ length: DIM }, () => gauss(rand) * 0.5);
  const err = (v) => Math.hypot(...v.map((x, k) => x - tgt[k]));
  const traj = [err(h)];
  for (let t = 0; t < effort; t++) {
    h = h.map((x, k) => 0.55 * x + 0.45 * tgt[k] + gauss(rand) * 0.05);
    traj.push(err(h));
  }
  return { solved: traj[traj.length - 1] < 0.35, traj };
}

const eff = document.getElementById('effort');
const effval = document.getElementById('effval');
eff.addEventListener('input', () => { effval.textContent = eff.value; });

function draw(traj) {
  const c = document.getElementById('plot');
  const x = c.getContext('2d');
  x.clearRect(0, 0, c.width, c.height);
  const max = Math.max(...traj, 0.01);
  x.strokeStyle = '#0e7490'; x.lineWidth = 3; x.beginPath();
  traj.forEach((v, i) => {
    const px = 40 + (i * (c.width - 80)) / (traj.length - 1);
    const py = c.height - 30 - (v / max) * (c.height - 70);
    i ? x.lineTo(px, py) : x.moveTo(px, py);
  });
  x.stroke();
  x.fillStyle = '#333'; x.font = '14px system-ui';
  x.fillText('error ↓ as silent passes ↑  (reasoning tokens: 0)', 40, 22);
}

function runLatent() {
  const effort = parseInt(eff.value, 10);
  const rand = rng32(42);
  const TRIALS = 300;
  let solved = 0, first = null;
  for (let i = 0; i < TRIALS; i++) {
    const r = runTrial(rand, effort);
    solved += r.solved ? 1 : 0;
    if (i === 0) first = r.traj;
  }
  document.getElementById('lat-acc').textContent = ((solved / TRIALS) * 100).toFixed(1) + '%';
  document.getElementById('lat-tok').textContent = '0';
  document.getElementById('traj').textContent =
    'Example error per pass: ' + first.map((v) => v.toFixed(3)).join(' → ');
  draw(first);
}
document.getElementById('latent-run').addEventListener('click', runLatent);

/* ---------- Evidence panel (precomputed, labeled) ---------- */
fetch('data/evidence.json')
  .then((r) => r.json())
  .then((j) => {
    const el = document.getElementById('evidence');
    el.innerHTML =
      '<p><b>BDH-CQ (vendor-reported):</b> ' + j.bdh_cq.params + ' model, ' +
      j.bdh_cq.task + ' → <b>' + j.bdh_cq.accuracy + '</b> at <b>' + j.bdh_cq.cost_per_task +
      '</b>/task. Comparison: ' + j.bdh_cq.comparison + '. Mechanism: ' + j.bdh_cq.mechanism +
      '. <a href="' + j.bdh_cq.source + '">Source</a></p>' +
      '<p><b>Coconut (Hao et al. 2024):</b> ' + j.coconut.finding + '</p>' +
      '<p><b>CoT origin (Wei et al. 2022):</b> ' + j.cot.finding + '</p>' +
      '<p class="honest">Evidence level: ' + j.evidence_level + '</p>';
  })
  .catch(() => {
    document.getElementById('evidence').textContent =
      'Evidence file failed to load — check data/evidence.json.';
  });

// Catchy rule: page opens with the toy already run.
runLatent();
