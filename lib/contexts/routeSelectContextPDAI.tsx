import { BaseAssets, ChainId, TokenInfo, ethGasToken, getBaseAssetsInfo, getUsdc } from "@decent.xyz/box-common";
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
    srcToken: getDefaultToken(ChainId.OPTIMISM),//getBaseAssetsInfo({chainId: ChainId.OPTIMISM, asset: BaseAssets.DAI}),
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
  /*
  
  */
  const baseToken = getBaseAssetsInfo({chainId: chainId, asset: BaseAssets.DAI})
  const daiToken: TokenInfo = {
    address: baseToken.address,
    decimals: baseToken.decimals,
    name: baseToken.name,
    symbol: baseToken.symbol,
    logo: `https://assets.coingecko.com/coins/images/9956/standard/Badge_Dai.png`,
    chainId: baseToken.chainId,
    isNative: false,
  };
 

  console.log(daiToken)
  return { ...daiToken, chainId };
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

