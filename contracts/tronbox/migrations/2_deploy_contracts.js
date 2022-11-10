var TRC721Token = artifacts.require("./TRC721Token.sol");
var Migrations = artifacts.require("./Migrations.sol");

module.exports = function (deployer) {
  deployer.deploy(TRC721Token);
  deployer.deploy(Migrations);
};
