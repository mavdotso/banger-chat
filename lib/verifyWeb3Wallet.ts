import { Web3WalletResource, PrepareWeb3WalletVerificationParams, AttemptWeb3WalletVerificationParams } from '@clerk/types';
import { verifyMessage, signMessage } from '@wagmi/core';
import { wagmiConfig } from './wagmi';

async function verifyWallet(web3WalletResource: Web3WalletResource) {
    try {
        // Step 1: Prepare the verification
        const prepareParams: PrepareWeb3WalletVerificationParams = { strategy: 'web3_metamask_signature' };
        const preparedResource = await web3WalletResource.prepareVerification(prepareParams);
        const nonce = preparedResource.verification.nonce;

        if (!nonce) {
            throw new Error('Nonce is null or undefined');
        }

        // Step 2: Sign the nonce
        const signature = await signMessage(wagmiConfig, {
            message: nonce,
        });

        // Ensure the address is in the correct format
        const address = preparedResource.web3Wallet.toLowerCase();
        if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
            throw new Error('Invalid Ethereum address format');
        }

        // Step 3: Verify the signed message
        const isValid = await verifyMessage(wagmiConfig, {
            //@ts-ignore
            address,
            message: nonce,
            signature,
        });

        if (!isValid) {
            throw new Error('Signature verification failed');
        }

        // Step 4: Attempt the verification
        const attemptParams: AttemptWeb3WalletVerificationParams = { signature };
        const verifiedResource = await web3WalletResource.attemptVerification(attemptParams);

        console.log('Verification successful:', verifiedResource);
    } catch (error) {
        console.error('Verification failed:', error);
    }
}

export default verifyWallet;
