const hardhat = require("hardhat");
const {ethers} = require("hardhat");
const Web3 = require("web3");
const {expect} = require("chai");
const {BigNumber} = require("ethers");

async function fn() {
  const accounts = await hardhat.network.provider.request({
    method: 'eth_getBlockByHash',
    params: ['0x7acc6a75c82c6222c7c6219c1de9b17a9e7aacbf73d632c83439c985176bed10', true]
  })
  console.log('accounts', accounts)
}

// fn()

// 模拟账户
async function f1() {
  await hardhat.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: ["0x28C6c06298d514Db089934071355E5743bf21d60"],
  });
  const signer = await ethers.provider.getSigner("0x28C6c06298d514Db089934071355E5743bf21d60")
  await signer.sendTransaction({
    to: "0x23FCB0E1DDbC821Bd26D5429BA13B7D5c96C0DE0",
    value: ethers.utils.parseEther("1.0"),
  });
  console.log('success')

  await hardhat.network.provider.request({
    method: "hardhat_stopImpersonatingAccount",
    params: ["0x28C6c06298d514Db089934071355E5743bf21d60"],
  });
}

// f1().then(() => process.exit(0))
//   .catch((error) => {
//     console.error(error);
//     process.exit(1);
//   });


// 修改账户余额
async function f2() {
  console.log(Web3.utils.numberToHex(hardhat.ethers.utils.parseEther('123.12')))
  // console.log(ethers.utils.hexValue(12000000000000000))
  await hardhat.network.provider.send("hardhat_setBalance", [
    "0x23FCB0E1DDbC821Bd26D5429BA13B7D5c96C0DE0",
    Web3.utils.numberToHex(hardhat.ethers.utils.parseEther('123.12')),//十六进制
  ]);
}

// f2()


// 设置下一个块的时间
// hardhat.network.provider.request({
//   method: "evm_setNextBlockTimestamp",
//   params: [1640966400]
// });


// 查询交易
// async function UnsignedTransaction(hash) {
//   const data = await hardhat.ethers.provider.getTransaction(hash)
//   console.log('data', data)
// }
// UnsignedTransaction('0xa475cf601cb72f4435b22cec9e622eaee1c98f4bd5fa39d1d7e0e69c3f5f62f5')


//
// const main = async () => {
//   const ERC20 = await hardhat.ethers.getContractFactory("ERC20");
//
//   const erc20 = ERC20.attach("0xdAC17F958D2ee523a2206206994597C13D831ec7")
//
//   // 设置转账数量
//   const amount = hardhat.ethers.utils.parseEther('1')
//
//   await hardhat.network.provider.request({
//     method: "hardhat_impersonateAccount",
//     params: ["0x47ac0Fb4F2D84898e4D9E7b4DaB3C24507a6D503"]
//   });
//   const signer = await hardhat.ethers.getSigner("0x47ac0Fb4F2D84898e4D9E7b4DaB3C24507a6D503")
//
//   erc20.connect(signer)
//
//   const tx = await erc20.transfer('0xD528d6B7ff1f46417a7A7b2f2869Fe0CC8e9ed67', amount, {
//     gasPrice: hardhat.ethers.utils.parseUnits('300', 'gwei'),
//     gasLimit: "2100000"
//   })
//   console.log(tx);
//   await tx.wait()
//   // 广播交易
//
//   await hardhat.network.provider.request({
//     method: "hardhat_stopImpersonatingAccount",
//     params: ["0x47ac0Fb4F2D84898e4D9E7b4DaB3C24507a6D503"],
//   });
// }
//
// main();

// Token转账
async function f4() {
  // 合约部署
  const ERC20 = await ethers.getContractFactory("ERC20");
  let erc20 = await ERC20.deploy();
  erc20.deployed();
  const accounts = await ethers.getSigners();

  const beforeBalance = await erc20.balanceOf(accounts[1].address)
  // 设置转账数量
  const amount = ethers.utils.parseEther('10')
  // 广播交易
  const tx = await erc20.transfer(accounts[1].address, amount)
  // 等待交易上链
  await tx.wait()
  // 查询目标地址余额
  const afterBalance = await erc20.balanceOf(accounts[1].address)

  console.log('转帐前', beforeBalance.toString())
  console.log('转帐后', afterBalance.toString())

}

// f4()


// 代币转账
async function f5() {
  const [owner] = await ethers.getSigners();
  await owner.sendTransaction({
    from: owner.address,
    to: "0xD528d6B7ff1f46417a7A7b2f2869Fe0CC8e9ed67",
    value: ethers.utils.parseEther("1.2"),
  });
  const balance = await hardhat.ethers.provider.getBalance('0xD528d6B7ff1f46417a7A7b2f2869Fe0CC8e9ed67')
  console.log(balance.toString())
}

// f5()

// 禁用挖矿
async function f6() {
  await hardhat.network.provider.send("evm_setAutomine", [false]);
}
// f6()

// 获取pending中的交易
async function f7() {
  const pendingBlock = await hardhat.network.provider.send("eth_getBlockByNumber", [
    "pending",
    false,
  ]);
  console.log('pendingBlock',pendingBlock)
}
// f7()

// 手动挖矿
async function f8() {
  await hardhat.network.provider.request({
    method: "evm_mine",
  });
}
f8()