
import React, { useState } from "react";
import { useAppContext, categories } from "../context/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FriendAvatar from "./FriendAvatar";
import { DollarSign, Plus, Minus } from "lucide-react";

const ExpenseForm: React.FC = () => {
  const { friends, addExpense } = useAppContext();
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [category, setCategory] = useState("food");
  const [splitType, setSplitType] = useState("equal");
  const [customAmounts, setCustomAmounts] = useState<Record<string, string>>({});
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);

  const resetForm = () => {
    setTitle("");
    setAmount("");
    setPaidBy("");
    setCategory("food");
    setSplitType("equal");
    setCustomAmounts({});
    setSelectedFriends([]);
  };

  const handleFriendToggle = (friendId: string) => {
    if (selectedFriends.includes(friendId)) {
      setSelectedFriends(selectedFriends.filter((id) => id !== friendId));
    } else {
      setSelectedFriends([...selectedFriends, friendId]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !amount || !paidBy || selectedFriends.length === 0) {
      return;
    }

    const totalAmount = parseFloat(amount);
    const participants = selectedFriends.map((friendId) => {
      if (splitType === "equal") {
        return {
          friendId,
          amount: totalAmount / selectedFriends.length,
        };
      } else {
        // Custom split
        return {
          friendId,
          amount: parseFloat(customAmounts[friendId] || "0"),
        };
      }
    });

    addExpense({
      title,
      amount: totalAmount,
      paidBy,
      participants,
      category,
    });

    resetForm();
  };

  const handleCustomAmountChange = (friendId: string, value: string) => {
    setCustomAmounts({ ...customAmounts, [friendId]: value });
  };

  // Calculate sum of custom amounts
  const customAmountsSum = Object.values(customAmounts)
    .reduce((sum, val) => sum + (parseFloat(val) || 0), 0);

  // Calculate remaining amount to allocate
  const remainingAmount = parseFloat(amount) - customAmountsSum;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Plus size={18} />
          Add New Expense
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="title">Expense Title</Label>
              <Input
                id="title"
                placeholder="What was this expense for?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1"
                required
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full">
                <Label htmlFor="amount">Total Amount</Label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-2.5 text-gray-500">
                    <DollarSign size={16} />
                  </span>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-8"
                    required
                  />
                </div>
              </div>
              <div className="w-full">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={category}
                  onValueChange={setCategory}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        <div className="flex items-center gap-2">
                          <span>{cat.icon}</span>
                          <span>{cat.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="paidBy">Paid By</Label>
              <Select
                value={paidBy}
                onValueChange={setPaidBy}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Who paid?" />
                </SelectTrigger>
                <SelectContent>
                  {friends.map((friend) => (
                    <SelectItem key={friend.id} value={friend.id}>
                      <div className="flex items-center gap-2">
                        <FriendAvatar name={friend.name} color={friend.avatarColor} size="sm" />
                        <span>{friend.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Split With</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {friends.map((friend) => (
                  <Button
                    key={friend.id}
                    type="button"
                    variant={selectedFriends.includes(friend.id) ? "secondary" : "outline"}
                    className={`flex items-center gap-2 ${
                      selectedFriends.includes(friend.id) ? "bg-app-purple-light" : ""
                    }`}
                    onClick={() => handleFriendToggle(friend.id)}
                  >
                    <FriendAvatar name={friend.name} color={friend.avatarColor} size="sm" />
                    <span>{friend.name}</span>
                    {selectedFriends.includes(friend.id) ? (
                      <Minus size={16} className="ml-1" />
                    ) : (
                      <Plus size={16} className="ml-1" />
                    )}
                  </Button>
                ))}
              </div>
            </div>

            {selectedFriends.length > 0 && (
              <div>
                <Label>Split Type</Label>
                <div className="flex gap-2 mt-2">
                  <Button
                    type="button"
                    variant={splitType === "equal" ? "default" : "outline"}
                    onClick={() => setSplitType("equal")}
                    className="flex-1"
                  >
                    Equal Split
                  </Button>
                  <Button
                    type="button"
                    variant={splitType === "custom" ? "default" : "outline"}
                    onClick={() => setSplitType("custom")}
                    className="flex-1"
                  >
                    Custom Split
                  </Button>
                </div>
              </div>
            )}

            {selectedFriends.length > 0 && splitType === "equal" && (
              <div className="p-4 bg-secondary rounded-lg">
                <p className="text-sm text-center">
                  Each person will pay: <strong>${amount ? (parseFloat(amount) / selectedFriends.length).toFixed(2) : "0.00"}</strong>
                </p>
              </div>
            )}

            {selectedFriends.length > 0 && splitType === "custom" && (
              <div className="bg-secondary p-4 rounded-lg">
                <p className="text-sm mb-2">
                  {remainingAmount > 0 
                    ? `Remaining to allocate: $${remainingAmount.toFixed(2)}` 
                    : remainingAmount < 0 
                    ? `Over-allocated by: $${Math.abs(remainingAmount).toFixed(2)}` 
                    : "Perfect split!"}
                </p>
                <div className="space-y-2">
                  {friends.filter(friend => selectedFriends.includes(friend.id)).map((friend) => (
                    <div key={friend.id} className="flex items-center gap-2">
                      <FriendAvatar name={friend.name} color={friend.avatarColor} size="sm" />
                      <span className="w-24 truncate">{friend.name}</span>
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-2.5 text-gray-500">
                          <DollarSign size={16} />
                        </span>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          value={customAmounts[friend.id] || ""}
                          onChange={(e) => handleCustomAmountChange(friend.id, e.target.value)}
                          className="pl-8"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              className="bg-app-purple hover:bg-app-purple-dark"
              disabled={
                !title ||
                !amount ||
                !paidBy ||
                selectedFriends.length === 0 ||
                (splitType === "custom" && remainingAmount !== 0)
              }
            >
              Add Expense
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ExpenseForm;
