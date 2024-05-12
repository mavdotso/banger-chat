'use client';

import ItemList from '@/components/shared/item-list/ItemList';
import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';
import { Loader2 } from 'lucide-react';
import CreateGroupDialog from './_components/CreateGroupDialog';
import ChatItem from './_components/chat-item';

type Props = React.PropsWithChildren<{}>;

export default function ChatsLayout({ children }: Props) {
    const chats = useQuery(api.chats.get);

    return (
        <>
            <ItemList title="Chats" action={<CreateGroupDialog />}>
                {chats ? (
                    chats.length === 0 ? (
                        <p className="w-full h-full flex items-center justify-center">No conversations found</p>
                    ) : (
                        chats.map((chat) => {
                            return (
                                <ChatItem
                                    key={chat.chat._id}
                                    id={chat.chat._id}
                                    name={chat.chat.name || ''}
                                    lastMessageSender={chat.lastMessage?.sender}
                                    lastMessageContent={chat.lastMessage?.content}
                                />
                            );
                        })
                    )
                ) : (
                    <Loader2 className="h-8 w-8" />
                )}
            </ItemList>
            {children}
        </>
    );
}
