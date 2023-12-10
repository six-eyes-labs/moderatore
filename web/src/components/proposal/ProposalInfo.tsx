import { Proposal, ProposalStatus } from "@/store/types";
import { getStatus } from "@/utils/helpers";
import moment from "moment";
import React, { useCallback, useMemo } from "react";
import Modal from "../Modal";
import { defaultServer, modContract } from "@/constants";
import { useAccount, useContractWrite } from "wagmi";
import { ModalTypes, useModal } from "@/config/ModalProvider";
import { useTrackTransaction } from "@/config/TrackTxnProvider";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import VotePopup from "./VotePopup";
import CodeEditorInput from "@uiw/react-textarea-code-editor";

const ProposalInfo = ({ proposal }: { proposal: Proposal }) => {
  const { modalType, openModal, closeModal } = useModal();
  const { trackTxn } = useTrackTransaction();
  const { isConnected } = useAccount();
  const { open: connectWallet } = useWeb3Modal();

  const { write, isLoading: isConfirming } = useContractWrite<any, any, any>({
    ...modContract,
    functionName: "executeProposal",
    onSuccess(data) {
      trackTxn(data?.hash);
    },
    onSettled() {
      //close after a delay
      setTimeout(closeModal, 2000);
    },
  }) as any;

  const status = getStatus(proposal);

  const handleClick = useCallback(() => {
    if (!isConnected) return connectWallet();

    if (status == ProposalStatus.Proposed) return openModal(ModalTypes.Vote);
    if (status == ProposalStatus.Approved)
      return write?.({ args: [defaultServer, BigInt(proposal.id)] });
  }, [status, proposal]);

  const buttonText = useMemo(() => {
    if (status == ProposalStatus.Proposed) return "Vote";
    if (status == ProposalStatus.Approved) return "Execute";
  }, [status]);

  const StatusText = useCallback(() => {
    switch (status) {
      case ProposalStatus.Proposed:
        return <p className=" text-yellow-600 pl-1">proposed</p>;
      case ProposalStatus.Approved:
        return <p className=" text-green-600 pl-1">approved</p>;
      case ProposalStatus.Executed:
        return <p className="text-primary pl-1">executed</p>;
      case ProposalStatus.Declined:
        return <p className=" text-red-500 pl-1">declined</p>;
      default:
        return <p className=" text-yellow- pl-1">proposed</p>;
    }
  }, [status]);

  return (
    <div className=" flex flex-col  py-4 border-b">
      <div className="flex justify-between items-center">
        <div className="text-sm ">
          {moment(parseInt(proposal.proposedOn) * 1000).format(
            "MMMM Do YYYY, h:mm:ss a"
          )}
        </div>
        <div className="flex text-text ">
          Status : <StatusText />
        </div>
      </div>

      <div className="text-lg md:text-xl text-text font-medium py-1">
        <CodeEditorInput
          disabled
          value={proposal.checkFn}
          language="js"
          placeholder="Please enter JS code."
          padding={15}
          style={{
            backgroundColor: "#f5f5f5",
            fontFamily:
              "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
          }}
        />
        {proposal.checkFn}
      </div>
      <div className="text-lg md:text-xl text-text font-medium py-1">
        {proposal.ruleDescription}
      </div>
      <div className="flex justify-between">
        <div className="flex flex-col ">
          <div className="text-xs">Proposed by : {proposal.proposedBy}</div>
          <div className="text-sm"> In favours : {proposal.forVotes}</div>
          <div className="text-sm"> Against : {proposal.againstVotes}</div>
        </div>
        {status != ProposalStatus.Executed &&
          status != ProposalStatus.Declined && (
            <div>
              <button
                className="button text-lg px-4"
                disabled={!write || isConfirming}
                onClick={handleClick}
              >
                {buttonText}
              </button>
              {status === ProposalStatus.Proposed && (
                <Modal
                  isOpen={modalType === ModalTypes.Vote}
                  onClose={closeModal}
                >
                  <VotePopup proposal={proposal} />
                </Modal>
              )}
            </div>
          )}
      </div>
    </div>
  );
};

export default ProposalInfo;
