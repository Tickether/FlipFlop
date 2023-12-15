import { ChainId, TokenInfo } from "@decent.xyz/box-common";

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

export const PUSDCE_OPTIMISM = "0xe3b3a464ee575e8e25d2508918383b89c832f275";

export const pusdceToken: TokenInfo = {
  address: PUSDCE_OPTIMISM,
  decimals: 6,
  name: "PoolTogether Prize USD Coin",
  symbol: "pUSDC.e",
  logo: `https://app.cabana.fi/icons/pUSDC.e.svg`,
  chainId: ChainId.OPTIMISM,
  isNative: false,
};

export const PWETH_OPTIMISM = "0x29Cb69D4780B53c1e5CD4D2B817142D2e9890715";

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
  decimals: 6,
  name: "PoolTogether Prize DAI Coin",
  symbol: "pDAI",
  logo: `https://app.cabana.fi/icons/pDAI.svg`,
  chainId: ChainId.OPTIMISM,
  isNative: false,
};