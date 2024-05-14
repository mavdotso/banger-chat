import { Web3WalletResource } from '@clerk/types';
import { catchClerkError } from './utils';

export default async function verifyWallet(wallet: Web3WalletResource) {
    await wallet
        .prepareVerification({
            strategy: 'web3_metamask_signature',
        })
        .then((response) => console.log(response))
        .catch((error) => {
            catchClerkError(error);
        });

    await wallet
        .attemptVerification({
            signature: `${wallet.id}_${wallet.verification.nonce}`,
        })
        .then((response) => console.log(response))
        .catch((error) => {
            catchClerkError(error);
        });
}
