"use client";

import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { BuildingLibraryIcon, PauseCircleIcon, PlayCircleIcon, WalletIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const notConnectedMsg = (
    <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
      <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
        <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
          <WalletIcon className="h-8 w-8 fill-secondary" />
          <p>Should connect your wallet</p>
        </div>
      </div>
    </div>
  );
  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">JWR Token staking</span>
          </h1>
          <div className="flex justify-center items-center space-x-2 flex-col sm:flex-row">
            <p className="my-2 font-medium">Connected Address:</p>
            <Address address={connectedAddress} />
          </div>
        </div>
        {!connectedAddress && notConnectedMsg}

        <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <PauseCircleIcon className="h-8 w-8 fill-secondary" />
              <p>Pause</p>
            </div>
          </div>
        </div>

        <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <PlayCircleIcon className="h-8 w-8 fill-secondary" />
              <p>Resume</p>
            </div>
          </div>
        </div>

        <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <input type="number" />
              <button>
                <BuildingLibraryIcon className="h-8 w-8 fill-secondary" />
                Stake
              </button>
            </div>
          </div>
        </div>

        <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <input type="number" />
              <button>
                <BuildingLibraryIcon className="h-8 w-8 fill-secondary" />
                Withdraw
              </button>
            </div>
          </div>
        </div>

        <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <input type="number" />
              <button>
                <BuildingLibraryIcon className="h-8 w-8 fill-secondary" />
                Claim
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
