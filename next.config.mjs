/** @type {import('next').NextConfig} */
const nextConfig = {
    /* config options here */
    serverExternalPackages: ['@supabase/supabase-js'],
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
    },
};

export default nextConfig;
