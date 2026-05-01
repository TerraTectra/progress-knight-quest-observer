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

    await page.close()

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
    for (const error of errors)
        failures.push(`${name}: ${error}`)

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
