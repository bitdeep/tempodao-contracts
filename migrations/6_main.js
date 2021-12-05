// truffle migrate --f 6 --to 6 --network avax
const _OlympusERC20Token = artifacts.require("OlympusERC20Token");
const _sOlympus = artifacts.require("sOlympus");
const _OlympusStaking = artifacts.require("OlympusStaking");
const _StakingHelper = artifacts.require("StakingHelper");
const _OlympusTreasury = artifacts.require("OlympusTreasury");
const _MIM = artifacts.require("DAI");
const _StakingWarmup = artifacts.require("StakingWarmup");
const _OlympusDAO = artifacts.require("OlympusDAO");
const _OlympusBondingCalculator = artifacts.require("OlympusBondingCalculator");
const _OlympusBondDepository = artifacts.require("OlympusBondDepository");
const _Distributor = artifacts.require("Distributor");
const _OHMCirculatingSupplyContract = artifacts.require("OHMCirculatingSupplyContract");
const _RedeemHelper = artifacts.require("RedeemHelper");

const chalk = require('chalk');
let _yellowBright = chalk.yellowBright;
let _magenta = chalk.magenta;
let _cyan = chalk.cyan;
let _yellow = chalk.yellow;
let _red = chalk.red;
let _blue = chalk.blue;
let _green = chalk.green;

function yellow() {
  console.log(_yellow(...arguments));
}

function red() {
  console.log(_red(...arguments));
}

function green() {
  console.log(_green(...arguments));
}

function blue() {
  console.log(_blue(...arguments));
}

function cyan() {
  console.log(_cyan(...arguments));
}

function magenta() {
  console.log(_magenta(...arguments));
}


module.exports = async function (deployer, network, accounts) {

  green('main account: '+accounts);

  const epochLength = '28800';
  const firstEpochNumber = '7808438';
  const firstEpochBlock = '7808443';
  const nextEpochBlock = '7808443';
  const ZERO = '0x0000000000000000000000000000000000000000';
  const largeApproval = '100000000000000000000000000000000';
  const initialMint = '10000000000000000000000000';

  green('MIM: start');
  let MIM_Contract;
  let MIM = '0x130966628846bfd36ff31a822705796e8cb8c18d'; // movr
  if (network == 'dev') {
    MIM_Contract = await _MIM.deployed();
    MIM = MIM_Contract.address;
  } else if (network == 'ftm') {
    MIM = '0x8d11ec38a3eb5e956b052f67da8bdc9bef8abf3e'; // ftm
  }
  const OlympusERC20Token = await _OlympusERC20Token.at('0x88a425b738682f58C0FF9fcF2CceB47a361ef4cF');
  const sOlympus = await _sOlympus.deployed();
  const OlympusStaking = await _OlympusStaking.deployed();
  const StakingHelper = await _StakingHelper.deployed();
  const OlympusTreasury = await _OlympusTreasury.deployed();
  const StakingWarmup = await _StakingWarmup.deployed();

  const OlympusDAO = await _OlympusDAO.deployed();
  const OlympusBondingCalculator = await _OlympusBondingCalculator.deployed();
  const Distributor = await _Distributor.deployed();

  const OHMCirculatingSupplyContract = await _OHMCirculatingSupplyContract.deployed();
  const OlympusBondDepository = await _OlympusBondDepository.deployed();

  const RedeemHelper = await _RedeemHelper.deployed();

  green('OlympusTreasury OlympusBondingCalculator');
  await OlympusTreasury.queue('4', OlympusBondingCalculator.address)
  await OlympusTreasury.toggle('4', OlympusBondingCalculator.address, ZERO)
  await OlympusTreasury.queue('8', OlympusBondingCalculator.address)
  await OlympusTreasury.toggle('8', OlympusBondingCalculator.address, ZERO)

  green('OlympusTreasury Distributor');
  await OlympusTreasury.queue('8', Distributor.address)
  await OlympusTreasury.toggle('8', Distributor.address, ZERO)


  green('OlympusTreasury sOHM');
  await OlympusTreasury.queue('9', sOlympus.address)
  await OlympusTreasury.toggle('9', sOlympus.address, ZERO)

  magenta("CONTRACTS")
  green("- MIM: " + MIM);
  green("- OlympusERC20Token: " + OlympusERC20Token.address);
  green("- sOlympus: " + sOlympus.address);
  green("- OlympusStaking: " + OlympusStaking.address);
  green("- StakingHelper: " + StakingHelper.address);
  green("- OlympusTreasury: " + OlympusTreasury.address);
  green("- StakingWarmup: " + StakingWarmup.address);
  green("- OlympusDAO: " + OlympusDAO.address);
  green("- OlympusBondingCalculator: " + OlympusBondingCalculator.address);
  green("- Distributor: " + Distributor.address);
  green("- OHMCirculatingSupplyContract: " + OHMCirculatingSupplyContract.address);
  green("- OlympusBondDepository: " + OlympusBondDepository.address);
  green("- RedeemHelper: " + RedeemHelper.address);

};

