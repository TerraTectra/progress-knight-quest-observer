const observerRankData = {
    trash: { name: "Trash", speed: 0.55, op: 0.45, mistake: 2.4, colorClass: "trash", description: "Wastes runs, panic-buys, and loses clean streaks often." },
    common: { name: "Common", speed: 0.85, op: 0.8, mistake: 1.25, colorClass: "common", description: "Slow, plain, but usually follows the obvious route." },
    skilled: { name: "Skilled", speed: 1.05, op: 1.05, mistake: 0.95, colorClass: "skilled", description: "Keeps a stable route through early Evil and Void." },
    rare: { name: "Rare", speed: 1.28, op: 1.35, mistake: 0.7, colorClass: "rare", description: "Plans around unlocks and avoids most dead runs." },
    epic: { name: "Epic", speed: 1.58, op: 1.8, mistake: 0.45, colorClass: "epic", description: "Adapts quickly to universe distortions." },
    legendary: { name: "Legendary", speed: 2.05, op: 2.6, mistake: 0.22, colorClass: "legendary", description: "Nearly optimal routing toward Universe X." },
}

const observerCommandData = {
    balanced: { name: "Balanced", speed: 1, op: 1, mistake: 1, description: "No major bias. Subjects route normally." },
    safe: { name: "Safe economy", speed: 0.88, op: 1.08, mistake: 0.72, description: "Slower runs, fewer bankruptcies and wasted loops." },
    rush: { name: "Rush breaks", speed: 1.28, op: 0.92, mistake: 1.35, description: "Pushes hard toward next universe, but creates more errors." },
    study: { name: "Study focus", speed: 1.04, op: 1.04, mistake: 0.95, description: "Better early skill routing and smoother Evil/Void preparation." },
}

const observerUpgradeData = {
    clear_instructions: { name: "Clear Instructions", baseCost: 25, costMult: 2.25, description: "+10% subject speed per level." },
    shared_memory: { name: "Shared Memory", baseCost: 40, costMult: 2.35, description: "+12% Observer Point gain per level." },
    talent_shaping: { name: "Talent Shaping", baseCost: 80, costMult: 2.6, description: "Improves rank odds for new subjects." },
    universe_briefing: { name: "Universe Briefing", baseCost: 120, costMult: 2.75, description: "Subjects handle later universes faster." },
}

const observerSubjectStages = [
    { id: "life", name: "Prime life", job: "Beggar", skill: "Concentration", universe: 1, threshold: 60 },
    { id: "first_rebirth", name: "Amulet loop", job: "Farmer", skill: "Productivity", universe: 1, threshold: 135 },
    { id: "evil", name: "Evil route", job: "Squire", skill: "Dark influence", universe: 1, threshold: 250 },
    { id: "void", name: "Void approach", job: "Void slave", skill: "Void manipulation", universe: 1, threshold: 430 },
    { id: "multiverse", name: "Multiverse signal", job: "Void explorer", skill: "Reality surveying", universe: 1, threshold: 680 },
    { id: "u2", name: "Universe II", job: "Royal clerk", skill: "Royal Administration", universe: 2, threshold: 980 },
    { id: "u5", name: "Universe V", job: "Star broker", skill: "Greed Accounting", universe: 5, threshold: 1400 },
    { id: "u8", name: "Universe VIII", job: "Broken climber", skill: "Ladder Reconstruction", universe: 8, threshold: 1900 },
    { id: "u10", name: "Universe X", job: "Threshold witness", skill: "Witness Preparation", universe: 10, threshold: 2500 },
]

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
    if (subject.stage_index == null)
        subject.stage_index = 0
    if (subject.progress == null || isNaN(subject.progress))
        subject.progress = 0
    if (subject.mistakes == null || isNaN(subject.mistakes))
        subject.mistakes = 0
    if (subject.clean_time == null || isNaN(subject.clean_time))
        subject.clean_time = 0
    if (subject.completed_universe_x == null)
        subject.completed_universe_x = 0
    if (subject.last_action == null)
        subject.last_action = "Waking up in Prime World."
}

function isObserverUnlocked() {
    if (gameData == null)
        return false

    return getObserverState().active
        || (typeof getHighestUniverseId === "function" && getHighestUniverseId() >= 10)
        || (typeof getMultiverseState === "function" && getMultiverseState().observer_stub_unlocked)
}

function isObserverActive() {
    return getObserverState().active
}

function enterObserverLayer() {
    if (!isObserverUnlocked())
        return false

    const state = getObserverState()
    state.active = true

    if (typeof getMultiverseState === "function")
        getMultiverseState().observer_stub_unlocked = true

    if (state.subjects.length == 0)
        createObserverSubject(true)

    setTab("observer")
    updateObserverVisibility()
    return true
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

    return 45 * Math.pow(1.75, state.subjects.length - 1)
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
        completed_universe_x: 0,
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
    const legendary = 0.01 + shaping * 0.003
    const epic = legendary + 0.045 + shaping * 0.006
    const rare = epic + 0.12 + shaping * 0.008
    const skilled = rare + 0.24 + shaping * 0.006
    const common = skilled + 0.34

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

function getObserverSpeedMultiplier(subject) {
    const rank = observerRankData[subject.rank]
    const command = getObserverCommand()
    const instructions = 1 + getObserverUpgradeLevel("clear_instructions") * 0.1
    const briefing = 1 + Math.max(0, getSubjectUniverse(subject) - 1) * getObserverUpgradeLevel("universe_briefing") * 0.025
    return rank.speed * command.speed * instructions * briefing
}

function getObserverSubjectOpGain(subject) {
    const rank = observerRankData[subject.rank]
    const command = getObserverCommand()
    const memory = 1 + getObserverUpgradeLevel("shared_memory") * 0.12
    const stage = observerSubjectStages[Math.min(subject.stage_index, observerSubjectStages.length - 1)]
    const stageValue = 0.08 + stage.universe * 0.06 + subject.stage_index * 0.035
    const cleanBonus = 1 + Math.min(0.6, subject.clean_time / 1800)
    const clearBonus = 1 + subject.completed_universe_x * 0.25
    return stageValue * rank.op * command.op * memory * cleanBonus * clearBonus
}

function getObserverPointsGain() {
    const state = getObserverState()
    if (!state.active)
        return 0

    let gain = 0
    for (const subject of state.subjects) {
        gain += getObserverSubjectOpGain(subject)
    }

    return gain
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
        subject.progress += getObserverSpeedMultiplier(subject) / updateSpeed

        const rank = observerRankData[subject.rank]
        const mistakeChance = 0.00005 * rank.mistake * command.mistake
        if (Math.random() < mistakeChance) {
            subject.mistakes += 1
            subject.clean_time = 0
            subject.progress = Math.max(0, subject.progress - 12)
            subject.last_action = "Made a bad route choice and recovered."
        }

        const currentStage = observerSubjectStages[Math.min(subject.stage_index, observerSubjectStages.length - 1)]
        if (subject.progress >= currentStage.threshold) {
            if (subject.stage_index >= observerSubjectStages.length - 1) {
                subject.completed_universe_x += 1
                subject.stage_index = 0
                subject.progress = 0
                subject.clean_time = 0
                subject.last_action = "Completed Universe X and restarted from zero."
            } else {
                subject.stage_index += 1
                subject.last_action = "Reached " + observerSubjectStages[subject.stage_index].name + "."
            }
        }
    }
}

function getSubjectUniverse(subject) {
    const stage = observerSubjectStages[Math.min(subject.stage_index, observerSubjectStages.length - 1)]
    return stage.universe
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

    document.body.classList.toggle("rb-observer-active", isObserverActive())
    observerButton.classList.toggle("hidden", !isObserverUnlocked())

    if (!isObserverActive())
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
    const command = getObserverCommand()
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

    renderObserverCommands(command)
    renderObserverSubjects()
    renderObserverUpgrades()
}

function renderObserverCommands(command) {
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
        const stage = observerSubjectStages[Math.min(subject.stage_index, observerSubjectStages.length - 1)]
        const progress = Math.min(100, subject.progress / stage.threshold * 100)
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
                `<div class="rb-observer-mini-row"><span>OP/sec</span><b>${format(getObserverSubjectOpGain(subject), 3)}</b></div>` +
                `<div class="rb-observer-mini-row"><span>Mistakes</span><b>${formatWhole(subject.mistakes)}</b></div>` +
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
