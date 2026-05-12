/* ===== FLOWER KANTIN GAME STYLES ===== */
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Nunito:wght@400;600;700;800&display=swap');

:root {
  --cream:    #FFF8F0;
  --warm:     #FFF0DC;
  --peach:    #FFD6B0;
  --coral:    #FF7B54;
  --coral-dk: #E05A35;
  --teal:     #2EC4B6;
  --teal-dk:  #1A9E92;
  --gold:     #FFB627;
  --gold-dk:  #E09A10;
  --green:    #52B788;
  --green-dk: #3A9068;
  --red:      #E63946;
  --purple:   #7B5EA7;
  --blue:     #4895EF;
  --brown:    #6B4226;
  --brown-lt: #A0673A;
  --text:     #3A2210;
  --text-m:   #7A5230;
  --shadow:   rgba(58,34,16,0.15);
  --r:        16px;
  --r-sm:     10px;
  --r-lg:     24px;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: 'Nunito', sans-serif;
  background: var(--cream);
  color: var(--text);
  min-height: 100vh;
  overflow-x: hidden;
}

#app { width: 100%; min-height: 100vh; }

/* ===== TITLE SCREEN ===== */
.screen-title {
  min-height: 100vh;
  background: linear-gradient(160deg, #FFF8E7 0%, #FFE8C8 50%, #FFD6A0 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}
.screen-title::before {
  content: '';
  position: absolute; inset: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FF7B54' fill-opacity='0.06'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  pointer-events: none;
}
.title-deco {
  font-size: 5rem;
  line-height: 1;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,.1));
  animation: float 3s ease-in-out infinite;
  margin-bottom: 1rem;
}
@keyframes float {
  0%,100% { transform: translateY(0); }
  50%      { transform: translateY(-12px); }
}
.title-logo {
  font-family: 'Fredoka', sans-serif;
  font-size: 3.5rem;
  font-weight: 700;
  color: var(--coral);
  text-shadow: 3px 3px 0 var(--coral-dk);
  letter-spacing: 2px;
  line-height: 1;
}
.title-sub {
  font-size: 1.1rem;
  color: var(--brown-lt);
  margin-top: .4rem;
  margin-bottom: 2rem;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
}
.btn-start {
  background: linear-gradient(135deg, var(--coral) 0%, var(--coral-dk) 100%);
  color: white;
  border: none;
  border-radius: 50px;
  padding: 1rem 3rem;
  font-family: 'Fredoka', sans-serif;
  font-size: 1.5rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 6px 0 var(--coral-dk), 0 10px 20px rgba(255,123,84,0.4);
  transition: all .12s;
  letter-spacing: 1px;
}
.btn-start:hover { transform: translateY(-2px); box-shadow: 0 8px 0 var(--coral-dk), 0 14px 24px rgba(255,123,84,0.4); }
.btn-start:active { transform: translateY(3px); box-shadow: 0 3px 0 var(--coral-dk), 0 6px 12px rgba(255,123,84,0.3); }

.title-features {
  display: flex; gap: 1.5rem;
  margin-top: 2.5rem;
}
.feat-badge {
  background: white;
  border-radius: 50px;
  padding: .5rem 1.1rem;
  font-size: .85rem;
  font-weight: 700;
  color: var(--brown);
  box-shadow: 0 3px 10px var(--shadow);
  display: flex; align-items: center; gap: .4rem;
}

/* ===== LEVEL SELECT ===== */
.screen-levels {
  min-height: 100vh;
  background: linear-gradient(160deg, #FFF8E7 0%, #FFE8C8 100%);
  padding: 2rem 1.5rem;
}
.screen-header {
  display: flex; align-items: center; gap: 1rem;
  margin-bottom: 2rem;
}
.btn-back {
  background: white;
  border: 2px solid var(--peach);
  border-radius: 50px;
  padding: .5rem 1.2rem;
  font-family: 'Nunito', sans-serif;
  font-weight: 700;
  cursor: pointer;
  color: var(--brown);
  font-size: .95rem;
  transition: all .15s;
}
.btn-back:hover { background: var(--peach); }

.levels-title {
  font-family: 'Fredoka', sans-serif;
  font-size: 2rem;
  color: var(--coral);
}

.levels-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.2rem;
  max-width: 900px;
  margin: 0 auto;
}
.level-card {
  background: white;
  border-radius: var(--r-lg);
  padding: 1.5rem;
  box-shadow: 0 4px 16px var(--shadow);
  cursor: pointer;
  transition: all .2s;
  border: 3px solid transparent;
  position: relative;
  overflow: hidden;
}
.level-card::before {
  content: '';
  position: absolute; top: 0; left: 0; right: 0; height: 6px;
  background: var(--stripe);
}
.level-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px var(--shadow); border-color: var(--stripe); }
.level-card.locked { opacity: .6; cursor: not-allowed; filter: grayscale(.4); }
.level-card.completed { border-color: var(--green); }
.level-card.completed::before { background: var(--green); }

.level-num {
  font-family: 'Fredoka', sans-serif;
  font-size: 1rem;
  color: var(--text-m);
  font-weight: 600;
}
.level-name {
  font-family: 'Fredoka', sans-serif;
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--text);
  margin: .2rem 0;
}
.level-desc { font-size: .85rem; color: var(--text-m); margin-bottom: 1rem; }
.level-meta {
  display: flex; align-items: center; justify-content: space-between;
}
.level-stars { font-size: 1.3rem; letter-spacing: 2px; }
.level-badge {
  background: var(--stripe);
  color: white;
  padding: .3rem .8rem;
  border-radius: 50px;
  font-size: .8rem;
  font-weight: 700;
}
.lock-icon { font-size: 2rem; position: absolute; top: 1rem; right: 1rem; }
.level-customers { font-size: .82rem; color: var(--text-m); font-weight: 600; }

/* ===== GAME SCREEN ===== */
.screen-game {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #FDF6EE;
  user-select: none;
}

/* -- HUD -- */
.game-hud {
  background: linear-gradient(135deg, var(--coral) 0%, #FF9566 100%);
  color: white;
  padding: .7rem 1.2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  box-shadow: 0 3px 12px rgba(255,123,84,.35);
  flex-shrink: 0;
  position: sticky; top: 0; z-index: 100;
}
.hud-level {
  font-family: 'Fredoka', sans-serif;
  font-size: 1.1rem;
  font-weight: 600;
  background: rgba(255,255,255,.2);
  padding: .3rem .8rem;
  border-radius: 50px;
  white-space: nowrap;
}
.hud-score {
  font-family: 'Fredoka', sans-serif;
  font-size: 1.1rem;
  font-weight: 700;
  margin-left: auto;
}
.hud-money {
  background: rgba(255,255,255,.25);
  padding: .3rem .8rem;
  border-radius: 50px;
  font-weight: 700;
  font-size: .95rem;
}
.hud-timer-wrap {
  display: flex; align-items: center; gap: .5rem;
  background: rgba(0,0,0,.15);
  padding: .3rem .8rem;
  border-radius: 50px;
}
.hud-timer {
  font-family: 'Fredoka', sans-serif;
  font-size: 1.1rem;
  font-weight: 700;
  min-width: 3ch;
}
.hud-timer.urgent { color: #FFE000; animation: blink .5s step-end infinite; }
@keyframes blink { 50% { opacity: .4; } }

.timer-bar-wrap {
  flex-basis: 100%;
  height: 6px;
  background: rgba(255,255,255,.25);
  border-radius: 3px;
  overflow: hidden;
}
.timer-bar {
  height: 100%;
  background: white;
  border-radius: 3px;
  transition: width .5s linear, background-color .5s;
}
.timer-bar.urgent { background: #FFE000; }

/* -- MAIN GAME AREA -- */
.game-main {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 0;
  min-height: 0;
  overflow: hidden;
}

/* -- KANTIN AREA -- */
.kantin-area {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: .8rem;
  overflow-y: auto;
}

/* -- CUSTOMERS QUEUE -- */
.customers-section {
  background: linear-gradient(180deg, #FFF3E0 0%, #FFE8CC 100%);
  border-radius: var(--r);
  padding: 1rem;
  border: 2px solid var(--peach);
}
.section-label {
  font-family: 'Fredoka', sans-serif;
  font-size: .9rem;
  font-weight: 600;
  color: var(--brown-lt);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: .7rem;
}
.customer-queue {
  display: flex;
  gap: .8rem;
  flex-wrap: wrap;
}
.customer-card {
  background: white;
  border-radius: var(--r);
  padding: .8rem;
  border: 2px solid var(--peach);
  min-width: 140px;
  max-width: 170px;
  cursor: pointer;
  transition: all .18s;
  position: relative;
  flex-shrink: 0;
}
.customer-card:hover { transform: translateY(-3px); box-shadow: 0 6px 16px var(--shadow); }
.customer-card.selected { border-color: var(--teal); box-shadow: 0 0 0 3px rgba(46,196,182,.25); }
.customer-card.served { border-color: var(--green); background: #F0FFF6; opacity: .6; }
.customer-card.angry { border-color: var(--red); animation: shake .4s ease; }
@keyframes shake {
  0%,100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}
.customer-avatar { font-size: 2.2rem; text-align: center; line-height: 1; }
.customer-name {
  font-weight: 700;
  font-size: .85rem;
  color: var(--text);
  text-align: center;
  margin-top: .3rem;
}
.customer-order {
  font-size: .78rem;
  color: var(--text-m);
  text-align: center;
  margin-top: .2rem;
}
.patience-bar-wrap {
  margin-top: .5rem;
  height: 5px;
  background: #F0E0D0;
  border-radius: 3px;
  overflow: hidden;
}
.patience-bar {
  height: 100%;
  border-radius: 3px;
  transition: width .5s linear, background-color .5s;
}
.customer-tip {
  position: absolute; top: -8px; right: -8px;
  background: var(--gold);
  color: white;
  border-radius: 50%;
  width: 24px; height: 24px;
  font-size: .7rem;
  font-weight: 800;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 2px 6px rgba(255,182,39,.4);
}

/* -- PREP STATIONS -- */
.stations-section {
  background: linear-gradient(180deg, #E8F8F5 0%, #D4F4F0 100%);
  border-radius: var(--r);
  padding: 1rem;
  border: 2px solid #B0E8E2;
}
.stations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: .7rem;
}
.station {
  background: white;
  border-radius: var(--r);
  padding: .9rem .7rem;
  border: 2px solid #C8EEE9;
  cursor: pointer;
  transition: all .18s;
  text-align: center;
  position: relative;
  overflow: hidden;
}
.station:hover:not(.busy) { transform: translateY(-3px); box-shadow: 0 6px 16px rgba(46,196,182,.2); border-color: var(--teal); }
.station.busy { cursor: default; }
.station.active { border-color: var(--gold); background: #FFFBE6; }
.station-icon { font-size: 2rem; line-height: 1; }
.station-name {
  font-weight: 700;
  font-size: .78rem;
  color: var(--text);
  margin-top: .4rem;
}
.station-status {
  font-size: .72rem;
  color: var(--text-m);
  margin-top: .2rem;
}
.station-prog-wrap {
  position: absolute; bottom: 0; left: 0; right: 0;
  height: 5px;
  background: #E8E8E8;
}
.station-prog {
  height: 100%;
  background: linear-gradient(90deg, var(--teal), var(--teal-dk));
  transition: width .2s linear;
}
.station-ready-badge {
  position: absolute; top: -6px; right: -6px;
  background: var(--green);
  color: white;
  border-radius: 50%;
  width: 22px; height: 22px;
  font-size: .7rem;
  display: flex; align-items: center; justify-content: center;
  animation: popIn .3s cubic-bezier(.36,1.6,.6,1);
}
@keyframes popIn {
  from { transform: scale(0); }
  to   { transform: scale(1); }
}

/* -- ASSEMBLY AREA -- */
.assembly-section {
  background: linear-gradient(180deg, #FFF0E8 0%, #FFE4D0 100%);
  border-radius: var(--r);
  padding: 1rem;
  border: 2px solid var(--peach);
}
.tray {
  min-height: 80px;
  background: white;
  border-radius: var(--r-sm);
  border: 2px dashed var(--peach);
  padding: .7rem;
  display: flex;
  flex-wrap: wrap;
  gap: .4rem;
  align-items: center;
  transition: border-color .2s;
  margin-bottom: .8rem;
}
.tray.has-items { border-color: var(--coral); border-style: solid; }
.tray-item {
  background: var(--warm);
  border: 2px solid var(--peach);
  border-radius: 50px;
  padding: .35rem .8rem;
  font-size: .82rem;
  font-weight: 700;
  color: var(--brown);
  display: flex; align-items: center; gap: .3rem;
  animation: slideIn .2s cubic-bezier(.36,1.4,.6,1);
  cursor: pointer;
}
.tray-item:hover { background: #FFE0D0; border-color: var(--coral); }
@keyframes slideIn {
  from { transform: scale(.7) translateY(10px); opacity: 0; }
  to   { transform: scale(1) translateY(0); opacity: 1; }
}
.tray-placeholder {
  color: var(--text-m);
  font-size: .85rem;
  opacity: .6;
  width: 100%;
  text-align: center;
}
.tray-actions {
  display: flex; gap: .6rem;
}
.btn-serve {
  flex: 1;
  background: linear-gradient(135deg, var(--green) 0%, var(--green-dk) 100%);
  color: white;
  border: none;
  border-radius: 50px;
  padding: .7rem 1.5rem;
  font-family: 'Fredoka', sans-serif;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 0 var(--green-dk);
  transition: all .12s;
}
.btn-serve:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 0 var(--green-dk); }
.btn-serve:active:not(:disabled) { transform: translateY(2px); box-shadow: 0 2px 0 var(--green-dk); }
.btn-serve:disabled { opacity: .45; cursor: not-allowed; }
.btn-clear {
  background: white;
  color: var(--red);
  border: 2px solid var(--red);
  border-radius: 50px;
  padding: .7rem 1rem;
  font-family: 'Nunito', sans-serif;
  font-weight: 700;
  cursor: pointer;
  transition: all .15s;
}
.btn-clear:hover { background: var(--red); color: white; }

/* -- SIDEBAR PANEL -- */
.sidebar-panel {
  background: white;
  border-left: 2px solid var(--peach);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
}
.order-detail-card {
  background: var(--warm);
  border-radius: var(--r);
  padding: 1rem;
  border: 2px solid var(--peach);
}
.order-detail-title {
  font-family: 'Fredoka', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  color: var(--brown);
  margin-bottom: .6rem;
  display: flex; align-items: center; gap: .4rem;
}
.order-items-list { list-style: none; }
.order-items-list li {
  display: flex; align-items: center; gap: .5rem;
  padding: .35rem 0;
  border-bottom: 1px dashed var(--peach);
  font-size: .88rem;
}
.order-items-list li:last-child { border-bottom: none; }
.order-item-icon { font-size: 1.2rem; }
.order-item-check {
  margin-left: auto;
  width: 20px; height: 20px;
  border: 2px solid var(--peach);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: .7rem;
  transition: all .2s;
}
.order-item-check.done {
  background: var(--green);
  border-color: var(--green);
  color: white;
}
.order-total {
  font-weight: 800;
  font-size: 1rem;
  color: var(--coral);
  margin-top: .5rem;
  text-align: right;
}

/* Menu reference card */
.menu-card {
  background: var(--cream);
  border-radius: var(--r);
  padding: 1rem;
  border: 2px solid var(--peach);
}
.menu-card-title {
  font-family: 'Fredoka', sans-serif;
  font-size: 1rem;
  color: var(--brown);
  margin-bottom: .6rem;
  font-weight: 700;
}
.menu-item-row {
  display: flex; align-items: center; gap: .5rem;
  padding: .3rem 0;
  font-size: .82rem;
  border-bottom: 1px solid var(--peach);
}
.menu-item-row:last-child { border-bottom: none; }
.menu-item-emoji { font-size: 1.1rem; }
.menu-item-name { flex: 1; font-weight: 600; color: var(--text); }
.menu-item-station {
  font-size: .72rem;
  background: var(--peach);
  color: var(--brown);
  padding: .15rem .5rem;
  border-radius: 50px;
  font-weight: 700;
}
.menu-item-price {
  font-weight: 700;
  color: var(--green-dk);
  font-size: .82rem;
}

/* ===== RESULT SCREEN ===== */
.screen-result {
  min-height: 100vh;
  background: linear-gradient(160deg, #FFF8E7 0%, #FFE8C8 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}
.result-card {
  background: white;
  border-radius: var(--r-lg);
  padding: 2.5rem;
  max-width: 460px;
  width: 100%;
  box-shadow: 0 8px 32px var(--shadow);
  text-align: center;
}
.result-emoji { font-size: 5rem; margin-bottom: 1rem; }
.result-title {
  font-family: 'Fredoka', sans-serif;
  font-size: 2.2rem;
  color: var(--coral);
  margin-bottom: .5rem;
}
.result-stars { font-size: 2.5rem; letter-spacing: 4px; margin: 1rem 0; }
.result-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: .7rem;
  margin: 1.5rem 0;
}
.stat-box {
  background: var(--cream);
  border-radius: var(--r-sm);
  padding: .8rem;
  border: 1px solid var(--peach);
}
.stat-label { font-size: .78rem; color: var(--text-m); font-weight: 600; text-transform: uppercase; letter-spacing: .5px; }
.stat-value {
  font-family: 'Fredoka', sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text);
  margin-top: .2rem;
}
.result-actions {
  display: flex; gap: .8rem; margin-top: 1.5rem;
}
.btn-next, .btn-retry {
  flex: 1;
  border: none;
  border-radius: 50px;
  padding: .9rem;
  font-family: 'Fredoka', sans-serif;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all .15s;
}
.btn-next { background: linear-gradient(135deg, var(--coral), var(--coral-dk)); color: white; box-shadow: 0 4px 0 var(--coral-dk); }
.btn-next:hover { transform: translateY(-2px); }
.btn-retry { background: white; color: var(--coral); border: 2px solid var(--coral); }
.btn-retry:hover { background: var(--coral); color: white; }

/* ===== NOTIFICATIONS ===== */
.notifications-wrap {
  position: fixed;
  top: 70px;
  right: 1rem;
  z-index: 999;
  display: flex;
  flex-direction: column;
  gap: .5rem;
  pointer-events: none;
}
.notif {
  background: white;
  border-radius: 50px;
  padding: .55rem 1.1rem;
  font-weight: 700;
  font-size: .9rem;
  box-shadow: 0 4px 16px rgba(0,0,0,.15);
  animation: notifIn .3s cubic-bezier(.36,1.6,.6,1) forwards;
  display: flex; align-items: center; gap: .5rem;
}
.notif.earn { color: var(--green-dk); border: 2px solid var(--green); }
.notif.lose { color: var(--red); border: 2px solid var(--red); }
.notif.info { color: var(--blue); border: 2px solid var(--blue); }
@keyframes notifIn {
  from { transform: translateX(60px); opacity: 0; }
  to   { transform: translateX(0); opacity: 1; }
}

/* ===== COMBO BANNER ===== */
.combo-banner {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0);
  z-index: 998;
  pointer-events: none;
  font-family: 'Fredoka', sans-serif;
  font-size: 3rem;
  font-weight: 700;
  color: var(--gold);
  text-shadow: 3px 3px 0 rgba(0,0,0,.2);
  animation: comboAnim .7s cubic-bezier(.36,1.6,.6,1) forwards;
}
@keyframes comboAnim {
  0%   { transform: translate(-50%,-50%) scale(0); opacity: 1; }
  60%  { transform: translate(-50%,-50%) scale(1.2); opacity: 1; }
  100% { transform: translate(-50%,-60%) scale(1); opacity: 0; }
}

/* ===== FLOATING SCORE ===== */
.float-score {
  position: fixed;
  font-family: 'Fredoka', sans-serif;
  font-size: 1.4rem;
  font-weight: 700;
  pointer-events: none;
  z-index: 997;
  animation: floatUp .9s ease forwards;
}
.float-score.plus { color: var(--green); }
.float-score.minus { color: var(--red); }
@keyframes floatUp {
  from { transform: translateY(0); opacity: 1; }
  to   { transform: translateY(-60px); opacity: 0; }
}

/* ===== PAUSE OVERLAY ===== */
.pause-overlay {
  position: fixed; inset: 0;
  background: rgba(58,34,16,.55);
  backdrop-filter: blur(4px);
  z-index: 500;
  display: flex; align-items: center; justify-content: center;
}
.pause-card {
  background: white;
  border-radius: var(--r-lg);
  padding: 2.5rem;
  text-align: center;
  box-shadow: 0 16px 48px rgba(0,0,0,.2);
}
.pause-title {
  font-family: 'Fredoka', sans-serif;
  font-size: 2.5rem;
  color: var(--coral);
  margin-bottom: 1.5rem;
}
.pause-actions { display: flex; flex-direction: column; gap: .8rem; }
.btn-resume {
  background: linear-gradient(135deg, var(--teal), var(--teal-dk));
  color: white;
  border: none;
  border-radius: 50px;
  padding: .9rem 2.5rem;
  font-family: 'Fredoka', sans-serif;
  font-size: 1.2rem;
  cursor: pointer;
  box-shadow: 0 4px 0 var(--teal-dk);
  transition: all .15s;
}
.btn-resume:hover { transform: translateY(-2px); }
.btn-quit {
  background: none;
  color: var(--text-m);
  border: 2px solid var(--peach);
  border-radius: 50px;
  padding: .7rem 2.5rem;
  font-family: 'Nunito', sans-serif;
  font-weight: 700;
  cursor: pointer;
  transition: all .15s;
}
.btn-quit:hover { border-color: var(--red); color: var(--red); }

/* ===== HUD PAUSE BTN ===== */
.btn-pause {
  background: rgba(255,255,255,.2);
  border: none;
  border-radius: 50%;
  width: 34px; height: 34px;
  cursor: pointer;
  color: white;
  font-size: 1rem;
  display: flex; align-items: center; justify-content: center;
  transition: background .15s;
}
.btn-pause:hover { background: rgba(255,255,255,.35); }

/* ===== RESPONSIVE ===== */
@media (max-width: 700px) {
  .game-main {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr auto;
  }
  .sidebar-panel {
    border-left: none;
    border-top: 2px solid var(--peach);
    max-height: 250px;
  }
  .levels-grid { grid-template-columns: 1fr; }
  .title-features { flex-wrap: wrap; justify-content: center; }
}
