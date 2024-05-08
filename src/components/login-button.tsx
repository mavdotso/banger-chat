'use client';
import { LogOut, Wallet } from 'lucide-react';
import { Button } from './ui/button';
import { usePrivy } from '@privy-io/react-auth';

export default function LoginButton() {
    const { ready, authenticated, login, logout } = usePrivy();

    const disableLogin = !ready || (ready && authenticated);
    const disableLogout = !ready || (ready && !authenticated);

    return (
        <>
            {authenticated ? (
                <>
                    {/* <Button variant="outline" size="icon" className="ml-auto gap-1.5 text-sm">
                <User className="size-4" />
            </Button> */}
                    <Button variant="outline" size="icon" className="ml-auto gap-1.5 text-sm" disabled={disableLogout} onClick={logout}>
                        <LogOut className="size-4" />
                    </Button>
                </>
            ) : (
                <Button variant="outline" size="icon" className="ml-auto gap-1.5 text-sm" disabled={disableLogin} onClick={login}>
                    <Wallet className="size-4" />
                </Button>
            )}
        </>
    );
}
