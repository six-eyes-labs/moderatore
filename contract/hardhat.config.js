require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-verify");
require("dotenv").config();
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.22",
  networks: {
    mumbai: {
      url: `https://polygon-mumbai.infura.io/v3/${process.env.INFURA_API}`,
      accounts: [process.env.PRIVATE_KEY],
      gasPrice: 3000000000,
    },
  },
  etherscan: {
    apiKey: { polygonMumbai: process.env.POLYGONSCAN_KEY },
  },
};
