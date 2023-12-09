import { Rule } from "@/store/types";
import React, { useCallback, useState } from "react";
import { useContractWrite } from "wagmi";
import { modContract } from "@/constants";
import { useGetOpposableRules } from "@/store/hooks";
import { parseEther } from "viem";
import { useModal } from "@/config/ModalProvider";
import { useTrackTransaction } from "@/config/TrackTxnProvider";
import { publishEvidence } from "@/utils/helpers";

const OpposeRulePopup = () => {
  const [selectedOption, setSelectedOption] = useState<Rule | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { closeModal } = useModal();
  const { trackTxn } = useTrackTransaction();
  const rules = useGetOpposableRules();

  const handleOptionClick = (option: Rule) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  const { write, isLoading: isConfirming } = useContractWrite({
    ...modContract,
    functionName: "opposeRule",
    value: parseEther("0.0001"), // currently hardcoded for testing
    onSuccess(data) {
      trackTxn(data?.hash);
    },
    onSettled() {
      //close after a delay
      setTimeout(closeModal, 2000);
    },
  });

  const handleSubmit = useCallback(async () => {
    if (!selectedOption) return;
    const evidence = await publishEvidence(selectedOption);
    write?.({
      args: [BigInt(selectedOption!.id), evidence],
    });
  }, [selectedOption]);

  return (
    <div>
      <h2 className="text-text text-2xl font-semibold py-2">Oppose a rule</h2>
      <p className="text-sm md:text-base pb-4">
        Select a rule to oppose in Kleros court.
      </p>
      <div className="relative pb-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-gray-100 text-gray-700 py-2 px-4 rounded inline-flex items-center"
        >
          {selectedOption?.description || "Select a rule"}
          <svg
            className="w-4 h-4 ml-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
        {isOpen && (
          <div className="absolute mt-2 py-2 w-full bg-white border border-gray-300 rounded shadow-lg">
            {rules.map((rule, index) => (
              <div
                key={index}
                className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                onClick={() => handleOptionClick(rule)}
              >
                {rule.description}
              </div>
            ))}
          </div>
        )}
      </div>
      <p className="text-xs md:text-sm text-text pb-4">
        Note : An arbitration fee is required to oppose a rule. If won, the fee
        will be refunded.
      </p>
      <button
        disabled={!selectedOption || !write || isConfirming}
        onClick={handleSubmit}
        className="button bg-primary border-white text-gray-300 text-md self-end"
      >
        {isConfirming ? "Confirming" : "Submit"}
      </button>
    </div>
  );
};

export default OpposeRulePopup;
