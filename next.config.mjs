/** @type {import('next').NextConfig} */
const nextConfig = {
    /**
     * Only enable 'output: export' during production builds (npm run build).
     * In dev mode (npm run dev), dynamic routes work normally with SSR.
     */
    output: process.env.NODE_ENV === 'production' ? 'export' : undefined,

    // Trailing Slash: Required for correct routing on static hosts (GitHub Pages)
    trailingSlash: true,

    // Image Configuration: unoptimized required for static export
    images: {
        unoptimized: true,
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
    },

    // Optimization for Supabase Client
    serverExternalPackages: ['@supabase/supabase-js'],
};

export default nextConfig;