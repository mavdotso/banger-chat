import { ConvexError, v } from 'convex/values';
import { mutation } from './_generated/server';

export const sendTextMessage = mutation({
    args: {
        sender: v.string(),
        content: v.string(),
        channelId: v.id('channels'),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (identity === null) {
            throw new Error('Unauthenticated call to mutation');
        }

        const channel = await ctx.db
            .query('channels')
            .filter((q) => q.eq(q.field('_id'), args.channelId))
            .first();

        if (!channel) {
            throw new ConvexError('Channel not found');
        }

        // if (!channel.users.includes(identity)) {
        //     throw new ConvexError('User is not in the channel');
        // }

        // await ctx.db.insert('messages', {
        //     sender: identity._id,
        //     content: args.content,
        //     channelId: args.channelId,
        //     timestamp: new Date().getTime(),
        // });
    },
});
