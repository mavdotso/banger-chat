import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
    users: defineTable({
        username: v.string(),
        imageUrl: v.string(),
        clerkId: v.string(),
        email: v.optional(v.string()),
        role: v.optional(v.string()),
        web3Wallet: v.string(),
    })
        .index('by_clerkId', ['clerkId'])
        .index('by_username', ['username']),
    heroes: defineTable({
        card: v.id('cards'),
        user: v.id('users'),
    })
        .index('by_card', ['card'])
        .index('by_user', ['user']),
    chats: defineTable({
        name: v.string(),
        admin: v.id('users'),
        moderators: v.optional(v.array(v.id('users'))),
        cardAddress: v.id('cards'),
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
        ownerId: v.id('users'),
        tokenAddress: v.string(),
        tokenId: v.string(),
    })
        .index('by_ownerId', ['ownerId'])
        .index('by_tokenAddress_tokenId', ['tokenAddress', 'tokenId']),
});
