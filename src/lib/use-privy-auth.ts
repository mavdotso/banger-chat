import { useCallback, useMemo } from 'react';
import { usePrivy } from '@privy-io/react-auth';

// TODO: ???
export function usePrivyAuth() {
    const { getAccessToken, authenticated, ready } = usePrivy();

    const fetchAccessToken = useCallback(
        async ({ forceRefreshToken }: { forceRefreshToken: boolean }) => {
            if (forceRefreshToken) {
                const accessToken = await getAccessToken();
                if (accessToken) {
                    const verifyAuthToken = await fetch('/api/auth', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            accessToken: accessToken,
                        }),
                    });

                    if (verifyAuthToken.status === 200) {
                        return accessToken;
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
        },
        [getAccessToken]
    );

    return useMemo(
        () => ({
            isLoading: !ready,
            isAuthenticated: !!authenticated,
            fetchAccessToken,
        }),
        [authenticated, ready, fetchAccessToken]
    );
}
