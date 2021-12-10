const HOURS = 24; // 24
const PAYOUT = 0.5; // %


// ======================================================================
const CONTRACT = '0x28b18E5ca5b8C1E0D4c3A25BC0b5D3BE4e126c2C';
const _OlympusBondDepository = artifacts.require("OlympusBondDepository");
let bond;
module.exports = async function (deployer, network, accounts) {
  bond = await _OlympusBondDepository.deployed();
  // bond = await _OlympusBondDepository.at(CONTRACT);
  await dumpInfo('BEFORE');

  await bond.setBondTerms ( 0, (HOURS/2)*3600 );
  await bond.setBondTerms ( 1, (PAYOUT)*1000 );
  await dumpInfo('AFTER');
  process.exit(0);
};
async function dumpInfo(title){
  let r = await bond.terms();
  const vestingTerm = r.vestingTerm.toString();
  const maxPayout = r.maxPayout.toString();
  console.log(title,' vestingTerm='+(vestingTerm*2)/3600+'h  ('+vestingTerm+')' )
  console.log(title,' maxPayout='+maxPayout/1000+'% ('+maxPayout+')' )
}

