import LoginButton from '../login-button';
import { ThemeToggle } from '../theme-toggle';

export default function Header() {
    return (
        <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b px-4">
            <h1 className="text-xl font-semibold">Chats</h1>
            <LoginButton />
            <ThemeToggle />
        </header>
    );
}
