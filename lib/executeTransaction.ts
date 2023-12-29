import { Chain, Hex, Address } from "viem";
import { ChainId, TokenInfo, EvmTransaction, BoxActionResponse } from "@decent.xyz/box-common";
import { toast } from "react-toastify";
import { 
  generateDecentAmountInParams,
  generateDecentAmountOutParams 
} from "./generateDecentParams";
import { sendTransaction, switchNetwork } from "@wagmi/core";

export const confirmRoute = async ({
  srcChain,
  srcToken,
  dstToken,
  setBoxActionArgs,
  updateRouteVars,
  connectedAddress,
  isNative,
  recipient,
  chain,
  srcInputVal,
  dstInputVal,
  continueDisabled,
  setSubmitting,
  setShowContinue,
  srcDisplay,
  contractAddress,
  signature,
  args,
}: {
  srcChain: ChainId,
  srcToken: TokenInfo,
  dstToken: TokenInfo,
  setBoxActionArgs: any,
  updateRouteVars: any,
  connectedAddress: string,
  isNative?: boolean,
  recipient?: string,
  chain?: Chain,
  srcInputVal?: string,
  dstInputVal?: string,
  continueDisabled?: boolean,
  setSubmitting?: (submitting: boolean) => void,
  setShowContinue?: (showContinue: boolean) => void,
  srcDisplay?: string,
  contractAddress?: Address,
  signature?: string,
  args?: any
}) => {
  const toAddress = recipient || connectedAddress;
  const amtOutConfig = signature ? 
    { 
      srcToken,
      dstToken: dstToken,
      dstAmount: dstInputVal,
      connectedAddress,
      toAddress,
      signature,
      args,
      isNative,
      contractAddress
     } : 
    { 
      srcToken,
      dstToken: dstToken,
      dstAmount: dstInputVal,
      connectedAddress,
      toAddress,
    };
 
  setBoxActionArgs(undefined);
  if (chain?.id !== srcChain) {
    toast.warning('Please switch networks.', {
      position: toast.POSITION.BOTTOM_CENTER
    })
    await switchNetwork({
      chainId: srcChain
    })
    return;
  }
  if (continueDisabled) return;
  setSubmitting?.(true);
  updateRouteVars({
    purchaseName: `${Number(srcDisplay).toPrecision(2)} ${dstToken.symbol}`,
  }); 
  if (srcInputVal) {
    const actionArgs = generateDecentAmountInParams({
      srcToken,
      dstToken: dstToken,
      srcAmount: srcInputVal,
      connectedAddress,
      toAddress,
    });
    setBoxActionArgs(actionArgs);
    setShowContinue?.(false);
    setSubmitting?.(false);
  } else if (dstInputVal) {
    const actionArgs = generateDecentAmountOutParams(amtOutConfig);
    setBoxActionArgs(actionArgs);
    setShowContinue?.(false);
    setSubmitting?.(false);
  } else {
    setSubmitting?.(false);
    toast.error('Error finding route.', {
      position: toast.POSITION.BOTTOM_CENTER
    })
  }
};

export const executeTransaction = async ({
  actionResponse,
  setSubmitting,
  setHash,
  setShowContinue
}: {
  actionResponse: BoxActionResponse | undefined,
  setSubmitting?: (submitting: boolean) => void,
  setHash?: (hash: Hex) => void,
  setShowContinue?: (showContinue: boolean) => void,
}) => {
  if (!actionResponse) {
    toast.error('Failed to fetch routes', {
      position: toast.POSITION.BOTTOM_CENTER
    });
  } else {
    setSubmitting?.(true);
    try {
      const tx = actionResponse.tx as EvmTransaction;
      const { hash } = await sendTransaction(tx);
      setSubmitting?.(false);
      setHash?.(hash);
    } catch (e) {
      toast.error('Error sending transaction.', {
        position: toast.POSITION.BOTTOM_CENTER
      });
      console.log("Error sending tx.", e);
      setShowContinue?.(true);
      setSubmitting?.(false);
    }
  }
};