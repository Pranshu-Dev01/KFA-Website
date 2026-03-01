'use client';

import { useEffect, useState } from 'react';

export default function ReadingProgressBar() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const updateScrollProgress = () => {
            const currentScrollY = window.scrollY;
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (scrollHeight) {
                setProgress(Number((currentScrollY / scrollHeight).toFixed(2)) * 100);
            }
        };

        window.addEventListener('scroll', updateScrollProgress);
        return () => window.removeEventListener('scroll', updateScrollProgress);
    }, []);

    return (
        <div className="fixed top-0 left-0 right-0 h-1.5 bg-gray-200 z-[100]">
            <div
                className="h-full bg-blue-600 transition-all duration-150 ease-out"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
}
