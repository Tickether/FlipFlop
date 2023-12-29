import Image from 'next/image'
import { Inter } from 'next/font/google'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useState } from 'react'
import PDAI from '@/components/modals/pDAI'
import PUSDC from '@/components/modals/pUSDC'
import PWETH from '@/components/modals/pWETH'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  const [openPdaiModal, setOpenModalPDAI] = useState<boolean>(false) 
  const [openPusdcModal, setOpenModalPUSDC] = useState<boolean>(false) 
  const [openPwethModal, setOpenModalPWETH] = useState<boolean>(false) 

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <div className="fixed left-0 top-0 flex w-full justify-center pb-6 pt-8 backdrop-blur-2xl lg:static lg:w-auto max-[1024px]:border-b max-[1024px]:border-gray-300 max-[1024px]:bg-gradient-to-b max-[1024px]:from-zinc-200">
          <ConnectButton/>
        </div>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          <a
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Powered By{' '}
            <Image
              src="/decent.png"
              alt="Decent Logo"
              className="dark:invert"
              width={100}
              height={24}
              priority
            />
            X{' '}
            <Image
              src="/pooltogether.svg"
              alt="PoolTogether Logo"
              className="dark:invert"
              width={100}
              height={24}
              priority
            />
          </a>
        </div>
      </div>

      <div className="relative flex flex-col place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700/10 after:dark:from-sky-900 after:dark:via-[#0141ff]/40 before:lg:h-[360px]">
        <Image
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
          src="/flipflop.png"
          alt="FlipFlop Logo"
          width={180}
          height={37}
          priority
        />
        <p className="flex w-full justify-center text-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit static w-auto rounded-xl border bg-gray-200 p-4 dark:bg-zinc-800/30">
          Flip Flop into No Loss Prize Saving Pools🌊🏆&nbsp;
        </p>
      </div>
      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-3 lg:text-left">
        <div
          onClick={()=> setOpenModalPUSDC(true)}
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            <Image
              className="inline-block relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
              src="https://app.cabana.fi/icons/pUSDC.e.svg"
              alt=""
              width={30}
              height={30}
              priority
            />{' '}
            Prize USDC{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            From any Token on any Chain into Pooltogether Prize USDC Vaults
          </p>
        </div>

        <div
          onClick={()=> setOpenModalPWETH(true)}
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            <Image
              className="inline-block relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
              src="https://app.cabana.fi/icons/pWETH.svg"
              alt=""
              width={30}
              height={30}
              priority
            />{' '}
            Prize WETH{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            From any Token on any Chain into Pooltogether Prize WETH Vaults
          </p>
        </div>

        <div
          onClick={()=> setOpenModalPDAI(true)}
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            <Image
              className="inline-block relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
              src="https://app.cabana.fi/icons/pDAI.svg"
              alt=""
              width={30}
              height={30}
              priority
            />{' '}
            Prize DAI{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            From any Token on any Chain into Pooltogether Prize DAI Vaults.
          </p>
        </div>
      </div>
      {openPdaiModal && <PDAI setOpenModalPDAI={setOpenModalPDAI} />}
      {openPusdcModal && <PUSDC setOpenModalPUSDC={setOpenModalPUSDC} />}
      {openPwethModal && <PWETH setOpenModalPWETH={setOpenModalPWETH} />}
    </main>
  )
}
