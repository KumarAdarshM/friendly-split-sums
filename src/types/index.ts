
export type Friend = {
  id: string;
  name: string;
  avatarColor: string;
};

export type ExpenseParticipant = {
  friendId: string;
  amount: number;
};

export type Expense = {
  id: string;
  createdAt: Date;
  title: string;
  amount: number;
  paidBy: string;
  participants: ExpenseParticipant[];
  category: string;
};

export type Balance = {
  from: Friend;
  to: Friend;
  amount: number;
};

export type CategoryType = {
  id: string;
  name: string;
  icon: string;
};
