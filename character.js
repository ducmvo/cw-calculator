import { characterContract as contract } from './initialize.js';

export const getPower = async (characterID) => {
	const power = await contract.methods['getPower'](characterID).call();
	return parseInt(power);
};

export const getTrait = async (characterID) => {
	const trait = await contract.methods['getTrait'](characterID).call();
	return parseInt(trait);
};

export const getLevel = async (characterID) => {
	const level = await contract.methods['getLevel'](characterID).call();
	return parseInt(level);
};

export const getXp = async (characterID) => {
	const xp = await contract.methods['getXp'](characterID).call();
	return parseInt(xp);
};

export const getStaminaTimestamp = async (characterID) => {
	const staminaTimestamp = await contract.methods['getStaminaTimestamp'](
		characterID
	).call();
	return parseInt(staminaTimestamp);
};

export const getStaminaPoints = async (characterID) => {
	const staminaPoints = await contract.methods['getStaminaPoints'](
		characterID
	).call();
	return parseInt(staminaPoints);
};

export const getSecondsPerStamina = async (characterID) => {
	const secsPerStamina = await contract.methods['getSecondsPerStamina'](
		characterID
	).call();
	return parseInt(secsPerStamina);
};
