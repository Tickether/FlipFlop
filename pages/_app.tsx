import "@decent.xyz/box-ui/index.css";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import {
  arbitrum,
  mainnet,
  optimism,
  polygon,
  base,
  avalanche,
} from "wagmi/chains";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { alchemyProvider } from "wagmi/providers/alchemy";
import localFont from "next/font/local";
import { BoxHooksContextProvider } from "@decent.xyz/box-hooks";
import { BoxActionContextProvider } from "../lib/contexts/decentActionContext";
import RouteSelectProvider from "../lib/contexts/routeSelectContext";
import { ToastContainer } from 'react-toastify';
import React from "react";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    mainnet,
    polygon,
    optimism,
    arbitrum,
    base,
    avalanche,
  ],
  [  
    alchemyProvider({
      apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
    }),
    publicProvider()
  ],
);
const { connectors } = getDefaultWallets({
  appName: 'FlipFLop',
  projectId: process.env.NEXT_PUBLIC_W3M_PROJECT_ID,
  chains,
});
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

export const monument = localFont({
  src: "../fonts/EduMonumentGroteskVariable.woff2",
  variable: "--font-monument",
});



export default function App({ Component, pageProps }: AppProps) {
  
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])

  return (
    <div
      className={`${monument.variable} font-sans flex flex-col min-h-screen`}
    >
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider chains={chains}>
          <BoxHooksContextProvider
            apiKey={process.env.NEXT_PUBLIC_DECENT_API_KEY as string}
          >
            <RouteSelectProvider>
              <BoxActionContextProvider>
                <div className={`${monument.variable} font-sans`}>
                  {
                    mounted && <Component {...pageProps} />
                  }
                </div>
              </BoxActionContextProvider>
            </RouteSelectProvider>
          </BoxHooksContextProvider>
        </RainbowKitProvider>
      </WagmiConfig>
    </div>
  );
}
