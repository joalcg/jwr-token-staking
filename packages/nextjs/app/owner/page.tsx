"use client";

import { useState } from "react";
import type { NextPage } from "next";
import { Address as AddressType } from "viem";
import { useAccount } from "wagmi";
import {
    ArrowsRightLeftIcon,
    PauseCircleIcon,
    PlayCircleIcon,
} from "@heroicons/react/24/outline";
import { AddressInput } from "~~/components/scaffold-eth";
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

    if(!ownerIsConnected) return (<>
        <div>Forbidden access, owner section!</div>
    </>)

    return (
        <>
            {!stakingPaused && (
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

            {stakingPaused && (
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

            {(
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
        </>
    );
};

export default Owner;
