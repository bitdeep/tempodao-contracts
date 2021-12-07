require('dotenv').config();
// truffle migrate --f 7 --to 7 --network avax
// truffle run verify  --network avax
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

  green('MIM: start');
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

  const OHMCirculatingSupplyContract = await _OHMCirculatingSupplyContract.deployed();
  const OlympusBondDepository = await _OlympusBondDepository.deployed();

  const RedeemHelper = await _RedeemHelper.deployed();

  green('OlympusTreasury Distributor');
  await OlympusStaking.setContract('1', StakingWarmup.address);
  await OlympusStaking.setContract('0', Distributor.address);


  green('OlympusTreasury OlympusStaking 1');
  yellow('\tsOlympus='+sOlympus.address);
  yellow('\tOlympusStaking='+OlympusStaking.address);
  await sOlympus.initialize(OlympusStaking.address);
  green('OlympusTreasury OlympusStaking 2');
  await sOlympus.setIndex('1000000000');
  green('OlympusTreasury OlympusStaking 3');
  if( process.env.DEPLOY_MINT_TOKENS ) {
    await OlympusERC20Token.setVault(accounts[0]);
    await OlympusERC20Token.mint(accounts[0], process.env.DEPLOY_MINT_TOKENS);
  }
  await OlympusERC20Token.setVault(OlympusTreasury.address);


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

