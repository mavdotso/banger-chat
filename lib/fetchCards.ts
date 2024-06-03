import { readContract } from '@wagmi/core';
import { wagmiConfig, wagmiPublicClient } from './wagmi';
import { parseAbiItem } from 'viem';
import { abi } from './ft-cards-contract-abi';

export async function getCardsBalance(walletAddress: string) {
    return await readContract(wagmiConfig, {
        abi,
        address: process.env.NEXT_PUBLIC_FT_CARDS_CONTRACT_ADDRESS as `0x{string}`,
        functionName: 'balanceOf',
        args: [walletAddress],
        account: walletAddress as `0x{string}`,
    });
}

export async function getUserOwnedTokenIds(walletAddress: string) {
    const incomingLogs = await wagmiPublicClient.getLogs({
        address: process.env.NEXT_PUBLIC_FT_CARDS_CONTRACT_ADDRESS as `0x{string}`,
        event: parseAbiItem('event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)'),
        args: {
            to: walletAddress as `0x{string}`,
        },
        fromBlock: 'earliest',
        toBlock: 'latest',
    });

    if (!incomingLogs) return;

    const tokenIdToOwnerMap = new Map<string, string>();

    for (const log of incomingLogs) {
        if (!log.args || !log.args.tokenId) continue;
        const tokenId = log.args.tokenId.toString();

        // Check if the token has been transfered to another address (sold)
        const outgoingLogs = await wagmiPublicClient.getLogs({
            address: process.env.NEXT_PUBLIC_FT_CARDS_CONTRACT_ADDRESS as `0x{string}`,
            event: parseAbiItem('event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)'),
            args: {
                from: walletAddress as `0x{string}`,
                tokenId: log.args.tokenId,
            },
            fromBlock: 'earliest',
            toBlock: 'latest',
        });

        // If the token was not transferred to another address, add it to the map
        if (outgoingLogs.length === 0) {
            tokenIdToOwnerMap.set(tokenId, walletAddress);
        }
    }

    // The remaining entries in the map are tokens currently owned by the walletAddress
    const userTokenIds = Array.from(tokenIdToOwnerMap.keys());

    return userTokenIds;
}
