/** @type {import('next').NextConfig} */
const nextConfig = {
    /**
     * CRITICAL FIX:
     * Only enable 'output: export' during production builds (npm run build).
     * In dev mode (npm run dev), 'output: export' makes Next.js/Turbopack
     * crash on dynamic routes like /blog/[slug] with:
     *   "Page is missing param in generateStaticParams()"
     *
     * By removing it in dev, dynamic routes work normally with SSR.
     * The GitHub Actions build workflow sets NODE_ENV=production,
     * so the static export still works correctly for deployment.
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