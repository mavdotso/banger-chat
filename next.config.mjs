import withPWA from './lib/next-pwa-wrapper.cjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
    compiler: {
        removeConsole: process.env.NODE_ENV !== 'development',
    },
    reactStrictMode: true,
    swcMinify: true, // Better performance
    images: {
        domains: ['img.clerk.com', 'utfs.io'],
    },
    webpack: (config) => {
        config.externals.push('pino-pretty', 'encoding');
        return config;
    },
    async redirects() {
        return [
            {
                source: '/',
                destination: '/chats',
                permanent: true,
            },
        ];
    },
};

const PWAWrapper = withPWA({
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
    register: true,
    skipWaiting: true,
});

export default PWAWrapper(nextConfig);
