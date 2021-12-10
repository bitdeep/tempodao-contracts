require('dotenv').config();
// truffle migrate --f 1 --to 1 --network avax
// truffle run verify OlympusERC20Token sOlympus OlympusStaking --network avax
const _OlympusERC20Token = artifacts.require("OlympusERC20Token");
const _sOlympus = artifacts.require("sOlympus");
const _OlympusStaking = artifacts.require("OlympusStaking");
const _MIM = artifacts.require("DAI");

const chalk = require('chalk');
const yellow = function() { console.log(chalk.yellowBright(...arguments)) }
const magenta = function() { console.log(chalk.magenta(...arguments)) }
const cyan = function() { console.log(chalk.cyan(...arguments)) }
const red = function() { console.log(chalk.red(...arguments)) }
const blue = function() { console.log(chalk.blue(...arguments)) }
const green = function() { console.log(chalk.green(...arguments)) }


module.exports = async function (deployer, network, accounts) {

  green('main account: '+accounts);

  const epochLength = process.env.DEPLOY_EPOCH;
  const firstEpochNumber = process.env.DEPLOY_FIRST_EPOCH_FIRST;
  const firstEpochBlock = process.env.DEPLOY_FIRST_EPOCH_BLOCK;

  green('MIM:  start');
  let MIM_Contract;
  let MIM = process.env.BOND; // movr
  if (network == 'dev') {
    await deployer.deploy(_MIM, '1337');
    MIM_Contract = await _MIM.deployed();
    MIM = MIM_Contract.address;
    const CEM = web3.utils.toWei('100');
    await MIM_Contract.mint(accounts[0], CEM);
  } else if (network == 'ftm') {
    MIM = '0x8d11ec38a3eb5e956b052f67da8bdc9bef8abf3e'; // ftm
    MIM_Contract = await _MIM.at(MIM);
  } else {
    MIM_Contract = await _MIM.at(MIM);
  }
  yellow('MIM:  end');

  green('OlympusERC20Token: start');
  let OlympusERC20Token;
  if( ! process.env.DEPLOY_USE_TOKEN || network == 'dev' ){
    await deployer.deploy(_OlympusERC20Token);
    OlympusERC20Token = await _OlympusERC20Token.deployed();
  }else{
    OlympusERC20Token = await _OlympusERC20Token.at(process.env.DEPLOY_USE_TOKEN);
  }
  yellow('OlympusERC20Token: end');

  green('sOlympus: start');
  await deployer.deploy(_sOlympus);
  const sOlympus = await _sOlympus.deployed();
  yellow('sOlympus: end');

  green('OlympusStaking: start');
  await deployer.deploy(_OlympusStaking,
    OlympusERC20Token.address,
    sOlympus.address,
    epochLength,
    firstEpochNumber,
    firstEpochBlock);
  const OlympusStaking = await _OlympusStaking.deployed();
  yellow('OlympusStaking: end');

  magenta("CONTRACTS")
  green("- MIM: " + MIM);
  green("- OlympusERC20Token: " + OlympusERC20Token.address);
  green("- sOlympus: " + sOlympus.address);
  green("- OlympusStaking: " + OlympusStaking.address);

};

