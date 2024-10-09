"use client";

import type { NextPage } from "next";
import { StakingEventsList } from "~~/components/StakingEventsList";

const EventsStaking: NextPage = () => {
  return (
    <div className="flex flex-col bg-base-300 w-full px-8 py-12 justify-center gap-12">
      <h1 className="text-4xl font-bold">Staking contract events</h1>
      <div role="tablist" className="tabs tabs-lifted">
        <input type="radio" name="staking_events_tab" role="tab" className="tab" aria-label="Stake Events" />
        <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
          <div className="flex items-center flex-col flex-grow pt-10">
            {/* Stake Events */}
            <StakingEventsList title="Stake Token Events" event="Staked" />
          </div>
        </div>

        <input
          type="radio"
          name="staking_events_tab"
          role="tab"
          className="tab"
          aria-label="Withdrawn Events"
          defaultChecked
        />
        <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
          {/* withdrawn Events */}
          <StakingEventsList title="Withdrawn Token Events" event="Withdrawn" />
        </div>

        <input type="radio" name="staking_events_tab" role="tab" className="tab" aria-label="Reward Claimed Events" />
        <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
          {/* withdrawn Events */}
          <StakingEventsList title="Reward Claimed Token Events" event="RewardClaimed" />
        </div>
      </div>
    </div>
  );
};

export default EventsStaking;
