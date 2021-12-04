//
const chalk = require('chalk');
const {ethers} = require("hardhat");
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

async function main() {

  const [deployer, MockDAO] = await ethers.getSigners();
  yellow('Deploying contracts with the account: ' + deployer.address);

  // Initial staking index
  const initialIndex = '7675210820';

  // First block epoch occurs
  const firstEpochBlock = '899594';

  // What epoch will be first epoch
  const firstEpochNumber = '338';

  // How many blocks are in each epoch
  const epochLengthInBlocks = '28800';

  // Initial reward rate for epoch
  const initialRewardRate = '3000';

  // Ethereum 0 address, used when toggling changes in treasury
  const zeroAddress = '0x0000000000000000000000000000000000000000';

  // Large number for approval for Frax and DAI
  const largeApproval = '100000000000000000000000000000000';

  // Initial mint for Frax and DAI (10,000,000)
  const initialMint = '10000000000000000000000000';

  // DAI bond BCV
  const daiBondBCV = '369';

  // Frax bond BCV
  const fraxBondBCV = '690';

  // Bond vesting length in blocks. 33110 ~ 5 days
  const bondVestingLength = '33110';

  // Min bond price
  const minBondPrice = '50000';

  // Max bond payout
  const maxBondPayout = '50'

  // DAO fee for bond
  const bondFee = '10000';

  // Max debt bond can take on
  const maxBondDebt = '1000000000000000';

  // Initial Bond debt
  const intialBondDebt = '0'

  // Deploy OHM
  magenta('*OlympusERC20Token*');
  const OHM = await ethers.getContractFactory('OlympusERC20Token');
  const ohm = await OHM.deploy();

  // Deploy DAI
  // const DAI = await ethers.getContractFactory('DAI');
  // const dai = await DAI.deploy(0);
  const dai = '0x80a16016cc4a2e6a2caca8a4a498b1699ff0f844';
  magenta('*DAI '+dai+'*');

  // Deploy treasury
  //@dev changed function in treaury from 'valueOf' to 'valueOfToken'... solidity function was coflicting w js object property name
  magenta('*OlympusTreasury*');
  const Treasury = await ethers.getContractFactory('OlympusTreasury');
  const treasury = await Treasury.deploy(ohm.address, dai, 0);

  // Deploy bonding calc
  magenta('*OlympusBondingCalculator*');
  const OlympusBondingCalculator = await ethers.getContractFactory('OlympusBondingCalculator');
  const olympusBondingCalculator = await OlympusBondingCalculator.deploy(ohm.address);

  // Deploy staking distributor
  magenta('*Distributor*');
  const Distributor = await ethers.getContractFactory('Distributor');
  const distributor = await Distributor.deploy(treasury.address, ohm.address, epochLengthInBlocks, firstEpochBlock);

  // Deploy sOHM
  magenta('*sOlympus*');
  const SOHM = await ethers.getContractFactory('sOlympus');
  const sOHM = await SOHM.deploy();

  // Deploy Staking
  magenta('*OlympusStaking*');
  const Staking = await ethers.getContractFactory('OlympusStaking');
  const staking = await Staking.deploy(ohm.address, sOHM.address, epochLengthInBlocks, firstEpochNumber, firstEpochBlock);

  // Deploy staking warmpup
  magenta('*StakingWarmup*');
  const StakingWarmpup = await ethers.getContractFactory('StakingWarmup');
  const stakingWarmup = await StakingWarmpup.deploy(staking.address, sOHM.address);

  // Deploy staking helper
  magenta('*StakingHelper*');
  const StakingHelper = await ethers.getContractFactory('StakingHelper');
  const stakingHelper = await StakingHelper.deploy(staking.address, ohm.address);

  // Deploy DAI bond
  magenta('*OlympusBondDepository*');
  //@dev changed function call to Treasury of 'valueOf' to 'valueOfToken' in BondDepository due to change in Treausry contract
  const OlympusBondDepository = await ethers.getContractFactory('OlympusBondDepository');
  const olympusBondDepository = await OlympusBondDepository.deploy(ohm.address, dai, treasury.address, MockDAO.address, zeroAddress);

  magenta('*configure treasure*');
  // queue and toggle DAI and Frax bond reserve depositor
  await treasury.queue('0', olympusBondDepository.address);
  await treasury.toggle('0', olympusBondDepository.address, zeroAddress);

  // Set DAI bond terms
  magenta('*configure bods*');
  await olympusBondDepository.initializeBondTerms(daiBondBCV, bondVestingLength, minBondPrice, maxBondPayout, bondFee, maxBondDebt, intialBondDebt);
  await olympusBondDepository.setBondTerms('1', '1000');
  await olympusBondDepository.setStaking(staking.address, stakingHelper.address);

  magenta('*RedeemHelper*');
  const RedeemHelper = await ethers.getContractFactory('RedeemHelper');
  const redeemHelper = await RedeemHelper.deploy();
  await redeemHelper.addBondContract(olympusBondDepository.address);

  // Initialize sOHM and set the index
  magenta('*sOHM.initialize*');
  await sOHM.initialize(staking.address);
  await sOHM.setIndex(initialIndex);

  magenta('*staking.setContract*');
  // set distributor contract and warmup contract
  await staking.setContract('0', distributor.address);
  await staking.setContract('1', stakingWarmup.address);

  magenta('*ohm.setVault*');
  // Set treasury for OHM token
  await ohm.setVault(treasury.address);

  magenta('*distributor.addRecipient*');
  // Add staking contract as distributor recipient
  await distributor.addRecipient(staking.address, initialRewardRate);

  magenta('*treasury.queue deployer*');
  await treasury.queue('0', deployer.address);
  await treasury.toggle('0', deployer.address, zeroAddress);
  await treasury.queue('4', deployer.address);
  await treasury.toggle('4', deployer.address, zeroAddress);

  magenta('*treasury.queue olympusBondDepository*');
  await treasury.queue('0', olympusBondDepository.address);
  await treasury.toggle('0', olympusBondDepository.address, zeroAddress);
  await treasury.queue('4', olympusBondDepository.address);
  await treasury.toggle('4', olympusBondDepository.address, zeroAddress);

  magenta('*treasury.queue olympusBondingCalculator*');
  await treasury.queue('8', olympusBondingCalculator.address);
  await treasury.toggle('8', olympusBondingCalculator.address, zeroAddress);
  await treasury.queue('4', olympusBondingCalculator.address);
  await treasury.toggle('4', olympusBondingCalculator.address, zeroAddress);

  // queue and toggle reward manager

  magenta('*treasury.queue distributor*');
  await treasury.queue('8', distributor.address);
  await treasury.toggle('8', distributor.address, zeroAddress);

  magenta("CONTRACTS")
  green("DAI: " + dai);
  green("OlympusERC20Token: " + ohm.address);
  green("OlympusTreasury: " + treasury.address);
  green("OlympusBondingCalculator: " + olympusBondingCalculator.address);
  green("OlympusStaking: " + staking.address);
  green("sOlympus: " + sOHM.address);
  green("Distributor: " + distributor.address);
  green("StakingWarmup: " + stakingWarmup.address);
  green("StakingHelper: " + stakingHelper.address);
  green("OlympusBondDepository: " + olympusBondDepository.address);
}

main()
  .then(() => process.exit())
  .catch(error => {
    console.error(error);
    process.exit(1);
  })
