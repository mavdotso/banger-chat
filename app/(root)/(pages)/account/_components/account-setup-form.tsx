'use client';

import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Globe, Loader, Lock, Plus, User2 } from 'lucide-react';
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

type User = {
    email: string;
    username: string;
    walletAddress: string;
};

type UserSetupProps = Pick<User, 'email' | 'username' | 'walletAddress'>;

export default function AccountSetupForm({ username }: { username: string }) {
    const { user } = useUser();
    const router = useRouter();

    const [userAccountData, setUserAccountData] = useState<UserSetupProps>({
        username: username,
        email: '',
        walletAddress: '',
    });

    const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setUserAccountData({
            ...userAccountData,
            [name]: value,
        });
    };

    // this function we're changing to Convex function
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

    function handleAccountSetup() {
        // accountSetup({
        //     email: userAccountData.email,
        // });
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
                                <div className="flex justify-between items-center">
                                    <div className="w-full">
                                        <Label htmlFor="username">Name</Label>
                                        <div className=" flex items-center gap-2  w-full my-1 h-7">
                                            <Lock className="h-4 w-4 text-[#4D4D4D]" />
                                            <div className="flex-grow overflow-hidden outline-none text-[15px] text-accent-foreground break-words tracking-wide w-full select-none">
                                                {`${getFullName(user?.firstName ?? '', user?.lastName ?? '')} ${'(' + userAccountData?.username + ')'}`}
                                            </div>
                                        </div>
                                    </div>
                                    <Avatar className="rounded-full outline outline-1 outline-border h-12 w-12 ">
                                        <AvatarImage src={user?.imageUrl} alt={user?.username ?? ''} className="object-cover" />
                                        <AvatarFallback>
                                            <User2 className="h-5 w-5" />
                                        </AvatarFallback>
                                    </Avatar>
                                </div>
                                <Label htmlFor="email">Email</Label>
                                <div className="flex gap-2 ">
                                    <Input
                                        name="email"
                                        className="select-none max-h-[100px]"
                                        maxLength={100}
                                        value={userAccountData.email!}
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
                                        maxLength={100}
                                        value={userAccountData.walletAddress!}
                                        onChange={handleFieldChange}
                                        placeholder="Your web3 wallet address"
                                    />
                                    <Button className="rounded-xl bg-foreground hover:bg-foreground select-none text-white dark:text-black" onClick={handleAccountSetup}>
                                        Connect wallet
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
