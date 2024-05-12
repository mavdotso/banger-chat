'use client';

import ChatsFallback from '@/components/shared/chat/chats-fallback';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Error({ error }: { error: Error }) {
    const router = useRouter();

    useEffect(() => {
        router.push('/chats');
    }, [error, router]);

    return <ChatsFallback />;
}
