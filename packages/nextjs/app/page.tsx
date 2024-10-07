"use client";

import { useState } from "react";
import type { NextPage } from "next";
import { Address as AddressType } from "viem";
import { useAccount } from "wagmi";
import { type BaseError, useReadContracts } from "wagmi";
import {
  ArrowsRightLeftIcon,
  BuildingLibraryIcon,
  PauseCircleIcon,
  PlayCircleIcon,
  WalletIcon,
} from "@heroicons/react/24/outline";
import { Address, AddressInput } from "~~/components/scaffold-eth";
import { useDeployedContractInfo, useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const Home: NextPage = () => {
  const { address: connectedAddress, isConnected } = useAccount();

  const [inputAddress, setInputAddress] = useState<AddressType>();
  const [stakeValue, setStakeValue] = useState("");
  const [withdrawValue, setWithdrawValue] = useState("");
  const [claimValue, setClaimValue] = useState("");

  const { data: yourTokenSymbol } = useScaffoldReadContract({
    contractName: "JWRToken",
    functionName: "symbol",
  });

  const { data: yourTokenBalance } = useScaffoldReadContract({
    contractName: "JWRToken",
    functionName: "balanceOf",
    args: [connectedAddress],
  });

  const { data: stakingOwner } = useScaffoldReadContract({
    contractName: "StakingContract",
    functionName: "owner",
  });

  const { data: stakingPaused } = useScaffoldReadContract({
    contractName: "StakingContract",
    functionName: "paused",
  });

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

  const ownerIsConnected = stakingOwner === connectedAddress;

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
          <div>
            Balance: {yourTokenSymbol} {yourTokenBalance}
          </div>
        </div>
        {!isConnected && notConnectedMsg}

        {stakingPaused && <>Staking paused!</>}

        {ownerIsConnected && !stakingPaused && (
          <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
            <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
              <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
                <button className="btn btn-error">
                  <PauseCircleIcon className="h-8 w-8 fill-secondary" />
                  <p>Pause Staking Contract</p>
                </button>
              </div>
            </div>
          </div>
        )}

        {ownerIsConnected && stakingPaused && (
          <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
            <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
              <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
                <button className="btn btn-success">
                  <PlayCircleIcon className="h-8 w-8 fill-secondary" />
                  <p>Resume Staking Contract</p>
                </button>
              </div>
            </div>
          </div>
        )}

        {ownerIsConnected && (
          <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
            <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
              <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
                <div className="grid h-16 flex-grow place-items-center">Change ownership:</div>
                <div className="grid h-16 flex-grow place-items-center">
                  <AddressInput
                    placeholder="Destination Address"
                    value={inputAddress ?? ""}
                    onChange={value => setInputAddress(value as AddressType)}
                  />
                </div>
                <div className="grid h-16 flex-grow place-items-center">
                  <button className="btn btn-success">
                    <ArrowsRightLeftIcon className="h-8 w-8 fill-secondary" />
                    <p>Set new owner</p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {!stakingPaused && (
          <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
            <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
              <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
                <input
                  className="input input-bordered w-full max-w-xs"
                  placeholder="Amount to stake"
                  value={stakeValue}
                  onChange={e => setStakeValue(e.target.value)}
                  autoComplete="off"
                />

                <button className="btn btn-primary h-[2.2rem] min-h-[2.2rem]">
                  <BuildingLibraryIcon className="h-8 w-8 fill-secondary" />
                  Stake
                </button>
              </div>
            </div>
          </div>
        )}

        {!stakingPaused && (
          <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
            <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
              <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
                <input
                  className="input input-bordered w-full max-w-xs"
                  placeholder="Amount to withdraw"
                  value={withdrawValue}
                  onChange={e => setWithdrawValue(e.target.value)}
                  autoComplete="off"
                />
                <button className="btn btn-primary h-[2.2rem] min-h-[2.2rem]">
                  <BuildingLibraryIcon className="h-8 w-8 fill-secondary" />
                  Withdraw
                </button>
              </div>
            </div>
          </div>
        )}

        {!stakingPaused && (
          <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
            <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
              <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
                <input
                  className="input input-bordered w-full max-w-xs"
                  placeholder="Amount to claim"
                  value={claimValue}
                  onChange={e => setClaimValue(e.target.value)}
                  autoComplete="off"
                />
                <button className="btn btn-primary h-[2.2rem] min-h-[2.2rem]">
                  <BuildingLibraryIcon className="h-8 w-8 fill-secondary" />
                  Claim
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
