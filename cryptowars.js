import { web3, cryptoWarsContract as contract } from './initialize.js';
import * as ctr from './controller.js';

export const getMyCharacters = async (address) => {
	const options = {
		from: address
	};
	const characters = await contract.methods['getMyCharacters']().call(
		options
	);
	return characters;
};

export const getMyWeapons = async (address) => {
	const options = {
		from: address
	};
	const weapons = await contract.methods['getMyWeapons']().call(options);
	return weapons;
};

export const getTargets = async (characterID, weaponID) => {
	const targets = await contract.methods['getTargets'](
		characterID,
		weaponID
	).call();
	return targets;
};

export const getMonsterPower = async (target) => {
	const monsterPower = await contract.methods['getMonsterPower'](
		target
	).call();
	return monsterPower;
};

export const getPlayerPower = async (
	basePower,
	weaponMultiplier,
	bonusPower
) => {
	// weaponMultiplier * basePower + bonusPower
	const playerPower = await contract.methods['getPlayerPower'](
		basePower,
		weaponMultiplier,
		bonusPower
	).call();
	return parseInt(playerPower);
};

export const getPlayerPowerRoll = (
	playerFightPower,
	traitsCWE,
	seed,
	level
) => {
	let traitBonus = ctr.getPlayerTraitBonusAgainst(traitsCWE);
	const calculatedPowerRoll = ctr.plusMinus10PercentSeededWithLv(
		playerFightPower,
		seed,
		level
	);
	const finalRoll = traitBonus * calculatedPowerRoll;
	return finalRoll;
};

export const getMonsterPowerRoll = (monsterPower, seed) => {
	// roll for fights
	return ctr.plusMinus10PercentSeededMonster(monsterPower, seed);
};

export const getXpRewards = async (characterID) => {
	const xpRewards = contract.methods['getXpRewards'](characterID).call();
	return xpRewards;
};

export const getExpectedLevel = async (characterID) => {
	const expectedLevel = await contract.methods['getHeroExpectedLevel'](
		characterID
	).call();
	return parseInt(expectedLevel);
};

export const getTaxByHeroLevel = async (characterID) => {
	const taxByHeroLevel = await contract.methods['getTaxByHeroLevel'](
		characterID
	).call();
	return parseInt(taxByHeroLevel);
};

const estimateGas = async (contract, address, method, params) => {
	let gasAmount = 0;
	try {
		gasAmount = await contract.methods[method](...params).estimateGas({
			from: address,
			gas: 800000,
			value: web3.utils.toWei('0.0007', 'ether')
		});
	} catch (err) {
		console.log(err.message);
	}
	return gasAmount;
};

// const getTransactionFee = async (estGas) => {
// 	const DEFAULT_PRICE = 5;
// 	let gasPrice;
// 	try {
// 		gasPrice = await bsc.get('&module=gastracker&action=gasoracle');
// 		gasPrice = gasPrice.result.SafeGasPrice;
// 	} catch (err) {
// 		console.log(err.message);
// 		gasPrice = DEFAULT_PRICE;
// 	}
// 	let txFee = JSON.stringify(parseInt(estGas) * parseInt(gasPrice)); // Gwei
// 	txFee = web3.utils.toWei(txFee, 'Gwei'); // convert to Wei
// 	// console.log('Gas Amount: ', estGas);
// 	// console.log('Gas Price: ', gasPrice); // Gwei
// 	// console.log('TX Fee: ', web3.utils.fromWei(txFee, 'ether'));
// 	return web3.utils.fromWei(txFee, 'ether');
// };

export const getFightResult = async (blockNumber) => {
	const fightEvent = await contract.getPastEvents('FightOutcome', {
		fromBlock: blockNumber,
		toBlock: blockNumber
	});
	const {
		owner,
		character,
		weapon,
		target,
		playerRoll,
		enemyRoll,
		xpGain,
		xBladeGain
	} = fightEvent[0].returnValues;
	return {
		owner: owner,
		character: character,
		weapon: weapon,
		target: target,
		playerRoll: parseInt(playerRoll),
		enemyRoll: parseInt(enemyRoll),
		xpGain: parseInt(xpGain),
		xBladeGain: parseInt(web3.utils.fromWei(xBladeGain, 'ether'))
	};
};

// export const fight = async (
// 	characterID,
// 	weaponID,
// 	targetID,
// 	fightMultiplier
// ) => {
// 	const RECEIPT_LOG_FILE = './logs/receipt.txt';
// 	const TX_LOG_FILE = './logs/tx.txt';
// 	const FIGHT_RESULT_FILE = './logs/fight-result.txt';
// 	const METHOD = 'fight';
// 	const GAS_LIMIT = 800000;
// 	let signedTx, receipt;

// 	const taxByLevel = await getTaxByHeroLevel(characterID);
// 	const minTax = JSON.stringify(taxByLevel * 0.9); // Only required 90% tax

// 	const encodedABI = await contract.methods[METHOD](
// 		characterID,
// 		weaponID,
// 		targetID,
// 		fightMultiplier
// 	).encodeABI();

// 	signedTx = await web3.eth.accounts.signTransaction(
// 		{
// 			from: wallets[0].address,
// 			to: process.env.CONTRACT_ADDRESS,
// 			data: encodedABI,
// 			gas: GAS_LIMIT,
// 			value: minTax
// 		},
// 		wallets[0].privateKey
// 	);

// 	receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

// 	fs.appendFileSync(TX_LOG_FILE, JSON.stringify(signedTx) + '\n');
// 	fs.appendFileSync(RECEIPT_LOG_FILE, JSON.stringify(receipt) + '\n');

// 	const { status, blockNumber, gasUsed, transactionHash } = receipt;

// 	if (!status) throw new Error('Transaction failed!');

// 	console.log(
// 		'Transaction successfully posted.\nBlock #: %s\nTXHash: %s',
// 		blockNumber,
// 		'https://bscscan.com/tx/' + transactionHash
// 	);
// 	let fightResult = await getFightResult(blockNumber);
// 	const txFee = await getTransactionFee(gasUsed);
// 	fightResult = { ...fightResult, txFee: txFee, txHash: transactionHash };
// 	fs.appendFileSync(FIGHT_RESULT_FILE, JSON.stringify(fightResult) + '\n');
// 	return fightResult;
// };
