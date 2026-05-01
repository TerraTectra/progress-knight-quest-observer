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

async function main() {
    const errors = []
    const executablePath = findChromePath()
    const browser = await chromium.launch(executablePath ? { headless: true, executablePath } : { headless: true })
    const page = await browser.newPage({ viewport: { width: 1600, height: 900 } })

    page.on("console", message => {
        if (["error", "warning"].includes(message.type()))
            errors.push(`${message.type()}: ${message.text()}`)
    })
    page.on("pageerror", error => errors.push(`pageerror: ${error.stack || error.message}`))

    await page.goto(process.env.TEST_URL || DEFAULT_URL, { waitUntil: "domcontentloaded" })
    await page.waitForTimeout(800)

    const failures = await page.evaluate(() => {
        const failures = []
        const routes = {
            2: ["Royal Administration", "Paperwork Evasion", "Reality Surveying"],
            3: ["Arcane Taxation", "Mana Tariff", "Spell Auditing"],
            4: ["Temporal Anchoring", "Borrowed Seconds", "Entropy Calendar"],
            5: ["Greed Accounting", "Debt Transmutation", "Star Market"],
            6: ["Dimming Resonance", "Abyssal Recycling", "Null Continuity"],
            7: ["Causal Threading", "Paradox Discipline", "Retroactive Training"],
            8: ["Ladder Reconstruction", "Sideways Promotion", "Fractured Mastery", "Recursive Promotion"],
            9: ["Collapse Containment", "Silent Economy", "Last Signal", "Silence Drills"],
            10: ["Threshold Listening", "Impossible Routine", "Witness Preparation", "Observer Alignment"],
        }

        function setupBase() {
            localStorage.clear()
            gameData.coins = 1e260
            gameData.evil = 1e95
            gameData.essence = 1e88
            gameData.dark_matter = 1e80
            gameData.dark_orbs = 1e80
            gameData.hypercubes = 1e75
            gameData.rebirthOneCount = 10
            gameData.rebirthTwoCount = 10
            gameData.rebirthThreeCount = 10
            gameData.rebirthFourCount = 10
            gameData.rebirthFiveCount = 10
            gameData.days = 365 * 100000
            gameData.totalDays = 365 * 100000
            gameData.multiverse_unlocked = true
            gameData.multiverse_points = 1e16
            gameData.multiverse_points_lifetime = 1e17
            gameData.multiverse.current_universe = 2
            gameData.multiverse.highest_universe = 2
            gameData.multiverse.universe_break_unlocked = true
            gameData.multiverse.universe_breaks = 1
            gameData.multiverse.observer_signal_prepared = false
            gameData.multiverse.observer_entry_claimed = false
            gameData.observer.active = false
            for (const key in gameData.multiverse.upgrades)
                gameData.multiverse.upgrades[key] = 4
            gameData.multiverse.upgrades.fracture_memory = 7
            gameData.multiverse.upgrades.threshold_prism = 6
            for (const key in gameData.taskData) {
                gameData.taskData[key].level = 0
                gameData.taskData[key].maxLevel = 0
            }
            updateRequirements()
        }

        function train(universeId) {
            const route = routes[universeId] || []
            const level = universeId >= 8 ? 440 : 340
            for (const skill of route) {
                if (gameData.taskData[skill] != null) {
                    gameData.taskData[skill].level = level
                    gameData.taskData[skill].maxLevel = level
                }
            }
        }

        setupBase()

        for (let universeId = 2; universeId <= 9; universeId++) {
            gameData.multiverse.current_universe = universeId
            gameData.multiverse.highest_universe = universeId
            train(universeId)
            if (!canBreakCurrentUniverse()) {
                failures.push(`cannot break Universe ${universeId}`)
                break
            }
            if (!breakCurrentUniverse()) {
                failures.push(`breakCurrentUniverse returned false for Universe ${universeId}`)
                break
            }
            if (gameData.multiverse.highest_universe != universeId + 1)
                failures.push(`Universe ${universeId + 1} did not unlock`)
        }

        if (gameData.multiverse.highest_universe != 10)
            failures.push("Universe X was not reached")

        gameData.multiverse.current_universe = 10
        train(10)
        if (!prepareObserverSignal())
            failures.push("Observer signal could not be prepared at Universe X")
        if (!enterObserverLayer())
            failures.push("Observer layer could not be entered")
        if (!gameData.observer.active)
            failures.push("Observer layer is not active after entry")
        if (!(gameData.observer.subjects && gameData.observer.subjects.length > 0))
            failures.push("Observer entry did not create a subject")
        if (gameData.observer.subjects && gameData.observer.subjects[0] && gameData.observer.subjects[0].rank != "trash")
            failures.push("First Observer subject is not Trash")
        if (!(gameData.observer.points > 0))
            failures.push("Observer entry did not grant starting OP")

        updateUI()
        saveGameData()
        return failures
    })

    await page.reload({ waitUntil: "domcontentloaded" })
    await page.waitForTimeout(800)
    const reloadFailures = await page.evaluate(() => {
        const failures = []
        if (!(gameData.multiverse && gameData.multiverse.highest_universe >= 10))
            failures.push("reload lost Universe X")
        if (!(gameData.observer && gameData.observer.active))
            failures.push("reload lost Observer active state")
        if (!(gameData.observer.subjects && gameData.observer.subjects.length > 0))
            failures.push("reload lost Observer subject")
        if (gameData.settings.selectedTab != "observer")
            failures.push("reload did not keep Observer tab")
        return failures
    })

    await browser.close()

    const allFailures = [...failures, ...reloadFailures, ...errors]
    console.log(JSON.stringify({ failures: allFailures }, null, 2))
    if (allFailures.length > 0)
        process.exit(1)
}

main().catch(error => {
    console.error(error)
    process.exit(1)
})
