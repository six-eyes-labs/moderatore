"use client";
import Modal from "@/components/Modal";
import Paginate from "@/components/Paginate";
import ProposalInfo from "@/components/proposal/ProposalInfo";
import ProposeRulePopup from "@/components/proposal/ProposeRulePopup";
import RuleInfo from "@/components/rule/RuleInfo";
import { ModalTypes, useModal } from "@/config/ModalProvider";
import { arbitratorSite, defaultServer } from "@/constants";
import { fetchProposals } from "@/store/features/proposals";
import { fetchRules } from "@/store/features/rules";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { useAccount } from "wagmi";

export default function Home() {
  const dispatch = useAppDispatch();
  const proposalEntities = useAppSelector((state) => state.proposals.entities);
  const ruleEntities = useAppSelector((state) => state.rules.entities);

  const { isConnected } = useAccount();
  const { open: connectWallet } = useWeb3Modal();

  const { modalType, openModal, closeModal } = useModal();

  const [currentProposalPage, setCurrentProposalPage] = useState(1);
  const [currentRulePage, setCurrentRulePage] = useState(1);
  const pageSize = 4;

  const proposals = useMemo(() => {
    const startIndex = (currentProposalPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return proposalEntities.slice(startIndex, endIndex);
  }, [proposalEntities, currentProposalPage]);

  const rules = useMemo(() => {
    const startIndex = (currentRulePage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return ruleEntities.slice(startIndex, endIndex);
  }, [ruleEntities, currentRulePage]);

  const handleClick = () =>
    isConnected ? openModal(ModalTypes.ProposeRule) : connectWallet();

  useEffect(() => {
    dispatch(fetchProposals(defaultServer));
    dispatch(fetchRules(defaultServer));
  }, []);

  return (
    <div className="flex flex-col w-full h-full min-h-full justify-start  py-20 md:py-24">
      <div className="min-h-full">
        <div className="flex justify-between content-center items-center">
          <div className="flex flex-col">
            <div className="heading items-start"> Proposals</div>
            <div className="subheading items-start">
              Explore all the proposed rules
            </div>
          </div>
          <button
            onClick={handleClick}
            className="button bg-secondary text-text text-md md:text-lg"
          >
            Propose a Rule!
          </button>
          <Modal
            isOpen={modalType === ModalTypes.ProposeRule}
            onClose={closeModal}
          >
            <ProposeRulePopup />
          </Modal>
        </div>

        <div className=" py-3">
          {proposals.map((proposal, index) => (
            <ProposalInfo proposal={proposal} key={index} />
          ))}
        </div>
        <Paginate
          totalCount={proposalEntities.length}
          currentPage={currentProposalPage}
          pageSize={pageSize}
          setPage={setCurrentProposalPage}
        />
      </div>
      <div className="min-h-full">
        <div className="flex justify-between content-center items-center">
          <div className="flex flex-col">
            <div className="heading items-start"> Rules</div>
            <div className="subheading items-start">
              List of rules community should abide by.
            </div>
          </div>
          <div className="flex gap-2 flex-col md:flex-row">
            <button
              onClick={handleClick}
              className="button bg-secondary text-text text-md md:text-lg"
            >
              Oppose a Rule!
            </button>
            <Link
              className="button flex gap-2 items-center bg-primary text-gray-400 text-md md:text-lg"
              href={arbitratorSite}
              target="_blank"
              rel="noreferrer"
            >
              Disputes{" "}
            </Link>
          </div>

          <Modal
            isOpen={modalType === ModalTypes.OpposeRule}
            onClose={closeModal}
          >
            <div>hi</div>
          </Modal>
        </div>

        <div className="py-4">
          {rules.map((rule, index) => (
            <RuleInfo rule={rule} key={index} index={index} />
          ))}
        </div>
        <Paginate
          totalCount={ruleEntities.length}
          pageSize={pageSize}
          setPage={setCurrentRulePage}
          currentPage={currentRulePage}
        />
      </div>

      {/* //rules */}
    </div>
  );
}
