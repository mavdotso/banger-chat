'use client';

import React from 'react';
import { useSignIn, useSignUp } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { catchClerkError } from '@/lib/utils';
import { Icons } from '@/components/icons';

export default function OAuthLogin() {
    const [isLoading, setIsLoading] = React.useState<boolean | null>(null);
    const { signIn, isLoaded: signInLoaded } = useSignIn();

    async function oauthSignInGoogle() {
        if (!signInLoaded) return null;
        try {
            setIsLoading(true);
            await signIn.authenticateWithRedirect({
                strategy: 'oauth_google',
                redirectUrl: '/sso-callback',
                redirectUrlComplete: '/',
                continueSignUp: true,
            });
        } catch (error) {
            setIsLoading(false);
            catchClerkError(error);
        }
    }

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
            // TOOD:
            await signIn.authenticateWithMetamask();
        } catch (error) {
            setIsLoading(false);
            catchClerkError(error);
        }
    }

    return (
        <div className="flex flex-col gap-2">
            {/* <Button
                aria-label={`Continue with Google`}
                variant="outline"
                className="bg-transparent flex justify-center items-center py-5 px-3 rounded-xl transform active:scale-95 transition-transform cursor-pointer select-none h-16 w-full text-base hover:bg-transparent border-[#333333] text-white hover:text-white"
                onClick={() => void oauthSignInGoogle()}
                disabled={isLoading!}
            >
                {isLoading ? <Icons.spinner className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" /> : <Icons.googleColor className="mr-2 h-4 w-4" aria-hidden="true" />}
                Continue with Google
            </Button> */}
            <Button
                aria-label={`Continue with Twitter`}
                variant="outline"
                className="bg-transparent flex justify-center items-center py-5 px-3 rounded-xl transform active:scale-95 transition-transform cursor-pointer select-none h-16 w-full text-base hover:bg-transparent border-[#333333] text-white hover:text-white"
                onClick={() => void oauthSignInTwitter()}
                disabled={isLoading!}
            >
                {isLoading ? <Icons.spinner className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" /> : <Icons.x className="mr-2 h-4 w-4" />}
                Continue with X (Twitter)
            </Button>
            <Button
                aria-label={`Continue with Metamask`}
                variant="outline"
                className="bg-transparent flex justify-center items-center py-5 px-3 rounded-xl transform active:scale-95 transition-transform cursor-pointer select-none h-16 w-full text-base hover:bg-transparent border-[#333333] text-white hover:text-white"
                onClick={() => void oauthSignInMetamask()}
                disabled={isLoading!}
            >
                {isLoading ? <Icons.spinner className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" /> : <Icons.metamask className="mr-2 h-4 w-4" aria-hidden="true" />}
                Continue with Metamask
            </Button>
        </div>
    );
}
