// .env params
const dotenv = require('dotenv')
dotenv.config()

/**
 * configuration for demo API
 * csv_dir contains the data from url for easier access
 * csv_urls is the location of the datasets
 */
const config = {
  port: process.env.PORT || 8000,
  csv_dir: './csv_files',
  csv_urls: [
    'http://www.emmaf.org/csv_files/transactions.csv',
    'http://www.emmaf.org/csv_files/blocks.csv',
    'http://www.emmaf.org/csv_files/erc20.csv',
    'http://www.emmaf.org/csv_files/eth.csv'
  ]
}

module.exports = { config }
