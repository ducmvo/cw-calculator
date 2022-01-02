import Web3 from 'web3';
import { fetchABI } from './utils.js';
import dotenv from 'dotenv';
dotenv.config();

export const web3 = new Web3(process.env.PROVIDER);

const initialize = () => {
	const weaponContract = initializeWeaponContract();
	const characterContract = initializeCharacterContract();
	const cryptoWarsContract = initializeCryptoWarsContract();
	const randomContract = initializeRandomContract();

	return {
		weaponContract,
		characterContract,
		cryptoWarsContract,
		randomContract
	};
};

const initializeWeaponContract = () => {
	const contractAddress = process.env.WEAPON_CONTRACT_ADDRESS;
	const ABI = 'weapon';
	const contractABI = fetchABI(ABI);
	return new web3.eth.Contract(contractABI, contractAddress);
};

const initializeCharacterContract = () => {
	const contractAddress = process.env.CHARACTER_CONTRACT_ADDRESS;
	const ABI = 'character';
	const contractABI = fetchABI(ABI);
	return new web3.eth.Contract(contractABI, contractAddress);
};

const initializeCryptoWarsContract = () => {
	const contractAddress = process.env.CONTRACT_ADDRESS;
	const ABI = 'cryptowars';
	const contractABI = fetchABI(ABI);
	return new web3.eth.Contract(contractABI, contractAddress);
};

const initializeRandomContract = () => {
	const contractAddress = process.env.RANDOM_SEED_CONTRACT;
	const ABI = 'randoms';
	const contractABI = fetchABI(ABI);
	return new web3.eth.Contract(contractABI, contractAddress);
};

export const {
	weaponContract,
	characterContract,
	cryptoWarsContract,
	randomContract
} = initialize();

console.log('initialize.....');
