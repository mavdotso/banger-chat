import { ConvexError, v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const createChannel = mutation({
    args: {
        name: v.string(),
        description: v.optional(v.string()),
        accessNFT: v.optional(v.string()),
        users: v.array(v.id('users')),
        image: v.optional(v.string()),
        admin: v.optional(v.id('users')),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) throw new ConvexError('Unauthorized');

        // Check if admin
        // const isAdmin = await ctx.db.query('users').filter((q) => q.eq('tokenIdentifier', identity.tokenIdentifier));

        const existingConversation = await ctx.db
            .query('channels')
            .filter((q) => q.or(q.eq(q.field('users'), args.users), q.eq(q.field('users'), args.users.reverse())))
            .first();

        if (existingConversation) {
            return existingConversation._id;
        }

        let channelImage;

        if (args.image) {
            channelImage = (await ctx.storage.getUrl(args.image)) as string;
        }

        const channelId = await ctx.db.insert('channels', {
            users: args.users,
            accessNFT: args.accessNFT,
            name: args.name,
            image: channelImage,
            admin: args.admin,
        });

        return channelId;
    },
});

export const getMyChannels = query({
    args: {},
    handler: async (ctx, args) => {
        console.log('Server identity', await ctx.auth.getUserIdentity());

        const identity = await ctx.auth.getUserIdentity();

        if (!identity) throw new ConvexError('Unauthorized');

        const user = await ctx.db
            .query('users')
            .withIndex('by_tokenIdentifier', (q) => q.eq('tokenIdentifier', identity.tokenIdentifier))
            .unique();

        if (!user) throw new ConvexError('User not found');

        const channels = await ctx.db.query('channels').collect();

        const myConversations = channels.filter((channel) => {
            return channel.users.includes(user._id);
        });

        const conversationsWithDetails = await Promise.all(
            myConversations.map(async (channel) => {
                let userDetails = {};

                const otherUserId = channel.users.find((id) => id !== user._id);
                const userProfile = await ctx.db
                    .query('users')
                    .filter((q) => q.eq(q.field('_id'), otherUserId))
                    .take(1);

                userDetails = userProfile[0];

                const lastMessage = await ctx.db
                    .query('messages')
                    .filter((q) => q.eq(q.field('channelId'), channel._id))
                    .order('desc')
                    .take(1);

                // return should be in this order, otherwise _id field will be overwritten
                return {
                    ...userDetails,
                    ...channel,
                    lastMessage: lastMessage[0] || null,
                };
            })
        );

        return conversationsWithDetails;
    },
});

export const kickUser = mutation({
    args: {
        channelId: v.id('channels'),
        userId: v.id('users'),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) throw new ConvexError('Unauthorized');

        const channel = await ctx.db
            .query('channels')
            .filter((q) => q.eq(q.field('_id'), args.channelId))
            .unique();

        if (!channel) throw new ConvexError('Channel not found');

        await ctx.db.patch(args.channelId, {
            users: channel.users.filter((id) => id !== args.userId),
        });
    },
});

export const generateUploadUrl = mutation(async (ctx) => {
    return await ctx.storage.generateUploadUrl();
});
