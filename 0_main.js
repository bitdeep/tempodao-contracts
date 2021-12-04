// truffle migrate --f 2 --to 2 --network dev
const _OlympusERC20Token = artifacts.require("OlympusERC20Token");
const _sOlympus = artifacts.require("sOlympus");
const _OlympusStaking = artifacts.require("OlympusStaking");
const _StakingHelper = artifacts.require("StakingHelper");
const _OlympusTreasury = artifacts.require("OlympusTreasury");
const _DAI = artifacts.require("DAI");
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
  const firstEpochNumber = '0';
  const firstEpochBlock = '899594';
  const nextEpochBlock = '899595';
  const ZERO = '0x0000000000000000000000000000000000000000';
  const largeApproval = '100000000000000000000000000000000';
  const initialMint = '10000000000000000000000000';

  green('DAY: start');
  let DAI_d;
  let DAI = '0x80a16016cc4a2e6a2caca8a4a498b1699ff0f844'; // movr
  if (network == 'dev') {
    await deployer.deploy(_DAI, '1337');
    DAI_d = await _DAI.deployed();
    DAI = DAI_d.address;
    const CEM = web3.utils.toWei('100');
    await DAI_d.mint(accounts[0], CEM);
  } else if (network == 'ftm') {
    DAI = '0x8d11ec38a3eb5e956b052f67da8bdc9bef8abf3e'; // ftm
    DAI_d = await _DAI.at(DAI);
  } else {
    DAI_d = await _DAI.at(DAI);
  }
  yellow('DAY: end');

  green('OlympusERC20Token: start');
  await deployer.deploy(_OlympusERC20Token);
  const OlympusERC20Token = await _OlympusERC20Token.deployed();
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

  green('StakingHelper: start');
  await deployer.deploy(_StakingHelper,
    OlympusStaking.address,
    OlympusERC20Token.address);
  const StakingHelper = await _StakingHelper.deployed();
  yellow('StakingHelper: end');

  green('OlympusTreasury: start');
  const blocksNeededForQueue = 0; // timelock
  await deployer.deploy(_OlympusTreasury,
    OlympusStaking.address,
    DAI, blocksNeededForQueue);
  const OlympusTreasury = await _OlympusTreasury.deployed();
  yellow('OlympusTreasury: end');

  green('StakingWarmup: start');
  await deployer.deploy(_StakingWarmup,
    OlympusStaking.address,
    sOlympus.address);
  const StakingWarmup = await _StakingWarmup.deployed();
  yellow('StakingWarmup: end');

  green('OlympusDAO: start');
  await deployer.deploy(_OlympusDAO);
  const OlympusDAO = await _OlympusDAO.deployed();
  yellow('OlympusDAO: end');

  green('OlympusBondingCalculator: start');
  await deployer.deploy(_OlympusBondingCalculator, OlympusERC20Token.address);
  const OlympusBondingCalculator = await _OlympusBondingCalculator.deployed();
  yellow('OlympusBondingCalculator: end');

  green('Distributor: start');
  await deployer.deploy(_Distributor,
    OlympusTreasury.address,
    OlympusERC20Token.address, epochLength, nextEpochBlock);
  const Distributor = await _Distributor.deployed();
  yellow('Distributor: end');

  green('OHMCirculatingSupplyContract: start');
  await deployer.deploy(_OHMCirculatingSupplyContract, accounts[0]);
  const OHMCirculatingSupplyContract = await _OHMCirculatingSupplyContract.deployed();
  await OHMCirculatingSupplyContract.initialize(OlympusERC20Token.address);
  await OHMCirculatingSupplyContract.setNonCirculatingOHMAddresses([OlympusDAO.address]);
  await Distributor.distribute();
  yellow('OHMCirculatingSupplyContract: end');

  green('OlympusBondDepository setup: start');

  await deployer.deploy(_OlympusBondDepository,
    OlympusERC20Token.address,
    DAI,
    OlympusTreasury.address,
    OlympusDAO.address,
    ZERO);

  const controlVariable = '200', vestingTerm = '432000', minimumPrice = '12000', maxPayout = '500',
    fee = '10000', maxDebt = '1000000000000000000000000', initialDebt = '0';

  const OlympusBondDepository = await _OlympusBondDepository.deployed();
  await OlympusBondDepository.initializeBondTerms(controlVariable,
    vestingTerm, minimumPrice, maxPayout, fee, maxDebt, initialDebt);
  await OlympusBondDepository.setBondTerms('1', '1000');
  await OlympusBondDepository.setStaking(StakingHelper.address, true);
  yellow('OlympusBondDepository setup: end');

  green('RedeemHelper: start');
  await deployer.deploy(_RedeemHelper);
  const RedeemHelper = await _RedeemHelper.deployed();
  await RedeemHelper.addBondContract(OlympusBondDepository.address);
  yellow('RedeemHelper: end');

  green('OlympusTreasury setup: start');
  await OlympusTreasury.queue('0', accounts[0])
  await OlympusTreasury.toggle('0', accounts[0], ZERO)

  await OlympusTreasury.queue('4', accounts[0])
  await OlympusTreasury.toggle('4', accounts[0], ZERO)

  await OlympusTreasury.queue('0', OlympusBondDepository.address)
  await OlympusTreasury.toggle('0', OlympusBondDepository.address, ZERO)
  await OlympusTreasury.queue('4', OlympusBondDepository.address)
  await OlympusTreasury.toggle('4', OlympusBondDepository.address, ZERO)

  await OlympusTreasury.queue('4', OlympusBondingCalculator.address)
  await OlympusTreasury.toggle('4', OlympusBondingCalculator.address, ZERO)
  await OlympusTreasury.queue('8', OlympusBondingCalculator.address)
  await OlympusTreasury.toggle('8', OlympusBondingCalculator.address, ZERO)

  await OlympusTreasury.queue('8', Distributor.address)
  await OlympusTreasury.toggle('8', Distributor.address, ZERO)
  yellow('OlympusTreasury setup: end');

  green('OlympusStaking.setContract: start');
  await OlympusStaking.setContract('1', StakingWarmup.address);
  await OlympusStaking.setContract('0', Distributor.address);
  yellow('OlympusStaking.setContract: end');

  green('sOlympus.initialize: start');
  await sOlympus.initialize(OlympusStaking.address);
  await sOlympus.setIndex('1000000000');
  yellow('sOlympus.initialize: end');

  green('OlympusERC20Token.setVault: start');
  await OlympusERC20Token.setVault(OlympusTreasury.address);
  yellow('OlympusERC20Token.setVault: end');


  magenta("CONTRACTS")
  green("- DAI: " + DAI);
  green("- OlympusERC20Token: " + OlympusERC20Token.address);
  green("- sOlympus: " + sOlympus.address);
  green("- StakingHelper: " + StakingHelper.address);
  green("- OlympusTreasury: " + OlympusTreasury.address);
  green("- Distributor: " + Distributor.address);
  green("- OHMCirculatingSupplyContract: " + OHMCirculatingSupplyContract.address);
  green("- OlympusBondDepository: " + OlympusBondDepository.address);
  green("- RedeemHelper: " + RedeemHelper.address);

};

