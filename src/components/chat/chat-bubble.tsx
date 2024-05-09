'use client';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { IMessage, useChannelStore } from '@/store/channel-store';
import DateIndicator from './date-indicator';
import ChatBubbleAvatar from './chat-bubble-avatar';
import { ChatAvatarActions } from './chat-avatar-actions';
import { MessageSeenSvg } from '@/lib/svgs';

type ChatBubbleProps = {
    message: IMessage;
    me: any;
    previousMessage?: IMessage;
};

export default function ChatBubble({ me, message, previousMessage }: ChatBubbleProps) {
    const date = new Date(message._creationTime);
    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');
    const time = `${hour}:${minute}`;

    const { selectedChannel } = useChannelStore();

    const isMember = selectedChannel?.users.includes(message.sender?._id) || false;
    const fromMe = message.sender?._id === me._id;
    const bgClass = fromMe ? 'bg-green-chat' : 'bg-white dark:bg-gray-primary';

    console.log(message.sender);

    const [open, setOpen] = useState(false);

    function renderMessageContent() {
        // switch (message.messageType) {
        //     case 'text':
        return <TextMessage message={message} />;
        // case 'image':
        //     return <ImageMessage message={message} handleClick={() => setOpen(true)} />;
        // case 'video':
        //     return <VideoMessage message={message} />;
        //     default:
        //         return null;
        // }
    }

    if (!fromMe) {
        return (
            <>
                <DateIndicator message={message} previousMessage={previousMessage} />
                <div className="flex gap-1 w-2/3">
                    <ChatBubbleAvatar isMember={isMember} message={message} />
                    <div className={`flex flex-col z-20 max-w-fit px-2 pt-1 rounded-md shadow-md relative ${bgClass}`}>
                        {/* {<ChatAvatarActions message={message} me={me} />} */}
                        {renderMessageContent()}
                        {/* {open && <ImageDialog src={message.content} open={open} onClose={() => setOpen(false)} />} */}
                        <MessageTime time={time} fromMe={fromMe} />
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <DateIndicator message={message} previousMessage={previousMessage} />

            <div className="flex gap-1 w-2/3 ml-auto">
                <div className={`flex  z-20 max-w-fit px-2 pt-1 rounded-md shadow-md ml-auto relative ${bgClass}`}>
                    <SelfMessageIndicator />
                    {renderMessageContent()}
                    {/* {open && <ImageDialog src={message.content} open={open} onClose={() => setOpen(false)} />} */}
                    <MessageTime time={time} fromMe={fromMe} />
                </div>
            </div>
        </>
    );
}

function TextMessage({ message }: { message: IMessage }) {
    const isLink = /^(ftp|http|https):\/\/[^ "]+$/.test(message.content); // Check if the content is a URL

    return (
        <div>
            {isLink ? (
                <a href={message.content} target="_blank" rel="noopener noreferrer" className={`mr-2 text-sm font-light text-blue-400 underline`}>
                    {message.content}
                </a>
            ) : (
                <p className={`mr-2 text-sm font-light`}>{message.content}</p>
            )}
        </div>
    );
}

function MessageTime({ time, fromMe }: { time: string; fromMe: boolean }) {
    return (
        <p className="text-[10px] mt-2 self-end flex gap-1 items-center">
            {time} {fromMe && <MessageSeenSvg />}
        </p>
    );
}

function OtherMessageIndicator() {
    return <div className="absolute bg-white dark:bg-gray-primary top-0 -left-[4px] w-3 h-3 rounded-bl-full" />;
}

function SelfMessageIndicator() {
    return <div className="absolute bg-green-chat top-0 -right-[3px] w-3 h-3 rounded-br-full overflow-hidden" />;
}
