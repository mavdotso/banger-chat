import ConvexClientProviders from '@/providers/ConvexClientProviders';
import { ThemeProvider } from '@/components/ui/theme/theme-provider';
import LoadingLogo from '@/components/shared/LoadingLogo';
import { ClerkLoaded, ClerkLoading } from '@clerk/nextjs';
import { Toaster } from '@/components/ui/sonner';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
    themeColor: 'DodgerBlue',
};

export const metadata: Metadata = {
    title: 'banger.chat',
    description: 'Community chats for Fantasy.top',
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
                    <ConvexClientProviders>
                        <ClerkLoading>
                            <LoadingLogo />
                        </ClerkLoading>
                        <ClerkLoaded>
                            {children}
                            <Toaster richColors />
                        </ClerkLoaded>
                    </ConvexClientProviders>
                </ThemeProvider>
            </body>
        </html>
    );
}
