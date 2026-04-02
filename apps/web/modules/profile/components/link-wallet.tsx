"use client";

/**
 * apps/web/modules/profile/components/link-wallet.tsx
 *
 * Added to the citizen onboarding form (or verify-account page).
 * Citizens connect MetaMask once; we store the address in Convex
 * so the Inngest token-service can find it server-side.
 */

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { metaMask } from "wagmi/connectors";
import { useMutation } from "convex/react";
import { api } from "@workspace/backend/convex/_generated/api";
import { useState, useEffect } from "react";

interface Props {
  /** Called after the wallet address is successfully saved to Convex */
  onLinked?: (address: string) => void;
  existingWallet?: string;
}

export function LinkWallet({ onLinked, existingWallet }: Props) {
  const { address, isConnected } = useAccount();
  const { connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const [saved, setSaved] = useState(!!existingWallet);
  const [error, setError] = useState<string | null>(null);

  // Convex mutation defined in packages/backend/convex/functions/users.ts
  const saveWallet = useMutation(api.functions.users.updateWalletAddress);

  // Auto-save when wallet connects (if it's different from what's stored)
  useEffect(() => {
    if (isConnected && address && address !== existingWallet && !saved) {
      handleSave(address);
    }
  }, [isConnected, address]);

  async function handleSave(addr: string) {
    setError(null);
    try {
      await saveWallet({ walletAddress: addr });
      setSaved(true);
      onLinked?.(addr);
    } catch (e: any) {
      setError(e.message ?? "Failed to save wallet.");
    }
  }

  if (saved && (existingWallet || address)) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3">
        <span className="text-green-600">✓</span>
        <div>
          <p className="text-sm font-medium text-green-700">Wallet linked</p>
          <p className="font-mono text-xs text-green-600 break-all">
            {existingWallet ?? address}
          </p>
        </div>
        <button
          onClick={() => {
            setSaved(false);
            disconnect();
          }}
          className="ml-auto text-xs text-neutral-400 underline"
        >
          Change
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4 space-y-3">
      <div>
        <p className="text-sm font-medium text-neutral-800">
          Link your Ethereum Wallet
        </p>
        <p className="text-xs text-neutral-500 mt-0.5">
          Connect MetaMask to receive UWT reward tokens when your reports are
          submitted and resolved.
        </p>
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}

      {!isConnected ? (
        <button
          onClick={() => connect({ connector: metaMask() })}
          disabled={isPending}
          className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60 transition-colors"
        >
          {isPending ? "Connecting…" : "Connect MetaMask"}
        </button>
      ) : (
        <div className="space-y-2">
          <p className="font-mono text-xs text-neutral-600 break-all">
            {address}
          </p>
          <button
            onClick={() => handleSave(address!)}
            className="rounded-lg bg-green-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-green-700 transition-colors"
          >
            Save this wallet
          </button>
        </div>
      )}
    </div>
  );
}
