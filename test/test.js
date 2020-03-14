const supertest = require("supertest");
const should = require("should");

const server = supertest.agent("http://localhost:8000");
const validTrxHash = '0x02372027d3a0a7a5458ffee04bb17f33ae722258212f23160e50b6b60ca0dc0f';
const invalidTrxHash = '0x02372027d3a0a7a5458ffee04bb17f33ae722258212f23160e50b6b60c0f';
const validIndex = '27';
const invalidIndex = '27a';
const validBlockHash = '0x0001f8a5cbade6892fde733c478f3cbf943b884eb5ad6ceef73cd6ec070d5c7f';
const invalidBlockHash = '0x0001f8a5cbade6892fde733c478f3cbf943b884eb5ad6ceef73cd6ec070d5c7';
const validBlockNumber = '6613639';
const invalidBlockNumber = '6613639a';
const validDates = [1571632274, 1571632290]
const invalidDates = ['1571632274a', '1571632290a']
const validAddress = '0x6590896988376a90326cb2f741cb4f8ace1882d5'
const invalidAddress = '0x665896988376a90326cb2f741cb4f8ace1882d'
const validContract = '0x14039994048f873dc5f86a32075669652b9f0fa7'
const invalidContract = '0x14039994048f873dc5f86a32075669652b9f0'

describe("Test Random Endpoints", () => {
	it("Random endpoint should return 404 not found", (done) => {
		server.get("/random").expect(404).end((err, res) => {
			res.status.should.equal(404);
			done();
		});
	});
});

// GetTransactionsList
describe("Test GetTransactionsList (/transaction/list/:page?) enpoint", () => {
	it("random page should return 30 items", (done) => {
		server.get("/transaction/list/" + Math.random(10)).expect(200)
			.end((err, res) => {
				res.body.success.should.equal(true);
				res.body.data.length.should.equal(30);
				done();
			});
	});

	it("with no page should return data from page 1", (done) => {
		server.get("/transaction/list/").expect(200)
			.end((err, res) => {
				res.body.success.should.equal(true);
				res.body.data.length.should.equal(30);
				res.body.data[0][''].should.equal[0]
				res.body.data[res.body.data.length - 1][''].should.equal[29]
				done();
			});
	});

	it("sorting by transaction index (asc) should return index 0", (done) => {
		server.get("/transaction/list/1?sortBy=transactionIndex&orderBy=asc").expect(200)
			.end((err, res) => {
				res.body.success.should.equal(true);
				res.body.data[0].transactionIndex.should.equal('0');
				done();
			});
	});

	it("sorting by transaction index (desc) should return index 99", (done) => {
		server.get("/transaction/list/1?sortBy=transactionIndex&orderBy=desc").expect(200)
			.end((err, res) => {
				res.body.success.should.equal(true);
				res.body.data[0].transactionIndex.should.equal('99');
				done();
			});
	});
});

// GetTransactionByHash
describe("Test GetTransactionByHash (/hash/:hash) enpoint", () => {
	it("with valid hash number should return 1 transaction", (done) => {
		server.get(`/transaction/hash/${validTrxHash}`).expect(200)
			.end((err, res) => {
				res.body.success.should.equal(true);
				res.body.data.hash.should.equal(validTrxHash);
				done();
			});
	});

	it("with invalid hash number should return error", (done) => {
		let hash = '0x02372027d3a0a7a5458ffee04bb17f33ae722258212f23160e50b6b60ca0dc0'
		server.get(`/transaction/hash/${invalidTrxHash}`).expect(400)
			.end((err, res) => {
				res.body.success.should.equal(false);
				res.body.message.should.equal("Hash provided is not in valid format");
				done();
			});
	});
});

// GetTransactionByBlockHashAndIndex
describe("Test GetTransactionByBlockHashAndIndex (/transaction/index/:index/blockhash/:blockhash) enpoint", () => {
	it("with valid index and blockhash should return success", (done) => {
		server.get(`/transaction/index/${validIndex}/blockhash/${validBlockHash}`).expect(200)
			.end((err, res) => {
				res.body.success.should.equal(true);
				res.body.data.blockHash.should.equal(validBlockHash);
				res.body.data.transactionIndex.should.equal(validIndex);
				done();
			});
	});

	it("with invalid index and valid blockhash should return error", (done) => {
		server.get(`/transaction/index/${invalidIndex}/blockhash/${validBlockHash}`).expect(400)
			.end((err, res) => {
				res.body.success.should.equal(false);
				res.body.message.should.equal('Index number provided is not in valid format.');
				done();
			});
	});

	it("with valid index and invalid blockhash should return error", (done) => {
		server.get(`/transaction/index/${validIndex}/blockhash/${invalidBlockHash}`).expect(400)
			.end((err, res) => {
				res.body.success.should.equal(false);
				res.body.message.should.equal('Block hash provided is not in valid format.');
				done();
			});
	});

	it("with invalid index and invalid blockhash should return error", (done) => {
		server.get(`/transaction/index/${invalidIndex}/blockhash/${invalidBlockHash}`).expect(400)
			.end((err, res) => {
				res.body.success.should.equal(false);
				res.body.message.should.equal('Index number provided is not in valid format.');
				done();
			});
	});
});

// GetTransactionByBlockNumberAndIndex
describe("Test GetTransactionByBlockNumberAndIndex (/transaction/index/:index/blocknumber/:blockno) enpoint", () => {
	it("with valid index and blocknumber should return success", (done) => {
		server.get(`/transaction/index/${validIndex}/blocknumber/${validBlockNumber}`).expect(200)
			.end((err, res) => {
				res.body.success.should.equal(true);
				res.body.data.blockNumber.should.equal(validBlockNumber);
				res.body.data.transactionIndex.should.equal(validIndex);
				done();
			});
	});

	it("with invalid index and valid blocknumber should return error", (done) => {
		server.get(`/transaction/index/${invalidIndex}/blocknumber/${validBlockNumber}`).expect(400)
			.end((err, res) => {
				res.body.success.should.equal(false);
				res.body.message.should.equal('Index or Block Number provided is not in valid format.');
				done();
			});
	});

	it("with valid index and invalid blocknumber should return error", (done) => {
		server.get(`/transaction/index/${validIndex}/blocknumber/${invalidBlockNumber}`).expect(400)
			.end((err, res) => {
				res.body.success.should.equal(false);
				res.body.message.should.equal('Index or Block Number provided is not in valid format.');
				done();
			});
	});

	it("with invalid index and invalid blocknumber should return error", (done) => {
		server.get(`/transaction/index/${invalidIndex}/blocknumber/${invalidBlockNumber}`).expect(400)
			.end((err, res) => {
				res.body.success.should.equal(false);
				res.body.message.should.equal('Index or Block Number provided is not in valid format.');
				done();
			});
	});
});

// GetTransactionByDates
describe("Test GetTransactionByDates (/transaction/:from/:to) enpoint", () => {
	it("with valid from and to timestamps should return success", (done) => {
		server.get(`/transaction/${validDates[0]}/${validDates[1]}`).expect(200)
			.end((err, res) => {
				res.body.success.should.equal(true);
				res.body.data.should.not.empty();
				done();
			});
	});

	it("with valid from and to timestamps but from later than to, should return error", (done) => {
		server.get(`/transaction/${validDates[1]}/${validDates[0]}`).expect(200)
			.end((err, res) => {
				res.body.success.should.equal(false);
				res.body.message.should.equal('FROM timestamp is in later time than TO timestamp');
				done();
			});
	});

	it("with invalid from and valid to timestamps should return error", (done) => {
		server.get(`/transaction/${invalidDates[0]}/${validDates[1]}`).expect(400)
			.end((err, res) => {
				res.body.success.should.equal(false);
				res.body.message.should.equal('Dates should be provided in timestamp format.');
				done();
			});
	});

	it("with valid from and invalid to timestamps should return error", (done) => {
		server.get(`/transaction/${invalidDates[0]}/${invalidDates[1]}`).expect(400)
			.end((err, res) => {
				res.body.success.should.equal(false);
				res.body.message.should.equal('Dates should be provided in timestamp format.');
				done();
			});
	});

	it("with invalid from and invalid to timestamps should return error", (done) => {
		server.get(`/transaction/${invalidDates[0]}/${invalidDates[1]}`).expect(400)
			.end((err, res) => {
				res.body.success.should.equal(false);
				res.body.message.should.equal('Dates should be provided in timestamp format.');
				done();
			});
	});
});

// GetTransactionByBlockNumberOrHash
describe("Test GetTransactionByBlockNumberOrHash Enpoints", () => {
	it("with valid blocknumber should return success", (done) => {
		server.get(`/block/${validBlockNumber}`).expect(200)
			.end((err, res) => {
				res.body.success.should.equal(true);
				res.body.data.number.should.equal(validBlockNumber);
				done();
			});
	});

	it("with valid blockhash should return success", (done) => {
		server.get(`/block/${validBlockHash}`).expect(200)
			.end((err, res) => {
				res.body.success.should.equal(true);
				let constructHash = '0x' + res.body.data.hash
				constructHash.should.equal(validBlockHash);
				done();
			});
	});

	it("with invalid blocknumber should return error", (done) => {
		server.get(`/block/${invalidBlockNumber}`).expect(400)
			.end((err, res) => {
				res.body.success.should.equal(false);
				res.body.message.should.equal('Hash provided is not in valid format');
				done();
			});
	});

	it("with invalid blockhash should return error", (done) => {
		server.get(`/block/${invalidBlockHash}`).expect(400)
			.end((err, res) => {
				res.body.success.should.equal(false);
				res.body.message.should.equal('Hash provided is not in valid format');
				done();
			});
	});
});

// GetAddressInfo
describe("Test GetAddressInfo Enpoints", () => {
	it("with valid Address should return success", (done) => {
		server.get(`/address/info/${validAddress}`).expect(200)
			.end((err, res) => {
				res.body.success.should.equal(true);
				res.body.data.type.should.equal('Address');
				done();
			});
	});

	it("with valid Contract should return success", (done) => {
		server.get(`/address/info/${validContract}`).expect(200)
			.end((err, res) => {
				res.body.success.should.equal(true);
				res.body.data.type.should.equal('Contract');
				done();
			});
	});

	it("with invalid address/contract number should return error", (done) => {
		server.get(`/block/${invalidAddress}`).expect(400)
			.end((err, res) => {
				res.body.success.should.equal(false);
				res.body.message.should.equal('Hash provided is not in valid format');
				done();
			});
	});
});

// GetContractBalance
describe("Test GetContractBalance Enpoints", () => {
	it("with valid Address and Contract should return success", (done) => {
		server.get(`/balance/contract/${validContract}/${validAddress}`).expect(200)
			.end((err, res) => {
				res.body.success.should.equal(true);
				res.body.data.eth.should.equal('2955396000000000027');
				res.body.data.erc20.should.equal('1958900000000');
				done();
			});
	});

	it("with invalid contract number should return error", (done) => {
		server.get(`/balance/contract/${invalidContract}/${validAddress}`).expect(400)
			.end((err, res) => {
				res.body.success.should.equal(false);
				res.body.message.should.equal('Contract is not in hash format');
				done();
			});
	});

	it("with invalid address number should return error", (done) => {
		server.get(`/balance/contract/${validContract}/${invalidAddress}`).expect(400)
			.end((err, res) => {
				res.body.success.should.equal(false);
				res.body.message.should.equal('Address is not in hash format');
				done();
			});
	});
});

// GetAddressBalance
describe("Test GetAddressBalance Enpoints", () => {
	it("with valid Address should return success", (done) => {
		server.get(`/balance/address/${validAddress}`).expect(200)
			.end((err, res) => {
				res.body.success.should.equal(true);
				res.body.data.balance.should.equal('2955396000000000027');
				done();
			});
	});

	it("with invalid contract number should return error", (done) => {
		server.get(`/balance/address/${invalidAddress}`).expect(400)
			.end((err, res) => {
				res.body.success.should.equal(false);
				res.body.message.should.equal('Address is not in hash format');
				done();
			});
	});
});
