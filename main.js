const SPRITE = "assets/sprites/";
const STATES = ["idle", "attack", "skill", "ultimate", "damage", "dead"];
const BUFF_TURNS = 3;
const MAX_STACKS = 3;
const SP_RECOVERY_PER_TURN = 30;
const MAX_TURNS = 20;
const RESULT_RETURN_DELAY = 3200;

const fallbackImages = {
  rider: "assets/sprites/placeholder_rider.png",
  monster: "assets/sprites/placeholder_monster.png",
  enemy: "assets/sprites/placeholder_enemy.png"
};

const baseParty = [
  {
    id: "p1",
    name: "リオ",
    role: "アタッカー",
    maxHp: 340,
    maxSp: 100,
    attack: 62,
    defense: 16,
    sprites: createDuoSprites("rider_a", "monster_a"),
    skills: [
      {
        id: "skill1",
        name: "火竜連撃",
        cost: 30,
        type: "damage",
        target: "enemy",
        multiplier: 1.7,
        state: "skill",
        description: "敵単体に1.7倍ダメージ。"
      },
      {
        id: "skill2",
        name: "砕甲斬",
        cost: 50,
        type: "damageDebuff",
        target: "enemy",
        multiplier: 1.25,
        debuff: "defenseDown",
        state: "skill",
        description: "敵単体に1.25倍ダメージ、防御ダウンを1段階付与。"
      }
    ],
    ultimate: {
      id: "ultimate",
      name: "紅蓮クロスブレイク",
      cost: 100,
      type: "damage",
      target: "enemy",
      multiplier: 3.2,
      state: "ultimate",
      description: "敵単体に3.2倍ダメージ。"
    }
  },
  {
    id: "p2",
    name: "ミナ",
    role: "サポート",
    maxHp: 300,
    maxSp: 100,
    attack: 42,
    defense: 14,
    sprites: createDuoSprites("rider_b", "monster_b"),
    skills: [
      {
        id: "skill1",
        name: "癒しの息吹",
        cost: 30,
        type: "heal",
        target: "ally",
        power: 120,
        state: "skill",
        description: "味方単体のHPを120回復。"
      },
      {
        id: "skill2",
        name: "鼓舞の旋律",
        cost: 50,
        type: "spBuff",
        target: "ally",
        spPower: 35,
        buff: "attackUp",
        state: "skill",
        description: "味方単体のSPを35回復し、攻撃アップを1段階付与。"
      }
    ],
    ultimate: {
      id: "ultimate",
      name: "生命の大号令",
      cost: 100,
      type: "partyHealBuff",
      target: "party",
      power: 140,
      buff: "attackUp",
      state: "ultimate",
      description: "味方全体のHPを140回復し、攻撃アップを1段階付与。"
    }
  },
  {
    id: "p3",
    name: "ガイ",
    role: "タンク",
    maxHp: 420,
    maxSp: 100,
    attack: 48,
    defense: 24,
    sprites: createDuoSprites("rider_c", "monster_c"),
    skills: [
      {
        id: "skill1",
        name: "守護挑発",
        cost: 30,
        type: "taunt",
        target: "self",
        buff: "defenseUp",
        state: "skill",
        description: "自身に防御アップを1段階付与し、3ターン敵に狙われやすくなる。"
      },
      {
        id: "skill2",
        name: "威圧突き",
        cost: 50,
        type: "damageDebuff",
        target: "enemy",
        multiplier: 1.2,
        debuff: "attackDown",
        state: "skill",
        description: "敵単体に1.2倍ダメージ、攻撃ダウンを1段階付与。"
      }
    ],
    ultimate: {
      id: "ultimate",
      name: "鉄壁の咆哮",
      cost: 100,
      type: "tankUltimate",
      target: "party",
      buff: "defenseUp",
      debuff: "attackDown",
      state: "ultimate",
      description: "味方全体に防御アップ、敵に攻撃ダウンを付与。"
    }
  }
];

const enemyTemplates = [
  {
    id: "black-dragon",
    name: "黒龍",
    role: "強敵",
    note: "高火力の単体攻撃と全体必殺。",
    maxHp: 1080,
    maxSp: 100,
    attack: 70,
    defense: 18,
    observeChance: 0.4,
    spriteKey: "enemy",
    skills: [
      {
        name: "黒炎噛み",
        cost: 40,
        type: "damage",
        target: "ally",
        multiplier: 1.55,
        state: "skill",
        description: "味方単体に強烈な攻撃。"
      }
    ],
    ultimate: {
      name: "黒焔大災",
      cost: 100,
      type: "aoeDamage",
      target: "party",
      multiplier: 1.85,
      state: "ultimate",
      description: "味方全体に2.25倍ダメージ。"
    }
  },
  {
    id: "rock-dragon",
    name: "岩龍",
    role: "未実装画像",
    note: "画像追加予定。今は仮画像で戦えます。",
    maxHp: 1360,
    maxSp: 100,
    attack: 82,
    defense: 30,
    observeChance: 0.3,
    spriteKey: "rock_enemy",
    skills: [
      {
        name: "岩砕き",
        cost: 40,
        type: "damageDebuff",
        target: "ally",
        multiplier: 1.75,
        debuff: "defenseDown",
        state: "skill",
        description: "味方単体に攻撃し、防御ダウンを付与。"
      }
    ],
    ultimate: {
      name: "大地崩落",
      cost: 100,
      type: "aoeDamage",
      target: "party",
      multiplier: 2.05,
      state: "ultimate",
      description: "味方全体に2.05倍ダメージ。"
    }
  },
  {
    id: "parasite",
    name: "パラサイト",
    role: "未実装画像",
    note: "画像追加予定。今は仮画像で戦えます。",
    maxHp: 1260,
    maxSp: 100,
    attack: 88,
    defense: 20,
    observeChance: 0.2,
    spriteKey: "parasite_enemy",
    skills: [
      {
        name: "寄生毒針",
        cost: 40,
        type: "damageDebuff",
        target: "ally",
        multiplier: 1.9,
        debuff: "attackDown",
        state: "skill",
        description: "味方単体に攻撃し、攻撃ダウンを付与。"
      }
    ],
    ultimate: {
      name: "群体侵食",
      cost: 100,
      type: "aoeDamage",
      target: "party",
      multiplier: 2.3,
      state: "ultimate",
      description: "味方全体に2.15倍ダメージ。"
    }
  }
];

const gameState = {
  turn: 1,
  currentUnitIndex: 0,
  phase: "select",
  pendingAction: null,
  locked: false,
  targetFocusUnitId: null,
  targetFocusTurns: 0,
  autoEnabled: false,
  autoTimer: null,
  logs: [],
  result: null,
  returnTimer: null
};

let party = [];
let enemy = null;

const dom = {
  selectScreen: document.getElementById("selectScreen"),
  enemySelectGrid: document.getElementById("enemySelectGrid"),
  battleScreen: document.getElementById("battleScreen"),
  commandPanel: document.getElementById("commandPanel"),
  resultOverlay: document.getElementById("resultOverlay"),
  resultText: document.getElementById("resultText"),
  enemyZone: document.getElementById("enemyZone"),
  partyZone: document.getElementById("partyZone"),
  messageLog: document.getElementById("messageLog"),
  battleLog: document.getElementById("battleLog"),
  turnNumber: document.getElementById("turnNumber"),
  phaseText: document.getElementById("phaseText"),
  activeUnitName: document.getElementById("activeUnitName"),
  commandGrid: document.getElementById("commandGrid"),
  targetPanel: document.getElementById("targetPanel"),
  targetList: document.getElementById("targetList"),
  cancelTarget: document.getElementById("cancelTarget"),
  skillDetail: document.getElementById("skillDetail"),
  autoButton: document.getElementById("autoButton"),
  resetButton: document.getElementById("resetButton")
};

function createDuoSprites(riderKey, monsterKey) {
  return {
    rider: makeSpriteSet(riderKey, "rider"),
    monster: makeSpriteSet(monsterKey, "monster")
  };
}

function createEnemySprites(key) {
  return {
    enemy: makeSpriteSet(key, "enemy")
  };
}

function makeSpriteSet(base, fallbackType) {
  return STATES.reduce((set, state) => {
    const realState = state === "skill" || state === "ultimate" ? "attack" : state;
    set[state] = `${SPRITE}${base}_${realState}.png`;
    return set;
  }, { fallback: fallbackImages[fallbackType] });
}

function cloneUnit(unit) {
  return {
    ...structuredClone(unit),
    sprites: unit.sprites,
    hp: unit.maxHp,
    sp: 0,
    buffs: {}
  };
}

function createEnemy(template) {
  return {
    ...structuredClone(template),
    id: "enemy",
    hp: template.maxHp,
    sp: 0,
    sprites: createEnemySprites(template.spriteKey),
    buffs: {},
    chargingUltimate: false
  };
}

function renderEnemySelection() {
  dom.enemySelectGrid.innerHTML = enemyTemplates.map((template) => {
    const sprites = createEnemySprites(template.spriteKey);
    return `
      <button class="enemy-select-card" type="button" data-enemy-id="${template.id}">
        <img src="${sprites.enemy.idle}" alt="${template.name}" onerror="this.src='${sprites.enemy.fallback}'">
        <span class="select-name">${template.name}</span>
        <span class="select-note">${template.note}</span>
      </button>
    `;
  }).join("");
}

function startBattle(enemyId) {
  const template = enemyTemplates.find((item) => item.id === enemyId) ?? enemyTemplates[0];
  party = baseParty.map(cloneUnit);
  enemy = createEnemy(template);

  Object.assign(gameState, {
    turn: 1,
    currentUnitIndex: 0,
    phase: "player",
    pendingAction: null,
    locked: false,
    targetFocusUnitId: null,
    targetFocusTurns: 0,
    autoEnabled: false,
    logs: [],
    result: null
  });

  clearTimeout(gameState.returnTimer);
  dom.selectScreen.hidden = true;
  dom.battleScreen.hidden = false;
  dom.commandPanel.hidden = false;
  dom.resultOverlay.hidden = true;
  log(`${enemy.name}が現れた。コマンドを選択してください。`);
  render();
}

function returnToSelect() {
  clearTimeout(gameState.returnTimer);
  gameState.phase = "select";
  gameState.result = null;
  gameState.locked = false;
  gameState.autoEnabled = false;
  clearTimeout(gameState.autoTimer);
  party = [];
  enemy = null;
  hideTargets();
  dom.selectScreen.hidden = false;
  dom.battleScreen.hidden = true;
  dom.commandPanel.hidden = true;
  dom.resultOverlay.hidden = true;
}

function render() {
  if (gameState.phase === "select" || !enemy) return;
  renderEnemy();
  renderParty();
  renderCommands();
  dom.turnNumber.textContent = gameState.turn;
  dom.phaseText.textContent = getPhaseText();
  scheduleAutoTurn();
}

function renderEnemy() {
  dom.enemyZone.innerHTML = unitCard(enemy, true);
}

function renderParty() {
  dom.partyZone.innerHTML = party.map((unit, index) => unitCard(unit, false, index)).join("");
}

function unitCard(unit, isEnemy, index = -1) {
  const hpRate = Math.max(0, unit.hp / unit.maxHp) * 100;
  const spRate = Math.max(0, unit.sp / unit.maxSp) * 100;
  const active = !isEnemy && gameState.phase === "player" && gameState.currentUnitIndex === index && isAlive(unit);
  const sprites = isEnemy
    ? `<img class="sprite" data-part="enemy" src="${unit.sprites.enemy.idle}" alt="${unit.name}" onerror="this.src='${unit.sprites.enemy.fallback}'">`
    : `<img class="sprite" data-part="rider" src="${unit.sprites.rider.idle}" alt="${unit.name}のライダー" onerror="this.src='${unit.sprites.rider.fallback}'">
       <img class="sprite" data-part="monster" src="${unit.sprites.monster.idle}" alt="${unit.name}のオトモン" onerror="this.src='${unit.sprites.monster.fallback}'">`;

  return `
    <article class="unit-card ${isEnemy ? "enemy" : ""} ${active ? "active" : ""} ${isAlive(unit) ? "" : "dead"}" data-unit-id="${unit.id}">
      <div class="unit-name"><span>${unit.name}</span><span class="role">${unit.role}</span></div>
      <div class="sprite-stage"><div class="duo">${sprites}</div></div>
      <div class="stats">
        <div class="bar-row"><span>HP</span><div class="bar"><div class="bar-fill" style="width:${hpRate}%"></div></div><span>${unit.hp}/${unit.maxHp}</span></div>
        <div class="bar-row"><span>SP</span><div class="bar"><div class="bar-fill sp-fill" style="width:${spRate}%"></div></div><span>${unit.sp}/${unit.maxSp}</span></div>
        <div class="buff-row">${renderBuffs(unit)}</div>
      </div>
    </article>
  `;
}

function renderBuffs(unit) {
  return Object.entries(unit.buffs)
    .filter(([, value]) => value.turns > 0 && value.stacks > 0)
    .map(([key, value]) => `<span class="buff-chip">${buffLabel(key)} ${value.stacks}/${value.turns}T</span>`)
    .join("");
}

function renderCommands() {
  const unit = getActiveUnit();
  const ended = Boolean(gameState.result);
  dom.activeUnitName.textContent = unit ? unit.name : "-";
  dom.autoButton.textContent = gameState.autoEnabled ? "AUTO ON" : "AUTO OFF";
  dom.autoButton.classList.toggle("active", gameState.autoEnabled);

  const actions = {
    attack: { label: "攻撃", disabled: ended || !unit },
    skill1: { label: unit?.skills[0]?.name ?? "スキル1", disabled: ended || !unit || unit.sp < (unit?.skills[0]?.cost ?? 0) },
    skill2: { label: unit?.skills[1]?.name ?? "スキル2", disabled: ended || !unit || unit.sp < (unit?.skills[1]?.cost ?? 0) },
    ultimate: { label: unit?.ultimate?.name ?? "必殺技", disabled: ended || !unit || unit.sp < 100 }
  };

  [...dom.commandGrid.querySelectorAll("button")].forEach((button) => {
    const action = button.dataset.action;
    button.textContent = actions[action].label;
    button.disabled = actions[action].disabled || gameState.locked || gameState.autoEnabled || gameState.phase !== "player";
  });

  updateSkillDetail();
}

function toggleAuto() {
  if (gameState.phase === "select" || gameState.result) return;
  gameState.autoEnabled = !gameState.autoEnabled;
  hideTargets();
  clearTimeout(gameState.autoTimer);
  render();
}

function scheduleAutoTurn() {
  clearTimeout(gameState.autoTimer);
  if (!gameState.autoEnabled || gameState.locked || gameState.result || gameState.phase !== "player") return;
  if (!getActiveUnit() || !isAlive(getActiveUnit())) return;
  gameState.autoTimer = setTimeout(executeAutoTurn, 420);
}

function executeAutoTurn() {
  if (!gameState.autoEnabled || gameState.locked || gameState.result || gameState.phase !== "player") return;
  const unit = getActiveUnit();
  if (!unit || !isAlive(unit)) return;

  const decision = chooseAutoAction(unit);
  if (!decision) return;
  log(`${unit.name}はAUTOで${decision.action.name}を選択。`);
  executePlayerAction(unit, decision.action, decision.target);
}

function chooseAutoAction(unit) {
  if (unit.id === "p2") return chooseSupportAction(unit);
  if (unit.id === "p3") return chooseTankAction(unit);
  return chooseAttackerAction(unit);
}

function chooseAttackerAction(unit) {
  if (unit.sp >= unit.ultimate.cost) {
    return { action: unit.ultimate, target: enemy };
  }

  const defenseDownStacks = stackOf(enemy, "defenseDown");
  if (unit.sp >= unit.skills[1].cost && defenseDownStacks < 3) {
    return { action: unit.skills[1], target: enemy };
  }

  if (unit.sp >= unit.skills[0].cost) {
    return { action: unit.skills[0], target: enemy };
  }

  return { action: commandToAction("attack"), target: enemy };
}

function chooseSupportAction(unit) {
  const aliveParty = party.filter(isAlive);
  const lowestHp = [...aliveParty].sort((a, b) => (a.hp / a.maxHp) - (b.hp / b.maxHp))[0];
  const hurtCount = aliveParty.filter((ally) => ally.hp / ally.maxHp <= 0.72).length;

  if (unit.sp >= unit.ultimate.cost && hurtCount >= 2) {
    return { action: unit.ultimate, target: aliveParty };
  }

  if (unit.sp >= unit.skills[0].cost && lowestHp && lowestHp.hp / lowestHp.maxHp <= 0.58) {
    return { action: unit.skills[0], target: lowestHp };
  }

  const attacker = party.find((ally) => ally.id === "p1" && isAlive(ally));
  if (unit.sp >= unit.skills[1].cost && attacker && attacker.sp <= 70 && stackOf(attacker, "attackUp") < 3) {
    return { action: unit.skills[1], target: attacker };
  }

  if (unit.sp >= unit.skills[0].cost && lowestHp && lowestHp.hp / lowestHp.maxHp <= 0.78) {
    return { action: unit.skills[0], target: lowestHp };
  }

  return { action: commandToAction("attack"), target: enemy };
}

function chooseTankAction(unit) {
  if (unit.sp >= unit.ultimate.cost && stackOf(enemy, "attackDown") < 3) {
    return { action: unit.ultimate, target: party.filter(isAlive) };
  }

  if (unit.sp >= unit.skills[1].cost && stackOf(enemy, "attackDown") < 3) {
    return { action: unit.skills[1], target: enemy };
  }

  const shouldTaunt = gameState.targetFocusUnitId !== unit.id || stackOf(unit, "defenseUp") < 2;
  if (unit.sp >= unit.skills[0].cost && shouldTaunt && unit.hp / unit.maxHp > 0.42) {
    return { action: unit.skills[0], target: unit };
  }

  return { action: commandToAction("attack"), target: enemy };
}

function updateSkillDetail(text) {
  if (text) {
    dom.skillDetail.textContent = text;
    return;
  }

  const unit = getActiveUnit();
  if (!unit) {
    dom.skillDetail.textContent = gameState.result ?? "行動できるユニットがいません。";
    return;
  }

  dom.skillDetail.textContent = [
    `攻撃: 通常ダメージ。`,
    `${unit.skills[0].name}: SP${unit.skills[0].cost} / ${unit.skills[0].description}`,
    `${unit.skills[1].name}: SP${unit.skills[1].cost} / ${unit.skills[1].description}`,
    `${unit.ultimate.name}: SP100 / ${unit.ultimate.description}`
  ].join(" ");
}

function getPhaseText() {
  if (gameState.result) return gameState.result;
  if (gameState.phase === "enemy") return "敵の行動";
  return `${getActiveUnit()?.name ?? "味方"}の行動`;
}

function getActiveUnit() {
  return party[gameState.currentUnitIndex] ?? null;
}

function isAlive(unit) {
  return unit.hp > 0;
}

function commandToAction(command) {
  const unit = getActiveUnit();
  if (!unit) return null;

  if (command === "attack") {
    return {
      id: "attack",
      name: "攻撃",
      cost: 0,
      type: "damage",
      target: "enemy",
      multiplier: 1,
      state: "attack",
      description: "敵単体に通常ダメージ。"
    };
  }
  if (command === "skill1") return unit.skills[0];
  if (command === "skill2") return unit.skills[1];
  return unit.ultimate;
}

function beginPlayerAction(command) {
  if (gameState.locked || gameState.result) return;
  const unit = getActiveUnit();
  const action = commandToAction(command);
  if (!unit || !action || unit.sp < action.cost) return;

  gameState.pendingAction = action;
  if (action.target === "ally") {
    showTargets(party.filter(isAlive));
    updateSkillDetail(`${action.name}: 対象の味方を選択してください。`);
    return;
  }

  if (action.target === "self") {
    executePlayerAction(unit, action, unit);
    return;
  }

  executePlayerAction(unit, action, action.target === "enemy" ? enemy : party.filter(isAlive));
}

function showTargets(targets) {
  dom.targetPanel.hidden = false;
  dom.targetList.innerHTML = targets
    .map((target) => `<button type="button" data-target-id="${target.id}">${target.name}</button>`)
    .join("");
}

function hideTargets() {
  gameState.pendingAction = null;
  dom.targetPanel.hidden = true;
  dom.targetList.innerHTML = "";
  updateSkillDetail();
}

async function executePlayerAction(unit, action, target) {
  hideTargets();
  gameState.locked = true;
  unit.sp = Math.max(0, unit.sp - action.cost);
  await playAction(unit, target, action);
  checkBattleEnd();
  gameState.locked = false;
  if (!gameState.result) advancePlayerTurn();
  render();
}

async function playAction(actor, target, action) {
  setUnitState(actor.id, action.state ?? "attack", "acting");
  await wait(260);
  applyAction(actor, target, action);
  await wait(360);
  setUnitState(actor.id, "idle");
}

function applyAction(actor, target, action) {
  if (action.type === "damage") {
    applyDamage(actor, target, action.multiplier, action.name);
  } else if (action.type === "damageDebuff") {
    applyDamage(actor, target, action.multiplier, action.name);
    addBuff(target, action.debuff);
    log(`${target.name}に${buffLabel(action.debuff)}を付与。`);
  } else if (action.type === "heal") {
    heal(target, action.power, action.name);
  } else if (action.type === "spBuff") {
    recoverSp(target, action.spPower);
    addBuff(target, action.buff);
    log(`${actor.name}の${action.name}。${target.name}のSP回復、${buffLabel(action.buff)}を付与。`);
  } else if (action.type === "partyHealBuff") {
    party.filter(isAlive).forEach((ally) => {
      heal(ally, action.power, action.name, false);
      addBuff(ally, action.buff);
    });
    log(`${actor.name}の${action.name}。味方全体を回復し、${buffLabel(action.buff)}を付与。`);
  } else if (action.type === "taunt") {
    addBuff(actor, action.buff);
    gameState.targetFocusUnitId = actor.id;
    gameState.targetFocusTurns = BUFF_TURNS;
    log(`${actor.name}の${action.name}。敵の注意を引きつけた。`);
  } else if (action.type === "tankUltimate") {
    party.filter(isAlive).forEach((ally) => addBuff(ally, action.buff));
    addBuff(enemy, action.debuff);
    gameState.targetFocusUnitId = actor.id;
    gameState.targetFocusTurns = BUFF_TURNS;
    log(`${actor.name}の${action.name}。味方の守りを固め、敵の攻撃を弱めた。`);
  } else if (action.type === "aoeDamage") {
    party.filter(isAlive).forEach((ally) => applyDamage(actor, ally, action.multiplier, action.name, false));
    log(`${actor.name}の${action.name}。味方全体が攻撃を受けた。`);
  }
}

function applyDamage(actor, target, multiplier, actionName, shouldLog = true) {
  const attack = getEffectiveStat(actor, "attack");
  const defense = getEffectiveStat(target, "defense");
  const damage = Math.max(1, Math.floor((attack - defense) * multiplier));
  target.hp = Math.max(0, target.hp - damage);
  setUnitState(target.id, target.hp === 0 ? "dead" : "damage", "damaged");
  if (shouldLog) log(`${actor.name}の${actionName}。${target.name}に${damage}ダメージ。`);
}

function heal(target, amount, actionName, shouldLog = true) {
  const before = target.hp;
  target.hp = Math.min(target.maxHp, target.hp + amount);
  if (shouldLog) log(`${actionName}。${target.name}のHPが${target.hp - before}回復。`);
}

function recoverSp(target, amount) {
  target.sp = Math.min(target.maxSp, target.sp + amount);
}

function getEffectiveStat(unit, stat) {
  let value = unit[stat];
  if (stat === "attack") {
    value += stackOf(unit, "attackUp") * 10;
    value -= stackOf(unit, "attackDown") * 10;
  }
  if (stat === "defense") {
    value += stackOf(unit, "defenseUp") * 8;
    value -= stackOf(unit, "defenseDown") * 8;
  }
  return Math.max(1, value);
}

function stackOf(unit, key) {
  return unit.buffs[key]?.stacks ?? 0;
}

function addBuff(unit, key) {
  if (!unit || !key) return;
  if (!unit.buffs[key]) unit.buffs[key] = { stacks: 0, turns: 0 };
  unit.buffs[key].stacks = Math.min(MAX_STACKS, unit.buffs[key].stacks + 1);
  unit.buffs[key].turns = BUFF_TURNS;
}

function tickBuffs() {
  [...party, enemy].filter(Boolean).forEach((unit) => {
    Object.keys(unit.buffs).forEach((key) => {
      if (unit.buffs[key].turns > 0) unit.buffs[key].turns -= 1;
      if (unit.buffs[key].turns <= 0) unit.buffs[key].stacks = 0;
    });
  });

  if (gameState.targetFocusTurns > 0) gameState.targetFocusTurns -= 1;
  if (gameState.targetFocusTurns <= 0) gameState.targetFocusUnitId = null;
}

function buffLabel(key) {
  return {
    attackUp: "攻撃↑",
    defenseUp: "防御↑",
    attackDown: "攻撃↓",
    defenseDown: "防御↓"
  }[key] ?? key;
}

function advancePlayerTurn() {
  gameState.currentUnitIndex += 1;
  while (party[gameState.currentUnitIndex] && !isAlive(party[gameState.currentUnitIndex])) {
    gameState.currentUnitIndex += 1;
  }

  if (gameState.currentUnitIndex >= party.length) {
    gameState.phase = "enemy";
    render();
    setTimeout(enemyTurn, 500);
  }
}

async function enemyTurn() {
  if (gameState.result) return;
  gameState.locked = true;

  if (!enemy.chargingUltimate && Math.random() < (enemy.observeChance ?? 0)) {
    log(`${enemy.name}はこちらの様子をみている。`);
    await wait(700);
    endTurn();
    gameState.locked = false;
    render();
    return;
  }

  if (enemy.chargingUltimate) {
    enemy.chargingUltimate = false;
    enemy.sp = 0;
    await playAction(enemy, party.filter(isAlive), enemy.ultimate);
    checkBattleEnd();
    if (!gameState.result) endTurn();
    gameState.locked = false;
    render();
    return;
  }

  enemy.sp = Math.min(enemy.maxSp, enemy.sp + 55);

  if (enemy.sp >= enemy.maxSp) {
    enemy.chargingUltimate = true;
    log(`${enemy.name}が力を溜めている。次の敵行動で${enemy.ultimate.name}が来る！`);
    await wait(800);
    endTurn();
    gameState.locked = false;
    render();
    return;
  }

  const action = enemy.sp >= enemy.skills[0].cost
      ? enemy.skills[0]
      : { name: "爪撃", cost: 0, type: "damage", target: "ally", multiplier: 1.35, state: "attack" };

  enemy.sp = Math.max(0, enemy.sp - action.cost);
  const target = action.target === "party" ? party.filter(isAlive) : chooseEnemyTarget();
  await playAction(enemy, target, action);

  checkBattleEnd();
  if (!gameState.result) endTurn();
  gameState.locked = false;
  render();
}

function chooseEnemyTarget() {
  const focused = party.find((unit) => unit.id === gameState.targetFocusUnitId && isAlive(unit));
  if (focused) return focused;

  const candidates = party.filter(isAlive);
  return candidates[Math.floor(Math.random() * candidates.length)];
}

function endTurn() {
  tickBuffs();
  party.filter(isAlive).forEach((unit) => recoverSp(unit, SP_RECOVERY_PER_TURN));
  gameState.turn += 1;
  gameState.currentUnitIndex = 0;
  gameState.phase = "player";
  while (party[gameState.currentUnitIndex] && !isAlive(party[gameState.currentUnitIndex])) {
    gameState.currentUnitIndex += 1;
  }
  log(`ターン終了。味方全員のSPが${SP_RECOVERY_PER_TURN}回復。`);
  checkBattleEnd();
}

function checkBattleEnd() {
  if (gameState.result) return;

  if (enemy.hp <= 0) {
    finishBattle("victory");
    return;
  }

  if (party.every((unit) => unit.hp <= 0)) {
    finishBattle("defeat");
    return;
  }

  if (gameState.turn > MAX_TURNS) {
    finishBattle("defeat");
  }
}

function finishBattle(result) {
  gameState.result = result === "victory" ? "勝利！" : "敗北...";
  gameState.locked = true;
  hideTargets();
  render();
  log(result === "victory" ? `${enemy.name}を討伐しました。` : "戦闘不能です。");
  dom.resultText.textContent = gameState.result;
  dom.resultOverlay.hidden = false;
  gameState.returnTimer = setTimeout(returnToSelect, RESULT_RETURN_DELAY);
}

function setUnitState(unitId, state, className = "") {
  const card = document.querySelector(`[data-unit-id="${unitId}"]`);
  const unit = unitId === "enemy" ? enemy : party.find((member) => member.id === unitId);
  if (!card || !unit) return;

  card.classList.remove("acting", "damaged");
  if (className) card.classList.add(className);

  const safeState = state === "dead" ? "damage" : state;
  if (unit.sprites.enemy) {
    setImg(card.querySelector("[data-part='enemy']"), unit.sprites.enemy, safeState);
  } else {
    setImg(card.querySelector("[data-part='rider']"), unit.sprites.rider, safeState);
    setImg(card.querySelector("[data-part='monster']"), unit.sprites.monster, safeState);
  }

  setTimeout(() => {
    card.classList.remove("acting", "damaged");
    if (isAlive(unit)) {
      if (unit.sprites.enemy) setImg(card.querySelector("[data-part='enemy']"), unit.sprites.enemy, "idle");
      else {
        setImg(card.querySelector("[data-part='rider']"), unit.sprites.rider, "idle");
        setImg(card.querySelector("[data-part='monster']"), unit.sprites.monster, "idle");
      }
    }
  }, 520);
}

function setImg(img, spriteSet, state) {
  if (!img) return;
  img.src = spriteSet[state] || spriteSet.idle;
}

function log(message) {
  dom.messageLog.textContent = message;
  if (gameState.phase !== "select") {
    gameState.logs.unshift(message);
    gameState.logs = gameState.logs.slice(0, 8);
    renderBattleLog();
  }
}

function renderBattleLog() {
  if (!dom.battleLog) return;
  dom.battleLog.innerHTML = gameState.logs
    .map((entry) => `<div class="battle-log-line">${entry}</div>`)
    .join("");
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

dom.enemySelectGrid.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-enemy-id]");
  if (!button) return;
  startBattle(button.dataset.enemyId);
});

dom.commandGrid.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  beginPlayerAction(button.dataset.action);
});

dom.targetList.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-target-id]");
  if (!button || !gameState.pendingAction) return;
  const target = party.find((unit) => unit.id === button.dataset.targetId);
  if (target) executePlayerAction(getActiveUnit(), gameState.pendingAction, target);
});

dom.cancelTarget.addEventListener("click", hideTargets);
dom.autoButton.addEventListener("click", toggleAuto);
dom.resetButton.addEventListener("click", returnToSelect);

renderEnemySelection();
