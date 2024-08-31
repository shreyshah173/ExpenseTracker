"use client";
import React, { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import CardInfo from './_components/CardInfo';
import { db } from '@/utils/dbConfig'
import { desc, getTableColumns, sql } from 'drizzle-orm'
import { Budgets } from '@/utils/schema'
import { Expenses } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import BarChartDashboard from './_components/BarChartDashboard';
import BudgetItem from './budgets/_components/budgetItem';
import ExpenseListTable from './expenses/_components/ExpenseListTable';



const Dashboard = () => {

  const { user } = useUser();
  const [budgetList, setBudgetList] = useState([])
  const [expensesList, setExpensesList] = useState([])

  useEffect(() => {
    if (user) {
      getBudgetList()
    }
  }, [user])

  const getBudgetList = async () => {
    try {
      const result = await db.select({
        ...getTableColumns(Budgets),
        totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
        totalItems: sql`count(${Expenses.id})`.mapWith(Number)
      }).from(Budgets)
        .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
        .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
        .groupBy(Budgets.id)
        .orderBy(desc(Budgets.id));

      setBudgetList(result)
      getAllExpenses()
    } catch (error) {
      console.error("Error fetching budget list:", error)
    }
  }

  const getAllExpenses = async () => {
    const result = await db.select({
      id: Expenses.id,
      name: Expenses.name,
      amount: Expenses.amount,
      createdAt: Expenses.createdAt
    }).from(Budgets)
      .rightJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
      .orderBy(desc(Expenses.id))

    setExpensesList(result)
    // console.log(result)
  }

  return (
    <div className='p-5'>
      <h2 className='font-bold text-3xl'>Hii, {user?.fullName} ✌️</h2>
      <p className='text-gray-500'>Here's what happenning with your money,Lets Manage your expense</p>

      <CardInfo budgetList={budgetList} />
      <div className='grid grid-cols-1 md:grid-cols-3 mt-6 gap-5'>
        <div className='md:col-span-2'>
          <BarChartDashboard budgetList={budgetList} />
          <ExpenseListTable expenseList={expensesList}
          refreshData={()=>getBudgetList()}/>
        </div>
        <div className='grid gap-5'>
          <h2 className='font-bold text-lg'>Latest Budgets</h2>
          {budgetList.map((budget, index) => (
            <BudgetItem budget={budget} key={index} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard;
