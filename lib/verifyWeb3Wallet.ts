import { Web3WalletResource, PrepareWeb3WalletVerificationParams, AttemptWeb3WalletVerificationParams } from '@clerk/types';
import { verifyMessage, signMessage } from '@wagmi/core';
import { wagmiConfig } from './wagmi';

export default async function verifyWallet(web3WalletResource: Web3WalletResource) {
    try {
        const prepareParams: PrepareWeb3WalletVerificationParams = { strategy: 'web3_metamask_signature' };
        const preparedResource = await web3WalletResource.prepareVerification(prepareParams);
        const nonce = preparedResource.verification.nonce;

        if (!nonce) {
            throw new Error('Nonce is null or undefined');
        }

        const signature = await signMessage(wagmiConfig, {
            message: nonce,
        });

        // Ensure the address is in the correct format
        const address = preparedResource.web3Wallet.toLowerCase();
        if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
            throw new Error('Invalid Ethereum address format');
        }

        const isValid = await verifyMessage(wagmiConfig, {
            address: address as `0x{string}`,
            message: nonce,
            signature,
        });

        if (!isValid) {
            throw new Error('Signature verification failed');
        }

        const attemptParams: AttemptWeb3WalletVerificationParams = { signature };
        const verifiedResource = await web3WalletResource.attemptVerification(attemptParams);

        console.log('Verification successful:', verifiedResource);
    } catch (error) {
        console.error('Verification failed:', error);
    }
}
