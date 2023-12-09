"use client";
import { WagmiConfig } from "wagmi";
import { wagmiConfig } from "./wagmiClient.js";
import React from "react";

export function WagmiProvider({ children }: { children: React.ReactNode }) {
  return <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>;
}
