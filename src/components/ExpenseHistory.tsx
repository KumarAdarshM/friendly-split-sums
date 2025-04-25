
import React, { useState } from "react";
import { useAppContext, categories } from "../context/AppContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import FriendAvatar from "./FriendAvatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Receipt, Trash } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const ExpenseHistory: React.FC = () => {
  const { expenses, friends, deleteExpense } = useAppContext();
  const [filter, setFilter] = useState("all");
  const [selectedExpenseId, setSelectedExpenseId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  const getFriendName = (id: string) => {
    const friend = friends.find((f) => f.id === id);
    return friend ? friend.name : "Unknown";
  };

  const getFriendColor = (id: string) => {
    const friend = friends.find((f) => f.id === id);
    return friend ? friend.avatarColor : "#ccc";
  };

  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    return category ? category.icon : "📦";
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  const filteredExpenses = filter === "all" 
    ? expenses 
    : expenses.filter(expense => expense.category === filter);

  const confirmDelete = (id: string) => {
    setSelectedExpenseId(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (selectedExpenseId) {
      deleteExpense(selectedExpenseId);
      setDeleteDialogOpen(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2 justify-between">
          <div className="flex items-center gap-2">
            <Receipt size={18} />
            <span>Expense History</span>
          </div>
          <Select
            value={filter}
            onValueChange={setFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  <div className="flex items-center gap-2">
                    <span>{category.icon}</span>
                    <span>{category.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {filteredExpenses.length > 0 ? (
          <div className="space-y-4">
            {filteredExpenses.map((expense) => (
              <div key={expense.id} className="expense-item">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="bg-app-purple-light text-app-purple-dark p-2 rounded-full">
                      <span className="text-xl">{getCategoryIcon(expense.category)}</span>
                    </div>
                    <div>
                      <h3 className="font-medium">{expense.title}</h3>
                      <p className="text-sm text-gray-500">{formatDate(expense.createdAt)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${expense.amount.toFixed(2)}</p>
                    <p className="text-sm flex items-center justify-end gap-1">
                      <span>Paid by</span>
                      <FriendAvatar 
                        name={getFriendName(expense.paidBy)} 
                        color={getFriendColor(expense.paidBy)} 
                        size="sm" 
                      />
                    </p>
                  </div>
                </div>
                <div className="flex justify-between mt-3 items-center">
                  <div className="flex flex-wrap gap-2">
                    {expense.participants.map((participant) => (
                      <div
                        key={participant.friendId}
                        className="bg-gray-100 text-xs px-3 py-1 rounded-full flex items-center gap-1"
                      >
                        <FriendAvatar
                          name={getFriendName(participant.friendId)}
                          color={getFriendColor(participant.friendId)}
                          size="sm"
                        />
                        <span className="whitespace-nowrap">
                          {getFriendName(participant.friendId)}: ${participant.amount.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => confirmDelete(expense.id)}
                  >
                    <Trash size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Receipt size={36} className="mx-auto mb-2 opacity-30" />
            <p>No expenses found</p>
            {filter !== "all" && (
              <p className="text-sm mt-1">Try selecting a different category</p>
            )}
          </div>
        )}
      </CardContent>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Expense</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this expense? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ExpenseHistory;
