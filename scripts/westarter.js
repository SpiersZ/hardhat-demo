const hardhat = require("hardhat");
const USDT_TOKEN = '0xa71edc38d189767582c38a3145b5873052c3e47a'

async function main(){
  const ERC20 = await hardhat.ethers.getContractFactory("ERC20");
  let usdt = await ERC20.attach(USDT_TOKEN);
  const balance = await usdt.balanceOf("0x468996c09ba764aedc26f2e67861bc328423acc7")
  console.log('balance', balance.toString())
}
main()
// https://api.hecoinfo.com/api?module=block&action=getblockreward&apikey=ZKCTB8MP4Z2UZNJW3GK18S5RD4P5FTECGW
