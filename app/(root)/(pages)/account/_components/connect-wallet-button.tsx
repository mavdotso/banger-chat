'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, UserSetupProps } from './account-setup-form';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useAccount } from 'wagmi';
import { Label } from '@/components/ui/label';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Wallet } from 'lucide-react';
import type { UserResource } from '@clerk/types';

type ConnectWalletButtonProps = {
    user: UserResource;
    userAccountData: User;
    setUserAccountData: Dispatch<SetStateAction<UserSetupProps>>;
    handleFieldChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleVerifyWallet: () => void;
};

export default function ConnectWalletButton({ user, userAccountData, setUserAccountData, handleFieldChange, handleVerifyWallet }: ConnectWalletButtonProps) {
    const { open } = useWeb3Modal();
    const { address, isConnecting, isDisconnected } = useAccount();
    const [isVerified, setIsVerified] = useState(false);

    useEffect(() => {
        if (address) {
            setUserAccountData({ ...userAccountData, web3Wallet: address });
        }
    }, [address]);

    useEffect(() => {
        if (address) {
            const currentAddress = user.web3Wallets.find((wallet) => wallet.web3Wallet.toLowerCase() === address.toLowerCase());
            if (currentAddress?.verification.status === 'verified') {
                setIsVerified(true);
            } else {
                setIsVerified(false);
            }
        }
    }, [user.web3Wallets, address]);

    return (
        <>
            <Label htmlFor="web3Wallet">Web3 Wallet address</Label>
            <div className="flex gap-2 ">
                {address ? (
                    <>
                        <Input name="web3Wallet" className="select-none max-h-[100px]" value={userAccountData.web3Wallet} onChange={handleFieldChange} placeholder="Your web3 wallet address" />
                        {!isVerified && <Button onClick={handleVerifyWallet}>Verify</Button>}
                        <Button onClick={() => open()}>
                            <Wallet />
                        </Button>
                    </>
                ) : (
                    <Button className="w-full" onClick={() => open()}>
                        Connect wallet
                        <span className="sr-only">Connect wallet</span>
                    </Button>
                )}
            </div>
        </>
    );
}
