import { ConvexError, v } from 'convex/values';
import { mutation } from './_generated/server';

export const addUser = mutation({
    args: {
        userId: v.string(),
        twitterHandle: v.string(),
        walletAddress: v.string(),
        profileImage: v.string(),
        displayName: v.string(),
        role: v.string(),
        email: v.string(),
    },
    handler: async (ctx, args) => {
        // Check if the user already exists to prevent duplicates
        const existingUser = await ctx.db
            .query('users')
            .filter((q) => q.eq('_id', args.userId))
            .first();

        if (!existingUser) {
            // Insert the new user data into the database
            await ctx.db.insert('users', {
                userId: args.userId,
                twitterHandle: args.twitterHandle || undefined, // Use null for optional fields if not provided
                walletAddress: args.walletAddress || undefined,
                ownedNFTs: [], // Initialize as empty array
                profileImage: args.profileImage || undefined,
                displayName: args.displayName || undefined,
                role: args.role,
                email: args.email || undefined,
            });
            console.log('New user added to the database.');
        } else {
            console.log('User already exists in the database.');
        }
    },
});
