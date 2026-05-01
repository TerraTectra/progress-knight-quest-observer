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
            gameData.multiverse_points = 1e9
            gameData.multiverse_points_lifetime = 1e10
            gameData.multiverse.current_universe = 2
            gameData.multiverse.highest_universe = 2
            gameData.multiverse.universe_break_unlocked = true

            for (const key in gameData.taskData) {
                gameData.taskData[key].level = 0
                gameData.taskData[key].maxLevel = 0
            }

            const u2BaseParameter = getUniverseParameterGain(2)
            const u2BaseWeight = getUniversePassiveWeight(2)
            const u2BaseIncome = getMultiverseIncomeGain()
            const u2BaseExpense = getMultiverseExpenseGain()
            gameData.taskData["Royal Administration"].level = 160
            gameData.taskData["Paperwork Evasion"].level = 160
            gameData.taskData["Reality Surveying"].level = 120
            const u2ImprovedParameter = getUniverseParameterGain(2)
            const u2ImprovedWeight = getUniversePassiveWeight(2)
            const u2ImprovedIncome = getMultiverseIncomeGain()
            const u2ImprovedExpense = getMultiverseExpenseGain()

            if (!(u2ImprovedParameter > u2BaseParameter))
                failures.push("Universe II parameter does not grow from its skills")
            if (!(u2ImprovedWeight > u2BaseWeight))
                failures.push("Universe II passive MP weight does not grow from its parameter")
            if (!(u2ImprovedIncome > u2BaseIncome))
                failures.push("Universe II parameter relief does not improve income")
            if (!(u2ImprovedExpense < u2BaseExpense))
                failures.push("Universe II parameter relief does not reduce expenses")

            gameData.multiverse.current_universe = 5
            gameData.multiverse.highest_universe = 5
            const u5BaseWeight = getUniversePassiveWeight(5)
            gameData.taskData["Greed Accounting"].level = 180
            gameData.taskData["Star Market"].level = 140
            const u5ImprovedWeight = getUniversePassiveWeight(5)
            if (!(u5ImprovedWeight > u5BaseWeight))
                failures.push("Universe V passive MP weight does not grow from commerce skills")

            gameData.multiverse.current_universe = 9
            gameData.multiverse.highest_universe = 9
            const canBreakBefore = canBreakCurrentUniverse()
            gameData.taskData["Collapse Containment"].level = 320
            gameData.taskData["Silent Economy"].level = 320
            gameData.taskData["Last Signal"].level = 320
            gameData.taskData["Silence Drills"].level = 320
            const canBreakAfter = canBreakCurrentUniverse()
            if (canBreakBefore)
                failures.push("Universe IX can break before its required skill route")
            if (!canBreakAfter)
                failures.push("Universe IX cannot break after its required skill route")

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
