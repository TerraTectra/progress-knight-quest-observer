const observerRankData = {
    trash: { name: "Trash", speed: 0.52, op: 0.45, xp: 0.55, mistake: 2.7, colorClass: "trash", description: "Panics, wastes routes, and often loses clean streaks." },
    common: { name: "Common", speed: 0.82, op: 0.78, xp: 0.85, mistake: 1.35, colorClass: "common", description: "Slow and plain, but can finish simple loops." },
    skilled: { name: "Skilled", speed: 1.05, op: 1.05, xp: 1.05, mistake: 0.95, colorClass: "skilled", description: "Keeps a stable route through Evil and Void." },
    rare: { name: "Rare", speed: 1.3, op: 1.35, xp: 1.25, mistake: 0.68, colorClass: "rare", description: "Plans around unlocks and avoids most dead runs." },
    epic: { name: "Epic", speed: 1.62, op: 1.85, xp: 1.55, mistake: 0.42, colorClass: "epic", description: "Adapts quickly to distorted universes." },
    legendary: { name: "Legendary", speed: 2.08, op: 2.65, xp: 2.05, mistake: 0.2, colorClass: "legendary", description: "Nearly optimal routing toward Universe X." },
}

const observerCommandData = {
    balanced: { name: "Balanced", speed: 1, op: 1, mistake: 1, xp: 1, description: "No major bias. Subjects route normally." },
    safe: { name: "Safe economy", speed: 0.86, op: 1.1, mistake: 0.65, xp: 1.04, description: "Slower runs, fewer bankruptcies and wasted loops." },
    rush: { name: "Rush breaks", speed: 1.32, op: 0.9, mistake: 1.42, xp: 0.96, description: "Pushes hard toward next universe, but creates more errors." },
    study: { name: "Study focus", speed: 1.02, op: 1.04, mistake: 0.9, xp: 1.18, description: "Better AI XP growth and smoother routing." },
}

const observerUpgradeData = {
    clear_instructions: { name: "Clear Instructions", baseCost: 12, costMult: 2.25, description: "+10% subject speed per level." },
    shared_memory: { name: "Shared Memory", baseCost: 18, costMult: 2.35, description: "+12% Observer Point gain per level." },
    error_filter: { name: "Error Filter", baseCost: 25, costMult: 2.45, description: "-8% mistake chance per level, capped at -70%." },
    talent_shaping: { name: "Talent Shaping", baseCost: 45, costMult: 2.65, description: "Improves rank odds for new subjects." },
    universe_briefing: { name: "Universe Briefing", baseCost: 70, costMult: 2.8, description: "Subjects handle later universes faster." },
}

const observerSubjectStages = [
    { id: "life", name: "Prime life", job: "Beggar", skill: "Concentration", universe: 1, threshold: 80, opWeight: 1, difficulty: 1 },
    { id: "rebirth", name: "Amulet loop", job: "Farmer", skill: "Productivity", universe: 1, threshold: 190, opWeight: 1.15, difficulty: 1.05 },
    { id: "evil", name: "Evil route", job: "Squire", skill: "Dark influence", universe: 1, threshold: 360, opWeight: 1.45, difficulty: 1.16 },
    { id: "void", name: "Void approach", job: "Void slave", skill: "Void manipulation", universe: 1, threshold: 620, opWeight: 1.8, difficulty: 1.28 },
    { id: "multiverse", name: "Multiverse signal", job: "Void explorer", skill: "Reality Surveying", universe: 1, threshold: 980, opWeight: 2.15, difficulty: 1.42 },
    { id: "u2", name: "Universe II", job: "Royal clerk", skill: "Royal Administration", universe: 2, threshold: 1430, opWeight: 2.75, difficulty: 1.62 },
    { id: "u3", name: "Universe III", job: "Arcane auditor", skill: "Arcane Taxation", universe: 3, threshold: 1980, opWeight: 3.25, difficulty: 1.82 },
    { id: "u4", name: "Universe IV", job: "Time debtor", skill: "Temporal Anchoring", universe: 4, threshold: 2660, opWeight: 3.9, difficulty: 2.08 },
    { id: "u5", name: "Universe V", job: "Star broker", skill: "Greed Accounting", universe: 5, threshold: 3500, opWeight: 4.7, difficulty: 2.38 },
    { id: "u6", name: "Universe VI", job: "Void scavenger", skill: "Dimming Resonance", universe: 6, threshold: 4540, opWeight: 5.7, difficulty: 2.72 },
    { id: "u7", name: "Universe VII", job: "Causality runner", skill: "Causal Threading", universe: 7, threshold: 5840, opWeight: 6.8, difficulty: 3.08 },
    { id: "u8", name: "Universe VIII", job: "Broken climber", skill: "Ladder Reconstruction", universe: 8, threshold: 7480, opWeight: 8.2, difficulty: 3.5 },
    { id: "u9", name: "Universe IX", job: "Collapse keeper", skill: "Collapse Containment", universe: 9, threshold: 9580, opWeight: 10, difficulty: 4 },
    { id: "u10", name: "Universe X", job: "Threshold witness", skill: "Witness Preparation", universe: 10, threshold: 12300, opWeight: 13, difficulty: 4.65 },
]

function getSafeObserverNumber(value, fallback = 0, max = 1e308) {
    if (value == null || isNaN(value) || !isFinite(value))
        return fallback

    return Math.max(0, Math.min(max, value))
}

function getObserverState() {
    if (gameData.observer == null)
        gameData.observer = {}

    const state = gameData.observer
    if (state.active == null)
        state.active = false
    if (state.points == null || isNaN(state.points))
        state.points = 0
    if (state.lifetime_points == null || isNaN(state.lifetime_points))
        state.lifetime_points = 0
    if (state.subjects == null)
        state.subjects = []
    if (state.command == null || observerCommandData[state.command] == null)
        state.command = "balanced"
    if (state.next_subject_id == null)
        state.next_subject_id = state.subjects.length + 1
    if (state.upgrades == null)
        state.upgrades = {}

    for (const key in observerUpgradeData) {
        if (state.upgrades[key] == null)
            state.upgrades[key] = 0
    }

    for (const subject of state.subjects) {
        normalizeObserverSubject(subject, state)
    }

    return state
}

function normalizeObserverSubject(subject, state = null) {
    if (subject.id == null)
        subject.id = state != null ? state.next_subject_id++ : gameData.observer.next_subject_id++
    if (subject.rank == null || observerRankData[subject.rank] == null)
        subject.rank = "trash"
    if (subject.name == null)
        subject.name = "Subject " + subject.id
    if (subject.stage_index == null || isNaN(subject.stage_index))
        subject.stage_index = 0
    if (subject.progress == null || isNaN(subject.progress))
        subject.progress = 0
    if (subject.mistakes == null || isNaN(subject.mistakes))
        subject.mistakes = 0
    if (subject.clean_time == null || isNaN(subject.clean_time))
        subject.clean_time = 0
    if (subject.best_clean_time == null || isNaN(subject.best_clean_time))
        subject.best_clean_time = subject.clean_time
    if (subject.completed_universe_x == null || isNaN(subject.completed_universe_x))
        subject.completed_universe_x = 0
    if (subject.ai_level == null || isNaN(subject.ai_level))
        subject.ai_level = 1
    if (subject.ai_xp == null || isNaN(subject.ai_xp))
        subject.ai_xp = 0
    if (subject.route_resets == null || isNaN(subject.route_resets))
        subject.route_resets = 0
    if (subject.last_action == null)
        subject.last_action = "Waking up in Prime World."

    subject.stage_index = Math.max(0, Math.min(observerSubjectStages.length - 1, Math.floor(subject.stage_index)))
    subject.progress = Math.max(0, subject.progress)
}

function hasObserverFinalGate() {
    if (gameData == null || typeof getMultiverseState !== "function" || typeof isMultiverseUnlocked !== "function" || typeof getHighestUniverseId !== "function")
        return false

    const multiverse = getMultiverseState()
    return isMultiverseUnlocked()
        && getHighestUniverseId() >= 10
        && (multiverse.observer_signal_prepared || multiverse.observer_entry_claimed)
}

function canEnterObserverLayer() {
    if (gameData == null || typeof getMultiverseState !== "function" || typeof isMultiverseUnlocked !== "function" || typeof getHighestUniverseId !== "function")
        return false

    const multiverse = getMultiverseState()
    return isMultiverseUnlocked()
        && getHighestUniverseId() >= 10
        && multiverse.observer_signal_prepared
}

function isObserverUnlocked() {
    if (gameData == null)
        return false

    const state = getObserverState()
    if (!state.active)
        return false

    if (!hasObserverFinalGate()) {
        state.active = false
        return false
    }

    return true
}

function isObserverActive() {
    return isObserverUnlocked()
}

function enterObserverLayer() {
    if (!canEnterObserverLayer())
        return false

    const state = getObserverState()
    const multiverse = typeof getMultiverseState === "function" ? getMultiverseState() : null
    state.active = true

    if (multiverse != null && !multiverse.observer_entry_claimed)
        grantObserverEntryLegacy(multiverse)

    if (state.subjects.length == 0)
        createObserverSubject(true)

    setTab("observer")
    updateObserverVisibility()
    return true
}

function grantObserverEntryLegacy(multiverse) {
    const state = getObserverState()
    const signal = typeof getObserverSignalStrength === "function" ? getObserverSignalStrength() : 0
    const bonusPoints = Math.max(10, Math.sqrt(Math.max(1, signal)) * 2.5)

    state.points += bonusPoints
    state.lifetime_points += bonusPoints
    state.upgrades.clear_instructions = Math.max(state.upgrades.clear_instructions || 0, 1)

    if (state.subjects.length == 0) {
        const subject = createObserverSubject(true)
        subject.ai_xp += Math.min(45, signal * 0.08)
        subject.last_action = "Inherited a fragment of the Observer Signal."
    }

    multiverse.observer_entry_claimed = true
}

function getObserverUpgradeLevel(upgrade) {
    return getObserverState().upgrades[upgrade] || 0
}

function getObserverUpgradeCost(upgrade) {
    const data = observerUpgradeData[upgrade]
    return data.baseCost * Math.pow(data.costMult, getObserverUpgradeLevel(upgrade))
}

function buyObserverUpgrade(upgrade) {
    const state = getObserverState()
    const cost = getObserverUpgradeCost(upgrade)
    if (state.points < cost)
        return false

    state.points -= cost
    state.upgrades[upgrade] += 1
    return true
}

function getObserverSubjectCost() {
    const state = getObserverState()
    if (state.subjects.length == 0)
        return 0

    return 35 * Math.pow(1.78, state.subjects.length - 1)
}

function buyObserverSubject() {
    const cost = getObserverSubjectCost()
    const state = getObserverState()
    if (state.points < cost)
        return false

    state.points -= cost
    createObserverSubject(false)
    return true
}

function createObserverSubject(freeSubject) {
    const state = getObserverState()
    const id = state.next_subject_id++
    const rank = freeSubject && state.subjects.length == 0 ? "trash" : rollObserverRank()

    const subject = {
        id,
        name: getObserverSubjectName(id),
        rank,
        stage_index: 0,
        progress: 0,
        mistakes: 0,
        clean_time: 0,
        best_clean_time: 0,
        completed_universe_x: 0,
        ai_level: 1,
        ai_xp: 0,
        route_resets: 0,
        last_action: "Started a fresh Progress Knight run.",
    }

    state.subjects.push(subject)
    return subject
}

function getObserverSubjectName(id) {
    const names = ["Acolyte", "Echo", "Thread", "Pupil", "Mirror", "Cipher", "Witness", "Novice", "Vessel", "Trace"]
    return names[(id - 1) % names.length] + " " + id
}

function rollObserverRank() {
    const shaping = getObserverUpgradeLevel("talent_shaping")
    const roll = Math.random()
    const legendary = Math.min(0.08, 0.008 + shaping * 0.004)
    const epic = legendary + Math.min(0.16, 0.035 + shaping * 0.008)
    const rare = epic + Math.min(0.28, 0.105 + shaping * 0.011)
    const skilled = rare + Math.min(0.36, 0.23 + shaping * 0.008)
    const common = skilled + 0.36

    if (roll < legendary)
        return "legendary"
    if (roll < epic)
        return "epic"
    if (roll < rare)
        return "rare"
    if (roll < skilled)
        return "skilled"
    if (roll < common)
        return "common"
    return "trash"
}

function setObserverCommand(command) {
    if (observerCommandData[command] == null)
        return false

    getObserverState().command = command
    return true
}

function getObserverCommand() {
    const state = getObserverState()
    return observerCommandData[state.command] || observerCommandData.balanced
}

function getObserverAiLevelSpeed(subject) {
    return 1 + Math.log2(Math.max(1, subject.ai_level)) * 0.055
}

function getObserverAiLevelOp(subject) {
    return 1 + Math.log2(Math.max(1, subject.ai_level)) * 0.045
}

function getObserverAiLevelMistake(subject) {
    return Math.max(0.58, 1 - Math.log2(Math.max(1, subject.ai_level)) * 0.035)
}

function getObserverMistakeMultiplier() {
    const reduction = Math.min(0.7, getObserverUpgradeLevel("error_filter") * 0.08)
    return 1 - reduction
}

function getObserverSpeedMultiplier(subject) {
    const rank = observerRankData[subject.rank]
    const command = getObserverCommand()
    const stage = getObserverSubjectStage(subject)
    const instructions = 1 + getObserverUpgradeLevel("clear_instructions") * 0.1
    const briefing = 1 + Math.max(0, stage.universe - 1) * getObserverUpgradeLevel("universe_briefing") * 0.03
    const cleanBonus = getObserverCleanSpeedBonus(subject)
    return getSafeObserverNumber(rank.speed * command.speed * instructions * briefing * cleanBonus * getObserverAiLevelSpeed(subject) / stage.difficulty, 0)
}

function getObserverCleanSpeedBonus(subject) {
    return 1 + Math.min(0.45, Math.log10(subject.clean_time + 10) * 0.09)
}

function getObserverCleanXpBonus(subject) {
    return 1 + Math.min(1.25, Math.log10(subject.clean_time + 10) * 0.16)
}

function getObserverSubjectOpGain(subject) {
    const rank = observerRankData[subject.rank]
    const command = getObserverCommand()
    const memory = 1 + getObserverUpgradeLevel("shared_memory") * 0.12
    const stage = getObserverSubjectStage(subject)
    const universeValue = 0.035 * stage.universe + 0.018 * subject.stage_index
    const stageValue = 0.035 + universeValue * stage.opWeight
    const cleanBonus = 1 + Math.min(0.85, Math.log10(subject.clean_time + 10) * 0.11)
    const clearBonus = 1 + subject.completed_universe_x * 0.32
    return getSafeObserverNumber(stageValue * rank.op * command.op * memory * cleanBonus * clearBonus * getObserverAiLevelOp(subject), 0)
}

function getObserverPointsGain() {
    const state = getObserverState()
    if (!state.active)
        return 0

    let gain = 0
    for (const subject of state.subjects) {
        gain += getObserverSubjectOpGain(subject)
    }

    return getSafeObserverNumber(gain, 0)
}

function getObserverAiXpToNext(subject) {
    return getSafeObserverNumber(30 * Math.pow(subject.ai_level, 1.58), 30)
}

function getObserverAiXpGain(subject) {
    const rank = observerRankData[subject.rank]
    const command = getObserverCommand()
    const stage = getObserverSubjectStage(subject)
    const briefing = 1 + getObserverUpgradeLevel("universe_briefing") * 0.04 * Math.max(0, stage.universe - 1)
    return getSafeObserverNumber((0.12 + stage.universe * 0.03 + subject.stage_index * 0.01) * rank.xp * command.xp * getObserverCleanXpBonus(subject) * briefing, 0)
}

function updateObserver() {
    const state = getObserverState()
    updateObserverVisibility()

    if (!state.active || !canSimulate())
        return

    updateObserverSubjects()

    const gain = getObserverPointsGain() / updateSpeed
    state.points += gain
    state.lifetime_points += gain
}

function updateObserverSubjects() {
    const state = getObserverState()
    const command = getObserverCommand()

    for (const subject of state.subjects) {
        normalizeObserverSubject(subject, state)

        subject.clean_time += 1 / updateSpeed
        subject.best_clean_time = Math.max(subject.best_clean_time, subject.clean_time)
        subject.progress += getSafeObserverNumber(getObserverSpeedMultiplier(subject) / updateSpeed, 0)
        subject.ai_xp += getSafeObserverNumber(getObserverAiXpGain(subject) / updateSpeed, 0)

        let levelGuard = 0
        while (subject.ai_xp >= getObserverAiXpToNext(subject) && levelGuard < 100) {
            subject.ai_xp -= getObserverAiXpToNext(subject)
            subject.ai_level += 1
            levelGuard += 1
            subject.last_action = "Improved routing discipline to AI level " + subject.ai_level + "."
        }

        const rank = observerRankData[subject.rank]
        const stage = getObserverSubjectStage(subject)
        const mistakeChance = 0.000045 * rank.mistake * command.mistake * stage.difficulty * getObserverAiLevelMistake(subject) * getObserverMistakeMultiplier()
        if (Math.random() < mistakeChance) {
            applyObserverSubjectMistake(subject)
        }

        advanceObserverSubject(subject)
    }
}

function applyObserverSubjectMistake(subject) {
    subject.mistakes += 1
    subject.clean_time = 0

    const stage = getObserverSubjectStage(subject)
    const previousThreshold = getObserverPreviousThreshold(subject.stage_index)
    const stageSpan = stage.threshold - previousThreshold
    const rollback = stageSpan * (0.08 + observerRankData[subject.rank].mistake * 0.025)

    subject.progress = Math.max(previousThreshold, subject.progress - rollback)

    if (observerRankData[subject.rank].mistake > 2 && Math.random() < 0.16 && subject.stage_index > 0) {
        subject.stage_index -= 1
        subject.progress = Math.min(subject.progress, getObserverSubjectStage(subject).threshold - 1)
        subject.route_resets += 1
        subject.last_action = "Ruined the route and slipped back one phase."
        return
    }

    subject.last_action = "Made a bad route choice and lost the clean streak."
}

function advanceObserverSubject(subject) {
    let advanced = false
    while (subject.progress >= getObserverSubjectStage(subject).threshold) {
        if (subject.stage_index >= observerSubjectStages.length - 1) {
            subject.completed_universe_x += 1
            subject.stage_index = 0
            subject.progress = 0
            subject.clean_time = 0
            subject.route_resets = 0
            subject.last_action = "Completed Universe X and restarted from zero."
            return
        }

        subject.stage_index += 1
        advanced = true
    }

    if (advanced)
        subject.last_action = "Reached " + getObserverSubjectStage(subject).name + "."
}

function getObserverSubjectStage(subject) {
    return observerSubjectStages[Math.min(subject.stage_index, observerSubjectStages.length - 1)]
}

function getObserverPreviousThreshold(stageIndex) {
    if (stageIndex <= 0)
        return 0

    return observerSubjectStages[stageIndex - 1].threshold
}

function getObserverStageProgress(subject) {
    const stage = getObserverSubjectStage(subject)
    const previous = getObserverPreviousThreshold(subject.stage_index)
    return Math.max(0, Math.min(100, (subject.progress - previous) / (stage.threshold - previous) * 100))
}

function getSubjectUniverse(subject) {
    return getObserverSubjectStage(subject).universe
}

function getObserverBestUniverse() {
    const state = getObserverState()
    let best = 1
    for (const subject of state.subjects) {
        best = Math.max(best, getSubjectUniverse(subject), subject.completed_universe_x > 0 ? 10 : 1)
    }
    return best
}

function updateObserverVisibility() {
    const observerButton = document.getElementById("observerTabButton")
    if (observerButton == null)
        return

    const active = isObserverActive()
    document.body.classList.toggle("rb-observer-active", active)
    observerButton.classList.toggle("hidden", !active)

    if (!active)
        return

    const buttons = Array.prototype.slice.call(document.getElementsByClassName("tabButton"))
    for (const button of buttons) {
        button.classList.toggle("hidden", button.id != "observerTabButton")
    }

    if (gameData.settings.selectedTab != "observer") {
        const observerTab = document.getElementById("observer")
        if (observerTab != null)
            setTab("observer")
    }
}

function renderObserver() {
    const state = getObserverState()
    const pointsDisplay = document.getElementById("observerPointsDisplay")
    if (pointsDisplay == null)
        return

    pointsDisplay.textContent = format(state.points, 2)
    document.getElementById("observerPointsGainDisplay").textContent = format(getObserverPointsGain(), 3)
    document.getElementById("observerSubjectCountDisplay").textContent = formatWhole(state.subjects.length)
    document.getElementById("observerBestRunDisplay").textContent = "U-" + getObserverBestUniverse()
    document.getElementById("observerGlobalBoostDisplay").textContent = "x" + format((1 + getObserverUpgradeLevel("clear_instructions") * 0.1) * (1 + getObserverUpgradeLevel("shared_memory") * 0.12), 2)

    const subjectCost = getObserverSubjectCost()
    const subjectButton = document.getElementById("buyObserverSubjectButton")
    subjectButton.textContent = subjectCost == 0 ? "Add first subject" : "Add subject - " + format(subjectCost, 2) + " OP"
    subjectButton.disabled = state.points < subjectCost

    renderObserverCommands()
    renderObserverSubjects()
    renderObserverUpgrades()
}

function renderObserverCommands() {
    const element = document.getElementById("observerCommandRows")
    if (element == null)
        return

    const state = getObserverState()
    let html = ""
    for (const key in observerCommandData) {
        const data = observerCommandData[key]
        const active = key == state.command
        html +=
            `<button class="w3-button button rb-observer-command ${active ? "active" : ""}" onclick="setObserverCommand('${key}')">` +
                `<b>${data.name}</b><br><span>${data.description}</span>` +
            `</button>`
    }

    element.innerHTML = html
}

function renderObserverSubjects() {
    const grid = document.getElementById("observerSubjectGrid")
    if (grid == null)
        return

    const state = getObserverState()
    if (state.subjects.length == 0) {
        grid.innerHTML = `<div style="color:gray;">No subjects yet. Add the first one for free.</div>`
        return
    }

    let html = ""
    for (const subject of state.subjects) {
        const rank = observerRankData[subject.rank]
        const stage = getObserverSubjectStage(subject)
        const progress = getObserverStageProgress(subject)
        const aiProgress = Math.min(100, subject.ai_xp / getObserverAiXpToNext(subject) * 100)
        html +=
            `<div class="rb-observer-subject ${rank.colorClass}">` +
                `<div class="rb-observer-subject-head">` +
                    `<div><b>${subject.name}</b><br><span class="rb-rank ${rank.colorClass}">${rank.name}</span></div>` +
                    `<div class="rb-observer-universe">U-${stage.universe}</div>` +
                `</div>` +
                `<div style="color:gray; margin-top:0.45em;">${stage.name}</div>` +
                `<div class="rb-observer-mini-row"><span>Job</span><b>${stage.job}</b></div>` +
                `<div class="rb-observer-mini-row"><span>Skill</span><b>${stage.skill}</b></div>` +
                `<div class="rb-observer-meter"><div style="width:${progress}%"></div></div>` +
                `<div class="rb-observer-mini-row"><span>AI lvl</span><b>${formatWhole(subject.ai_level)} (${format(aiProgress, 1)}%)</b></div>` +
                `<div class="rb-observer-mini-row"><span>Clean streak</span><b>${formatTime(subject.clean_time, true)}</b></div>` +
                `<div class="rb-observer-mini-row"><span>OP/sec</span><b>${format(getObserverSubjectOpGain(subject), 3)}</b></div>` +
                `<div class="rb-observer-mini-row"><span>Mistakes</span><b>${formatWhole(subject.mistakes)}</b></div>` +
                `<div class="rb-observer-mini-row"><span>U-X clears</span><b>${formatWhole(subject.completed_universe_x)}</b></div>` +
                `<div class="rb-observer-note">${subject.last_action}</div>` +
            `</div>`
    }

    grid.innerHTML = html
}

function renderObserverUpgrades() {
    const rows = document.getElementById("observerUpgradeRows")
    if (rows == null)
        return

    let html = ""
    for (const key in observerUpgradeData) {
        const data = observerUpgradeData[key]
        const level = getObserverUpgradeLevel(key)
        const cost = getObserverUpgradeCost(key)
        html +=
            `<tr>` +
                `<td><b>${data.name}</b><br><span style="color:gray;">${data.description}</span></td>` +
                `<td><span class="rb-chip rb-current">Lvl ${formatWhole(level)}</span></td>` +
                `<td><span class="rb-chip rb-gold">${format(cost, 2)} OP</span></td>` +
                `<td><button class="w3-button button" onclick="buyObserverUpgrade('${key}')" ${getObserverState().points >= cost ? "" : "disabled"}>Buy</button></td>` +
            `</tr>`
    }

    rows.innerHTML = html
}
