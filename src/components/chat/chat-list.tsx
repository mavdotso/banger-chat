'use client';
import { useConvexAuth, useQuery } from 'convex/react';
import Channel from './channel';
import { useChannelStore } from '@/store/channel-store';
import { useEffect } from 'react';
import { api } from '../../../convex/_generated/api';

export default function ChatList() {
    const { isAuthenticated, isLoading } = useConvexAuth();
    const channels = useQuery(api.channels.getMyChannels);

    const { selectedChannel, setSelectedChannel } = useChannelStore();

    useEffect(() => {
        const channelIds = channels?.map((channel) => channel._id);
        if (selectedChannel && channelIds && !channelIds.includes(selectedChannel._id)) {
            setSelectedChannel(null);
        }
        console.log(channels);
    }, [channels, selectedChannel, setSelectedChannel]);

    return (
        <div className="relative hidden flex-col items-start gap-8 md:flex">
            <div className="grid w-full items-start gap-6">
                <div className="grid gap-6 rounded-lg border p-4">{!isLoading && channels?.map((channel) => <Channel key={channel._id} channel={channel} />)}</div>
            </div>
        </div>
    );
}
