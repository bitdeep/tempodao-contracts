// truffle migrate --f 8 --to 8 --network avax
// truffle run verify OlympusBondDepository --network avax
const _OlympusERC20Token = artifacts.require("OlympusERC20Token");
const _StakingHelper = artifacts.require("StakingHelper");
const _OlympusTreasury = artifacts.require("OlympusTreasury");
const _OlympusDAO = artifacts.require("OlympusDAO");
const _OlympusBondDepository = artifacts.require("OlympusBondDepository");
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

  const PRINCIPAL = '0x4145FBe0ED36A9d2D7a055c31C1C897602Bbb568';

  green('PRINCIPAL: '+PRINCIPAL);
  const ZERO = '0x0000000000000000000000000000000000000000';
  let OlympusERC20Token;
  if( ! process.env.DEPLOY_USE_TOKEN ){
    OlympusERC20Token = await _OlympusERC20Token.deployed();
  }else{
    OlympusERC20Token = await _OlympusERC20Token.at(process.env.DEPLOY_USE_TOKEN);
  }
  const StakingHelper = await _StakingHelper.deployed();
  const OlympusTreasury = await _OlympusTreasury.deployed();
  const OlympusDAO = await _OlympusDAO.deployed();


  yellow('create bond contract...');
  await deployer.deploy(_OlympusBondDepository, OlympusERC20Token.address, PRINCIPAL, OlympusTreasury.address, OlympusDAO.address, ZERO);
  const controlVariable = '5',
        vestingTerm = '100',
        minimumPrice = '1000',
        maxPayout = '1000',
        fee = '10000',
        maxDebt = '1000000000000000', initialDebt = '0';
  const OlympusBondDepository = await _OlympusBondDepository.deployed();
  yellow('initializeBondTerms...');
  await OlympusBondDepository.initializeBondTerms(controlVariable, vestingTerm, minimumPrice, maxPayout, fee, maxDebt, initialDebt);
  yellow('setStaking...');
  await OlympusBondDepository.setStaking(StakingHelper.address, true);

  yellow('add bond contract to redeem helper...');
  const RedeemHelper = await _RedeemHelper.deployed();
  await RedeemHelper.addBondContract(OlympusBondDepository.address);

  yellow('add liquidity token...');
  await OlympusTreasury.queue('2', PRINCIPAL)
  await OlympusTreasury.toggle('2', PRINCIPAL, ZERO)

  yellow('set treasure permissions...');
  await OlympusTreasury.queue('0', OlympusBondDepository.address)
  await OlympusTreasury.toggle('0', OlympusBondDepository.address, ZERO)
  await OlympusTreasury.queue('4', OlympusBondDepository.address)
  await OlympusTreasury.toggle('4', OlympusBondDepository.address, ZERO)

  yellow('done.');
};

