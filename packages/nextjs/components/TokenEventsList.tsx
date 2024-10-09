import { Address } from "./scaffold-eth";
import { formatEther } from "viem";
import { useScaffoldEventHistory } from "~~/hooks/scaffold-eth";

type TokenEventArgs = {
  from?: string;
  owner?: string;
  to?: string;
  spender?: string;
  amount: bigint;
};

type TokenEventsListProps = {
  title: string;
  event: "Approval" | "OwnershipTransferred" | "Transfer";
  label1: string;
  label2: string;
  label3: string;
};

const getAddresses = (args: TokenEventArgs, event: string) => {
  if (event === "Transfer") {
    return { addr1: args.from, addr2: args.to };
  }
  return { addr1: args.owner, addr2: args.spender };
};

export const TokenEventsList = ({ event, title, label1, label2, label3 }: TokenEventsListProps) => {
  const {
    data: events,
    isLoading,
    error,
  } = useScaffoldEventHistory({
    contractName: "JWRToken",
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
      ) : error ? (
        <div className="text-red-500 text-center mt-4">Error fetching events: {error.message}</div>
      ) : (
        <div className="overflow-x-auto shadow-lg">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th className="bg-primary">{label1}</th>
                <th className="bg-primary">{label2}</th>
                <th className="bg-primary">{label3}</th>
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
                events.map((eventLog, index) => {
                  const args = eventLog.args as unknown as TokenEventArgs;
                  const { addr1, addr2 } = getAddresses(args, event);

                  return (
                    <tr key={`${event}-${index}`}>
                      <td className="text-center">
                        <Address address={addr1 || "N/A"} />
                      </td>
                      <td className="text-center">
                        <Address address={addr2 || "N/A"} />
                      </td>
                      <td>{formatEther(args.amount)}</td>
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
