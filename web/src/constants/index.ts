import { ModeratoreAbi } from "./abi/moderatore";

export const PROPOSAL_PERIOD = 5 * 60 * 1000;
export const MODERATORE_ADDRESS = "0x42434a6BBC0c418bF1663d7BDC756E6D7C59b774";
export const ARBITRATOR_ADDRESS = "0xC8D58DA74ba01Af17d3936aA62a2a77fc44a4E9f";
export const arbitratorSite = `https://centralised-arbitrator.netlify.app/?arbitrator=${ARBITRATOR_ADDRESS}`;
export const defaultServer = "1182765847962464276";

export const modContract = {
  address: MODERATORE_ADDRESS,
  abi: ModeratoreAbi,
} as const;
