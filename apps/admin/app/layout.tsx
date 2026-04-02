import { Geist, Geist_Mono } from "next/font/google";
import "@workspace/ui/globals.css";
import { Providers } from "@/components/providers";
import { ClerkProvider } from "@clerk/nextjs";
import { ConvexClientProvider } from "@/components/convex-client-provider";
import { Toaster } from "@workspace/ui/components/sonner";
import { Web3Provider } from "@/components/web3-provider";
import { cookieToInitialState } from "wagmi";
import { getWagmiConfig } from "@/lib/wagmi.config";
import { headers } from "next/headers";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialState = cookieToInitialState(
    getWagmiConfig(),
    (await headers()).get("cookie"),
  );
  return (
    <ClerkProvider
      appearance={{
        layout: {
          unsafe_disableDevelopmentModeWarnings: true,
        },
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased `}
        >
          <ConvexClientProvider>
            <Providers>
              <Web3Provider initialState={initialState}>
                {children}
              </Web3Provider>
            </Providers>
          </ConvexClientProvider>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
