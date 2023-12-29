import Image from "next/image"
import DepositModalDAI from "../DepositModalDAI"

interface PdaiProps {
    setOpenModalPDAI: (openPdaiModal : boolean) => void
}

export default function PDAI({setOpenModalPDAI} : PdaiProps) {
    return (
        <>
            <main className="main fixed flex flex-col text-purple-700 bg-opacity-7 w-screen h-screen items-center justify-center top-0 left-0 right-0 bottom-0 backdrop-blur-[666.666px]">
                <div>
                    <div onClick={() => setOpenModalPDAI(false)}>
                        <Image 
                            src='close.svg' 
                            alt='' 
                            width={36}
                            height={36}
                        />
                    </div>
                    <DepositModalDAI />
                </div>
            </main>
        </>
    )
}