'use client';
import { useChannelStore } from '@/store/channel-store';
import MessageBox from './message-box';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useEffect, useRef } from 'react';
import ChatBubble from './chat-bubble';

export default function ChatWindow() {
    const { selectedChannel } = useChannelStore();

    const messages = useQuery(api.messages.getMessages, {
        channelId: selectedChannel!._id,
    });

    const me = useQuery(api.users.getMe);
    const lastMessageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setTimeout(() => {
            lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    }, [messages]);

    return (
        <div className="relative flex h-full min-h-[50vh] border flex-col rounded-xl bg-muted p-4 lg:col-span-2">
            <div className="flex-1">
                {messages?.map((msg, idx) => (
                    <div key={msg._id} ref={lastMessageRef}>
                        <ChatBubble message={msg} me={me} previousMessage={idx > 0 ? messages[idx - 1] : undefined} />
                    </div>
                ))}
            </div>
            <MessageBox />
        </div>
    );
}
