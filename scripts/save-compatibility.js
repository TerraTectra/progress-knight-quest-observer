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
    const page = await browser.newPage({ viewport: { width: 1400, height: 850 } })
    page.on("console", message => {
        if (["error", "warning"].includes(message.type()))
            errors.push(`${message.type()}: ${message.text()}`)
    })
    page.on("pageerror", error => errors.push(`pageerror: ${error.stack || error.message}`))
    await page.goto(process.env.TEST_URL || DEFAULT_URL, { waitUntil: "domcontentloaded" })
    await page.waitForTimeout(700)
    return page
}

async function checkLegacySaveMigration(browser) {
    const errors = []
    const page = await openGame(browser, errors)

    await page.evaluate(() => {
        localStorage.clear()
        const save = JSON.parse(JSON.stringify(gameData))
        save.days += 123
        delete save.multiverse
        delete save.multiverse_points
        delete save.multiverse_points_lifetime
        delete save.multiverse_unlocked
        delete save.observer
        localStorage.setItem("gameDataSave", JSON.stringify(save))
    })
    await page.reload({ waitUntil: "domcontentloaded" })
    await page.waitForTimeout(700)

    const failures = await page.evaluate(() => {
        const failures = []
        if (gameData.multiverse == null)
            failures.push("legacy save did not create multiverse state")
        if (gameData.observer == null)
            failures.push("legacy save did not create observer state")
        if (gameData.multiverse_points == null)
            failures.push("legacy save did not create multiverse_points")
        if (!(gameData.multiverse && gameData.multiverse.upgrades && "threshold_prism" in gameData.multiverse.upgrades))
            failures.push("legacy save did not create latest multiverse upgrades")
        if (!(gameData.observer && gameData.observer.upgrades && "threshold_intuition" in gameData.observer.upgrades))
            failures.push("legacy save did not create latest observer upgrades")
        if (typeof isMultiverseUnlocked == "function" && isMultiverseUnlocked())
            failures.push("legacy early save unlocked Multiverse")
        if (typeof isObserverActive == "function" && isObserverActive())
            failures.push("legacy early save activated Observer")
        return failures
    })

    await page.close()
    return { name: "legacy-save-migration", failures: [...failures, ...errors] }
}

async function checkPartialNestedMigration(browser) {
    const errors = []
    const page = await openGame(browser, errors)

    await page.evaluate(() => {
        localStorage.clear()
        const save = JSON.parse(JSON.stringify(gameData))
        save.multiverse = {
            current_universe: 3,
            highest_universe: 3,
            upgrades: { stable_memory: 2 },
        }
        save.multiverse_unlocked = true
        save.multiverse_points = 1234
        save.multiverse_points_lifetime = 5678
        save.observer = {
            active: false,
            points: 0,
            upgrades: { clear_instructions: 1 },
        }
        localStorage.setItem("gameDataSave", JSON.stringify(save))
    })
    await page.reload({ waitUntil: "domcontentloaded" })
    await page.waitForTimeout(700)

    const failures = await page.evaluate(() => {
        const failures = []
        if (!(gameData.multiverse && gameData.multiverse.upgrades && gameData.multiverse.upgrades.stable_memory == 2))
            failures.push("partial save lost existing multiverse upgrade")
        if (!("fracture_memory" in gameData.multiverse.upgrades))
            failures.push("partial save did not add new multiverse upgrade")
        if (!(gameData.observer && gameData.observer.upgrades && gameData.observer.upgrades.clear_instructions == 1))
            failures.push("partial save lost existing observer upgrade")
        if (!("hidden_patronage" in gameData.observer.upgrades))
            failures.push("partial save did not add new observer upgrade")
        if (!(gameData.multiverse.current_universe == 3 && gameData.multiverse.highest_universe == 3))
            failures.push("partial save lost universe position")
        return failures
    })

    await page.close()
    return { name: "partial-nested-migration", failures: [...failures, ...errors] }
}

async function checkImportExportRoundTrip(browser) {
    const errors = []
    const page = await openGame(browser, errors)

    const navigation = page.waitForNavigation({ waitUntil: "domcontentloaded", timeout: 5000 }).catch(error => {
        errors.push(`navigation: ${error.message}`)
    })
    const failures = await page.evaluate(() => {
        const failures = []
        localStorage.clear()
        gameData.multiverse_unlocked = true
        gameData.multiverse_points = 9999
        gameData.multiverse_points_lifetime = 12345
        gameData.multiverse.current_universe = 4
        gameData.multiverse.highest_universe = 4
        gameData.multiverse.upgrades.threshold_prism = 2
        gameData.observer.points = 321
        gameData.observer.upgrades.hidden_patronage = 3
        saveGameData()
        exportGameData()

        const box = document.getElementById("importExportBox")
        const exported = box.value
        if (exported.length <= 20)
            failures.push("exported save is unexpectedly short")

        gameData.multiverse_points = 0
        gameData.observer.points = 0
        box.value = exported
        importGameData()
        return failures
    })
    await navigation
    await page.waitForTimeout(700)
    const reloadFailures = await page.evaluate(() => {
        const failures = []
        if (!(gameData.multiverse_points >= 9999))
            failures.push("import round-trip lost Multiverse Points")
        if (!(gameData.multiverse && gameData.multiverse.current_universe == 4))
            failures.push("import round-trip lost current universe")
        if (!(gameData.multiverse.upgrades && gameData.multiverse.upgrades.threshold_prism == 2))
            failures.push("import round-trip lost multiverse upgrade")
        if (!(gameData.observer && gameData.observer.points >= 321))
            failures.push("import round-trip lost Observer Points")
        if (!(gameData.observer.upgrades && gameData.observer.upgrades.hidden_patronage == 3))
            failures.push("import round-trip lost observer upgrade")
        return failures
    })

    await page.close()
    return { name: "import-export-roundtrip", failures: [...failures, ...reloadFailures, ...errors] }
}

async function main() {
    const executablePath = findChromePath()
    const browser = await chromium.launch(executablePath ? { headless: true, executablePath } : { headless: true })
    const results = [
        await checkLegacySaveMigration(browser),
        await checkPartialNestedMigration(browser),
        await checkImportExportRoundTrip(browser),
    ]
    await browser.close()

    console.log(JSON.stringify(results, null, 2))
    const failures = results.flatMap(result => result.failures.map(failure => `${result.name}: ${failure}`))
    if (failures.length > 0) {
        console.error(`\nSave compatibility failed:\n${failures.join("\n")}`)
        process.exit(1)
    }
}

main().catch(error => {
    console.error(error)
    process.exit(1)
})
