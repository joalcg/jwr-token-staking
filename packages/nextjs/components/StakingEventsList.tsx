import { Address } from "./scaffold-eth";
import { formatEther } from "viem";
import { useScaffoldEventHistory } from "~~/hooks/scaffold-eth";

type StakedEventArgs = {
  user: string;
  amount: bigint;
};

type StakingEventsListProps = {
  title: string;
  event: "OwnershipTransferred" | "Paused" | "RewardClaimed" | "Staked" | "Unpaused" | "Withdrawn";
};

export const StakingEventsList = ({ event, title }: StakingEventsListProps) => {
  const { data: events, isLoading } = useScaffoldEventHistory({
    contractName: "StakingContract",
    eventName: event,
    fromBlock: 0n,
  });

  return (
    <div>
      <div className="text-center mb-4">
        <span className="block text-2xl font-bold">{title}</span>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center mt-8">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <div className="overflow-x-auto shadow-lg">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th className="bg-primary">Account</th>
                <th className="bg-primary">Amount of Tokens</th>
              </tr>
            </thead>
            <tbody>
              {!events || events.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center">
                    No events found
                  </td>
                </tr>
              ) : (
                events?.map((event, index) => {
                  const args = event.args as StakedEventArgs;

                  return (
                    <tr key={index}>
                      <td className="text-center">
                        <Address address={args.user} />
                      </td>
                      <td>{formatEther(args.amount || 0n)}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
