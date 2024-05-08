'use client';
import { usePrivy } from '@privy-io/react-auth';
import { Button } from '../ui/button';
import ChatList from './chat-list';
import ChatWindow from './chat-window';

export default function ChatPage() {
    const { authenticated } = usePrivy();

    return (
        <main className="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3">
            {authenticated && (
                <>
                    <ChatList />
                    <ChatWindow />
                </>
            )}
        </main>
    );
}
