// toggle a bond on/off, after running this script go to allBonds.ts
// to add remove the bond contract.
// const bondContract = '0x28b18E5ca5b8C1E0D4c3A25BC0b5D3BE4e126c2C';
const bondContract = '0xa3c11b4c3ce521AbD444D7F9308c13912eCdEAcC';














const OlympusTreasury = artifacts.require("OlympusTreasury");
module.exports = async function (deployer, network, accounts) {
  const treasure = await OlympusTreasury.deployed();
  // const treasure = await OlympusTreasury.at('0x2af791E7EBa7efF93485CF8516bAf7bdc94d4db7');
  let isReserveDepositor = (await treasure.isReserveDepositor(bondContract));
  let isLiquidityDepositor = (await treasure.isLiquidityDepositor(bondContract));

  console.log('BEFORE: isReserveDepositor', isReserveDepositor);
  console.log('BEFORE: isLiquidityDepositor', isLiquidityDepositor);

  await treasure.queue('0', bondContract)
  await treasure.toggle('0', bondContract, bondContract)
  await treasure.queue('4', bondContract)
  await treasure.toggle('4', bondContract, bondContract)

  isReserveDepositor = (await treasure.isReserveDepositor(bondContract));
  isLiquidityDepositor = (await treasure.isLiquidityDepositor(bondContract));
  console.log('AFTER: isReserveDepositor', isReserveDepositor);
  console.log('AFTER: isLiquidityDepositor', isLiquidityDepositor);
  process.exit(0);
};

