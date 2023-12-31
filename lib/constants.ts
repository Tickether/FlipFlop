import { ChainId, TokenInfo } from "@decent.xyz/box-common";
import { zeroAddress } from "viem";



export const polygonGasToken: TokenInfo = {
  address: zeroAddress,
  decimals: 18,
  name: "Matic",
  symbol: "MATIC",
  logo: "https://cryptologos.cc/logos/polygon-matic-logo.png?v=025",
  chainId: ChainId.POLYGON,
  isNative: true,
};
export const DAI_OPTIMISM = "0xda10009cbd5d07dd0cecc66161fc93d7c9000da1";

export const daiToken: TokenInfo = {
  address: DAI_OPTIMISM,
  decimals: 18,
  name: "Dai Stablecoin",
  symbol: "DAI",
  logo: `https://static.alchemyapi.io/images/assets/4943.png`,
  chainId: ChainId.OPTIMISM,
  isNative: false,
};

export const USDC_OPTIMISM = "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85";

export const usdcToken: TokenInfo = {
  address: USDC_OPTIMISM,
  decimals: 6,
  name: "USD Coin",
  symbol: "USDC",
  logo: `https://s3.coinmarketcap.com/static-gravity/image/5a8229787b5e4c809b5914eef709b59a.png`,
  chainId: ChainId.OPTIMISM,
  isNative: false,
};

export const WETH_OPTIMISM = "0x4200000000000000000000000000000000000006";

export const wethToken: TokenInfo = {
  address: WETH_OPTIMISM,
  decimals: 18,
  name: "Wrapped Ether",
  symbol: "WETH",
  logo: `https://assets.coingecko.com/coins/images/2518/standard/weth.png`,
  chainId: ChainId.OPTIMISM,
  isNative: false,
};

export const PUSDC_OPTIMISM = "0x77935F2c72b5eB814753a05921aE495aa283906B";

export const pusdcToken: TokenInfo = {
  address: PUSDC_OPTIMISM,
  decimals: 6,
  name: "PoolTogether Prize USD Coin",
  symbol: "pUSDC",
  logo: `https://app.cabana.fi/icons/pUSDC.e.svg`,
  chainId: ChainId.OPTIMISM,
  isNative: false,
};

export const PWETH_OPTIMISM = "0xf0B19f02c63d51B69563A2b675e0160e1C34397C";

export const pwethToken: TokenInfo = {
  address: PWETH_OPTIMISM,
  decimals: 18,
  name: "PoolTogether Prize WETH Coin",
  symbol: "pWETH",
  logo: `https://app.cabana.fi/icons/pWETH.svg`,
  chainId: ChainId.OPTIMISM,
  isNative: false,
};

export const PDAI_OPTIMISM = "0xCe8293f586091d48A0cE761bBf85D5bCAa1B8d2b";

export const pdaiToken: TokenInfo = {
  address: PDAI_OPTIMISM,
  decimals: 18,
  name: "PoolTogether Prize DAI Coin",
  symbol: "pDAI",
  logo: `https://app.cabana.fi/icons/pDAI.svg`,
  chainId: ChainId.OPTIMISM,
  isNative: false,
};

export const defaultAvailableChains = [
  ChainId.ETHEREUM,
  ChainId.OPTIMISM,
  ChainId.ARBITRUM,
  ChainId.POLYGON,
  ChainId.BASE,
  ChainId.AVALANCHE,
];

export function getChainIcon(chainId: ChainId | number) {
  switch (chainId) {
    case (ChainId.ETHEREUM):
      return '/ethereum.svg';
    case (ChainId.OPTIMISM):
      return '/optimism.svg';
    case (ChainId.ARBITRUM):
      return '/arbitrum.svg';
    case (ChainId.POLYGON):
      return '/polygon.svg';
    case (ChainId.BASE):
      return '/base.png';
    case (ChainId.AVALANCHE):
      return '/avalanche.svg';
  }
}

export function getChainBridge(chainId: ChainId | number) {
  switch (chainId) {
    case (ChainId.ETHEREUM):
      return '0x7358Eb6EBEd017345940328ce20B5ddc2B91F9b0';
    case (ChainId.OPTIMISM):
      return '0x4F2540e751A77CF18B6A67Ce85466e47c222da4f';
    case (ChainId.ARBITRUM):
      return '0xcD7df361aA1dEBE7331a76fFFd7F457DE22400d1';
    case (ChainId.POLYGON):
      return '0xCCadF28d9c74c8D412feEcD86EA9B0a9CefF1B28';
    case (ChainId.BASE):
      return '0x3684e93AE82b40238911DC71c3875E08e33f4ddC';
    case (ChainId.AVALANCHE):
      return '0xF434cD4878d16811a2777D87873AF04ca6656F1B';
  }
}