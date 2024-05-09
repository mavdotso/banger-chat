import { IMessage, useChannelStore } from '@/store/channel-store';
import { useMutation } from 'convex/react';
import { Ban, LogOut } from 'lucide-react';
import { api } from '../../../convex/_generated/api';
import React from 'react';

type ChatAvatarActionsProps = {
    message: IMessage;
    me: any;
};

export function ChatAvatarActions({ me, message }: ChatAvatarActionsProps) {
    const { selectedChannel, setSelectedChannel } = useChannelStore();

    const isMember = selectedChannel?.users.includes(message.sender._id);
    const kickUser = useMutation(api.channels.kickUser);
    const createChannel = useMutation(api.channels.createChannel);

    async function handleKickUser(e: React.MouseEvent) {
        e.stopPropagation();
        if (!selectedChannel) return;
        try {
            await kickUser({
                channelId: selectedChannel._id,
                userId: message.sender._id,
            });

            setSelectedChannel({
                ...selectedChannel,
                users: selectedChannel.users.filter((id) => id !== message.sender._id),
            });
        } catch (error) {
            console.log(error);
        }
    }

    async function handleCreateConversation() {
        try {
            const channelId = await createChannel({
                name: 'TEst',
                users: [me._id, message.sender._id],
            });

            setSelectedChannel({
                _id: channelId,
                name: message.sender.name,
                users: [me._id, message.sender._id],
                image: message.sender.image,
            });
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="text-[11px] flex gap-4 justify-between font-bold cursor-pointer group" onClick={handleCreateConversation}>
            {message.sender.name}
            {!isMember && <Ban size={16} className="text-red-500" />}
            {isMember && selectedChannel?.admin === me._id && <LogOut size={16} className="text-red-500 opacity-0 group-hover:opacity-100" onClick={handleKickUser} />}
        </div>
    );
}
