"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { db } from "@/utils/dbConfig";
import { desc, getTableColumns, sql } from "drizzle-orm";
import { Budgets } from "@/utils/schema";
import { Expenses } from "@/utils/schema";
import { eq } from "drizzle-orm";
import ExpenseListTable from "./_components/ExpenseListTable";


const ExpenseHome = () => {
    const { user } = useUser();
    const [budgetList, setBudgetList] = useState([]);
    const [expensesList, setExpensesList] = useState([]);

    useEffect(() => {
        if (user && user.primaryEmailAddress) {
            getBudgetList();
        }
    }, [user]);

    const getBudgetList = async () => {
        try {
            const result = await db
                .select({
                    ...getTableColumns(Budgets),
                    totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
                    totalItems: sql`count(${Expenses.id})`.mapWith(Number),
                })
                .from(Budgets)
                .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
                .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
                .groupBy(Budgets.id)
                .orderBy(desc(Budgets.id));

            setBudgetList(result);
            getAllExpenses();
        } catch (error) {
            console.error("Error fetching budget list:", error);
        }
    };

    const getAllExpenses = async () => {
        try {
            const result = await db
                .select({
                    id: Expenses.id,
                    name: Expenses.name,
                    amount: Expenses.amount,
                    createdAt: Expenses.createdAt,
                })
                .from(Budgets)
                .rightJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
                .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
                .orderBy(desc(Expenses.id));

            setExpensesList(result);
        } catch (error) {
            console.error("Error fetching expenses list:", error);
        }
    };

    return (
        <div>
            <div className="p-7">
                <ExpenseListTable
                    expenseList={expensesList}
                    refreshData={() => getBudgetList()}
                />
            </div>
        </div>
    );
};

export default ExpenseHome;
