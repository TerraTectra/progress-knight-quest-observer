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

async function openGame(browser, errors) {
    const page = await browser.newPage({ viewport: { width: 1600, height: 900 } })
    page.on("console", message => {
        if (["error", "warning"].includes(message.type()))
            errors.push(`${message.type()}: ${message.text()}`)
    })
    page.on("pageerror", error => errors.push(`pageerror: ${error.stack || error.message}`))
    await page.goto(process.env.TEST_URL || DEFAULT_URL, { waitUntil: "domcontentloaded" })
    await page.waitForTimeout(700)
    return page
}

async function runTickStress(page, totalTicks, chunk = 2500) {
    let remaining = totalTicks
    while (remaining > 0) {
        const ticks = Math.min(chunk, remaining)
        await page.evaluate(count => {
            for (let i = 0; i < count; i++)
                update(false)
            updateUI()
        }, ticks)
        remaining -= ticks
    }
}

async function inspectHealth(page, scenarioName) {
    return await page.evaluate(name => {
        const failures = []
        const values = {
            coins: gameData.coins,
            evil: gameData.evil,
            essence: gameData.essence,
            dark_matter: gameData.dark_matter,
            dark_orbs: gameData.dark_orbs,
            hypercubes: gameData.hypercubes,
            mp: gameData.multiverse_points,
            op: gameData.observer && gameData.observer.points,
        }

        for (const key in values) {
            const value = values[key]
            if (value == null || Number.isNaN(value) || value < 0)
                failures.push(`${name}: invalid ${key}`)
        }

        if (Boolean(tempData.hasError))
            failures.push(`${name}: tempData.hasError is true`)

        updateUI()
        const visibleTabs = Array.from(document.querySelectorAll(".tab"))
            .filter(tab => getComputedStyle(tab).display != "none")
        if (visibleTabs.length != 1)
            failures.push(`${name}: expected one visible tab, got ${visibleTabs.length}`)
        if (visibleTabs[0] != null && visibleTabs[0].innerText.trim().length == 0)
            failures.push(`${name}: visible tab is empty`)

        const buttons = Array.from(document.querySelectorAll(".tabButton"))
            .filter(button => !button.classList.contains("hidden") && getComputedStyle(button).display != "none")
        if (buttons.length <= 0)
            failures.push(`${name}: no visible tab buttons`)

        return failures
    }, scenarioName)
}

async function runEarlyStress(browser) {
    const errors = []
    const page = await openGame(browser, errors)
    await page.evaluate(() => {
        localStorage.clear()
        gameData.days = 365 * 14
        gameData.totalDays = 0
        updateRequirements()
        setTab("jobs")
        updateUI()
    })
    await runTickStress(page, 25000)
    const failures = await inspectHealth(page, "early-stress")
    await page.close()
    return { name: "early-stress", failures: [...failures, ...errors] }
}

async function runMultiverseStress(browser) {
    const errors = []
    const page = await openGame(browser, errors)
    await page.evaluate(() => {
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
        gameData.multiverse_points = 1e12
        gameData.multiverse_points_lifetime = 1e13
        gameData.multiverse.current_universe = 8
        gameData.multiverse.highest_universe = 8
        gameData.multiverse.universe_break_unlocked = true
        gameData.multiverse.universe_breaks = 7
        gameData.multiverse.universe_break_records = { "2": 1, "4": 2, "7": 1 }
        gameData.multiverse.universe_mastery = { "2": 30, "5": 55, "8": 24 }
        for (const key in gameData.multiverse.upgrades)
            gameData.multiverse.upgrades[key] = 4
        setTab("multiverse")
        updateRequirements()
        updateUI()
    })
    const before = await page.evaluate(() => gameData.multiverse_points)
    await runTickStress(page, 35000)
    const after = await page.evaluate(() => gameData.multiverse_points)
    const failures = await inspectHealth(page, "multiverse-stress")
    if (!(after > before))
        failures.push("multiverse-stress: MP did not increase")
    await page.close()
    return { name: "multiverse-stress", failures: [...failures, ...errors] }
}

async function runObserverStress(browser) {
    const errors = []
    const page = await openGame(browser, errors)
    await page.evaluate(() => {
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
        gameData.multiverse_points = 1e12
        gameData.multiverse_points_lifetime = 1e13
        gameData.multiverse.current_universe = 10
        gameData.multiverse.highest_universe = 10
        gameData.multiverse.universe_break_unlocked = true
        gameData.multiverse.observer_signal_prepared = true
        gameData.multiverse.observer_entry_claimed = true
        for (const key in gameData.multiverse.upgrades)
            gameData.multiverse.upgrades[key] = 5
        gameData.observer.active = true
        gameData.observer.points = 1000000
        gameData.observer.subjects = []
        gameData.observer.next_subject_id = 1
        if (typeof buyObserverSubject == "function") {
            buyObserverSubject()
            buyObserverSubject()
            buyObserverSubject()
        }
        setTab("observer")
        updateRequirements()
        updateUI()
    })
    const before = await page.evaluate(() => ({
        points: gameData.observer.points,
        subjects: gameData.observer.subjects.map(subject => subject.progress),
    }))
    await runTickStress(page, 45000)
    const after = await page.evaluate(() => ({
        points: gameData.observer.points,
        subjects: gameData.observer.subjects.map(subject => subject.progress),
    }))
    const failures = await inspectHealth(page, "observer-stress")
    if (!(after.points > before.points))
        failures.push("observer-stress: OP did not increase")
    if (!after.subjects.some((progress, index) => progress > before.subjects[index]))
        failures.push("observer-stress: subjects did not progress")
    await page.close()
    return { name: "observer-stress", failures: [...failures, ...errors] }
}

async function main() {
    const executablePath = findChromePath()
    const browser = await chromium.launch(executablePath ? { headless: true, executablePath } : { headless: true })
    const results = [
        await runEarlyStress(browser),
        await runMultiverseStress(browser),
        await runObserverStress(browser),
    ]
    await browser.close()

    console.log(JSON.stringify(results, null, 2))
    const failures = results.flatMap(result => result.failures.map(failure => `${result.name}: ${failure}`))
    if (failures.length > 0) {
        console.error(`\nLong idle stress failed:\n${failures.join("\n")}`)
        process.exit(1)
    }
}

main().catch(error => {
    console.error(error)
    process.exit(1)
})
