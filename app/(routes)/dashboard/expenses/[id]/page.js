"use client";

import { useUser } from '@clerk/nextjs';
import React, { useEffect, useState } from 'react';
import { desc, eq } from 'drizzle-orm';
import { getTableColumns, sql } from 'drizzle-orm';
import { db } from '@/utils/dbConfig';
import { Budgets, Expenses } from '@/utils/schema';
import BudgetItem from '../../budgets/_components/budgetItem';
import AddExpense from '../_components/AddExpense';
import ExpenseListTable from '../_components/ExpenseListTable';
import { PenBox, Trash } from 'lucide-react';
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useRouter } from 'next/navigation';
import { toast } from '@/components/ui/use-toast';
import EditBudget from '../_components/EditBudget';

const ExpensesScreen = ({ params }) => {
  const { user } = useUser();
  const [budgetInfo, setBudgetInfo] = useState(null); // Initialize state as null
  const [loading, setLoading] = useState(true); // Loading state
  const [expenseList, setExpenseList] = useState([]); // State for storing expenses
  const route = useRouter();

  useEffect(() => {
    if (user) {
      console.log("User Email:", user?.primaryEmailAddress?.emailAddress); // Check user email
      console.log("Params ID:", params.id); // Check params ID
      getBudgetInfo(); // Directly call getBudgetInfo() if user is defined
    } else {
      console.warn("User is not authenticated or user information is not available.");
    }
  }, [user]);

  useEffect(() => {
    console.log("Updated Budget Info:", budgetInfo); // Log whenever budgetInfo updates
  }, [budgetInfo]);

  const getBudgetInfo = async () => {
    setLoading(true);
  
    // Fetch budget info
    const budgetResult = await db
      .select({
        ...getTableColumns(Budgets),
        totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
        totalItems: sql`count(${Expenses.id})`.mapWith(Number),
      })
      .from(Budgets)
      .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
      .where(eq(Budgets.id, params.id))
      .groupBy(Budgets.id);
  
    console.log("Budget Query Result:", budgetResult); // Log the entire result array
  
    if (budgetResult.length > 0) {
      setBudgetInfo(budgetResult[0]); // Set the budget info
      console.log("Budget Info:", budgetResult[0]); // Log the correct budget info
    } else {
      console.warn("No budget info found for the given ID and user."); // Log warning
      setBudgetInfo(null); // Explicitly set to null if no data
    }
  
    // Fetch expense list
    const expenseResult = await getExpenseList();
    setExpenseList(expenseResult); // Set the expenses list
    console.log("Expenses List:", expenseResult); // Log the expenses
  
    setLoading(false); // End loading
  };
  

  const getExpenseList = async () => {
    try {
      // Fetch expenses related to a specific budget
      const result = await db
        .select()
        .from(Expenses)
        .where(eq(Expenses.budgetId, params.id))
        .orderBy(desc(Expenses.id));

      return result; // Return result to setExpenseList
    } catch (error) {
      console.error("Error fetching expenses:", error);
      return []; // Return empty array on error
    }
  };

  const deleteBudget = async () => {
    const deleteExpenses = await db.delete(Expenses)
      .where(eq(Expenses.budgetId, params.id))
      .returning();

    if (deleteExpenses) {
      const result = await db.delete(Budgets)
        .where(eq(Budgets.id, params.id))
        .returning();

      console.log(result);
    }
    toast({
      title: "Budget Deleted Successfully!",
      status: "success",
    });
    route.replace('/dashboard/budgets');
  };

  return (
    <div className="p-8">
      <h2 className="font-bold text-2xl flex justify-between items-center">
        My Expenses
        <div className='flex gap-2 items-center'>
          <EditBudget budgetInfo={budgetInfo} 
          refreshdata={()=>getBudgetInfo()}/>
          <AlertDialog>
            <AlertDialogTrigger>
              <Button className="flex gap-2" variant="destructive">
                <Trash /> Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your current budget along with all the expenses.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => deleteBudget()}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 mt-6 gap-5">
        {budgetInfo ? (
          <BudgetItem budget={budgetInfo} />
        ) : (
          <div className="h-[150px] w-full bg-slate-200 rounded-lg animate-pulse"></div>
        )}
        <AddExpense
          budgetId={params.id}
          user={user}
          refreshData={getBudgetInfo} // Pass reference to the function
        />
      </div>
      <div className='mt-4'>
        
        <ExpenseListTable
          expenseList={expenseList}
          refreshData={() => getBudgetInfo()}
        />
      </div>
    </div>
  );
};

export default ExpensesScreen;
