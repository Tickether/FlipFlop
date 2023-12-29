import Image from "next/image"
import DepositModalWETH from "../DepositModalWETH"
import { useAccount } from "wagmi"

interface PwethProps {
    setOpenModalPWETH: (openPwethModal : boolean) => void
}
export default function PWETH({setOpenModalPWETH} : PwethProps) {
    const { address } = useAccount()
    return (
        <>
            <main className="main fixed flex flex-col text-purple-700 bg-opacity-7 w-screen h-screen items-center justify-center top-0 left-0 right-0 bottom-0 backdrop-blur-[666.666px]">
                <div>
                    <div onClick={() => setOpenModalPWETH(false)}>
                        <Image 
                            src='close.svg' 
                            alt='' 
                            width={36}
                            height={36}
                        />
                    </div>
                    <DepositModalWETH connectedAddress={address}/>
                </div>
            </main>
        </>
    )
}