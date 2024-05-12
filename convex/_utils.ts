import { MutationCtx, QueryCtx } from './_generated/server';

export const getUserByClerkId = async ({ ctx, clerkId }: { ctx: QueryCtx | MutationCtx; clerkId: string }) => {
    return await ctx.db
        .query('users')
        .withIndex('by_clerkId', (q) => q.eq('clerkId', clerkId))
        .unique();
};

export const getUserByUsername = async ({ ctx, username }: { ctx: QueryCtx | MutationCtx; username: string }) => {
    return await ctx.db
        .query('users')
        .withIndex('by_username', (q) => q.eq('username', username))
        .unique();
};
