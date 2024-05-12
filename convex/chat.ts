import { ConvexError, v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { getUserByClerkId } from './_utils';

export const get = query({
    args: { id: v.id('chats') },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error('Unauthorized');
        }

        const currentUser = await getUserByClerkId({
            ctx,
            clerkId: identity.subject,
        });

        if (!currentUser) {
            throw new ConvexError('User not found');
        }

        const chat = await ctx.db.get(args.id);

        if (!chat) {
            throw new ConvexError('Chat is not found');
        }

        const membership = await ctx.db
            .query('chatMembers')
            .withIndex('by_memberId_chatId', (q) => q.eq('memberId', currentUser._id).eq('chatId', chat._id))
            .unique();

        if (!membership) {
            throw new ConvexError("You aren't a member of this chat");
        }

        const allChatMemberships = await ctx.db
            .query('chatMembers')
            .withIndex('by_chatId', (q) => q.eq('chatId', args.id))
            .collect();

        const otherMembers = await Promise.all(
            allChatMemberships
                .filter((membership) => membership.memberId !== currentUser._id)
                .map(async (membership) => {
                    const member = await ctx.db.get(membership.memberId);

                    if (!member) {
                        throw new ConvexError('Member could not be found');
                    }

                    return {
                        _id: member._id,
                        username: member.username,
                        lastSeenMessageId: membership.lastSeenMessage,
                    };
                })
        );

        return { ...chat, otherMembers, otherMember: null };
    },
});

export const createChat = mutation({
    args: {
        name: v.string(),
        chatMembers: v.array(v.id('users')),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error('Unauthorized');
        }

        const currentUser = await getUserByClerkId({
            ctx,
            clerkId: identity.subject,
        });

        if (!currentUser) {
            throw new ConvexError('User not found');
        }

        const isHero = await ctx.db
            .query('heroes')
            .withIndex('by_user', (q) => q.eq('user', currentUser._id))
            .first();

        if (!isHero) {
            throw new ConvexError("User is not a hero and can't create a chat");
        }

        const chatId = await ctx.db.insert('chats', {
            admin: currentUser._id,
            cardAddress: isHero.card,
            name: args.name,
        });

        await Promise.all(
            [...args.chatMembers, currentUser._id].map(
                async (memberId) =>
                    await ctx.db.insert('chatMembers', {
                        memberId,
                        chatId,
                    })
            )
        );
    },
});

export const deleteChat = mutation({
    args: {
        chatId: v.id('chats'),
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

        const isHero = await ctx.db
            .query('heroes')
            .withIndex('by_user', (q) => q.eq('user', currentUser._id))
            .first();

        if (!isHero) {
            throw new ConvexError("User is not a hero and can't delete a chat");
        }

        const chat = await ctx.db.get(args.chatId);

        if (!chat) {
            throw new ConvexError('Chat is not found');
        }

        const memberships = await ctx.db
            .query('chatMembers')
            .withIndex('by_chatId', (q) => q.eq('chatId', args.chatId))
            .collect();

        if (!memberships || memberships.length <= 1) {
            throw new ConvexError('This chat does not have any members');
        }

        const messages = await ctx.db
            .query('messages')
            .withIndex('by_chatId', (q) => q.eq('chatId', args.chatId))
            .collect();

        // Delete chat
        await ctx.db.delete(args.chatId);

        // Delete chat memberships
        await Promise.all(
            memberships.map(async (membership) => {
                await ctx.db.delete(membership._id);
            })
        );

        // Delete chat messages
        await Promise.all(
            messages.map(async (message) => {
                await ctx.db.delete(message._id);
            })
        );
    },
});

export const leaveChat = mutation({
    args: {
        chatId: v.id('chats'),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new ConvexError('Unauthorized');
        }

        const curentUser = await getUserByClerkId({
            ctx,
            clerkId: identity.subject,
        });

        if (!curentUser) {
            throw new ConvexError('User not found');
        }

        const conversation = await ctx.db.get(args.chatId);

        if (!conversation) {
            throw new ConvexError('Conversation not found');
        }

        const membership = await ctx.db
            .query('chatMembers')
            .withIndex('by_memberId_chatId', (q) => q.eq('memberId', curentUser._id).eq('chatId', args.chatId))
            .unique();

        if (!membership) {
            throw new ConvexError('You are not a member of this chat');
        }

        // Delete chat memberships
        await ctx.db.delete(membership._id);
    },
});
