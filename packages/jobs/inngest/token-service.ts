/**
 * packages/jobs/inngest/web3/token-service.ts
 *
 * Server-side minting / penalising via ethers.js v6.
 * Called from Inngest workflow steps — NEVER runs in the browser.
 *
 * Required env vars (add to .env and Inngest dashboard):
 *   UWT_ADMIN_PRIVATE_KEY   – private key of the contract owner wallet
 *   NEXT_PUBLIC_UWT_CONTRACT_ADDRESS – deployed contract address on Sepolia
 *   NEXT_PUBLIC_SEPOLIA_RPC_URL      – Alchemy/Infura Sepolia RPC URL
 *
 * Install: pnpm add ethers  (v6) in packages/jobs
 */
//@ts-nocheck

import { ethers } from "ethers";

// ── ABI (only the functions we call server-side) ────────────────────────────
const ADMIN_ABI = [
  "function mint(address to, uint256 amount) external",
  "function burn(address from, uint256 amount) external",
  "function balanceOf(address account) view returns (uint256)",
];

function getContract() {
  const rpcUrl = process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL;
  const privateKey = process.env.UWT_ADMIN_PRIVATE_KEY;
  const contractAddress = process.env.NEXT_PUBLIC_UWT_CONTRACT_ADDRESS;

  if (!rpcUrl || !privateKey || !contractAddress) {
    throw new Error(
      "Missing UWT env vars: NEXT_PUBLIC_SEPOLIA_RPC_URL, UWT_ADMIN_PRIVATE_KEY, NEXT_PUBLIC_UWT_CONTRACT_ADDRESS",
    );
  }

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const signer = new ethers.Wallet(privateKey, provider);
  return new ethers.Contract(contractAddress, ADMIN_ABI, signer);
}

/**
 * Reward a citizen for a valid (non-spam) report submission: +10 UWT.
 * @param citizenWalletAddress  The citizen's connected MetaMask address.
 */
export async function rewardReportSubmission(
  walletAddress: string,
): Promise<string> {
  const contract = getContract();
  const tx = await contract.mint(walletAddress, 10);
  const receipt = await tx.wait();
  return receipt.hash as string;
}

export async function rewardReportResolution(
  walletAddress: string,
): Promise<string> {
  const contract = getContract();
  const tx = await contract.mint(walletAddress, 20);
  const receipt = await tx.wait();
  return receipt.hash as string;
}

export async function penalizeSpamReport(
  walletAddress: string,
): Promise<string> {
  const contract = getContract();
  const tx = await contract.burn(walletAddress, 5);
  const receipt = await tx.wait();
  return receipt.hash as string;
}
/**
 * Generic reward — use when Inngest needs full control over amount.
 */
export async function rewardCitizen(
  citizenWalletAddress: string,
  tokenAmount: number,
  reason: string,
): Promise<string> {
  const contract = getContract();
  const amount = ethers.parseUnits(tokenAmount.toString(), 18);
  const tx = await contract.rewardCitizen(citizenWalletAddress, amount, reason);
  const receipt = await tx.wait();
  return receipt.hash as string;
}

/**
 * Read a citizen's current UWT balance (for logging / display in admin).
 */
export async function getTokenBalance(
  citizenWalletAddress: string,
): Promise<string> {
  const contract = getContract();
  const raw: bigint = await contract.balanceOf(citizenWalletAddress);
  return ethers.formatUnits(raw, 18);
}
