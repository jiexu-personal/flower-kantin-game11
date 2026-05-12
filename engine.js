// ===== FLOWER KANTIN UI RENDERER =====
import { MENU, STATIONS, LEVELS } from './game/data.js';

export function renderTitleScreen(app, onPlay) {
  app.innerHTML = `
    <div class="screen-title">
      <div class="title-deco">🌸</div>
      <div class="title-logo">Flower Kantin</div>
      <div class="title-sub">Malaysian Food Game</div>
      <button class="btn-start" id="btn-start">🍽️ Start Cooking!</button>
      <div class="title-features">
        <div class="feat-badge">⏱️ Time Pressure</div>
        <div class="feat-badge">🍜 Real Recipes</div>
        <div class="feat-badge">⭐ 5 Levels</div>
        <div class="feat-badge">🔥 Combos</div>
      </div>
    </div>
  `;
  app.querySelector('#btn-start').onclick = onPlay;
}

export function renderLevelSelect(app, progress, onBack, onSelect) {
  const cards = LEVELS.map(lv => {
    const isLocked = lv.id > 1 && !(progress[lv.id - 1]?.passed);
    const comp = progress[lv.id];
    const stars = comp?.stars ?? 0;
    const starStr = '⭐'.repeat(stars) + '☆'.repeat(3 - stars);
    const diffColor = { easy: '#52B788', medium: '#FFB627', hard: '#E63946' }[lv.difficulty];
    return `
      <div class="level-card ${isLocked ? 'locked' : ''} ${comp?.passed ? 'completed' : ''}"
           style="--stripe: ${lv.stripe}"
           data-level="${lv.id}" data-locked="${isLocked}">
        ${isLocked ? `<div class="lock-icon">🔒</div>` : ''}
        <div class="level-num">Level ${lv.id}</div>
        <div class="level-name">${lv.emoji} ${lv.name}</div>
        <div class="level-desc">${lv.desc}</div>
        <div class="level-meta">
          <div class="level-stars">${starStr}</div>
          <div class="level-badge" style="background:${diffColor}">${lv.difficulty}</div>
        </div>
        <div class="level-customers" style="margin-top:.5rem">
          👥 ${lv.maxCustomers} customers &nbsp; ⏱ ${lv.duration}s &nbsp; 🎯 ${lv.targetScore}pts
        </div>
      </div>
    `;
  }).join('');

  app.innerHTML = `
    <div class="screen-levels">
      <div class="screen-header">
        <button class="btn-back" id="btn-back">← Back</button>
        <div class="levels-title">🌸 Choose a Level</div>
      </div>
      <div class="levels-grid">${cards}</div>
    </div>
  `;

  app.querySelector('#btn-back').onclick = onBack;
  app.querySelectorAll('.level-card').forEach(card => {
    card.onclick = () => {
      if (card.dataset.locked === 'true') return;
      onSelect(parseInt(card.dataset.level));
    };
  });
}

export function renderGameScreen(app, state, level, actions) {
  const {
    score, money, timeLeft, customers, stations, tray, selectedCustomer,
    phase, notifs, combo, servedCount
  } = state;

  const timerPct = (timeLeft / level.duration) * 100;
  const timerUrgent = timeLeft < 20;

  // ---- HUD ----
  const hudHTML = `
    <div class="game-hud">
      <div class="hud-level">${level.emoji} Lvl ${level.id}: ${level.name}</div>
      <div class="hud-score">⭐ ${score} pts</div>
      <div class="hud-money">RM ${money.toFixed(2)}</div>
      <div class="hud-timer-wrap">
        <span>⏱</span>
        <span class="hud-timer ${timerUrgent ? 'urgent' : ''}">${Math.ceil(timeLeft)}s</span>
      </div>
      <button class="btn-pause" id="btn-pause">${phase === 'paused' ? '▶' : '⏸'}</button>
      <div class="timer-bar-wrap">
        <div class="timer-bar ${timerUrgent ? 'urgent' : ''}" style="width:${timerPct}%"></div>
      </div>
    </div>
  `;

  // ---- CUSTOMERS ----
  const sel = selectedCustomer;
  const customerCards = customers.map(c => {
    const patiencePct = (c.patienceLeft / c.maxPatience) * 100;
    const pColor = patiencePct > 60 ? '#52B788' : patiencePct > 30 ? '#FFB627' : '#E63946';
    const orderNames = c.order.map(id => MENU[id]?.emoji + ' ' + MENU[id]?.name).join(', ');
    return `
      <div class="customer-card ${sel === c.uid ? 'selected' : ''} ${c.served ? 'served' : ''} ${c.angry ? 'angry' : ''}"
           data-uid="${c.uid}">
        ${c.tip > 0 ? `<div class="customer-tip">+${c.tip}</div>` : ''}
        <div class="customer-avatar">${c.emoji}</div>
        <div class="customer-name">${c.name}</div>
        <div class="customer-order">${orderNames}</div>
        <div class="patience-bar-wrap">
          <div class="patience-bar" style="width:${patiencePct}%; background:${pColor}"></div>
        </div>
      </div>
    `;
  }).join('') || `<div style="color:var(--text-m);font-size:.9rem;padding:.5rem">Waiting for customers…</div>`;

  // ---- STATIONS ----
  const stationsHTML = level.stations.map(sid => {
    const sdef = STATIONS[sid];
    const sstate = stations[sid];
    if (!sstate) return '';

    const cooking = sstate.cooking || [];
    const itemsOnStation = level.menuItems.filter(id => MENU[id]?.station === sid);

    const cookingSlots = cooking.map(job => {
      const mi = MENU[job.itemId];
      return `
        <div class="station ${job.done ? 'active' : 'busy'}" style="position:relative"
             data-collect="${job.done}" data-station="${sid}" data-job="${job.id}">
          <div class="station-icon">${mi.emoji}</div>
          <div class="station-name">${mi.name}</div>
          <div class="station-status">${job.done ? '✅ Done!' : '🔥 Cooking…'}</div>
          ${job.done ? `<div class="station-ready-badge">✓</div>` : `
            <div class="station-prog-wrap">
              <div class="station-prog" style="width:${job.progress.toFixed(0)}%"></div>
            </div>
          `}
        </div>
      `;
    }).join('');

    const freeSlots = (STATIONS[sid]?.slots || 1) - cooking.filter(j => !j.done).length;

    const menuButtons = freeSlots > 0 ? itemsOnStation.map(id => {
      const mi = MENU[id];
      return `
        <div class="station" data-cook="${sid}" data-item="${id}" title="Cook ${mi.name} - ${mi.cookTime/1000}s">
          <div class="station-icon">${mi.emoji}</div>
          <div class="station-name">${mi.name}</div>
          <div class="station-status">RM ${mi.price.toFixed(2)}</div>
        </div>
      `;
    }).join('') : '';

    return `
      <div style="margin-bottom:.6rem">
        <div class="section-label" style="font-size:.78rem; margin-bottom:.4rem">
          ${sdef.emoji} ${sdef.name} ${freeSlots > 0 ? `(${freeSlots} free)` : '(full)'}
        </div>
        <div class="stations-grid">
          ${cookingSlots}
          ${menuButtons}
        </div>
      </div>
    `;
  }).join('');

  // ---- TRAY ----
  const trayItems = tray.map(item => `
    <div class="tray-item" data-tray-remove="${item.id}">
      ${item.emoji} ${item.name} ✕
    </div>
  `).join('');

  // ---- SELECTED ORDER DETAIL ----
  const selCustomer = customers.find(c => c.uid === sel);
  const orderDetailHTML = selCustomer ? (() => {
    const trayItemIds = tray.map(x => x.itemId);
    const orderTotal = selCustomer.order.reduce((s, id) => s + (MENU[id]?.price || 0), 0);
    const items = selCustomer.order.map(id => {
      const mi = MENU[id];
      const hasTray = trayItemIds.includes(id);
      return `
        <li>
          <span class="order-item-icon">${mi.emoji}</span>
          ${mi.name}
          <div class="order-item-check ${hasTray ? 'done' : ''}">
            ${hasTray ? '✓' : ''}
          </div>
        </li>
      `;
    }).join('');
    return `
      <div class="order-detail-card">
        <div class="order-detail-title">${selCustomer.emoji} ${selCustomer.name}'s Order</div>
        <ul class="order-items-list">${items}</ul>
        <div class="order-total">Total: RM ${orderTotal.toFixed(2)}${selCustomer.tip > 0 ? ` + RM${selCustomer.tip} tip` : ''}</div>
      </div>
    `;
  })() : `<div style="color:var(--text-m);font-size:.85rem;text-align:center;padding:1rem">
    👆 Tap a customer to see their order
  </div>`;

  // ---- MENU REFERENCE ----
  const menuRef = level.menuItems.map(id => {
    const mi = MENU[id];
    const sdef = STATIONS[mi.station];
    return `
      <div class="menu-item-row">
        <span class="menu-item-emoji">${mi.emoji}</span>
        <span class="menu-item-name">${mi.name}</span>
        <span class="menu-item-station">${sdef?.emoji || ''} ${sdef?.name || mi.station}</span>
        <span class="menu-item-price">RM${mi.price.toFixed(2)}</span>
      </div>
    `;
  }).join('');

  // ---- FULL HTML ----
  app.innerHTML = `
    ${hudHTML}
    <div class="game-main">
      <div class="kantin-area">
        <div class="customers-section">
          <div class="section-label">👥 Customers (${servedCount} served)</div>
          <div class="customer-queue">${customerCards}</div>
        </div>
        <div class="stations-section">
          <div class="section-label">👨‍🍳 Cooking Stations — click to cook, click done items to collect</div>
          ${stationsHTML}
        </div>
        <div class="assembly-section">
          <div class="section-label">🍽️ Tray — collect items here, then serve to selected customer</div>
          <div class="tray ${tray.length > 0 ? 'has-items' : ''}">
            ${tray.length > 0 ? trayItems : '<span class="tray-placeholder">Tray is empty — collect cooked items above</span>'}
          </div>
          <div class="tray-actions">
            <button class="btn-serve" id="btn-serve" ${!sel || tray.length === 0 ? 'disabled' : ''}>
              ${sel ? `🍽️ Serve ${customers.find(c=>c.uid===sel)?.name || 'Customer'}` : '← Select a customer first'}
            </button>
            <button class="btn-clear" id="btn-clear">🗑</button>
          </div>
        </div>
      </div>
      <div class="sidebar-panel">
        ${orderDetailHTML}
        <div class="menu-card">
          <div class="menu-card-title">📋 Menu</div>
          ${menuRef}
        </div>
        <div style="background:var(--warm);border-radius:var(--r-sm);padding:.8rem;border:1px solid var(--peach);font-size:.82rem;color:var(--text-m)">
          <strong style="color:var(--brown)">How to play:</strong><br>
          1. Tap a customer to see their order<br>
          2. Click a station to start cooking<br>
          3. Click done item (✅) to put on tray<br>
          4. Click "Serve" to hand it over!
        </div>
      </div>
    </div>
    <div class="notifications-wrap" id="notifs-wrap">
      ${notifs.map(n => `<div class="notif ${n.type}">${n.msg}</div>`).join('')}
    </div>
    ${phase === 'paused' ? `
      <div class="pause-overlay" id="pause-overlay">
        <div class="pause-card">
          <div class="pause-title">⏸ Paused</div>
          <div class="pause-actions">
            <button class="btn-resume" id="btn-resume">▶ Resume</button>
            <button class="btn-quit" id="btn-quit">🏠 Quit to Menu</button>
          </div>
        </div>
      </div>
    ` : ''}
  `;

  // ---- BIND EVENTS ----
  // Pause
  app.querySelector('#btn-pause')?.addEventListener('click', actions.pause);
  app.querySelector('#btn-resume')?.addEventListener('click', actions.resume);
  app.querySelector('#btn-quit')?.addEventListener('click', actions.quit);

  // Customer select
  app.querySelectorAll('.customer-card').forEach(el => {
    el.addEventListener('click', () => {
      const uid = parseInt(el.dataset.uid);
      actions.selectCustomer(uid);
    });
  });

  // Cook item
  app.querySelectorAll('[data-cook]').forEach(el => {
    el.addEventListener('click', () => {
      actions.cookItem(el.dataset.cook, el.dataset.item);
    });
  });

  // Collect item
  app.querySelectorAll('[data-collect="true"]').forEach(el => {
    el.addEventListener('click', () => {
      actions.collectItem(el.dataset.station, el.dataset.job);
    });
  });

  // Tray remove
  app.querySelectorAll('[data-tray-remove]').forEach(el => {
    el.addEventListener('click', () => {
      actions.removeTrayItem(el.dataset.trayRemove);
    });
  });

  // Serve / Clear
  app.querySelector('#btn-serve')?.addEventListener('click', actions.serve);
  app.querySelector('#btn-clear')?.addEventListener('click', actions.clearTray);
}

export function renderResultScreen(app, result, level, onRetry, onNext, onMenu) {
  const { score, money, servedCount, angryCount, stars, passed } = result;
  const starStr = '⭐'.repeat(stars) + '☆'.repeat(3 - stars);
  const emoji = stars === 3 ? '🏆' : stars === 2 ? '🎉' : stars === 1 ? '😊' : '😢';
  const title = stars === 3 ? 'Legendary Chef!' : stars === 2 ? 'Great Service!' : stars === 1 ? 'Not Bad!' : 'Try Again!';

  const hasNext = level.id < LEVELS.length;

  app.innerHTML = `
    <div class="screen-result">
      <div class="result-card">
        <div class="result-emoji">${emoji}</div>
        <div class="result-title">${title}</div>
        <div class="result-stars">${starStr}</div>
        ${passed && level.reward ? `<div style="background:var(--warm);border-radius:var(--r-sm);padding:.6rem 1rem;margin:.5rem 0;font-weight:700;color:var(--brown);font-size:.9rem">${level.reward} Unlocked!</div>` : ''}
        <div class="result-stats">
          <div class="stat-box">
            <div class="stat-label">Score</div>
            <div class="stat-value">${score}</div>
          </div>
          <div class="stat-box">
            <div class="stat-label">Earnings</div>
            <div class="stat-value">RM ${money.toFixed(2)}</div>
          </div>
          <div class="stat-box">
            <div class="stat-label">Served</div>
            <div class="stat-value">${servedCount} 🍽️</div>
          </div>
          <div class="stat-box">
            <div class="stat-label">Left Angry</div>
            <div class="stat-value">${angryCount} 😠</div>
          </div>
        </div>
        <div style="font-size:.85rem;color:var(--text-m);margin-bottom:.5rem">
          Target: ${level.targetScore} pts — ${passed ? '✅ Passed!' : '❌ Not reached'}
        </div>
        <div class="result-actions">
          <button class="btn-retry" id="btn-retry">🔄 Retry</button>
          ${hasNext && passed ? `<button class="btn-next" id="btn-next">Next Level ➡</button>` : ''}
          <button class="btn-retry" id="btn-menu" style="border-color:var(--teal);color:var(--teal)">🏠 Menu</button>
        </div>
      </div>
    </div>
  `;

  app.querySelector('#btn-retry').onclick = onRetry;
  app.querySelector('#btn-next')?.addEventListener('click', onNext);
  app.querySelector('#btn-menu').onclick = onMenu;
}
