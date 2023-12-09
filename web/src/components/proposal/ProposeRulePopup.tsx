import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { defaultServer, modContract } from "@/constants";
import React from "react";
import { parseEther } from "viem";
import { useModal } from "@/config/ModalProvider";
import { useTrackTransaction } from "@/config/TrackTxnProvider";

const ProposeRulePopup = () => {
  const [input, setInput] = React.useState("");
  const [desc, setDesc] = React.useState("");
  const { closeModal } = useModal();
  const { trackTxn } = useTrackTransaction();

  const { config } = usePrepareContractWrite({
    ...modContract,
    functionName: "proposeRule",
    args: [defaultServer, desc, input],
    value: parseEther("0.00001"),
    enabled: Boolean(input),
  });

  const { write, isLoading: isConfirming } = useContractWrite({
    ...config,
    onSuccess(data) {
      trackTxn(data?.hash);
    },
    onSettled() {
      //close after a delay
      setTimeout(closeModal, 2000);
    },
  });

  return (
    <div>
      <div className="mb-4">
        <label
          className="block text-gray-700 text-2xl font-bold mb-2"
          htmlFor={"Rule"}
        >
          Propose a Rule
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id={"Rule"}
          type="text"
          placeholder={"Type the rule here."}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
          }}
        />
      </div>
      <p className="text-xs md:text-sm text-text pb-4">
        Note : An fee is required to propose a rule. If proposal is not
        accepted, the fee will be refunded.
      </p>
      <button
        disabled={!write || isConfirming}
        onClick={write}
        className="button bg-primary border-white text-gray-300 text-md self-end"
      >
        {isConfirming ? "Confirming" : "Submit"}
      </button>
    </div>
  );
};

export default ProposeRulePopup;
