const Pawnchain = artifacts.require("./build/contracts/Pawnchain");

module.exports = function(deployer) {
  deployer.deploy(Pawnchain);
};
