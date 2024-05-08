import { ThemeToggle } from '../theme-toggle';
import { Button } from '../ui/button';
import { User } from 'lucide-react';

export default function Header() {
    return (
        <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b px-4">
            <h1 className="text-xl font-semibold">Chats</h1>
            <Button variant="outline" size="icon" className="ml-auto gap-1.5 text-sm">
                <User className="size-4" />
            </Button>
            <ThemeToggle />
        </header>
    );
}
