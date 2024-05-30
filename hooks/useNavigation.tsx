import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { MessageSquare, User, Users } from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

export function useNavigation() {
    const pathname = usePathname();

    const chats = useQuery(api.chats.get);

    // TODO: debug
    const unseenMessagesCount = useMemo(() => {
        return chats?.reduce((acc, curr) => {
            return acc + curr.unseenCount;
        }, 0);
    }, [chats]);

    const paths = useMemo(
        () => [
            {
                name: 'Chats',
                href: '/chats',
                icon: <MessageSquare />,
                active: pathname.startsWith('/chats'),
            },
            {
                name: 'Account',
                href: '/account',
                icon: <User />,
            },
        ],
        [pathname]
    );

    return paths;
}
