"use client";
import React, { useEffect } from 'react'
import CreateBudget from './createBudget'
import { db } from '@/utils/dbConfig'
import { desc, getTableColumns, sql } from 'drizzle-orm'
import { Budgets } from '@/utils/schema'
import { Expenses } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import { useUser } from '@clerk/nextjs'
import BudgetItem from './budgetItem'

const BudgetList = () => {
    const { user } = useUser()
    const [budgetList, setBudgetList] = React.useState([])

    useEffect(() => {
        if (user) {
            getBudgetList()
        }
    }, [user])

    const getBudgetList = async () => {
        try {
            const result = await db.select({
                ...getTableColumns(Budgets),
                totalSpend: sql `sum(${Expenses.amount})`.mapWith(Number),
                totalItems: sql `count(${Expenses.id})`.mapWith(Number)
            }).from(Budgets)
                .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
                .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
                .groupBy(Budgets.id)
                .orderBy(desc(Budgets.id));

            setBudgetList(result)
        } catch (error) {
            console.error("Error fetching budget list:", error)
        }
    }

    return (
        <div className='m-7'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
                <CreateBudget refreshData={()=>getBudgetList()} />
                {budgetList?.length>0? budgetList.map((budget,index) => (
                    <BudgetItem budget={budget}/>
                )):
                [1,2,3,4,5,6].map((item,index)=>
                    <div key={index} className='w-full bg-slate-200 rounded-lg h-[145px] animate-pulse'></div>
                )}
            </div>
        </div>
    )
}

export default BudgetList
