const { chromium } = require("playwright")

const DEFAULT_URL = "http://127.0.0.1:8124/"

function findChromePath() {
    const candidates = [
        process.env.CHROME_PATH,
        "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
        "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
        "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
        "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    ].filter(Boolean)

    return candidates.find(path => {
        try {
            return require("fs").existsSync(path)
        } catch (_) {
            return false
        }
    })
}

async function runScenario(browser, name, setup) {
    const page = await browser.newPage({ viewport: { width: 1600, height: 900 } })
    const errors = []

    page.on("console", message => {
        if (["error", "warning"].includes(message.type()))
            errors.push(`${message.type()}: ${message.text()}`)
    })
    page.on("pageerror", error => errors.push(`pageerror: ${error.stack || error.message}`))

    await page.goto(process.env.TEST_URL || DEFAULT_URL, { waitUntil: "domcontentloaded" })
    await page.waitForTimeout(900)
    await page.evaluate(setup)
    await page.waitForTimeout(400)

    const tabs = await page.$$eval(".tabButton", elements => elements.map(element => ({
        id: element.id,
        text: element.textContent.trim(),
        hidden: element.classList.contains("hidden"),
        display: getComputedStyle(element).display,
    })))

    const reports = []
    for (const tab of tabs.filter(tab => !tab.hidden && tab.display !== "none")) {
        await page.click(`#${tab.id}`).catch(() => {})
        await page.waitForTimeout(180)

        const visibleTabs = await page.$$eval(".tab", elements => elements
            .filter(element => getComputedStyle(element).display !== "none")
            .map(element => ({
                id: element.id,
                textLength: element.innerText.trim().length,
                width: Math.round(element.getBoundingClientRect().width),
                height: Math.round(element.getBoundingClientRect().height),
            })))

        const hasErrorBanner = await page.$eval(
            "#errorInfo",
            element => !element.hidden && getComputedStyle(element).display !== "none"
        ).catch(() => false)

        reports.push({ tab: tab.text, id: tab.id, visibleTabs, hasErrorBanner })
    }

    const globals = await page.evaluate(() => ({
        hasGameError: Boolean(window.tempData && window.tempData.hasError),
        selectedTab: window.gameData && window.gameData.settings && window.gameData.settings.selectedTab,
        observerSubjects: window.gameData && window.gameData.observer && window.gameData.observer.subjects
            ? window.gameData.observer.subjects.map(subject => ({
                rank: subject.rank,
                personality: subject.personality,
                characterLevel: subject.character_level || 0,
                milestones: subject.milestones || {},
                opGain: typeof getObserverSubjectOpGain == "function" ? getObserverSubjectOpGain(subject) : 0,
                logLength: subject.bot_log && Array.isArray(subject.bot_log) ? subject.bot_log.length : 0,
            }))
            : [],
    }))

    const failures = []
    for (const report of reports) {
        if (report.hasErrorBanner)
            failures.push(`${name}/${report.tab}: error banner is visible`)
        if (report.visibleTabs.length !== 1)
            failures.push(`${name}/${report.tab}: expected exactly one visible tab, got ${report.visibleTabs.length}`)
        for (const visibleTab of report.visibleTabs) {
            if (visibleTab.textLength <= 0)
                failures.push(`${name}/${report.tab}: visible tab ${visibleTab.id} is empty`)
            if (visibleTab.width <= 0 || visibleTab.height <= 0)
                failures.push(`${name}/${report.tab}: visible tab ${visibleTab.id} has invalid size`)
        }
    }

    if (globals.hasGameError)
        failures.push(`${name}: tempData.hasError is true`)

    const integrityFailures = await page.evaluate(() => {
        const failures = []
        for (const key in gameData.requirements) {
            const requirement = gameData.requirements[key]
            if (requirement == null || requirement.querySelectors == null || requirement.querySelectors.length == 0)
                continue

            const found = requirement.querySelectors.some(selector => document.querySelector(selector) != null)
            if (!found)
                failures.push(`Requirement ${key} has no DOM target`)
        }

        function rowId(entityName) {
            return "row" + removeSpaces(removeStrangeCharacters(entityName))
        }

        for (const category in jobCategories) {
            for (const job of jobCategories[category]) {
                if (gameData.taskData[job] == null)
                    failures.push(`Job ${job} is missing from taskData`)
                if (document.getElementById(rowId(job)) == null)
                    failures.push(`Job ${job} has no row`)
            }
        }

        for (const category in skillCategories) {
            for (const skill of skillCategories[category]) {
                if (gameData.taskData[skill] == null)
                    failures.push(`Skill ${skill} is missing from taskData`)
                if (document.getElementById(rowId(skill)) == null)
                    failures.push(`Skill ${skill} has no row`)
            }
        }

        for (const category in itemCategories) {
            for (const item of itemCategories[category]) {
                if (gameData.itemData[item] == null)
                    failures.push(`Item ${item} is missing from itemData`)
                if (document.getElementById(rowId(item)) == null)
                    failures.push(`Item ${item} has no row`)
            }
        }

        return failures
    })

    failures.push(...integrityFailures.map(failure => `${name}: ${failure}`))

    if (name == "early") {
        const earlyMultiverseFailures = await page.evaluate(() => {
            const failures = []
            if (typeof isMultiverseUnlocked == "function" && isMultiverseUnlocked())
                failures.push("Multiverse is unlocked too early")
            if (typeof getMultiversePointGain == "function" && getMultiversePointGain() != 0)
                failures.push("Early game generates passive Multiverse Points")
            return failures
        })

        failures.push(...earlyMultiverseFailures.map(failure => `${name}: ${failure}`))

        const earlyUnlockFailures = await page.evaluate(() => {
            const failures = []
            const visibleTaskNames = Array.from(document.querySelectorAll("#jobTable tr, #skillTable tr"))
                .filter(element => getComputedStyle(element).display != "none" && !element.classList.contains("hidden") && !element.classList.contains("hiddenTask"))
                .map(element => {
                    const nameElement = element.querySelector(".name")
                    return nameElement == null ? "" : nameElement.textContent.trim()
                })
                .filter(Boolean)

            const allowedAtStart = ["Beggar", "Concentration", "Strength"]
            const unexpected = visibleTaskNames.filter(name => !allowedAtStart.includes(name))
            for (const taskName of unexpected)
                failures.push(`Task ${taskName} is visible too early`)

            if (!visibleTaskNames.includes("Beggar"))
                failures.push("Beggar is not visible at start")
            if (!visibleTaskNames.includes("Concentration"))
                failures.push("Concentration is not visible at start")
            if (!visibleTaskNames.includes("Strength"))
                failures.push("Strength is not visible at start")

            return failures
        })

        failures.push(...earlyUnlockFailures.map(failure => `${name}: ${failure}`))

        const stabilityFailures = await page.evaluate(() => {
            const failures = []
            const before = gameData.days
            tempData.hasError = true
            if (typeof canSimulate == "function" && !canSimulate())
                failures.push("Transient UI error flag stops simulation")
            update(false)
            tempData.hasError = false
            if (!(gameData.days > before))
                failures.push("Game does not advance after transient UI error flag")
            return failures
        })

        failures.push(...stabilityFailures.map(failure => `${name}: ${failure}`))
    }
    if (name == "observer" && (!globals.observerSubjects[0] || globals.observerSubjects[0].rank != "trash"))
        failures.push(`${name}: first observer subject must be free Trash rank`)
    if (name == "observer" && (!globals.observerSubjects[0] || !(globals.observerSubjects[0].opGain > 0)))
        failures.push(`${name}: first observer subject must generate Observer Points`)
    if (name == "observer" && (!globals.observerSubjects[0] || globals.observerSubjects[0].logLength <= 0))
        failures.push(`${name}: first observer subject must keep a decision log`)
    if (name == "observer") {
        const watchFailures = await page.evaluate(() => {
            const failures = []
            const subject = gameData.observer && gameData.observer.subjects ? gameData.observer.subjects[0] : null
            if (subject == null || typeof observeObserverSubject != "function")
                return ["Observer watch cannot select the first subject"]

            observeObserverSubject(subject.id)
            updateUI()

            const watch = document.getElementById("observerWatchView")
            if (watch == null || watch.classList.contains("hidden"))
                failures.push("Observer watch view did not open")

            const requiredIds = [
                "observerWatchName",
                "observerWatchPersonality",
                "observerWatchPhase",
                "observerWatchJobsTable",
                "observerWatchSkillsTable",
                "observerWatchShopRows",
                "observerWatchEvilTable",
                "observerWatchMultiverseTable",
                "observerWatchDecisionState",
                "observerWatchLog",
            ]

            for (const id of requiredIds) {
                const element = document.getElementById(id)
                if (element == null || element.textContent.trim().length == 0)
                    failures.push(`Observer watch field ${id} is empty`)
            }

            return failures
        })

        failures.push(...watchFailures.map(failure => `${name}: ${failure}`))

        const progressionFailures = await page.evaluate(() => {
            const failures = []
            const subject = gameData.observer && gameData.observer.subjects ? gameData.observer.subjects[0] : null
            if (subject == null)
                return ["Observer progression subject is missing"]

            const characterBefore = subject.character_level || 0
            gameData.observer.points = 1000000
            if (typeof improveObserverSubjectCharacter != "function" || !improveObserverSubjectCharacter(subject.id))
                failures.push("Character refinement could not be purchased")
            if (!((subject.character_level || 0) > characterBefore))
                failures.push("Character refinement did not increase character_level")

            subject.stage_index = 4
            subject.progress = 1000
            subject.bot_evil = 10
            if (typeof updateObserverSubjectMilestones == "function")
                updateObserverSubjectMilestones(subject)

            const unlocked = subject.milestones && subject.milestones.first_rebirth && subject.milestones.first_evil && subject.milestones.first_void && subject.milestones.multiverse_signal
            if (!unlocked)
                failures.push("Observer subject milestones did not unlock through Multiverse signal")

            const trash = {
                id: 9001,
                rank: "trash",
                personality: "impulsive",
                stage_index: 13,
                progress: 10000,
                ai_level: 8,
                character_level: 0,
                bot_job_level: 40,
                bot_skill_level: 40,
                bot_items: [],
                milestones: {},
                insights: {},
                bot_log: [],
            }
            const legendary = {
                id: 9002,
                rank: "legendary",
                personality: "visionary",
                stage_index: 13,
                progress: 10000,
                ai_level: 8,
                character_level: 0,
                bot_job_level: 40,
                bot_skill_level: 40,
                bot_items: [],
                milestones: {},
                insights: {},
                bot_log: [],
            }
            normalizeObserverSubject(trash)
            normalizeObserverSubject(legendary)
            if (!(getObserverEffectiveSpeedMultiplier(legendary) > getObserverEffectiveSpeedMultiplier(trash)))
                failures.push("Legendary subject is not faster than Trash in U-X")
            if (!(getObserverSubjectOpGain(legendary) > getObserverSubjectOpGain(trash)))
                failures.push("Legendary subject does not generate more OP than Trash in U-X")

            for (const key in gameData.observer.upgrades)
                gameData.observer.upgrades[key] = 0

            const thresholdStage = observerSubjectStages[13]
            const thresholdBaseSpeed = getObserverEffectiveSpeedMultiplier(legendary)
            const thresholdBaseOp = getObserverSubjectOpGain(legendary)
            const thresholdBaseMistake = getObserverPhaseMistakeMultiplier(thresholdStage)
            gameData.observer.upgrades.threshold_intuition = 5
            if (!(getObserverEffectiveSpeedMultiplier(legendary) > thresholdBaseSpeed))
                failures.push("Threshold Intuition does not improve late Observer subject speed")
            if (!(getObserverSubjectOpGain(legendary) > thresholdBaseOp))
                failures.push("Threshold Intuition does not improve late Observer OP gain")
            if (!(getObserverPhaseMistakeMultiplier(thresholdStage) < thresholdBaseMistake))
                failures.push("Threshold Intuition does not reduce late mistake pressure")

            gameData.observer.upgrades.threshold_intuition = 0
            const reserveSubject = {
                id: 9003,
                rank: "common",
                personality: "greedy",
                stage_index: 8,
                progress: 3000,
                ai_level: 10,
                character_level: 0,
                bot_job_level: 45,
                bot_skill_level: 45,
                bot_items: [],
                milestones: {},
                insights: {},
                bot_log: [],
            }
            normalizeObserverSubject(reserveSubject)
            const reserveBase = getObserverBotPurchaseReserve(reserveSubject)
            gameData.observer.upgrades.hidden_patronage = 5
            const reserveImproved = getObserverBotPurchaseReserve(reserveSubject)
            if (!(reserveImproved < reserveBase))
                failures.push("Hidden Patronage does not lower subject purchase reserve")

            gameData.observer.upgrades.hidden_patronage = 0
            const randomBefore = Math.random
            Math.random = () => 0.99
            const streakBase = {
                id: 9004,
                rank: "common",
                personality: "methodical",
                stage_index: 5,
                progress: 1500,
                clean_time: 1000,
                ai_level: 5,
                character_level: 0,
                bot_job_level: 28,
                bot_skill_level: 28,
                bot_items: [],
                milestones: {},
                insights: {},
                bot_log: [],
            }
            const streakImproved = {
                id: 9005,
                rank: "common",
                personality: "methodical",
                stage_index: 5,
                progress: 1500,
                clean_time: 1000,
                ai_level: 5,
                character_level: 0,
                bot_job_level: 28,
                bot_skill_level: 28,
                bot_items: [],
                milestones: {},
                insights: {},
                bot_log: [],
            }
            normalizeObserverSubject(streakBase)
            normalizeObserverSubject(streakImproved)
            gameData.observer.upgrades.streak_preservation = 0
            applyObserverSubjectMistake(streakBase)
            gameData.observer.upgrades.streak_preservation = 5
            applyObserverSubjectMistake(streakImproved)
            Math.random = randomBefore
            if (!(streakImproved.clean_time > streakBase.clean_time))
                failures.push("Streak Preservation does not preserve more clean streak after mistakes")

            for (const key in gameData.observer.upgrades)
                gameData.observer.upgrades[key] = 0

            const baseVisionary = {
                id: 9006,
                rank: "rare",
                personality: "visionary",
                stage_index: 12,
                progress: 9000,
                ai_level: 12,
                character_level: 0,
                bot_job_level: 65,
                bot_skill_level: 65,
                bot_items: [],
                milestones: {},
                insights: {},
                bot_log: [],
            }
            const trainedVisionary = {
                id: 9007,
                rank: "rare",
                personality: "visionary",
                stage_index: 12,
                progress: 9000,
                ai_level: 12,
                character_level: 12,
                bot_job_level: 65,
                bot_skill_level: 65,
                bot_items: [],
                milestones: {},
                insights: {},
                bot_log: [],
            }
            normalizeObserverSubject(baseVisionary)
            normalizeObserverSubject(trainedVisionary)
            if (!(getObserverEffectiveSpeedMultiplier(trainedVisionary) > getObserverEffectiveSpeedMultiplier(baseVisionary)))
                failures.push("Character mastery does not improve Visionary late speed")
            if (!(getObserverSubjectOpGain(trainedVisionary) > getObserverSubjectOpGain(baseVisionary)))
                failures.push("Character mastery does not improve Visionary late OP gain")
            if (!(getObserverSubjectAdaptation(trainedVisionary) > getObserverSubjectAdaptation(baseVisionary)))
                failures.push("Character mastery does not improve Visionary adaptation")

            const baseImpulsive = {
                id: 9008,
                rank: "common",
                personality: "impulsive",
                stage_index: 7,
                progress: 2300,
                ai_level: 8,
                character_level: 0,
                bot_job_level: 38,
                bot_skill_level: 38,
                bot_items: [],
                milestones: {},
                insights: {},
                bot_log: [],
            }
            const trainedImpulsive = {
                id: 9009,
                rank: "common",
                personality: "impulsive",
                stage_index: 7,
                progress: 2300,
                ai_level: 8,
                character_level: 12,
                bot_job_level: 38,
                bot_skill_level: 38,
                bot_items: [],
                milestones: {},
                insights: {},
                bot_log: [],
            }
            normalizeObserverSubject(baseImpulsive)
            normalizeObserverSubject(trainedImpulsive)
            const baseImpulsiveProfile = getObserverPersonalityStageProfile(baseImpulsive)
            const trainedImpulsiveProfile = getObserverPersonalityStageProfile(trainedImpulsive)
            if (!(trainedImpulsiveProfile.speed > baseImpulsiveProfile.speed))
                failures.push("Character mastery does not improve Impulsive speed")
            if (!(trainedImpulsiveProfile.mistake < baseImpulsiveProfile.mistake))
                failures.push("Character mastery does not soften Impulsive mistakes")

            const studiousInsightBase = {
                id: 9010,
                rank: "skilled",
                personality: "studious",
                stage_index: 4,
                progress: 980,
                ai_level: 6,
                character_level: 0,
                bot_job_level: 25,
                bot_skill_level: 80,
                bot_items: [],
                milestones: {},
                insights: {},
                bot_log: [],
            }
            const studiousInsight = {
                id: 9011,
                rank: "skilled",
                personality: "studious",
                stage_index: 4,
                progress: 980,
                ai_level: 6,
                character_level: 0,
                bot_job_level: 25,
                bot_skill_level: 80,
                bot_items: [],
                milestones: {},
                insights: {},
                bot_log: [],
            }
            normalizeObserverSubject(studiousInsightBase)
            normalizeObserverSubject(studiousInsight)
            const studiousBaseXp = getObserverAiXpGain(studiousInsightBase)
            updateObserverSubjectInsights(studiousInsight)
            if (!studiousInsight.insights.studious_notes)
                failures.push("Studious subject did not unlock Living Notebook insight")
            if (!(getObserverAiXpGain(studiousInsight) > studiousBaseXp))
                failures.push("Studious insight does not improve AI XP gain")

            const visionaryInsightBase = {
                id: 9012,
                rank: "rare",
                personality: "visionary",
                stage_index: 12,
                progress: 9000,
                ai_level: 9,
                character_level: 0,
                bot_job_level: 55,
                bot_skill_level: 55,
                bot_items: [],
                milestones: {},
                insights: {},
                bot_log: [],
            }
            const visionaryInsight = {
                id: 9013,
                rank: "rare",
                personality: "visionary",
                stage_index: 12,
                progress: 9000,
                ai_level: 9,
                character_level: 0,
                bot_job_level: 55,
                bot_skill_level: 55,
                bot_items: [],
                milestones: {},
                insights: {},
                bot_log: [],
            }
            normalizeObserverSubject(visionaryInsightBase)
            normalizeObserverSubject(visionaryInsight)
            const visionaryBaseOp = getObserverSubjectOpGain(visionaryInsightBase)
            updateObserverSubjectInsights(visionaryInsight)
            if (!visionaryInsight.insights.visionary_threshold)
                failures.push("Visionary subject did not unlock Threshold Dream insight")
            if (!(getObserverSubjectOpGain(visionaryInsight) > visionaryBaseOp))
                failures.push("Visionary insight does not improve late OP gain")

            const loopBase = {
                id: 9014,
                rank: "rare",
                personality: "methodical",
                stage_index: 10,
                progress: 5600,
                ai_level: 14,
                character_level: 6,
                completed_universe_x: 0,
                loop_memory: 0,
                bot_job_level: 60,
                bot_skill_level: 60,
                bot_items: [],
                milestones: {},
                insights: {},
                bot_log: [],
            }
            const loopExperienced = {
                id: 9015,
                rank: "rare",
                personality: "methodical",
                stage_index: 10,
                progress: 5600,
                ai_level: 14,
                character_level: 6,
                completed_universe_x: 4,
                loop_memory: 5,
                bot_job_level: 60,
                bot_skill_level: 60,
                bot_items: [],
                milestones: {},
                insights: {},
                bot_log: [],
            }
            normalizeObserverSubject(loopBase)
            normalizeObserverSubject(loopExperienced)
            if (!(getObserverEffectiveSpeedMultiplier(loopExperienced) > getObserverEffectiveSpeedMultiplier(loopBase)))
                failures.push("Loop memory does not improve subject speed")
            if (!(getObserverSubjectOpGain(loopExperienced) > getObserverSubjectOpGain(loopBase)))
                failures.push("Loop memory does not improve subject OP gain")
            if (!(getObserverLoopMemoryMistakeMultiplier(loopExperienced) < getObserverLoopMemoryMistakeMultiplier(loopBase)))
                failures.push("Loop memory does not reduce mistake pressure")

            gameData.multiverse_unlocked = true
            gameData.multiverse.current_universe = 10
            gameData.multiverse.highest_universe = 10
            gameData.multiverse.universe_mastery = { "5": 1 }
            if (typeof getMultiverseState == "function")
                getMultiverseState()
            const u5Stage = observerSubjectStages[8]
            const u5BaseSpeed = getObserverPhaseSpeedMultiplier(u5Stage)
            const u5BaseOp = getObserverPhaseOpMultiplier(u5Stage)
            const u5BaseMistake = getObserverPhaseMistakeMultiplier(u5Stage)
            gameData.multiverse.universe_mastery["5"] = 64
            const u5MasteredSpeed = getObserverPhaseSpeedMultiplier(u5Stage)
            const u5MasteredOp = getObserverPhaseOpMultiplier(u5Stage)
            const u5MasteredMistake = getObserverPhaseMistakeMultiplier(u5Stage)
            if (!(u5MasteredSpeed > u5BaseSpeed))
                failures.push("Universe mastery does not help Observer subject speed")
            if (!(u5MasteredOp > u5BaseOp))
                failures.push("Universe mastery does not help Observer subject OP")
            if (!(u5MasteredMistake < u5BaseMistake))
                failures.push("Universe mastery does not reduce Observer subject mistakes")

            const loopClear = {
                id: 9016,
                rank: "rare",
                personality: "methodical",
                stage_index: observerSubjectStages.length - 1,
                progress: observerSubjectStages[observerSubjectStages.length - 1].threshold + 10,
                ai_level: 20,
                character_level: 8,
                completed_universe_x: 0,
                loop_memory: 0,
                bot_job_level: 1,
                bot_skill_level: 1,
                bot_items: [],
                milestones: { first_rebirth: true, first_evil: true, first_void: true, multiverse_signal: true, universe_ii: true, universe_v: true, universe_x: true },
                insights: { methodical_routine: true },
                bot_log: [],
            }
            normalizeObserverSubject(loopClear)
            advanceObserverSubject(loopClear)
            if (!(loopClear.completed_universe_x >= 1 && loopClear.loop_memory > 1))
                failures.push("Universe X clear does not build loop memory")
            if (!(loopClear.bot_job_level > Math.floor(loopClear.ai_level * 0.6)))
                failures.push("Universe X clear does not improve next-run starting levels")

            subject.bot_evil = 0
            subject.stage_index = 1
            subject.progress = observerSubjectStages[1].threshold + 1
            advanceObserverSubject(subject)
            if (!((subject.bot_evil || 0) >= 1))
                failures.push("Observer subject does not gain bot Evil when entering Evil route")

            return failures
        })

        failures.push(...progressionFailures.map(failure => `${name}: ${failure}`))
    }
    if (name == "late") {
        const upgradeFailures = await page.evaluate(() => {
            if (typeof multiverseUpgradeData == "undefined")
                return ["Multiverse upgrade data is missing"]

            const failures = []
            gameData.multiverse_unlocked = true
            gameData.multiverse.current_universe = 5
            gameData.multiverse.highest_universe = 5
            gameData.multiverse_points = 1000000
            gameData.multiverse_points_lifetime = 10000000
            gameData.evil = 1e45
            gameData.essence = 1e35
            gameData.dark_matter = 1e28
            gameData.hypercubes = 1e26

            for (const key in gameData.taskData) {
                gameData.taskData[key].level = 220
                gameData.taskData[key].maxLevel = 260
            }

            const checks = {
                stable_memory: { metric: "xp", direction: "up" },
                universal_labor: { metric: "income", direction: "up" },
                long_echo: { metric: "lifespan", direction: "up" },
                abyss_tithe: { metric: "evil", direction: "up" },
                essence_prism: { metric: "essence", direction: "up" },
                dark_singularity: { metric: "dm", direction: "up" },
                void_cartography: { metric: "mp", direction: "up" },
                soft_constants: { metric: "expense", direction: "down" },
            }

            function metrics() {
                return {
                    mp: getMultiversePointGain(),
                    xp: getMultiverseXpGain(),
                    income: getMultiverseIncomeGain(),
                    expense: getMultiverseExpenseGain(),
                    lifespan: getMultiverseLifespanGain(),
                    evil: getMultiverseEvilGain(),
                    essence: getMultiverseEssenceGain(),
                    dm: getMultiverseDarkMatterGain(),
                }
            }

            for (const upgrade in checks) {
                for (const key in gameData.multiverse.upgrades)
                    gameData.multiverse.upgrades[key] = 0

                const base = metrics()
                gameData.multiverse.upgrades[upgrade] = 5
                const improved = metrics()
                const check = checks[upgrade]
                const changed = check.direction == "up"
                    ? improved[check.metric] > base[check.metric]
                    : improved[check.metric] < base[check.metric]

                if (!changed)
                    failures.push(`${upgrade} did not improve ${check.metric}`)
            }

            return failures
        })

        failures.push(...upgradeFailures.map(failure => `${name}: ${failure}`))

        const universeFailures = await page.evaluate(() => {
            const failures = []
            if (typeof getUniversePassiveWeight != "function" || typeof getUniverseParameterGain != "function")
                return ["Universe passive helpers are missing"]

            gameData.multiverse_unlocked = true
            gameData.multiverse_points = 1e14
            gameData.multiverse_points_lifetime = 1e15
            gameData.evil = 1e80
            gameData.essence = 1e75
            gameData.dark_matter = 1e70
            gameData.hypercubes = 1e65
            gameData.multiverse.current_universe = 10
            gameData.multiverse.highest_universe = 10
            gameData.multiverse.universe_break_unlocked = true

            const universeRoutes = {
                1: { skills: ["Corrupted", "Void Slave", "Void Fiend", "Void Amplification", "Mind Release"], items: [] },
                2: { skills: ["Royal Administration", "Paperwork Evasion", "Reality Surveying"], items: ["Royal Ledger", "Tax Seal"] },
                3: { skills: ["Arcane Taxation", "Mana Tariff", "Spell Auditing"], items: ["Taxed Grimoire", "Arcane Abacus"] },
                4: { skills: ["Temporal Anchoring", "Borrowed Seconds", "Entropy Calendar"], items: ["Broken Hourglass", "Chronal Compass"] },
                5: { skills: ["Greed Accounting", "Debt Transmutation", "Star Market"], items: ["Star Ledger", "Debt Engine"] },
                6: { skills: ["Dimming Resonance", "Abyssal Recycling", "Null Continuity"], items: ["Dimmed Compass", "Null Contract"] },
                7: { skills: ["Causal Threading", "Paradox Discipline", "Retroactive Training"], items: ["Causality Needle", "Paradox Anchor"] },
                8: { skills: ["Ladder Reconstruction", "Sideways Promotion", "Fractured Mastery", "Recursive Promotion"], items: ["Broken Rung", "Ascension Map"] },
                9: { skills: ["Collapse Containment", "Silent Economy", "Last Signal", "Silence Drills"], items: ["Collapse Gauge", "Quiet Beacon"] },
                10: { skills: ["Threshold Listening", "Impossible Routine", "Witness Preparation", "Observer Alignment"], items: ["Observer Lens", "Static Crown"] },
            }

            function clearRouteProgress() {
                for (const key in gameData.taskData) {
                    gameData.taskData[key].level = 0
                    gameData.taskData[key].maxLevel = 0
                }
                gameData.currentMisc = []
            }

            function trainRoute(route, level) {
                for (const skill of route.skills) {
                    if (gameData.taskData[skill] != null) {
                        gameData.taskData[skill].level = level
                        gameData.taskData[skill].maxLevel = level
                    }
                }
                for (const item of route.items) {
                    if (gameData.itemData[item] != null && !gameData.currentMisc.includes(gameData.itemData[item]))
                        gameData.currentMisc.push(gameData.itemData[item])
                }
            }

            for (let universeId = 1; universeId <= 10; universeId++) {
                clearRouteProgress()
                gameData.multiverse.current_universe = universeId
                gameData.multiverse.highest_universe = Math.max(10, universeId)
                gameData.multiverse.universe_mastery = {}
                if (typeof getMultiverseState == "function")
                    getMultiverseState()

                const route = universeRoutes[universeId]
                const baseParameter = getUniverseParameterGain(universeId)
                const baseWeight = getUniversePassiveWeight(universeId)
                const baseMpGain = getMultiversePointGain()
                trainRoute(route, universeId >= 8 ? 360 : 220)
                const improvedParameter = getUniverseParameterGain(universeId)
                const improvedWeight = getUniversePassiveWeight(universeId)
                const improvedMpGain = getMultiversePointGain()

                if (!(improvedParameter > baseParameter))
                    failures.push(`Universe ${universeId} parameter does not grow from its local route`)
                if (!(improvedWeight > baseWeight))
                    failures.push(`Universe ${universeId} passive MP weight does not grow from its parameter`)
                if (!(improvedMpGain > baseMpGain))
                    failures.push(`Universe ${universeId} route does not improve total passive MP gain`)
            }

            clearRouteProgress()
            gameData.multiverse.current_universe = 5
            gameData.multiverse.highest_universe = 10
            gameData.multiverse.universe_mastery = {}
            if (typeof getMultiverseState == "function")
                getMultiverseState()
            const u5FreshWeight = getUniversePassiveWeight(5)
            trainRoute(universeRoutes[5], 260)
            const u5MasteredWeight = getUniversePassiveWeight(5)
            const u5Mastery = gameData.multiverse.universe_mastery["5"]
            clearRouteProgress()
            gameData.multiverse.current_universe = 6
            const u5RememberedWeight = getUniversePassiveWeight(5)
            if (!(u5Mastery > 1))
                failures.push("Universe V mastery memory did not record trained parameter")
            if (!(u5MasteredWeight > u5FreshWeight))
                failures.push("Universe V mastery did not improve active passive weight")
            if (!(u5RememberedWeight > u5FreshWeight))
                failures.push("Universe V passive MP weight was lost after leaving the universe")

            clearRouteProgress()
            gameData.multiverse.current_universe = 2
            gameData.multiverse.highest_universe = 2
            const u2BaseIncome = getMultiverseIncomeGain()
            const u2BaseExpense = getMultiverseExpenseGain()
            trainRoute(universeRoutes[2], 160)
            const u2ImprovedIncome = getMultiverseIncomeGain()
            const u2ImprovedExpense = getMultiverseExpenseGain()
            if (!(u2ImprovedIncome > u2BaseIncome))
                failures.push("Universe II parameter relief does not improve income")
            if (!(u2ImprovedExpense < u2BaseExpense))
                failures.push("Universe II parameter relief does not reduce expenses")

            for (let universeId = 2; universeId <= 9; universeId++) {
                clearRouteProgress()
                gameData.multiverse.current_universe = universeId
                gameData.multiverse.highest_universe = universeId
                gameData.multiverse.universe_breaks = universeId - 1

                const canBreakBefore = canBreakCurrentUniverse()
                trainRoute(universeRoutes[universeId], universeId >= 8 ? 420 : 320)
                const canBreakAfter = canBreakCurrentUniverse()
                if (canBreakBefore)
                    failures.push(`Universe ${universeId} can break before its required local route`)
                if (!canBreakAfter)
                    failures.push(`Universe ${universeId} cannot break after its required local route`)
            }

            return failures
        })

        failures.push(...universeFailures.map(failure => `${name}: ${failure}`))

        const evilBridgeFailures = await page.evaluate(() => {
            const failures = []
            if (typeof getEvilPerksGeneration != "function")
                return ["Evil perk generation is missing"]

            gameData.evil = 1e12
            gameData.essence = 0
            gameData.rebirthTwoCount = 1
            gameData.rebirthThreeCount = 0
            for (const key in gameData.taskData) {
                gameData.taskData[key].level = 0
                gameData.taskData[key].maxLevel = 0
            }
            const base = getEvilPerksGeneration()

            for (const taskName of ["Dark Influence", "Evil Control", "Demon Training", "Blood Meditation", "Dark Knowledge"]) {
                if (gameData.taskData[taskName] != null) {
                    gameData.taskData[taskName].level = 350
                    gameData.taskData[taskName].maxLevel = 350
                }
            }
            const dark = getEvilPerksGeneration()

            gameData.rebirthThreeCount = 1
            for (const taskName of ["Corrupted", "Void Slave", "Void Fiend", "Void Amplification", "Mind Release"]) {
                if (gameData.taskData[taskName] != null) {
                    gameData.taskData[taskName].level = 250
                    gameData.taskData[taskName].maxLevel = 250
                }
            }
            const voidGain = getEvilPerksGeneration()

            if (!(base > 0))
                failures.push("base EPP generation is zero")
            if (!(dark > base))
                failures.push("Dark Magic does not improve EPP generation")
            if (!(voidGain > dark))
                failures.push("Void progress does not improve EPP generation")

            return failures
        })

        failures.push(...evilBridgeFailures.map(failure => `${name}: ${failure}`))
    }
    for (const error of errors)
        failures.push(`${name}: ${error}`)

    await page.close()

    return { name, globals, tabs: tabs.filter(tab => !tab.hidden && tab.display !== "none").map(tab => tab.text), reports, failures }
}

const earlySetup = () => {
    localStorage.clear()
    updateRequirements()
    updateUI()
}

const lateSetup = () => {
    localStorage.clear()
    gameData.coins = 1e250
    gameData.evil = 1e90
    gameData.essence = 1e80
    gameData.dark_matter = 1e70
    gameData.dark_orbs = 1e75
    gameData.hypercubes = 1e65
    gameData.rebirthOneCount = 10
    gameData.rebirthTwoCount = 10
    gameData.rebirthThreeCount = 10
    gameData.rebirthFourCount = 10
    gameData.rebirthFiveCount = 10
    gameData.days = 365 * 100000
    gameData.totalDays = 365 * 100000

    for (const key in gameData.taskData) {
        gameData.taskData[key].level = 300
        gameData.taskData[key].maxLevel = 300
        gameData.taskData[key].xp = 0
    }

    gameData.multiverse_unlocked = true
    gameData.multiverse_points = 1e9
    gameData.multiverse_points_lifetime = 1e10
    gameData.multiverse.current_universe = 10
    gameData.multiverse.highest_universe = 10
    gameData.multiverse.universe_break_unlocked = true
    gameData.multiverse.observer_signal_prepared = true
    for (const key in gameData.multiverse.upgrades)
        gameData.multiverse.upgrades[key] = 3

    gameData.observer.active = false
    updateRequirements()
    updateUI()
}

const observerSetup = () => {
    localStorage.clear()
    gameData.coins = 1e250
    gameData.evil = 1e90
    gameData.essence = 1e80
    gameData.dark_matter = 1e70
    gameData.dark_orbs = 1e75
    gameData.hypercubes = 1e65
    gameData.rebirthOneCount = 10
    gameData.rebirthTwoCount = 10
    gameData.rebirthThreeCount = 10
    gameData.rebirthFourCount = 10
    gameData.rebirthFiveCount = 10
    gameData.days = 365 * 100000
    gameData.totalDays = 365 * 100000

    for (const key in gameData.taskData) {
        gameData.taskData[key].level = 300
        gameData.taskData[key].maxLevel = 300
        gameData.taskData[key].xp = 0
    }

    gameData.multiverse_unlocked = true
    gameData.multiverse_points = 1e9
    gameData.multiverse_points_lifetime = 1e10
    gameData.multiverse.current_universe = 10
    gameData.multiverse.highest_universe = 10
    gameData.multiverse.universe_break_unlocked = true
    gameData.multiverse.observer_signal_prepared = true
    for (const key in gameData.multiverse.upgrades)
        gameData.multiverse.upgrades[key] = 3

    gameData.multiverse.observer_entry_claimed = true
    gameData.observer.active = true
    gameData.observer.points = 1000000
    if (typeof buyObserverSubject === "function")
        buyObserverSubject()
    if (typeof updateObserverSubjects === "function") {
        for (let i = 0; i < 120; i++)
            updateObserverSubjects()
    }
    updateRequirements()
    updateUI()
}

async function main() {
    const executablePath = findChromePath()
    const launchOptions = executablePath
        ? { headless: true, executablePath }
        : { headless: true }

    const browser = await chromium.launch(launchOptions)
    const results = [
        await runScenario(browser, "early", earlySetup),
        await runScenario(browser, "late", lateSetup),
        await runScenario(browser, "observer", observerSetup),
    ]
    await browser.close()

    const failures = results.flatMap(result => result.failures)
    console.log(JSON.stringify(results.map(result => ({
        name: result.name,
        visibleTabs: result.tabs,
        selectedTab: result.globals.selectedTab,
        failures: result.failures,
    })), null, 2))

    if (failures.length > 0) {
        console.error(`\nRegression failed:\n${failures.join("\n")}`)
        process.exit(1)
    }
}

main().catch(error => {
    console.error(error)
    process.exit(1)
})
