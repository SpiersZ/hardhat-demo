## Hardhat-智能合约开发&测试框架
### 基本介绍（https://hardhat.org/getting-started）
`Hardhat` 是一个用于**编译、部署、测试和调试**以太坊软件的开发环境。功能上类似于**Truffle**。

`Hardhat Network`是一个本地以太坊虚拟机，除了支持**时间控制**外，还支持**主网分叉**功能，并增强了合约调试功能，提供了详细的错误堆栈信息和`console.log`日志打印结构。

### 起步
```
# 安装hardhat
npm install --save-dev hardhat

# 初始化，选择 Create an empty hardhat.config.js，创建一个空项目
npx hardhat

# 安装依赖库
npm install --save-dev "hardhat@^2.4.3"

# 安装单元测试插件
npm install --save-dev @nomiclabs/hardhat-waffle ethereum-waffle chai @nomiclabs/hardhat-ethers ethers
```

### 基本命令
```
➜  hardhat-demo git:(main) ✗ npx hardhat
Hardhat version 2.4.3

Usage: hardhat [GLOBAL OPTIONS] <TASK> [TASK OPTIONS]

GLOBAL OPTIONS:

  --config              A Hardhat config file.
  --emoji               Use emoji in messages.
  --help                Shows this message, or a task's help if its name is provided
  --max-memory          The maximum amount of memory that Hardhat can use.
  --network             The network to connect to.
  --show-stack-traces   Show stack traces.
  --tsconfig            Reserved hardhat argument -- Has no effect.
  --verbose             Enables Hardhat verbose logging
  --version             Shows hardhat's version.


AVAILABLE TASKS:

  check         Check whatever you need
  clean         Clears the cache and deletes all artifacts
  compile       Compiles the entire project, building all artifacts
  console       Opens a hardhat console
  flatten       Flattens and prints contracts and their dependencies
  help          Prints this message
  node          Starts a JSON-RPC server on top of Hardhat Network
  run           Runs a user-defined script after compiling the project
  test          Runs mocha tests

To get help for a specific task run: npx hardhat help [task]
```

### 虚拟机使用

虚拟机支持两种方式启动
1. 常规方式，执行 `npx hardhat node` ，默认在`localhost:8545`,创建一个RPC服务；
2. 主网分叉，通过一个现有RPC的地址启动，节点拥有同步主网指定块高度下状态功能，默认是同步最近块，官方推荐使用存档节点并指定块高度，避免因为主网块高度改变，对当前测试节点存在节点。以下是通过存档节点，进行主网分叉，并指定块高度的步骤
- 获取存档节点RPC
> 目前提供免费存档节点的服务商，都为官方推荐：
> * [getblock](https://getblock.io/cn/ "getblock")：免费套餐请求数限制40k/月，优势是支持链种类多，包括常用的BSC，HECO和Polygon等，具体见https://getblock.io/docs/cn/nodes-endpoints
> * [alchemy](https://www.alchemy.com/ "alchemy")：免费套餐请求限制25000k/月，只支持以太坊主网，优势是免费套餐量大

- 通过RPC，fork主网状态，并启动节点
 ```
 # 以GetBlock获取的RPC为例，fork BSC网络,并指定块高度9311690
 # https://BSC.getblock.io/?api_key=YOUR-API-KEY
 npx hardhat node --fork "https://bsc.getblock.io/mainnet/?api_key=85f5951b-9991-4125-9f61-c4e3031474ff" --fork-block-number 9311690
 # 启动成功
 Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/
 chainId：31337
 ```


### 编写单元测试
1. 创建项目文件夹
```
contracts/  # 存放合约文件
scripts/    # 用户脚本，例如：发布脚本等
test/       # 单元测试脚本
hardhat.config.js # 项目配置
```

1. 准备一个合约用于测试，以`ERC20`合约为例，将合约放入contracts目录

1. 编辑`hardhat.config.js`文件，设置编译器版本、发布节点信息以及加载插件
    ```javascript
    // 插件需要在此处加载
    require("@nomiclabs/hardhat-waffle");
    require("@nomiclabs/hardhat-ethers");
    module.exports = {
      solidity: {
        version: "0.5.1", // 编译器版本
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      },
      networks: {
        hardhat: {
          forking: {
            url: "https://bsc.getblock.io/mainnet/?api_key=85f5951b-9991-4125-9f61-c4e3031474f", // 采用之前创建的rpc
            blockNumber: 9311690, //指定fork的块高度
          },
          // 配置出块模式
          mining: {
            auto: false, // true：每个交易都在一个新块； false: 按照时间间隔出块
            interval: 5000 // 出块间隔
          }
        }
      },
      mocha: {
        timeout: 20000, // 单元测试超时
      }
    };
    ```

1. 编译合约,生成artifacts目录，包含编译后的ABI和合约字节码等信息
    ```
    ➜  hardhat-demo git:(main) ✗ npx hardhat compile
    Downloading compiler 0.5.1
    Compiling 1 file with 0.5.1
    Compilation finished successfully
    ```

1. 编写单元测试脚本，默认集成了Mocha和Waffle两套测试框架。
* 单元测试运行上采用了Mocha，具体可以参阅文档https://mochajs.org/#hooks
* 针对区块链判定，使用了Waffle,提供了区块链的特性判断，例如返回值，执行状态(revert&message)，事件判断(是否发出，且事件值是否准确)等，具体可参考文档Chai部分https://ethereum-waffle.readthedocs.io/en/latest/matchers.html
   ```javascript
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

   });
   ```
1. 执行试脚本，完成测试
    ```
    ➜  hardhat-demo git:(main) ✗  npx hardhat test ./test/ERC20.js
    ERC20 Test
    contract deployed success!
        ✓ name (5089ms)
        ✓ balanceOf
        ✓ transfer (5097ms)
      3 passing (19s)
    ```

### 单元测试其他技巧
1. 通过`network.provider.send`，向节点发送RPC命令，调整节点参数。除了支持eth指令外，还支持ganache部分指令和hardhat新增的指令，调用方式如下：
    ```
    // 调整出块参数，是否自动出块
    await network.provider.send("evm_setAutomine", [false]);
    
    ```
> 额外指令如下：
    *   `evm_increaseTime` – 时间流逝
    *   `evm_mine` – 强制进行一次区块生成
    *   `evm_revert` – 回复到快照状态
    *   `evm_snapshot` – 生成快照
    *   `evm_setNextBlockTimestamp` - 设置下一个块的时间戳
    *   `hardhat_impersonateAccount` - 冒充帐号，以某个帐号身份来执行调用，fork模式下支持
    *   `hardhat_setBalance` - 设置摸个帐号的余额
    *   `hardhat_setStorageAt` - 修改合约的存储值
    *   `hardhat_reset` - 回到某个块高度的状态
    *   更多指令参考：https://hardhat.org/hardhat-network/

