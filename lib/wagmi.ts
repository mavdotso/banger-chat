import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';
import { createPublicClient, http } from 'viem';
import { cookieStorage, createStorage } from 'wagmi';
import { blast } from 'wagmi/chains';

export const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!;

const metadata = {
    name: 'Banger chat',
    description: 'Chat with your Fantasy.top friends',
    url: 'https://banger.chat/',
    icons: ['https://avatars.githubusercontent.com/u/37784886'],
};

const chains = [blast] as const;
export const wagmiConfig = defaultWagmiConfig({
    chains,
    projectId,
    metadata,
    ssr: true,
    storage: createStorage({
        storage: cookieStorage,
    }),
});

export const wagmiPublicClient = createPublicClient({
    chain: blast,
    transport: http(),
});
