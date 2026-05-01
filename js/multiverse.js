const multiverseUniverses = [
    { id: 1, name: "Prime World", mpMult: 0.45, xpMult: 1, incomeMult: 1, expenseMult: 1, lifespanMult: 1, unlockCost: 0, rule: "The original rules remain stable." },
    { id: 2, name: "Strained Kingdom", mpMult: 2.2, xpMult: 0.96, incomeMult: 0.92, expenseMult: 1.08, lifespanMult: 0.98, unlockCost: 30, rule: "Work pays less and upkeep bites harder." },
    { id: 3, name: "Taxed Arcana", mpMult: 4.8, xpMult: 0.94, incomeMult: 0.88, expenseMult: 1.18, lifespanMult: 0.98, unlockCost: 140, rule: "Magic remains powerful, but every shortcut has a cost." },
    { id: 4, name: "Thin Time", mpMult: 8.8, xpMult: 0.9, incomeMult: 0.88, expenseMult: 1.25, lifespanMult: 0.92, unlockCost: 420, rule: "Life is shorter; lifespan upgrades matter more." },
    { id: 5, name: "Greedy Stars", mpMult: 15, xpMult: 0.86, incomeMult: 0.82, expenseMult: 1.4, lifespanMult: 0.9, unlockCost: 1200, rule: "Economy pressure becomes the main enemy." },
    { id: 6, name: "Dimming Void", mpMult: 25, xpMult: 0.8, incomeMult: 0.78, expenseMult: 1.55, lifespanMult: 0.86, unlockCost: 4500, rule: "Void progress feeds MP, but ordinary progress slows." },
    { id: 7, name: "Hostile Causality", mpMult: 41, xpMult: 0.72, incomeMult: 0.72, expenseMult: 1.8, lifespanMult: 0.8, unlockCost: 15000, rule: "Runs need careful preparation before every break." },
    { id: 8, name: "Broken Ladder", mpMult: 68, xpMult: 0.62, incomeMult: 0.68, expenseMult: 2.15, lifespanMult: 0.72, unlockCost: 52000, rule: "Old growth routes no longer carry the run alone." },
    { id: 9, name: "Quiet Collapse", mpMult: 108, xpMult: 0.5, incomeMult: 0.6, expenseMult: 2.7, lifespanMult: 0.62, unlockCost: 165000, rule: "Only layered meta upgrades keep the world playable." },
    { id: 10, name: "Observer Threshold", mpMult: 178, xpMult: 0.38, incomeMult: 0.5, expenseMult: 3.4, lifespanMult: 0.5, unlockCost: 520000, rule: "The final universe is unstable enough to reveal the Observer." },
]

const multiverseUpgradeData = {
    stable_memory: { name: "Stable Memory", baseCost: 4, costMult: 2.3, effect: 0.08, description: "+8% all XP per level." },
    universal_labor: { name: "Universal Labor", baseCost: 6, costMult: 2.45, effect: 0.10, description: "+10% job income per level." },
    long_echo: { name: "Long Echo", baseCost: 8, costMult: 2.6, effect: 0.06, description: "+6% lifespan per level." },
    abyss_tithe: { name: "Abyss Tithe", baseCost: 12, costMult: 2.7, effect: 0.14, description: "+14% Evil gain per level and a small MP resonance bonus." },
    essence_prism: { name: "Essence Prism", baseCost: 16, costMult: 2.85, effect: 0.12, description: "+12% Essence gain per level and a small MP resonance bonus." },
    dark_singularity: { name: "Dark Singularity", baseCost: 22, costMult: 3.05, effect: 0.18, description: "+18% Dark Matter gain per level and improves MP income from the dark layer." },
    void_cartography: { name: "Void Cartography", baseCost: 10, costMult: 2.75, effect: 0.14, description: "Increases Multiverse Point gain with diminishing returns." },
    soft_constants: { name: "Soft Constants", baseCost: 18, costMult: 3, effect: 0.04, cap: 0.50, description: "-4% expenses per level, capped at -50%." },
}

function getMultiverseState() {
    if (gameData.multiverse_points == null || isNaN(gameData.multiverse_points) || !isFinite(gameData.multiverse_points))
        gameData.multiverse_points = 0
    if (gameData.multiverse_points_lifetime == null || isNaN(gameData.multiverse_points_lifetime) || !isFinite(gameData.multiverse_points_lifetime))
        gameData.multiverse_points_lifetime = Math.max(0, gameData.multiverse_points)

    if (gameData.multiverse == null) {
        gameData.multiverse = {
            current_universe: 1,
            highest_universe: 1,
            universe_breaks: 0,
            universe_break_unlocked: false,
            upgrades: {},
            observer_stub_unlocked: false,
            observer_signal_prepared: false,
            observer_entry_claimed: false,
        }
    }

    if (gameData.multiverse.upgrades == null)
        gameData.multiverse.upgrades = {}

    for (const key in multiverseUpgradeData) {
        if (gameData.multiverse.upgrades[key] == null)
            gameData.multiverse.upgrades[key] = 0
        if (isNaN(gameData.multiverse.upgrades[key]) || !isFinite(gameData.multiverse.upgrades[key]))
            gameData.multiverse.upgrades[key] = 0
        gameData.multiverse.upgrades[key] = Math.max(0, Math.floor(gameData.multiverse.upgrades[key]))
    }

    if (gameData.multiverse.current_universe == null || isNaN(gameData.multiverse.current_universe))
        gameData.multiverse.current_universe = 1
    if (gameData.multiverse.highest_universe == null || isNaN(gameData.multiverse.highest_universe))
        gameData.multiverse.highest_universe = 1
    if (gameData.multiverse.universe_breaks == null || isNaN(gameData.multiverse.universe_breaks) || !isFinite(gameData.multiverse.universe_breaks))
        gameData.multiverse.universe_breaks = 0
    if (gameData.multiverse.universe_break_unlocked == null)
        gameData.multiverse.universe_break_unlocked = false
    if (gameData.multiverse.observer_signal_prepared == null)
        gameData.multiverse.observer_signal_prepared = false
    if (gameData.multiverse.observer_entry_claimed == null)
        gameData.multiverse.observer_entry_claimed = false

    gameData.multiverse.current_universe = Math.max(1, Math.min(10, Math.floor(gameData.multiverse.current_universe)))
    gameData.multiverse.highest_universe = Math.max(1, Math.min(10, Math.floor(gameData.multiverse.highest_universe)))
    gameData.multiverse.current_universe = Math.min(gameData.multiverse.current_universe, gameData.multiverse.highest_universe)

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
    const safeId = isNaN(id) ? 1 : id
    return multiverseUniverses[Math.max(1, Math.min(10, safeId)) - 1]
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

function getMultiverseItemEffect(itemName) {
    return function() {
        const item = gameData.itemData[itemName]
        if (item == null || typeof item.getEffect != "function")
            return 1

        const effect = item.getEffect()
        return isFinite(effect) && !isNaN(effect) ? effect : 1
    }
}

function getSafeMultiverseNumber(value, fallback = 1, max = 1e308) {
    if (value == null || isNaN(value) || !isFinite(value))
        return fallback

    return Math.max(0, Math.min(max, value))
}

function softcapMultiverseSource(value, start = 250, power = 0.62) {
    const safeValue = getSafeMultiverseNumber(value)
    if (safeValue <= start)
        return safeValue

    return start * Math.pow(safeValue / start, power)
}

function getMultiverseUpgradeCost(upgrade) {
    const data = multiverseUpgradeData[upgrade]
    if (data == null)
        return Infinity

    return data.baseCost * Math.pow(data.costMult, getMultiverseUpgradeLevel(upgrade))
}

function canBuyMultiverseUpgrade(upgrade) {
    const cost = getMultiverseUpgradeCost(upgrade)
    return isMultiverseUnlocked() && Number.isFinite(cost) && gameData.multiverse_points >= cost
}

function buyMultiverseUpgrade(upgrade) {
    if (!canBuyMultiverseUpgrade(upgrade))
        return false

    gameData.multiverse_points -= getMultiverseUpgradeCost(upgrade)
    getMultiverseState().upgrades[upgrade] += 1
    return true
}

function getMultiverseUpgradeMultiplier(upgrade) {
    const data = multiverseUpgradeData[upgrade]
    if (data == null)
        return 1

    return 1 + getMultiverseUpgradeLevel(upgrade) * data.effect
}

function getMultiverseExpenseReduction() {
    const data = multiverseUpgradeData.soft_constants
    return Math.min(data.cap, getMultiverseUpgradeLevel("soft_constants") * data.effect)
}

function getMultiverseDarkLayerMpGain() {
    return getSafeMultiverseNumber(
        1
        + getMultiverseUpgradeLevel("dark_singularity") * 0.045
        + getMultiverseUpgradeLevel("abyss_tithe") * 0.018
        + getMultiverseUpgradeLevel("essence_prism") * 0.018
    )
}

function getMultiverseCartographyMpGain() {
    const level = getMultiverseUpgradeLevel("void_cartography")
    if (level <= 0)
        return 1

    return getSafeMultiverseNumber(1 + Math.sqrt(level) * 0.22 + level * 0.035)
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

function getUniverseBreakRequirement(id = getCurrentUniverseId()) {
    const requirements = {
        1: { parameter: 1.18, task: null, taskLevel: 0 },
        2: { parameter: 1.45, task: "Reality Surveying", taskLevel: 32 },
        3: { parameter: 1.44, task: "Spell Auditing", taskLevel: 36 },
        4: { parameter: 1.44, task: "Entropy Calendar", taskLevel: 40 },
        5: { parameter: 1.50, task: "Star Market", taskLevel: 44 },
        6: { parameter: 2.15, task: "Null Continuity", taskLevel: 48 },
        7: { parameter: 1.52, task: "Retroactive Training", taskLevel: 50 },
        8: { parameter: 1.74, task: "Recursive Promotion", taskLevel: 42 },
        9: { parameter: 1.88, task: "Silence Drills", taskLevel: 46 },
    }

    return requirements[id] || null
}

function getUniverseBreakParameterProgress(id = getCurrentUniverseId()) {
    const requirement = getUniverseBreakRequirement(id)
    if (requirement == null || requirement.parameter <= 0)
        return 1

    return Math.min(1, getUniverseParameterGain(id) / requirement.parameter)
}

function getUniverseBreakTaskProgress(id = getCurrentUniverseId()) {
    const requirement = getUniverseBreakRequirement(id)
    if (requirement == null || requirement.task == null)
        return 1

    const task = gameData.taskData[requirement.task]
    if (task == null || requirement.taskLevel <= 0)
        return 0

    return Math.min(1, task.level / requirement.taskLevel)
}

function getUniverseBreakProgress(id = getCurrentUniverseId()) {
    const requirement = getUniverseBreakRequirement(id)
    if (requirement == null)
        return 1

    return Math.min(getUniverseBreakParameterProgress(id), getUniverseBreakTaskProgress(id))
}

function isUniverseBreakRequirementCompleted(id = getCurrentUniverseId()) {
    return getUniverseBreakProgress(id) >= 1
}

function getUniverseBreakRequirementText(id = getCurrentUniverseId()) {
    const requirement = getUniverseBreakRequirement(id)
    if (requirement == null)
        return "No further universe break."

    let text = getUniverseParameterName(id) + " " + format(getUniverseParameterGain(id), 2) + "/" + format(requirement.parameter, 2)
    if (requirement.task != null) {
        const task = gameData.taskData[requirement.task]
        const level = task == null ? 0 : task.level
        text += ", " + requirement.task + " " + formatWhole(level) + "/" + formatWhole(requirement.taskLevel)
    }

    return text
}

function canBreakCurrentUniverse() {
    const state = getMultiverseState()
    const nextUniverse = getUniverseInfo(state.current_universe + 1)

    return isMultiverseUnlocked()
        && state.universe_break_unlocked
        && state.current_universe == state.highest_universe
        && state.highest_universe < 10
        && isUniverseBreakRequirementCompleted(state.current_universe)
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

    return getSafeMultiverseNumber(getUniverseInfo().xpMult * getMultiverseUpgradeMultiplier("stable_memory") * getUniverseSevenXpGain() * getUniverseEightXpGain() * getUniverseNineXpGain() * getUniverseTenXpGain())
}

function getMultiverseIncomeGain() {
    if (!isMultiverseUnlocked())
        return 1

    return getSafeMultiverseNumber(getUniverseInfo().incomeMult * getMultiverseUpgradeMultiplier("universal_labor") * getUniverseTwoIncomeGain() * getUniverseFiveIncomeGain() * getUniverseSevenIncomeGain() * getUniverseEightIncomeGain() * getUniverseNineIncomeGain())
}

function getMultiverseExpenseGain() {
    if (!isMultiverseUnlocked())
        return 1

    const expenseReduction = getMultiverseExpenseReduction()
    return getSafeMultiverseNumber(getUniverseInfo().expenseMult * (1 - expenseReduction) * getUniverseTwoExpenseGain() * getUniverseThreeExpenseGain() * getUniverseFiveExpenseGain() * getUniverseNineExpenseGain())
}

function getMultiverseLifespanGain() {
    if (!isMultiverseUnlocked())
        return 1

    return getSafeMultiverseNumber(getUniverseInfo().lifespanMult * getMultiverseUpgradeMultiplier("long_echo") * getUniverseFourLifespanGain() * getUniverseSixLifespanGain() * getUniverseEightLifespanGain() * getUniverseTenLifespanGain())
}

function getMultiverseEvilGain() {
    if (!isMultiverseUnlocked())
        return 1

    return getSafeMultiverseNumber(getMultiverseUpgradeMultiplier("abyss_tithe") * getUniverseSixEvilGain() * getUniverseNineEvilGain() * getUniverseTenEvilGain())
}

function getMultiverseEssenceGain() {
    if (!isMultiverseUnlocked())
        return 1

    return getSafeMultiverseNumber(getMultiverseUpgradeMultiplier("essence_prism") * getUniverseThreeEssenceGain() * getUniverseSixEssenceGain() * getUniverseNineEssenceGain() * getUniverseTenEssenceGain())
}

function getMultiverseDarkMatterGain() {
    if (!isMultiverseUnlocked())
        return 1

    return getSafeMultiverseNumber(getMultiverseUpgradeMultiplier("dark_singularity") * getUniverseNineDarkMatterGain() * getUniverseTenDarkMatterGain())
}

function getMultiverseCategoryPower(category, scale) {
    let power = 0

    if (category == null)
        return 1

    for (const taskName of category) {
        const task = gameData.taskData[taskName]
        if (task == null)
            continue

        power += Math.sqrt(Math.max(0, task.level) + Math.max(0, task.maxLevel) * 0.25)
    }

    return getSafeMultiverseNumber(1 + power * scale)
}

function getMultiverseVoidJobSource() {
    return getMultiverseCategoryPower(jobCategories["The Void"], 0.02)
}

function getMultiverseVoidSkillSource() {
    return getMultiverseCategoryPower(skillCategories["Void Manipulation"], 0.018)
}

function getMultiverseDarkLayerSource() {
    const darkMatter = 1 + Math.log10(Math.max(0, gameData.dark_matter) + 1) * 0.01
    const hypercubes = 1 + Math.log10(Math.max(0, gameData.hypercubes) + 1) * 0.025
    const essence = 1 + Math.max(0, Math.log10(Math.max(0, gameData.essence) + 1) - 20) * 0.015
    return getSafeMultiverseNumber(darkMatter * hypercubes * essence * getMultiverseDarkLayerMpGain())
}

function getMultiverseUniverseSource() {
    return getSafeMultiverseNumber(getTotalUniversePassiveWeight())
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

    if (id == 6)
        return "Dimming resonance"

    if (id == 7)
        return "Causal stability"

    if (id == 8)
        return "Ladder integrity"

    if (id == 9)
        return "Collapse control"

    if (id == 10)
        return "Observer signal"

    if (id == 1)
        return "Prime stability"

    return "Distortion control"
}

function getUniverseParameterGain(id = getCurrentUniverseId()) {
    if (!isMultiverseUnlocked())
        return 1

    let gain = 1

    if (id == 1)
        gain = getUniverseOnePrimeStabilityGain()

    else if (id == 2)
        gain = getUniverseTwoBureaucraticOrderGain()

    else if (id == 3)
        gain = getUniverseThreeArcaneComplianceGain()

    else if (id == 4)
        gain = getUniverseFourTemporalAnchorGain()

    else if (id == 5)
        gain = getUniverseFiveGreedIndexGain()

    else if (id == 6)
        gain = getUniverseSixDimmingResonanceGain()

    else if (id == 7)
        gain = getUniverseSevenCausalStabilityGain()

    else if (id == 8)
        gain = getUniverseEightLadderIntegrityGain()

    else if (id == 9)
        gain = getUniverseNineCollapseControlGain()

    else if (id == 10)
        gain = getUniverseTenObserverSignalGain()

    return getSafeMultiverseNumber(softcapMultiverseSource(gain))
}

function getUniverseOnePrimeStabilityGain() {
    const voidJobs = getMultiverseVoidJobSource()
    const voidSkills = getMultiverseVoidSkillSource()
    const darkLayer = getMultiverseDarkLayerSource()
    const lifetime = 1 + Math.log10(Math.max(0, gameData.multiverse_points_lifetime) + 10) * 0.015

    return getSafeMultiverseNumber(Math.pow(voidJobs * voidSkills, 0.35) * Math.pow(darkLayer, 0.25) * lifetime)
}

function getUniversePassiveWeight(id) {
    if (!isMultiverseUnlocked())
        return 0

    if (id > getHighestUniverseId())
        return 0

    const universe = getUniverseInfo(id)
    if (universe == null)
        return 0

    const parameter = getUniverseParameterGain(id)
    const breakMemory = 1 + Math.sqrt(getMultiverseState().universe_breaks) * 0.028
    const activeBonus = id == getCurrentUniverseId() ? 1.1 : 1
    const ageFalloff = 1 / Math.pow(id, 0.36)

    return getSafeMultiverseNumber(universe.mpMult * parameter * breakMemory * activeBonus * ageFalloff, 0, 1e300)
}

function getTotalUniversePassiveWeight() {
    let total = 0
    const highest = getHighestUniverseId()

    for (let id = 1; id <= highest; id++) {
        total += getUniversePassiveWeight(id)
    }

    return getSafeMultiverseNumber(total, 0, 1e300)
}

function getUniverseTwoBureaucraticOrderGain() {
    const royalAdministration = gameData.taskData["Royal Administration"]
    const realitySurveying = gameData.taskData["Reality Surveying"]
    const taxSeal = getMultiverseItemEffect("Tax Seal")

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
    const arcaneAbacus = getMultiverseItemEffect("Arcane Abacus")

    const taxationGain = arcaneTaxation == null ? 1 : 1 + arcaneTaxation.level * arcaneTaxation.baseData.effect
    const auditingGain = spellAuditing == null ? 1 : 1 + spellAuditing.level * spellAuditing.baseData.effect
    return taxationGain * auditingGain * arcaneAbacus()
}

function getUniverseThreeMagicGain() {
    if (!isMultiverseUnlocked() || getCurrentUniverseId() != 3)
        return 1

    const arcaneTaxation = gameData.taskData["Arcane Taxation"]
    const spellAuditing = gameData.taskData["Spell Auditing"]
    const arcaneAbacus = getMultiverseItemEffect("Arcane Abacus")
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
    const chronalCompass = getMultiverseItemEffect("Chronal Compass")

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
    const chronalCompass = getMultiverseItemEffect("Chronal Compass")
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
    const debtEngine = getMultiverseItemEffect("Debt Engine")
    const netPressure = Math.max(0, Math.log10(Math.max(1, getIncome()) / Math.max(1, getExpense()))) * 0.025

    const accountingGain = greedAccounting == null ? 1 : 1 + greedAccounting.level * greedAccounting.baseData.effect
    const marketGain = starMarket == null ? 1 : 1 + starMarket.level * starMarket.baseData.effect
    return (accountingGain + netPressure) * marketGain * debtEngine()
}

function getUniverseFiveIncomeGain() {
    if (!isMultiverseUnlocked() || getCurrentUniverseId() != 5)
        return 1

    const greedAccounting = gameData.taskData["Greed Accounting"]
    const debtEngine = getMultiverseItemEffect("Debt Engine")
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

function getUniverseSixDimmingResonanceGain() {
    const dimmingResonance = gameData.taskData["Dimming Resonance"]
    const abyssalRecycling = gameData.taskData["Abyssal Recycling"]
    const nullContract = getMultiverseItemEffect("Null Contract")
    const voidDepth = Math.log10(gameData.evil + 10) * 0.015 + Math.log10(gameData.essence + 10) * 0.01

    const resonanceGain = dimmingResonance == null ? 1 : 1 + dimmingResonance.level * dimmingResonance.baseData.effect
    const recyclingGain = abyssalRecycling == null ? 1 : 1 + abyssalRecycling.level * abyssalRecycling.baseData.effect
    return (resonanceGain + voidDepth) * recyclingGain * nullContract()
}

function getUniverseSixVoidGain() {
    if (!isMultiverseUnlocked() || getCurrentUniverseId() != 6)
        return 1

    const dimmingResonance = gameData.taskData["Dimming Resonance"]
    const nullContinuity = gameData.taskData["Null Continuity"]
    const compass = getMultiverseItemEffect("Dimmed Compass")
    const resonanceGain = dimmingResonance == null ? 1 : 1 + dimmingResonance.level * 0.004
    const continuityGain = nullContinuity == null ? 1 : 1 + nullContinuity.level * 0.003
    return resonanceGain * continuityGain * compass()
}

function getUniverseSixEvilGain() {
    if (!isMultiverseUnlocked() || getCurrentUniverseId() != 6)
        return 1

    const abyssalRecycling = gameData.taskData["Abyssal Recycling"]
    const nullContract = getMultiverseItemEffect("Null Contract")
    const recyclingGain = abyssalRecycling == null ? 1 : 1 + abyssalRecycling.level * 0.004
    return recyclingGain * nullContract()
}

function getUniverseSixEssenceGain() {
    if (!isMultiverseUnlocked() || getCurrentUniverseId() != 6)
        return 1

    const abyssalRecycling = gameData.taskData["Abyssal Recycling"]
    const nullContract = getMultiverseItemEffect("Null Contract")
    const recyclingGain = abyssalRecycling == null ? 1 : 1 + abyssalRecycling.level * 0.003
    return recyclingGain * nullContract()
}

function getUniverseSixLifespanGain() {
    if (!isMultiverseUnlocked() || getCurrentUniverseId() != 6)
        return 1

    const nullContinuity = gameData.taskData["Null Continuity"]
    return nullContinuity == null ? 1 : 1 + nullContinuity.level * 0.003
}

function getUniverseSixSkillsXpGain() {
    if (!isMultiverseUnlocked())
        return 1

    const nullContinuity = gameData.taskData["Null Continuity"]
    return nullContinuity == null ? 1 : 1 + nullContinuity.level * 0.008
}

function getUniverseSevenCausalStabilityGain() {
    const causalThreading = gameData.taskData["Causal Threading"]
    const retroactiveTraining = gameData.taskData["Retroactive Training"]
    const paradoxAnchor = getMultiverseItemEffect("Paradox Anchor")
    const breakMemory = 1 + Math.sqrt(getMultiverseState().universe_breaks) * 0.035

    const threadingGain = causalThreading == null ? 1 : 1 + causalThreading.level * causalThreading.baseData.effect
    const retroactiveGain = retroactiveTraining == null ? 1 : 1 + retroactiveTraining.level * retroactiveTraining.baseData.effect
    return threadingGain * retroactiveGain * breakMemory * paradoxAnchor()
}

function getUniverseSevenXpGain() {
    if (!isMultiverseUnlocked() || getCurrentUniverseId() != 7)
        return 1

    const causalThreading = gameData.taskData["Causal Threading"]
    const paradoxDiscipline = gameData.taskData["Paradox Discipline"]
    const paradoxAnchor = getMultiverseItemEffect("Paradox Anchor")
    const threadingGain = causalThreading == null ? 1 : 1 + causalThreading.level * 0.0035
    const disciplineGain = paradoxDiscipline == null ? 1 : 1 + paradoxDiscipline.level * 0.0025
    return threadingGain * disciplineGain * paradoxAnchor()
}

function getUniverseSevenIncomeGain() {
    if (!isMultiverseUnlocked() || getCurrentUniverseId() != 7)
        return 1

    const paradoxDiscipline = gameData.taskData["Paradox Discipline"]
    const paradoxAnchor = getMultiverseItemEffect("Paradox Anchor")
    const disciplineGain = paradoxDiscipline == null ? 1 : 1 + paradoxDiscipline.level * 0.004
    return disciplineGain * paradoxAnchor()
}

function getUniverseSevenSkillsXpGain() {
    if (!isMultiverseUnlocked())
        return 1

    const retroactiveTraining = gameData.taskData["Retroactive Training"]
    return retroactiveTraining == null ? 1 : 1 + retroactiveTraining.level * 0.008
}

function getUniverseEightLadderIntegrityGain() {
    const ladderReconstruction = gameData.taskData["Ladder Reconstruction"]
    const sidewaysPromotion = gameData.taskData["Sideways Promotion"]
    const fracturedMastery = gameData.taskData["Fractured Mastery"]
    const recursivePromotion = gameData.taskData["Recursive Promotion"]
    const ascensionMap = getMultiverseItemEffect("Ascension Map")

    const ladderGain = ladderReconstruction == null ? 1 : 1 + ladderReconstruction.level * ladderReconstruction.baseData.effect
    const sidewaysGain = sidewaysPromotion == null ? 1 : 1 + sidewaysPromotion.level * sidewaysPromotion.baseData.effect
    const masteryGain = fracturedMastery == null ? 1 : 1 + fracturedMastery.level * fracturedMastery.baseData.effect
    const recursiveGain = recursivePromotion == null ? 1 : 1 + recursivePromotion.level * recursivePromotion.baseData.effect
    return ladderGain * sidewaysGain * masteryGain * recursiveGain * ascensionMap()
}

function getUniverseEightXpGain() {
    if (!isMultiverseUnlocked() || getCurrentUniverseId() != 8)
        return 1

    const ladderReconstruction = gameData.taskData["Ladder Reconstruction"]
    const fracturedMastery = gameData.taskData["Fractured Mastery"]
    const ascensionMap = getMultiverseItemEffect("Ascension Map")
    const ladderGain = ladderReconstruction == null ? 1 : 1 + ladderReconstruction.level * 0.0035
    const masteryGain = fracturedMastery == null ? 1 : 1 + fracturedMastery.level * 0.0025
    return ladderGain * masteryGain * ascensionMap()
}

function getUniverseEightIncomeGain() {
    if (!isMultiverseUnlocked() || getCurrentUniverseId() != 8)
        return 1

    const sidewaysPromotion = gameData.taskData["Sideways Promotion"]
    const promotionGain = sidewaysPromotion == null ? 1 : 1 + sidewaysPromotion.level * 0.004
    return promotionGain
}

function getUniverseEightLifespanGain() {
    if (!isMultiverseUnlocked() || getCurrentUniverseId() != 8)
        return 1

    const fracturedMastery = gameData.taskData["Fractured Mastery"]
    const recursivePromotion = gameData.taskData["Recursive Promotion"]
    const ascensionMap = getMultiverseItemEffect("Ascension Map")
    const masteryGain = fracturedMastery == null ? 1 : 1 + fracturedMastery.level * 0.0025
    const recursiveGain = recursivePromotion == null ? 1 : 1 + recursivePromotion.level * 0.0012
    return masteryGain * recursiveGain * ascensionMap()
}

function getUniverseEightGameSpeedGain() {
    if (!isMultiverseUnlocked() || getCurrentUniverseId() != 8)
        return 1

    const recursivePromotion = gameData.taskData["Recursive Promotion"]
    const ascensionMap = getMultiverseItemEffect("Ascension Map")
    const recursiveGain = recursivePromotion == null ? 1 : 1 + recursivePromotion.level * 0.0018
    return recursiveGain * Math.pow(ascensionMap(), 0.25)
}

function getUniverseEightSkillsXpGain() {
    if (!isMultiverseUnlocked())
        return 1

    const fracturedMastery = gameData.taskData["Fractured Mastery"]
    const recursivePromotion = gameData.taskData["Recursive Promotion"]
    const masteryGain = fracturedMastery == null ? 1 : 1 + fracturedMastery.level * 0.008
    const recursiveGain = recursivePromotion == null ? 1 : 1 + recursivePromotion.level * 0.004
    return masteryGain * recursiveGain
}

function getUniverseNineCollapseControlGain() {
    const collapseContainment = gameData.taskData["Collapse Containment"]
    const lastSignal = gameData.taskData["Last Signal"]
    const silenceDrills = gameData.taskData["Silence Drills"]
    const quietBeacon = getMultiverseItemEffect("Quiet Beacon")
    const lifetimeMemory = 1 + Math.log10(gameData.multiverse_points_lifetime + 10) * 0.018
    const breakMemory = 1 + Math.sqrt(getMultiverseState().universe_breaks) * 0.04

    const containmentGain = collapseContainment == null ? 1 : 1 + collapseContainment.level * collapseContainment.baseData.effect
    const signalGain = lastSignal == null ? 1 : 1 + lastSignal.level * lastSignal.baseData.effect
    const silenceGain = silenceDrills == null ? 1 : 1 + silenceDrills.level * silenceDrills.baseData.effect
    return containmentGain * signalGain * silenceGain * lifetimeMemory * breakMemory * quietBeacon()
}

function getUniverseNineXpGain() {
    if (!isMultiverseUnlocked() || getCurrentUniverseId() != 9)
        return 1

    const collapseContainment = gameData.taskData["Collapse Containment"]
    const collapseGauge = getMultiverseItemEffect("Collapse Gauge")
    const containmentGain = collapseContainment == null ? 1 : 1 + collapseContainment.level * 0.003
    return containmentGain * collapseGauge()
}

function getUniverseNineIncomeGain() {
    if (!isMultiverseUnlocked() || getCurrentUniverseId() != 9)
        return 1

    const silentEconomy = gameData.taskData["Silent Economy"]
    return silentEconomy == null ? 1 : 1 + silentEconomy.level * 0.0035
}

function getUniverseNineExpenseGain() {
    if (!isMultiverseUnlocked() || getCurrentUniverseId() != 9)
        return 1

    const silentEconomy = gameData.taskData["Silent Economy"]
    const silenceDrills = gameData.taskData["Silence Drills"]
    const economyReduction = silentEconomy == null ? 0 : Math.abs(silentEconomy.level * silentEconomy.baseData.effect)
    const drillReduction = silenceDrills == null ? 0 : silenceDrills.level * 0.0008
    const reduction = Math.min(0.38, economyReduction + drillReduction)
    return 1 - reduction
}

function getUniverseNineEvilGain() {
    if (!isMultiverseUnlocked() || getCurrentUniverseId() != 9)
        return 1

    const lastSignal = gameData.taskData["Last Signal"]
    const quietBeacon = getMultiverseItemEffect("Quiet Beacon")
    const signalGain = lastSignal == null ? 1 : 1 + lastSignal.level * 0.003
    return signalGain * quietBeacon()
}

function getUniverseNineEssenceGain() {
    if (!isMultiverseUnlocked() || getCurrentUniverseId() != 9)
        return 1

    const lastSignal = gameData.taskData["Last Signal"]
    const quietBeacon = getMultiverseItemEffect("Quiet Beacon")
    const signalGain = lastSignal == null ? 1 : 1 + lastSignal.level * 0.003
    return signalGain * quietBeacon()
}

function getUniverseNineDarkMatterGain() {
    if (!isMultiverseUnlocked() || getCurrentUniverseId() != 9)
        return 1

    const collapseContainment = gameData.taskData["Collapse Containment"]
    const lastSignal = gameData.taskData["Last Signal"]
    const silenceDrills = gameData.taskData["Silence Drills"]
    const quietBeacon = getMultiverseItemEffect("Quiet Beacon")
    const containmentGain = collapseContainment == null ? 1 : 1 + collapseContainment.level * 0.002
    const signalGain = lastSignal == null ? 1 : 1 + lastSignal.level * 0.0025
    const silenceGain = silenceDrills == null ? 1 : 1 + silenceDrills.level * 0.0018
    return containmentGain * signalGain * silenceGain * quietBeacon()
}

function getUniverseNineSkillsXpGain() {
    if (!isMultiverseUnlocked())
        return 1

    const lastSignal = gameData.taskData["Last Signal"]
    const silenceDrills = gameData.taskData["Silence Drills"]
    const signalGain = lastSignal == null ? 1 : 1 + lastSignal.level * 0.008
    const silenceGain = silenceDrills == null ? 1 : 1 + silenceDrills.level * 0.005
    return signalGain * silenceGain
}

function getUniverseTenObserverSignalGain() {
    const thresholdListening = gameData.taskData["Threshold Listening"]
    const impossibleRoutine = gameData.taskData["Impossible Routine"]
    const witnessPreparation = gameData.taskData["Witness Preparation"]
    const observerAlignment = gameData.taskData["Observer Alignment"]
    const staticCrown = getMultiverseItemEffect("Static Crown")
    const lifetimeMemory = 1 + Math.log10(gameData.multiverse_points_lifetime + 10) * 0.02
    const breakMemory = 1 + Math.sqrt(getMultiverseState().universe_breaks) * 0.045

    const listeningGain = thresholdListening == null ? 1 : 1 + thresholdListening.level * thresholdListening.baseData.effect
    const routineGain = impossibleRoutine == null ? 1 : 1 + impossibleRoutine.level * impossibleRoutine.baseData.effect
    const witnessGain = witnessPreparation == null ? 1 : 1 + witnessPreparation.level * witnessPreparation.baseData.effect
    const alignmentGain = observerAlignment == null ? 1 : 1 + observerAlignment.level * observerAlignment.baseData.effect
    return listeningGain * routineGain * witnessGain * alignmentGain * lifetimeMemory * breakMemory * staticCrown()
}

function getObserverSignalStrength() {
    if (!isMultiverseUnlocked() || getHighestUniverseId() < 10)
        return 0

    const thresholdListening = gameData.taskData["Threshold Listening"]
    const impossibleRoutine = gameData.taskData["Impossible Routine"]
    const witnessPreparation = gameData.taskData["Witness Preparation"]
    const observerAlignment = gameData.taskData["Observer Alignment"]
    const listening = thresholdListening == null ? 0 : thresholdListening.level
    const routine = impossibleRoutine == null ? 0 : impossibleRoutine.level
    const witness = witnessPreparation == null ? 0 : witnessPreparation.level
    const alignment = observerAlignment == null ? 0 : observerAlignment.level
    const signal = listening + routine * 1.45 + witness * 2.15 + alignment * 3.4
    return signal * getUniverseTenObserverSignalGain()
}

function getObserverSignalRequirement() {
    return 620
}

function getObserverSignalProgress() {
    return Math.min(1, getObserverSignalStrength() / getObserverSignalRequirement())
}

function canPrepareObserverSignal() {
    return isMultiverseUnlocked()
        && getCurrentUniverseId() == 10
        && getHighestUniverseId() >= 10
        && !getMultiverseState().observer_signal_prepared
        && getObserverSignalStrength() >= getObserverSignalRequirement()
}

function prepareObserverSignal() {
    if (!canPrepareObserverSignal())
        return false

    const state = getMultiverseState()
    state.observer_signal_prepared = true
    state.observer_stub_unlocked = true
    return true
}

function getUniverseTenXpGain() {
    if (!isMultiverseUnlocked() || getCurrentUniverseId() != 10)
        return 1

    const thresholdListening = gameData.taskData["Threshold Listening"]
    const impossibleRoutine = gameData.taskData["Impossible Routine"]
    const observerLens = getMultiverseItemEffect("Observer Lens")
    const listeningGain = thresholdListening == null ? 1 : 1 + thresholdListening.level * 0.0028
    const routineGain = impossibleRoutine == null ? 1 : 1 + impossibleRoutine.level * 0.0028
    return listeningGain * routineGain * observerLens()
}

function getUniverseTenGameSpeedGain() {
    if (!isMultiverseUnlocked() || getCurrentUniverseId() != 10)
        return 1

    const impossibleRoutine = gameData.taskData["Impossible Routine"]
    const staticCrown = getMultiverseItemEffect("Static Crown")
    const routineGain = impossibleRoutine == null ? 1 : 1 + impossibleRoutine.level * 0.0025
    return routineGain * staticCrown()
}

function getUniverseTenLifespanGain() {
    if (!isMultiverseUnlocked() || getCurrentUniverseId() != 10)
        return 1

    const witnessPreparation = gameData.taskData["Witness Preparation"]
    return witnessPreparation == null ? 1 : 1 + witnessPreparation.level * 0.0025
}

function getUniverseTenEvilGain() {
    if (!isMultiverseUnlocked() || getCurrentUniverseId() != 10)
        return 1

    const witnessPreparation = gameData.taskData["Witness Preparation"]
    const witnessGain = witnessPreparation == null ? 1 : 1 + witnessPreparation.level * 0.0028
    return witnessGain
}

function getUniverseTenEssenceGain() {
    if (!isMultiverseUnlocked() || getCurrentUniverseId() != 10)
        return 1

    const witnessPreparation = gameData.taskData["Witness Preparation"]
    const witnessGain = witnessPreparation == null ? 1 : 1 + witnessPreparation.level * 0.0028
    return witnessGain
}

function getUniverseTenDarkMatterGain() {
    if (!isMultiverseUnlocked() || getCurrentUniverseId() != 10)
        return 1

    const thresholdListening = gameData.taskData["Threshold Listening"]
    const witnessPreparation = gameData.taskData["Witness Preparation"]
    const observerAlignment = gameData.taskData["Observer Alignment"]
    const observerLens = getMultiverseItemEffect("Observer Lens")
    const listeningGain = thresholdListening == null ? 1 : 1 + thresholdListening.level * 0.0018
    const witnessGain = witnessPreparation == null ? 1 : 1 + witnessPreparation.level * 0.0022
    const alignmentGain = observerAlignment == null ? 1 : 1 + observerAlignment.level * 0.0016
    return listeningGain * witnessGain * alignmentGain * observerLens()
}

function getUniverseTenSkillsXpGain() {
    if (!isMultiverseUnlocked())
        return 1

    const witnessPreparation = gameData.taskData["Witness Preparation"]
    const observerAlignment = gameData.taskData["Observer Alignment"]
    const witnessGain = witnessPreparation == null ? 1 : 1 + witnessPreparation.level * 0.008
    const alignmentGain = observerAlignment == null ? 1 : 1 + observerAlignment.level * 0.006
    return witnessGain * alignmentGain
}

function getMultiverseVoidResonance() {
    if (!isMultiverseUnlocked())
        return 0

    return getMultiverseVoidJobSource() * getMultiverseVoidSkillSource() * getMultiverseDarkLayerSource()
}

function getMultiversePointGain() {
    if (!isMultiverseUnlocked())
        return 0

    const cartography = getMultiverseCartographyMpGain()
    const voidResonance = Math.pow(getMultiverseVoidResonance(), 0.52)
    const universeWeight = getTotalUniversePassiveWeight()
    const observerThreshold = getHighestUniverseId() >= 10 ? 1.12 : 1

    return getSafeMultiverseNumber(0.0024 * voidResonance * universeWeight * cartography * getMultiverseBreakRewardGain() * observerThreshold, 0, 1e300)
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

    // MP is a real-time passive layer. Do not route this through applySpeed:
    // Time Warping, admin speed, and universe game-speed effects must not multiply it.
    const gain = getSafeMultiverseNumber(getMultiversePointGain() / updateSpeed, 0, 1e300)
    gameData.multiverse_points += gain
    gameData.multiverse_points_lifetime += gain
}
