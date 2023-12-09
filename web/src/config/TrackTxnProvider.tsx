"use client";
import React, { createContext, useState, useContext, ReactNode } from "react";
import { toast } from "react-toastify";
import { Hash } from "viem";
import { useWaitForTransaction } from "wagmi";
import getConfig from "./useConfig";
import { useAppDispatch } from "@/store/hooks";
import { fetchRules } from "@/store/features/rules";
import { fetchProposals } from "@/store/features/proposals";

interface TrackContextType {
  trackTxn: (hash: Hash | undefined) => void;
}

interface TrackTxnProviderProps {
  children: ReactNode;
}

const TrackContext = createContext<TrackContextType | undefined>(undefined);

export const TrackTxnProvider: React.FC<TrackTxnProviderProps> = ({
  children,
}) => {
  const dispatch = useAppDispatch();

  const [hash, setHash] = useState<Hash | undefined>();
  const [guildId, setGuildId] = useState<string | undefined>();

  const trackTxn = (hash: Hash | undefined, guildId?: string | undefined) => {
    setHash(hash);
    setGuildId(guildId);

    toast.loading("Transacion Submitted!", toastConfig);
  };

  const { toastConfig } = getConfig();

  useWaitForTransaction({
    hash: hash,
    onError(err) {
      toast.dismiss();
      toast.error("Transaction Failed!", toastConfig);
    },
    onSettled: (data, error) => {
      toast.dismiss();
      toast.success("Transaction Successful!", toastConfig);

      //update store
      if (guildId) {
        dispatch(fetchRules(guildId));
        dispatch(fetchProposals(guildId));
      }
      setHash(undefined);
    },
  });

  return (
    <TrackContext.Provider value={{ trackTxn }}>
      {children}
    </TrackContext.Provider>
  );
};

export const useTrackTransaction = () => {
  const context = useContext(TrackContext);
  if (context === undefined) {
    throw new Error(
      "useTrackTransaction must be used within a TrackTxnProvider"
    );
  }
  return context;
};
