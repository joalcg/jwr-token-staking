"use client";

import { useState } from "react";
import { parseUnits } from "ethers";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { BuildingLibraryIcon, WalletIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const Home: NextPage = () => {
  const { address: connectedAddress, isConnected } = useAccount();
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

  const { data: stakingPaused } = useScaffoldReadContract({
    contractName: "StakingContract",
    functionName: "paused",
  });

  const { writeContractAsync: stakeTokens, isMining: isStaking } = useScaffoldWriteContract("StakingContract");

  const onStakeClick = async () => {
    console.log("onStakeClick");
    try {
      const amountInBigNumber = parseUnits(stakeValue, 18);

      await stakeTokens({
        functionName: "stake",
        args: [amountInBigNumber], // Arguments for the stake function, such as the staking amount
      });
    } catch (error) {
      console.error("Stake failed", error);
    }
  };

  const onWithdrawClick = async () => {
    console.log("onWithdrawClick");
  };

  const onClaimClick = async () => {
    console.log("onClaimClick");
  };

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

  const pausedClass = stakingPaused ? "btn-disabled" : "";
  const pausedMsg = stakingPaused ? <div className="indicator-item badge">* Contract Paused</div> : null;

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
            Your Balance: {yourTokenSymbol} {yourTokenBalance}
          </div>
        </div>

        {!isConnected && notConnectedMsg}

        {stakingPaused && (
          <div role="alert" className="alert alert-warning my-8">
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
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span>Warning: Contract is paused!</span>
          </div>
        )}

        <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl indicator">
              <input
                className="input input-bordered w-full max-w-xs"
                placeholder="Amount to stake"
                value={stakeValue}
                onChange={e => setStakeValue(e.target.value)}
                autoComplete="off"
              />

              <button className={`btn btn-primary h-[2.2rem] min-h-[2.2rem] ${pausedClass}`}>
                <BuildingLibraryIcon className="h-8 w-8 fill-secondary" onClick={onStakeClick} />
                {isStaking ? "Staking..." : "Stake"}
              </button>
              {pausedMsg}
            </div>
          </div>
        </div>

        <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl indicator">
              <input
                className="input input-bordered w-full max-w-xs"
                placeholder="Amount to withdraw"
                value={withdrawValue}
                onChange={e => setWithdrawValue(e.target.value)}
                autoComplete="off"
              />
              <button className={`btn btn-primary h-[2.2rem] min-h-[2.2rem] ${pausedClass}`}>
                <BuildingLibraryIcon className="h-8 w-8 fill-secondary" onClick={onWithdrawClick} />
                Withdraw
              </button>
              {pausedMsg}
            </div>
          </div>
        </div>

        <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl indicator">
              <input
                className="input input-bordered w-full max-w-xs"
                placeholder="Amount to claim"
                value={claimValue}
                onChange={e => setClaimValue(e.target.value)}
                autoComplete="off"
              />
              <button className={`btn btn-primary h-[2.2rem] min-h-[2.2rem] ${pausedClass}`}>
                <BuildingLibraryIcon className="h-8 w-8 fill-secondary" onClick={onClaimClick} />
                Claim
              </button>
              {pausedMsg}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
