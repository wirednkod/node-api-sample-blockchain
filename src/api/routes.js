const express = require('express')
const basicRouter = express.Router()
const { ErrorHandler } = require('../utils/error')
const { TransactionsSingleton } = require('../utils/Transactions')
const { BlocksSingleton } = require('../utils/Blocks')
const { EthSingleton } = require('../utils/Eth')
const { Erc20Singleton } = require('../utils/Erc20')
const {
	numberValidator,
	hashValidator,
	addressInfo
} = require('../utils/helper')

const trxInstance = new TransactionsSingleton().getInstance()
const blocksInstance = new BlocksSingleton().getInstance()
const ethInstance = new EthSingleton().getInstance()
const erc20Instance = new Erc20Singleton().getInstance()

/**
 * @api {get} /block/:input - fetch details for a single block getBlockByHashOrNumber
 * @apiName GetTransactionByBlockNumberOrHash
 * @apiGroup Blocks
 *
 * @apiParam {Number} Hash or Block number
 *
 * @apiSuccess {Object} data Object of data found for given block hash/number
 */
basicRouter.get('/block/:input', (req, res) => {
	let status = 200
	if (!blocksInstance.end) {
		res.status(status).send({ success: true, data: global.loadingMessage })
		return
	}
	let { input } = req.params
	let type
	let valid = /^\d+$/.test(input)
	if (valid) {
		numberValidator(input)
		type = 'number'
	} else {
		hashValidator(input)
		type = 'hash'
	}
	let block = blocksInstance.data.filter(b => b[type] === input)
	let resp = block.length > 0 ? JSON.parse(block[0].payload) : []
	res.status(status).send({
		success: true,
		data: resp
	})
})

/**
 * @api {get} /address/info/:address - fetch details for address
 * @apiName GetAddressInfo
 * @apiGroup Address
 *
 * @apiParam {String} hash
 *
 * @apiSuccess {Object} object with info concerning the address
 */
basicRouter.get('/address/info/:address', (req, res) => {
	let status = 200
	if (!ethInstance.end || !erc20Instance.end || !trxInstance.end) {
		res.status(status).send({ success: true, data: global.loadingMessage })
		return
	}
	let { address } = req.params
	hashValidator(address, 'Address is not in hash format', false)
	let tmp = addressInfo(address)
	res.status(status).send({
		success: true,
		data: tmp
	})
})

basicRouter.get('*', (req, res) => {
	throw new ErrorHandler(404, 'Requested endpoint was not found')
})

module.exports = basicRouter
