import { ModeratoreAbi } from "./abi/moderatore";

export const PROPOSAL_PERIOD = 5 * 60 * 1000;
export const MODERATORE_ADDRESS = "0x9ac6519e6be8fD4612a9902d3199a65E6e7eb632";
export const ARBITRATOR_ADDRESS = "0xC8D58DA74ba01Af17d3936aA62a2a77fc44a4E9f";
export const arbitratorSite = `https://centralised-arbitrator.netlify.app/?arbitrator=${ARBITRATOR_ADDRESS}`;
export const defaultServer = "1182765847962464276";

export const modContract = {
  address: MODERATORE_ADDRESS,
  abi: ModeratoreAbi,
} as const;
