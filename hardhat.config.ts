// npx hardhat run --network movr deploy/deploy.js
import 'dotenv/config';
import {HardhatUserConfig} from 'hardhat/types';
import 'hardhat-deploy';
import 'hardhat-deploy-ethers';
import 'hardhat-gas-reporter';
import 'hardhat-spdx-license-identifier';
import 'hardhat-contract-sizer';
import '@nomiclabs/hardhat-etherscan';
import {node_url, accounts, etherscanApiKey} from './utils/network';
import './tasks/init-account-balance';

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: '0.7.5',
        settings: {
          optimizer: {
            enabled: true,
          },
        },
      },
    ],
  },
  namedAccounts: {
    deployer: 1,
    creator: 1,
    devFund: 1,
    pool_creator: 0,
    timelock_admin: 0,
    governor_guardian_address: 0,
    dummy: 7,
    test_deployer: 3,
  },
  networks: {
    hardhat: {
      accounts: accounts(),
    },
    localhost: {
      url: 'http://localhost:8545',
      accounts: accounts(),
    },
    movr: {
      url: node_url('movr'),
      accounts: accounts('movr'),
      chainId: 1285,
      live: true,
    },
    ftm: {
      url: node_url('ftm'),
      accounts: accounts('ftm'),
      chainId: 250,
      live: true,
      gas: 2100000,
      gasPrice: 8000000000
    },
    bsctest: {
      url: node_url('bsctest'),
      accounts: accounts('bsctest'),
      chainId: 97,
      live: true,
      tags: ['bsctest_main'],
    },
  },
  etherscan: {
    apiKey: etherscanApiKey(),
  },
  paths: {
    sources: 'contracts',
  },
  mocha: {
    timeout: 0,
  },
  spdxLicenseIdentifier: {
    overwrite: true,
    runOnCompile: true,
  },
};
export default config;
