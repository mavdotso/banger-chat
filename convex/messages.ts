import { ConvexError, v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const sendTextMessage = mutation({
    args: {
        sender: v.string(),
        content: v.string(),
        channelId: v.id('channels'),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error('Unauthenticated call to mutation');
        }

        const user = await ctx.db
            .query('users')
            .withIndex('by_tokenIdentifier', (q) => q.eq('tokenIdentifier', identity.tokenIdentifier))
            .unique();

        if (!user) {
            throw new ConvexError('User not found');
        }

        const channel = await ctx.db
            .query('channels')
            .filter((q) => q.eq(q.field('_id'), args.channelId))
            .first();

        if (!channel) {
            throw new ConvexError('Channel not found');
        }

        if (!channel.users.includes(user._id)) {
            throw new ConvexError('User is not in the channel');
        }

        await ctx.db.insert('messages', {
            sender: user._id,
            content: args.content,
            channelId: args.channelId,
            timestamp: new Date().getTime(),
        });
    },
});

export const getMessages = query({
    args: {
        channelId: v.id('channels'),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error('Unauthorised');
        }

        const messages = await ctx.db
            .query('messages')
            .withIndex('by_channelId', (q) => q.eq('channelId', args.channelId))
            .collect();

        const userProfileCache = new Map();

        const messagesWithSender = await Promise.all(
            messages.map(async (message) => {
                let sender;
                // Check if sender profile is in cache
                if (userProfileCache.has(message.sender)) {
                    sender = userProfileCache.get(message.sender);
                } else {
                    // Fetch sender profile from the database
                    sender = await ctx.db
                        .query('users')
                        .filter((q) => q.eq(q.field('_id'), message.sender))
                        .first();
                    // Cache the sender profile
                    userProfileCache.set(message.sender, sender);
                }

                return { ...message, sender };
            })
        );

        return messagesWithSender;
    },
});
