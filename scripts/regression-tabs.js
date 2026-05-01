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
            ? window.gameData.observer.subjects.map(subject => ({ rank: subject.rank, personality: subject.personality }))
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
    if (name == "observer" && (!globals.observerSubjects[0] || globals.observerSubjects[0].rank != "trash"))
        failures.push(`${name}: first observer subject must be free Trash rank`)
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
