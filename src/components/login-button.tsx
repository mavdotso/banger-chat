'use client';
import { LogOut, Wallet } from 'lucide-react';
import { Button } from './ui/button';
import { useLogin, usePrivy } from '@privy-io/react-auth';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

export default function LoginButton() {
    const { ready, authenticated, logout } = usePrivy();
    const addUserMutation = useMutation(api.users.addUser);

    const { login } = useLogin({
        onComplete: async (user, isNewUser, wasAlreadyAuthenticated, loginMethod, loginAccount) => {
            if (isNewUser) {
                const userDetails = {
                    userId: user.id,
                    twitterHandle: user.twitter?.profilePictureUrl || '',
                    walletAddress: user.wallet?.address || '',
                    profileImage: user.twitter?.profilePictureUrl || '',
                    displayName: user.twitter?.name || '',
                    role: 'user',
                    email: user.email?.address || '',
                };
                await addUserMutation(userDetails);
            }
        },
    });

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
