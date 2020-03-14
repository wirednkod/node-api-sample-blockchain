const {
	readdir,
	createReadStream,
	writeFileSync,
	existsSync,
	mkdirSync,
	statSync
} = require('fs');
const sortBy = require('lodash/sortBy')
const { TransactionsSingleton } = require('./Transactions');
const { BlocksSingleton } = require('./Blocks');
const { EthSingleton } = require('./Eth');
const { Erc20Singleton } = require('./Erc20');
const { get, spread, all } = require('axios');
const path = require('path');
const csv = require('csv-parser');
const { ErrorHandler } = require('../utils/error');
const { config } = require('../config');

const trxInstance = new TransactionsSingleton().getInstance()
const blocksInstance = new BlocksSingleton().getInstance()
const ethInstance = new EthSingleton().getInstance()
const erc20Instance = new Erc20Singleton().getInstance()

/**
 * Bootstraping the application.
 * a) Checks the directories - creates if it does not exist
 * b) if less than expected CSV files are found then are they are downloaded
 * c) If files exist it calls loadtocache in order to load them for faster access
 */
const bootstrap = (() => {
	console.log(`\n-- Bootstraping data/directories etc\n`);
	if (!existsSync(config.csv_dir)) {
		mkdirSync(config.csv_dir);
	}
	readdir(config.csv_dir, (err, files) => {
		if (files.length < 4) {
			console.log('-- Not all CSV files found. Downloading now.');
			let calls = [];
			config.csv_urls.forEach(url => {
				calls.push(get(url));
			})
			all(calls).then(
				spread((resp1, resp2, resp3, resp4) => {
					console.log(`------ Finished downloading files. Write to filesystem.\n`);
					writeFileSync(`${config.csv_dir}/transactions.csv`, resp1.data);
					writeFileSync(`${config.csv_dir}/blocks.csv`, resp2.data);
					writeFileSync(`${config.csv_dir}/erc20.csv`, resp3.data);
					writeFileSync(`${config.csv_dir}/eth.csv`, resp4.data);
					console.log(`------ Finished writing - loading to cache\n`);
					loadToCache();
				})).catch(error => {
					console.log(error);
				});
		} else {
			console.log('-- CSV files found. Loading contents.');
			loadToCache();
		}
	});
})();

/**
 * Loads the files to cache for faser access
 */
const loadToCache = () => {
	readdir(config.csv_dir, (err, files) => {
		if (err) {
			console.log('There was an error while reading the directory.');
			return;
		}
		files.forEach(f => {
			let who = f.split('.')[0];
			if (f.split('.')[1] === 'csv') {
				createReadStream(path.join(config.csv_dir, f))
					.pipe(csv())
					.on('data', (row) => {
						switch (who) {
							case 'transactions':
								trxInstance.data.push(row)
								break
							case 'eth':
								ethInstance.data.push(row)
								break
							case 'erc20':
								erc20Instance.data.push(row)
								break
							case 'blocks':
								blocksInstance.data.push(row)
								break
						}
					})
					.on('end', () => {
						switch (who) {
							case 'transactions':
								trxInstance.end = true
								break
							case 'eth':
								ethInstance.end = true
								break
							case 'erc20':
								erc20Instance.end = true
								break
							case 'blocks':
								blocksInstance.end = true
								break
						}
						console.log(`------ Data from CSV file ${f} loaded.`);
					})
					.on('error', () => {
						console.log(`There was an error while reading file ${f}.`);
					});
			}
		});
		return true;
	});
}

/************************** Helper Funcs **********************************/
const filterHash = (data, hash, type) => {
	return data.filter(e => e[type] === hash);
}

const getBalanceByAddress = (data, hash, type = 'address') => {
	let sorted = sortBy(
		filterHash(data, hash, type),
		r => JSON.parse(r.payload).timestamp
	);
	let val = sorted.pop();
	return (val && val.payload) ? JSON.parse(val.payload).balance : '0';
}

const addressInfo = (address) => {
	let tmp = {};
	tmp.balance = getBalanceByAddress(ethInstance.data, address);
	let contract = erc20Instance.data.filter(d => d.contract === address)
	if (contract.length > 0) {
		tmp.type = 'Contract';
	} else {
		tmp.type = 'Address';
	}
	tmp.extraInfo = trxInstance.getAddressTransactionInfo(address);
	return tmp;
}

/***************************** VALIDATORS *************************************/
/**
 * Validator: Hash Validator
 * Description: Checks if a hash is in valid format (block hash)
 */
const hashValidator = (hash, custom_msg = false, isBlock = true) => {
	let val = isBlock ? /^(0x)[A-Fa-f0-9]{64}$/ : /^(0x)?[0-9a-f]{40}$/;
	if (!val.test(hash))
		throw new ErrorHandler(
			400, custom_msg || 'Hash provided is not in valid format'
		);
}

/**
 * Validator: Number Validator
 * Description: Checks if input is valid format (number)
 */
const numberValidator = (input, custom_msg = false) => {
	let valid = true;
	if (Array.isArray(input)) {
		for (let inp of input) {
			valid = /^\d+$/.test(inp);
			if (!valid) break;
		}
	} else {
		valid = /^\d+$/.test(input);
	}
	if (!valid)
		throw new ErrorHandler(
			400, custom_msg || 'Number provided is not in valid format.'
		);
}

/**
 * Validator: Dates Validator
 * Description: Check if provided dates (timestamps) are in valid format (number)
 * and that from is before to date.
 */
const datesValidator = (from, to) => {
	numberValidator([from, to], 'Dates should be provided in timestamp format.');
	if (from > to) {
		throw new ErrorHandler(400, 'FROM timestamp is in later time than TO timestamp');
	}
}

module.exports = {
	getBalanceByAddress,
	addressInfo,
	numberValidator,
	datesValidator,
	hashValidator
}
