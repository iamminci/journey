var TRC721Token = artifacts.require("./TRC721Token.sol");

module.exports = function (deployer) {
  deployer.deploy(TRC721Token);
};
