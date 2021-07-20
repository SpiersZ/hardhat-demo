const {BigNumber} = require("ethers");
const { expect } = require("chai");

// 测试组
describe("ERC20 Test", function () {
  let erc20

  // 在测试组开始之前执行，只执行一次
  before(async () => {
    // 合约部署
    const ERC20 = await ethers.getContractFactory("ERC20");
    erc20 = await ERC20.deploy();
    erc20.deployed();
    console.log('contract deployed success!')
  })
  // 每个单元测试运行前，执行
  beforeEach(() => {

  })

  // 单元测试
  it("name", async function () {
    // 断言
    expect(await erc20.name()).to.equal("Hard Hat Token");
  });

  it("balanceOf", async function () {
    // 获取本地帐号
    const accounts =await ethers.getSigners();
    // 调用合约，获取余额
    const balance = await erc20.balanceOf(accounts[0].address)
    // 断言
    expect(balance).to.equal(BigNumber.from('100000000000000000000000000'));
  });

  it("transfer", async function () {
    const accounts =await ethers.getSigners();
    // 设置转账数量
    const amount = ethers.utils.parseEther('10')
    // 广播交易
    const tx = await erc20.transfer(accounts[1].address, amount)
    // 等待交易上链
    await tx.wait()
    // 查询目标地址余额
    const balance = await erc20.balanceOf(accounts[1].address)
    // 断言
    expect(balance).to.equal(BigNumber.from(amount));
  });

  it("other feature", async function () {
    // 调整配置
    await network.provider.send("evm_setAutomine", [false]);
  });

});