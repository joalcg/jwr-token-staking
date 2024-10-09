"use client";

import type { NextPage } from "next";
import { TokenEventsList } from "~~/components/TokenEventsList";

const EventsToken: NextPage = () => {
  return (
    <div role="tablist" className="tabs tabs-lifted mt-8">
      <input type="radio" name="token_events_tab" role="tab" className="tab" aria-label="Transfer Token Events" />
      <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
        <div className="flex items-center flex-col flex-grow pt-10">
          {/* Stake Events */}
          <TokenEventsList
            title="Transfer Token Events"
            event="Transfer"
            label1="From"
            label2="To"
            label3="Amount"
            key1="from"
            key2="to"
          />
        </div>
      </div>

      <input
        type="radio"
        name="token_events_tab"
        role="tab"
        className="tab"
        aria-label="Approval Token Events"
        defaultChecked
      />
      <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
        {/* withdrawn Events */}
        <TokenEventsList
          title="Approval Token Events"
          event="Approval"
          label1="Owner"
          label2="Spend"
          label3="Amount"
          key1="owner"
          key2="spender"
        />
      </div>
    </div>
  );
};

export default EventsToken;
