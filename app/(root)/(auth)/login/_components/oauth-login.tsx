'use client';

import { useEffect, useState } from 'react';
import { useSignIn, useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { catchClerkError } from '@/lib/utils';
import { Icons } from '@/components/icons';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function OAuthLogin() {
    const [isLoading, setIsLoading] = useState<boolean | null>(null);
    const { signIn, isLoaded: signInLoaded } = useSignIn();
    const user = useUser();
    const router = useRouter();

    // useEffect(() => {
    //     if (user.isSignedIn) router.push('/chats');
    // }, [user, router]);

    async function oauthSignInTwitter() {
        if (!signInLoaded) return null;
        try {
            setIsLoading(true);
            await signIn.authenticateWithRedirect({
                strategy: 'oauth_x',
                redirectUrl: '/sso-callback',
                redirectUrlComplete: '/',
                continueSignUp: true,
            });
        } catch (error) {
            setIsLoading(false);
            catchClerkError(error);
        }
    }

    async function oauthSignInMetamask() {
        if (!signInLoaded) return null;
        try {
            setIsLoading(true);
            const signedIn = await signIn.authenticateWithMetamask();
            if (signedIn.status === 'complete') {
                setIsLoading(false);
                toast.success('Signed in successfully');
                window.location.href = '/chats';
            }
        } catch (error) {
            setIsLoading(false);
            catchClerkError(error);
        }
    }

    return (
        <div className="flex flex-col gap-2">
            <Button
                aria-label={`Continue with Twitter`}
                variant="outline"
                className="bg-transparent  flex justify-center items-center py-5 px-3 rounded-xl transform active:scale-95 transition-transform cursor-pointer select-none h-16 w-full text-base hover:bg-primary/10"
                onClick={() => void oauthSignInTwitter()}
                disabled={isLoading!}
            >
                {isLoading ? <Icons.spinner className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" /> : <Icons.x className="mr-2 h-4 w-4 fill-foreground" />}
                Continue with X (Twitter)
            </Button>
            <Button
                aria-label={`Continue with Metamask`}
                variant="outline"
                className="bg-transparent  flex justify-center items-center py-5 px-3 rounded-xl transform active:scale-95 transition-transform cursor-pointer select-none h-16 w-full text-base hover:bg-primary/10 "
                onClick={() => void oauthSignInMetamask()}
                disabled={isLoading!}
            >
                {isLoading ? <Icons.spinner className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" /> : <Icons.metamask className="mr-2 h-4 w-4" aria-hidden="true" />}
                Continue with Metamask
            </Button>
        </div>
    );
}
