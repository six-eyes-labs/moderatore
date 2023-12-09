import { ModeratoreAbi } from "./abi/moderatore";

export const PROPOSAL_PERIOD = 5 * 60 * 1000;
export const MODERATORE_ADDRESS = "0x4393A4Ed4f2284a413C8029e25aBfAc1Ef7d5632";
export const ARBITRATOR_ADDRESS = "0xC8D58DA74ba01Af17d3936aA62a2a77fc44a4E9f";
export const arbitratorSite = `https://centralised-arbitrator.netlify.app/?arbitrator=${ARBITRATOR_ADDRESS}`;

export const modContract = {
  address: MODERATORE_ADDRESS,
  abi: ModeratoreAbi,
} as const;
