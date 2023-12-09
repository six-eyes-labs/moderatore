import { ModeratoreAbi } from "./abi/moderatore";

export const PROPOSAL_PERIOD = 5 * 60 * 1000;
export const MODERATORE_ADDRESS = "0x7eC8b337bb297c6429794CD888EdcBB3e54A2D20";
export const ARBITRATOR_ADDRESS = "0xC8D58DA74ba01Af17d3936aA62a2a77fc44a4E9f";
export const arbitratorSite = `https://centralised-arbitrator.netlify.app/?arbitrator=${ARBITRATOR_ADDRESS}`;

export const modContract = {
  address: MODERATORE_ADDRESS,
  abi: ModeratoreAbi,
} as const;
