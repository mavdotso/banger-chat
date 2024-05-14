import { createPublicClient, createWalletClient, custom, http } from 'viem';
import { blast } from 'viem/chains';

export const viemClient = createPublicClient({
    chain: blast,
    transport: http(),
});

export const viemWallet = createWalletClient({
    chain: blast,
    transport: custom(window.ethereum!),
});

declare global {
    interface Window {
        ethereum: any;
    }
}
