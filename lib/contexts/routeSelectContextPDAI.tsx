import { ChainId, TokenInfo, ethGasToken, getUsdc } from "@decent.xyz/box-common";
import { pusdceToken, pwethToken, pdaiToken } from "../constants";
import { Dispatch, PropsWithChildren, createContext, useReducer } from "react";

export const chainIconsPDAI: { [key: number]: string } = {
  [ChainId.ETHEREUM]: "/ethereum.svg",
  [ChainId.OPTIMISM]: "/optimism.svg",
  [ChainId.ARBITRUM]: "/arbitrum.svg",
  [ChainId.POLYGON]: "/polygon.svg",
  [ChainId.BASE]: "/base.png",
  [ChainId.AVALANCHE]: "/avalanche.svg",
};

export const chainNamesPDAI: { [key: number]: string } = {
  [ChainId.ETHEREUM]: "Ethereum",
  [ChainId.OPTIMISM]: "OP Mainnet",
  [ChainId.ARBITRUM]: "Arbitrum One",
  [ChainId.POLYGON]: "Polygon",
  [ChainId.BASE]: "Base",
  [ChainId.AVALANCHE]: "Avalanche",
};

export const destChainIconsPDAI: { [key: number]: string } = {

  [ChainId.OPTIMISM]: "/optimism.svg",

};

export const destChainNamesPDAI: { [key: number]: string } = {

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

export const RouteSelectContextPDAI = createContext<{
  routeVarsPDAI: RouteVars;
  updateRouteVarsPDAI: Dispatch<Partial<RouteVars>>;
}>({
  routeVarsPDAI: {
    srcChain: ChainId.OPTIMISM,
    srcToken: getDefaultToken(ChainId.OPTIMISM),
    dstChain: ChainId.OPTIMISM,
    dstToken: pdaiToken,
    purchaseName: "",
    sameChain: false,
  },
  updateRouteVarsPDAI: () => {},
});

function routeReducerPDAI(prev: RouteVars, next: Partial<RouteVars>) {
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
  const usdcToken: TokenInfo = {
    address: getUsdc(chainId),
    decimals: 6,
    name: "USD Coin",
    symbol: "USDC",
    logo: `https://s3.coinmarketcap.com/static-gravity/image/5a8229787b5e4c809b5914eef709b59a.png`,
    chainId: chainId,
    isNative: false,
  };
  return { ...usdcToken, chainId };
}


export default function RouteSelectProviderPDAI({ children }: PropsWithChildren) {
  const [routeVarsPDAI, updateRouteVarsPDAI] = useReducer(routeReducerPDAI, {
    srcChain: ChainId.ARBITRUM,
    srcToken: ethGasToken,
    dstChain: ChainId.OPTIMISM,
    dstToken: pdaiToken,
    sameChain: false,
    purchaseName: "",
  });

  const value = { routeVarsPDAI, updateRouteVarsPDAI };

  return (
    <RouteSelectContextPDAI.Provider value={value}>
      {children}
    </RouteSelectContextPDAI.Provider>
  );
}

