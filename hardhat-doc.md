# hardhat

# 入门
## 安装
```
npm install --save-dev hardhat

npx hardhat

选 Create an empty hardhat.config.js
```

## 编译合约
添加新合约sol于contracts，后需要执行编译  
https://hardhat.org/guides/compile-contracts.html#compiling-your-contracts
```
npx hardhat compile
```

## 部署合约
编写js代码
```
    const Token = await ethers.getContractFactory("合约名");// (contract AAA {xxx} AAA就是合约名)
    const hardhatToken = await Token.deploy();
	await hardhatToken.deployed();
	// 接下来可以直接调用合约方法 获取余额
    const ownerBalance = await hardhatToken.balanceOf(address);
```
执行js代码
```
// node js文件路径
node scripts/index.js
```

# 常用操作

## fork主网

1. 命令的形式
```
// fork eth链
// npx hardhat node --fork 地址
npx hardhat node --fork https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161

// fork指定块高度（锁定区块）
// npx hardhat node --fork 地址 --fork-block-number 块高度
npx hardhat node --fork https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161 --fork-block-number 115445
```
2. 配置hardhat.config.js
```
  networks: {
    hardhat: {
      forking: {
        url: "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161", // okChain
        // blockNumber: 5115288, //指定fork的块高度(锁定区块)
      },
    }
  },
```

# 重置Fork
你可以在运行时里操作Fork，如重置回全新的Fork状态、从另一个区块号Fork，或者通过调用hardhat_reset禁用Fork:
1. 重新fork
```
await network.provider.request({
  method: "hardhat_reset",
  params: [{
    forking: {
      jsonRpcUrl: "https://eth-mainnet.alchemyapi.io/v2/<key>",
      blockNumber: 11095000
    }
  }]
})
```
2. 禁用fork
```
await network.provider.request({
  method: "hardhat_reset",
  params: []
})
```

## 挖矿

## 禁用挖矿
```
async function f6() {
  await hardhat.network.provider.send("evm_setAutomine", [false]);
}
f6()
```
## 启用区间挖掘
```
await network.provider.send("evm_setIntervalMining", [5000]);
```

## 手动挖矿
在hardhat.config.js没有配置手动挖矿 或 当自动挖矿被禁用时，可以执行手动挖矿（没有被禁用一样可以执行手动）
```
async function f8() {
  await hardhat.network.provider.request({
    method: "evm_mine",
  });
}
f8()
```

## 获取pending中的交易列表
可以先禁用挖矿，再获取pending列表
```
const pendingBlock = await network.provider.send("eth_getBlockByNumber", [
  "pending",
  false,
]);
```

## 删除和替换交易 hardhat_dropTransaction
1. 删除交易
```
const txHash = "0xabc...";
await network.provider.send("hardhat_dropTransaction", [txHash]);
```
2. 替换交易
直接发起一个交易，指定的交易的哈希为你先覆盖的哈希即可，就像在 Geth 中一样，新的 gas/fees 价格必须至少比当前交易的 gas 价格高 10%

## 设置下一个块的时间戳
```
const hardhat = require("hardhat");

hardhat.network.provider.request({
  method: "evm_setNextBlockTimestamp",
  params: [1640966400],
});
```
> 1640966400为你要设置的时间戳
> 场景：比如到点才能claim

# 配置项 hardhat.config.js

```
  networks: {
    hardhat: {
	chainId: 31337,//默认链id
	from: account,//默认账户
	gas: 'auto'|'3000',// gas费，auto自动或者一个具体的数值
	gasPrice: 'auto'|'3000', // 类似gas
	gasMultiplier: '1',用于乘以气体估计结果的数字,默认值1
	accounts: { // 此字段可以配置为以下之一
	  mnemonic: //助记池 BIP39 定义的 12 或 24 个单词的助记词。默认值："test test test test test test test test test test test junk"
	  initialIndex: // 要派生的初始索引。默认值：0
	  path：所有派生密钥的 HD 父级。默认值："m/44'/60'/0'/0"。
	  count: 20,要派生的帐户数。默认值：20。
	  accountsBalance: 分配给每个派生帐户的余额（以 wei 为单位）的字符串。默认值："10000000000000000000000"（10000 ETH）
	  },
	blockGasLimit: gas 限制。默认值：30000000 (3gwei)
	minGasPrice: 最低 gas 价格,默认0we
	hardfork: 这个设置改变了安全帽网络的工作方式，在给定的硬分叉上模仿以太坊的主网。它必须是一个"byzantium"，"constantinople"，"petersburg"，"istanbul"，"muirGlacier"，"berlin"和"london"。默认值："london"
	throwOnTransactionFailures：控制安全帽网络是否引发交易失败的布尔值。如果此值为true，Hardhat Network 将在事务失败时抛出组合的 JavaScript 和 Solidity 堆栈跟踪。如果是false，它将返回失败的交易哈希。在这两种情况下，交易都被添加到区块链中。默认值：true
	throwOnCallFailures：一个布尔值，用于控制 Hardhat Network 是否在调用失败时引发。如果此值为true，Hardhat Network 将在调用失败时抛出组合的 JavaScript 和 Solidity 堆栈跟踪。如果是false，它将返回调用的return data，其中可以包含还原原因。默认值：true
	loggingEnabled：控制安全帽网络是否记录每个请求的布尔值。默认值：false对于进程内 Hardhat Network 提供者，true对于 Hardhat Network 支持的 JSON-RPC 服务器（即node任务）。
	initialDate：设置区块链日期的可选字符串。有效值是Javascript 的日期时间字符串。默认值：如果不分叉另一个网络，则为当前日期和时间。当分叉另一个网络时，使用您分叉的区块的时间戳加上一秒。
	allowUnlimitedContractSize：一个可选的布尔值，禁用EIP 170强加的合约大小限制。默认值：false
	forking: {描述分叉配置的对象，可以具有以下字段：
	  url: 指向具有要分叉的状态的 JSON-RPC 节点的 URL。此字段没有默认值。必须为前叉提供它才能工作。
	  blockNumber：一个可选数字，用于固定要从哪个块中分叉。如果未提供值，则使用最新的块。
	  enabled: 一个可选的布尔值，用于打开或关闭 fork 功能。默认值：true如果url设置，false否则。
	}
	minGasPrice：gasPrice交易必须具有的最小值。如果"hardfork"是"london"或以后的，则此字段不得存在。默认值："0"。
	initialBaseFeePerGas: 第baseFeePerGas一个块的。请注意，在分叉远程网络时，“第一个块”是您分叉的块之后的那个。此字段必须不存在，如果"hardfork"不是"london"或更高之一。默认值："1000000000"如果不分叉。在 fork 远程网络时，如果远程网络使用 EIP-1559，则第一个本地块将baseFeePerGas根据 EIP使用权限，否则"10000000000"使用
	}
  }
```

 
# 方法

## 标准方法

1. eth_accounts
返回主账户，这个账户是在hardhat.config.js配置的私钥的账户地址


2. eth_blockNumber
返回当前块高度

3. eth_call
立刻执行一个新的消息调用
```
参数
Object - 交易调用对象

from: DATA, 20 Bytes - 发送交易的原地址，可选
to: DATA, 20 Bytes - 交易目标地址
gas: QUANTITY - 交易可用gas量，可选。eth_call不消耗gas，但是某些执行环节需要这个参数
gasPrice: QUANTITY - gas价格，可选
value: QUANTITY - 交易发送的以太数量，可选
data: DATA - 方法签名和编码参数的哈希，可选
QUANTITY|TAG - 整数块编号，或字符串"latest"、"earliest"或"pending"
```
4. eth_chainId
返回当前链id

5. eth_coinbase
返回接收挖矿回报的账户地址

6. eth_estimateGas
返回估计调用需要耗费的gas量

7. eth_gasPrice
返回当前的gas价格

8. eth_getBalance
获取指定账户余额
```
params: [
   account
]
```

9. eth_getBlockByHash
返回具有指定哈希的块
```
params: [
   hash,
   true//为true时返回完整的交易对象，否则仅返回交易哈希
]
```

10. eth_getBlockByNumber
返回指定编号的块。
```
params: [
   '0x1b4', // 整数块编号，或字符串"earliest"、"latest" 或"pending"
   true// 为true时返回完整的交易对象，否则仅返回交易哈希
]
```
11. eth_getBlockTransactionCountByHash
返回指定块内的交易数量，使用哈希来指定块
```
params: [
   hash
]
```

12. eth_getBlockTransactionCountByNumber
返回指定块内的交易数量，使用块编号指定块
```
params: [
   '0xe8', // 232
]
```

13. eth_getCode
返回指定地址的代码
```
params: [
   address,
   '0x2'  //整数块编号，或字符串"latest"、"earliest" 或"pending"
]
```

↓其他方法解释，可阅读中文文档 http://cw.hubwiz.com/card/c/ethereum-json-rpc-api/1/3/16/

#eth_getFilterChanges
#eth_getFilterLogs
#eth_getLogs
#eth_getStorageAt
#eth_getTransactionByBlockHashAndIndex
#eth_getTransactionByBlockNumberAndIndex
#eth_getTransactionByHash
#eth_getTransactionCount
#eth_getTransactionReceipt
#eth_mining
#eth_newBlockFilter
#eth_newFilter
#eth_newPendingTransactionFilter
#eth_pendingTransactions
#eth_sendRawTransaction
#eth_sendTransaction
#eth_sign
#eth_signTypedData_v4
#eth_subscribe
#eth_syncing
#eth_uninstallFilter
#eth_unsubscribe
#net_listening
#net_peerCount
#net_version
#web3_clientVersion
#web3_sha3

如何调用
```
const hardhat = require("hardhat");

hardhat.network.provider.request({
  method: 方法名,
  params: [参数],
});
```

## Hardhat 方法
1. hardhat_addCompilationResult
添加有关已编译合同的信息

2. hardhat_dropTransaction
从内存池中删除交易

3. hardhat_impersonateAccount
模拟账户
```
async function f1(){
  await hardhat.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [被模拟的账户],
  });
  const signer = await ethers.provider.getSigner(被模拟的账户)
  // 用模拟的账户给指定账户转账
  await signer.sendTransaction({
    to: "0x23FCB0E1DDbC821Bd26D5429BA13B7D5c96C0DE0",
    value: ethers.utils.parseEther("1.0"),
  });
  console.log('success')

// 取消模拟
  await hardhat.network.provider.request({
    method: "hardhat_stopImpersonatingAccount",
    params: [被模拟的账户],
  });
}

f1().then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```



## 查询交易信息
```
async function UnsignedTransaction(hash) {
  const data = await hardhat.ethers.provider.getTransaction(hash)
  console.log('data', data)
}
//UnsignedTransaction(交易hash)
UnsignedTransaction('0xa475cf601cb72f4435b22cec9e622eaee1c98f4bd5fa39d1d7e0e69c3f5f62f5')
```

## 修改账户余额
hardhat_setBalance

```
async function f2(){
  await hardhat.network.provider.send("hardhat_setBalance", [
    "0x23FCB0E1DDbC821Bd26D5429BA13B7D5c96C0DE0",
    Web3.utils.numberToHex(hardhat.ethers.utils.parseEther('123.12')),//十六进制
  ]);
}
f2()
```
params第二个值为十六进制的数量，可以通过

通过ethers.utils.hexValue(weiAccount)转换数值大会报错(还没找出原因)，
所以我采用web3的Web3.utils.numberToHex()方法转十六进制

## Token转账
```
// 代币转账
async function f4(){
  // 合约部署
  const ERC20 = await ethers.getContractFactory("ERC20");
  let erc20 = await ERC20.deploy();
  erc20.deployed();
  const accounts =await ethers.getSigners();

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
f4()
```

## 代币转账
```
// 代币转账
async function f5(){
  const [owner] = await ethers.getSigners();
  await owner.sendTransaction({
    from: owner.address,
    to: "0xD528d6B7ff1f46417a7A7b2f2869Fe0CC8e9ed67",
    value: ethers.utils.parseEther("1.2"),
  });
  // 查询目标地址余额
  const balance = await hardhat.ethers.provider.getBalance('0xD528d6B7ff1f46417a7A7b2f2869Fe0CC8e9ed67')
  console.log(balance.toString())
}
f5()
```

# 常见单位转换
```
// gas转换 num2wei
hardhat.ethers.utils.parseUnits('300', 'gwei'),

// ether转换 num2wei
hardhat.ethers.utils.parseEther('1')

// num 2 16hex
Web3.utils.numberToHex('1')
ethers.utils.hexValue(1)

```


# 购买代币
## ETH换USDT
1. 打开https://cn.etherscan.com/address/0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D?__cf_chl_captcha_tk__=pmd_OSHU6V8WotUYTJ1N04sFud0nMjRu17W0JEXSWTPcOjs-1631168411-0-gqNtZGzNAyWjcnBszQvR#writeContract
2. 先将MetaMask切换为ETH主网，网站连接钱包成功后，再将网络切换为localhost (直接用localhost是连接不上网站的)
3. 找到方法 swapExactETHForTokens
```
swapExactETHForTokens: 1 // 数量
amountOutMin: 1 // 最小输出数量
path: ["0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2","0xdac17f958d2ee523a2206206994597c13d831ec7"] // 兑换路由 [eth,usdt]
to: 0xD528d6B7ff1f46417a7A7b2f2869Fe0CC8e9ed67 // 接收余额的地址
deadline: 1631244682 // 交易有效时间、填一个未来的时间即可
```


# 常见问题

## 合约版本不同编译将报错
需要在hardhat.config.js里面新增配置多个版本,solidity  
https://hardhat.org/guides/compile-contracts.html#multiple-solidity-versions
```
  solidity: {
    compilers: [
      {
        version: "0.5.1", // 编译器版本
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        },
		...其他配置
      },
      {
        version: "0.7.0", // 编译器版本
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        },
		...其他配置
      }
    ]
  },
```

## Unknown transaction type 2
1. 删除node_modules
2. 执行命令npm update 或 yarn upgrade
3. 再执行命令npm install

## 账户模拟报错 HardhatError: HH103: Account 0x28c6c06298d514db089934071355e5743bf21d60 is not managed by the node you are connected to.
去除networks.dev.accounts，因为在账户模拟的时候会判断模拟的账户是否在accounts中，不在会报错(不能声明空数组)，
```
  networks: {
    dev: {
      url: "http://localhost:8545",
      //accounts: []
    }
  },
```

## HH600: Compilation failed
合约编译失败，这时候需要查看合约的版本是否和配置的对应，、
```
  solidity: {
    overrides: {
      "contracts/xxx.sol": {
        version: "0.6.0"
      }
    },
    compilers: [
      {
        version: "0.6.12", // 编译器版本
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      },
	]
   }
```
##  HardhatError: HH700: Artifact for contract "XXX" not found
1. 这里需要注意 XXX为合约名称(contract XXX {xxx} XXX就是合约名)，并非文件名
2. 注意你要调用的方法，比如你的合约是0x1...，但是你调用的是0x1...的代理合约方法CXX，且0x1...合约没有CXX方法，
这样你需要把代理合约的代码拷贝到hardhat .sol文件，如果代理合约引用了其他的合约 如./a.sol 那么你还要将a.sol也拷贝到hardhat，
并执行`npx hardhat compile`编译合约代码。  
举例
```
const IBO = await hardhat.ethers.getContractFactory("StarterLimit"); // StarterLimit是合约文件.sol里面的其中一个 contract StarterLimit {...}
let ibo = await IBO.attach(IBO_ADDRESS);
  //
  // // 调用IBO合约中的方法 获取最多参与地址
  const maxUser = await ibo.maxUser() // maxUser是StarterLimit下的属性或方法

```
