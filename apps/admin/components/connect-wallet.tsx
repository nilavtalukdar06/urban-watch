"use client";

/**
 * apps/web/modules/profile/components/connect-wallet.tsx
 *
 * MetaMask connect/disconnect button + UWT balance display.
 * Shows the citizen their UWT token balance on Sepolia.
 */

import { useAccount, useConnect, useDisconnect, useReadContract } from "wagmi";
import { metaMask } from "wagmi/connectors";
import { formatUnits } from "viem";
import { UWT_ABI } from "@/lib/uwt.abi";
import { UWT_CONTRACT_ADDRESS } from "@/lib/wagmi.config";
import { Button } from "@workspace/ui/components/button";
import Image from "next/image";

export function ConnectWallet() {
  const { address, isConnected, chain } = useAccount();
  const { connect, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();

  // Fetch UWT balance for the connected wallet
  const { data: rawBalance, isLoading: balanceLoading } = useReadContract({
    address: UWT_CONTRACT_ADDRESS,
    abi: UWT_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const balance = rawBalance
    ? parseFloat(formatUnits(rawBalance as bigint, 18)).toFixed(2)
    : "0.00";

  const isWrongNetwork = isConnected && chain?.id !== 11155111;

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-3 rounded-none border border-neutral-200 bg-white px-4 py-2">
        {isWrongNetwork && (
          <span className="rounded bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
            Switch to Sepolia
          </span>
        )}
        <span className="text-sm font-medium text-neutral-700">
          {balanceLoading ? "…" : balance} UWT
        </span>
        <span className="hidden max-w-[120px] truncate text-xs text-neutral-400 sm:block">
          {address}
        </span>
        <button
          onClick={() => disconnect()}
          className="rounded-none bg-red-500 px-3 py-1 text-xs font-medium text-white hover:bg-red-600 transition-colors"
        >
          Disconnect
        </button>
      </div>
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
