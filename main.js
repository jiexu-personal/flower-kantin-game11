// ===== FLOWER KANTIN GAME ENGINE =====
import { MENU, CUSTOMERS, LEVELS } from './data.js';

export class GameEngine {
  constructor(levelData, onStateChange) {
    this.level = levelData;
    this.onStateChange = onStateChange;

    this.state = {
      phase: 'playing', // playing | paused | ended
      score: 0,
      money: 0,
      customers: [],
      stations: {},        // stationId -> { queue: [], slots: [{item,progress,timer}] }
      tray: [],            // items ready to assemble
      selectedCustomer: null,
      servedCount: 0,
      angryCount: 0,
      combo: 0,
      timeLeft: levelData.duration,
      notifs: [],
    };

    this._initStations();
    this._customerIdCounter = 0;
    this._notifIdCounter = 0;
    this._spawnTimer = null;
    this._tickInterval = null;
    this._customerTimers = {};
    this._spawned = 0;
  }

  // ---- INIT ----
  _initStations() {
    for (const sid of this.level.stations) {
      const def = this.level.stationDefs[sid];
      this.state.stations[sid] = {
        slots: Array.from({ length: def.slots }, () => null),
        cooking: [], // { itemId, progress 0-100, startTime, cookTime, id }
      };
    }
  }

  start() {
    this._tickInterval = setInterval(() => this._tick(), 200);
    this._spawnWave();
    this._spawnTimer = setTimeout(() => this._startSpawnLoop(), 3000);
  }

  _startSpawnLoop() {
    const spawn = () => {
      if (this.state.phase !== 'playing') return;
      if (this._spawned < this.level.maxCustomers) {
        this._spawnCustomer();
      }
      this._spawnTimer = setTimeout(spawn, this.level.spawnInterval + (Math.random() * 4000 - 2000));
    };
    spawn();
  }

  // ---- SPAWN ----
  _spawnWave() {
    const count = Math.min(this.level.customersPerWave, 4);
    for (let i = 0; i < count; i++) {
      setTimeout(() => this._spawnCustomer(), i * 600);
    }
  }

  _spawnCustomer() {
    if (this.state.customers.length >= 6) return; // max visible queue
    if (this._spawned >= this.level.maxCustomers) return;

    const templates = CUSTOMERS;
    const tmpl = templates[Math.floor(Math.random() * templates.length)];
    const items = this.level.menuItems;
    const orderCount = Math.floor(Math.random() * 2) + 1;
    const order = [];
    for (let i = 0; i < orderCount; i++) {
      const itemId = items[Math.floor(Math.random() * items.length)];
      if (!order.includes(itemId)) order.push(itemId);
    }

    const customer = {
      uid: ++this._customerIdCounter,
      ...tmpl,
      order,
      patience: tmpl.patience,
      maxPatience: tmpl.patience,
      patienceLeft: tmpl.patience,
      served: false,
      angry: false,
      tip: order.length > 1 ? Math.floor(Math.random() * 3) + 1 : 0,
    };

    this._spawned++;
    this.state.customers.push(customer);

    // Start patience countdown
    this._customerTimers[customer.uid] = setInterval(() => {
      this._tickCustomerPatience(customer.uid);
    }, 1000);

    this._emit();
  }

  _tickCustomerPatience(uid) {
    if (this.state.phase !== 'playing') return;
    const c = this.state.customers.find(x => x.uid === uid);
    if (!c || c.served) return;

    c.patienceLeft = Math.max(0, c.patienceLeft - 1);

    if (c.patienceLeft <= 0 && !c.angry) {
      c.angry = true;
      this._clearCustomerTimer(uid);
      this._angryLeave(uid);
    }
    this._emit();
  }

  _clearCustomerTimer(uid) {
    if (this._customerTimers[uid]) {
      clearInterval(this._customerTimers[uid]);
      delete this._customerTimers[uid];
    }
  }

  _angryLeave(uid) {
    const c = this.state.customers.find(x => x.uid === uid);
    if (!c) return;

    this.state.angryCount++;
    this.state.combo = 0;
    const penalty = -20;
    this.state.score = Math.max(0, this.state.score + penalty);

    this.addNotif(`${c.emoji} Left angry! -20pts`, 'lose');
    this._showFloatScore(penalty, 'minus');

    setTimeout(() => {
      this.state.customers = this.state.customers.filter(x => x.uid !== uid);
      if (this.state.selectedCustomer === uid) this.state.selectedCustomer = null;
      this._emit();

      // Spawn replacement if more to come
      if (this._spawned < this.level.maxCustomers) {
        setTimeout(() => this._spawnCustomer(), 2000);
      } else {
        this._checkEndCondition();
      }
    }, 800);

    this._emit();
  }

  // ---- TICK ----
  _tick() {
    if (this.state.phase !== 'playing') return;

    // Timer
    this.state.timeLeft = Math.max(0, this.state.timeLeft - 0.2);

    // Cook stations
    for (const sid of Object.keys(this.state.stations)) {
      const station = this.state.stations[sid];
      station.cooking = station.cooking.map(job => {
        if (job.done) return job;
        const elapsed = Date.now() - job.startTime;
        const progress = Math.min(100, (elapsed / job.cookTime) * 100);
        const done = progress >= 100;
        if (done && !job.done) {
          job.done = true;
          // Add to tray auto if a customer is waiting for it
        }
        return { ...job, progress, done };
      });
    }

    if (this.state.timeLeft <= 0) {
      this._endGame();
      return;
    }

    this._emit();
  }

  // ---- ACTIONS ----
  selectCustomer(uid) {
    if (this.state.phase !== 'playing') return;
    this.state.selectedCustomer = this.state.selectedCustomer === uid ? null : uid;
    this._emit();
  }

  cookItem(stationId, itemId) {
    if (this.state.phase !== 'playing') return;
    const station = this.state.stations[stationId];
    if (!station) return;

    const def = this.level.stationDefs[stationId];
    const activeJobs = station.cooking.filter(j => !j.done).length;
    if (activeJobs >= def.slots) return; // no free slot

    const menuItem = MENU[itemId];
    if (!menuItem) return;

    const job = {
      id: `${itemId}_${Date.now()}`,
      itemId,
      startTime: Date.now(),
      cookTime: menuItem.cookTime,
      progress: 0,
      done: false,
    };

    station.cooking.push(job);
    this._emit();
  }

  collectItem(stationId, jobId) {
    if (this.state.phase !== 'playing') return;
    const station = this.state.stations[stationId];
    if (!station) return;

    const job = station.cooking.find(j => j.id === jobId);
    if (!job || !job.done) return;

    // Move to tray
    const menuItem = MENU[job.itemId];
    this.state.tray.push({
      id: `tray_${Date.now()}_${Math.random()}`,
      itemId: job.itemId,
      name: menuItem.name,
      emoji: menuItem.emoji,
    });

    station.cooking = station.cooking.filter(j => j.id !== jobId);
    this._emit();
  }

  removeTrayItem(trayId) {
    this.state.tray = this.state.tray.filter(x => x.id !== trayId);
    this._emit();
  }

  clearTray() {
    this.state.tray = [];
    this._emit();
  }

  serveCustomer() {
    if (this.state.phase !== 'playing') return;
    const uid = this.state.selectedCustomer;
    if (!uid) return;

    const customer = this.state.customers.find(c => c.uid === uid);
    if (!customer || customer.served) return;

    if (this.state.tray.length === 0) return;

    // Check what's on tray vs order
    const trayItemIds = this.state.tray.map(x => x.itemId);
    const orderItemIds = [...customer.order];

    // Check if all ordered items are satisfied
    let allSatisfied = true;
    for (const oid of orderItemIds) {
      const idx = trayItemIds.indexOf(oid);
      if (idx === -1) { allSatisfied = false; break; }
      trayItemIds.splice(idx, 1); // consume it
    }

    if (!allSatisfied) {
      this.addNotif('⚠️ Wrong order! Check the items.', 'info');
      this._emit();
      return;
    }

    // Calculate earnings
    let total = 0;
    for (const oid of customer.order) {
      total += MENU[oid].price;
    }

    // Patience bonus
    const patienceRatio = customer.patienceLeft / customer.maxPatience;
    const speedBonus = patienceRatio > 0.7 ? 1 : patienceRatio > 0.4 ? 0.5 : 0;

    this.state.combo++;
    const comboBonus = this.state.combo >= 3 ? this.state.combo * 5 : 0;

    const points = Math.round(total * 10 + speedBonus * 20 + comboBonus + customer.tip * 5);
    this.state.score += points;
    this.state.money += total + customer.tip;
    this.state.servedCount++;

    // Clear used tray items (ordered ones)
    let remaining = [...this.state.tray];
    for (const oid of customer.order) {
      const idx = remaining.findIndex(x => x.itemId === oid);
      if (idx !== -1) remaining.splice(idx, 1);
    }
    this.state.tray = remaining;

    // Mark customer served
    this._clearCustomerTimer(uid);
    customer.served = true;
    this.state.selectedCustomer = null;

    // Notifications
    let msg = `✅ Served ${customer.name}! +${points}pts`;
    if (this.state.combo >= 3) msg += ` 🔥 COMBO x${this.state.combo}!`;
    this.addNotif(msg, 'earn');
    this._showFloatScore(`+${points}`, 'plus');

    if (this.state.combo >= 3) this._showCombo();

    // Remove after animation
    setTimeout(() => {
      this.state.customers = this.state.customers.filter(c => c.uid !== uid);
      this._emit();

      // Spawn replacement
      if (this._spawned < this.level.maxCustomers) {
        setTimeout(() => this._spawnCustomer(), 1500);
      } else {
        this._checkEndCondition();
      }
    }, 600);

    this._emit();
  }

  _checkEndCondition() {
    const allSpawned = this._spawned >= this.level.maxCustomers;
    const noMoreCustomers = this.state.customers.filter(c => !c.served && !c.angry).length === 0;
    if (allSpawned && noMoreCustomers && this.state.customers.length === 0) {
      setTimeout(() => this._endGame(), 500);
    }
  }

  // ---- PAUSE / RESUME ----
  pause() {
    if (this.state.phase !== 'playing') return;
    this.state.phase = 'paused';
    clearInterval(this._tickInterval);
    for (const uid of Object.keys(this._customerTimers)) {
      clearInterval(this._customerTimers[uid]);
    }
    this._emit();
  }

  resume() {
    if (this.state.phase !== 'paused') return;
    this.state.phase = 'playing';
    this._tickInterval = setInterval(() => this._tick(), 200);
    // Restart customer timers
    for (const c of this.state.customers) {
      if (!c.served && !c.angry) {
        this._customerTimers[c.uid] = setInterval(() => this._tickCustomerPatience(c.uid), 1000);
      }
    }
    this._emit();
  }

  // ---- END ----
  _endGame() {
    if (this.state.phase === 'ended') return;
    this.state.phase = 'ended';
    clearInterval(this._tickInterval);
    for (const uid of Object.keys(this._customerTimers)) clearInterval(this._customerTimers[uid]);
    clearTimeout(this._spawnTimer);
    this._emit();
  }

  // ---- HELPERS ----
  _emit() {
    this.onStateChange({ ...this.state });
  }

  addNotif(msg, type = 'info') {
    const id = ++this._notifIdCounter;
    this.state.notifs = [...this.state.notifs.slice(-4), { id, msg, type }];
    setTimeout(() => {
      this.state.notifs = this.state.notifs.filter(n => n.id !== id);
      this._emit();
    }, 2500);
    this._emit();
  }

  _showFloatScore(val, type) {
    const event = new CustomEvent('floatscore', { detail: { val, type } });
    window.dispatchEvent(event);
  }

  _showCombo() {
    const event = new CustomEvent('comboshow', { detail: { combo: this.state.combo } });
    window.dispatchEvent(event);
  }

  destroy() {
    clearInterval(this._tickInterval);
    clearTimeout(this._spawnTimer);
    for (const uid of Object.keys(this._customerTimers)) clearInterval(this._customerTimers[uid]);
  }

  // ---- RESULT ----
  getResult() {
    const { score, money, servedCount, angryCount } = this.state;
    const thresholds = this.level.starThresholds;
    let stars = 0;
    if (score >= thresholds[2]) stars = 3;
    else if (score >= thresholds[1]) stars = 2;
    else if (score >= thresholds[0]) stars = 1;
    const passed = score >= this.level.targetScore;
    return { score, money, servedCount, angryCount, stars, passed };
  }
}
