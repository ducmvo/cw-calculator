import * as abi from './abi/index.js';
export const fetchABI = (abiName) => {
	switch (abiName) {
		case 'weapon':
			return abi.weapon;
		case 'character':
			return abi.character;
		case 'cryptowars':
			return abi.cryptowars;
		case 'randoms':
			return abi.randoms;
		default:
			return null;
	}
};
