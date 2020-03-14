const orderBy = require('lodash/orderBy')

class Transactions {
	constructor() {
		this.pageSize = 30;
		this.data = [];
		this.end = false;
	}

	getPagination = (pageNo, srtBy = false, ordBy = false) => {
		let max_av_pages = Math.round(this.data.length / this.pageSize);
		if (!pageNo || pageNo < 1) {
			pageNo = 1;
		} else if (pageNo > max_av_pages) {
			pageNo = max_av_pages;
		}
		let data;
		if (srtBy && ordBy) {
			data = orderBy(this.data, srtBy, ordBy);
		} else {
			data = this.data
		}
		return data.slice((pageNo - 1) * this.pageSize, pageNo * this.pageSize);
	}

	filterHash = hash => {
		return this.data.find(t => t.hash === hash);
	}

	filterNoAndIndex = (index, blockNo) => {
		return this.data.find(
			t => t.transactionIndex === index && t.blockNumber === blockNo
		);
	}

	filterHashAndIndex = (index, blockhash) => {
		return this.data.find(
			t => t.transactionIndex === index && t.blockHash === blockhash
		);
	}

	getAddressTransactionInfo = (hash) => {
		let sent = 0
		let receive = 0
		let inBlockNumber = []
		let inBlockHash = []
		let trxData = this.data.filter(t => t.addresses.includes(hash));
		trxData.forEach(t => {
			if (t.from === hash) {
				sent += 1;
			} else {
				receive += 1;
			}
			inBlockNumber.push(t.blockNumber)
			inBlockHash.push(t.blockHash)
		})
		return {
			count: trxData.length,
			transactionsSent: sent,
			transactionsReceive: receive,
			inBlockNumber: [...new Set(inBlockNumber)].sort(),
			inBlockHash: [...new Set(inBlockHash)].sort()
		}
	}
}

class TransactionsSingleton {
	constructor() {
		if (!TransactionsSingleton.instance) {
			TransactionsSingleton.instance = new Transactions()
		}
	}

	getInstance() {
		return TransactionsSingleton.instance
	}
}

module.exports = {
	TransactionsSingleton
}
