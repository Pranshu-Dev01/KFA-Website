import { Suspense } from 'react';
import { Metadata, ResolvingMetadata } from 'next';
import { supabase } from '../src/lib/supabase';
import { PageClient } from './PageClient';

// Dynamic metadata generation based on searchParams is removed 
// because it is incompatible with Next.js static exports (output: "export").
// The application will use the global metadata defined in app/layout.tsx.

export default function Page() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>}>
            <PageClient />
        </Suspense>
    );
}
