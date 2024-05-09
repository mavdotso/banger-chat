'use client';
import { usePrivy } from '@privy-io/react-auth';
import ChatList from './chat-list';
import ChatWindow from './chat-window';
import { useEffect } from 'react';
import { useConvexAuth } from 'convex/react';

export default function ChatPage() {
    const { authenticated } = usePrivy();
    const session = useConvexAuth();

    useEffect(() => {
        console.log('Convex session:', session);
    }, [authenticated, session]);

    return (
        <main className="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3">
            {authenticated && (
                <>
                    <ChatList />
                    {/* <ChatWindow /> */}
                </>
            )}
        </main>
    );
}
