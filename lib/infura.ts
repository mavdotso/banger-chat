import { createConfig, http } from '@wagmi/core';
import { walletConnect } from '@wagmi/connectors';
import { blast } from '@wagmi/core/chains';

export const infuraConfig = createConfig({
    chains: [blast],
    connectors: [
        walletConnect({
            projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID as string,
        }),
    ],
    transports: {
        [blast.id]: http(),
    },
});
