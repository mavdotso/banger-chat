'use client';

import * as React from 'react';
import { useClerk } from '@clerk/nextjs';
import { type SSOCallbackPageProps } from '../page';
import { LoaderIcon } from 'lucide-react';

export default function SSOCallbackComponent({ searchParams }: SSOCallbackPageProps) {
    const { handleRedirectCallback } = useClerk();

    React.useEffect(() => {
        void handleRedirectCallback(searchParams);
    }, [searchParams, handleRedirectCallback]);

    return (
        <div role="status" aria-label="Loading" aria-describedby="loading-description" className="flex items-center justify-center">
            <LoaderIcon className="h-16 w-16 animate-spin" aria-hidden="true" />
        </div>
    );
}
