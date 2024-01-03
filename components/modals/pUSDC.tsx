import Image from "next/image"
import DepositModalUSDC from "../DepositModalUSDC"
import { useAccount, useBalance, useNetwork } from "wagmi"
import { PUSDC_OPTIMISM } from "@/lib/constants"
import { configureChains, mainnet } from '@wagmi/core'
import { publicProvider } from '@wagmi/core/providers/public'


interface PusdcProps {
    setOpenModalPUSDC: (openPusdcModal : boolean) => void
}

export default function PUSDC({setOpenModalPUSDC} : PusdcProps) {
    const { address } = useAccount()
    const { chain } = useNetwork();
    const { publicClient } = configureChains([chain || mainnet], [publicProvider()])
    const { data, isError, isLoading } = useBalance({
        token: `0x${PUSDC_OPTIMISM?.slice(2)}`,
        address: address!,
        watch: true,
        chainId: 10
    })
    return (
        <>
            <main className="fixed flex flex-col text-purple-700 bg-opacity-7 w-screen h-screen items-center justify-center top-0 left-0 right-0 bottom-0 backdrop-blur-[666.666px] max-[1024px]:px-8 max-[1024px]:my-8">
                <div>
                    <div className="flex justify-between">
                        <div>
                            Balance: {data?.formatted} {data?.symbol}
                        </div>
                        <Image
                            onClick={() => setOpenModalPUSDC(false)}
                            src='close.svg' 
                            alt='' 
                            width={36}
                            height={36}
                        />
                    </div>
                    <div>
                        <DepositModalUSDC connectedAddress={address} publicClient={publicClient} />
                    </div>
                </div>
            </main>
        </>
    )
}