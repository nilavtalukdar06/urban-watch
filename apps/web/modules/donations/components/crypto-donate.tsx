import { useState } from "react";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  useBalance,
} from "wagmi";
import { parseEther, formatEther } from "viem";
import { UWT_ABI } from "@/lib/uwt.abi";
import { UWT_CONTRACT_ADDRESS } from "@/lib/wagmi.config";
import { ConnectWallet } from "../../profile/components/connect-wallet";

interface Props {
  orgId: string;
  orgWallet: `0x${string}`;
  orgName: string;
}

export function CryptoDonate({ orgId, orgWallet, orgName }: Props) {
  const { address, isConnected } = useAccount();
  const [ethAmount, setEthAmount] = useState("");
  const [donateError, setDonateError] = useState<string | null>(null);

  // Native ETH balance
  const { data: ethBalance } = useBalance({
    address,
    query: { enabled: !!address },
  });

  const {
    writeContract,
    data: txHash,
    isPending: isSubmitting,
    error: writeError,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash: txHash });

  function handleDonate() {
    setDonateError(null);
    const amount = parseFloat(ethAmount);
    if (isNaN(amount) || amount <= 0) {
      setDonateError("Enter a valid ETH amount.");
      return;
    }
    if (!orgWallet) {
      setDonateError("This organisation has not set up a wallet yet.");
      return;
    }

    writeContract({
      address: UWT_CONTRACT_ADDRESS,
      abi: UWT_ABI,
      functionName: "donateTo",
      args: [orgId, orgWallet],
      value: parseEther(ethAmount),
    });
  }

  if (!isConnected) {
    return (
      <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
        <p className="mb-3 text-sm text-neutral-600">
          Connect your MetaMask wallet to donate ETH directly to{" "}
          <strong>{orgName}</strong>.
        </p>
        <ConnectWallet />
      </div>
    );
  }

  if (isConfirmed) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-5">
        <p className="font-semibold text-green-700">🎉 Donation confirmed!</p>
        <p className="mt-1 text-sm text-green-600">
          {ethAmount} ETH sent to {orgName}.
        </p>
        <a
          href={`https://sepolia.etherscan.io/tx/${txHash}`}
          target="_blank"
          rel="noreferrer"
          className="mt-2 block text-xs text-blue-500 underline"
        >
          View on Etherscan →
        </a>
        <button
          onClick={() => {
            setEthAmount("");
          }}
          className="mt-3 text-xs text-neutral-500 underline"
        >
          Donate again
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm space-y-4">
      <div>
        <h3 className="font-semibold text-neutral-800">
          Donate ETH to {orgName}
        </h3>
        {ethBalance && (
          <p className="text-xs text-neutral-400 mt-0.5">
            Your balance: {parseFloat(formatEther(ethBalance.value)).toFixed(4)}{" "}
            ETH
          </p>
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="number"
          min="0"
          step="0.001"
          placeholder="0.01"
          value={ethAmount}
          onChange={(e) => setEthAmount(e.target.value)}
          className="flex-1 rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
        <span className="flex items-center text-sm text-neutral-500">ETH</span>
      </div>

      {(donateError || writeError) && (
        <p className="text-xs text-red-600">
          {donateError ?? (writeError as Error)?.message}
        </p>
      )}

      <button
        onClick={handleDonate}
        disabled={isSubmitting || isConfirming || !ethAmount}
        className="w-full rounded-xl bg-orange-500 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-50 transition-colors"
      >
        {isSubmitting
          ? "Confirm in MetaMask…"
          : isConfirming
            ? "Waiting for confirmation…"
            : "Donate ETH"}
      </button>

      <p className="text-xs text-neutral-400">
        Transactions are on Sepolia testnet. ETH goes directly to the
        organisation's wallet — no intermediaries.
      </p>
    </div>
  );
}
