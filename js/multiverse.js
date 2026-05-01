function isMultiverseUnlocked() {
    return gameData.multiverse_unlocked || gameData.multiverse_points > 0 || gameData.rebirthFiveCount > 0
}

function updateMultiverseUnlock() {
    if (gameData.multiverse_unlocked)
        return

    const voidRequirement = gameData.requirements["The Void"]
    if (voidRequirement != null && voidRequirement.isCompleted())
        gameData.multiverse_unlocked = true
}

function getMultiverseCategoryPower(category, scale) {
    let power = 0

    for (const taskName of category) {
        const task = gameData.taskData[taskName]
        if (task == null)
            continue

        power += Math.sqrt(task.level + task.maxLevel * 0.25)
    }

    return 1 + power * scale
}

function getMultiverseVoidResonance() {
    if (!isMultiverseUnlocked())
        return 0

    const voidJobs = getMultiverseCategoryPower(jobCategories["The Void"], 0.02)
    const voidSkills = getMultiverseCategoryPower(skillCategories["Void Manipulation"], 0.018)
    const darkMatter = 1 + Math.log10(gameData.dark_matter + 1) * 0.01
    const hypercubes = 1 + Math.log10(gameData.hypercubes + 1) * 0.025
    const essence = 1 + Math.max(0, Math.log10(gameData.essence + 1) - 20) * 0.015

    return voidJobs * voidSkills * darkMatter * hypercubes * essence
}

function getMultiversePointGain() {
    if (!isMultiverseUnlocked())
        return 0

    return 0.001 * getMultiverseVoidResonance()
}

function increaseMultiversePoints() {
    updateMultiverseUnlock()

    if (!canSimulate() || !isMultiverseUnlocked())
        return

    const gain = getMultiversePointGain() / updateSpeed
    gameData.multiverse_points += gain
    gameData.multiverse_points_lifetime += gain
}
