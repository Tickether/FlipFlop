import { Chain, Hex, Address, zeroAddress } from "viem";
import { ChainId, TokenInfo, EvmTransaction, BoxActionResponse } from "@decent.xyz/box-common";
import { toast } from "react-toastify";
import { 
  generateDecentAmountInParams,
  generateDecentAmountOutParams 
} from "./generateDecentParams";
import { sendTransaction, switchNetwork } from "@wagmi/core";
import { getAllowance, approveToken } from "./approveToken";

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
  connectedAddress,
  srcChain,
  actionResponse,
  publicClient,
  setSubmitting,
  setHash,
  setShowContinue
}: {
  connectedAddress: Address | undefined,
  srcChain: ChainId,
  actionResponse: BoxActionResponse | undefined,
  publicClient: any
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
      if (
        actionResponse?.tokenPayment?.tokenAddress &&
        actionResponse.tokenPayment.tokenAddress != zeroAddress
      ) {
        const amountApproved = await getAllowance({
          user: connectedAddress!,
          spender: actionResponse.tx.to as Address,
          token: actionResponse.tokenPayment.tokenAddress as Address,
        });
        if (
          amountApproved < (actionResponse?.tokenPayment?.amount || BigInt(0))
        ) {
          const approveHash = await approveToken({
            token: actionResponse.tokenPayment.tokenAddress as Address,
            spender: actionResponse.tx.to as Address,
            amount: actionResponse?.tokenPayment?.amount || BigInt(0),
          });
          if (!approveHash) {
            console.log('not approved!');
            return;
          }
          const approveResult = await publicClient({
            chainId: srcChain,
          }).waitForTransactionReceipt({ hash: approveHash });
          console.log('approved!', approveResult);
        }
      }
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