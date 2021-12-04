require('dotenv').config();
const HDWalletProvider = require("@truffle/hdwallet-provider");
const PRIVATE_KEY = process.env.PRIVATE_KEY.trim();
module.exports = {
  networks: {
    dev: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*"
    },
    avax: {
      provider: () => new HDWalletProvider(
        {
          privateKeys: [PRIVATE_KEY],
          providerOrUrl: "wss://speedy-nodes-nyc.moralis.io/cb6227e1fc4debe4b81540ef/avalanche/mainnet/ws",
          addressIndex: 0
        }),
      network_id: 1,
      networkCheckTimeout: 1000000,
      confirmations: 3,
      timeoutBlocks: 50000,
      websocket: true,
      skipDryRun: true
    },
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },

  compilers: {
    solc: {
      version: "0.7.5",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        }
      }
    }
  },
  plugins: [
    'truffle-plugin-verify'
  ],
  api_keys: {
    ftmscan: 'PPCQEKU7PDNW6DA81IIE53XQEPM6AIP7WW',
    snowtrace: process.env.SNOWTRACE_API_KEY,
  }

};
