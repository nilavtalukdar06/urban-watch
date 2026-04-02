"use client";

import { WagmiProvider, State } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getWagmiConfig } from "@/lib/wagmi.config";
import { useState, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  initialState?: State;
}

export function Web3Provider({ children, initialState }: Props) {
  const [queryClient] = useState(() => new QueryClient());
  const [config] = useState(() => getWagmiConfig());

  return (
    <WagmiProvider config={config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
