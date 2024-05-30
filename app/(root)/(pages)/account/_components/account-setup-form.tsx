'use client';

import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User2, Wallet } from 'lucide-react';
import React, { Suspense, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useUser } from '@clerk/nextjs';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { catchClerkError } from '@/lib/utils';
import verifyWallet from '@/lib/verifyWeb3Wallet';
import { useMutationState } from '@/hooks/useMutationState';
import { api } from '@/convex/_generated/api';
import ConnectWalletButton from './connect-wallet-button';
import Web3ModalProvider from '@/providers/walletconnect-provider';
import { Icons } from '@/components/icons';
import { Badge } from '@/components/ui/badge';

export type User = {
    username: string;
    imageUrl: string;
    email: string;
    web3Wallet: string;
    clerkId: string;
};

export type UserSetupProps = Pick<User, 'username' | 'imageUrl' | 'email' | 'web3Wallet' | 'clerkId'>;

export default function AccountSetupForm() {
    const { user } = useUser();
    const router = useRouter();
    const { mutate: updateUser } = useMutationState(api.user.updateUser);

    const [userAccountData, setUserAccountData] = useState<UserSetupProps>({
        username: user?.username || '',
        imageUrl: user?.imageUrl || '',
        email: user?.primaryEmailAddress?.emailAddress || '',
        web3Wallet: user?.primaryWeb3Wallet?.web3Wallet || '',
        clerkId: user?.id || '',
    });

    const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserAccountData({
            ...userAccountData,
            [name]: value,
        });
    };

    async function handleVerifyWallet() {
        if (!user) return;

        let walletResource = user.web3Wallets.find((wallet) => wallet.web3Wallet.toLowerCase() === userAccountData.web3Wallet.toLowerCase());

        if (!walletResource) {
            console.log("Didn't find the wallet to verify. Creating a new wallet...");
            try {
                walletResource = await user.createWeb3Wallet({ web3Wallet: userAccountData.web3Wallet });
                console.log('New wallet created:', walletResource);
            } catch (error) {
                catchClerkError(error);
                console.log('Failed to create a new wallet');
                toast.error('Failed to create a new wallet, please try again');
                return;
            }
        }

        if (!walletResource) {
            console.log('Wallet resource is still undefined after creation attempt');
            toast.error('Wallet resource is undefined, please try again');
            return;
        }

        await verifyWallet(walletResource);

        switch (walletResource.verification.status) {
            case 'unverified':
                console.log('Wallet is unverified');
                toast.error('Wallet is unverified, please try again');
                break;
            case 'verified':
                console.log('Successfully verified the wallet');
                toast.success('Successfully verified the wallet');
                break;
            case 'transferable':
                console.log('The wallet is transferable?');
                toast('The wallet is transferable?');
                break;
            case 'failed':
                console.log('Verification failed, try again');
                toast.error('Wallet is unverified, please try again');
                break;
            case 'expired':
            default:
                console.log('Verification expired, please try again');
                toast.error('Wallet is unverified, please try again');
                break;
        }
    }

    const FormSchema = z.object({
        url: z
            .string()
            .url()
            .refine((url) => {
                try {
                    const parsedUrl = new URL(url);
                    return parsedUrl.protocol === 'https:';
                } catch {
                    return false;
                }
            }, 'Must be a valid HTTPS url')
            .or(z.literal('')),
    });

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            url: '',
        },
    });

    // Updating the user if some data is different
    async function accountSetup() {
        try {
            await updateUser(userAccountData);
        } catch (error) {
            console.log(error);
            toast.error('Error');
        } finally {
            router.push(origin ? `${origin}` : '/');
            toast.success(`Changes saved`);
        }
    }

    async function handleAccountSetup() {
        await accountSetup();
    }

    function handleSecurity(data: z.infer<typeof FormSchema>) {
        setUserAccountData({
            ...userAccountData,
        });
    }

    return (
        <div className="mx-auto flex flex-col gap-6 justify-center w-full max-w-lg items-center h-[95vh] px-6">
            <Form {...form}>
                <form className="w-full flex flex-col py-4 gap-1.5 text-start" onSubmit={(...args) => void form.handleSubmit(handleSecurity)(...args)}>
                    <div className="flex flex-col gap-1 justify-center items-center w-full">
                        <h2 className="scroll-m-20 tracking-wide text-4xl font-bold">Profile</h2>
                        <span className="leading-7 text-muted-foreground ">Customize your profile</span>
                        <Card className="w-full p-6 px-8 bg-transparent rounded-2xl my-4 sm:mt-10">
                            <div className="flex flex-col gap-4">
                                <div className="flex justify-between items-center gap-4">
                                    <Avatar className="rounded-full outline outline-1 outline-border h-12 w-12 ">
                                        <AvatarImage src={user?.imageUrl} alt={user?.username ?? ''} className="object-cover" />
                                        <AvatarFallback>
                                            <User2 className="h-5 w-5" />
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="w-full">
                                        <Label htmlFor="username">Username</Label>
                                        <div className="flex">
                                            <Input
                                                name="username"
                                                className="select-none max-h-[100px]"
                                                maxLength={200}
                                                value={userAccountData.username}
                                                onChange={handleFieldChange}
                                                placeholder="Your username"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <Label className="flex gap-2 items-center" htmlFor="email">
                                    Email <Badge>Optional</Badge>
                                </Label>
                                <div className="flex">
                                    <Input
                                        name="email"
                                        className="select-none max-h-[100px]"
                                        maxLength={200}
                                        value={userAccountData.email}
                                        onChange={handleFieldChange}
                                        placeholder="Your email address"
                                    />
                                </div>
                                <Suspense fallback={<p>Loading...</p>}>
                                    {user && (
                                        <Web3ModalProvider>
                                            <ConnectWalletButton
                                                user={user}
                                                userAccountData={userAccountData}
                                                setUserAccountData={setUserAccountData}
                                                handleFieldChange={handleFieldChange}
                                                handleVerifyWallet={handleVerifyWallet}
                                            />
                                        </Web3ModalProvider>
                                    )}
                                </Suspense>
                            </div>
                        </Card>
                        <Button onClick={handleAccountSetup}>
                            Save changes
                            <span className="sr-only">Save changes</span>
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
