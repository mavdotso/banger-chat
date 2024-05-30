import React from 'react';
import OAuthLogin from './_components/oauth-login';

export default function LoginPage() {
    return (
        <div className="max-w-[370px] mx-auto py-16 w-full z-50 text-center">
            <div className="mt-6 space-y-5 ">
                <OAuthLogin />
            </div>
        </div>
    );
}
