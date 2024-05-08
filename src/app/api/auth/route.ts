import { privy } from '@/lib/privy';

export async function POST(req: Request) {
    const { accessToken } = await req.json();

    if (!accessToken) return new Response('No access token', { status: 400 });

    try {
        const verifiedClaims = await privy.verifyAuthToken(accessToken);

        if (!verifiedClaims || verifiedClaims.issuer !== 'privy.io' || verifiedClaims.appId !== process.env.NEXT_PUBLIC_PRIVY_APP_ID) {
            return new Response('Unauthorized', { status: 401 });
        }

        return new Response('Authorised', { status: 200 });
    } catch (error) {
        return new Response(null, { status: 500 });
    }
}
