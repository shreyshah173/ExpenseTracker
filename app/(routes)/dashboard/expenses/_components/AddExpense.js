import { Button } from '@/components/ui/button';
import { db } from '@/utils/dbConfig';
import React, { useState } from 'react';
import { Expenses } from '@/utils/schema';
import { toast } from '@/components/ui/use-toast';
import moment from 'moment/moment';

const AddExpense = ({ budgetId, user, refreshData }) => {
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');

    const addExpense = async () => {
        try {
            // Convert amount to a number
            const parsedAmount = Number(amount);
            if (isNaN(parsedAmount) || parsedAmount <= 0) {
                toast({
                    title: "Invalid Amount",
                    description: "Please enter a valid number greater than 0",
                    status: "error",
                });
                return;
            }

            // Insert the new expense
            const result = await db.insert(Expenses).values({
                name: name,
                amount: parsedAmount, // Ensure amount is a number
                budgetId: budgetId,
                createdAt: moment().format('YYYY-MM-DD'),
            }).returning({ insertedId: Expenses.id }); // Correct table reference

            console.log(result);

            if (result.length > 0) {
                refreshData();
                toast({
                    title: "Success",
                    description: "Expense Added Successfully!",
                    status: "success",
                });

                // Clear the input fields after successful addition
                setName('');
                setAmount('');
            }
        } catch (error) {
            console.error("Error adding expense:", error);
            toast({
                title: "Error",
                description: "Failed to add expense. Please try again.",
                status: "error",
            });
        }
    }

    return (
        <div className='border p-5 rounded-lg'>
            <h2 className='font-bold text-lg'>Add Expenses</h2>
            <div className='mt-3'>
                <h2 className='text-black font-medium my-1'>Expense Name</h2>
                <input
                    type="text"
                    value={name} // Bind input to state
                    placeholder='e.g. Home Decor'
                    className='w-full p-2 border border-gray-300 rounded mt-2'
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div className='mt-3'>
                <h2 className='text-black font-medium my-1'>Expense Amount</h2>
                <input
                    type="number" // Use number input
                    value={amount} // Bind input to state
                    placeholder='e.g. 1000'
                    className='w-full p-2 border border-gray-300 rounded mt-2'
                    onChange={(e) => setAmount(e.target.value)}
                />
            </div>
            <Button className='mt-5 w-full' onClick={addExpense} disabled={!(name && amount)}>Add New Expense</Button>
        </div>
    )
}

export default AddExpense;
