const OlympusERC20Token = artifacts.require("OlympusERC20Token");
const ethers = require('ethers');
module.exports = async function (deployer) {
  try {
    const cli = await OlympusERC20Token.at('0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0');
    await cli.setVault('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266');
    await cli.mint('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', 1_000_000_000);
  } catch (e) {
    console.log("[ERROR]", e.toString());
  }
  process.exit(0);
};
