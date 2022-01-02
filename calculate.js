import * as cw from './cryptowars.js';
import * as rd from './random.js';
import * as wp from './weapon.js';
import * as ch from './character.js';
import * as ctr from './controller.js';
import { web3 } from './initialize.js';

export const calculate = async (characterID, weaponID) => {
	const getCharacterPower = async (characterID, weaponID) => {
		const basePower = await ch.getPower(characterID);
		const weaponMultiplier = await wp.getPowerMultiplier(weaponID);
		const bonusPower = await wp.getBonusPower(weaponID);
		const characterPower = await cw.getPlayerPower(
			basePower,
			weaponMultiplier,
			bonusPower
		);
		return characterPower;
	};
	let address = process.env.CONTRACT_ADDRESS
	let seed = await rd.getRandomSeed(address);

	const charPW = await getCharacterPower(characterID, weaponID);
	let targets = await cw.getTargets(characterID, weaponID);
	const weaponTrait = await wp.getTrait(weaponID);
	const charTrait = await ch.getTrait(characterID);
	const charLevel = await cw.getExpectedLevel(characterID);

	let count = 0;
	const MAX_COUNT = 1000;

	const result = [];
	let targetRoll, playerRoll, traitsCWE, traitBonus, rate;
	let playerMin, playerMax, targetMin, targetMax;
	for (let target of targets) {
		playerMin = Infinity;
		playerMax = 0;
		targetMin = Infinity;
		targetMax = 0;
		let tgPW = target & 0xffffff;
		count = 0;
		traitsCWE =
			charTrait | (weaponTrait << 8) | ((target & 0xff000000) >> 8);
		traitBonus = ctr.getPlayerTraitBonusAgainst(traitsCWE);
		for (let i = 0; i < MAX_COUNT; i++) {
			seed = web3.utils.soliditySha3(seed, i);
			targetRoll = ctr.plusMinus10PercentSeededMonster(tgPW, seed);
			playerRoll =
				ctr.plusMinus10PercentSeededWithLv(charPW, seed, charLevel) *
				traitBonus;

			if (playerRoll > targetRoll) count++;
			if (playerRoll > playerMax) playerMax = playerRoll;
			if (playerRoll < playerMin) playerMin = playerRoll;
			if (targetRoll > targetMax) targetMax = targetRoll;
			if (targetRoll < targetMin) targetMin = targetRoll;
		}
		rate = (count * 100) / MAX_COUNT;
		result.push({
			target: tgPW,
			rate: rate,
			bonus: traitBonus,
			tmax: targetMax,
			tmin: targetMin,
			pmax: playerMax,
			pmin: playerMin
		});
	}

	return result;
};
