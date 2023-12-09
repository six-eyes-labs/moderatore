const { ethers } = require("ethers");

const getProvider = () => {
  try {
    const allRpcs = [defaultRpc, ...fallbackRpcs];
    const providers = allRpcs.map((rpc) => new ethers.JsonRpcProvider(rpc));

    const network = new ethers.Network("goerli", 5n);

    return new ethers.FallbackProvider(providers, network, {
      cacheTimeout: 5000,
      eventQuorum: 2,
      eventWorkers: 1,
      pollingInterval: 1000,
      quorum: 1,
    });
  } catch (err) {
    console.log(err);
  }
};
const defaultRpc = `https://polygon-mumbai.infura.io/v3/${process.env.INFURA_API}`;
const fallbackRpcs = [
  "https://rpc.ankr.com/polygon_mumbai",
  "https://polygon-mumbai.gateway.tenderly.co/",
];

exports.getProvider = getProvider;
