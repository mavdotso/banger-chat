'use client';

import ConversationFallback from '@/components/shared/conversation/ConversationFallback';
import ItemList from '@/components/shared/item-list/ItemList';
import AddFriendDialog from './_components/AddFriendDialog';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Loader2 } from 'lucide-react';
import Request from './_components/Request';

const FriendsPage = () => {
    const friendRequests = useQuery(api.friendRequests.get);

    return (
        <>
            <ItemList title="Friends" action={<AddFriendDialog />}>
                {friendRequests ? (
                    friendRequests.length === 0 ? (
                        <p className="w-full h-full flex items-center justify-center">No friend requests found</p>
                    ) : (
                        friendRequests.map((friendRequest) => {
                            return (
                                <Request
                                    key={friendRequest.friendRequest._id}
                                    id={friendRequest.friendRequest._id}
                                    imageUrl={friendRequest.sender.imageUrl}
                                    username={friendRequest.sender.username}
                                    email={friendRequest.sender.email}
                                />
                            );
                        })
                    )
                ) : (
                    <Loader2 className="h-8 w-8" />
                )}
            </ItemList>
            <ConversationFallback />
        </>
    );
};

export default FriendsPage;
