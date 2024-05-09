import { Id } from '../../convex/_generated/dataModel';
import { create } from 'zustand';

export type Channel = {
    _id: Id<'channels'>;
    image?: string;
    users: Id<'users'>[];
    name?: string;
    admin?: Id<'users'>;
    lastMessage?: {
        _id: Id<'messages'>;
        channel: Id<'channels'>;
        content: string;
        sender: Id<'users'>;
    };
};

type ChannelStore = {
    selectedChannel: Channel | null;
    setSelectedChannel: (channel: Channel | null) => void;
};

export const useChannelStore = create<ChannelStore>((set) => ({
    selectedChannel: null,
    setSelectedChannel: (channel) => set({ selectedChannel: channel }),
}));

export interface IMessage {
    _id: string;
    content: string;
    _creationTime: number;
    // messageType: 'text' | 'image' | 'video';
    sender: {
        _id: Id<'users'>;
        image: string;
        name?: string;
        tokenIdentifier: string;
        email: string;
        _creationTime: number;
    };
}
