import { TransactionTable } from "../TransactionTable";

const mockTransactions = [
  {
    hash: "0x1234...5678",
    type: "BUY" as const,
    amountIn: "0.5",
    amountOut: "119.05",
    trader: "0xabcd...efgh",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
  },
  {
    hash: "0x9876...5432",
    type: "SELL" as const,
    amountIn: "50.0",
    amountOut: "0.21",
    trader: "0xijkl...mnop",
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
  },
  {
    hash: "0xabcd...1234",
    type: "BUY" as const,
    amountIn: "1.0",
    amountOut: "238.1",
    trader: "0xqrst...uvwx",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
  },
];

export default function TransactionTableExample() {
  return (
    <div className="p-8">
      <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>
      <TransactionTable transactions={mockTransactions} />
    </div>
  );
}
