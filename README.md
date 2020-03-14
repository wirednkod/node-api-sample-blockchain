# Α service for querying a blockchain dataset (CSV Files).

### Initial setup
    npm install
        installs all needed packages for api to run
    npm run dev
        starts the api in development mode with hot reload
    npm start 
        starts the api in prod mode

## Datasets
Each CSV file contains a subset of blockchain historical data

* Transactions
  * key fields: blockNumber, blockHash, from/addresses, to
* Blocks
  * key fields: number, hash
* ERC20 Smart contract balances
  * key fields: transactionHash, transactionIndex, blockhash, blockNumber, address, contract  
* Regular Ethereum balances
  * key fields: transactionHash, transactionIndex, blockhash, blockNumber, address

## Public API

> ### list all transactions with pagination (30 results per page)

{GET} `/transaction/list/:page_number?`

`Description:` list all transactions with pagination (30 results per page). If page number is empty, invalid (e.g. negative number or 0) or higher the available pages that exist then it redirects to closed page number
```
Input:
  - page_number
  - sortBy (values: 'blockHash', 'blockNumber', 'from', 'to', 'hash', 'transactionIndex') [Optional]
  -	orderBy (possible values: 'asc', 'desc')  [Optional]

Returns:
  - Array of transaction objects found for specific page provided.
```

------
> ### Fetch a single transaction

{GET} `/hash/:hash`

`Description:` 
```
Input:
  - Hash string
  
Returns:
  - data Object of transaction found for specific hash
```

/**
 * @api {get} /transaction/hash/:hash
 * @apiName GetTransactionByHash
 * @apiGroup Transactions
 *
 * @apiParam {String} 
 *
 * @apiSuccess {Object} 
 */
transactionRouter.get('', (req, res) => {



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
------
> ### Get the balance of a contract address, including ERC20 Smart contract balances
------
> ### List transactions occurring between x & Y dates
------
> ### Fetch details for a single block 
------
> ### Get the balance of an address
------
> ### Fetch details of an address