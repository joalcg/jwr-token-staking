"use client";

import { useState } from "react";
import type { NextPage } from "next";
import { Address as AddressType } from "viem";
import { useAccount } from "wagmi";
import { ArrowsRightLeftIcon, PauseCircleIcon, PlayCircleIcon } from "@heroicons/react/24/outline";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

const Owner: NextPage = () => {
  const [inputAddress, setInputAddress] = useState<AddressType>();
  const { address: connectedAddress } = useAccount();
  const { data: stakingOwner } = useScaffoldReadContract({
    contractName: "StakingContract",
    functionName: "owner",
  });

  const { data: stakingPaused } = useScaffoldReadContract({
    contractName: "StakingContract",
    functionName: "paused",
  });
  const ownerIsConnected = stakingOwner === connectedAddress;

  if (!ownerIsConnected)
    return (
      <div className="flex bg-base-300 w-full mt-16 px-8 py-12 justify-center gap-12">
        <div role="alert" className="alert alert-error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Forbidden! owner only section.</span>
        </div>
      </div>
    );

  return (
    <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12 justify-center gap-12">
      <h1 className="text-lg font-bold">Owner Section</h1>
      <div className="flex w-full mt-16 px-8 py-12 justify-center gap-12">
        <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
          <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-s rounded-3xl h-full justify-center">
            <div className="grid h-16 flex-grow place-items-center">Change status:</div>
            {stakingPaused ? (
              <button className="btn btn-success">
                <PlayCircleIcon className="h-8 w-8 fill-secondary" />
                <p>Resume Staking Contract</p>
              </button>
            ) : (
              <button className="btn btn-error">
                <PauseCircleIcon className="h-8 w-8 fill-secondary" />
                <p>Pause Staking Contract</p>
              </button>
            )}
          </div>
        </div>
        {
          <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-s rounded-3xl">
              <div className="grid h-16 flex-grow place-items-center">Set new owner:</div>
              <div className="flex border-2 border-base-300 bg-base-200 rounded-full text-accent">
                <input
                  type="text"
                  className="input input-ghost focus-within:border-transparent focus:outline-none focus:bg-transparent focus:text-gray-400 h-[2.2rem] min-h-[2.2rem] px-4 border w-full font-medium placeholder:text-accent/50 text-gray-400"
                  placeholder="Destination Address"
                  value={inputAddress ?? ""}
                  onChange={e => setInputAddress(e.target.value as AddressType)}
                />
                <button className="btn btn-success">
                  <ArrowsRightLeftIcon className="h-8 w-8 fill-secondary" />
                  <p>Change</p>
                </button>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  );
};

export default Owner;
