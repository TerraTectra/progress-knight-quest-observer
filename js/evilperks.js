function getEvilPerksGeneration()
{
	if (gameData.evil <= 0) return 0

	const evilPower = math.log10(Math.max(1, gameData.evil) + 1)
	const essence = Math.max(0, gameData.essence || 0)
	const essencePower = essence > 0 ? math.log10(essence + 10) : 1
	const essenceBoost = 2 + Math.sqrt(Math.max(1, essencePower))
	const generation = evilPower * essenceBoost / 365

	if (!Number.isFinite(generation) || generation <= 0)
		return 0
	return Math.min(generation, 1e308)
}

function getEvilPerkLevel(evilperknum){
	switch (evilperknum){
	case 1: return gameData.evil_perks.reduce_eye_requirement
	case 2: return gameData.evil_perks.reduce_evil_requirement
	case 3: return gameData.evil_perks.reduce_the_void_requirement
	case 4: return gameData.evil_perks.reduce_celestial_requirement
	case 5: return gameData.evil_perks.receive_essence
	default: return 0
	}
}

function getEvilPerkMaxLevel(evilperknum){
	switch (evilperknum){
	case 1: return 10
	case 2: return 14
	case 3: return 9
	case 4: return 9
	case 5: return gameData.essence >= 1e308 ? gameData.evil_perks.receive_essence : Infinity
	default: return 0
	}
}

function isEvilPerkMaxed(evilperknum){
	return getEvilPerkLevel(evilperknum) >= getEvilPerkMaxLevel(evilperknum)
}

function getEyeRequirement(){
	let newreq = 65 - gameData.evil_perks.reduce_eye_requirement * 5
	return newreq < 15 ? 15 : newreq
}

function getEvilRequirement(){
	let newreq = 200 - gameData.evil_perks.reduce_evil_requirement * 12.5
	newreq = newreq < 25 ? 25 : newreq
	newreq = getEyeRequirement() > newreq ? getEyeRequirement() : newreq
	return newreq
}

function getVoidRequirement(){
	let newreq = 1000 - gameData.evil_perks.reduce_the_void_requirement * 100
	newreq = getEvilRequirement() > newreq ? getEvilRequirement() : newreq
	return newreq < 100 ? 100 : newreq
}

function getCelestialRequirement(){
	let newreq = 10000 - gameData.evil_perks.reduce_celestial_requirement * 1000
	return newreq < 1000 ? 1000 : newreq
}

function getEssenceReward(){	
	return getEssenceRewardPercent() / 100.0 * gameData.essence
}

function getEssenceRewardPercent(){	
	return (gameData.evil_perks.receive_essence + 1) * 10
}

function getEvilPerkCost(evilperknum){
	if (isEvilPerkMaxed(evilperknum))
		return Infinity

	switch (evilperknum){
	case 1:
		return math.pow(2, gameData.evil_perks.reduce_eye_requirement + 1) + 4.6
	case 2:
		return math.pow(3, gameData.evil_perks.reduce_evil_requirement + 1) + 66.6-3
	case 3: 
		return math.pow(5, gameData.evil_perks.reduce_the_void_requirement + 1) + 666.6-5
	case 4:
		return math.pow(5, gameData.evil_perks.reduce_celestial_requirement + 1) + 6666-5
	case 5:
		return math.pow(10, gameData.evil_perks.receive_essence) * 6.66e9
	}	
	return Infinity
}

function canBuyEvilPerk(evilperknum){
	const cost = getEvilPerkCost(evilperknum)
	return Number.isFinite(cost) && gameData.evil_perks_points >= cost
}

function buyEvilPerk(evilperknum){
	const cost = getEvilPerkCost(evilperknum)
	if (!canBuyEvilPerk(evilperknum))
		return

	switch (evilperknum){
		case 1:
			gameData.evil_perks_points -= cost
			gameData.evil_perks.reduce_eye_requirement += 1
			break;
		case 2:
			gameData.evil_perks_points -= cost
			gameData.evil_perks.reduce_evil_requirement += 1
			break;
		case 3:
			gameData.evil_perks_points -= cost
			gameData.evil_perks.reduce_the_void_requirement += 1
			break;
		case 4:
			gameData.evil_perks_points -= cost
			gameData.evil_perks.reduce_celestial_requirement += 1
			break;
		case 5:
			const essenceReward = getEssenceReward()
			gameData.evil_perks_points -= cost
			gameData.evil_perks.receive_essence += 1
			gameData.essence += essenceReward
			if (!Number.isFinite(gameData.essence) || gameData.essence > 1e308)
				gameData.essence = 1e308
			break;
	}
}

function hasEvilPerk(i)
{
	switch(i){
		case 1: return gameData.evil_perks.reduce_eye_requirement > 0
		case 2: return gameData.evil_perks.reduce_evil_requirement > 0
		case 3: return gameData.evil_perks.reduce_the_void_requirement > 0
		case 4: return gameData.evil_perks.reduce_celestial_requirement > 0
		case 5: return gameData.evil_perks.receive_essence > 0
	}
}

function getAge0Requirement(){
	const eyeReq = getEyeRequirement()
	switch	(eyeReq){
	case 65:
		return 25
	case 60:
		return 25
	case 55:
		return 25
	case 50:
		return 25
	case 45:
		return 25
	case 40:
		return 25
	case 35:
		return 20
	case 30:
		return 20
	case 25:
		return 18
	case 20:
		return 16
	case 15:
		return 13
	}
}

function getAge1Requirement(){
	const eyeReq = getEyeRequirement()
	switch	(eyeReq){
	case 65:
		return 45
	case 60:
		return 45
	case 55:
		return 45
	case 50:
		return 45
	case 45:
		return 40
	case 40:
		return 35
	case 35:
		return 30
	case 30:
		return 25
	case 25:
		return 20
	case 20:
		return 18
	case 15:
		return 14
	}
}
