
import React, { createContext, useContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Expense, Friend, Balance } from "../types";
import { useToast } from "@/hooks/use-toast";

// Initial friends
const initialFriends: Friend[] = [
  { id: "1", name: "You", avatarColor: "#9b87f5" },
  { id: "2", name: "Alex", avatarColor: "#F97316" },
  { id: "3", name: "Taylor", avatarColor: "#0EA5E9" },
];

// Initial categories
export const categories = [
  { id: "food", name: "Food", icon: "🍔" },
  { id: "rent", name: "Rent", icon: "🏠" },
  { id: "transport", name: "Transport", icon: "🚗" },
  { id: "entertainment", name: "Entertainment", icon: "🎭" },
  { id: "shopping", name: "Shopping", icon: "🛍️" },
  { id: "utilities", name: "Utilities", icon: "💡" },
  { id: "travel", name: "Travel", icon: "✈️" },
  { id: "other", name: "Other", icon: "📦" },
];

type AppContextType = {
  friends: Friend[];
  expenses: Expense[];
  balances: Balance[];
  addFriend: (name: string) => void;
  removeFriend: (id: string) => void;
  addExpense: (expense: Omit<Expense, "id" | "createdAt">) => void;
  deleteExpense: (id: string) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [friends, setFriends] = useState<Friend[]>(() => {
    const saved = localStorage.getItem("friends");
    return saved ? JSON.parse(saved) : initialFriends;
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem("expenses");
    const parsedExpenses = saved ? JSON.parse(saved) : [];
    return parsedExpenses.map((expense: any) => ({
      ...expense,
      createdAt: new Date(expense.createdAt),
    }));
  });

  const { toast } = useToast();

  // Calculate balances between friends
  const calculateBalances = (): Balance[] => {
    const balanceMap: Record<string, Record<string, number>> = {};

    // Initialize balance map for all pairs of friends
    friends.forEach((friend1) => {
      balanceMap[friend1.id] = {};
      friends.forEach((friend2) => {
        if (friend1.id !== friend2.id) {
          balanceMap[friend1.id][friend2.id] = 0;
        }
      });
    });

    // Process all expenses
    expenses.forEach((expense) => {
      // The person who paid
      const payer = expense.paidBy;

      // How much each participant should pay
      expense.participants.forEach((participant) => {
        if (participant.friendId !== payer) {
          // This participant owes money to the payer
          balanceMap[participant.friendId][payer] += participant.amount;
          // Reciprocal, the payer is owed by this participant
          balanceMap[payer][participant.friendId] -= participant.amount;
        }
      });
    });

    // Convert the balance map to an array of Balance objects
    // We only want to show balances where someone owes money
    const result: Balance[] = [];
    friends.forEach((friend1) => {
      friends.forEach((friend2) => {
        if (friend1.id !== friend2.id) {
          const amount = balanceMap[friend1.id][friend2.id];
          if (amount > 0) {
            result.push({
              from: friend1,
              to: friend2,
              amount,
            });
          }
        }
      });
    });

    return result;
  };

  const [balances, setBalances] = useState<Balance[]>([]);

  // Update balances whenever friends or expenses change
  useEffect(() => {
    setBalances(calculateBalances());
  }, [friends, expenses]);

  // Persist state to localStorage
  useEffect(() => {
    localStorage.setItem("friends", JSON.stringify(friends));
  }, [friends]);

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  // Add a friend
  const addFriend = (name: string) => {
    const newFriend = {
      id: uuidv4(),
      name,
      avatarColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
    };
    setFriends([...friends, newFriend]);
    toast({
      title: "Friend added",
      description: `${name} has been added to your friends list.`,
    });
  };

  // Remove a friend
  const removeFriend = (id: string) => {
    // Check if this friend is involved in any expenses
    const isInvolved = expenses.some(
      (expense) =>
        expense.paidBy === id ||
        expense.participants.some((p) => p.friendId === id)
    );

    if (isInvolved) {
      toast({
        title: "Cannot remove friend",
        description: "This friend is involved in one or more expenses.",
        variant: "destructive",
      });
      return;
    }

    setFriends(friends.filter((friend) => friend.id !== id));
    toast({
      title: "Friend removed",
      description: "Friend has been removed from your list.",
    });
  };

  // Add an expense
  const addExpense = (expenseData: Omit<Expense, "id" | "createdAt">) => {
    const newExpense: Expense = {
      ...expenseData,
      id: uuidv4(),
      createdAt: new Date(),
    };
    setExpenses([newExpense, ...expenses]);
    toast({
      title: "Expense added",
      description: `${expenseData.title} ($${expenseData.amount.toFixed(2)}) has been added.`,
    });
  };

  // Delete an expense
  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter((expense) => expense.id !== id));
    toast({
      title: "Expense deleted",
      description: "The expense has been deleted.",
    });
  };

  return (
    <AppContext.Provider
      value={{
        friends,
        expenses,
        balances,
        addFriend,
        removeFriend,
        addExpense,
        deleteExpense,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
