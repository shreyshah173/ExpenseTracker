"use client"
import React, { useState } from 'react';

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
import { Button } from '@/components/ui/button';
import { Budgets } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import { db } from '@/utils/dbConfig';
import { useToast } from "@/components/ui/use-toast"


const CreateBudget = ({refreshData}) => {
    const [emojiIcon, setEmojiIcon] = useState('😊');
    const [emojiPicker, setEmojiPicker] = useState(false);

    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');

    const { user } = useUser();

    const { toast } = useToast();

    // to create a new budget
    const onCreateBudget = async () => {
        const result = await db.insert(Budgets).values({
            name: name,
            amount: amount,
            createdBy: user?.primaryEmailAddress?.emailAddress,
            icon: emojiIcon,
        }).returning({ insertedId: Budgets.id });

        if (result) {
            refreshData()
            toast({
                title: "Budget Created Successfully!",
            })
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <div>
                    <div className='bg-slate-100 p-10 rounded-md items-center flex flex-col border-2 border-dashed cursor-pointer hover:shadow-md'>
                        <h2 className='text-3xl'>+</h2>
                        <h2>Create New Budget</h2>
                    </div>
                </div>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Budget</DialogTitle>
                    <DialogDescription>
                        <div className='mt-5'>
                            <Button variant='outline' onClick={() => setEmojiPicker(!emojiPicker)}>
                                {emojiIcon}
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
                                    className='w-full p-2 border border-gray-300 rounded mt-2'
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className='mt-3'>
                                <h2 className='text-black font-medium my-1'>Budget Amount</h2>
                                <input
                                    type="number"
                                    placeholder='e.g. $5000'
                                    className='w-full p-2 border border-gray-300 rounded mt-2'
                                    onChange={(e) => setAmount(e.target.value)}
                                />
                            </div>
                        </div>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                        <Button disabled={!(name && amount)} className="mt-5 w-full" onClick={onCreateBudget}>Create Budget</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default CreateBudget;
