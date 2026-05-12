// ===== FLOWER KANTIN — MAIN APP =====
import { LEVELS, STATIONS, MENU } from './game/data.js';
import { GameEngine } from './game/engine.js';
import { renderTitleScreen, renderLevelSelect, renderGameScreen, renderResultScreen } from './ui.js';

const app = document.getElementById('app');

// ---- SAVE PROGRESS ----
function loadProgress() {
  try { return JSON.parse(localStorage.getItem('flowerKantinProgress') || '{}'); }
  catch { return {}; }
}
function saveProgress(levelId, result) {
  const p = loadProgress();
  const prev = p[levelId] || { stars: 0, score: 0 };
  p[levelId] = {
    passed: result.passed || prev.passed,
    stars: Math.max(result.stars, prev.stars),
    score: Math.max(result.score, prev.score),
  };
  localStorage.setItem('flowerKantinProgress', JSON.stringify(p));
}

// ---- SCREENS ----
let currentEngine = null;

function showTitle() {
  if (currentEngine) { currentEngine.destroy(); currentEngine = null; }
  renderTitleScreen(app, showLevelSelect);
}

function showLevelSelect() {
  const progress = loadProgress();
  renderLevelSelect(app, progress, showTitle, startLevel);
}

function startLevel(levelId) {
  const levelDef = LEVELS.find(l => l.id === levelId);
  if (!levelDef) return;

  // Build enriched level object with station defs filtered
  const level = {
    ...levelDef,
    stationDefs: Object.fromEntries(
      levelDef.stations.map(sid => [sid, STATIONS[sid]])
    ),
  };

  if (currentEngine) { currentEngine.destroy(); currentEngine = null; }

  let lastState = null;

  currentEngine = new GameEngine(level, (state) => {
    lastState = state;

    if (state.phase === 'ended') {
      const result = currentEngine.getResult();
      saveProgress(levelId, result);
      setTimeout(() => {
        renderResultScreen(
          app,
          result,
          level,
          () => startLevel(levelId),
          () => startLevel(levelId + 1),
          showLevelSelect
        );
      }, 800);
      return;
    }

    renderGameScreen(app, state, level, {
      pause: () => currentEngine?.pause(),
      resume: () => currentEngine?.resume(),
      quit: () => { currentEngine?.destroy(); currentEngine = null; showLevelSelect(); },
      selectCustomer: (uid) => currentEngine?.selectCustomer(uid),
      cookItem: (sid, itemId) => currentEngine?.cookItem(sid, itemId),
      collectItem: (sid, jobId) => currentEngine?.collectItem(sid, jobId),
      removeTrayItem: (id) => currentEngine?.removeTrayItem(id),
      clearTray: () => currentEngine?.clearTray(),
      serve: () => currentEngine?.serveCustomer(),
    });
  });

  currentEngine.start();
}

// ---- FLOAT SCORE EFFECT ----
window.addEventListener('floatscore', (e) => {
  const { val, type } = e.detail;
  const el = document.createElement('div');
  el.className = `float-score ${type}`;
  el.textContent = typeof val === 'number' ? (val > 0 ? `+${val}` : val) : val;
  el.style.top = `${120 + Math.random() * 60}px`;
  el.style.left = `${Math.random() * 60 + 20}%`;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1000);
});

// ---- COMBO EFFECT ----
window.addEventListener('comboshow', (e) => {
  const { combo } = e.detail;
  const el = document.createElement('div');
  el.className = 'combo-banner';
  el.textContent = `🔥 COMBO x${combo}!`;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 800);
});

// ---- START ----
showTitle();
