// truffle migrate --f 3 --to 3 --network avax
// truffle run verify OlympusDAO OlympusBondingCalculator Distributor --network avax
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

  const epochLength = '150';
  const firstEpochNumber = '7808438';
  const firstEpochBlock = '7808443';
  const nextEpochBlock = '7808443';
  const ZERO = '0x0000000000000000000000000000000000000000';
  const largeApproval = '100000000000000000000000000000000';
  const initialMint = '10000000000000000000000000';

  green('MIM:  start');
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

  await deployer.deploy(_OlympusDAO);
  const OlympusDAO = await _OlympusDAO.deployed();
  await deployer.deploy(_OlympusBondingCalculator, OlympusERC20Token.address);
  const OlympusBondingCalculator = await _OlympusBondingCalculator.deployed();
  await deployer.deploy(_Distributor, OlympusTreasury.address, OlympusERC20Token.address, epochLength, nextEpochBlock);
  const Distributor = await _Distributor.deployed();


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

};

