'use client';
import { usePrivy } from '@privy-io/react-auth';
import { Button } from '../ui/button';
import ChatList from './chat-list';
import ChatWindow from './chat-window';
import { useConvexAuth } from 'convex/react';
import { useEffect } from 'react';

export default function ChatPage() {
    const { ready, authenticated, login, logout } = usePrivy();
    const session = useConvexAuth();

    const disableLogin = !ready || (ready && authenticated);
    const disableLogout = !ready || (ready && !authenticated);

    useEffect(() => {
        console.log('Privy:', authenticated);
        console.log('Convex:', session);
    }, [session, authenticated]);

    return (
        <main className="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3">
            {authenticated ? (
                <>
                    <ChatList />
                    <ChatWindow />
                    <Button disabled={disableLogout} onClick={logout}>
                        Log out
                    </Button>
                </>
            ) : (
                <Button disabled={disableLogin} onClick={login}>
                    Log in
                </Button>
            )}
        </main>
    );
}
