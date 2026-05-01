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
    await page.waitForTimeout(800)
    return page
}

async function runTicks(page, count) {
    await page.evaluate(ticks => {
        for (let i = 0; i < ticks; i++)
            update(false)
        updateUI()
    }, count)
}

async function saveReloadAndCheck(page, check) {
    await page.evaluate(() => saveGameData())
    await page.reload({ waitUntil: "domcontentloaded" })
    await page.waitForTimeout(800)
    return await page.evaluate(check)
}

function lateSetup() {
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
    gameData.multiverse.universe_mastery = { "5": 42, "9": 70 }
    gameData.multiverse.universe_break_records = { "5": 2, "9": 1 }
    gameData.multiverse.observer_signal_prepared = true
    for (const key in gameData.multiverse.upgrades)
        gameData.multiverse.upgrades[key] = 3

    updateRequirements()
    updateUI()
}

function observerSetup() {
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
    gameData.observer.subjects = []
    gameData.observer.next_subject_id = 1
    if (typeof buyObserverSubject == "function")
        buyObserverSubject()
    updateRequirements()
    updateUI()
}

async function inspectTabs(page) {
    return await page.evaluate(async () => {
        const failures = []
        const visibleButtons = Array.from(document.querySelectorAll(".tabButton"))
            .filter(button => !button.classList.contains("hidden") && getComputedStyle(button).display != "none")

        for (const button of visibleButtons) {
            setTab(button.id.replace("TabButton", ""))
            updateUI()
            const visibleTabs = Array.from(document.querySelectorAll(".tab"))
                .filter(tab => getComputedStyle(tab).display != "none")
            if (visibleTabs.length != 1)
                failures.push(button.textContent.trim() + " shows " + visibleTabs.length + " visible tabs")
            if (visibleTabs[0] != null && visibleTabs[0].innerText.trim().length == 0)
                failures.push(button.textContent.trim() + " tab is empty")
        }

        return failures
    })
}

async function runEarlyScenario(browser) {
    const errors = []
    const page = await openGame(browser, errors)
    const failures = []

    await page.evaluate(() => {
        localStorage.clear()
        updateRequirements()
        updateUI()
    })
    const start = await page.evaluate(() => gameData.days)
    await runTicks(page, 2500)
    const earlyState = await page.evaluate(() => ({
        days: gameData.days,
        error: Boolean(tempData.hasError),
        multiverse: typeof isMultiverseUnlocked == "function" && isMultiverseUnlocked(),
        mpGain: typeof getMultiversePointGain == "function" ? getMultiversePointGain() : 0,
    }))

    if (!(earlyState.days > start))
        failures.push("early game did not advance during long-run ticks")
    if (earlyState.error)
        failures.push("early game set tempData.hasError")
    if (earlyState.multiverse)
        failures.push("early game unlocked Multiverse")
    if (earlyState.mpGain != 0)
        failures.push("early game generated passive MP")

    const reloadFailures = await saveReloadAndCheck(page, () => {
        const failures = []
        if (!(gameData.days > 365 * 14))
            failures.push("early save did not preserve days")
        if (typeof isMultiverseUnlocked == "function" && isMultiverseUnlocked())
            failures.push("early save reload unlocked Multiverse")
        return failures
    })
    failures.push(...reloadFailures)
    failures.push(...errors)
    await page.close()
    return { name: "early-long-run", failures }
}

async function runLateScenario(browser) {
    const errors = []
    const page = await openGame(browser, errors)
    const failures = []

    await page.evaluate(lateSetup)
    const before = await page.evaluate(() => ({
        mp: gameData.multiverse_points,
        evil: getEvilGain(),
        income: getIncome(),
        lifespan: getLifespan(),
    }))
    await runTicks(page, 1800)
    const after = await page.evaluate(() => ({
        mp: gameData.multiverse_points,
        evil: getEvilGain(),
        income: getIncome(),
        lifespan: getLifespan(),
        error: Boolean(tempData.hasError),
    }))

    if (!(after.mp > before.mp))
        failures.push("late game did not gain passive Multiverse Points")
    if (!(after.evil > 0 && after.income > 0 && after.lifespan > 0))
        failures.push("late game has invalid core gains")
    if (after.error)
        failures.push("late game set tempData.hasError")

    failures.push(...await inspectTabs(page))
    const reloadFailures = await saveReloadAndCheck(page, () => {
        const failures = []
        if (!(gameData.multiverse_points > 0))
            failures.push("late save did not preserve MP")
        if (!(gameData.multiverse && gameData.multiverse.highest_universe >= 10))
            failures.push("late save did not preserve highest universe")
        if (!(gameData.multiverse && gameData.multiverse.universe_mastery && gameData.multiverse.universe_mastery["5"] >= 42))
            failures.push("late save did not preserve universe mastery memory")
        if (!(gameData.multiverse && gameData.multiverse.universe_break_records && gameData.multiverse.universe_break_records["5"] >= 2))
            failures.push("late save did not preserve universe break records")
        if (gameData.observer && gameData.observer.active)
            failures.push("late save unexpectedly activated Observer")
        return failures
    })
    failures.push(...reloadFailures)
    failures.push(...errors)
    await page.close()
    return { name: "late-long-run", failures }
}

async function runObserverScenario(browser) {
    const errors = []
    const page = await openGame(browser, errors)
    const failures = []

    await page.evaluate(observerSetup)
    await page.evaluate(() => {
        const subject = gameData.observer.subjects[0]
        subject.rank = "rare"
        subject.personality = "methodical"
        subject.ai_level = 9
        subject.character_level = 4
        subject.stage_index = 8
        subject.progress = observerSubjectStages[8].threshold + 25
        subject.completed_universe_x = 2
        subject.loop_memory = 3
        subject.bot_items = ["Universe Fragment", "Chronal Compass"]
        subject.milestones.universe_v = true
        subject.insights.methodical_routine = true
    })
    const before = await page.evaluate(() => ({
        points: gameData.observer.points,
        progress: gameData.observer.subjects[0].progress,
        log: gameData.observer.subjects[0].bot_log.length,
    }))
    await runTicks(page, 2400)
    const after = await page.evaluate(() => {
        const subject = gameData.observer.subjects[0]
        return {
            points: gameData.observer.points,
            progress: subject.progress,
            log: subject.bot_log.length,
            op: getObserverSubjectOpGain(subject),
            error: Boolean(tempData.hasError),
            selectedTab: gameData.settings.selectedTab,
        }
    })

    if (!(after.points > before.points))
        failures.push("Observer did not gain OP during long-run ticks")
    if (!(after.progress > before.progress))
        failures.push("Observer subject did not progress")
    if (!(after.log > 0 && after.op > 0))
        failures.push("Observer subject has invalid log or OP")
    if (after.selectedTab != "observer")
        failures.push("Observer mode did not force Observer tab")
    if (after.error)
        failures.push("Observer set tempData.hasError")

    failures.push(...await inspectTabs(page))
    const reloadFailures = await saveReloadAndCheck(page, () => {
        const failures = []
        if (!(gameData.observer && gameData.observer.active))
            failures.push("Observer save did not preserve active layer")
        if (!(gameData.observer.subjects && gameData.observer.subjects.length > 0))
            failures.push("Observer save did not preserve subjects")
        if (!(gameData.observer.points > 0))
            failures.push("Observer save did not preserve points")
        const subject = gameData.observer.subjects[0]
        if (subject.rank != "rare" || subject.personality != "methodical")
            failures.push("Observer save did not preserve subject identity")
        if (!(subject.ai_level >= 9 && subject.character_level >= 4))
            failures.push("Observer save did not preserve subject levels")
        if (!(subject.stage_index >= 8 && subject.progress > observerSubjectStages[8].threshold))
            failures.push("Observer save did not preserve subject run progress")
        if (!(subject.completed_universe_x >= 2 && subject.loop_memory >= 3))
            failures.push("Observer save did not preserve subject loop memory")
        if (!(subject.bot_items && subject.bot_items.includes("Universe Fragment")))
            failures.push("Observer save did not preserve subject inventory")
        if (!(subject.milestones && subject.milestones.universe_v))
            failures.push("Observer save did not preserve subject milestones")
        if (!(subject.insights && subject.insights.methodical_routine))
            failures.push("Observer save did not preserve subject insights")
        return failures
    })
    failures.push(...reloadFailures)
    failures.push(...errors)
    await page.close()
    return { name: "observer-long-run", failures }
}

async function main() {
    const executablePath = findChromePath()
    const launchOptions = executablePath
        ? { headless: true, executablePath }
        : { headless: true }
    const browser = await chromium.launch(launchOptions)
    const results = [
        await runEarlyScenario(browser),
        await runLateScenario(browser),
        await runObserverScenario(browser),
    ]
    await browser.close()

    console.log(JSON.stringify(results, null, 2))
    const failures = results.flatMap(result => result.failures.map(failure => `${result.name}: ${failure}`))
    if (failures.length > 0) {
        console.error(`\nRelease stability failed:\n${failures.join("\n")}`)
        process.exit(1)
    }
}

main().catch(error => {
    console.error(error)
    process.exit(1)
})
