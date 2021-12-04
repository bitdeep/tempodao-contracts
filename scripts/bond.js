const ctx = artifacts.require("OlympusBondDepository");
const ethers = require('ethers');
module.exports = async function (deployer) {
  const bond = '0xe5EAeb3987720eAc967924Cc56d212464A419d30';
  const dai = '0x8d11ec38a3eb5e956b052f67da8bdc9bef8abf3e';
  const cli = await ctx.at(bond);
  const amount = '1000000000000000000';
  const maxPrice = '12060';
  const depositor = '0x6623774c883af9f12e223503594bc3b672a2decb';
  await cli.deposit(amount, maxPrice, depositor);
  process.exit(0);
};
