const moderatorAbi = [
  {
    inputs: [
      {
        internalType: "contract IArbitrator",
        name: "_ruleArbitrator",
        type: "address",
      },
      { internalType: "string", name: "_ruleMetaevidence", type: "string" },
      {
        internalType: "contract IArbitrator",
        name: "_banArbitrator",
        type: "address",
      },
      { internalType: "string", name: "_banMetaevidence", type: "string" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  { inputs: [], name: "AlreadyVoted", type: "error" },
  {
    inputs: [
      { internalType: "uint256", name: "_available", type: "uint256" },
      { internalType: "uint256", name: "_required", type: "uint256" },
    ],
    name: "InsufficientPayment",
    type: "error",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_ruling", type: "uint256" },
      { internalType: "uint256", name: "_numberOfChoices", type: "uint256" },
    ],
    name: "InvalidRuling",
    type: "error",
  },
  { inputs: [], name: "InvalidStatus", type: "error" },
  { inputs: [], name: "NotArbitrator", type: "error" },
  { inputs: [], name: "UnexistingDispute", type: "error" },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "contract IArbitrator",
        name: "_arbitrator",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "_disputeID",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_metaEvidenceID",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_evidenceGroupID",
        type: "uint256",
      },
    ],
    name: "Dispute",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "contract IArbitrator",
        name: "_arbitrator",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "_evidenceGroupID",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "_party",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "_evidence",
        type: "string",
      },
    ],
    name: "Evidence",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "_metaEvidenceID",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "_evidence",
        type: "string",
      },
    ],
    name: "MetaEvidence",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "addedOn",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "proposalId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "ruleId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "string",
        name: "guildId",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "ruleDescription",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "checkFn",
        type: "string",
      },
    ],
    name: "RuleAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "proposedBy",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "proposedOn",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "proposalId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "guildId",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "ruleDescription",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "checkFn",
        type: "string",
      },
    ],
    name: "RuleProposed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "removedOn",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "ruleId",
        type: "uint256",
      },
    ],
    name: "RuleRemoved",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "contract IArbitrator",
        name: "_arbitrator",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "_disputeID",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_ruling",
        type: "uint256",
      },
    ],
    name: "Ruling",
    type: "event",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "ProposalDetails",
    outputs: [
      { internalType: "address payable", name: "proposedBy", type: "address" },
      { internalType: "string", name: "guildId", type: "string" },
      { internalType: "uint256", name: "forVotes", type: "uint256" },
      { internalType: "uint256", name: "againstVotes", type: "uint256" },
      { internalType: "uint256", name: "proposedOn", type: "uint256" },
      { internalType: "string", name: "ruleDescription", type: "string" },
      { internalType: "string", name: "checkFn", type: "string" },
      {
        internalType: "enum Moderatore.ProposalStatus",
        name: "status",
        type: "uint8",
      },
      { internalType: "bool", name: "hasReclaimed", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "RuleDetails",
    outputs: [
      { internalType: "address", name: "addedBy", type: "address" },
      { internalType: "address payable", name: "opposedBy", type: "address" },
      {
        internalType: "enum Moderatore.RuleStatus",
        name: "status",
        type: "uint8",
      },
      { internalType: "uint256", name: "disputeId", type: "uint256" },
      { internalType: "uint256", name: "evidenceGroupID", type: "uint256" },
      { internalType: "uint256", name: "opposerFee", type: "uint256" },
      { internalType: "string", name: "guildId", type: "string" },
      { internalType: "string", name: "description", type: "string" },
      { internalType: "string", name: "checkFn", type: "string" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "string", name: "", type: "string" }],
    name: "Servers",
    outputs: [
      { internalType: "string", name: "guildId", type: "string" },
      { internalType: "uint256", name: "createdOn", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "banArbitrator",
    outputs: [
      { internalType: "contract IArbitrator", name: "", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "string", name: "_guildId", type: "string" }],
    name: "createServer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "creator",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "string", name: "_guildId", type: "string" },
      { internalType: "uint256", name: "_proposalId", type: "uint256" },
    ],
    name: "executeProposal",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "string", name: "_guildId", type: "string" }],
    name: "getProposalIds",
    outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "string", name: "_guildId", type: "string" }],
    name: "getRuleIds",
    outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "string", name: "_guildId", type: "string" }],
    name: "getRules",
    outputs: [
      {
        components: [
          { internalType: "address", name: "addedBy", type: "address" },
          {
            internalType: "address payable",
            name: "opposedBy",
            type: "address",
          },
          {
            internalType: "enum Moderatore.RuleStatus",
            name: "status",
            type: "uint8",
          },
          { internalType: "uint256", name: "disputeId", type: "uint256" },
          { internalType: "uint256", name: "evidenceGroupID", type: "uint256" },
          { internalType: "uint256", name: "opposerFee", type: "uint256" },
          { internalType: "string", name: "guildId", type: "string" },
          { internalType: "string", name: "description", type: "string" },
          { internalType: "string", name: "checkFn", type: "string" },
        ],
        internalType: "struct Moderatore.Rule[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "address", name: "", type: "address" },
    ],
    name: "hasVoted",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "ruleId", type: "uint256" },
      { internalType: "string", name: "_evidence", type: "string" },
    ],
    name: "opposeRule",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "proposalPeriod",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "string", name: "_guildId", type: "string" },
      { internalType: "string", name: "_ruleDescription", type: "string" },
      { internalType: "string", name: "_checkFn", type: "string" },
    ],
    name: "proposeRule",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_proposalId", type: "uint256" }],
    name: "reclaimFee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_disputeID", type: "uint256" },
      { internalType: "uint256", name: "_ruling", type: "uint256" },
    ],
    name: "rule",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "ruleArbitrator",
    outputs: [
      { internalType: "contract IArbitrator", name: "", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_disputeId", type: "uint256" },
      { internalType: "string", name: "_evidence", type: "string" },
    ],
    name: "submitEvidence",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_proposalId", type: "uint256" },
      { internalType: "uint256", name: "_option", type: "uint256" },
    ],
    name: "vote",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const moderatorAddress = "0x08Ed10F43Bf75eB0f9f6E0cD932008E43c483fB3";

exports.moderatorAbi = moderatorAbi;
exports.moderatorAddress = moderatorAddress;
