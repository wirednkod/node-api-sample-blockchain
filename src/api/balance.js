const express = require('express')
const balanceRouter = express.Router()
const { hashValidator, getBalanceByAddress } = require('../utils/helper')
const { EthSingleton } = require('../utils/Eth')
const { Erc20Singleton } = require('../utils/Erc20')

const ethInstance = new EthSingleton().getInstance()
const erc20Instance = new Erc20Singleton().getInstance()
/**
 * @api {get} /balance/:contract/:address - fetch details for balance of address
 * @apiName GetContractBalance
 * @apiGroup Balance
 *
 * @apiParam {String} contract hash
 * @apiParam {String} address hash
 *
 * @apiSuccess {object} object containing eth and erc20 balances
 */
balanceRouter.get('/contract/:contract/:address', (req, res) => {
	let status = 200
	if (!ethInstance.end || !erc20Instance.end) {
		res.status(status).send({ success: true, data: global.loadingMessage })
		return
	}
	let { address, contract } = req.params
	hashValidator(contract, 'Contract is not in hash format', false)
	hashValidator(address, 'Address is not in hash format', false)
	let eth = getBalanceByAddress(ethInstance.data, address)
	let erc = getBalanceByAddress(erc20Instance.data, contract, 'contract')
	res.status(status).send({
		success: true,
		data: { 'eth': eth, 'erc20': erc }
	})
})

/**
 * @api {get} /balance/address/:address - fetch details for balance of address
 * @apiName GetAddressBalance
 * @apiGroup Balance
 *
 * @apiParam {String} hash
 *
 * @apiSuccess {Number} number balance for contract
 */
balanceRouter.get('/address/:address', (req, res) => {
	let status = 200
	if (!ethInstance.end) {
		res.status(status).send({ success: true, data: global.loadingMessage })
		return
	}
	let { address } = req.params
	hashValidator(address, 'Address is not in hash format', false)
	res.status(status).send({
		success: true,
		data: {
			balance: getBalanceByAddress(ethInstance.data, address)
		}
	})
})

module.exports = balanceRouter
