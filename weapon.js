import { weaponContract as contract } from './initialize.js';

export const getPowerMultiplier = async (weaponID) => {
	const power = await contract.methods['getPowerMultiplier'](weaponID).call();
	return power;
};

export const getBonusPower = async (weaponID) => {
	const power = await contract.methods['getBonusPower'](weaponID).call();
	return power;
};

export const getTrait = async (weaponID) => {
	const trait = await contract.methods['getTrait'](weaponID).call();
	return parseInt(trait);
};

export const getStars = async (weaponID) => {
	const stars = await contract.methods['getStars'](weaponID).call();
	return parseInt(stars);
};

export const getDurabilityPoints = async (weaponID) => {
	const durabilityPoints = await contract.methods['getDurabilityPoints'](
		weaponID
	).call();
	return parseInt(durabilityPoints);
};
