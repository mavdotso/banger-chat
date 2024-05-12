'use client';

import ChatContainer from '@/components/shared/chat/chat-container';
import LeaveChatDialog from './_components/dialogs/leave-chat-dialog';
import ChatInput from './_components/input/chat-input';
import { Id } from '@/convex/_generated/dataModel';
import { api } from '@/convex/_generated/api';
import Body from './_components/body/body';
import Header from './_components/header';
import React, { useState } from 'react';
import { useQuery } from 'convex/react';
import { Loader2 } from 'lucide-react';

type Props = {
    params: {
        chatId: Id<'chats'>;
    };
};

export default function ChatPage({ params: { chatId } }: Props) {
    const chat = useQuery(api.chat.get, { id: chatId });
    const [leaveChatDialogOpen, setLeaveChatDialogOpen] = useState(false);
    const [callType, setCallType] = useState<'audio' | 'video' | null>(null);

    return chat === undefined ? (
        <div className="w-full h-full flex items-center justify-center">
            <Loader2 className="h-8 w-8" />
        </div>
    ) : chat === null ? (
        <p className="w-full h-full flex items-center justify-center">Chat not found</p>
    ) : (
        <ChatContainer>
            <LeaveChatDialog chatId={chatId} open={leaveChatDialogOpen} setOpen={setLeaveChatDialogOpen} />
            <Header
                name={chat.name}
                imageUrl={chat.imageUrl}
                options={[
                    {
                        label: 'Leave chat',
                        destructive: false,
                        onClick: () => setLeaveChatDialogOpen(true),
                    },
                ]}
                setCallType={setCallType}
            />
            <Body members={chat.otherMembers ? chat.otherMembers : []} callType={callType} setCallType={setCallType} />
            <ChatInput />
        </ChatContainer>
    );
}
