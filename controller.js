import { web3 } from './initialize.js';
let maxReduce = 4700; // 47%
let range = 700; // 7%
let reducePerMilestone = 70; // 0.07%
let maxFactor = 1000; // Need to find this value somewhere

export const randomSeededMinMax = (min, max, seed) => {
	let diff = max - min + 1;
	let randomNum = parseInt(web3.utils.soliditySha3(seed));
	let randomVar = randomNum % diff;
	randomVar = randomVar + min;
	return randomVar;
};

export const combineSeeds = (seed1, seed2) => {
	let result = web3.utils.soliditySha3(seed1, seed2);
	return result;
};

const trySub = (a, b) => {
	if (b > a) return { success: false, reduce: 0 };
	return { success: true, reduce: a - b };
};

export const getMaxRollPerLevel = (level) => {
	let base = 10000; // 100%
	if (level < 8) {
		return base;
	}
	let { reduce, success } = trySub(base, level * reducePerMilestone);

	if (reduce < maxReduce || !success) {
		reduce = maxReduce;
	}
	return reduce;
};

export const getMinRollPerLevel = (level) => {
	const maxRollLevel = getMaxRollPerLevel(level);
	return maxRollLevel - (maxRollLevel * range) / 10000;
};

function getPowerFactor(power) {
	if (power < 1500) {
		return 0;
	}
	// 1 = 10000/10000
	if (power < maxFactor) {
		return (power * 1000) / maxFactor;
	}
	return 1000; // 10%
}

export const plusMinus10PercentSeededMonster = (num, seed) => {
	let tenPercent = num / 10;
	let r = combineSeeds(seed, 1);

	let minPowerRoll = 0;
	let maxPowerRoll = tenPercent * 2;

	if (r % 100 >= 10) {
		minPowerRoll = (num * getPowerFactor(num)) / 10000;
		maxPowerRoll = (num * 20) / 100;
	}

	return (
		num - tenPercent + randomSeededMinMax(minPowerRoll, maxPowerRoll, seed)
	);
};

export const isTraitEffectiveAgainst = (attacker, defender) => {
	return (attacker + 1) % 4 == defender; // Thanks to Tourist
};

export const getPlayerTraitBonusAgainst = (traitsCWE) => {
	let traitBonus = 1;
	let fightTraitBonus = 7.5 / 100;
	let characterTrait = traitsCWE & 0xff;
	if (characterTrait == ((traitsCWE >> 8) & 0xff) /*wepTrait*/) {
		traitBonus = traitBonus + fightTraitBonus;
	}

	if (isTraitEffectiveAgainst(characterTrait, traitsCWE >> 16 /*enemy*/)) {
		traitBonus = traitBonus + fightTraitBonus;
	} else if (
		isTraitEffectiveAgainst(traitsCWE >> 16 /*enemy*/, characterTrait)
	) {
		traitBonus = traitBonus - fightTraitBonus;
	}
	return traitBonus;
};

export const plusMinus10PercentSeededWithLv = (power, seed, level) => {
	let twentyPercent = power / 5;
	let roll = power - twentyPercent; // 1223.2
	let min = 0;
	let max = twentyPercent * 2;
	let r = combineSeeds(seed, level);
	let randomAdd = randomSeededMinMax(min, max, seed);

	if (r % 100 >= 10) {
		// ie. level 23
		min = getMinRollPerLevel(level); // 8390 - 8390 * 0.007 = 8331
		max = getMaxRollPerLevel(level); // 10000 - 23 * 70 = 8390
	} else {
		return roll + randomAdd; // 10% chance within -20% -> 20% power
	}

	let randomMultiple = randomSeededMinMax(min, max, combineSeeds(r, level));
	roll = ((roll + randomAdd) * randomMultiple) / 10000;

	if (roll > power + twentyPercent) {
		roll = power + twentyPercent;
	}
	if (roll < power - twentyPercent) {
		roll = power - twentyPercent;
	}
	return roll;
};
