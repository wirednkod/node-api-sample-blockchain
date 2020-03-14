class Blocks {
	constructor() {
		this.data = [];
		this.end = false;
	}
}

class BlocksSingleton {
	constructor() {
		if (!BlocksSingleton.instance) {
			BlocksSingleton.instance = new Blocks
		}
	}

	getInstance() {
		return BlocksSingleton.instance
	}
}

module.exports = {
	BlocksSingleton
}
