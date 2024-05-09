'use client';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CornerDownLeft, Paperclip } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useChannelStore } from '@/store/channel-store';

export default function MessageBox() {
    const [messageText, setMessageText] = useState('');
    const { selectedChannel } = useChannelStore();
    const sendMessage = useMutation(api.messages.sendTextMessage);
    const me = useQuery(api.users.getMe);

    async function handleSendMessage(e: React.FormEvent) {
        e.preventDefault();
        try {
            await sendMessage({ content: messageText, sender: me!._id, channelId: selectedChannel!._id });
            setMessageText('');
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <form onSubmit={handleSendMessage} className="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring">
            <Label htmlFor="message" className="sr-only">
                Message
            </Label>
            <Textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                id="message"
                placeholder="Type your message here..."
                className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
            />
            <div className="flex items-center p-3 pt-0">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Paperclip className="size-4" />
                                <span className="sr-only">Attach file</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">Attach File</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <Button type="submit" size="sm" className="ml-auto gap-1.5">
                    Send Message
                    <CornerDownLeft className="size-3.5" />
                </Button>
            </div>
        </form>
    );
}
