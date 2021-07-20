// 插件需要在此处加载
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
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
        url: "https://bsc.getblock.io/mainnet/?api_key=85f5951b-9991-4125-9f61-c4e3031474ff", // 采用之前创建的rpc
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
