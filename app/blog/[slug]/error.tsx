'use client';

import { useEffect } from 'react';
import { Search, ArrowLeft, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Blog Error:', error);
    }, [error]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-gradient-to-b from-white to-blue-50/50">
            <div className="bg-red-50 p-8 rounded-2xl shadow-lg max-w-md w-full">
                <Search className="w-16 h-16 text-red-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-red-900 mb-2">Something went wrong</h2>
                <p className="text-red-700 mb-6 text-sm">We're having trouble loading this blog post right now.</p>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => reset()}
                        className="flex items-center justify-center space-x-2 w-full px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-md"
                    >
                        <RefreshCw className="w-5 h-5" /> <span>Retry</span>
                    </button>

                    <Link
                        href="/?post="
                        className="flex items-center justify-center space-x-2 w-full px-6 py-3 bg-white text-blue-600 border border-blue-200 rounded-xl hover:bg-blue-50 transition-colors shadow-sm"
                    >
                        <ArrowLeft className="w-5 h-5" /> <span>Back to all posts</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
