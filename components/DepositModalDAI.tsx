import { TokenSelectorComponent } from "./TokenSelectorComponent";
import ChainSelectMenu from "./ChainSelectorMenu";
import { useContext, useEffect, useState, Fragment } from "react";
import {
  RouteSelectContext,
  getDefaultToken,
} from "../lib/contexts/routeSelectContext";
import {
  ChainId,
  TokenInfo,
} from "@decent.xyz/box-common";
import useDebounced from "../lib/useDebounced";
import { useAmtInQuote, useAmtOutQuote } from "../lib/hooks/useSwapQuotes";
import { BoxActionContext } from "../lib/contexts/decentActionContext";
import { roundValue } from "../lib/roundValue";
import { erc20ABI, useContractRead, useContractWrite, useNetwork } from "wagmi";
import { Hex, parseUnits, } from "viem";
import { useBalance } from "../lib/hooks/useBalance";
import { confirmRoute, executeTransaction } from "@/lib/executeTransaction";
import { PDAI_OPTIMISM, PWETH_OPTIMISM, USDC_OPTIMISM, daiToken, getChainBridge } from "@/lib/constants";
import Image from "next/image";
import { switchNetwork } from "wagmi/actions";

export default function DepositModalDAI({ connectedAddress }: any) {
  //pool together v5 example
  const DEPOSIT_SIGNATURE = 'function deposit(uint256 _assets,address _receiver)';
  
  
  const { routeVars, updateRouteVars } = useContext(RouteSelectContext);
  const {
    setBoxActionArgs,
    boxActionResponse: { actionResponse },
  } = useContext(BoxActionContext);

  const { chain } = useNetwork();

  const [showContinue, setShowContinue] = useState(true);
  const [hash, setHash] = useState<Hex>();

  const { dstChain, dstToken } = routeVars;
  const srcToken = routeVars.srcToken;
  const srcChain = routeVars.srcChain;

  const setSrcChain = (c: ChainId) => updateRouteVars({ srcChain: c });
  const setSrcToken = (t: TokenInfo) => updateRouteVars({ srcToken: t });
  useEffect(() => {
    updateRouteVars({
      dstChain: ChainId.OPTIMISM,
      dstToken: daiToken,
    });
  }, []);

  const { nativeBalance: srcNativeBalance, tokenBalance: srcTokenBalance } =
    useBalance(connectedAddress, srcToken);
  const srcTokenBalanceRounded = roundValue(srcTokenBalance, 2) ?? 0;

  const [submitting, setSubmitting] = useState(false);
  const [submitErrorText, setSubmitErrorText] = useState("");

  const handleSrcAmtChange = (strVal: string) => {
    if (strVal == "") {
      setSrcInputVal("");
      return;
    }

    if (!/^\d*\.?\d*$/.test(strVal)) return;
    setSrcInputVal(strVal);
    setDstInputVal(null);
    overrideDebouncedDst(null);
    setSubmitErrorText("");
  };

  const handleDstAmtChange = (strVal: string) => {
    if (!/^\d*\.?\d*$/.test(strVal)) return;
    setDstInputVal(strVal);
    setSrcInputVal(null);
    overrideDebouncedSrc(null);
    // setSubmitErrorText('');
  };

  const [bridge, setBridge] = useState<string | null>(null);

  const [srcInputVal, setSrcInputVal] = useState<string | null>(null);
  const [dstInputVal, setDstInputVal] = useState<string | null>(null);

  const [srcInputDebounced, overrideDebouncedSrc] = useDebounced(srcInputVal);
  const [dstInputDebounced, overrideDebouncedDst] = useDebounced(dstInputVal);

  const srcDebounceWaiting = srcInputDebounced != srcInputVal;
  const dstDebounceWaiting = dstInputDebounced != dstInputVal;

  const {
    isLoading: amtOutLoading,
    errorText: amtOutErrorText,
    fees: amtOutFees,
    tx: amtOutTx,
    srcCalcedVal,
  } = useAmtOutQuote(dstInputDebounced, dstToken, srcToken, srcChain);

  const {
    isLoading: amtInLoading,
    errorText: amtInErrorText,
    fees: amtInFees,
    tx: amtInTx,
    dstCalcedVal,
  } = useAmtInQuote(srcInputDebounced, dstToken, srcToken, srcChain);

  const srcDisplay = srcCalcedVal ?? srcInputVal ?? "";
  const dstDisplay = dstCalcedVal ?? dstInputVal ?? "";

  useEffect(() => {
    const srcNum = Number(srcDisplay);
    if (srcNum > srcTokenBalance) {
      setSubmitErrorText(
        "Insufficient funds. Try onramping to fill your wallet.",
      );
    } else {
      setSubmitErrorText("");
    }
  }, [srcTokenBalance, srcDisplay]);

  const srcSpinning = amtOutLoading || dstDebounceWaiting;
  const dstSpinning = amtInLoading || srcDebounceWaiting;

  const continueDisabled =
    !!submitErrorText ||
    !!amtOutErrorText ||
    !!amtInErrorText ||
    !chain ||
    srcSpinning ||
    dstSpinning ||
    !(Number(srcInputDebounced) || Number(dstInputDebounced)) ||
    submitting;
  
  const confirmDisabled = !actionResponse?.tx;

  const value = srcInputDebounced ? parseUnits(srcInputDebounced!, 18) :BigInt(0)

  const readPrizeAllowance = useContractRead({
    address: `0x${dstToken.address?.slice(2)}`,
    abi: erc20ABI,
    functionName: 'allowance',
    args: [(connectedAddress), (`0x${PDAI_OPTIMISM?.slice(2)}`)],
    chainId: 10
  })
  console.log(readPrizeAllowance.data)
  const addPrizeAllowance = useContractWrite({
    address: `0x${dstToken.address?.slice(2)}`,
    abi: erc20ABI,
    functionName: 'approve',
    args: [(`0x${PWETH_OPTIMISM?.slice(2)}`), (value)]
  })
  ///////////////////////////////////////////////////////////////////////////////
  
  useEffect(()=>{
    setBridge(getChainBridge(srcChain)!)
  },[srcChain])
  const readDecentAllowance = useContractRead({
    address: `0x${srcToken.address?.slice(2)}`,
    abi: erc20ABI,
    functionName: 'allowance',
    args: [(connectedAddress), (`0x${bridge?.slice(2)}`)]
  })
  console.log(readDecentAllowance.data)
  const addDecentAllowance = useContractWrite({
    address: `0x${srcToken.address?.slice(2)}`,
    abi: erc20ABI,
    functionName: 'approve',
    args: [(`0x${bridge?.slice(2)}`), (value)]
  })

  return (
    <>
    <div className="text-sm text-gray-500 pt-4">Deposit into this <a href='https://optimistic.etherscan.io/token/0xe3b3a464ee575e8e25d2508918383b89c832f275#writeContract' 
    target='_blank' className="text-primary hover:opactiy-80">Pool Together</a> contract to receive pDAI</div>
      <div className="group mt-8 bg-white">
        <div
          className={
            "p-4 rounded-t border" +
            " focus-within:border-accent-purple" +
            " group-focus-within:border-b-accent-purple"
          }
        >
          <div className="text-sm">
            <span className="inline-block w-16">Pay </span>
            <TokenSelectorComponent
              disabled={false}
              currentChain={srcChain}
              selectedToken={srcToken}
              setSelectedToken={(t) => {
                setSrcToken(t);
                setShowContinue(true);
              }}
              wallet={connectedAddress}
            />{" "}
            on{" "}
            <ChainSelectMenu
              chainId={srcChain}
              onSelectChain={(c) => {
                setSrcChain(c);
                const t = getDefaultToken(c);
                setSrcToken(t);
                setShowContinue(true);
              }}
            />
          </div>

          <div className="my-4 px-2 font-medium leading-none relative text-3xl flex items-center">
            {srcSpinning && (
              <div className="absolute inset-0 rounded load-shine opacity-75" />
            )}
            <input
              className="w-full focus:outline-none"
              type="text"
              value={srcDisplay}
              onChange={(e) => handleSrcAmtChange(e.target.value)}
              disabled={srcSpinning || submitting}
            />
            <div className="absolute right-4 text-gray-mid-light pointer-events-none">
              {srcToken.symbol}
            </div>
            <div className="absolute right-4 top-full text-xs text-gray-mid">
              Balance: {srcTokenBalanceRounded}
            </div>
          </div>
        </div>
        <div
          className={
            "border border-t-0 p-4 rounded-b" +
            " focus-within:border-accent-purple"
          }
        >
          <div className="text-sm">
            <div className="flex items-center gap-1">
              <span className="inline-block w-16 flex">Receive </span>
              <TokenSelectorComponent
                disabled={true}
                currentChain={dstChain}
                selectedToken={dstToken}
                setSelectedToken={(t) => {
                  updateRouteVars({ dstToken: daiToken });
                }}
                wallet={connectedAddress}
              />{" "}
              on{" "}
              <Image src='/optimism.svg' height={14} width={14} alt='logo' /> Optimism
            </div>
            <div className="my-4 px-2 font-medium leading-none relative text-3xl flex items-center">
              {dstSpinning && (
                <div className="absolute inset-0 rounded load-shine opacity-75" />
              )}
              <input
                className="w-full focus:outline-none"
                type="text"
                value={dstDisplay}
                onChange={(e) => handleDstAmtChange(e.target.value)}
                disabled={true}
              />
              <div className="absolute right-4 text-gray-mid-light pointer-events-none">
                {dstToken.symbol}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-2 gap-y-1 py-4 px-2 text-sm">
        {srcInputDebounced &&
          amtInFees &&
          Object.keys(amtInFees).map((feeName) => (
            <Fragment key={feeName}>
              <div>{feeName}</div>
              <div className="text-right">{amtInFees[feeName]}</div>
            </Fragment>
          ))}

        {dstInputDebounced &&
          amtOutFees &&
          Object.keys(amtOutFees).map((feeName) => (
            <Fragment key={feeName}>
              <div>{feeName}</div>
              <div className="text-right">{amtOutFees[feeName]}</div>
            </Fragment>
          ))}
      </div>
      <div className="text-red-500">{submitErrorText}</div>
      <div className="mt-auto"></div>
      {readPrizeAllowance?.data! >= value && readDecentAllowance?.data! >= value ? (
        <>
          {showContinue ? (
            
            <button
              className={
                `${continueDisabled ? 'bg-gray-300 text-gray-600 ' : 'bg-black text-white '}` +
                "text-center font-medium" +
                " w-full rounded-lg p-2 mt-4" +
                " relative flex items-center justify-center"
              }
              onClick={() => confirmRoute({
                chain: chain!,
                srcChain,
                // TODO: right now only working with USDC -- need to fix to support any token on the deposit.
                srcToken,
                dstToken,
                isNative: false,
                setBoxActionArgs,
                updateRouteVars,
                // Users should specify how much they want to deposit; but we want to calculate based on exactAmountOut so that we can call the deposit function.  See confirmRoute in executeTransaction.ts.
                dstInputVal: srcInputDebounced!,
                contractAddress: `0x${PDAI_OPTIMISM?.slice(2)}`,
                signature: DEPOSIT_SIGNATURE,
                args: [srcInputDebounced, connectedAddress],
              
                connectedAddress,
                continueDisabled,
                setSubmitting,
                setShowContinue,
                srcDisplay
              })}
              disabled={continueDisabled}
            >
              Confirm Selections
            </button>
          ) : (
            <button
              className={
                `${confirmDisabled ? 'bg-gray-300 text-gray-600 ': 'bg-primary text-white '}` +
                "text-center font-medium" +
                " w-full rounded-lg p-2 mt-4" +
                " relative flex items-center justify-center"
              }
              disabled={confirmDisabled}
              onClick={() => executeTransaction({
                actionResponse,
                setSubmitting,
                setHash,
                setShowContinue
              })}
            >
              Deposit
              {submitting && <div className="absolute right-4 load-spinner"></div>}
            </button>
          )}
        </>
      ) : (
        <>
          <button
            className={
              `${continueDisabled ? 'bg-gray-300 text-gray-600 ' : 'bg-black text-white '}` +
              "text-center font-medium" +
              " w-full rounded-lg p-2 mt-4" +
              " relative flex items-center justify-center"
            }
            disabled={continueDisabled || readPrizeAllowance?.data! >= value}
            onClick={() => {
              if (chain?.id === dstChain) {
                addPrizeAllowance.write()
              } else {
                switchNetwork({
                  chainId: dstChain
                })
                addPrizeAllowance.write()
              }
            }}
          >{readPrizeAllowance?.data! >= value && value != BigInt(0) ? 'Approved PoolTogether' : 'Approve PoolTogether'}</button>
          {
            !srcToken.isNative && (
              <button
                className={
                  `${continueDisabled ? 'bg-gray-300 text-gray-600 ' : 'bg-black text-white '}` +
                  "text-center font-medium" +
                  " w-full rounded-lg p-2 mt-4" +
                  " relative flex items-center justify-center"
                }
                disabled={continueDisabled || readDecentAllowance?.data! >= value}
                onClick={() => {
                  if (chain?.id === srcChain) {
                    addDecentAllowance.write()
                  } else {
                    switchNetwork({
                      chainId: srcChain
                    })
                    addDecentAllowance.write()
                  }
                }}
              >{readDecentAllowance?.data! >= value && value != BigInt(0) ? 'Approved Decent' : 'Approve Decent'}</button>
            )
          }
        </>
      )}
      
      {hash && (
        <div>
          <p>{hash}</p>
        </div>
      )}
    </>
  );
}