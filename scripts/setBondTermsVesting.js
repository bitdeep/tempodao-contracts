const value = '';
const CONTRACT = '0x28b18E5ca5b8C1E0D4c3A25BC0b5D3BE4e126c2C';
const _OlympusBondDepository = artifacts.require("OlympusBondDepository");
module.exports = async function (deployer, network, accounts) {
  const bond = await _OlympusBondDepository.at(CONTRACT);
  await bond.setBondTerms ( 0, value );
  process.exit(0);
};

