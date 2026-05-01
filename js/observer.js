const observerRankData = {
    trash: { name: "Trash", speed: 0.52, op: 0.45, xp: 0.55, mistake: 2.7, colorClass: "trash", description: "Panics, wastes routes, and often loses clean streaks." },
    common: { name: "Common", speed: 0.82, op: 0.78, xp: 0.85, mistake: 1.35, colorClass: "common", description: "Slow and plain, but can finish simple loops." },
    skilled: { name: "Skilled", speed: 1.05, op: 1.05, xp: 1.05, mistake: 0.95, colorClass: "skilled", description: "Keeps a stable route through Evil and Void." },
    rare: { name: "Rare", speed: 1.3, op: 1.35, xp: 1.25, mistake: 0.68, colorClass: "rare", description: "Plans around unlocks and avoids most dead runs." },
    epic: { name: "Epic", speed: 1.62, op: 1.85, xp: 1.55, mistake: 0.42, colorClass: "epic", description: "Adapts quickly to distorted universes." },
    legendary: { name: "Legendary", speed: 2.08, op: 2.65, xp: 2.05, mistake: 0.2, colorClass: "legendary", description: "Nearly optimal routing toward Universe X." },
}

const observerPersonalityData = {
    timid: { name: "Timid", speed: 0.9, op: 1.05, mistake: 0.78, xp: 1.02, purchase: 0.82, choice: 0.08, description: "Avoids risky routes and buys slowly, but keeps clean streaks." },
    impulsive: { name: "Impulsive", speed: 1.23, op: 0.94, mistake: 1.38, xp: 0.96, purchase: 1.2, choice: -0.05, description: "Rushes progress, overbuys, and often recovers from messy routes." },
    studious: { name: "Studious", speed: 0.98, op: 1.02, mistake: 0.9, xp: 1.22, purchase: 0.92, choice: 0.12, description: "Learns routes quickly and keeps skill-heavy phases stable." },
    greedy: { name: "Greedy", speed: 1.06, op: 1.18, mistake: 1.12, xp: 0.98, purchase: 1.32, choice: -0.02, description: "Chases income and items, sometimes at the cost of stability." },
    methodical: { name: "Methodical", speed: 1, op: 1.08, mistake: 0.72, xp: 1.08, purchase: 0.96, choice: 0.16, description: "Builds clean routes and rarely wastes late-universe attempts." },
    visionary: { name: "Visionary", speed: 1.1, op: 1.16, mistake: 0.86, xp: 1.14, purchase: 1.03, choice: 0.2, description: "Recognizes universe distortions earlier than most subjects." },
}

const observerUpgradeData = {
    clear_instructions: { name: "Clear Instructions", baseCost: 12, costMult: 2.25, description: "+10% subject speed per level." },
    early_guidance: { name: "Early Guidance", baseCost: 16, costMult: 2.2, description: "+12% speed in Prime and Evil setup per level." },
    shared_memory: { name: "Shared Memory", baseCost: 18, costMult: 2.35, description: "+12% Observer Point gain per level." },
    route_drills: { name: "Route Drills", baseCost: 22, costMult: 2.35, description: "+14% AI XP gain per level." },
    error_filter: { name: "Error Filter", baseCost: 25, costMult: 2.45, description: "-8% mistake chance per level, capped at -70%." },
    void_protocols: { name: "Void Protocols", baseCost: 34, costMult: 2.55, description: "+10% Evil/Void route speed and +8% OP there per level." },
    talent_shaping: { name: "Talent Shaping", baseCost: 45, costMult: 2.65, description: "Improves rank odds for new subjects." },
    reality_scripts: { name: "Reality Scripts", baseCost: 58, costMult: 2.65, description: "+9% U-II to U-V route speed per level." },
    universe_briefing: { name: "Universe Briefing", baseCost: 78, costMult: 2.8, description: "Subjects handle later universes faster." },
    threshold_maps: { name: "Threshold Maps", baseCost: 125, costMult: 3.05, description: "+7% U-VI to U-X speed and OP per level." },
    gentle_push: { name: "Gentle Push", baseCost: 26, costMult: 2.35, description: "+9% speed in Prime, Amulet, and early Evil per level." },
    mistake_recovery: { name: "Mistake Recovery", baseCost: 38, costMult: 2.5, description: "-10% progress rollback from mistakes per level, capped at -65%." },
    streak_preservation: { name: "Streak Preservation", baseCost: 62, costMult: 2.65, description: "Mistakes preserve part of clean streaks instead of fully resetting them." },
    better_instincts: { name: "Better Instincts", baseCost: 42, costMult: 2.55, description: "Improves route choices and route quality for every subject." },
    quiet_patronage: { name: "Quiet Patronage", baseCost: 52, costMult: 2.55, description: "Improves subject shopping, reserves, and waste recovery." },
    hidden_patronage: { name: "Hidden Patronage", baseCost: 74, costMult: 2.7, description: "Improves housing, item routing, and protects subjects from bad purchases." },
    character_refinement: { name: "Character Refinement", baseCost: 68, costMult: 2.75, description: "-12% Refine rank cost per level, capped at -72%." },
    deep_simulation: { name: "Deep Simulation", baseCost: 95, costMult: 2.85, description: "+11% OP from Multiverse and higher stages per level." },
    threshold_tutoring: { name: "Threshold Tutoring", baseCost: 145, costMult: 3.1, description: "+8% speed and -4% mistakes in U-VIII to U-X per level." },
    threshold_intuition: { name: "Threshold Intuition", baseCost: 185, costMult: 3.15, description: "Subjects adapt faster to U-VIII, U-IX, and U-X distortions." },
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

const observerSubjectMilestoneData = {
    first_rebirth: { name: "First rebirth", description: "Reached the Amulet loop.", speed: 0.02, op: 0.02, xp: 0.015, mistake: 0.01 },
    first_evil: { name: "First Evil", description: "Found the Evil route.", speed: 0.025, op: 0.025, xp: 0.02, mistake: 0.015 },
    first_void: { name: "First Void", description: "Reached the Void approach.", speed: 0.03, op: 0.035, xp: 0.025, mistake: 0.02 },
    multiverse_signal: { name: "Multiverse signal", description: "Discovered the Multiverse route.", speed: 0.035, op: 0.045, xp: 0.03, mistake: 0.025 },
    universe_ii: { name: "Universe II", description: "Entered the first distorted universe.", speed: 0.04, op: 0.055, xp: 0.035, mistake: 0.03 },
    universe_v: { name: "Universe V", description: "Survived the middle universes.", speed: 0.05, op: 0.07, xp: 0.04, mistake: 0.035 },
    universe_x: { name: "Universe X", description: "Reached the final universe.", speed: 0.065, op: 0.095, xp: 0.055, mistake: 0.045 },
    first_u10_clear: { name: "First U-X clear", description: "Completed Universe X and restarted from zero.", speed: 0.08, op: 0.12, xp: 0.065, mistake: 0.055 },
}

const observerSubjectInsightData = {
    timid_composure: { personality: "timid", name: "Composure", description: "Kept a long safe route.", speed: 0.015, op: 0.025, xp: 0.01, mistake: 0.035, route: 0.03 },
    timid_shelter: { personality: "timid", name: "Shelter Sense", description: "Learned when to buy safer housing.", speed: 0.01, op: 0.02, purchase: 0.045, mistake: 0.025 },
    impulsive_control: { personality: "impulsive", name: "Controlled Rush", description: "Reached the Void route without losing all tempo.", speed: 0.055, xp: 0.025, mistake: 0.035, route: 0.02 },
    impulsive_recovery: { personality: "impulsive", name: "Crash Recovery", description: "Recovered from repeated bad routes.", speed: 0.025, op: 0.02, mistake: 0.045, route: 0.035 },
    studious_notes: { personality: "studious", name: "Living Notebook", description: "Built a stable AI study loop.", xp: 0.055, aiXp: 0.075, op: 0.015, route: 0.025 },
    studious_thesis: { personality: "studious", name: "Multiverse Thesis", description: "Turned late-stage failures into route knowledge.", xp: 0.045, aiXp: 0.06, mistake: 0.035, route: 0.035 },
    greedy_ledger: { personality: "greedy", name: "Golden Ledger", description: "Learned to turn purchases into route power.", income: 0.065, purchase: 0.055, op: 0.035, mistake: 0.02 },
    greedy_investor: { personality: "greedy", name: "Universe Investor", description: "Used accumulated wealth to stabilize distorted runs.", income: 0.055, speed: 0.025, op: 0.055, route: 0.025 },
    methodical_routine: { personality: "methodical", name: "Perfect Routine", description: "Kept a very long clean route.", speed: 0.025, op: 0.03, mistake: 0.055, route: 0.055 },
    methodical_loop: { personality: "methodical", name: "Loop Memory", description: "Converted a Universe X clear into repeatable structure.", speed: 0.035, xp: 0.025, op: 0.055, mistake: 0.04 },
    visionary_signal: { personality: "visionary", name: "Distortion Sight", description: "Understood the first distorted universes.", speed: 0.035, xp: 0.025, op: 0.04, route: 0.045 },
    visionary_threshold: { personality: "visionary", name: "Threshold Dream", description: "Recognized the Observer pattern near Universe X.", speed: 0.055, op: 0.075, xp: 0.035, mistake: 0.045, route: 0.055 },
}

const observerBotRankData = {
    trash: { choice: 0.42, thrift: 0.45, rebirth: 0.38, purchase: 0.45, wrongRoute: 0.34, debtLoss: 0.42 },
    common: { choice: 0.6, thrift: 0.62, rebirth: 0.58, purchase: 0.6, wrongRoute: 0.18, debtLoss: 0.22 },
    skilled: { choice: 0.78, thrift: 0.78, rebirth: 0.76, purchase: 0.78, wrongRoute: 0.1, debtLoss: 0.12 },
    rare: { choice: 0.9, thrift: 0.9, rebirth: 0.9, purchase: 0.9, wrongRoute: 0.055, debtLoss: 0.075 },
    epic: { choice: 1.04, thrift: 1.02, rebirth: 1.05, purchase: 1.05, wrongRoute: 0.028, debtLoss: 0.04 },
    legendary: { choice: 1.22, thrift: 1.18, rebirth: 1.25, purchase: 1.22, wrongRoute: 0.01, debtLoss: 0.018 },
}

const observerBotProperties = [
    { name: "Homeless", stage: 0, cost: 0, reserve: 0, quality: 0 },
    { name: "Tent", stage: 0, cost: 120, reserve: 0.06, quality: 0.04 },
    { name: "Wooden Hut", stage: 1, cost: 900, reserve: 0.1, quality: 0.08 },
    { name: "Cottage", stage: 2, cost: 4200, reserve: 0.14, quality: 0.12 },
    { name: "House", stage: 3, cost: 18000, reserve: 0.18, quality: 0.16 },
    { name: "Pocket Dimension", stage: 5, cost: 160000, reserve: 0.22, quality: 0.22 },
    { name: "Observable Universe", stage: 10, cost: 1800000, reserve: 0.28, quality: 0.32 },
]

const observerBotItems = [
    { name: "Cheap meal", stage: 0, cost: 55, quality: 0.025 },
    { name: "Book", stage: 0, cost: 140, quality: 0.04 },
    { name: "Dumbbells", stage: 1, cost: 600, quality: 0.045 },
    { name: "Study Desk", stage: 2, cost: 2100, quality: 0.06 },
    { name: "Sapphire Charm", stage: 3, cost: 12500, quality: 0.075 },
    { name: "Void Necklace", stage: 4, cost: 65000, quality: 0.095 },
    { name: "Universe Fragment", stage: 5, cost: 190000, quality: 0.12 },
    { name: "Chronal Compass", stage: 7, cost: 780000, quality: 0.15 },
    { name: "Observer Lens", stage: 13, cost: 3600000, quality: 0.2 },
]

const observerStageResourceData = {
    rebirth: { rebirths: 1, log: "Touched the amulet and restarted with a cleaner memory." },
    evil: { evil: 1, rebirths: 1, log: "Accepted Evil and opened the first dark route." },
    void: { evil: 25, rebirths: 1, log: "Reached the Void route and learned to keep Evil between runs." },
    multiverse: { mp: 1, log: "Opened the Multiverse signal and started earning MP." },
    u2: { mp: 8, log: "Broke into Universe II and began tracking bureaucracy." },
    u3: { mp: 22, log: "Entered Universe III and adjusted to arcane tariffs." },
    u4: { mp: 48, log: "Entered Universe IV and anchored the first time fracture." },
    u5: { mp: 95, log: "Entered Universe V and learned to survive greedy expenses." },
    u6: { evil: 90, mp: 180, log: "Entered Universe VI and routed through dimming Void pressure." },
    u7: { mp: 340, log: "Entered Universe VII and stabilized causality." },
    u8: { mp: 640, log: "Entered Universe VIII and rebuilt the broken ladder." },
    u9: { evil: 220, mp: 1150, log: "Entered Universe IX and contained the collapse." },
    u10: { evil: 420, mp: 2200, log: "Entered Universe X and heard the Observer threshold." },
}

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
    if (state.next_subject_id == null)
        state.next_subject_id = state.subjects.length + 1
    if (state.observed_subject_id == null || isNaN(state.observed_subject_id))
        state.observed_subject_id = null
    if (state.upgrades == null)
        state.upgrades = {}

    for (const key in observerUpgradeData) {
        if (state.upgrades[key] == null)
            state.upgrades[key] = 0
    }

    for (const subject of state.subjects) {
        normalizeObserverSubject(subject, state)
    }

    let nextId = 1
    for (const subject of state.subjects) {
        if (subject.id != null && !isNaN(subject.id))
            nextId = Math.max(nextId, Math.floor(subject.id) + 1)
    }
    state.next_subject_id = Math.max(state.next_subject_id, nextId)

    return state
}

function normalizeObserverSubject(subject, state = null) {
    if (subject.id == null)
        subject.id = state != null ? state.next_subject_id++ : gameData.observer.next_subject_id++
    if (subject.rank == null || observerRankData[subject.rank] == null)
        subject.rank = "trash"
    if (subject.personality == null || observerPersonalityData[subject.personality] == null)
        subject.personality = rollObserverPersonality()
    if (subject.character_level == null || isNaN(subject.character_level))
        subject.character_level = 0
    if (subject.milestones == null || Array.isArray(subject.milestones))
        subject.milestones = {}
    for (const key in observerSubjectMilestoneData) {
        if (subject.milestones[key] == null)
            subject.milestones[key] = false
    }
    if (subject.insights == null || Array.isArray(subject.insights))
        subject.insights = {}
    for (const key in observerSubjectInsightData) {
        if (subject.insights[key] == null)
            subject.insights[key] = false
    }
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
    if (subject.loop_memory == null || isNaN(subject.loop_memory))
        subject.loop_memory = subject.completed_universe_x
    if (subject.ai_level == null || isNaN(subject.ai_level))
        subject.ai_level = 1
    if (subject.ai_xp == null || isNaN(subject.ai_xp))
        subject.ai_xp = 0
    if (subject.route_resets == null || isNaN(subject.route_resets))
        subject.route_resets = 0
    if (subject.bot_age_days == null || isNaN(subject.bot_age_days))
        subject.bot_age_days = 365 * 14
    if (subject.bot_coins == null || isNaN(subject.bot_coins))
        subject.bot_coins = 0
    if (subject.bot_evil == null || isNaN(subject.bot_evil))
        subject.bot_evil = 0
    if (subject.bot_mp == null || isNaN(subject.bot_mp))
        subject.bot_mp = 0
    if (subject.bot_rebirths == null || isNaN(subject.bot_rebirths))
        subject.bot_rebirths = 0
    if (subject.bot_job_level == null || isNaN(subject.bot_job_level))
        subject.bot_job_level = 1
    if (subject.bot_skill_level == null || isNaN(subject.bot_skill_level))
        subject.bot_skill_level = 1
    if (subject.bot_job_xp == null || isNaN(subject.bot_job_xp))
        subject.bot_job_xp = 0
    if (subject.bot_skill_xp == null || isNaN(subject.bot_skill_xp))
        subject.bot_skill_xp = 0
    if (subject.bot_property_index == null || isNaN(subject.bot_property_index))
        subject.bot_property_index = 0
    if (subject.bot_items == null || !Array.isArray(subject.bot_items))
        subject.bot_items = []
    if (subject.bot_focus_job == null)
        subject.bot_focus_job = getObserverSubjectStage(subject).job
    if (subject.bot_focus_skill == null)
        subject.bot_focus_skill = getObserverSubjectStage(subject).skill
    if (subject.bot_next_decision == null || isNaN(subject.bot_next_decision))
        subject.bot_next_decision = 0
    if (subject.bot_next_purchase == null || isNaN(subject.bot_next_purchase))
        subject.bot_next_purchase = 0
    if (subject.bot_route_quality == null || isNaN(subject.bot_route_quality))
        subject.bot_route_quality = 1
    if (subject.clean_log_tier == null || isNaN(subject.clean_log_tier))
        subject.clean_log_tier = 0
    if (subject.bot_log == null || !Array.isArray(subject.bot_log))
        subject.bot_log = ["Started a fresh Progress Knight run."]
    if (subject.last_action == null)
        subject.last_action = "Waking up in Prime World."

    subject.stage_index = Math.max(0, Math.min(observerSubjectStages.length - 1, Math.floor(subject.stage_index)))
    subject.progress = Math.max(0, subject.progress)
    subject.bot_property_index = Math.max(0, Math.min(observerBotProperties.length - 1, Math.floor(subject.bot_property_index)))
    subject.bot_job_level = Math.max(1, Math.floor(subject.bot_job_level))
    subject.bot_skill_level = Math.max(1, Math.floor(subject.bot_skill_level))
}

function getObserverRankOrder() {
    return ["trash", "common", "skilled", "rare", "epic", "legendary"]
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

function getObserverEntryLegacyBonus(signal) {
    const safeSignal = getSafeObserverNumber(signal, 0)
    const multiverse = typeof getMultiverseState === "function" ? getMultiverseState() : null
    const breaks = multiverse == null ? 0 : Math.max(0, multiverse.universe_breaks || 0)
    const records = multiverse == null || multiverse.universe_break_records == null ? {} : multiverse.universe_break_records
    let recordedBreaks = 0

    for (const key in records) {
        if (!isNaN(records[key]))
            recordedBreaks += Math.max(0, records[key])
    }

    const signalBonus = Math.sqrt(Math.max(1, safeSignal)) * 2.15
    const breakBonus = Math.min(150, breaks * 14 + Math.sqrt(recordedBreaks) * 18)
    const lifetimeBonus = Math.min(180, Math.log10(Math.max(0, gameData.multiverse_points_lifetime || 0) + 10) * 13)

    return getSafeObserverNumber(Math.min(520, Math.max(25, signalBonus + breakBonus + lifetimeBonus)), 25, 520)
}

function grantObserverEntryLegacy(multiverse) {
    const state = getObserverState()
    const signal = typeof getObserverSignalStrength === "function" ? getObserverSignalStrength() : 0
    const bonusPoints = getObserverEntryLegacyBonus(signal)

    state.points += bonusPoints
    state.lifetime_points += bonusPoints
    state.upgrades.clear_instructions = Math.max(state.upgrades.clear_instructions || 0, 1)
    if (bonusPoints >= 120)
        state.upgrades.early_guidance = Math.max(state.upgrades.early_guidance || 0, 1)
    if (bonusPoints >= 240)
        state.upgrades.route_drills = Math.max(state.upgrades.route_drills || 0, 1)

    if (state.subjects.length == 0) {
        const subject = createObserverSubject(true)
        subject.ai_xp += Math.min(180, signal * 0.11 + bonusPoints * 0.28)
        subject.character_level = Math.max(subject.character_level || 0, Math.min(3, Math.floor(bonusPoints / 155)))
        subject.bot_mp += Math.min(5000, signal * 0.35)
        subject.last_action = "Inherited a fragment of the Observer Signal and started the first watched run."
        pushObserverSubjectLog(subject, subject.last_action)
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

function getObserverSubjectCharacterCost(subject) {
    const level = Math.max(0, subject.character_level || 0)
    const rankIndex = Math.max(0, getObserverRankOrder().indexOf(subject.rank))
    const refinementDiscount = Math.max(0.35, 1 - getObserverUpgradeLevel("character_refinement") * 0.08)
    return 55 * Math.pow(1.85, level) * (1 + rankIndex * 0.28) * (1 + subject.completed_universe_x * 0.25) * refinementDiscount
}

function improveObserverSubjectCharacter(id) {
    const state = getObserverState()
    for (const subject of state.subjects) {
        if (subject.id != id)
            continue

        normalizeObserverSubject(subject, state)
        const cost = getObserverSubjectCharacterCost(subject)
        if (state.points < cost)
            return false

        state.points -= cost
        subject.character_level += 1
        subject.clean_time = Math.max(0, subject.clean_time * 0.5)
        subject.last_action = "The Observer strengthened this subject's " + getObserverSubjectPersonality(subject).name + " character."
        pushObserverSubjectLog(subject, subject.last_action)
        renderObserver()
        return true
    }

    return false
}

function getObserverRankUpgradeCost(subject) {
    const order = getObserverRankOrder()
    const index = order.indexOf(subject.rank)
    if (index < 0 || index >= order.length - 1)
        return Infinity

    const refinementDiscount = Math.max(0.28, 1 - getObserverUpgradeLevel("character_refinement") * 0.12)
    return 85 * Math.pow(3.25, index) * (1 + subject.completed_universe_x * 0.45) * refinementDiscount
}

function improveObserverSubjectRank(id) {
    const state = getObserverState()
    const order = getObserverRankOrder()
    for (const subject of state.subjects) {
        if (subject.id != id)
            continue

        const index = order.indexOf(subject.rank)
        const cost = getObserverRankUpgradeCost(subject)
        if (index < 0 || index >= order.length - 1 || state.points < cost)
            return false

        state.points -= cost
        subject.rank = order[index + 1]
        subject.clean_time = 0
        subject.last_action = "The Observer refined this subject into " + observerRankData[subject.rank].name + " rank."
        pushObserverSubjectLog(subject, subject.last_action)
        renderObserver()
        return true
    }

    return false
}

function getObserverSubjectCost() {
    const state = getObserverState()
    if (state.subjects.length == 0)
        return 0

    return 40 * Math.pow(1.9, state.subjects.length - 1)
}

function buyObserverSubject() {
    const cost = getObserverSubjectCost()
    const state = getObserverState()
    if (state.points < cost)
        return false

    state.points -= cost
    createObserverSubject(state.subjects.length == 0)
    return true
}

function getObservedObserverSubject() {
    const state = getObserverState()
    if (state.observed_subject_id == null)
        return null

    for (const subject of state.subjects) {
        if (subject.id == state.observed_subject_id)
            return subject
    }

    state.observed_subject_id = null
    return null
}

function observeObserverSubject(id) {
    const state = getObserverState()
    for (const subject of state.subjects) {
        if (subject.id == id) {
            state.observed_subject_id = id
            renderObserver()
            return true
        }
    }

    return false
}

function stopObservingObserverSubject() {
    getObserverState().observed_subject_id = null
    renderObserver()
}

function createObserverSubject(freeSubject) {
    const state = getObserverState()
    const id = state.next_subject_id++
    const rank = freeSubject && state.subjects.length == 0 ? "trash" : rollObserverRank()

    const subject = {
        id,
        name: getObserverSubjectName(id),
        rank,
        personality: rollObserverPersonality(),
        character_level: 0,
        milestones: {},
        insights: {},
        stage_index: 0,
        progress: 0,
        mistakes: 0,
        clean_time: 0,
        best_clean_time: 0,
        completed_universe_x: 0,
        loop_memory: 0,
        ai_level: 1,
        ai_xp: 0,
        route_resets: 0,
        bot_age_days: 365 * 14,
        bot_coins: 0,
        bot_evil: 0,
        bot_mp: 0,
        bot_rebirths: 0,
        bot_job_level: 1,
        bot_skill_level: 1,
        bot_job_xp: 0,
        bot_skill_xp: 0,
        bot_property_index: 0,
        bot_items: [],
        bot_focus_job: "Beggar",
        bot_focus_skill: "Concentration",
        bot_next_decision: 0,
        bot_next_purchase: 0,
        bot_route_quality: 1,
        bot_log: ["Started a fresh Progress Knight run."],
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

function rollObserverPersonality() {
    const keys = Object.keys(observerPersonalityData)
    return keys[Math.floor(Math.random() * keys.length)]
}

function getObserverSubjectPersonality(subject) {
    return observerPersonalityData[subject.personality] || observerPersonalityData.methodical
}

function getObserverCharacterMastery(subject) {
    const level = Math.max(0, subject.character_level || 0)
    return Math.min(1.15, Math.log2(level + 1) * 0.24)
}

function getObserverPersonalityAdaptationBonus(subject, stage = null) {
    stage = stage || getObserverSubjectStage(subject)
    const mastery = getObserverCharacterMastery(subject)
    const id = subject.personality || "methodical"
    const band = getObserverStageBand(stage)

    if (id == "timid")
        return mastery * 0.035
    if (id == "impulsive")
        return mastery * (band == "early" || band == "void" ? 0.045 : 0.025)
    if (id == "studious")
        return mastery * 0.055
    if (id == "greedy")
        return mastery * (band == "multiverse" || band == "reality" || band == "late" || band == "threshold" ? 0.05 : 0.025)
    if (id == "methodical")
        return mastery * 0.07
    if (id == "visionary")
        return mastery * (stage.universe >= 2 ? 0.09 : 0.035)

    return mastery * 0.035
}

function applyObserverCharacterMasteryToProfile(subject, profile, stage) {
    const mastery = getObserverCharacterMastery(subject)
    if (mastery <= 0)
        return

    const id = subject.personality || "methodical"
    const band = getObserverStageBand(stage)

    if (id == "timid") {
        profile.speed *= 1 + mastery * 0.045
        profile.route *= 1 + mastery * 0.075
        profile.op *= 1 + mastery * 0.045
        profile.purchase *= 1 + mastery * 0.045
        profile.mistake *= Math.max(0.72, 1 - mastery * 0.12)
    } else if (id == "impulsive") {
        profile.speed *= 1 + mastery * 0.14
        profile.xp *= 1 + mastery * 0.055
        profile.route *= 1 + mastery * 0.065
        profile.purchase *= 1 + mastery * 0.075
        profile.mistake *= Math.max(0.7, 1 - mastery * 0.16)
    } else if (id == "studious") {
        profile.xp *= 1 + mastery * 0.13
        profile.aiXp *= 1 + mastery * 0.16
        profile.route *= 1 + mastery * 0.055
        profile.op *= 1 + mastery * 0.04
        profile.mistake *= Math.max(0.78, 1 - mastery * 0.08)
    } else if (id == "greedy") {
        profile.income *= 1 + mastery * 0.14
        profile.purchase *= 1 + mastery * 0.1
        profile.op *= 1 + mastery * (band == "multiverse" || band == "reality" || band == "late" || band == "threshold" ? 0.1 : 0.055)
        profile.route *= 1 + mastery * 0.035
        profile.mistake *= Math.max(0.82, 1 - mastery * 0.07)
    } else if (id == "methodical") {
        profile.route *= 1 + mastery * 0.12
        profile.aiXp *= 1 + mastery * 0.075
        profile.op *= 1 + mastery * 0.055
        profile.purchase *= 1 + mastery * 0.045
        profile.mistake *= Math.max(0.68, 1 - mastery * 0.14)
    } else if (id == "visionary") {
        const lateFocus = stage.universe >= 2 ? 1.5 : 1
        profile.speed *= 1 + mastery * 0.07 * lateFocus
        profile.op *= 1 + mastery * 0.075 * lateFocus
        profile.xp *= 1 + mastery * 0.06 * lateFocus
        profile.route *= 1 + mastery * 0.08 * lateFocus
        profile.mistake *= Math.max(0.66, 1 - mastery * 0.12 * lateFocus)
    }
}

function applyObserverInsightProfile(subject, profile) {
    if (subject.insights == null)
        return

    for (const key in observerSubjectInsightData) {
        const insight = observerSubjectInsightData[key]
        if (!subject.insights[key] || insight.personality != subject.personality)
            continue

        profile.speed *= 1 + (insight.speed || 0)
        profile.xp *= 1 + (insight.xp || 0)
        profile.op *= 1 + (insight.op || 0)
        profile.purchase *= 1 + (insight.purchase || 0)
        profile.income *= 1 + (insight.income || 0)
        profile.route *= 1 + (insight.route || 0)
        profile.aiXp *= 1 + (insight.aiXp || 0)
        profile.mistake *= Math.max(0.55, 1 - (insight.mistake || 0))
    }
}

function getObserverPersonalityStageProfile(subject, stage = null) {
    stage = stage || getObserverSubjectStage(subject)
    const band = getObserverStageBand(stage)
    const id = subject.personality || "methodical"
    const profile = { speed: 1, xp: 1, op: 1, mistake: 1, purchase: 1, income: 1, route: 1, aiXp: 1 }

    if (id == "timid") {
        profile.speed *= band == "early" || band == "evil" ? 0.96 : 0.9
        profile.mistake *= 0.78
        profile.route *= 1.08
        profile.op *= 1.05
        profile.purchase *= 0.9
    } else if (id == "impulsive") {
        profile.speed *= band == "early" || band == "void" ? 1.18 : 1.1
        profile.mistake *= band == "late" || band == "threshold" ? 1.28 : 1.16
        profile.route *= 0.94
        profile.purchase *= 1.12
        profile.aiXp *= 0.96
    } else if (id == "studious") {
        profile.xp *= band == "evil" || band == "void" || band == "multiverse" ? 1.18 : 1.1
        profile.aiXp *= 1.16
        profile.route *= 1.06
        profile.mistake *= 0.92
        profile.speed *= 0.98
    } else if (id == "greedy") {
        profile.income *= 1.18
        profile.purchase *= 1.2
        profile.op *= band == "multiverse" || band == "reality" || band == "late" || band == "threshold" ? 1.09 : 1.03
        profile.mistake *= 1.08
        profile.route *= 0.97
    } else if (id == "methodical") {
        profile.speed *= 0.98
        profile.route *= 1.14
        profile.mistake *= 0.82
        profile.aiXp *= 1.08
        profile.purchase *= 0.96
    } else if (id == "visionary") {
        profile.speed *= band == "reality" || band == "late" || band == "threshold" ? 1.18 : 1.04
        profile.op *= band == "multiverse" || band == "reality" || band == "late" || band == "threshold" ? 1.16 : 1.02
        profile.xp *= stage.universe >= 2 ? 1.08 : 1
        profile.mistake *= stage.universe >= 2 ? 0.88 : 0.96
        profile.route *= stage.universe >= 2 ? 1.1 : 1.02
    }

    applyObserverCharacterMasteryToProfile(subject, profile, stage)
    applyObserverInsightProfile(subject, profile)

    const characterLevel = Math.max(0, subject.character_level || 0)
    const characterBoost = 1 + Math.min(0.75, characterLevel * 0.035)
    const characterControl = Math.max(0.58, 1 - Math.min(0.42, characterLevel * 0.035))
    profile.speed *= characterBoost
    profile.xp *= characterBoost
    profile.op *= 1 + Math.min(0.65, characterLevel * 0.03)
    profile.income *= 1 + Math.min(0.55, characterLevel * 0.025)
    profile.route *= 1 + Math.min(0.45, characterLevel * 0.022)
    profile.aiXp *= 1 + Math.min(0.6, characterLevel * 0.032)
    profile.mistake *= characterControl
    profile.purchase *= 1 + Math.min(0.3, characterLevel * 0.015)

    return profile
}

function getObserverStageBand(stage) {
    if (stage.id == "life" || stage.id == "rebirth")
        return "early"
    if (stage.id == "evil")
        return "evil"
    if (stage.id == "void")
        return "void"
    if (stage.universe >= 10)
        return "threshold"
    if (stage.universe >= 6)
        return "late"
    if (stage.universe >= 2)
        return "reality"
    return "multiverse"
}

function getObserverSubjectGoal(subject) {
    const stage = getObserverSubjectStage(subject)
    const previous = getObserverPreviousThreshold(subject.stage_index)
    const remaining = Math.max(0, stage.threshold - subject.progress)
    const speed = getObserverSpeedMultiplier(subject)
    const eta = speed > 0 ? remaining / speed : 0
    const progress = getObserverStageProgress(subject)
    const label = progress >= 96 ? "Finishing " : "Reach "
    return label + stage.name + " (" + formatTime(eta, true) + ")"
}

function getObserverSubjectRankStyle(subject) {
    const rank = observerRankData[subject.rank]
    if (subject.rank == "trash")
        return "Overbuys, swaps focus late, and loses clean streaks."
    if (subject.rank == "common")
        return "Runs a safe simple route with weak late-universe adaptation."
    if (subject.rank == "skilled")
        return "Keeps a stable route through Evil, Void, and early universes."
    if (subject.rank == "rare")
        return "Plans around unlock chains and avoids most bad purchases."
    if (subject.rank == "epic")
        return "Adapts quickly to distorted universe rules."
    if (subject.rank == "legendary")
        return "Near-optimal route toward U-X and Observer Signal."

    return rank.description
}

function getObserverSubjectPersonalityStyle(subject) {
    return getObserverSubjectPersonality(subject).description
}

function getObserverSubjectMilestoneCount(subject) {
    normalizeObserverSubject(subject)
    let count = 0
    for (const key in observerSubjectMilestoneData) {
        if (subject.milestones[key])
            count += 1
    }
    return count
}

function getObserverSubjectInsightCount(subject) {
    normalizeObserverSubject(subject)
    let count = 0
    for (const key in observerSubjectInsightData) {
        if (subject.insights[key])
            count += 1
    }
    return count
}

function getObserverSubjectMilestoneMultiplier(subject, type) {
    normalizeObserverSubject(subject)
    let bonus = 0
    for (const key in observerSubjectMilestoneData) {
        if (subject.milestones[key])
            bonus += observerSubjectMilestoneData[key][type] || 0
    }
    return type == "mistake" ? Math.max(0.48, 1 - bonus) : 1 + bonus
}

function getObserverLoopMemoryPower(subject) {
    normalizeObserverSubject(subject)
    const memory = Math.max(0, subject.loop_memory || 0)
    const clears = Math.max(0, subject.completed_universe_x || 0)
    const rankIndex = Math.max(0, getObserverRankOrder().indexOf(subject.rank))
    const personality = subject.personality || "methodical"
    let personalityBonus = 1

    if (personality == "methodical")
        personalityBonus = 1.12
    else if (personality == "visionary")
        personalityBonus = 1.18
    else if (personality == "studious")
        personalityBonus = 1.08
    else if (personality == "impulsive")
        personalityBonus = 0.96

    return Math.min(1.65, (Math.log2(memory + 1) * 0.22 + Math.sqrt(clears) * 0.055 + rankIndex * 0.025) * personalityBonus)
}

function getObserverLoopMemorySpeedBonus(subject) {
    return 1 + getObserverLoopMemoryPower(subject) * 0.18
}

function getObserverLoopMemoryOpBonus(subject) {
    return 1 + getObserverLoopMemoryPower(subject) * 0.24
}

function getObserverLoopMemoryXpBonus(subject) {
    return 1 + getObserverLoopMemoryPower(subject) * 0.16
}

function getObserverLoopMemoryMistakeMultiplier(subject) {
    return Math.max(0.7, 1 - getObserverLoopMemoryPower(subject) * 0.14)
}

function shouldUnlockObserverSubjectInsight(subject, key) {
    const insight = observerSubjectInsightData[key]
    if (insight == null || insight.personality != subject.personality)
        return false

    const stage = getObserverSubjectStage(subject)

    if (key == "timid_composure")
        return subject.clean_time >= 300 || subject.best_clean_time >= 300
    if (key == "timid_shelter")
        return subject.bot_property_index >= 2
    if (key == "impulsive_control")
        return subject.stage_index >= 3
    if (key == "impulsive_recovery")
        return subject.mistakes >= 3 || subject.route_resets >= 1
    if (key == "studious_notes")
        return subject.ai_level >= 6
    if (key == "studious_thesis")
        return subject.stage_index >= 4 && subject.bot_skill_level >= getObserverBotTargetLevel(subject) * 0.7
    if (key == "greedy_ledger")
        return subject.bot_items.length >= 3
    if (key == "greedy_investor")
        return subject.stage_index >= 5 && subject.bot_coins >= getObserverBotPurchaseReserve(subject) * 2
    if (key == "methodical_routine")
        return subject.clean_time >= 1800 || subject.best_clean_time >= 1800
    if (key == "methodical_loop")
        return subject.completed_universe_x > 0
    if (key == "visionary_signal")
        return stage.universe >= 2
    if (key == "visionary_threshold")
        return stage.universe >= 8 || subject.completed_universe_x > 0

    return false
}

function updateObserverSubjectInsights(subject) {
    normalizeObserverSubject(subject)
    for (const key in observerSubjectInsightData) {
        if (subject.insights[key] || !shouldUnlockObserverSubjectInsight(subject, key))
            continue

        const insight = observerSubjectInsightData[key]
        subject.insights[key] = true
        subject.last_action = "Insight awakened: " + insight.name + "."
        pushObserverSubjectLog(subject, subject.last_action)
    }
}

function shouldUnlockObserverSubjectMilestone(subject, key) {
    const stage = getObserverSubjectStage(subject)
    if (key == "first_rebirth")
        return subject.stage_index >= 1 || subject.bot_rebirths > 0
    if (key == "first_evil")
        return subject.stage_index >= 2 || subject.bot_evil > 0
    if (key == "first_void")
        return subject.stage_index >= 3
    if (key == "multiverse_signal")
        return subject.stage_index >= 4 || subject.bot_mp > 0
    if (key == "universe_ii")
        return stage.universe >= 2
    if (key == "universe_v")
        return stage.universe >= 5
    if (key == "universe_x")
        return stage.universe >= 10 || subject.completed_universe_x > 0
    if (key == "first_u10_clear")
        return subject.completed_universe_x > 0

    return false
}

function updateObserverSubjectMilestones(subject) {
    normalizeObserverSubject(subject)
    for (const key in observerSubjectMilestoneData) {
        if (subject.milestones[key] || !shouldUnlockObserverSubjectMilestone(subject, key))
            continue

        const milestone = observerSubjectMilestoneData[key]
        subject.milestones[key] = true
        subject.last_action = "Milestone reached: " + milestone.name + "."
        pushObserverSubjectLog(subject, subject.last_action)
    }
}

function getObserverBotIncome(subject) {
    const stage = getObserverSubjectStage(subject)
    const rank = observerRankData[subject.rank]
    const profile = getObserverPersonalityStageProfile(subject, stage)
    const stageValue = Math.pow(stage.threshold + 10, 1.18) * (1 + stage.universe * 0.45)
    const rankValue = Math.max(0.25, rank.speed * rank.op)
    return getSafeObserverNumber(stageValue * rankValue * profile.income * getObserverAiLevelSpeed(subject), 0, 1e300)
}

function getObserverBotSkillLevel(subject) {
    const stage = getObserverSubjectStage(subject)
    const previous = getObserverPreviousThreshold(subject.stage_index)
    const stageSpan = Math.max(1, stage.threshold - previous)
    const localProgress = Math.max(0, subject.progress - previous) / stageSpan
    return Math.max(1, Math.max(
        Math.floor(subject.stage_index * 11 + localProgress * 35 + subject.ai_level * 0.8),
        subject.bot_skill_level || 1,
    ))
}

function getObserverBotJobLevel(subject) {
    const stage = getObserverSubjectStage(subject)
    const previous = getObserverPreviousThreshold(subject.stage_index)
    const stageSpan = Math.max(1, stage.threshold - previous)
    const localProgress = Math.max(0, subject.progress - previous) / stageSpan
    return Math.max(1, Math.max(
        Math.floor(subject.stage_index * 10 + localProgress * 32 + subject.ai_level * 0.7),
        subject.bot_job_level || 1,
    ))
}

function getObserverBotRank(subject) {
    return observerBotRankData[subject.rank] || observerBotRankData.common
}

function getObserverBotProperty(subject) {
    return observerBotProperties[Math.max(0, Math.min(observerBotProperties.length - 1, subject.bot_property_index || 0))]
}

function getObserverBotTargetLevel(subject) {
    return Math.max(5, subject.stage_index * 9 + getObserverSubjectStage(subject).universe * 8 + 14)
}

function getObserverSubjectAdaptation(subject) {
    const stage = getObserverSubjectStage(subject)
    const rank = getObserverBotRank(subject)
    const personalityProfile = getObserverPersonalityStageProfile(subject, stage)
    const ai = Math.min(0.55, Math.log2(Math.max(1, subject.ai_level)) * 0.045)
    const milestones = Math.min(0.35, getObserverSubjectMilestoneCount(subject) * 0.035)
    const upgrades = getObserverUpgradeLevel("better_instincts") * 0.035
    const patronage = getObserverUpgradeLevel("hidden_patronage") * 0.018
    const thresholdIntuition = stage.universe >= 8 ? getObserverUpgradeLevel("threshold_intuition") * 0.055 : 0
    const characterAdaptation = getObserverPersonalityAdaptationBonus(subject, stage)
    const stagePressure = Math.max(0, stage.difficulty - 1) * 0.12
    const rankControl = Math.max(0.35, rank.choice * rank.thrift * personalityProfile.route)

    return getSafeObserverNumber(Math.max(0.35, rankControl + ai + milestones + upgrades + patronage + thresholdIntuition + characterAdaptation - stagePressure), 1, 2.55)
}

function getObserverBotXpToNext(level, stageIndex) {
    return 16 + Math.pow(level + 2, 1.34) * (1 + stageIndex * 0.08)
}

function getObserverBotItemQuality(subject) {
    if (subject.bot_items == null)
        return 0

    let quality = 0
    for (const itemName of subject.bot_items) {
        for (const item of observerBotItems) {
            if (item.name == itemName) {
                quality += item.quality
                break
            }
        }
    }
    return quality * (1 + getObserverUpgradeLevel("hidden_patronage") * 0.025)
}

function getObserverSubjectRouteQuality(subject) {
    const target = getObserverBotTargetLevel(subject)
    const jobFit = Math.min(1.25, (subject.bot_job_level || 1) / target)
    const skillFit = Math.min(1.25, (subject.bot_skill_level || 1) / target)
    const property = getObserverBotProperty(subject)
    const itemQuality = getObserverBotItemQuality(subject)
    const mistakePenalty = Math.max(0.72, 1 - Math.min(0.28, subject.mistakes * 0.0035))
    const instinctBonus = getObserverUpgradeLevel("better_instincts") * 0.035
    const personalityProfile = getObserverPersonalityStageProfile(subject)
    const adaptation = getObserverSubjectAdaptation(subject)
    const quality = (0.5 + jobFit * 0.2 + skillFit * 0.24 + property.quality + itemQuality + instinctBonus) * mistakePenalty * personalityProfile.route * Math.sqrt(adaptation)
    subject.bot_route_quality = getSafeObserverNumber(Math.max(0.52, Math.min(1.85, quality)), 1)
    return subject.bot_route_quality
}

function getObserverBotWrongRouteName(subject, type) {
    const index = Math.max(0, subject.stage_index - 1)
    const fallback = getObserverSubjectStage(subject)
    const stage = Math.random() < 0.5 ? observerSubjectStages[index] : fallback
    return type == "job" ? stage.job : stage.skill
}

function updateObserverSubjectDecision(subject, dt) {
    subject.bot_next_decision -= dt
    if (subject.bot_next_decision > 0)
        return

    const stage = getObserverSubjectStage(subject)
    const rank = getObserverBotRank(subject)
    const personality = getObserverSubjectPersonality(subject)
    const aiBonus = Math.min(0.28, Math.log2(subject.ai_level + 1) * 0.035)
    const instinctBonus = getObserverUpgradeLevel("better_instincts") * 0.035
    const thresholdBonus = stage.universe >= 8 ? getObserverUpgradeLevel("threshold_intuition") * 0.018 : 0
    const rightChoiceChance = Math.min(0.98, rank.choice + personality.choice + aiBonus + instinctBonus + thresholdBonus)
    const oldJob = subject.bot_focus_job
    const oldSkill = subject.bot_focus_skill

    if (Math.random() < rank.wrongRoute * Math.max(0.24, 1 - aiBonus - instinctBonus)) {
        subject.bot_focus_job = getObserverBotWrongRouteName(subject, "job")
        subject.bot_focus_skill = getObserverBotWrongRouteName(subject, "skill")
    } else if (Math.random() < rightChoiceChance) {
        subject.bot_focus_job = stage.job
        subject.bot_focus_skill = stage.skill
    }

    subject.bot_next_decision = Math.max(1.8, 8.5 - rank.choice * 4.2 - personality.speed * 0.6 - Math.min(2.5, subject.ai_level * 0.035))

    if (oldJob != subject.bot_focus_job || oldSkill != subject.bot_focus_skill) {
        subject.last_action = getObserverRouteSwitchMessage(subject, stage)
        pushObserverSubjectLog(subject, subject.last_action)
    }
}

function getObserverRouteSwitchMessage(subject, stage) {
    const route = subject.bot_focus_job + " / " + subject.bot_focus_skill

    if (subject.personality == "timid")
        return "Chose the safer " + route + " route for " + stage.name + "."
    if (subject.personality == "impulsive")
        return "Rushed into " + route + " and hopes it works."
    if (subject.personality == "studious")
        return "Replanned studies around " + route + "."
    if (subject.personality == "greedy")
        return "Chased the profitable " + route + " route."
    if (subject.personality == "methodical")
        return "Locked a clean " + route + " route."
    if (subject.personality == "visionary")
        return "Predicted the next distortion and moved to " + route + "."

    return "Switched route to " + route + "."
}

function updateObserverSubjectTraining(subject, dt) {
    const stage = getObserverSubjectStage(subject)
    const rank = getObserverBotRank(subject)
    const personality = getObserverSubjectPersonality(subject)
    const personalityProfile = getObserverPersonalityStageProfile(subject, stage)
    const speed = getObserverSpeedMultiplier(subject)
    const routeQuality = getObserverSubjectRouteQuality(subject)
    const xpBase = (0.9 + speed * 0.55) * rank.choice * personality.xp * personalityProfile.xp * (0.7 + routeQuality * 0.38)
    const targetJob = subject.bot_focus_job == stage.job ? 1.18 : 0.58
    const targetSkill = subject.bot_focus_skill == stage.skill ? 1.2 : 0.58

    subject.bot_job_xp += getSafeObserverNumber(xpBase * targetJob * dt, 0)
    subject.bot_skill_xp += getSafeObserverNumber(xpBase * targetSkill * rank.rebirth * dt, 0)

    let leveled = false
    let guard = 0
    while (subject.bot_job_xp >= getObserverBotXpToNext(subject.bot_job_level, subject.stage_index) && guard < 20) {
        subject.bot_job_xp -= getObserverBotXpToNext(subject.bot_job_level, subject.stage_index)
        subject.bot_job_level += 1
        leveled = true
        guard += 1
    }

    guard = 0
    while (subject.bot_skill_xp >= getObserverBotXpToNext(subject.bot_skill_level, subject.stage_index) && guard < 20) {
        subject.bot_skill_xp -= getObserverBotXpToNext(subject.bot_skill_level, subject.stage_index)
        subject.bot_skill_level += 1
        leveled = true
        guard += 1
    }

    if (leveled && (subject.bot_job_level + subject.bot_skill_level) % 16 == 0) {
        subject.last_action = "Improved " + subject.bot_focus_job + " and " + subject.bot_focus_skill + " routing."
        pushObserverSubjectLog(subject, subject.last_action)
    }
}

function getObserverBotPurchaseReserve(subject) {
    const rank = getObserverBotRank(subject)
    const personality = getObserverSubjectPersonality(subject)
    const stage = getObserverSubjectStage(subject)
    const personalityProfile = getObserverPersonalityStageProfile(subject, stage)
    const patronage = 1 + getObserverUpgradeLevel("quiet_patronage") * 0.08 + getObserverUpgradeLevel("hidden_patronage") * 0.1
    return Math.max(120, getObserverBotIncome(subject) * (1.2 + stage.difficulty * 0.22) / Math.max(0.4, rank.thrift * personality.purchase * personalityProfile.purchase * patronage))
}

function updateObserverSubjectPurchases(subject, dt) {
    subject.bot_next_purchase -= dt
    if (subject.bot_next_purchase > 0)
        return

    const rank = getObserverBotRank(subject)
    const personality = getObserverSubjectPersonality(subject)
    const personalityProfile = getObserverPersonalityStageProfile(subject)
    const patronageSpeed = 1 + getObserverUpgradeLevel("quiet_patronage") * 0.07 + getObserverUpgradeLevel("hidden_patronage") * 0.09
    const reserve = getObserverBotPurchaseReserve(subject)
    const nextProperty = observerBotProperties[Math.min(observerBotProperties.length - 1, (subject.bot_property_index || 0) + 1)]

    if (nextProperty != null && nextProperty.stage <= subject.stage_index && subject.bot_coins > nextProperty.cost + reserve * (1 + nextProperty.reserve)) {
        subject.bot_coins -= nextProperty.cost
        subject.bot_property_index += 1
        subject.last_action = "Bought " + nextProperty.name + " for a safer route."
        pushObserverSubjectLog(subject, subject.last_action)
        subject.bot_next_purchase = Math.max(1.5, 8 - rank.purchase * personality.purchase * personalityProfile.purchase * patronageSpeed * 4)
        return
    }

    for (const item of observerBotItems) {
        if (item.stage > subject.stage_index || subject.bot_items.includes(item.name))
            continue

        if (subject.bot_coins > item.cost + reserve) {
            subject.bot_coins -= item.cost
            subject.bot_items.push(item.name)
            subject.last_action = "Bought " + item.name + "."
            pushObserverSubjectLog(subject, subject.last_action)
            subject.bot_next_purchase = Math.max(1.5, 8.5 - rank.purchase * personality.purchase * personalityProfile.purchase * patronageSpeed * 4)
            return
        }
    }

    const debtProtection = Math.max(0.24, 1 - getObserverUpgradeLevel("quiet_patronage") * 0.09 - getObserverUpgradeLevel("hidden_patronage") * 0.12)
    if (rank.debtLoss > 0.2 && Math.random() < rank.debtLoss * debtProtection * 0.018) {
        subject.bot_coins = Math.max(0, subject.bot_coins * (0.82 + Math.min(0.23, getObserverUpgradeLevel("quiet_patronage") * 0.018 + getObserverUpgradeLevel("hidden_patronage") * 0.026)))
        subject.last_action = "Wasted gold on a bad purchase and recovered the route."
        pushObserverSubjectLog(subject, subject.last_action)
    }

    subject.bot_next_purchase = Math.max(2.5, 10 - rank.purchase * personality.purchase * personalityProfile.purchase * patronageSpeed * 3.2)
}

function pushObserverSubjectLog(subject, message) {
    if (subject.bot_log == null || !Array.isArray(subject.bot_log))
        subject.bot_log = []

    const day = Math.floor(subject.bot_age_days % 365)
    const year = Math.floor(subject.bot_age_days / 365)
    subject.bot_log.unshift(year + "y " + day + "d - " + message)

    while (subject.bot_log.length > 8)
        subject.bot_log.pop()
}

function getObserverRankPhaseTable(subject, table, fallback) {
    const rankTable = table[subject.rank]
    if (rankTable == null)
        return fallback

    const band = getObserverStageBand(getObserverSubjectStage(subject))
    if (rankTable[band] == null)
        return fallback

    return rankTable[band]
}

function getObserverRankStageSpeed(subject) {
    return getObserverRankPhaseTable(subject, {
        trash: { early: 0.95, evil: 0.72, void: 0.62, multiverse: 0.58, reality: 0.55, late: 0.5, threshold: 0.45 },
        common: { early: 0.96, evil: 0.88, void: 0.82, multiverse: 0.8, reality: 0.78, late: 0.72, threshold: 0.68 },
        skilled: { early: 1, evil: 1.02, void: 1.03, multiverse: 1.04, reality: 1.05, late: 1.04, threshold: 1.02 },
        rare: { early: 1.02, evil: 1.08, void: 1.12, multiverse: 1.15, reality: 1.18, late: 1.22, threshold: 1.2 },
        epic: { early: 1.05, evil: 1.14, void: 1.2, multiverse: 1.26, reality: 1.32, late: 1.45, threshold: 1.55 },
        legendary: { early: 1.08, evil: 1.22, void: 1.35, multiverse: 1.45, reality: 1.58, late: 1.85, threshold: 2.05 },
    }, 1)
}

function getObserverRankStageOp(subject) {
    return getObserverRankPhaseTable(subject, {
        trash: { early: 1, evil: 0.82, void: 0.72, multiverse: 0.68, reality: 0.62, late: 0.56, threshold: 0.5 },
        common: { early: 0.98, evil: 0.94, void: 0.9, multiverse: 0.88, reality: 0.86, late: 0.82, threshold: 0.78 },
        skilled: { early: 1, evil: 1, void: 1.02, multiverse: 1.04, reality: 1.06, late: 1.08, threshold: 1.08 },
        rare: { early: 1.02, evil: 1.08, void: 1.12, multiverse: 1.16, reality: 1.2, late: 1.26, threshold: 1.28 },
        epic: { early: 1.05, evil: 1.14, void: 1.2, multiverse: 1.28, reality: 1.38, late: 1.52, threshold: 1.62 },
        legendary: { early: 1.08, evil: 1.22, void: 1.34, multiverse: 1.48, reality: 1.68, late: 1.95, threshold: 2.18 },
    }, 1)
}

function getObserverRankStageMistake(subject) {
    return getObserverRankPhaseTable(subject, {
        trash: { early: 1.1, evil: 1.25, void: 1.38, multiverse: 1.48, reality: 1.62, late: 1.82, threshold: 2 },
        common: { early: 1, evil: 1.04, void: 1.08, multiverse: 1.12, reality: 1.16, late: 1.22, threshold: 1.28 },
        skilled: { early: 1, evil: 0.98, void: 0.96, multiverse: 0.94, reality: 0.92, late: 0.9, threshold: 0.9 },
        rare: { early: 0.95, evil: 0.88, void: 0.84, multiverse: 0.8, reality: 0.76, late: 0.72, threshold: 0.72 },
        epic: { early: 0.85, evil: 0.78, void: 0.72, multiverse: 0.66, reality: 0.6, late: 0.56, threshold: 0.55 },
        legendary: { early: 0.75, evil: 0.66, void: 0.58, multiverse: 0.5, reality: 0.45, late: 0.4, threshold: 0.38 },
    }, 1)
}

function getObserverUniverseMasteryAssist(stage) {
    if (stage == null || stage.universe == null || stage.universe <= 1)
        return 1
    if (typeof getRememberedUniverseParameter != "function")
        return 1

    const mastery = getRememberedUniverseParameter(stage.universe)
    return 1 + Math.min(0.42, Math.log2(Math.max(1, mastery)) * 0.075)
}

function getObserverPhaseSpeedMultiplier(stage) {
    const band = getObserverStageBand(stage)
    let multiplier = 1

    if (band == "early")
        multiplier *= 1 + getObserverUpgradeLevel("early_guidance") * 0.12
    if (band == "early" || band == "evil")
        multiplier *= 1 + getObserverUpgradeLevel("gentle_push") * 0.09
    if (band == "evil" || band == "void")
        multiplier *= 1 + getObserverUpgradeLevel("void_protocols") * 0.1
    if (band == "reality")
        multiplier *= 1 + getObserverUpgradeLevel("reality_scripts") * 0.09
    if (band == "late" || band == "threshold")
        multiplier *= 1 + getObserverUpgradeLevel("threshold_maps") * 0.07
    if (stage.universe >= 8)
        multiplier *= 1 + getObserverUpgradeLevel("threshold_tutoring") * 0.08
    if (stage.universe >= 8)
        multiplier *= 1 + getObserverUpgradeLevel("threshold_intuition") * 0.075
    multiplier *= getObserverUniverseMasteryAssist(stage)

    return multiplier
}

function getObserverPhaseOpMultiplier(stage) {
    const band = getObserverStageBand(stage)
    let multiplier = 1

    if (band == "evil" || band == "void")
        multiplier *= 1 + getObserverUpgradeLevel("void_protocols") * 0.08
    if (band == "multiverse" || band == "reality" || band == "late" || band == "threshold")
        multiplier *= 1 + getObserverUpgradeLevel("deep_simulation") * 0.11
    if (band == "late" || band == "threshold")
        multiplier *= 1 + getObserverUpgradeLevel("threshold_maps") * 0.07
    if (stage.universe >= 8)
        multiplier *= 1 + getObserverUpgradeLevel("threshold_intuition") * 0.09
    multiplier *= 1 + (getObserverUniverseMasteryAssist(stage) - 1) * 0.55

    return multiplier
}

function getObserverPhaseXpMultiplier(stage) {
    const band = getObserverStageBand(stage)
    let multiplier = 1

    if (band == "early")
        multiplier *= 1 + getObserverUpgradeLevel("early_guidance") * 0.06
    if (band == "evil" || band == "void")
        multiplier *= 1 + getObserverUpgradeLevel("void_protocols") * 0.06
    if (band == "reality")
        multiplier *= 1 + getObserverUpgradeLevel("reality_scripts") * 0.05
    if (band == "late" || band == "threshold")
        multiplier *= 1 + getObserverUpgradeLevel("threshold_maps") * 0.05
    if (stage.universe >= 8)
        multiplier *= 1 + getObserverUpgradeLevel("threshold_intuition") * 0.055
    multiplier *= 1 + (getObserverUniverseMasteryAssist(stage) - 1) * 0.7

    return multiplier
}

function getObserverPhaseMistakeMultiplier(stage) {
    const band = getObserverStageBand(stage)
    let reduction = 0

    if (band == "early")
        reduction += getObserverUpgradeLevel("early_guidance") * 0.02
    if (band == "evil" || band == "void")
        reduction += getObserverUpgradeLevel("void_protocols") * 0.025
    if (band == "reality")
        reduction += getObserverUpgradeLevel("reality_scripts") * 0.02
    if (band == "late" || band == "threshold")
        reduction += getObserverUpgradeLevel("threshold_maps") * 0.025
    if (stage.universe >= 8)
        reduction += getObserverUpgradeLevel("threshold_tutoring") * 0.04
    if (stage.universe >= 8)
        reduction += getObserverUpgradeLevel("threshold_intuition") * 0.045
    reduction += Math.min(0.12, (getObserverUniverseMasteryAssist(stage) - 1) * 0.22)

    return Math.max(0.35, 1 - reduction)
}

function getObserverRosterSupportBonus() {
    return 1 + Math.min(0.18, Math.log2(getObserverState().subjects.length + 1) * 0.035)
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
    const personality = getObserverSubjectPersonality(subject)
    const stage = getObserverSubjectStage(subject)
    const personalityProfile = getObserverPersonalityStageProfile(subject, stage)
    const instructions = 1 + getObserverUpgradeLevel("clear_instructions") * 0.1
    const briefing = 1 + Math.max(0, stage.universe - 1) * getObserverUpgradeLevel("universe_briefing") * 0.03
    const cleanBonus = getObserverCleanSpeedBonus(subject)
    const loopMemory = getObserverLoopMemoryPower(subject)
    const repeatClearDrag = 1 + Math.sqrt(subject.completed_universe_x) * 0.08 / (1 + loopMemory * 0.3)
    return getSafeObserverNumber(rank.speed * getObserverRankStageSpeed(subject) * personality.speed * personalityProfile.speed * getObserverSubjectMilestoneMultiplier(subject, "speed") * instructions * briefing * getObserverPhaseSpeedMultiplier(stage) * cleanBonus * getObserverAiLevelSpeed(subject) * getObserverLoopMemorySpeedBonus(subject) / (stage.difficulty * repeatClearDrag), 0)
}

function getObserverEffectiveSpeedMultiplier(subject) {
    return getSafeObserverNumber(getObserverSpeedMultiplier(subject) * (0.86 + getObserverSubjectAdaptation(subject) * 0.14), 0)
}

function getObserverCleanSpeedBonus(subject) {
    return 1 + Math.min(0.45, Math.log10(subject.clean_time + 10) * 0.09)
}

function getObserverCleanXpBonus(subject) {
    return 1 + Math.min(1.25, Math.log10(subject.clean_time + 10) * 0.16)
}

function getObserverSubjectOpGain(subject) {
    const rank = observerRankData[subject.rank]
    const personality = getObserverSubjectPersonality(subject)
    const memory = 1 + getObserverUpgradeLevel("shared_memory") * 0.12
    const stage = getObserverSubjectStage(subject)
    const personalityProfile = getObserverPersonalityStageProfile(subject, stage)
    const universeValue = 0.027 * stage.universe + 0.013 * subject.stage_index
    const localProgress = getObserverStageProgress(subject) / 100
    const stageValue = 0.022 + universeValue * stage.opWeight
    const progressValue = 0.72 + localProgress * 0.56
    const universeDepth = 1 + Math.pow(Math.max(0, stage.universe - 1), 1.08) * 0.045
    const cleanBonus = 1 + Math.min(0.85, Math.log10(subject.clean_time + 10) * 0.11)
    const clearBonus = 1 + Math.log2(subject.completed_universe_x + 1) * 0.35
    const routeQuality = getObserverSubjectRouteQuality(subject)
    const levelDepth = 1 + Math.min(0.55, Math.log2((subject.bot_job_level || 1) + (subject.bot_skill_level || 1)) * 0.045)
    const adaptationValue = 0.84 + getObserverSubjectAdaptation(subject) * 0.16
    return getSafeObserverNumber(stageValue * progressValue * universeDepth * rank.op * getObserverRankStageOp(subject) * personality.op * personalityProfile.op * getObserverSubjectMilestoneMultiplier(subject, "op") * memory * getObserverPhaseOpMultiplier(stage) * cleanBonus * clearBonus * getObserverLoopMemoryOpBonus(subject) * getObserverAiLevelOp(subject) * getObserverRosterSupportBonus() * routeQuality * levelDepth * adaptationValue, 0)
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
    const personality = getObserverSubjectPersonality(subject)
    const stage = getObserverSubjectStage(subject)
    const personalityProfile = getObserverPersonalityStageProfile(subject, stage)
    const briefing = 1 + getObserverUpgradeLevel("universe_briefing") * 0.04 * Math.max(0, stage.universe - 1)
    const drills = 1 + getObserverUpgradeLevel("route_drills") * 0.14
    return getSafeObserverNumber((0.12 + stage.universe * 0.03 + subject.stage_index * 0.01) * rank.xp * personality.xp * personalityProfile.aiXp * getObserverSubjectMilestoneMultiplier(subject, "xp") * getObserverCleanXpBonus(subject) * briefing * drills * getObserverPhaseXpMultiplier(stage) * getObserverLoopMemoryXpBonus(subject), 0)
}

function updateObserver() {
    const state = getObserverState()
    updateObserverVisibility()

    if (!state.active || gameData.paused)
        return

    updateObserverSubjects()

    const gain = getObserverPointsGain() / updateSpeed
    state.points += gain
    state.lifetime_points += gain
}

function updateObserverSubjects() {
    const state = getObserverState()

    for (const subject of state.subjects) {
        normalizeObserverSubject(subject, state)

        const dt = 1 / updateSpeed
        subject.clean_time += 1 / updateSpeed
        subject.best_clean_time = Math.max(subject.best_clean_time, subject.clean_time)
        updateObserverCleanMilestone(subject)
        updateObserverSubjectDecision(subject, dt)
        updateObserverSubjectTraining(subject, dt)
        updateObserverSubjectPurchases(subject, dt)

        const routeQuality = getObserverSubjectRouteQuality(subject)
        const effectiveSpeed = getObserverEffectiveSpeedMultiplier(subject)
        subject.progress += getSafeObserverNumber(effectiveSpeed * (0.76 + routeQuality * 0.28) / updateSpeed, 0)
        subject.ai_xp += getSafeObserverNumber(getObserverAiXpGain(subject) * (0.75 + routeQuality * 0.25) / updateSpeed, 0)
        subject.bot_age_days += getSafeObserverNumber((0.55 + effectiveSpeed * 0.18) / updateSpeed, 0)
        subject.bot_coins += getSafeObserverNumber(getObserverBotIncome(subject) * (0.55 + routeQuality * 0.45) / updateSpeed, 0, 1e300)
        subject.bot_evil += getSafeObserverNumber((subject.stage_index >= 2 ? getObserverSubjectOpGain(subject) * 0.014 * routeQuality : 0) / updateSpeed, 0, 1e300)
        subject.bot_mp += getSafeObserverNumber((subject.stage_index >= 4 ? getObserverSubjectOpGain(subject) * 0.009 * routeQuality * getObserverSubjectStage(subject).universe : 0) / updateSpeed, 0, 1e300)

        let levelGuard = 0
        while (subject.ai_xp >= getObserverAiXpToNext(subject) && levelGuard < 100) {
            subject.ai_xp -= getObserverAiXpToNext(subject)
            subject.ai_level += 1
            levelGuard += 1
            subject.last_action = "Improved routing discipline to AI level " + subject.ai_level + "."
            pushObserverSubjectLog(subject, subject.last_action)
        }

        const rank = observerRankData[subject.rank]
        const personality = getObserverSubjectPersonality(subject)
        const stage = getObserverSubjectStage(subject)
        const personalityProfile = getObserverPersonalityStageProfile(subject, stage)
        const adaptationMistakeRelief = Math.max(0.55, 1 - Math.min(0.45, (getObserverSubjectAdaptation(subject) - 0.65) * 0.28))
        const mistakeChance = 0.000045 * rank.mistake * getObserverRankStageMistake(subject) * personality.mistake * personalityProfile.mistake * getObserverSubjectMilestoneMultiplier(subject, "mistake") * stage.difficulty * getObserverAiLevelMistake(subject) * getObserverMistakeMultiplier() * getObserverPhaseMistakeMultiplier(stage) * getObserverLoopMemoryMistakeMultiplier(subject) * adaptationMistakeRelief
        if (Math.random() < mistakeChance) {
            applyObserverSubjectMistake(subject)
        }

        advanceObserverSubject(subject)
        updateObserverSubjectMilestones(subject)
        updateObserverSubjectInsights(subject)
    }
}

function updateObserverCleanMilestone(subject) {
    const thresholds = [60, 300, 1800, 7200]
    while (subject.clean_log_tier < thresholds.length && subject.clean_time >= thresholds[subject.clean_log_tier]) {
        const threshold = thresholds[subject.clean_log_tier]
        subject.clean_log_tier += 1
        subject.last_action = "Kept a clean route for " + formatTime(threshold, true) + "."
        pushObserverSubjectLog(subject, subject.last_action)
    }
}

function getObserverCleanLogTierFromTime(cleanTime) {
    const thresholds = [60, 300, 1800, 7200]
    let tier = 0

    while (tier < thresholds.length && cleanTime >= thresholds[tier])
        tier += 1

    return tier
}

function getObserverCleanStreakRetention(subject) {
    const preservation = getObserverUpgradeLevel("streak_preservation") * 0.08
    const discipline = Math.max(0, getObserverSubjectAdaptation(subject) - 1) * 0.06
    const mastery = getObserverCharacterMastery(subject)
    let personalityRetention = 0

    if (subject.personality == "timid")
        personalityRetention = mastery * 0.055
    else if (subject.personality == "methodical")
        personalityRetention = mastery * 0.075
    else if (subject.personality == "studious")
        personalityRetention = mastery * 0.045
    else if (subject.personality == "visionary" && getObserverSubjectStage(subject).universe >= 2)
        personalityRetention = mastery * 0.06

    return Math.min(0.78, preservation + discipline + personalityRetention)
}

function applyObserverSubjectMistake(subject) {
    const retainedCleanTime = subject.clean_time * getObserverCleanStreakRetention(subject)
    subject.mistakes += 1
    subject.clean_time = retainedCleanTime
    subject.clean_log_tier = getObserverCleanLogTierFromTime(subject.clean_time)

    const stage = getObserverSubjectStage(subject)
    const previousThreshold = getObserverPreviousThreshold(subject.stage_index)
    const stageSpan = stage.threshold - previousThreshold
    const recovery = Math.max(0.35, 1 - getObserverUpgradeLevel("mistake_recovery") * 0.1)
    const adaptation = getObserverSubjectAdaptation(subject)
    const correctionChance = Math.min(0.52, Math.max(0, adaptation - 1) * 0.18 + getObserverUpgradeLevel("streak_preservation") * 0.012)

    if (Math.random() < correctionChance) {
        subject.progress = Math.max(previousThreshold, subject.progress - stageSpan * 0.025 * recovery)
        subject.last_action = getObserverNearMissMessage(subject)
        subject.bot_job_xp = Math.max(0, subject.bot_job_xp * 0.93)
        subject.bot_skill_xp = Math.max(0, subject.bot_skill_xp * 0.93)
        pushObserverSubjectLog(subject, subject.last_action)
        return
    }

    const rollback = stageSpan * (0.08 + observerRankData[subject.rank].mistake * 0.025) * recovery / Math.max(0.72, Math.sqrt(adaptation))

    subject.progress = Math.max(previousThreshold, subject.progress - rollback)

    const patronageLossProtection = Math.max(0.32, 1 - getObserverUpgradeLevel("hidden_patronage") * 0.085)
    if (observerRankData[subject.rank].mistake > 2 && Math.random() < 0.16 * recovery * patronageLossProtection && subject.stage_index > 0) {
        subject.stage_index -= 1
        subject.progress = Math.min(subject.progress, getObserverSubjectStage(subject).threshold - 1)
        subject.route_resets += 1
        subject.last_action = getObserverMistakeMessage(subject, true)
        subject.bot_coins = Math.max(0, subject.bot_coins * (0.72 + Math.min(0.14, getObserverUpgradeLevel("hidden_patronage") * 0.018)))
        if (subject.bot_items.length > 0 && Math.random() < 0.35 * patronageLossProtection)
            subject.bot_items.pop()
        pushObserverSubjectLog(subject, subject.last_action)
        return
    }

    subject.last_action = getObserverMistakeMessage(subject, false)
    subject.bot_coins = Math.max(0, subject.bot_coins * (0.88 + Math.min(0.08, getObserverUpgradeLevel("hidden_patronage") * 0.012)))
    if (observerRankData[subject.rank].debtLoss > 0.18 && subject.bot_items.length > 0 && Math.random() < observerRankData[subject.rank].debtLoss * 0.12 * patronageLossProtection)
        subject.bot_items.pop()
    subject.bot_job_xp = Math.max(0, subject.bot_job_xp * 0.72)
    subject.bot_skill_xp = Math.max(0, subject.bot_skill_xp * 0.72)
    pushObserverSubjectLog(subject, subject.last_action)
}

function getObserverNearMissMessage(subject) {
    if (subject.personality == "timid")
        return "Almost froze, but corrected the route before losing the phase."
    if (subject.personality == "impulsive")
        return "Caught a bad shortcut at the last moment."
    if (subject.personality == "studious")
        return "Found the mistake in the notes before it became fatal."
    if (subject.personality == "greedy")
        return "Cancelled a risky purchase before it ruined the run."
    if (subject.personality == "methodical")
        return "Corrected a small routing error before it spread."
    if (subject.personality == "visionary")
        return "Saw the distortion early enough to avoid a full mistake."

    return "Corrected the route before the mistake became fatal."
}

function getObserverMistakeMessage(subject, slippedPhase) {
    if (slippedPhase)
        return subject.personality == "impulsive"
            ? "Overrushed the route and slipped back one phase."
            : "Lost the route and slipped back one phase."

    if (subject.personality == "timid")
        return "Hesitated too long and lost the clean streak."
    if (subject.personality == "impulsive")
        return "Forced a bad shortcut and lost the clean streak."
    if (subject.personality == "studious")
        return "Misread the route notes and lost the clean streak."
    if (subject.personality == "greedy")
        return "Chased a risky purchase and lost the clean streak."
    if (subject.personality == "methodical")
        return "A small routing error broke the clean streak."
    if (subject.personality == "visionary")
        return "Predicted the wrong distortion and lost the clean streak."

    return "Made a bad route choice and lost the clean streak."
}

function advanceObserverSubject(subject) {
    let advanced = false
    const advancedStages = []
    while (subject.progress >= getObserverSubjectStage(subject).threshold) {
        if (subject.stage_index >= observerSubjectStages.length - 1) {
            subject.completed_universe_x += 1
            subject.loop_memory = Math.max(0, subject.loop_memory || 0) + 1 + getObserverSubjectMilestoneCount(subject) * 0.06 + getObserverSubjectInsightCount(subject) * 0.12
            const restartLevel = Math.max(1, Math.floor(subject.ai_level * 0.6 + getObserverLoopMemoryPower(subject) * 5))
            subject.stage_index = 0
            subject.progress = 0
            subject.clean_time = 0
            subject.clean_log_tier = 0
            subject.route_resets = 0
            subject.bot_age_days = 365 * 14
            subject.bot_coins = 0
            subject.bot_rebirths += 1
            subject.bot_job_level = restartLevel
            subject.bot_skill_level = restartLevel
            subject.bot_job_xp = 0
            subject.bot_skill_xp = 0
            subject.bot_property_index = 0
            subject.bot_items = []
            subject.bot_focus_job = getObserverSubjectStage(subject).job
            subject.bot_focus_skill = getObserverSubjectStage(subject).skill
            subject.bot_next_decision = 0
            subject.bot_next_purchase = 0
            subject.last_action = "Completed Universe X and restarted with deeper loop memory."
            pushObserverSubjectLog(subject, subject.last_action)
            return
        }

        subject.stage_index += 1
        advanced = true
        advancedStages.push(getObserverSubjectStage(subject))
    }

    if (advanced) {
        const stage = getObserverSubjectStage(subject)
        subject.bot_focus_job = stage.job
        subject.bot_focus_skill = stage.skill
        subject.bot_job_xp = 0
        subject.bot_skill_xp = 0
        subject.bot_next_decision = 0
        subject.bot_next_purchase = Math.min(subject.bot_next_purchase, 1.5)
        subject.last_action = getObserverStageAdvanceMessage(subject, stage)
        subject.bot_rebirths += stage.id == "rebirth" || stage.id == "evil" || stage.id == "void" ? 1 : 0
        for (const advancedStage of advancedStages) {
            applyObserverStageResource(subject, advancedStage)
        }
        pushObserverSubjectLog(subject, subject.last_action)
    }
}

function applyObserverStageResource(subject, stage) {
    const data = observerStageResourceData[stage.id]
    if (data == null)
        return

    if (data.rebirths != null)
        subject.bot_rebirths = Math.max(subject.bot_rebirths, data.rebirths)
    if (data.evil != null)
        subject.bot_evil = Math.max(subject.bot_evil, data.evil)
    if (data.mp != null)
        subject.bot_mp = Math.max(subject.bot_mp, data.mp)

    if (data.log != null)
        pushObserverSubjectLog(subject, data.log)
}

function getObserverStageAdvanceMessage(subject, stage) {
    if (subject.personality == "timid")
        return "Carefully reached " + stage.name + " and checked the route twice."
    if (subject.personality == "impulsive")
        return "Broke into " + stage.name + " and immediately rushed " + stage.job + "."
    if (subject.personality == "studious")
        return "Studied the unlock path into " + stage.name + "."
    if (subject.personality == "greedy")
        return "Reached " + stage.name + " and looked for better income."
    if (subject.personality == "methodical")
        return "Reached " + stage.name + " with a stable route."
    if (subject.personality == "visionary")
        return "Saw the shape of " + stage.name + " before crossing into it."

    return "Reached " + stage.name + " and rerouted to " + stage.job + "."
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
    document.getElementById("observerGlobalBoostDisplay").textContent = "x" + format(
        (1 + getObserverUpgradeLevel("clear_instructions") * 0.1)
        * (1 + getObserverUpgradeLevel("shared_memory") * 0.12)
        * (1 + getObserverUpgradeLevel("route_drills") * 0.14)
        * (1 + getObserverUpgradeLevel("early_guidance") * 0.06)
        * (1 + getObserverUpgradeLevel("void_protocols") * 0.08)
        * (1 + getObserverUpgradeLevel("reality_scripts") * 0.06)
        * (1 + getObserverUpgradeLevel("threshold_maps") * 0.07)
        * (1 + getObserverUpgradeLevel("gentle_push") * 0.04)
        * (1 + getObserverUpgradeLevel("better_instincts") * 0.035)
        * (1 + getObserverUpgradeLevel("deep_simulation") * 0.06)
        * (1 + getObserverUpgradeLevel("threshold_tutoring") * 0.05)
        * (1 + getObserverUpgradeLevel("hidden_patronage") * 0.03)
        * (1 + getObserverUpgradeLevel("streak_preservation") * 0.025)
        * (1 + getObserverUpgradeLevel("threshold_intuition") * 0.055),
    2)

    const subjectCost = getObserverSubjectCost()
    const subjectButton = document.getElementById("buyObserverSubjectButton")
    subjectButton.textContent = subjectCost == 0 ? "Add first subject" : "Add subject - " + format(subjectCost, 2) + " OP"
    subjectButton.disabled = state.points < subjectCost

    renderObserverSubjects()
    renderObserverUpgrades()
    renderObservedObserverSubject()
}

function renderObserverCommands() {
    const element = document.getElementById("observerCommandRows")
    if (element != null)
        element.remove()
}

function renderObserverSubjects() {
    const grid = document.getElementById("observerSubjectGrid")
    if (grid == null)
        return

    const state = getObserverState()
    const signature = state.subjects.map(subject => {
        const rankCost = getObserverRankUpgradeCost(subject)
        const characterCost = getObserverSubjectCharacterCost(subject)
        return [
            subject.id,
            subject.rank,
            subject.personality,
            subject.stage_index,
            subject.bot_focus_job,
            subject.bot_focus_skill,
            Math.floor(subject.ai_level),
            Math.floor(subject.character_level),
            Math.floor(subject.completed_universe_x),
            Math.floor(getObserverStageProgress(subject) / 10),
            isFinite(rankCost) && state.points >= rankCost ? 1 : 0,
            state.points >= characterCost ? 1 : 0,
        ].join(":")
    }).join("|")

    if (state.subjects.length == 0) {
        if (grid.dataset.renderSignature != "empty") {
            grid.innerHTML = `<div style="color:gray;">No subjects yet. Add the first one for free.</div>`
            grid.dataset.renderSignature = "empty"
        }
        return
    }

    if (grid.dataset.renderSignature == signature)
        return

    let html = ""
    for (const subject of state.subjects) {
        const rank = observerRankData[subject.rank]
        const personality = getObserverSubjectPersonality(subject)
        const stage = getObserverSubjectStage(subject)
        const progress = getObserverStageProgress(subject)
        const aiProgress = Math.min(100, subject.ai_xp / getObserverAiXpToNext(subject) * 100)
        const routeQuality = getObserverSubjectRouteQuality(subject)
        const rankCost = getObserverRankUpgradeCost(subject)
        const characterCost = getObserverSubjectCharacterCost(subject)
        const milestones = getObserverSubjectMilestoneCount(subject)
        const insights = getObserverSubjectInsightCount(subject)
        html +=
            `<div class="rb-observer-subject ${rank.colorClass}">` +
                `<div class="rb-observer-subject-head">` +
                    `<div><b>${subject.name}</b><br><span class="rb-rank ${rank.colorClass}">${rank.name}</span></div>` +
                    `<div class="rb-observer-universe">U-${stage.universe}</div>` +
                `</div>` +
                `<div style="color:gray; margin-top:0.35em;">${personality.name}: ${personality.description}</div>` +
                `<div style="color:gray; margin-top:0.45em;">${stage.name}</div>` +
                `<div class="rb-observer-mini-row"><span>Job</span><b>${subject.bot_focus_job} lvl ${formatWhole(getObserverBotJobLevel(subject))}</b></div>` +
                `<div class="rb-observer-mini-row"><span>Skill</span><b>${subject.bot_focus_skill} lvl ${formatWhole(getObserverBotSkillLevel(subject))}</b></div>` +
                `<div class="rb-observer-mini-row"><span>Goal</span><b>${getObserverSubjectGoal(subject)}</b></div>` +
                `<div class="rb-observer-meter"><div style="width:${progress}%"></div></div>` +
                `<div class="rb-observer-mini-row"><span>Route quality</span><b>x${format(routeQuality, 2)}</b></div>` +
                `<div class="rb-observer-mini-row"><span>AI lvl</span><b>${formatWhole(subject.ai_level)} (${format(aiProgress, 1)}%)</b></div>` +
                `<div class="rb-observer-mini-row"><span>Character</span><b>Lvl ${formatWhole(subject.character_level)} · ${formatWhole(milestones)} milestones · ${formatWhole(insights)} insights</b></div>` +
                `<div class="rb-observer-mini-row"><span>Clean streak</span><b>${formatTime(subject.clean_time, true)}</b></div>` +
                `<div class="rb-observer-mini-row"><span>OP/sec</span><b>${format(getObserverSubjectOpGain(subject), 3)}</b></div>` +
                `<div class="rb-observer-mini-row"><span>Mistakes</span><b>${formatWhole(subject.mistakes)}</b></div>` +
                `<div class="rb-observer-mini-row"><span>U-X clears</span><b>${formatWhole(subject.completed_universe_x)} · memory x${format(getObserverLoopMemorySpeedBonus(subject), 2)}</b></div>` +
                `<div class="rb-observer-note">${subject.last_action}</div>` +
                `<div class="rb-observer-actions">` +
                    `<button class="w3-button button" onclick="observeObserverSubject(${subject.id})">Observe</button>` +
                    `<button class="w3-button button" onclick="improveObserverSubjectRank(${subject.id})" ${isFinite(rankCost) && state.points >= rankCost ? "" : "disabled"}>${isFinite(rankCost) ? "Refine rank - " + format(rankCost, 2) + " OP" : "Max rank"}</button>` +
                    `<button class="w3-button button" onclick="improveObserverSubjectCharacter(${subject.id})" ${state.points >= characterCost ? "" : "disabled"}>Refine character - ${format(characterCost, 2)} OP</button>` +
                `</div>` +
            `</div>`
    }

    grid.innerHTML = html
    grid.dataset.renderSignature = signature
}

function renderObservedObserverSubject() {
    const roster = document.getElementById("observerRosterView")
    const watch = document.getElementById("observerWatchView")
    if (roster == null || watch == null)
        return

    const subject = getObservedObserverSubject()
    roster.classList.toggle("hidden", subject != null)
    watch.classList.toggle("hidden", subject == null)

    if (subject == null)
        return

    const rank = observerRankData[subject.rank]
    const personality = getObserverSubjectPersonality(subject)
    const stage = getObserverSubjectStage(subject)
    const previousStage = observerSubjectStages[Math.max(0, subject.stage_index - 1)]
    const nextStage = observerSubjectStages[Math.min(observerSubjectStages.length - 1, subject.stage_index + 1)]
    const skillLevel = getObserverBotSkillLevel(subject)
    const jobLevel = getObserverBotJobLevel(subject)
    const progress = getObserverStageProgress(subject)
    const routeQuality = getObserverSubjectRouteQuality(subject)
    const property = getObserverBotProperty(subject)
    const items = subject.bot_items == null || subject.bot_items.length == 0 ? "None" : subject.bot_items.slice(-4).join(", ")
    const aiProgress = Math.min(100, subject.ai_xp / getObserverAiXpToNext(subject) * 100)

    document.getElementById("observerWatchName").textContent = subject.name
    document.getElementById("observerWatchRank").textContent = rank.name
    document.getElementById("observerWatchPersonality").textContent = personality.name
    document.getElementById("observerWatchCharacter").textContent = "Lvl " + formatWhole(subject.character_level)
    document.getElementById("observerWatchMilestones").textContent = formatWhole(getObserverSubjectMilestoneCount(subject)) + " / " + formatWhole(getObserverSubjectInsightCount(subject)) + " insights"
    document.getElementById("observerWatchAge").textContent = format(Math.floor(subject.bot_age_days / 365), 0) + " Day " + formatWhole(Math.floor(subject.bot_age_days % 365))
    document.getElementById("observerWatchUniverse").textContent = "U-" + stage.universe
    document.getElementById("observerWatchPhase").textContent = stage.name
    document.getElementById("observerWatchCoins").textContent = format(subject.bot_coins, 2)
    document.getElementById("observerWatchMeta").textContent = format(subject.bot_evil, 2) + " / " + format(subject.bot_mp, 2)
    document.getElementById("observerWatchOp").textContent = format(getObserverSubjectOpGain(subject), 3)
    document.getElementById("observerWatchClean").textContent = formatTime(subject.clean_time, true)
    document.getElementById("observerWatchMistakes").textContent = formatWhole(subject.mistakes)
    document.getElementById("observerWatchRouteQuality").textContent = "x" + format(routeQuality, 2)
    document.getElementById("observerWatchAiLevel").textContent = formatWhole(subject.ai_level) + " (" + format(aiProgress, 1) + "%)"
    document.getElementById("observerWatchAiMeter").style.width = aiProgress + "%"
    document.getElementById("observerWatchProgressMeter").style.width = progress + "%"

    document.getElementById("observerWatchJobsTable").innerHTML =
        `<tr><th>Job</th><th>Level</th><th>State</th><th>Progress</th></tr>` +
        `<tr class="rb-observer-bot-row-muted"><td>${previousStage.job}</td><td>${Math.max(1, jobLevel - 16)}</td><td>Completed</td><td>Max</td></tr>` +
        `<tr class="rb-observer-bot-row-active"><td>${subject.bot_focus_job}</td><td>${jobLevel}</td><td>${subject.bot_focus_job == stage.job ? "Current job" : "Wrong focus"}</td><td>${format(progress, 1)}%</td></tr>` +
        `<tr><td>${nextStage.job}</td><td>${Math.max(1, jobLevel - 7)}</td><td>Next route</td><td>Locked</td></tr>`

    document.getElementById("observerWatchSkillsTable").innerHTML =
        `<tr><th>Skill</th><th>Level</th><th>State</th><th>Progress</th></tr>` +
        `<tr class="rb-observer-bot-row-muted"><td>${previousStage.skill}</td><td>${Math.max(1, skillLevel - 14)}</td><td>Completed</td><td>Max</td></tr>` +
        `<tr class="rb-observer-bot-row-active"><td>${subject.bot_focus_skill}</td><td>${skillLevel}</td><td>${subject.bot_focus_skill == stage.skill ? "Current skill" : "Wrong focus"}</td><td>${format(progress, 1)}%</td></tr>` +
        `<tr><td>${nextStage.skill}</td><td>${Math.max(1, skillLevel - 6)}</td><td>Next unlock</td><td>Waiting</td></tr>`

    document.getElementById("observerWatchShopRows").innerHTML =
        getObserverWatchShopRow(property.name, "Route x" + format(1 + property.quality, 2), "Owned") +
        getObserverWatchShopRow(items, "Items x" + format(1 + getObserverBotItemQuality(subject), 2), subject.bot_items.length > 0 ? "Owned" : "Waiting") +
        getObserverWatchShopRow(getObserverWatchNextProperty(subject), "Next housing", "Saving") +
        getObserverWatchShopRow(getObserverWatchNextItem(subject), "Next item", "Saving")

    document.getElementById("observerWatchEvilTable").innerHTML =
        `<tr><td>Evil route</td><td>${subject.stage_index >= 2 ? "Open" : "Locked"}</td></tr>` +
        `<tr><td>Void approach</td><td>${subject.stage_index >= 3 ? "In progress" : "Locked"}</td></tr>` +
        `<tr><td>Bot Evil</td><td>${format(subject.bot_evil, 2)}</td></tr>` +
        `<tr><td>Next target</td><td>${stage.universe == 1 ? nextStage.name : "Universe " + stage.universe}</td></tr>`

    document.getElementById("observerWatchMultiverseTable").innerHTML =
        `<tr><td>Current universe</td><td>U-${stage.universe}</td></tr>` +
        `<tr><td>Multiverse signal</td><td>${subject.stage_index >= 4 ? "Known" : "Locked"}</td></tr>` +
        `<tr><td>Bot MP</td><td>${format(subject.bot_mp, 2)}</td></tr>` +
        `<tr><td>Universe X clears</td><td>${formatWhole(subject.completed_universe_x)}</td></tr>` +
        `<tr><td>Loop memory</td><td>x${format(getObserverLoopMemorySpeedBonus(subject), 2)} speed / x${format(getObserverLoopMemoryOpBonus(subject), 2)} OP</td></tr>`

    document.getElementById("observerWatchDecisionState").innerHTML =
        `<b>Last decision:</b> ${subject.last_action}<br>` +
        `<span style="color:gray;">Goal:</span> ${getObserverSubjectGoal(subject)}<br>` +
        `<span style="color:gray;">Rank behavior:</span> ${getObserverSubjectRankStyle(subject)}<br>` +
        `<span style="color:gray;">Character:</span> ${personality.name} - ${getObserverSubjectPersonalityStyle(subject)}<br>` +
        `<span style="color:gray;">Route quality:</span> x${format(routeQuality, 2)}; ` +
        `<span style="color:gray;">property:</span> ${property.name}<br>` +
        `<span style="color:gray;">Clean streak:</span> ${formatTime(subject.clean_time, true)}; ` +
        `<span style="color:gray;">mistakes:</span> ${formatWhole(subject.mistakes)}; ` +
        `<span style="color:gray;">rebirths:</span> ${formatWhole(subject.bot_rebirths)}`

    let logHtml = ""
    const log = subject.bot_log == null ? [] : subject.bot_log
    for (const entry of log) {
        logHtml += `<div>${entry}</div>`
    }
    if (logHtml == "")
        logHtml = `<div>Started a fresh Progress Knight run.</div>`

    document.getElementById("observerWatchLog").innerHTML = logHtml
}

function getObserverWatchShopRow(name, effect, state) {
    const stateClass = state == "Owned" ? "rb-observer-watch-shop-state-owned" : "rb-observer-watch-shop-state-waiting"
    return `<div class="rb-observer-watch-shop-row">` +
        `<div><b>${name}</b><br><span style="color:gray;">${effect}</span></div>` +
        `<div class="${stateClass}">${state}</div>` +
    `</div>`
}

function getObserverWatchNextProperty(subject) {
    const nextProperty = observerBotProperties[Math.min(observerBotProperties.length - 1, (subject.bot_property_index || 0) + 1)]
    if (nextProperty == null || nextProperty.name == getObserverBotProperty(subject).name)
        return "Max housing"

    return nextProperty.name
}

function getObserverWatchNextItem(subject) {
    if (subject.bot_items == null)
        subject.bot_items = []

    for (const item of observerBotItems) {
        if (item.stage <= subject.stage_index && !subject.bot_items.includes(item.name))
            return item.name
    }

    return "No visible item"
}

function renderObserverUpgrades() {
    const rows = document.getElementById("observerUpgradeRows")
    if (rows == null)
        return

    const signature = Object.keys(observerUpgradeData).map(key => {
        const cost = getObserverUpgradeCost(key)
        return key + ":" + getObserverUpgradeLevel(key) + ":" + (getObserverState().points >= cost ? 1 : 0)
    }).join("|")
    if (rows.dataset.renderSignature == signature)
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
    rows.dataset.renderSignature = signature
}
