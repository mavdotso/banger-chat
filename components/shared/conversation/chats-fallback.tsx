import { Card } from '@/components/ui/card';

export default function ChatsFallback() {
    return <Card className="hidden lg:flex h-full w-full p-2 items-center justify-center bg-secondary text-secondary-foreground">Select/start a conversation to get started</Card>;
}
