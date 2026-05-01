const multiverseUniverses = [
    { id: 1, name: "Prime World", mpMult: 1, xpMult: 1, incomeMult: 1, expenseMult: 1, lifespanMult: 1, unlockCost: 0, rule: "The original rules remain stable." },
    { id: 2, name: "Strained Kingdom", mpMult: 2.5, xpMult: 0.96, incomeMult: 0.92, expenseMult: 1.08, lifespanMult: 0.98, unlockCost: 25, rule: "Work pays less and upkeep bites harder." },
    { id: 3, name: "Taxed Arcana", mpMult: 5, xpMult: 0.94, incomeMult: 0.88, expenseMult: 1.18, lifespanMult: 0.98, unlockCost: 120, rule: "Magic remains powerful, but every shortcut has a cost." },
    { id: 4, name: "Thin Time", mpMult: 9, xpMult: 0.9, incomeMult: 0.88, expenseMult: 1.25, lifespanMult: 0.92, unlockCost: 450, rule: "Life is shorter; lifespan upgrades matter more." },
    { id: 5, name: "Greedy Stars", mpMult: 16, xpMult: 0.86, incomeMult: 0.82, expenseMult: 1.4, lifespanMult: 0.9, unlockCost: 1500, rule: "Economy pressure becomes the main enemy." },
    { id: 6, name: "Dimming Void", mpMult: 28, xpMult: 0.8, incomeMult: 0.78, expenseMult: 1.55, lifespanMult: 0.86, unlockCost: 5000, rule: "Void progress feeds MP, but ordinary progress slows." },
    { id: 7, name: "Hostile Causality", mpMult: 48, xpMult: 0.72, incomeMult: 0.72, expenseMult: 1.8, lifespanMult: 0.8, unlockCost: 16000, rule: "Runs need careful preparation before every break." },
    { id: 8, name: "Broken Ladder", mpMult: 80, xpMult: 0.62, incomeMult: 0.68, expenseMult: 2.15, lifespanMult: 0.72, unlockCost: 50000, rule: "Old growth routes no longer carry the run alone." },
    { id: 9, name: "Quiet Collapse", mpMult: 130, xpMult: 0.5, incomeMult: 0.6, expenseMult: 2.7, lifespanMult: 0.62, unlockCost: 160000, rule: "Only layered meta upgrades keep the world playable." },
    { id: 10, name: "Observer Threshold", mpMult: 220, xpMult: 0.38, incomeMult: 0.5, expenseMult: 3.4, lifespanMult: 0.5, unlockCost: 500000, rule: "The final universe is unstable enough to reveal the Observer." },
]

const multiverseUpgradeData = {
    stable_memory: { name: "Stable Memory", baseCost: 4, costMult: 2.3, description: "+8% all XP per level." },
    universal_labor: { name: "Universal Labor", baseCost: 6, costMult: 2.45, description: "+10% job income per level." },
    long_echo: { name: "Long Echo", baseCost: 8, costMult: 2.6, description: "+5% lifespan per level." },
    abyss_tithe: { name: "Abyss Tithe", baseCost: 12, costMult: 2.7, description: "+12% Evil gain per level." },
    essence_prism: { name: "Essence Prism", baseCost: 16, costMult: 2.85, description: "+10% Essence gain per level." },
    void_cartography: { name: "Void Cartography", baseCost: 10, costMult: 2.75, description: "+18% Multiverse Point gain per level." },
    soft_constants: { name: "Soft Constants", baseCost: 18, costMult: 3, description: "-3% expenses per level, capped at -45%." },
}

function getMultiverseState() {
    if (gameData.multiverse == null) {
        gameData.multiverse = {
            current_universe: 1,
            highest_universe: 1,
            universe_breaks: 0,
            upgrades: {},
            observer_stub_unlocked: false,
        }
    }

    if (gameData.multiverse.upgrades == null)
        gameData.multiverse.upgrades = {}

    for (const key in multiverseUpgradeData) {
        if (gameData.multiverse.upgrades[key] == null)
            gameData.multiverse.upgrades[key] = 0
    }

    if (gameData.multiverse.current_universe == null)
        gameData.multiverse.current_universe = 1
    if (gameData.multiverse.highest_universe == null)
        gameData.multiverse.highest_universe = 1
    if (gameData.multiverse.universe_breaks == null)
        gameData.multiverse.universe_breaks = 0

    return gameData.multiverse
}

function isMultiverseUnlocked() {
    return gameData.multiverse_unlocked || gameData.multiverse_points > 0
}

function updateMultiverseUnlock() {
    if (gameData.multiverse_unlocked)
        return

    const voidRequirement = gameData.requirements["The Void"]
    if (voidRequirement != null && voidRequirement.isCompleted())
        gameData.multiverse_unlocked = true
}

function getUniverseInfo(id = getMultiverseState().current_universe) {
    return multiverseUniverses[Math.max(1, Math.min(10, id)) - 1]
}

function getCurrentUniverseId() {
    return getMultiverseState().current_universe
}

function getHighestUniverseId() {
    return getMultiverseState().highest_universe
}

function getMultiverseUpgradeLevel(upgrade) {
    return getMultiverseState().upgrades[upgrade] || 0
}

function getMultiverseUpgradeCost(upgrade) {
    const data = multiverseUpgradeData[upgrade]
    return data.baseCost * Math.pow(data.costMult, getMultiverseUpgradeLevel(upgrade))
}

function canBuyMultiverseUpgrade(upgrade) {
    return isMultiverseUnlocked() && gameData.multiverse_points >= getMultiverseUpgradeCost(upgrade)
}

function buyMultiverseUpgrade(upgrade) {
    if (!canBuyMultiverseUpgrade(upgrade))
        return false

    gameData.multiverse_points -= getMultiverseUpgradeCost(upgrade)
    getMultiverseState().upgrades[upgrade] += 1
    return true
}

function canEnterUniverse(id) {
    return isMultiverseUnlocked() && id <= getHighestUniverseId()
}

function enterUniverse(id) {
    if (!canEnterUniverse(id))
        return false

    getMultiverseState().current_universe = id
    return true
}

function canBreakCurrentUniverse() {
    const state = getMultiverseState()
    const nextUniverse = getUniverseInfo(state.current_universe + 1)

    return isMultiverseUnlocked()
        && state.current_universe == state.highest_universe
        && state.highest_universe < 10
        && gameData.multiverse_points >= nextUniverse.unlockCost
}

function breakCurrentUniverse() {
    if (!canBreakCurrentUniverse())
        return false

    const state = getMultiverseState()
    const nextUniverse = getUniverseInfo(state.current_universe + 1)

    gameData.multiverse_points -= nextUniverse.unlockCost
    state.highest_universe += 1
    state.current_universe = state.highest_universe
    state.universe_breaks += 1

    if (state.highest_universe >= 10)
        state.observer_stub_unlocked = true

    rebirthReset(false)
    setTab("multiverse")
    return true
}

function getMultiverseXpGain() {
    if (!isMultiverseUnlocked())
        return 1

    return getUniverseInfo().xpMult * (1 + getMultiverseUpgradeLevel("stable_memory") * 0.08)
}

function getMultiverseIncomeGain() {
    if (!isMultiverseUnlocked())
        return 1

    return getUniverseInfo().incomeMult * (1 + getMultiverseUpgradeLevel("universal_labor") * 0.1)
}

function getMultiverseExpenseGain() {
    if (!isMultiverseUnlocked())
        return 1

    const expenseReduction = Math.min(0.45, getMultiverseUpgradeLevel("soft_constants") * 0.03)
    return getUniverseInfo().expenseMult * (1 - expenseReduction)
}

function getMultiverseLifespanGain() {
    if (!isMultiverseUnlocked())
        return 1

    return getUniverseInfo().lifespanMult * (1 + getMultiverseUpgradeLevel("long_echo") * 0.05)
}

function getMultiverseEvilGain() {
    if (!isMultiverseUnlocked())
        return 1

    return 1 + getMultiverseUpgradeLevel("abyss_tithe") * 0.12
}

function getMultiverseEssenceGain() {
    if (!isMultiverseUnlocked())
        return 1

    return 1 + getMultiverseUpgradeLevel("essence_prism") * 0.10
}

function getMultiverseCategoryPower(category, scale) {
    let power = 0

    for (const taskName of category) {
        const task = gameData.taskData[taskName]
        if (task == null)
            continue

        power += Math.sqrt(task.level + task.maxLevel * 0.25)
    }

    return 1 + power * scale
}

function getMultiverseVoidResonance() {
    if (!isMultiverseUnlocked())
        return 0

    const voidJobs = getMultiverseCategoryPower(jobCategories["The Void"], 0.02)
    const voidSkills = getMultiverseCategoryPower(skillCategories["Void Manipulation"], 0.018)
    const darkMatter = 1 + Math.log10(gameData.dark_matter + 1) * 0.01
    const hypercubes = 1 + Math.log10(gameData.hypercubes + 1) * 0.025
    const essence = 1 + Math.max(0, Math.log10(gameData.essence + 1) - 20) * 0.015

    return voidJobs * voidSkills * darkMatter * hypercubes * essence
}

function getMultiversePointGain() {
    if (!isMultiverseUnlocked())
        return 0

    const cartography = 1 + getMultiverseUpgradeLevel("void_cartography") * 0.18
    return 0.001 * getMultiverseVoidResonance() * getUniverseInfo().mpMult * cartography
}

function increaseMultiversePoints() {
    updateMultiverseUnlock()

    if (!canSimulate() || !isMultiverseUnlocked())
        return

    const gain = getMultiversePointGain() / updateSpeed
    gameData.multiverse_points += gain
    gameData.multiverse_points_lifetime += gain
}
