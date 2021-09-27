// 插件需要在此处加载
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  defaultNetwork: "dev",
  solidity: {
    compilers: [
      {
        version: "0.6.0", // 编译器版本
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      },
      {
        version: "0.6.12", // 编译器版本
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      },
      {
        version: "0.7.0", // 编译器版本
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        },
      },
      {
        version: "0.5.1", // 编译器版本
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      }
    ]
  },
  networks: {
    hardhat: {
      forking: {
        url: "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161", // okChain
        // blockNumber: 5115288, //指定fork的块高度
      },
      // 配置出块模式
      mining: {
        auto: false, // true：每个交易都在一个新块； false: 按照时间间隔出块
        interval: 2000 // 出块间隔
      }
    },
    dev: {
      url: "http://localhost:8545",
      mining: {
        auto: false,
        interval: 2000
      }
    }
  },
  mocha: {
    timeout: 200000, // 单元测试超时
  }
};
