class Eth {
  constructor() {
    this.data = [];
    this.end = false;
  }
}

class EthSingleton {
  constructor() {
    if (!EthSingleton.instance) {
      EthSingleton.instance = new Eth()
    }
  }

  getInstance() {
    return EthSingleton.instance
  }
}

module.exports = {
  EthSingleton
}
