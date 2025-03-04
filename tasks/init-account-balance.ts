import {task} from 'hardhat/config';
import {HardhatRuntimeEnvironment} from 'hardhat/types';
import 'hardhat-deploy';
import 'hardhat-deploy-ethers';
import {Numbers} from '../utils/constants';

task('initAccountBalance', "Init dev account's balance")
  .addParam('account', 'Account address to transfer to')
  .setAction(
    async (args: {account: string}, hre: HardhatRuntimeEnvironment) => {
      const {ethers} = hre;
      const user = args.account;
      const [deployer] = await ethers.getSigners();
      console.log('Account balance:', (await deployer.getBalance()).toString());
      const bnb = await ethers.getContract('MockBNB', deployer);
      const btc = await ethers.getContract('MockBUSD', deployer);
      await btc.mint(user, Numbers.ONE_DEC18.mul(2));
      await bnb.mint(user, Numbers.ONE_DEC18.mul(100));
      await deployer.sendTransaction({
        to: user,
        value: Numbers.ONE_DEC18.mul(100),
      });
    }
  );
