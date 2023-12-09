// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const { generateMetaevidence } = require("../utils/generate-metaevidence");
const { ipfsPublish } = require("./ipfs-publish");

async function main() {
  let metaevidence = generateMetaevidence();
  const enc = new TextEncoder();
  const ipfsHashMetaEvidenceObj = await ipfsPublish(
    "metaEvidence.json",
    enc.encode(JSON.stringify(metaevidence))
  );
  const ipfsFileHash =
    "/ipfs/" +
    ipfsHashMetaEvidenceObj[1]["hash"] +
    ipfsHashMetaEvidenceObj[0]["path"];
  console.log("Meta evidence file hash : ", ipfsFileHash);

  //same arbitrator for now
  const ruleArbitrator = "0xC8D58DA74ba01Af17d3936aA62a2a77fc44a4E9f";
  const banArbitrator = "0xC8D58DA74ba01Af17d3936aA62a2a77fc44a4E9f";

  const moderatore = await hre.ethers.deployContract("Moderatore", [
    ruleArbitrator,
    ipfsFileHash,
    banArbitrator,
    ipfsFileHash,
  ]);

  await moderatore.waitForDeployment();

  const deployedAddress = await moderatore.getAddress();
  console.log("Contract deployed :", deployedAddress);

  console.log("Waiting 10 confirmations before verifying");

  await moderatore.deploymentTransaction()?.wait(10);

  await hre.run("verify:verify", {
    address: moderatore.target, //contract address
    constructorArguments: [
      ruleArbitrator,
      ipfsFileHash,
      banArbitrator,
      ipfsFileHash,
    ],
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
