import { MutationCtx, QueryCtx } from './_generated/server';

export const getUserByClerkId = async ({ ctx, clerkId }: { ctx: QueryCtx | MutationCtx; clerkId: string }) => {
    return await ctx.db
        .query('users')
        .withIndex('by_clerkId', (q) => q.eq('clerkId', clerkId))
        .first();
};

export const getUserByUsername = async ({ ctx, username }: { ctx: QueryCtx | MutationCtx; username: string }) => {
    return await ctx.db
        .query('users')
        .withIndex('by_username', (q) => q.eq('username', username))
        .first();
};

export const getCardByTokenId = async ({ ctx, tokenId }: { ctx: QueryCtx | MutationCtx; tokenId: string }) => {
    return await ctx.db
        .query('cards')
        .withIndex('by_tokenId', (q) => q.eq('token_id', tokenId))
        .first();
};
