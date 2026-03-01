import Link from 'next/link';
import { Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-gradient-to-b from-white to-blue-50/50">
            <div className="bg-blue-50 p-8 rounded-2xl shadow-lg max-w-md w-full border border-blue-100">
                <Search className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-blue-900 mb-2">Post Not Found</h2>
                <p className="text-blue-700 mb-6 text-sm">We couldn't find the blog post you're looking for. It may have been moved or deleted.</p>

                <Link
                    href="/?post="
                    className="flex items-center justify-center space-x-2 w-full px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-md"
                >
                    <ArrowLeft className="w-5 h-5" /> <span>Back to all posts</span>
                </Link>
            </div>
        </div>
    );
}
