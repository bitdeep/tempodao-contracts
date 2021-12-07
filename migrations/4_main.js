require('dotenv').config();
// truffle migrate --f 4 --to 4 --network avax
// truffle run verify OlympusBondDepository OHMCirculatingSupplyContract --network avax
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

  const ZERO = '0x0000000000000000000000000000000000000000';

  green('MIM:  start');
  let MIM_Contract;
  let MIM = process.env.BOND; // movr
  if (network == 'dev') {
    MIM_Contract = await _MIM.deployed();
    MIM = MIM_Contract.address;
  } else if (network == 'ftm') {
    MIM = '0x8d11ec38a3eb5e956b052f67da8bdc9bef8abf3e'; // ftm
  }
  let OlympusERC20Token;
  if( ! process.env.DEPLOY_USE_TOKEN ){
    OlympusERC20Token = await _OlympusERC20Token.deployed();
  }else{
    OlympusERC20Token = await _OlympusERC20Token.at(process.env.DEPLOY_USE_TOKEN);
  }
  const sOlympus = await _sOlympus.deployed();
  const OlympusStaking = await _OlympusStaking.deployed();
  const StakingHelper = await _StakingHelper.deployed();
  const OlympusTreasury = await _OlympusTreasury.deployed();
  const StakingWarmup = await _StakingWarmup.deployed();

  const OlympusDAO = await _OlympusDAO.deployed();
  const OlympusBondingCalculator = await _OlympusBondingCalculator.deployed();
  const Distributor = await _Distributor.deployed();

  await deployer.deploy(_OHMCirculatingSupplyContract, accounts[0]);
  const OHMCirculatingSupplyContract = await _OHMCirculatingSupplyContract.deployed();
  await OHMCirculatingSupplyContract.initialize(OlympusERC20Token.address);
  await OHMCirculatingSupplyContract.setNonCirculatingOHMAddresses([OlympusDAO.address]);
  await Distributor.distribute();

  await deployer.deploy(_OlympusBondDepository, OlympusERC20Token.address, MIM, OlympusTreasury.address, OlympusDAO.address, ZERO);
  const controlVariable = '5',
        vestingTerm = process.env.DEPLOY_BOND_VESTING_TERM,
        minimumPrice = process.env.DEPLOY_BOND_PRICE,
        maxPayout = process.env.DEPLOY_REWARD_PCT,
        fee = process.env.DEPLOY_BOND_FEE,
        maxDebt = process.env.DEPLOY_BOND_MAX_DEBIT,
        initialDebt = '0';
  const OlympusBondDepository = await _OlympusBondDepository.deployed();
  await OlympusBondDepository.initializeBondTerms(controlVariable,
    vestingTerm, minimumPrice, maxPayout, fee, maxDebt, initialDebt);
  await OlympusBondDepository.setBondTerms('1', '1000');
  await OlympusBondDepository.setStaking(StakingHelper.address, true);

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

};

