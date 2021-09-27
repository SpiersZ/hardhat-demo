const hardhat = require("hardhat");
const {ethers} = require("hardhat");
const HELMET_TOKEN = '0x948d2a81086A075b3130BAc19e4c6DEe1D2E3fE8'

// 解决bsc分叉报错
async function reset(BSC_URL){
  const bscProvider = new hardhat.ethers.providers.JsonRpcProvider(BSC_URL);

  const latestBlock = await bscProvider.getBlockNumber();

  await hardhat.network.provider.send("hardhat_reset", [{
    forking: {
      jsonRpcUrl: BSC_URL,
      blockNumber: latestBlock
    }
  }])
}

// npx hardhat node --fork https://bsc.getblock.io/mainnet/\?api_key\=85f5951b-9991-4125-9f61-c4e3031474ff --fork-block-number 10978268

async function main(){
  // await reset('https://bsc-dataseed.binance.org')
  const ERC20 = await hardhat.ethers.getContractFactory("ERC20");
  let helmet = await ERC20.attach(HELMET_TOKEN);
  //
  const balance = await helmet.balanceOf("0x23FCB0E1DDbC821Bd26D5429BA13B7D5c96C0DE0")
  console.log('balance', balance.toString())
  // 模拟账户
  // 被模拟的账户
  const ACT_ADDRESS = '0x20adDcBc828ed4F52f43e5D0e180BdC563254804'
  const balance1 = await helmet.balanceOf(ACT_ADDRESS)
  console.log('balance1', balance1.toString())
  await hardhat.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [ACT_ADDRESS],
  });
  const signer = await ethers.getSigner(ACT_ADDRESS)
  const helmetNew = helmet.connect(signer)
  const tx = await helmetNew.transfer("0x23FCB0E1DDbC821Bd26D5429BA13B7D5c96C0DE0", ethers.utils.parseEther("1000.0"))
  // 等待交易上链
  await tx.wait()
  // 查询目标地址余额
  console.log('success')
  const balance2 = await helmet.balanceOf("0x23FCB0E1DDbC821Bd26D5429BA13B7D5c96C0DE0")
  console.log('balance2', balance2.toString())
  // 停止冒充
  await hardhat.network.provider.request({
    method: "hardhat_stopImpersonatingAccount",
    params: [ACT_ADDRESS],
  });
  console.log('已停止冒充')
}
// main()


async function fn(){
  const IBO_ADDRESS = '0x603366462A39CdbFCE7a7B274f5DA77cb51eA9b0'
  const IBO = await hardhat.ethers.getContractFactory("StarterLimit");
  let ibo = await IBO.attach(IBO_ADDRESS);
  //
  // // 调用IBO合约中的方法
  const maxUser = await ibo.maxUser() // 获取最多参与地址
  console.log('maxUser', maxUser.toString())
}
// fn()

// 设置时间为开始可质押的时间
function setTime(){
  hardhat.network.provider.request({
  method: "evm_setNextBlockTimestamp",
  params: [1631790000]
});
}
// setTime()
