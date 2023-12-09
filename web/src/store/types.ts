export type Server = string;

export interface Rule {
  id: string;
  addedBy: string | `0x${string}`;
  opposedBy: string | `0x${string}`;
  status: number;
  disputeId: string;
  evidenceGroupID: string;
  opposerFee: string;
  guildId: string;
  description: string;
  checkFn: string;
}

export interface Proposal {
  id: string;
  proposedBy: string | `0x${string}`;
  guildId: string;
  forVotes: string;
  againstVotes: string;
  proposedOn: string;
  ruleDescription: string;

  checkFn: string;
  status: number;
  hasReclaimed: boolean;
}

export enum ProposalStatus {
  Proposed,
  Executed,
  Approved,
  Declined,
}

export enum RuleStatus {
  Initial,
  Disputed,
  Removed,
  Accepted,
}
