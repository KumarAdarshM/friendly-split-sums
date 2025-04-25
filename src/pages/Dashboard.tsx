
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ExpenseForm from "@/components/ExpenseForm";
import ExpenseHistory from "@/components/ExpenseHistory";
import FriendsList from "@/components/FriendsList";
import BalanceSummary from "@/components/BalanceSummary";
import { useIsMobile } from "@/hooks/use-mobile";

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("expenses");
  const isMobile = useIsMobile();
  
  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <header className="text-center my-4 md:my-8">
        <h1 className="text-2xl md:text-4xl font-bold text-app-purple">FriendlySplit</h1>
        <p className="text-sm md:text-base text-gray-600 mt-2">Track expenses and split bills with friends</p>
      </header>

      <div className="mb-6">
        <Tabs defaultValue="expenses" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className={`grid grid-cols-3 mb-4 md:mb-8 ${isMobile ? 'sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60' : ''}`}>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            <TabsTrigger value="balances">Balances</TabsTrigger>
            <TabsTrigger value="friends">Friends</TabsTrigger>
          </TabsList>
          
          <TabsContent value="expenses" className="space-y-4">
            <ExpenseForm />
            <ExpenseHistory />
          </TabsContent>
          
          <TabsContent value="balances">
            <BalanceSummary />
          </TabsContent>
          
          <TabsContent value="friends">
            <FriendsList />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
