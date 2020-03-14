class Erc20 {
  constructor() {
    this.data = [];
    this.end = false;
  }
}

class Erc20Singleton {
  constructor() {
    if (!Erc20Singleton.instance) {
      Erc20Singleton.instance = new Erc20()
    }
  }

  getInstance() {
    return Erc20Singleton.instance
  }
}

module.exports = {
  Erc20Singleton
}
