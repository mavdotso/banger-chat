import { type HandleOAuthCallbackParams } from '@clerk/types';
import SSOCallbackComponent from './_components/sso-callback';

export interface SSOCallbackPageProps {
    searchParams: HandleOAuthCallbackParams;
}

export default function SSOCallbackPage({ searchParams }: SSOCallbackPageProps) {
    return (
        <div className="h-[90vh] flex justify-center items-center">
            <SSOCallbackComponent searchParams={searchParams} />
        </div>
    );
}
