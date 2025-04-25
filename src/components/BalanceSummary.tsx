
import React from "react";
import { useAppContext } from "../context/AppContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import FriendAvatar from "./FriendAvatar";
import { Wallet } from "lucide-react";

const BalanceSummary: React.FC = () => {
  const { balances, friends } = useAppContext();

  // Calculate total balance for each friend
  const calculateFriendBalances = () => {
    const result: Record<string, number> = {};

    // Initialize all friends with 0 balance
    friends.forEach((friend) => {
      result[friend.id] = 0;
    });

    // Calculate the net balance
    balances.forEach((balance) => {
      result[balance.from.id] -= balance.amount;
      result[balance.to.id] += balance.amount;
    });

    return result;
  };

  const friendBalances = calculateFriendBalances();

  const getBalanceClass = (amount: number) => {
    if (amount > 0) return "balance-positive";
    if (amount < 0) return "balance-negative";
    return "balance-neutral";
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Wallet size={18} />
          Balance Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Friend Balances */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {friends.map((friend) => {
              const balance = friendBalances[friend.id] || 0;
              return (
                <div
                  key={friend.id}
                  className={`p-4 rounded-lg flex justify-between items-center ${getBalanceClass(balance)}`}
                >
                  <div className="flex items-center gap-3">
                    <FriendAvatar name={friend.name} color={friend.avatarColor} size="md" />
                    <span className="font-medium">{friend.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">
                      {balance > 0
                        ? `Gets $${balance.toFixed(2)}`
                        : balance < 0
                        ? `Owes $${Math.abs(balance).toFixed(2)}`
                        : "Settled"}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Settlement Suggestions */}
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">Settlement Suggestions</h3>
            {balances.length > 0 ? (
              <div className="space-y-3">
                {balances.map((balance, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 bg-secondary rounded-lg"
                  >
                    <div className="flex items-center gap-1">
                      <FriendAvatar
                        name={balance.from.name}
                        color={balance.from.avatarColor}
                        size="sm"
                      />
                      <span className="mx-2">pays</span>
                      <FriendAvatar
                        name={balance.to.name}
                        color={balance.to.avatarColor}
                        size="sm"
                      />
                    </div>
                    <div className="font-bold">${balance.amount.toFixed(2)}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-6 bg-secondary rounded-lg">
                <p className="text-gray-500">Everyone is settled up!</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BalanceSummary;
