import { readContract } from '@wagmi/core';
import { wagmiConfig } from './wagmi';
import abi from '@/lib/ft-cards-contract-abi.json';

export default async function getCardsBalance(walletAddress: string) {
    return await readContract(wagmiConfig, {
        abi,
        address: process.env.FT_CARDS_CONTRACT_ADDRESS as `0x{string}`,
        functionName: 'balanceOf',
        args: [walletAddress],
        account: walletAddress as `0x{string}`,
    });
}
