import { randomContract as contract } from './initialize.js';

export const getRandomSeed = async (address) => {
	const seed = await contract.methods['getRandomSeed'](address).call();
	return seed;
};
