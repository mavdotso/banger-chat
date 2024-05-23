'use client';

import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Globe, Loader, Lock, Plus, User2, Wallet } from 'lucide-react';
import React, { useState } from 'react';
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

type User = {
    username: string;
    imageUrl: string;
    email: string;
    web3Wallet: string;
    clerkId: string;
};

type UserSetupProps = Pick<User, 'username' | 'imageUrl' | 'email' | 'web3Wallet' | 'clerkId'>;

export default function AccountSetupForm({ username }: { username: string }) {
    const { user } = useUser();
    const router = useRouter();
    const { mutate: updateUser } = useMutationState(api.user.updateUser);

    console.log(user);

    const [userAccountData, setUserAccountData] = useState<UserSetupProps>({
        username: user?.username ? username : '',
        imageUrl: user?.imageUrl || '',
        email: user?.emailAddresses[0].emailAddress || '',
        web3Wallet: user?.web3Wallets[0] ? user?.web3Wallets[0].web3Wallet || '' : '',
        clerkId: user?.id || '',
    });

    const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserAccountData({
            ...userAccountData,
            [name]: value,
        });
    };

    async function handleConnectWallet() {
        if (!user) return;

        let wallet = user.web3Wallets.find((wallet) => wallet.web3Wallet === userAccountData.web3Wallet);

        if (!wallet) {
            // Create a new wallet if there's no wallet associated with this user's account
            await user
                .createWeb3Wallet({ web3Wallet: userAccountData.web3Wallet })
                .then((response) => console.log(response))
                .catch((error) => {
                    catchClerkError(error);
                });

            wallet = user.web3Wallets.find((wallet) => wallet.web3Wallet === userAccountData.web3Wallet);
        }

        await verifyWallet(wallet!);

        switch (wallet!.verification.status) {
            case 'unverified':
                console.log('Wallet is unverified');
                toast.error('Wallet is unverified, please try again');
                break;
            case 'verified':
                console.log('Sucessfully verified the wallet');
                toast.success('Sucessfully verified the wallet');
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

    // TODO: changing to Convex function
    // const { mutate: accountSetup, isLoading } = api.auth.accountSetup.useMutation({
    //     onSuccess: ({ success, username }) => {
    //         if (success) {
    //             router.push(origin ? `${origin}` : '/');
    //         }
    //         toast.success(`Welcome to banger.chat ${username} !`);
    //     },
    //     onError: (err: any) => {
    //         toast.error('AuthCallBack: Something went wrong!');
    //         if (err.data?.code === 'UNAUTHORIZED') {
    //             router.push('/login');
    //         }
    //     },
    //     retry: false,
    // });

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
            toast.success(`Welcome to banger.chat ${username} !`);
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

    function getFullName(firstName: string, lastName: string) {
        if (!lastName || lastName === undefined || lastName === null || lastName === '') {
            return firstName;
        }

        return `${firstName} ${lastName}`;
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
                                <Label htmlFor="email">Email</Label>
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
                                {/* TODO: Add verification */}
                                <Label htmlFor="web3Wallet">Web3 Wallet address</Label>
                                <div className="flex gap-2 ">
                                    <Input
                                        name="web3Wallet"
                                        className="select-none max-h-[100px]"
                                        value={userAccountData.web3Wallet}
                                        onChange={handleFieldChange}
                                        placeholder="Your web3 wallet address"
                                    />
                                    <Button className="rounded-xl bg-foreground hover:bg-foreground select-none text-white dark:text-black" onClick={handleConnectWallet}>
                                        <Wallet />
                                        <span className="sr-only">Connect wallet</span>
                                    </Button>
                                </div>
                            </div>
                        </Card>
                        <Button className="w-full mt-4 rounded-xl bg-foreground hover:bg-foreground select-none text-white dark:text-black" onClick={handleAccountSetup}>
                            {/* {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />} */}
                            Create my profile
                            <span className="sr-only">Create my profile</span>
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
