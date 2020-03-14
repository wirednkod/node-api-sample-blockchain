const express = require('express')
const transactionRouter = express.Router()
const { ErrorHandler } = require('../utils/error')
const { TransactionsSingleton } = require('../utils/Transactions')
const { BlocksSingleton } = require('../utils/Blocks')
const {
	numberValidator,
	datesValidator,
	hashValidator
} = require('../utils/helper')

const typesOfSorting = [
	'blockHash', 'blockNumber', 'from', 'to', 'hash', 'transactionIndex'
]
const typesOfOrdering = ['asc', 'desc']

const trxInstance = new TransactionsSingleton().getInstance()
const blocksInstance = new BlocksSingleton().getInstance()

/**
 * @api {get} /transaction/list/:page_number? - list all transactions with pagination (30 results per page). If page number is empty, invalid (e.g. negative number or 0) or higher the available pages that exist then it redirects to closed page number
 * Optional query params (both must be provided):
 *      sortBy (possible values: 'blockHash', 'blockNumber', 'from', 'to', 'hash', 'transactionIndex')
 * 			orderBy (possible values: 'asc', 'desc')
 * @apiName GetTransactionsList
 * @apiGroup Transactions
 *
 * @apiParam {Number} id Users unique ID.
 *
 * @apiSuccess {Array} data Array of transactions objects found for specific page provided.
 */
transactionRouter.get('/list/:page_number?', (req, res) => {
	let status = 200
	if (!trxInstance.end) {
		res.status(status).send({ success: true, data: global.loadingMessage })
		return
	}
	let sortBy
	let orderBy
	if (req.query.sortBy &&
		typesOfSorting.includes(req.query.sortBy) &&
		req.query.orderBy &&
		typesOfOrdering.includes(req.query.orderBy)) {
		sortBy = req.query.sortBy
		orderBy = req.query.orderBy
	}
	let { page_number } = req.params
	res.status(status).send({
		success: true,
		data: trxInstance.getPagination(page_number, sortBy, orderBy)
	})
})

/**
 * @api {get} /transaction/hash/:hash
 * @apiName GetTransactionByHash
 * @apiGroup Transactions
 *
 * @apiParam {String} Hash string
 *
 * @apiSuccess {Object} data Object of transaction found for specific hash
 */
transactionRouter.get('/hash/:hash', (req, res) => {
	let status = 200
	if (!trxInstance.end) {
		res.status(status).send({ success: true, data: global.loadingMessage })
		return
	}
	let { hash } = req.params
	hashValidator(hash)
	res.status(status).send({
		success: true,
		data: trxInstance.filterHash(hash)
	})
})

/**
 * @api {get} /transaction/index/:index/blockhash/:blockhash
 * @apiName GetTransactionByBlockHashAndIndex
 * @apiGroup Transactions
 *
 * @apiParam {Number} Index number
 * @apiParam {String} Hash string
 *
 * @apiSuccess {Object} data Object of transaction found for specific hash
 */
transactionRouter.get('/index/:index/blockhash/:blockhash', (req, res) => {
	let status = 200
	if (!trxInstance.end) {
		res.status(status).send({ success: true, data: global.loadingMessage })
		return
	}
	let { index, blockhash } = req.params
	numberValidator(index, 'Index number provided is not in valid format.')
	hashValidator(blockhash, 'Block hash provided is not in valid format.')
	res.status(status).send({
		success: true,
		data: trxInstance.filterHashAndIndex(index, blockhash)
	})
})

/**
 * @api {get} /transaction/index/:index/blocknumber/:blockno
 * @apiName GetTransactionByBlockNumberAndIndex
 * @apiGroup Transactions
 *
 * @apiParam {Number} Index number
 * @apiParam {Number} Block number
 *
 * @apiSuccess {Object} data Object of transaction found for specific hash
 */
transactionRouter.get('/index/:index/blocknumber/:blockno', (req, res) => {
	let status = 200
	if (!trxInstance.end) {
		res.status(status).send({ success: true, data: global.loadingMessage })
		return
	}
	let { index, blockno } = req.params
	numberValidator([index, blockno], 'Index or Block Number provided is not in valid format.')
	res.status(status).send({
		success: true,
		data: trxInstance.filterNoAndIndex(index, blockno)
	})
})

/**
 * @api {get} /transactions/:from/:to - fetch transactions by dates
 * @apiName GetTransactionByDates
 * @apiGroup Transactions
 *
 * @apiParam {Number} From timestamp
 * @apiParam {Number} To timestamp
 *
 * @apiSuccess {Array} data Array of transactions found for specific dates
 */
transactionRouter.get('/:from/:to', (req, res) => {
	let status = 200
	if (!trxInstance.end) {
		res.status(status).send({ success: true, data: global.loadingMessage })
		return
	}
	let { from, to } = req.params
	datesValidator(from, to)
	let transactionsFound = [];
	blocksInstance.data.forEach(block => {
		let { transactions, timestamp } = JSON.parse(block.payload);
		let blockTimestamp = parseInt('0x' + timestamp);
		if (blockTimestamp >= from && blockTimestamp <= to) {
			transactionsFound.push(...transactions);
		}
	})
	res.status(status).send({
		success: true,
		data: {
			fromDate: from,
			toDate: to,
			transactions: transactionsFound.map(f => '0x' + f)
		}
	})
})

transactionRouter.get('/*', (req, res) => {
	throw new ErrorHandler(404, 'Requested endpoint was not found')
})

module.exports = transactionRouter
