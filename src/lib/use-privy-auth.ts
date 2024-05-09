import { useCallback, useMemo } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import jwt from 'jsonwebtoken';

// TODO:
export function usePrivyAuth() {
    const { getAccessToken, authenticated, ready } = usePrivy();

    const fetchAccessToken = useCallback(async () => {
        let decoded;
        console.log('Not ready');
        if (ready) {
            console.log('Ready');
            const accessToken = await getAccessToken();
            console.log('Access token', accessToken);

            if (accessToken) {
                const verificationKey = process.env.NEXT_PUBLIC_PRIVY_PUBLIC_KEY!.replace(/\\n/g, '\n');
                decoded = jwt.verify(accessToken, verificationKey, {
                    issuer: 'privy.io',
                    audience: 'clvxzus1102hr132wssmha2tr',
                });
                console.log('Decoded', decoded);
            }

            return decoded;
        }
        return null;
    }, [getAccessToken, ready]);

    return useMemo(
        () => ({
            isLoading: !ready,
            isAuthenticated: ready && authenticated,
            fetchAccessToken,
        }),
        [authenticated, ready, fetchAccessToken]
    );
}
