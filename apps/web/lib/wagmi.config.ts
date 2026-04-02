import { createConfig, http, cookieStorage, createStorage } from "wagmi";
import { sepolia } from "wagmi/chains";
import { metaMask, injected } from "wagmi/connectors";

export const UWT_CONTRACT_ADDRESS =
  (process.env.NEXT_PUBLIC_UWT_CONTRACT_ADDRESS as `0x${string}`) ??
  "0x0000000000000000000000000000000000000000";

export const SEPOLIA_CHAIN_ID = sepolia.id;

export function getWagmiConfig(): any {
  return createConfig({
    chains: [sepolia],
    ssr: true,
    storage: createStorage({
      storage: cookieStorage,
    }),
    connectors: [metaMask(), injected()],
    transports: {
      [sepolia.id]: http(
        process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL ?? "https://rpc.sepolia.org",
      ),
    },
  });
}
