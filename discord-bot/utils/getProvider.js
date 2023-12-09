require("dotenv").config();
const { ethers } = require("ethers");

const infuraApi = process.env.INFURA_API;

const getProvider = () => {
  try {
    const allRpcs = [defaultRpc, ...fallbackRpcs];
    const providers = allRpcs.map((rpc) => new ethers.JsonRpcProvider(rpc));
    const network = new ethers.Network("mumbai", 80001n);

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

const defaultRpc = `https://polygon-mumbai.infura.io/v3/${infuraApi}`;
const fallbackRpcs = ["https://rpc.ankr.com/polygon_mumbai"];

exports.getProvider = getProvider;
