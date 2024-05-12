'use client';

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useMutationState } from '@/hooks/useMutationState';
import { ConvexError } from 'convex/values';
import { Dispatch, SetStateAction } from 'react';
import { toast } from 'sonner';

type Props = {
    chatId: Id<'chats'>;
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
};

export default function LeaveChatDialog({ chatId, open, setOpen }: Props) {
    const { mutate: leaveChat, pending } = useMutationState(api.chat.leaveChat);

    async function handleLeaveChat() {
        leaveChat({ chatId })
            .then(() => {
                toast.success('You successfully left the chat');
            })
            .catch((error) => {
                toast.error(error instanceof ConvexError ? error.data : 'Unexpected error occurred');
            });
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>This action cannot be undone. You will not be able to see any previous messages or send new messages to this chat</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
                    <AlertDialogAction disabled={pending} onClick={handleLeaveChat}>
                        Leave
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
