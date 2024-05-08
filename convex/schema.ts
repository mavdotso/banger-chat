import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
    users: defineTable({
        twitterHandle: v.optional(v.string()),
        walletAddress: v.optional(v.string()),
        ownedNFTs: v.array(v.id('nfts')),
        profileImage: v.optional(v.string()),
        displayName: v.optional(v.string()),
        role: v.string(),
    }),

    nfts: defineTable({
        tokenId: v.string(),
        owner: v.id('users'),
        metadata: v.object({
            title: v.string(),
            description: v.string(),
            imageUrl: v.string(),
        }),
    }),

    channels: defineTable({
        name: v.string(),
        description: v.optional(v.string()),
        accessNFT: v.id('nfts'),
        users: v.array(v.id('users')),
    }),

    messages: defineTable({
        channelId: v.id('channels'),
        sender: v.id('users'),
        content: v.string(),
        timestamp: v.number(),
    }),
});
