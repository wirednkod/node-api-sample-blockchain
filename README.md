# Α service for querying a blockchain dataset (CSV Files).

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

* list all transactions with pagination (30 results per page)
* fetch a single transaction
* get the balance of a contract address, including ERC20 Smart contract balances
* list transactions occurring between x & Y dates
* fetch details for a single block 
* get the balance of an address
* fetch details of an address