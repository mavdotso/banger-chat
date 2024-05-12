'use client';

import { Card } from '@/components/ui/card';
import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';
import { useParams, usePathname } from 'next/navigation';
import { useRouter } from 'next/router';

export default function ProfilePage() {
    const params = useParams();
    const path = usePathname();
    const router = useRouter();

    // if (path.length < 20 && !path.startsWith('/@')) {
    //     const newPath = '/@' + path.replace(/^\//, '');
    //     router.push(newPath);
    //     return null;
    // }

    const profile = params.profile as string;
    const username = decodeURIComponent(profile).substring(1);
    const user = useQuery(api.user.getUser, { username });

    return (
        <Card className="hidden lg:flex h-full w-full p-2 items-center justify-center bg-secondary text-secondary-foreground">
            <div>{user?.username}</div>
            <div>{user?.email}</div>
        </Card>
    );
}
