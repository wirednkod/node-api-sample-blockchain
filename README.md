# Build a service for querying a blockchain dataset.

Please clone the repo and push changes on a branch. When you think it's ready for review, submit a PR. Feel free to ask questions on here or ping us directly via e-mail. For technical discussions, we'd prefer having them on here.

## Datasets

Each CSV file contains a subset of blockchain historical data

* [Transactions](https://storage.googleapis.com/upvest-development-blockchain-dumps/data/eth-ropsten-transactions.csv) - ethereum-ropsten-history-transaction-staging.csv
  * key fields: blockNumber, blockHash, from/addresses, to
* [Blocks](https://storage.googleapis.com/upvest-development-blockchain-dumps/data/eth-ropsten-blocks.csv) - ethereum-ropsten-history-block-staging.csv
  * key fields: number, hash
* [ERC20 Smart contract balances](https://storage.googleapis.com/upvest-development-blockchain-dumps/data/eth-ropsten-erc20-balance.csv) - ethereum-ropsten-history-erc20-balance-staging.csv
  * key fields: transactionHash, transactionIndex, blockhash, blockNumber, address, contract  
* [Regular Ethereum balances](https://storage.googleapis.com/upvest-development-blockchain-dumps/data/eth-ropsten-eth-balance.csv) - ethereum-ropsten-history-eth-balance-staging.csv -
  * key fields: transactionHash, transactionIndex, blockhash, blockNumber, address

## Public API

* list all transactions with pagination (30 results per page)
* fetch a single transaction
* get the balance of a contract address, including ERC20 Smart contract balances
* list transactions occurring between x & Y dates
* fetch details for a single block 
* get the balance of an address
* fetch details of an address

API supports filtering and sorting results

## Bonus points

* Wrap the resulting code in a ready-to-deploy docker container which runs with docker-compose up
* Use [our live Ethereum endpoint](https://eth.mainnet.node.upvest.co/) instead of the provided CSV files to fetch recent data. 

### Review

Upvest will review your implementation considering the following criteria:

* Resilience (e.g. what happens if an error occurs?)
* Performance (e.g. are there bottlenecks that can be identified without even load testing the application?)
* Clarity (e.g. can I just open the project and get a good insight on the application structure? Is there clear intent in function names?)
* Security (e.g. are there ways that the public API could be abused?)
* Knowledge of the chosen language (e.g. do you demonstrate knowledge of core libraries, and idiomatic coding constructs?)
* Usage of dependencies (e.g. is it worth pulling in an entire package just for a single function?)
* Commit history (e.g. are commit messages clear? does each commit represent a unique and individual change?)

We expect the test task solution to be submitted in either Python, NodeJS/JavaScript, or Go. Tests and deployment strategy are much appreciated. Otherwise we have no other specific requirements and you are free in your design and implementation decisions. 

Comments which can help us understand your rationale are appreciated but not strictly necessary.

Any questions, feel free to ping us: pietro@upvest.co, yao@upvest.co
