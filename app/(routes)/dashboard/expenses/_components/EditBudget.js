"use client"

import { Button } from '@/components/ui/button'
import { PenBox } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import EmojiPicker from 'emoji-picker-react';
import { Budgets } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import { db } from '@/utils/dbConfig';
import { useToast } from "@/components/ui/use-toast"
import { eq } from 'drizzle-orm';


const EditBudget = ({ budgetInfo, refreshdata }) => {
    const [emojiIcon, setEmojiIcon] = useState();
    const [emojiPicker, setEmojiPicker] = useState(false);
    const [name, setName] = useState();
    const [amount, setAmount] = useState();
    const { user } = useUser();
    const { toast } = useToast();

    useEffect(() => {

        if (budgetInfo) {
            setEmojiIcon(budgetInfo?.icon);
            setName(budgetInfo?.name);
            setAmount(budgetInfo?.amount);
        }
    }, [budgetInfo])

    const onUpdateBudget = async () => {
        const result = await db.update(Budgets).set({
            name: name,
            amount: amount,
            icon: emojiIcon,
        }).where(eq(Budgets.id, budgetInfo.id))
            .returning();

        if (result) {

            refreshdata();
            toast({
                title: "Budget Updated Successfully!",
            })
        }
    }

    console.log("New Budget:", budgetInfo)
    return (
        <div>

            <Dialog>
                <DialogTrigger asChild>
                    <Button className="flex gap-2"><PenBox /> Edit</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Update Budget</DialogTitle>
                        <DialogDescription>
                            <div className='mt-5'>
                                <Button variant='outline' onClick={() => setEmojiPicker(!emojiPicker)}>
                                    {budgetInfo?.icon}
                                </Button>
                                {emojiPicker && (
                                    <div className='absolute z-20'>
                                        <EmojiPicker
                                            onEmojiClick={(e) => {
                                                setEmojiIcon(e.emoji);
                                                setEmojiPicker(false);
                                            }}
                                        />
                                    </div>
                                )}
                                <div className='mt-3'>
                                    <h2 className='text-black font-medium my-1'>Budget Name</h2>
                                    <input
                                        type="text"
                                        placeholder='e.g. Home Decor'
                                        defaultValue={budgetInfo?.name}
                                        className='w-full p-2 border border-gray-300 rounded mt-2'
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div className='mt-3'>
                                    <h2 className='text-black font-medium my-1'>Budget Amount</h2>
                                    <input
                                        type="number"
                                        placeholder='e.g. $5000'
                                        defaultValue={budgetInfo?.amount}
                                        className='w-full p-2 border border-gray-300 rounded mt-2'
                                        onChange={(e) => setAmount(e.target.value)}
                                    />
                                </div>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="sm:justify-start">
                        <DialogClose asChild>
                            <Button disabled={!(name && amount)} className="mt-5 w-full" onClick={() => onUpdateBudget()}>Update Budget</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default EditBudget
