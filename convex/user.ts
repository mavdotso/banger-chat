import { internalMutation, internalQuery, mutation, query } from './_generated/server';
import { v } from 'convex/values';

export const create = internalMutation({
    args: {
        username: v.string(),
        imageUrl: v.string(),
        clerkId: v.string(),
        email: v.string(),
        role: v.string(),
        web3Wallet: v.string(),
    },
    handler: async (ctx, args) => {
        await ctx.db.insert('users', args);
    },
});

export const updateUser = mutation({
    args: {
        username: v.string(),
        imageUrl: v.string(),
        clerkId: v.string(),
        email: v.string(),
        role: v.string(),
        web3Wallet: v.string(),
    },
    handler: async (ctx, args) => {
        // Call the internal mutation
        await create(ctx, args);
    },
});

export const get = internalQuery({
    args: { clerkId: v.string() },
    async handler(ctx, args) {
        return ctx.db
            .query('users')
            .withIndex('by_clerkId', (q) => q.eq('clerkId', args.clerkId))
            .first();
    },
});

export const getUser = query({
    args: { username: v.string() },
    async handler(ctx, args) {
        return ctx.db
            .query('users')
            .withIndex('by_username', (q) => q.eq('username', args.username))
            .first();
    },
});
