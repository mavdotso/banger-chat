import { ConvexError, v } from 'convex/values';
import { action, internalAction, internalMutation, internalQuery } from './_generated/server';
import { getUserByClerkId } from './_utils';
import { internal } from './_generated/api';

export const verifyCard = action({
    args: {
        tokenId: v.string(),
        walletAddress: v.string(),
    },
    handler: async (ctx, args) => {
        const card = await ctx.runQuery(internal.cards.getCard, {
            tokenId: args.tokenId,
        });

        if (card) {
            if (card.owner.toLowerCase() !== args.walletAddress.toLowerCase()) {
                await ctx.runMutation(internal.cards.patchCard, {
                    cardId: card._id,
                    walletAddress: args.walletAddress,
                });
                console.log('New card owner applied');
            }
        } else {
            const cardData = await ctx.runAction(internal.cards.fetchCardData, {
                tokenId: args.tokenId,
            });
            await ctx.runMutation(internal.cards.create, {
                ...cardData,
            });
        }
    },
});

export const getCard = internalQuery({
    args: { tokenId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query('cards')
            .filter((q) => q.eq(q.field('token_id'), args.tokenId))
            .first();
    },
});

export const patchCard = internalMutation({
    args: {
        cardId: v.id('cards'),
        walletAddress: v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.patch(args.cardId, { owner: args.walletAddress });
    },
});

export const fetchCardData = internalAction({
    args: {
        tokenId: v.string(),
    },
    handler: async (_, args) => {
        const response = await fetch(`${process.env.FT_API_ENDPOINT}/card/${args.tokenId}`, {
            method: 'GET',
            headers: {
                'x-api-key': process.env.FT_API_KEY as string,
            },
        });
        return await response.json();
    },
});

export const create = internalMutation({
    args: {
        id: v.string(),
        owner: v.string(),
        hero_id: v.string(),
        rarity: v.number(),
        hero_rarity_index: v.string(),
        token_id: v.string(),
        season: v.number(),
        created_at: v.string(),
        updated_at: v.string(),
        tx_hash: v.string(),
        blocknumber: v.number(),
        timestamp: v.string(),
        picture: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new ConvexError('Unauthorized');
        }

        const currentUser = await getUserByClerkId({
            ctx,
            clerkId: identity.subject,
        });

        if (!currentUser) {
            throw new ConvexError('User not found');
        }

        if (!currentUser.web3Wallet) {
            throw new ConvexError('No user wallet');
        }

        const card = await ctx.db.insert('cards', {
            ...args,
            owner: currentUser.web3Wallet,
        });

        return card;
    },
});
