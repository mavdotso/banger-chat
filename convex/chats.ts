import { ConvexError } from 'convex/values';
import { MutationCtx, QueryCtx, query } from './_generated/server';
import { getUserByClerkId } from './_utils';
import { Id } from './_generated/dataModel';

export const get = query({
    args: {},
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error('Unauthorized');
        }

        const currentUser = await getUserByClerkId({
            ctx,
            clerkId: identity.subject,
        });

        if (!currentUser) {
            throw new ConvexError('User not found');
        }

        const chatMemberships = await ctx.db
            .query('chatMembers')
            .withIndex('by_memberId', (q) => q.eq('memberId', currentUser._id))
            .collect();

        const chats = await Promise.all(
            chatMemberships?.map(async (chatMembership) => {
                const chat = await ctx.db.get(chatMembership.chatId);

                if (!chat) {
                    throw new ConvexError('Chat could not be found');
                }

                return chat;
            })
        );

        const chatWithDetails = await Promise.all(
            chats.map(async (chat, index) => {
                return {
                    chat,
                };
            })
        );

        return chatWithDetails;
    },
});

const getLastMessageDetails = async ({ ctx, id }: { ctx: QueryCtx | MutationCtx; id: Id<'messages'> | undefined }) => {
    if (!id) return null;

    const message = await ctx.db.get(id);

    if (!message) return null;

    const sender = await ctx.db.get(message.senderId);

    if (!sender) return null;

    const content = getMessageContent(message.type, message.content as unknown as string);

    return {
        content,
        sender: sender.username,
    };
};

const getMessageContent = (type: string, content: string) => {
    switch (type) {
        case 'text':
            return content;
        case 'image':
            return '[Image]';
        case 'file':
            return '[File]';
        case 'call':
            return '[Call]';
        default:
            return content;
    }
};
