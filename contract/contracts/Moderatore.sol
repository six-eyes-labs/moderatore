// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import {FunctionsClient} from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/FunctionsClient.sol";
import {FunctionsRequest} from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/libraries/FunctionsRequest.sol";

/**
 * @title IArbitrable
 * Arbitrable interface.
 * When developing arbitrable contracts, we need to:
 * - Define the action taken when a ruling is received by the contract.
 * - Allow dispute creation. For this a function must call arbitrator.createDispute{value: _fee}(_choices,_extraData);
 */
interface IArbitrable {
    /**
     * @dev To be raised when a ruling is given.
     * @param _arbitrator The arbitrator giving the ruling.
     * @param _disputeID ID of the dispute in the Arbitrator contract.
     * @param _ruling The ruling which was given.
     */
    event Ruling(
        IArbitrator indexed _arbitrator,
        uint256 indexed _disputeID,
        uint256 _ruling
    );

    /**
     * @dev Give a ruling for a dispute. Must be called by the arbitrator.
     * The purpose of this function is to ensure that the address calling it has the right to rule on the contract.
     * @param _disputeID ID of the dispute in the Arbitrator contract.
     * @param _ruling Ruling given by the arbitrator. Note that 0 is reserved for "Not able/wanting to make a decision".
     */
    function rule(uint256 _disputeID, uint256 _ruling) external;
}

/**
 * @title Arbitrator
 * Arbitrator abstract contract.
 * When developing arbitrator contracts we need to:
 * - Define the functions for dispute creation (createDispute) and appeal (appeal). Don't forget to store the arbitrated contract and the disputeID (which should be unique, may nbDisputes).
 * - Define the functions for cost display (arbitrationCost and appealCost).
 * - Allow giving rulings. For this a function must call arbitrable.rule(disputeID, ruling).
 */
interface IArbitrator {
    enum DisputeStatus {
        Waiting,
        Appealable,
        Solved
    }

    /**
     * @dev To be emitted when a dispute is created.
     * @param _disputeID ID of the dispute.
     * @param _arbitrable The contract which created the dispute.
     */
    event DisputeCreation(
        uint256 indexed _disputeID,
        IArbitrable indexed _arbitrable
    );

    /**
     * @dev To be emitted when a dispute can be appealed.
     * @param _disputeID ID of the dispute.
     * @param _arbitrable The contract which created the dispute.
     */
    event AppealPossible(
        uint256 indexed _disputeID,
        IArbitrable indexed _arbitrable
    );

    /**
     * @dev To be emitted when the current ruling is appealed.
     * @param _disputeID ID of the dispute.
     * @param _arbitrable The contract which created the dispute.
     */
    event AppealDecision(
        uint256 indexed _disputeID,
        IArbitrable indexed _arbitrable
    );

    /**
     * @dev Create a dispute. Must be called by the arbitrable contract.
     * Must be paid at least arbitrationCost(_extraData).
     * @param _choices Amount of choices the arbitrator can make in this dispute.
     * @param _extraData Can be used to give additional info on the dispute to be created.
     * @return disputeID ID of the dispute created.
     */
    function createDispute(
        uint256 _choices,
        bytes calldata _extraData
    ) external payable returns (uint256 disputeID);

    /**
     * @dev Compute the cost of arbitration. It is recommended not to increase it often, as it can be highly time and gas consuming for the arbitrated contracts to cope with fee augmentation.
     * @param _extraData Can be used to give additional info on the dispute to be created.
     * @return cost Amount to be paid.
     */
    function arbitrationCost(
        bytes calldata _extraData
    ) external view returns (uint256 cost);

    /**
     * @dev Appeal a ruling. Note that it has to be called before the arbitrator contract calls rule.
     * @param _disputeID ID of the dispute to be appealed.
     * @param _extraData Can be used to give extra info on the appeal.
     */
    function appeal(
        uint256 _disputeID,
        bytes calldata _extraData
    ) external payable;

    /**
     * @dev Compute the cost of appeal. It is recommended not to increase it often, as it can be higly time and gas consuming for the arbitrated contracts to cope with fee augmentation.
     * @param _disputeID ID of the dispute to be appealed.
     * @param _extraData Can be used to give additional info on the dispute to be created.
     * @return cost Amount to be paid.
     */
    function appealCost(
        uint256 _disputeID,
        bytes calldata _extraData
    ) external view returns (uint256 cost);

    /**
     * @dev Compute the start and end of the dispute's current or next appeal period, if possible. If not known or appeal is impossible: should return (0, 0).
     * @param _disputeID ID of the dispute.
     * @return start The start of the period.
     * @return end The end of the period.
     */
    function appealPeriod(
        uint256 _disputeID
    ) external view returns (uint256 start, uint256 end);

    /**
     * @dev Return the status of a dispute.
     * @param _disputeID ID of the dispute to rule.
     * @return status The status of the dispute.
     */
    function disputeStatus(
        uint256 _disputeID
    ) external view returns (DisputeStatus status);

    /**
     * @dev Return the current ruling of a dispute. This is useful for parties to know if they should appeal.
     * @param _disputeID ID of the dispute.
     * @return ruling The ruling which has been given or the one which will be given if there is no appeal.
     */
    function currentRuling(
        uint256 _disputeID
    ) external view returns (uint256 ruling);
}

/** @title IEvidence
 *  ERC-1497: Evidence Standard
 */
interface IEvidence {
    /**
     * @dev To be emitted when meta-evidence is submitted.
     * @param _metaEvidenceID Unique identifier of meta-evidence.
     * @param _evidence IPFS path to metaevidence, example: '/ipfs/Qmarwkf7C9RuzDEJNnarT3WZ7kem5bk8DZAzx78acJjMFH/metaevidence.json'
     */
    event MetaEvidence(uint256 indexed _metaEvidenceID, string _evidence);

    /**
     * @dev To be raised when evidence is submitted. Should point to the resource (evidences are not to be stored on chain due to gas considerations).
     * @param _arbitrator The arbitrator of the contract.
     * @param _evidenceGroupID Unique identifier of the evidence group the evidence belongs to.
     * @param _party The address of the party submiting the evidence. Note that 0x0 refers to evidence not submitted by any party.
     * @param _evidence IPFS path to evidence, example: '/ipfs/Qmarwkf7C9RuzDEJNnarT3WZ7kem5bk8DZAzx78acJjMFH/evidence.json'
     */
    event Evidence(
        IArbitrator indexed _arbitrator,
        uint256 indexed _evidenceGroupID,
        address indexed _party,
        string _evidence
    );

    /**
     * @dev To be emitted when a dispute is created to link the correct meta-evidence to the disputeID.
     * @param _arbitrator The arbitrator of the contract.
     * @param _disputeID ID of the dispute in the Arbitrator contract.
     * @param _metaEvidenceID Unique identifier of meta-evidence.
     * @param _evidenceGroupID Unique identifier of the evidence group that is linked to this dispute.
     */
    event Dispute(
        IArbitrator indexed _arbitrator,
        uint256 indexed _disputeID,
        uint256 _metaEvidenceID,
        uint256 _evidenceGroupID
    );
}

contract Moderatore is IArbitrable, IEvidence, FunctionsClient {
    using FunctionsRequest for FunctionsRequest.Request;

    address public creator;
    IArbitrator public ruleArbitrator;
    IArbitrator public banArbitrator;

    uint256 public constant proposalPeriod = 5 minutes; // time in which smne can vote for a rule to be added , can be set with governane later
    address router = 0x6E2dc0F9DB014aE19888F539E59285D2Ea04244C;
    bytes32 donID =
        0x66756e2d706f6c79676f6e2d6d756d6261692d31000000000000000000000000;
    uint32 gasLimit = 300000;

    enum ProposalStatus {
        Proposed,
        Executed
    }

    enum RuleStatus {
        Initial,
        Disputed,
        Removed,
        Accepted
    }

    enum RulingOptions {
        RefusedToArbitrate,
        KeepRule,
        RemoveRule
    }

    enum ProposalOptions {
        VoteFor,
        VoteAgainst
    }

    struct Server {
        string guildId;
        uint createdOn;
    }

    struct Rule {
        address addedBy;
        address payable opposedBy;
        RuleStatus status;
        uint disputeId;
        uint evidenceGroupID;
        uint opposerFee;
        string guildId;
        string description;
        string checkFn;
    }

    struct Proposal {
        address payable proposedBy;
        string guildId;
        uint256 forVotes;
        uint256 againstVotes;
        uint256 proposedOn;
        string ruleDescription;
        string checkFn;
        ProposalStatus status;
        bool hasReclaimed;
    }

    struct VoteRequest {
        address voter;
        uint proposalId;
        uint vote;
    }

    uint256 constant numberOfRulingOptions = 2;
    uint256 constant numberOfProposalOptions = 1; // 0 for no ,1 for yes

    uint256 constant ruleMetaevidenceID = 0;
    uint256 constant banMetaevidenceID = 0;

    uint256 proposalCount = 0;

    mapping(string => Server) public Servers;
    mapping(string => Rule[]) private ServerToRules;
    mapping(string => uint[]) private ServerToRuleIds;
    mapping(string => uint[]) private ServerToProposalIds;
    mapping(string => bool) private doesServerExist;
    mapping(uint256 => Proposal) public ProposalDetails;
    mapping(uint => mapping(address => bool)) public hasVoted;
    mapping(uint => Rule) public RuleDetails;
    mapping(uint => uint) DisputeToRule;
    mapping(bytes32 => VoteRequest) public VoteRequests;

    error InvalidStatus();
    error NotArbitrator();
    error AlreadyVoted();
    error InsufficientPayment(uint256 _available, uint256 _required);
    error InvalidRuling(uint256 _ruling, uint256 _numberOfChoices);
    error UnexistingDispute();
    error UnexpectedRequestID(bytes32 requestId);
    error NotEligibleToVote(address voter, uint proposalId);

    // Event to log responses
    event VoteRegistered(
        bytes32 indexed requestId,
        address voter,
        uint proposalId,
        bytes err,
        bytes response
    );

    event VoteDeclined(
        bytes32 indexed requestId,
        address voter,
        uint proposalId,
        bytes err,
        bytes response
    );

    event RuleAdded(
        uint addedOn,
        uint indexed proposalId,
        uint indexed ruleId,
        string indexed guildId,
        string ruleDescription,
        string checkFn
    );

    event RuleProposed(
        address indexed proposedBy,
        uint indexed proposedOn,
        uint indexed proposalId,
        string guildId,
        string ruleDescription,
        string checkFn
    );

    event RuleRemoved(uint indexed removedOn, uint indexed ruleId);

    string source =
        "const guildId = args[0];"
        "const userAddress = args[1];"
        "const apiResponse = await Functions.makeHttpRequest({"
        "url: `https://39b6-2406-7400-63-96c3-4978-c342-aa38-f5f8.ngrok-free.app/api/canUserVoteFromEoa/${userAddress}/`"
        "});"
        "const { eligible } = apiResponse;"
        "return Functions.encodeUint256(eligible);";

    /**
     * @dev Contract constructor.
     * @param _ruleArbitrator The address of the arbitrator contract that rules on Rules removal.
     * @param _ruleMetaevidence The IPFS path to metaevidence for rule disputes.
     * @param _banArbitrator The address of the arbitrator contract.
     * @param _banMetaevidence The IPFS path to metaevidence.
     */
    constructor(
        IArbitrator _ruleArbitrator,
        string memory _ruleMetaevidence,
        IArbitrator _banArbitrator,
        string memory _banMetaevidence
    ) FunctionsClient(router) {
        creator = msg.sender;
        ruleArbitrator = _ruleArbitrator;
        banArbitrator = _banArbitrator;

        emit MetaEvidence(ruleMetaevidenceID, _ruleMetaevidence);
        emit MetaEvidence(banMetaevidenceID, _banMetaevidence);
    }

    function createServer(string memory _guildId) public {
        require(!doesServerExist[_guildId], "Server Alrd Exist");

        Servers[_guildId] = Server({
            guildId: _guildId,
            createdOn: block.timestamp
        });
    }

    function proposeRule(
        string memory _guildId,
        string memory _ruleDescription,
        string memory _checkFn
    ) public payable {
        uint256 requiredCost = ruleArbitrator.arbitrationCost("");
        //require to pay arbitration fee, as a way to stop spamming and also pay for arbitration fee in case rule is opposed
        // will be refunded if rule not approved
        if (msg.value < requiredCost) {
            revert InsufficientPayment(msg.value, requiredCost);
        }

        uint proposalId = proposalCount++;

        ProposalDetails[proposalId] = Proposal({
            guildId: _guildId,
            proposedBy: payable(msg.sender),
            proposedOn: block.timestamp,
            ruleDescription: _ruleDescription,
            checkFn: _checkFn,
            status: ProposalStatus.Proposed,
            forVotes: 0,
            againstVotes: 0,
            hasReclaimed: false
        });

        ServerToProposalIds[_guildId].push(proposalId);

        emit RuleProposed(
            msg.sender,
            block.timestamp,
            proposalId,
            _guildId,
            _ruleDescription,
            _checkFn
        );
    }

    /**
     * @notice Sends an HTTP request for character information
     * @param subscriptionId The ID for the Chainlink subscription
     * @param _proposalId The ID for the proposal to vote on
     * @param _option The option to vote
     * @return requestId The ID of the request
     */
    function vote(
        uint64 subscriptionId,
        uint256 _proposalId,
        uint256 _option,
        string memory guildId
    ) external returns (bytes32 requestId) {
        Proposal memory proposal = ProposalDetails[_proposalId];

        require(_proposalId <= proposalCount, "Invalid proposal id");
        require(
            block.timestamp - proposal.proposedOn <= proposalPeriod,
            "Proposal period has ended"
        );
        require(hasVoted[_proposalId][msg.sender] != true, "Already Voted");
        require(_option < 2, "Invalid option. Can be either 0 or 1.");

        //prepare request
        FunctionsRequest.Request memory req;
        req.initializeRequestForInlineJavaScript(source); // Initialize the request with JS code

        // string[] calldata args = [guildId, addressToString(msg.sender)];

        string[] memory args = new string[](2);
        args[0] = guildId;
        args[1] = addressToString(msg.sender);

        req.setArgs(args); // Set the arguments for the request

        // Send the request and store the request ID
        bytes32 reqId = _sendRequest(
            req.encodeCBOR(),
            subscriptionId,
            gasLimit,
            donID
        );

        VoteRequests[reqId] = VoteRequest({
            voter: msg.sender,
            proposalId: _proposalId,
            vote: _option
        });

        return reqId;
    }

    /**
     * @notice Callback function for fulfilling a request
     * @param requestId The ID of the request to fulfill
     * @param response The HTTP response data
     * @param err Any errors from the Functions request
     */
    function fulfillRequest(
        bytes32 requestId,
        bytes memory response,
        bytes memory err
    ) internal override {
        VoteRequest memory voteRequest = VoteRequests[requestId];

        if (voteRequest.voter == address(0)) {
            revert UnexpectedRequestID(requestId); // Check if request IDs maexisttch
        }

        uint res = bytesToUint(response);

        //revert if not eligble to vote
        if (res == uint(0)) {
            emit VoteDeclined(
                requestId,
                voteRequest.voter,
                voteRequest.proposalId,
                err,
                response
            );
            revert NotEligibleToVote(voteRequest.voter, voteRequest.proposalId);
        }

        Proposal storage proposal = ProposalDetails[voteRequest.proposalId];

        if (voteRequest.vote == 0) {
            proposal.againstVotes++;
        } else {
            proposal.forVotes++;
        }

        hasVoted[voteRequest.proposalId][msg.sender] = true;

        // Emit an event to log the response
        emit VoteRegistered(
            requestId,
            voteRequest.voter,
            voteRequest.proposalId,
            err,
            response
        );
    }

    /**
     * @dev Execute a proposal.
     * @param _proposalId The ID of the proposal.
     */
    function executeProposal(
        string memory _guildId,
        uint256 _proposalId
    ) public {
        Proposal storage proposal = ProposalDetails[_proposalId];

        require(
            block.timestamp - proposal.proposedOn > proposalPeriod,
            "Proposal period has not ended"
        );
        require(
            proposal.forVotes > proposal.againstVotes,
            "Proposal not approved"
        );
        require(
            proposal.status == ProposalStatus.Proposed,
            "Proposal executed"
        );

        proposal.status = ProposalStatus.Executed;
        //add rule here
        uint ruleId = uint(
            keccak256(abi.encodePacked(_guildId, _proposalId, block.timestamp))
        );

        ServerToRuleIds[_guildId].push(ruleId);

        Rule memory _rule = Rule({
            addedBy: proposal.proposedBy,
            opposedBy: payable(address((0))),
            status: RuleStatus.Initial,
            disputeId: ~uint256(0),
            evidenceGroupID: ~uint256(0),
            opposerFee: 0,
            guildId: _guildId,
            description: proposal.ruleDescription,
            checkFn: proposal.checkFn
        });

        RuleDetails[ruleId] = _rule;
        ServerToRules[_guildId].push(_rule);

        emit RuleAdded(
            block.timestamp,
            _proposalId,
            ruleId,
            _guildId,
            proposal.ruleDescription,
            proposal.checkFn
        );
    }

    // /**
    //  * @dev Reclaim the arbitration fee if the proposal is not approved.
    //  * @param _proposalId The ID of the proposal.
    //  */
    // function reclaimFee(uint _proposalId) public {
    //     Proposal storage proposal = ProposalDetails[_proposalId];
    //     require(
    //         block.timestamp > proposal.proposedOn + proposalPeriod,
    //         "Proposal still active"
    //     );
    //     require(
    //         proposal.proposedBy == msg.sender,
    //         "Only proposer can reclaim."
    //     );
    //     require(
    //         proposal.forVotes <= proposal.againstVotes,
    //         "Proposal approved. Please execute"
    //     );
    //     require(!proposal.hasReclaimed, "Already reclaimed fee");

    //     uint256 requiredCost = ruleArbitrator.arbitrationCost("");

    //     proposal.proposedBy.transfer(requiredCost);
    //     proposal.hasReclaimed = true;
    // }

    /**
     * @dev Oppose a rule.
     * @param ruleId The ID of the rule to oppose.
     */
    function opposeRule(uint ruleId, string memory _evidence) public payable {
        Rule storage _rule = RuleDetails[ruleId];
        require(
            _rule.status == RuleStatus.Initial,
            "Rule already disputed once"
        );

        uint256 requiredCost = ruleArbitrator.arbitrationCost("");

        if (msg.value < requiredCost) {
            revert InsufficientPayment(msg.value, requiredCost);
        }
        _rule.status = RuleStatus.Disputed;
        uint256 disputeID = ruleArbitrator.createDispute{value: msg.value}(
            numberOfRulingOptions,
            ""
        );

        _rule.disputeId = disputeID;
        DisputeToRule[disputeID] = ruleId;
        _rule.evidenceGroupID = disputeID;

        submitEvidence(disputeID, _evidence);

        emit Dispute(
            ruleArbitrator,
            disputeID,
            ruleMetaevidenceID,
            _rule.evidenceGroupID
        );
    }

    //TODO: will make an appeal , if unchallenged for 7 days then can unban, only need to emit event to unban
    // function unban(string _guildId)public view pure{

    // }

    /**
     * @dev Handle the ruling for a dispute.
     * @param _disputeID The ID of the dispute.
     * @param _ruling The ruling (0 for refused to arbitrate, 1 for keep rule, 2 for remove rule).
     */
    function rule(uint256 _disputeID, uint256 _ruling) public override {
        if (msg.sender != address(ruleArbitrator)) {
            revert NotArbitrator();
        }
        uint ruleId = DisputeToRule[_disputeID];
        Rule storage _rule = RuleDetails[ruleId];

        if (_rule.status != RuleStatus.Disputed) {
            revert UnexistingDispute();
        }
        if (_ruling > numberOfRulingOptions) {
            revert InvalidRuling(_ruling, numberOfRulingOptions);
        }

        if (_ruling == uint256(RulingOptions.KeepRule)) {
            _rule.status = RuleStatus.Accepted;
        } else {
            _rule.status = RuleStatus.Removed;
            _removeRule(ruleId);

            _rule.opposedBy.transfer(RuleDetails[ruleId].opposerFee);
        }
        emit Ruling(ruleArbitrator, _disputeID, _ruling);
    }

    /**
     * @dev Submit evidence for a dispute.
     * @param _disputeId The ID of the dispute.
     * @param _evidence The IPFS path to the evidence.
     */
    function submitEvidence(uint _disputeId, string memory _evidence) public {
        uint ruleId = DisputeToRule[_disputeId];
        if (RuleDetails[ruleId].status != RuleStatus.Disputed) {
            revert InvalidStatus();
        }

        emit Evidence(
            ruleArbitrator,
            RuleDetails[ruleId].evidenceGroupID,
            msg.sender,
            _evidence
        );
    }

    /**
     * @dev Internal function to remove a rule from the list of rules.
     * @param ruleId The ID of the rule to remove.
     */
    function _removeRule(uint256 ruleId) internal {
        string memory guildId = RuleDetails[ruleId].guildId;

        for (uint i = 0; i < ServerToRuleIds[guildId].length; i++) {
            if (ServerToRuleIds[guildId][i] == ruleId) {
                ServerToRules[guildId][i] = ServerToRules[guildId][
                    ServerToRules[guildId].length - 1
                ];
                ServerToRules[guildId].pop();
                ServerToRuleIds[guildId][i] = ServerToRuleIds[guildId][
                    ServerToRuleIds[guildId].length - 1
                ];
                ServerToRuleIds[guildId].pop();
                emit RuleRemoved(block.timestamp, ruleId);
                break;
            }
        }
    }

    /**
     * getters
     */
    function getRules(
        string memory _guildId
    ) public view returns (Rule[] memory rules) {
        return ServerToRules[_guildId];
    }

    function getRuleIds(
        string memory _guildId
    ) public view returns (uint[] memory ruleIds) {
        return ServerToRuleIds[_guildId];
    }

    function getProposalIds(
        string memory _guildId
    ) public view returns (uint[] memory proposalIds) {
        return ServerToProposalIds[_guildId];
    }

    //helpers
    function bytesToUint(bytes memory b) public pure returns (uint256) {
        uint256 number;
        for (uint i = 0; i < b.length; i++) {
            number =
                number +
                uint(uint8(b[i])) *
                (2 ** (8 * (b.length - (i + 1))));
        }
        return number;
    }

    function addressToString(
        address _addr
    ) public pure returns (string memory) {
        bytes32 value = bytes32(uint256(uint160(_addr)));
        bytes memory alphabet = "0123456789abcdef";

        bytes memory str = new bytes(51);
        str[0] = "0";
        str[1] = "x";
        for (uint256 i = 0; i < 20; i++) {
            str[2 + i * 2] = alphabet[uint8(value[i + 12] >> 4)];
            str[3 + i * 2] = alphabet[uint8(value[i + 12] & 0x0f)];
        }
        return string(str);
    }
}
