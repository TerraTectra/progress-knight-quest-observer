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
            universe_break_unlocked: false,
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
    if (gameData.multiverse.universe_break_unlocked == null)
        gameData.multiverse.universe_break_unlocked = false

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
        && state.universe_break_unlocked
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

    return getUniverseInfo().incomeMult * (1 + getMultiverseUpgradeLevel("universal_labor") * 0.1) * getUniverseTwoIncomeGain() * getUniverseFiveIncomeGain()
}

function getMultiverseExpenseGain() {
    if (!isMultiverseUnlocked())
        return 1

    const expenseReduction = Math.min(0.45, getMultiverseUpgradeLevel("soft_constants") * 0.03)
    return getUniverseInfo().expenseMult * (1 - expenseReduction) * getUniverseTwoExpenseGain() * getUniverseThreeExpenseGain() * getUniverseFiveExpenseGain()
}

function getMultiverseLifespanGain() {
    if (!isMultiverseUnlocked())
        return 1

    return getUniverseInfo().lifespanMult * (1 + getMultiverseUpgradeLevel("long_echo") * 0.05) * getUniverseFourLifespanGain()
}

function getMultiverseEvilGain() {
    if (!isMultiverseUnlocked())
        return 1

    return 1 + getMultiverseUpgradeLevel("abyss_tithe") * 0.12
}

function getMultiverseEssenceGain() {
    if (!isMultiverseUnlocked())
        return 1

    return (1 + getMultiverseUpgradeLevel("essence_prism") * 0.10) * getUniverseThreeEssenceGain()
}

function getMultiverseCategoryPower(category, scale) {
    let power = 0

    if (category == null)
        return 1

    for (const taskName of category) {
        const task = gameData.taskData[taskName]
        if (task == null)
            continue

        power += Math.sqrt(task.level + task.maxLevel * 0.25)
    }

    return 1 + power * scale
}

function getMultiverseVoidJobSource() {
    return getMultiverseCategoryPower(jobCategories["The Void"], 0.02)
}

function getMultiverseVoidSkillSource() {
    return getMultiverseCategoryPower(skillCategories["Void Manipulation"], 0.018)
}

function getMultiverseDarkLayerSource() {
    const darkMatter = 1 + Math.log10(gameData.dark_matter + 1) * 0.01
    const hypercubes = 1 + Math.log10(gameData.hypercubes + 1) * 0.025
    const essence = 1 + Math.max(0, Math.log10(gameData.essence + 1) - 20) * 0.015
    return darkMatter * hypercubes * essence
}

function getMultiverseUniverseSource() {
    return getUniverseInfo().mpMult * getUniverseParameterGain(getCurrentUniverseId())
}

function getMultiverseBreakRewardGain() {
    return getMultiverseState().universe_break_unlocked ? 1.25 : 1
}

function getUniverseParameterName(id = getCurrentUniverseId()) {
    if (id == 2)
        return "Bureaucratic order"

    if (id == 3)
        return "Arcane compliance"

    if (id == 4)
        return "Temporal anchor"

    if (id == 5)
        return "Greed index"

    if (id == 1)
        return "Prime stability"

    return "Distortion control"
}

function getUniverseParameterGain(id = getCurrentUniverseId()) {
    if (!isMultiverseUnlocked())
        return 1

    if (id == 2)
        return getUniverseTwoBureaucraticOrderGain()

    if (id == 3)
        return getUniverseThreeArcaneComplianceGain()

    if (id == 4)
        return getUniverseFourTemporalAnchorGain()

    if (id == 5)
        return getUniverseFiveGreedIndexGain()

    return 1
}

function getUniverseTwoBureaucraticOrderGain() {
    const royalAdministration = gameData.taskData["Royal Administration"]
    const realitySurveying = gameData.taskData["Reality Surveying"]
    const taxSeal = getBindedItemEffect("Tax Seal")

    const adminGain = royalAdministration == null ? 1 : 1 + royalAdministration.level * royalAdministration.baseData.effect
    const surveyGain = realitySurveying == null ? 1 : 1 + realitySurveying.level * realitySurveying.baseData.effect
    return adminGain * surveyGain * taxSeal()
}

function getUniverseTwoIncomeGain() {
    if (!isMultiverseUnlocked() || getCurrentUniverseId() != 2)
        return 1

    const royalAdministration = gameData.taskData["Royal Administration"]
    return royalAdministration == null ? 1 : 1 + royalAdministration.level * 0.003
}

function getUniverseTwoExpenseGain() {
    if (!isMultiverseUnlocked() || getCurrentUniverseId() != 2)
        return 1

    const paperworkEvasion = gameData.taskData["Paperwork Evasion"]
    const reduction = paperworkEvasion == null ? 0 : Math.min(0.35, Math.abs(paperworkEvasion.level * paperworkEvasion.baseData.effect))
    return 1 - reduction
}

function getMultiverseSkillsXpGain() {
    if (!isMultiverseUnlocked())
        return 1

    const realitySurveying = gameData.taskData["Reality Surveying"]
    return realitySurveying == null ? 1 : 1 + realitySurveying.level * 0.01
}

function getUniverseThreeArcaneComplianceGain() {
    const arcaneTaxation = gameData.taskData["Arcane Taxation"]
    const spellAuditing = gameData.taskData["Spell Auditing"]
    const arcaneAbacus = getBindedItemEffect("Arcane Abacus")

    const taxationGain = arcaneTaxation == null ? 1 : 1 + arcaneTaxation.level * arcaneTaxation.baseData.effect
    const auditingGain = spellAuditing == null ? 1 : 1 + spellAuditing.level * spellAuditing.baseData.effect
    return taxationGain * auditingGain * arcaneAbacus()
}

function getUniverseThreeMagicGain() {
    if (!isMultiverseUnlocked() || getCurrentUniverseId() != 3)
        return 1

    const arcaneTaxation = gameData.taskData["Arcane Taxation"]
    const spellAuditing = gameData.taskData["Spell Auditing"]
    const arcaneAbacus = getBindedItemEffect("Arcane Abacus")
    const taxationGain = arcaneTaxation == null ? 1 : 1 + arcaneTaxation.level * 0.005
    const auditingGain = spellAuditing == null ? 1 : 1 + spellAuditing.level * 0.003
    return taxationGain * auditingGain * arcaneAbacus()
}

function getUniverseThreeExpenseGain() {
    if (!isMultiverseUnlocked() || getCurrentUniverseId() != 3)
        return 1

    const manaTariff = gameData.taskData["Mana Tariff"]
    const reduction = manaTariff == null ? 0 : Math.min(0.30, Math.abs(manaTariff.level * manaTariff.baseData.effect))
    return 1 - reduction
}

function getUniverseThreeEssenceGain() {
    if (!isMultiverseUnlocked() || getCurrentUniverseId() != 3)
        return 1

    const spellAuditing = gameData.taskData["Spell Auditing"]
    return spellAuditing == null ? 1 : 1 + spellAuditing.level * 0.004
}

function getUniverseThreeSkillsXpGain() {
    if (!isMultiverseUnlocked())
        return 1

    const spellAuditing = gameData.taskData["Spell Auditing"]
    return spellAuditing == null ? 1 : 1 + spellAuditing.level * 0.008
}

function getUniverseFourTemporalAnchorGain() {
    const temporalAnchoring = gameData.taskData["Temporal Anchoring"]
    const entropyCalendar = gameData.taskData["Entropy Calendar"]
    const chronalCompass = getBindedItemEffect("Chronal Compass")

    const anchorGain = temporalAnchoring == null ? 1 : 1 + temporalAnchoring.level * temporalAnchoring.baseData.effect
    const calendarGain = entropyCalendar == null ? 1 : 1 + entropyCalendar.level * entropyCalendar.baseData.effect
    return anchorGain * calendarGain * chronalCompass()
}

function getUniverseFourLifespanGain() {
    if (!isMultiverseUnlocked() || getCurrentUniverseId() != 4)
        return 1

    const temporalAnchoring = gameData.taskData["Temporal Anchoring"]
    return temporalAnchoring == null ? 1 : 1 + temporalAnchoring.level * 0.004
}

function getUniverseFourGameSpeedGain() {
    if (!isMultiverseUnlocked() || getCurrentUniverseId() != 4)
        return 1

    const borrowedSeconds = gameData.taskData["Borrowed Seconds"]
    const chronalCompass = getBindedItemEffect("Chronal Compass")
    const secondsGain = borrowedSeconds == null ? 1 : 1 + borrowedSeconds.level * borrowedSeconds.baseData.effect
    return secondsGain * chronalCompass()
}

function getUniverseFourSkillsXpGain() {
    if (!isMultiverseUnlocked())
        return 1

    const entropyCalendar = gameData.taskData["Entropy Calendar"]
    return entropyCalendar == null ? 1 : 1 + entropyCalendar.level * 0.008
}

function getUniverseFiveGreedIndexGain() {
    const greedAccounting = gameData.taskData["Greed Accounting"]
    const starMarket = gameData.taskData["Star Market"]
    const debtEngine = getBindedItemEffect("Debt Engine")
    const netPressure = Math.max(0, Math.log10(Math.max(1, getIncome()) / Math.max(1, getExpense()))) * 0.025

    const accountingGain = greedAccounting == null ? 1 : 1 + greedAccounting.level * greedAccounting.baseData.effect
    const marketGain = starMarket == null ? 1 : 1 + starMarket.level * starMarket.baseData.effect
    return (accountingGain + netPressure) * marketGain * debtEngine()
}

function getUniverseFiveIncomeGain() {
    if (!isMultiverseUnlocked() || getCurrentUniverseId() != 5)
        return 1

    const greedAccounting = gameData.taskData["Greed Accounting"]
    const debtEngine = getBindedItemEffect("Debt Engine")
    const accountingGain = greedAccounting == null ? 1 : 1 + greedAccounting.level * 0.004
    return accountingGain * debtEngine()
}

function getUniverseFiveExpenseGain() {
    if (!isMultiverseUnlocked() || getCurrentUniverseId() != 5)
        return 1

    const debtTransmutation = gameData.taskData["Debt Transmutation"]
    const reduction = debtTransmutation == null ? 0 : Math.min(0.34, Math.abs(debtTransmutation.level * debtTransmutation.baseData.effect))
    return 1 - reduction
}

function getUniverseFiveSkillsXpGain() {
    if (!isMultiverseUnlocked())
        return 1

    const starMarket = gameData.taskData["Star Market"]
    return starMarket == null ? 1 : 1 + starMarket.level * 0.008
}

function getMultiverseVoidResonance() {
    if (!isMultiverseUnlocked())
        return 0

    return getMultiverseVoidJobSource() * getMultiverseVoidSkillSource() * getMultiverseDarkLayerSource()
}

function getMultiversePointGain() {
    if (!isMultiverseUnlocked())
        return 0

    const cartography = 1 + getMultiverseUpgradeLevel("void_cartography") * 0.18
    return 0.001 * getMultiverseVoidResonance() * getMultiverseUniverseSource() * cartography * getMultiverseBreakRewardGain()
}

function breakUniverseAltarCost() {
    return 1e24
}

function hasBreakUniverseAltarRequirements() {
    return gameData.metaverse.dark_mater_gain_modifer >= 1
        && gameData.metaverse.essence_gain_modifier >= 1
}

function canBuyBreakUniverseAltar() {
    return isMultiverseUnlocked()
        && gameData.rebirthFiveCount > 0
        && hasBreakUniverseAltarRequirements()
        && !getMultiverseState().universe_break_unlocked
        && gameData.hypercubes >= breakUniverseAltarCost()
}

function buyBreakUniverseAltar() {
    if (!canBuyBreakUniverseAltar())
        return false

    gameData.hypercubes -= breakUniverseAltarCost()
    getMultiverseState().universe_break_unlocked = true
    return true
}

function increaseMultiversePoints() {
    updateMultiverseUnlock()

    if (!canSimulate() || !isMultiverseUnlocked())
        return

    const gain = getMultiversePointGain() / updateSpeed
    gameData.multiverse_points += gain
    gameData.multiverse_points_lifetime += gain
}
