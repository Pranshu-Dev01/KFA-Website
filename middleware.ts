import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const allowedOrigins = [
    'https://krishnafluteacademy.com',
    'http://localhost:3000',
];

const corsOptions = {
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
};

export function middleware(request: NextRequest) {
    // Check the origin from the request
    const origin = request.headers.get('origin') ?? '';
    const isAllowedOrigin = allowedOrigins.includes(origin);

    // Handle preflight OPTIONS requests
    const isPreflight = request.method === 'OPTIONS';

    if (isPreflight) {
        const preflightHeaders = {
            ...(isAllowedOrigin && { 'Access-Control-Allow-Origin': origin }),
            ...corsOptions,
        };
        return NextResponse.json({}, { headers: preflightHeaders });
    }

    // Handle actual requests
    const response = NextResponse.next();

    if (isAllowedOrigin) {
        response.headers.set('Access-Control-Allow-Origin', origin);
    }

    // Always set CORS options headers
    Object.entries(corsOptions).forEach(([key, value]) => {
        response.headers.set(key, value);
    });

    return response;
}

// Specify the paths where this middleware should run
export const config = {
    matcher: '/api/:path*',
};
