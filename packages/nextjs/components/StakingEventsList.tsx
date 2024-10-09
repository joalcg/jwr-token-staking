import { Address } from "./scaffold-eth";
import { formatEther } from "viem";
import { useScaffoldEventHistory } from "~~/hooks/scaffold-eth";

type StakingEventsListProps = {
  title: string;
  event: string;
};

export const StakingEventsList = <T extends { toString: () => string } | undefined = string>({
  event,
  title,
}: StakingEventsListProps) => {
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
                  return (
                    <tr key={index}>
                      <td className="text-center">
                        <Address address={event.args.user} />
                      </td>
                      <td>{formatEther(event.args?.amount || 0n)}</td>
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
