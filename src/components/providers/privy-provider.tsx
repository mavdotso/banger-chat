'use client';
import ConvexClientProvider from '@/components/providers/convex-client-provider';
import { PrivyProvider } from '@privy-io/react-auth';
import { useTheme } from 'next-themes';

export default function PrivyProviderWrapper({ children }: { children: React.ReactNode }) {
    const { theme } = useTheme();

    return (
        <PrivyProvider
            appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
            config={{
                // Customize Privy's appearance in your app
                appearance: {
                    theme: theme === 'dark' ? 'dark' : 'light',
                    accentColor: '#676FFF',
                    logo: 'https://your-logo-url',
                },
            }}
        >
            <ConvexClientProvider>{children}</ConvexClientProvider>
        </PrivyProvider>
    );
}
