import { httpRouter } from 'convex/server';
import { httpAction } from './_generated/server';
import { internal } from './_generated/api';
import type { WebhookEvent } from '@clerk/backend';
import { Webhook } from 'svix';

async function validatePayload(req: Request): Promise<WebhookEvent | undefined> {
    const payload = await req.text();

    const svixHeaders = {
        'svix-id': req.headers.get('svix-id')!,
        'svix-timestamp': req.headers.get('svix-timestamp')!,
        'svix-signature': req.headers.get('svix-signature')!,
    };

    const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET || '');

    try {
        const event = webhook.verify(payload, svixHeaders) as WebhookEvent;

        return event;
    } catch (_) {
        console.error('Clerk webhook request could not be verified');
        return;
    }
}

const handleClerkWebhook = httpAction(async (ctx, req) => {
    const event = await validatePayload(req);

    if (!event) {
        return new Response('Could not validate Clerk payload', {
            status: 400,
        });
    }

    switch (event.type) {
        case 'user.created':
            console.log(event.data);
            const user = await ctx.runQuery(internal.user.get, {
                clerkId: event.data.id,
            });

            if (user) {
                console.log(`Updating user ${event.data.id} with: ${event.data}`);
            }
        case 'user.updated': {
            const user = await ctx.runQuery(internal.user.get, {
                clerkId: event.data.id,
            });

            if (user) {
                console.log(`Updating user ${event.data.id} with: ${event.data}`);
                await ctx.runMutation(internal.user.update, {
                    username: event.data.username || '',
                    imageUrl: event.data.image_url || '',
                    clerkId: user.clerkId,
                    email: event.data.email_addresses[0]?.email_address || '',
                    web3Wallet: event.data.web3_wallets[0]?.web3_wallet || '',
                });
            } else {
                await ctx.runMutation(internal.user.create, {
                    username: event.data.username || '',
                    imageUrl: event.data.image_url || '',
                    clerkId: event.data.id,
                    email: event.data.email_addresses[0]?.email_address || '',
                    web3Wallet: event.data.web3_wallets[0]?.web3_wallet || '',
                    // TODO: add a check to see if username is in the isHero list
                    role: 'user',
                });
            }

            break;
        }
        default: {
            console.log('Clerk webhook event not supported', event.type);
        }
    }
    return new Response(null, {
        status: 200,
    });
});

const http = httpRouter();

http.route({
    path: '/clerk-users-webhook',
    method: 'POST',
    handler: handleClerkWebhook,
});

export default http;
