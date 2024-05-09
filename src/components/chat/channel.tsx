import { formatDate } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { MessageSeenSvg } from '@/lib/svgs';
import { Users } from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useChannelStore } from '@/store/channel-store';

export default function Channel({ channel }: { channel: any }) {
    console.log(channel);
    const channelImage = channel.image;
    const channelName = channel.name;
    const lastMessage = channel.lastMessage;
    // const lastMessageType = lastMessage?.messageType;
    const me = useQuery(api.users.getMe);

    const { setSelectedChannel, selectedChannel } = useChannelStore();
    const activeBgClass = selectedChannel?._id === channel._id;

    return (
        <>
            <div
                className={`flex gap-2 items-center p-3 hover:bg-chat-hover cursor-pointer
					${activeBgClass ? 'bg-gray-tertiary' : ''}
				`}
                onClick={() => setSelectedChannel(channel)}
            >
                <Avatar className="border border-gray-900 overflow-visible relative">
                    <AvatarImage src={channelImage || '/placeholder.png'} className="object-cover rounded-full" />
                    <AvatarFallback>
                        <div className="animate-pulse bg-gray-tertiary w-full h-full rounded-full"></div>
                    </AvatarFallback>
                </Avatar>
                <div className="w-full">
                    <div className="flex items-center">
                        <h3 className="text-sm font-medium">{channelName}</h3>
                        <span className="text-xs text-gray-500 ml-auto">{formatDate(lastMessage?._creationTime || channel._creationTime)}</span>
                    </div>
                    <p className="text-[12px] mt-1 text-gray-500 flex items-center gap-1 ">
                        {lastMessage?.sender === me?._id ? <MessageSeenSvg /> : ''}
                        {channel.isGroup && <Users size={16} />}
                        {!lastMessage && 'Say Hi!'}
                        {lastMessage?.content.length > 30 ? <span>{lastMessage?.content.slice(0, 30)}...</span> : <span>{lastMessage?.content}</span>}
                        {/* {lastMessageType === 'text' ? lastMessage?.content.length > 30 ? <span>{lastMessage?.content.slice(0, 30)}...</span> : <span>{lastMessage?.content}</span> : null} */}
                        {/* {lastMessageType === 'image' && <ImageIcon size={16} />}
                        {lastMessageType === 'video' && <VideoIcon size={16} />} */}
                    </p>
                </div>
            </div>
            <hr className="h-[1px] mx-10 bg-gray-primary" />
        </>
    );
}
