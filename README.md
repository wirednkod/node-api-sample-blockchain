# Α service for querying a blockchain dataset (CSV Files).
- Using NodeJS, Express, Nodemon (hot reload), Lodash
- Including tests with Mocha

## Initial setup
> npm install : `installs all needed packages for api to run`
>
> npm run dev : `starts the api in development mode with hot reload`
> 
> npm start : `starts the api in prod mode`
> 
> npm run test : `runs all mocka tests`


## Datasets
Each CSV file contains a subset of blockchain historical data

#### Transactions
> key fields: `blockNumber, blockHash, from/addresses, to`
#### Blocks
> key fields: `number, hash`
#### ERC20 Smart contract balances
> key fields: `transactionHash, transactionIndex, blockhash, blockNumber, address, contract`
#### Regular Ethereum balances
> key fields: `transactionHash, transactionIndex, blockhash, blockNumber, address`

## Public API

> ### list all transactions with pagination (30 results per page)

{GET} `/transaction/list/:page_number?`

`Extra Info:` If page number is empty, invalid (e.g. negative number or 0) or higher than the available pages that exist, then API redirects to 1 or last page number
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

`Extra Info:` Get single transaction by hash number
```
Input:
  - Hash string
  
Returns:
  - data Object of transaction found for specific hash
```

{GET} `/transaction/index/:index/blockhash/:blockhash`

`Extra Info:` Get single transaction by index and blockhash numbers
```
Input:
  - Index number
  - Block Hash string
  
Returns:
  - data Object of transaction found for specific hash
```

{GET} `/transaction/index/:index/blocknumber/:blockno`

`Extra Info:` Get single transaction by index and block numbers
```
Input:
  - Index number
  - Block Number number
  
Returns:
  - data Object of transaction found for specific hash
```
------

> ### Get the balance of a contract address, including ERC20 Smart contract balances
{GET} `/balance/:contract/:address`

```
Input:
  - Contract hash string
  - Address hash string
  
Returns:
  - object containing eth and erc20 balances
```
------
> ### List transactions occurring between x & Y dates
{GET} `/transactions/:from/:to`

```
Input:
  - From timestamp
  - To timestamp
  
Returns:
  - data Array of transactions found for specific dates
```
------
> ### Fetch details for a single block 
{GET} `/block/:input`

```
Input:
  - Hash string or Block number
  
Returns:
  - data Object of data found for given block hash/number
```
------
> ### Get the balance of an address
{GET} `/balance/address/:address`

```
Input:
  - Hash string
  
Returns:
  - object with info concerning the address
```
------
> ### Fetch details of an address
{GET} `/address/info/:address`

```
Input:
  - Hash string
  
Returns:
  - object with info concerning the address
```