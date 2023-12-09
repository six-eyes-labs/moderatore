import { PROPOSAL_PERIOD } from "@/constants";
import { Proposal, ProposalStatus } from "@/store/types";

export const getStatus = (proposal: Proposal) => {
  if (Date.now() > parseInt(proposal.proposedOn) * 1000 + PROPOSAL_PERIOD) {
    if (proposal.status == ProposalStatus.Executed)
      return ProposalStatus.Executed;

    if (parseInt(proposal.forVotes) > parseInt(proposal.againstVotes))
      return ProposalStatus.Approved;

    return ProposalStatus.Declined;
  } else return ProposalStatus.Proposed;
};
