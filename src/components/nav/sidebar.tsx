import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Book, Bot, Code2, LifeBuoy, Settings2, SquareTerminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function Sidebar() {
    return (
        <aside className="inset-y fixed left-0 z-20 flex h-full flex-col border-r">
            <div className="border-b p-2">
                <Button variant="ghost" size="icon" aria-label="Home">
                    <Image src="banger-b.svg" height={30} width={30} alt="Banger" />
                </Button>
            </div>
            <nav className="grid gap-1 p-2">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-lg bg-muted" aria-label="Playground">
                                <SquareTerminal className="size-5" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right" sideOffset={5}>
                            Playground
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-lg" aria-label="Models">
                                <Bot className="size-5" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right" sideOffset={5}>
                            Models
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-lg" aria-label="API">
                                <Code2 className="size-5" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right" sideOffset={5}>
                            API
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-lg" aria-label="Documentation">
                                <Book className="size-5" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right" sideOffset={5}>
                            Documentation
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-lg" aria-label="Settings">
                                <Settings2 className="size-5" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right" sideOffset={5}>
                            Settings
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </nav>
            <nav className="mt-auto grid gap-1 p-2">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="mt-auto rounded-lg" aria-label="Help">
                                <LifeBuoy className="size-5" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right" sideOffset={5}>
                            Help
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </nav>
        </aside>
    );
}
