"use client";

import { useAccount, useConnect, useDisconnect, useReadContract } from "wagmi";
import { metaMask } from "wagmi/connectors";
import { Button } from "@workspace/ui/components/button";
import Image from "next/image";

export function ConnectWallet() {
  const { address, isConnected } = useAccount();
  const { connect, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected && address) {
    return (
      <Button
        variant="destructive"
        className="rounded-none shadow-none font-normal"
        onClick={() => disconnect()}
      >
        Disconnect
      </Button>
    );
  }

  return (
    <Button
      onClick={() => connect({ connector: metaMask() })}
      disabled={isConnecting}
      variant="outline"
      className="rounded-none shadow-none font-normal"
    >
      <Image src="/metamask.svg" height={16} width={16} alt="metamask_logo" />
      {isConnecting ? "Connecting…" : "Connect MetaMask"}
    </Button>
  );
}
