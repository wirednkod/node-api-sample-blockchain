const bodyparser = require('body-parser')
const express = require('express')
const helmet = require('helmet')
const { config } = require('./config')
const { handleError } = require('./utils/error')
const { bootstrap } = require('./utils/helper')
const app = express()
const balanceRouter = require('./api/balance')
const transactionRouter = require('./api/transaction')
const basicRouter = require('./api/routes')

// setup global vars for access of data across
global.loadingMessage = 'CSV data are still loading please retry in a few seconds.'

app.use(helmet())
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: false }))

app.use('/balance', balanceRouter)
app.use('/transaction', transactionRouter)
app.use('/', basicRouter)
app.use((err, req, res, next) => {
	res.status(err.statusCode).send({
		success: false,
		statusCode: err.statusCode && err.statusCode.toString(),
		message: err.message && err.message.toString()
	})
})

app.listen(config.port, err => {
	if (err) {
		console.log(`Server had an error: ${err}`)
		return
	}
	console.log(`###########################`)
	console.log(`Server started -- port ${config.port}`)
	console.log(`###########################\n`)
})
