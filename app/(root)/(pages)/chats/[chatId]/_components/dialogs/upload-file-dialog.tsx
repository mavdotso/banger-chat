'use client';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useMutationState } from '@/hooks/useMutationState';
import { zodResolver } from '@hookform/resolvers/zod';
import Uploader from '@/components/shared/uploader';
import { Button } from '@/components/ui/button';
import { api } from '@/convex/_generated/api';
import { ConvexError } from 'convex/values';
import { File, ImageIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useChat } from '@/hooks/useChat';
import { toast } from 'sonner';
import { z } from 'zod';

type Props = {
    open: boolean;
    toggle: (newState: boolean) => void;
    type: 'image' | 'file';
};

const uploadFileSchema = z.object({
    files: z.string().array().min(1, { message: 'You must select at least 1 file' }),
});

export default function UploadFileDialog({ open, toggle, type }: Props) {
    const form = useForm<z.infer<typeof uploadFileSchema>>({
        resolver: zodResolver(uploadFileSchema),
        defaultValues: {
            files: [],
        },
    });

    const { chatId } = useChat();

    const files = form.watch('files');

    const { mutate: createMessage, pending } = useMutationState(api.message.create);

    const handleSubmit = async (values: z.infer<typeof uploadFileSchema>) => {
        createMessage({
            content: values.files,
            type,
            chatId,
        })
            .then(() => {
                form.reset();
                toggle(false);
            })
            .catch((error) => {
                toast.error(error instanceof ConvexError ? error.data : 'Unexpected error occurred');
            });
    };

    return (
        <Dialog open={open} onOpenChange={(open) => toggle(open)}>
            <DialogTrigger asChild>
                <Button size="icon" variant="outline">
                    {type === 'image' ? <ImageIcon /> : <File />}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Upload files</DialogTitle>
                    <DialogDescription>{type === 'image' ? 'Upload images and videos!' : 'Upload image, video, audio, and PDFs!'}</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)}>
                        <FormField
                            control={form.control}
                            name="files"
                            render={() => (
                                <FormItem>
                                    <FormControl>
                                        <div className="py-4">
                                            <Uploader type={type} onChange={(urls) => form.setValue('files', [...files, ...urls])} />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button disabled={!files.length || pending} type="submit">
                                Send
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
