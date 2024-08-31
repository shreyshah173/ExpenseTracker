"use client";
import React, { useEffect, useState } from 'react';
import { PiggyBank, ReceiptText, Wallet } from 'lucide-react';

const CardInfo = ({ budgetList }) => {
    const [totalBudget, setTotalBudget] = useState(0);
    const [totalSpend, setTotalSpend] = useState(0);
    const [numberOfBudgets, setNumberOfBudgets] = useState(0);

    useEffect(() => {
        CalculateCardinfo();
    }, [budgetList]);

    const CalculateCardinfo = () => {
        console.log("Budget List:", budgetList);
        let totalBudget_ = 0;
        let totalSpend_ = 0;
        let numberOfBudgets_ = budgetList.length;

        budgetList.forEach(element => {
            totalBudget_ += Number(element.amount);
            totalSpend_ += element.totalSpend;
        });

        console.log("Total Budget:", totalBudget_);
        console.log("Total Spend:", totalSpend_);

        setTotalBudget(totalBudget_);
        setTotalSpend(totalSpend_);
        setNumberOfBudgets(numberOfBudgets_);
    }

    return (
        <div className='mt-7'>
            {budgetList && budgetList.length > 0 ? (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
                    <div className='p-7 border rounded-lg flex items-center justify-between'>
                        <div>
                            <h2 className='text-sm'>Total Budget</h2>
                            <h2 className='font-bold text-2xl'>{totalBudget}$</h2>
                        </div>
                        <PiggyBank className='bg-primary p-3 h-12 w-12 rounded-full text-white'/>
                    </div>
                    <div className='p-7 border rounded-lg flex items-center justify-between'>
                        <div>
                            <h2 className='text-sm'>Total Spend</h2>
                            <h2 className='font-bold text-2xl'>{totalSpend}$</h2>
                        </div>
                        <ReceiptText className='bg-primary p-3 h-12 w-12 rounded-full text-white'/>
                    </div>
                    <div className='p-7 border rounded-lg flex items-center justify-between'>
                        <div>
                            <h2 className='text-sm'>No. of Budgets</h2>
                            <h2 className='font-bold text-2xl'>{numberOfBudgets}</h2>
                        </div>
                        <Wallet className='bg-primary p-3 h-12 w-12 rounded-full text-white'/>
                    </div>
                </div>
            ) : (
                [1, 2, 3].map((item, index) => (
                    <div key={index} className='w-full bg-slate-200 rounded-lg h-[145px] animate-pulse'></div>
                ))
            )}
        </div>
    )
}

export default CardInfo;
