'use client';

import React from 'react';
import { CheckCircle, Circle, Instagram } from 'lucide-react';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/nextjs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function UserProfile(props: any) {
    const { id, fullname, image, link, username, followers, isHero } = props;
    const path = usePathname();
    const { user } = useUser();

    const params = useParams();
    const profile = params.profile as string;
    const usernamePath = decodeURIComponent(profile).substring(1);
    const basePath = `@${usernamePath}`;

    const segments = path.split('/');
    const lastSegment = segments[segments.length - 1];

    return (
        <div className=" z-[10] mt-4 flex w-full flex-col space-y-4">
            <div className="flex w-fullitems-center">
                <div className="flex w-full flex-col p-3 pl-0 gap-1">
                    <h1 className="text-2xl font-bold tracking-normal">{fullname}</h1>
                    <div className="flex gap-1">
                        <h4 className="text-[15px]">{username}</h4>
                        <span className="ml-0.5 rounded-2xl bg-primary text-[#777777] text-xm px-1.5 py-1 text-[11px] font-medium">banger.chat</span>
                    </div>
                </div>
                <Avatar className="h-[80px] w-[80px] overflow-visible outline outline-2 outline-border relative">
                    <AvatarImage src={image ?? ''} alt={fullname ?? ''} className="h-min w-full rounded-full object-cover " />
                    <AvatarFallback></AvatarFallback>
                    {isHero && (
                        <div className="absolute bottom-0 -left-0.5">
                            <CheckCircle className="h-6 w-6 text-background" />
                        </div>
                    )}
                </Avatar>
            </div>

            <div className="flex justify-between items-center">
                <div className="flex gap-4">
                    <Instagram className="h-6 w-6" />
                    {user?.id != id && <Circle className="h-6 w-6" />}
                </div>
            </div>
            {user?.id != id && (
                <div className="grid gap-2 sm:grid-cols-2 pt-2">
                    <Button size={'sm'} variant="outline" className="w-full border-[#333333] sm:w-auto rounded-xl cursor-not-allowed py-1 font-semibold tracking-normal text-[16px] active:scale-95 ">
                        Mention
                    </Button>
                </div>
            )}
        </div>
    );
}
