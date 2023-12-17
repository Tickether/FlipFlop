import { ChainId, TokenInfo, ethGasToken, getUsdc, getWeth } from "@decent.xyz/box-common";
import { pusdceToken, pwethToken, pdaiToken } from "../constants";
import { Dispatch, PropsWithChildren, createContext, useReducer } from "react";

export const chainIconsPWETH: { [key: number]: string } = {
  [ChainId.ETHEREUM]: "/ethereum.svg",
  [ChainId.OPTIMISM]: "/optimism.svg",
  [ChainId.ARBITRUM]: "/arbitrum.svg",
  [ChainId.POLYGON]: "/polygon.svg",
  [ChainId.BASE]: "/base.png",
  [ChainId.AVALANCHE]: "/avalanche.svg",
};

export const chainNamesPWETH: { [key: number]: string } = {
  [ChainId.ETHEREUM]: "Ethereum",
  [ChainId.OPTIMISM]: "OP Mainnet",
  [ChainId.ARBITRUM]: "Arbitrum One",
  [ChainId.POLYGON]: "Polygon",
  [ChainId.BASE]: "Base",
  [ChainId.AVALANCHE]: "Avalanche",
};

export const destChainIconsPWETH: { [key: number]: string } = {

  [ChainId.OPTIMISM]: "/optimism.svg",

};

export const destChainNamesPWETH: { [key: number]: string } = {

  [ChainId.OPTIMISM]: "OP Mainnet",

};

export type RouteVars = {
  srcChain: ChainId;
  srcToken: TokenInfo;
  dstChain: ChainId;
  dstToken: TokenInfo;
  sameChain: boolean;
  purchaseName: string;
};


export const RouteSelectContextPWETH = createContext<{
  routeVarsPWETH: RouteVars;
  updateRouteVarsPWETH: Dispatch<Partial<RouteVars>>;
}>({
  routeVarsPWETH: {
    srcChain: ChainId.OPTIMISM,
    srcToken: getDefaultToken(ChainId.OPTIMISM),
    dstChain: ChainId.OPTIMISM,
    dstToken: pwethToken,
    purchaseName: "",
    sameChain: false,
  },
  updateRouteVarsPWETH: () => {},
});


function routeReducerPWETH(prev: RouteVars, next: Partial<RouteVars>) {
  const newVars = { ...prev, ...next };

  if (newVars.dstChain !== prev.dstChain && !next.dstToken) {
    newVars.dstToken = getDefaultToken(newVars.dstChain);
  }

  newVars.sameChain =
    newVars.srcChain == newVars.dstChain &&
    newVars.srcToken.address == newVars.dstToken.address;

  return newVars;
}

export function getDefaultToken(chainId: ChainId) {
  const wethToken: TokenInfo = {
    address: getWeth(chainId),
    decimals: 18,
    name: "Wrapped Ethereum",
    symbol: "WETH",
    logo: `https://assets.coingecko.com/coins/images/2518/standard/weth.png`,
    chainId: chainId,
    isNative: false,
  };
  return { ...wethToken, chainId };
}


export default function RouteSelectProviderPWETH({ children }: PropsWithChildren) {
  const [routeVarsPWETH, updateRouteVarsPWETH] = useReducer(routeReducerPWETH, {
    srcChain: ChainId.ARBITRUM,
    srcToken: ethGasToken,
    dstChain: ChainId.OPTIMISM,
    dstToken: pwethToken,
    sameChain: false,
    purchaseName: "",
  });

  const value = { routeVarsPWETH, updateRouteVarsPWETH };

  return (
    <RouteSelectContextPWETH.Provider value={value}>
      {children}
    </RouteSelectContextPWETH.Provider>
  );
}


