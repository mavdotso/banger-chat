const authConfig = {
    providers: [
        {
            domain: process.env.PRIVY_JWKS_ENDPOINT_URL,
            applicationID: process.env.NEXT_PUBLIC_PRIVY_APP_ID,
        },
    ],
};

export default authConfig;
