import { useCallback, useMemo } from 'react';
import { usePrivy } from '@privy-io/react-auth';

// TODO:
export function usePrivyAuth() {
    const { getAccessToken, authenticated, ready } = usePrivy();

    const fetchAccessToken = useCallback(async ({ forceRefreshToken = true }: { forceRefreshToken: boolean }) => {
        if (forceRefreshToken) {
            const accessToken = await getAccessToken();
            if (accessToken) {
                const verifyAuthToken = await fetch('/api/auth/verifyToken', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        accessToken: accessToken,
                    }),
                });

                if (verifyAuthToken.status === 200) {
                    console.log('Privy authenticated?', authenticated);
                    return authenticated;
                } else {
                    console.log('Request failed', verifyAuthToken.status);
                    return null;
                }
            } else {
                console.log("Couldn't get a token");
                return null;
            }
        } else {
            return await getAccessToken();
        }
    }, []);

    return useMemo(
        () => ({
            isLoading: !ready,
            isAuthenticated: authenticated ?? false,
            fetchAccessToken,
        }),
        [authenticated, ready, fetchAccessToken]
    );
}
