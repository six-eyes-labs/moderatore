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

const ipfsPublish = async (fileName: string, data: any) => {
  const buffer = await Buffer.from(data);

  return new Promise((resolve, reject) => {
    fetch("https://ipfs.kleros.io/add", {
      method: "POST",
      body: JSON.stringify({
        fileName,
        buffer,
      }),
      headers: {
        "content-type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((success) => resolve(success.data))
      .catch((err) => reject(err));
  }) as any;
};

const generateEvidence = (
  fileURI: string,
  fileHash: string,
  fileTypeExtension: string,
  name: string,
  description: string
) => ({
  fileURI,
  fileHash,
  fileTypeExtension,
  name,
  description,
});

export const publishEvidence = async (rule: Rule) => {
  // Convert the rule to a string
  const dataString = JSON.stringify(rule);

  // Create a buffer from the string
  const buffer = Buffer.from(dataString);
  const result = await ipfsPublish("name", buffer);

  let evidence = generateEvidence(
    "/ipfs/" + result[0]["hash"],
    result[0]["hash"],
    "json",
    "Rule under dispute",
    "This rule has been opposed. Should this rule be accepted or removed from Rule Book."
  );
  const enc = new TextEncoder();
  const ipfsHashEvidenceObj = await ipfsPublish(
    "evidence.json",
    enc.encode(JSON.stringify(evidence))
  );
  return ("/ipfs/" + ipfsHashEvidenceObj[0]["hash"]) as string;
};
