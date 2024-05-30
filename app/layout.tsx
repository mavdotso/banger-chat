import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ConvexClientProvider from '@/providers/convex-client-provider';
import { ClerkLoaded, ClerkLoading } from '@clerk/nextjs';
import LoadingLogo from '@/components/shared/loading-logo';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ThemeProvider } from '@/components/ui/theme/theme-provider';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
    themeColor: '#58E098',
};

export const metadata: Metadata = {
    title: 'banger.chat',
    description: 'NFT-gated community chats for Fantasy.top',
    generator: 'Next.js',
    manifest: '/manifest.json',
    authors: [{ name: '@mavdotso' }],
    icons: [
        { rel: 'apple-touch-icon', url: 'icon-192x192.png' },
        { rel: 'icon', url: 'icon-192x192.png' },
    ],
};
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                    <ConvexClientProvider>
                        <ClerkLoading>
                            <LoadingLogo />
                        </ClerkLoading>
                        <ClerkLoaded>
                            <TooltipProvider>{children as any}</TooltipProvider>
                            <Toaster richColors />
                        </ClerkLoaded>
                    </ConvexClientProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
