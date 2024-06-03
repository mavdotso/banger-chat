import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
    users: defineTable({
        username: v.string(),
        imageUrl: v.string(),
        clerkId: v.string(),
        email: v.optional(v.string()),
        role: v.optional(v.string()),
        web3Wallet: v.optional(v.string()),
    })
        .index('by_clerkId', ['clerkId'])
        .index('by_username', ['username']),
    heroes: defineTable({
        id: v.string(),
        handle: v.string(),
        name: v.string(),
        description: v.optional(v.any()),
        followers_count: v.string(),
        profile_image_url_https: v.string(),
        stars: v.number(),
    }).index('by_handle', ['handle']),
    chats: defineTable({
        admin: v.string(),
        name: v.string(),
        hero_id: v.string(),
        description: v.optional(v.any()),
        moderators: v.optional(v.array(v.id('users'))),
        lastMessageId: v.optional(v.id('messages')),
        imageUrl: v.optional(v.string()),
    }),
    chatMembers: defineTable({
        memberId: v.id('users'),
        chatId: v.id('chats'),
        lastSeenMessage: v.optional(v.id('messages')),
    })
        .index('by_memberId', ['memberId'])
        .index('by_chatId', ['chatId'])
        .index('by_memberId_chatId', ['memberId', 'chatId']),
    messages: defineTable({
        senderId: v.id('users'),
        chatId: v.id('chats'),
        type: v.string(),
        content: v.array(v.string()),
    }).index('by_chatId', ['chatId']),
    cards: defineTable({
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
    })
        .index('by_owner', ['owner'])
        .index('by_hero_id', ['hero_id'])
        .index('by_tokenId', ['token_id']),
});
