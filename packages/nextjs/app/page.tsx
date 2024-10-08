"use client";

import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { BuildingLibraryIcon, CircleStackIcon, FireIcon, WalletIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";
import { InputButton } from "~~/components/scaffold-eth/InputButton";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

const Home: NextPage = () => {
  const { address: connectedAddress, isConnected } = useAccount();

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

  const notConnectedMsg = (
    <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
      <div className="flex justify-center items-center gap-12 flex-col sm:flex-row m-auto">
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
          <div>
            Your Balance: {yourTokenSymbol} {yourTokenBalance}
          </div>
        </div>

        {!isConnected && notConnectedMsg}

        {isConnected && stakingPaused && (
          <div className="mt-8 w-1/3">
            <div role="alert" className="alert alert-warning">
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
          </div>
        )}

        {isConnected && (
          <div className="flex justify-center gap-12 bg-base-300 w-full mt-16 px-8 py-12">
            <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
              <InputButton
                btnLabel="Claim"
                paused={stakingPaused}
                onClick={(value: string | null) => console.log("Stake ", value)}
                value={""}
                position={"before"}
                Icon={CircleStackIcon}
                IconClass="h-8 w-8 fill-secondary"
                IconTitle="Stake"
              />
            </div>
            <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
              <InputButton
                btnLabel="Withdraw"
                paused={stakingPaused}
                onClick={(value: string | null) => console.log("Withdraw ", value)}
                value={""}
                position={"before"}
                Icon={BuildingLibraryIcon}
                IconClass="h-8 w-8 fill-secondary"
                IconTitle="Withdraw"
              />
            </div>
            <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
              <InputButton
                btnLabel="Claim"
                paused={stakingPaused}
                onClick={(value: string | null) => console.log("Claim ", value)}
                value={""}
                position={"after"}
                Icon={FireIcon}
                IconClass="h-8 w-8 fill-secondary"
                IconTitle="Claim"
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
