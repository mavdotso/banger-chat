'use client';

import { useUser } from '@clerk/nextjs';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { LiveKitRoom, VideoConference } from '@livekit/components-react';
import '@livekit/components-styles';
import { useMutationState } from '@/hooks/useMutationState';
import { api } from '@/convex/_generated/api';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useChat } from '@/hooks/useChat';

type CallRoomProps = {
    video: boolean;
    audio: boolean;
    handleDisconnect: () => void;
};

export const CallRoom = ({ audio, video, handleDisconnect }: CallRoomProps) => {
    const { user } = useUser();
    const [token, setToken] = useState('');

    const { chatId } = useChat();

    const { mutate: createMessage, pending } = useMutationState(api.message.create);

    useEffect(() => {
        if (!user?.username) return;

        (async () => {
            try {
                const res = await fetch(`/api/livekit?room=${chatId}&username=${user.username} (${Math.floor(Math.random() * 3000)})`);
                const data = await res.json();

                setToken(data.token);
            } catch (error) {
                toast.error('Could not join the call');
            }
        })();
    }, [user?.username, chatId]);

    if (token === '') {
        return (
            <div className="w-full h-full flex flex-col justify-center items-center">
                <Loader2 className="animate-spin h-16 w-16 text-foreground" />
                <p className="text-sm text-foreground">Joining call...</p>
                <Button className="mt-4" variant="destructive" onClick={handleDisconnect}>
                    Cancel
                </Button>
            </div>
        );
    }

    return (
        <div className="w-full h-full">
            <LiveKitRoom
                data-lk-theme="default"
                serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
                token={token}
                connect={true}
                video={video}
                audio={audio}
                onDisconnected={() => handleDisconnect()}
                onConnected={() => {
                    createMessage({
                        chatId,
                        type: 'call',
                        content: [],
                    });
                }}
            >
                <VideoConference />
            </LiveKitRoom>
        </div>
    );
};
