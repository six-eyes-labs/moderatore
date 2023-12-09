"use client";
import { Proposal } from "@/store/types";
import { useContractWrite } from "wagmi";
import { defaultServer, modContract } from "@/constants";
import { useModal } from "@/config/ModalProvider";
import { useTrackTransaction } from "@/config/TrackTxnProvider";

const VotePopup = ({ proposal }: { proposal: Proposal }) => {
  const { closeModal } = useModal();
  const { trackTxn } = useTrackTransaction();

  const { write, isLoading: isConfirming } = useContractWrite({
    ...modContract,
    functionName: "vote",
    onSuccess(data) {
      trackTxn(data?.hash);
    },
    onSettled() {
      //close after a delay
      setTimeout(closeModal, 2000);
    },
  });

  return (
    <>
      <h2 className="text-2xl font-semibold py-2">Vote for proposal</h2>
      <p className="text-sm md:text-base pb-4">
        Vote in favour or against the proposal.
      </p>
      <p className="flex text-text text-lg font-medium py-4">
        Rule : {proposal.ruleDescription}
      </p>
      <p className="flex text-text text-lg font-medium py-4">
        CheckFn : {proposal.checkFn}
      </p>
      <div className="flex justify-around items-center py-2">
        <button
          className="button"
          disabled={!write || isConfirming}
          onClick={() =>
            write?.({
              args: [
                BigInt(1149),
                BigInt(proposal.id),
                BigInt(1),
                defaultServer,
              ],
            })
          }
        >
          Favour
        </button>
        <button
          className="button"
          disabled={!write}
          onClick={() =>
            write?.({
              args: [
                BigInt(1149),
                BigInt(proposal.id),
                BigInt(0),
                defaultServer,
              ],
            })
          }
        >
          Against
        </button>
      </div>
    </>
  );
};

export default VotePopup;
