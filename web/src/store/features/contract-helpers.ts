import { publicClient } from "../client";
import { Rule, Proposal, Server } from "../types";
import { modContract } from "@/constants";

export const getServers = async () => {
  const servers = await publicClient.readContract({
    ...modContract,
    functionName: "getServers",
  });
  return servers as Server[];
};

export const getRules = async (guildId: string) => {
  const ruleIds = await publicClient.readContract({
    ...modContract,
    functionName: "getRuleIds",
    args: [guildId],
  });

  const rulesArray = await publicClient.readContract({
    ...modContract,
    functionName: "getRules",
    args: [guildId],
  });

  const response = await publicClient.multicall({
    contracts: ruleIds.map(
      (id) =>
        ({
          ...modContract,
          functionName: "RuleDetails",
          args: [id] as const,
        } as const)
    ),
    allowFailure: false,
  });

  const rules = response.map((item, index) => {
    return {
      id: ruleIds[index].toString(),
      addedBy: item[0].toString(),
      opposedBy: item[1].toString(),
      status: item[2],
      disputeId: item[3].toString(),
      evidenceGroupID: item[4].toString(),
      opposerFee: item[5].toString(),
      guildId: item[6].toString(),
      description: item[7].toString(),
      checkFn: item[8].toString(),
    } as Rule;
  });

  return rules.reverse() as Rule[];
};

export const getProposals = async (guildId: string) => {
  const proposalIds = await publicClient.readContract({
    ...modContract,
    functionName: "getProposalIds",
    args: [guildId],
  });

  const response = await publicClient.multicall({
    contracts: proposalIds.map(
      (id) =>
        ({
          ...modContract,
          functionName: "ProposalDetails",
          args: [id] as const,
        } as const)
    ),
    allowFailure: false,
  });

  const proposals = response.map((item, index) => {
    return {
      id: proposalIds[index].toString(),
      proposedBy: item[0],
      guildId: item[1].toString(),
      forVotes: item[2].toString(),
      againstVotes: item[3].toString(),
      proposedOn: item[4].toString(),
      ruleDescription: item[5].toString(),
      checkFn: item[6].toString(),
      status: item[7],
      hasReclaimed: item[8],
    } as Proposal;
  });
  return proposals.reverse() as Proposal[];
};
