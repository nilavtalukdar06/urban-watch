"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { metaMask } from "wagmi/connectors";
import { useMutation } from "convex/react";
import { api } from "@workspace/backend/convex/_generated/api";
import { useState } from "react";
import { Button } from "@workspace/ui/components/button";
import Image from "next/image";

export function CryptoWalletSetup() {
  const { address, isConnected, chain } = useAccount();
  const { connect, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  // Convex mutation – add `walletAddress` field to `organization` table
  // and create this mutation in packages/backend/convex/functions/organizations.ts
  const updateOrgWallet = useMutation(
    api.functions.organizations.updateWalletAddress,
  );

  const isWrongNetwork = isConnected && chain?.id !== 11155111;

  async function handleSaveWallet() {
    if (!address) return;
    setSaving(true);
    try {
      await updateOrgWallet({ walletAddress: address });
      setSaved(true);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-none border border-neutral-200 bg-white p-5 shadow-none space-y-4">
      <div>
        <h3 className="font-semibold text-neutral-800">
          Crypto Donation Wallet
        </h3>
        <p className="text-sm text-neutral-500 mt-1">
          Connect a MetaMask wallet to receive ETH donations from citizens. Your
          address will be visible to donors.
        </p>
      </div>

      {!isConnected ? (
        <Button
          onClick={() => connect({ connector: metaMask() })}
          disabled={isConnecting}
          variant="outline"
          className="rounded-none shadow-none font-normal"
        >
          <Image
            src="/metamask.svg"
            height={16}
            width={16}
            alt="metamask_logo"
          />
          {isConnecting ? "Connecting…" : "Connect MetaMask"}
        </Button>
      ) : (
        <div className="space-y-3">
          {isWrongNetwork && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700">
              ⚠️ Please switch MetaMask to Sepolia Testnet.
            </div>
          )}

          <div className="rounded-none bg-neutral-50 border border-neutral-200 px-3 py-2 font-mono text-xs text-neutral-700 break-all">
            {address}
          </div>

          <div className="flex gap-2">
            {!saved ? (
              <Button
                onClick={handleSaveWallet}
                disabled={saving || isWrongNetwork}
                className="rounded-none shadow-none font-normal"
              >
                {saving ? "Saving…" : "Save Wallet Address"}
              </Button>
            ) : (
              <span className="rounded-none bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
                ✓ Wallet saved
              </span>
            )}
            <Button
              onClick={() => disconnect()}
              variant="outline"
              className="font-normal rounded-none shadow-none"
            >
              Disconnect
            </Button>
          </div>

          <p className="text-xs text-neutral-400">
            ETH donations go directly to this wallet. The Urban Watch contract
            only forwards the funds — it does not hold them.
          </p>
        </div>
      )}
    </div>
  );
}
