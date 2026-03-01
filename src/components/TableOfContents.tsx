'use client';

import React, { useEffect, useState } from 'react';

interface TOCItem {
    id: string;
    text: string;
    level: number;
}

interface TableOfContentsProps {
    contentHtml: string;
}

export default function TableOfContents({ contentHtml }: TableOfContentsProps) {
    const [headings, setHeadings] = useState<TOCItem[]>([]);
    const [activeId, setActiveId] = useState<string>('');

    useEffect(() => {
        // Parse headings from the HTML content
        const parser = new DOMParser();
        const doc = parser.parseFromString(contentHtml, 'text/html');
        const elements = Array.from(doc.querySelectorAll('h1, h2, h3, h4'));

        const newHeadings = elements.map(elem => {
            const text = elem.textContent || '';
            // Generate id if one doesn't exist
            let id = elem.getAttribute('id');
            if (!id) {
                id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
            }
            return {
                id,
                text,
                level: Number(elem.tagName.replace('H', '')),
            };
        }).filter(h => h.level <= 3); // Only show up to h3

        setHeadings(newHeadings);
    }, [contentHtml]);

    useEffect(() => {
        // Observe real DOM elements since we render the content via dangerouslySetInnerHTML
        // We'll need to make sure the rendered content elements have matching IDs
        const headingElements = Array.from(document.querySelectorAll('.prose h1, .prose h2, .prose h3'));

        // Add IDs to the actual DOM elements if they don't have them
        headingElements.forEach(elem => {
            if (!elem.id) {
                const text = elem.textContent || '';
                elem.id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
            }
        });

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: '0% 0% -80% 0%' }
        );

        headingElements.forEach((elem) => observer.observe(elem));

        return () => observer.disconnect();
    }, [headings, contentHtml]);

    if (headings.length === 0) {
        return (
            <nav className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b pb-2">
                    Table of Contents
                </h4>
                <p className="text-sm text-gray-500 italic px-2">No headings in this post.</p>
            </nav>
        );
    }

    const tocList = (
        <ul className="space-y-2">
            {headings.map((heading, index) => (
                <li
                    key={`${heading.id}-${index}`}
                    style={{ paddingLeft: `${(heading.level - 1) * 1}rem` }}
                >
                    <a
                        href={`#${heading.id}`}
                        className={`block text-sm transition-colors duration-200 ${activeId === heading.id
                            ? 'text-blue-600 font-semibold'
                            : 'text-gray-600 hover:text-blue-500'
                            }`}
                        onClick={(e) => {
                            e.preventDefault();
                            const targetEntry = document.getElementById(heading.id);
                            if (targetEntry) {
                                const yOffset = -100; // Account for fixed header
                                const y = targetEntry.getBoundingClientRect().top + window.scrollY + yOffset;
                                window.scrollTo({ top: y, behavior: 'smooth' });
                            }
                        }}
                    >
                        {heading.text}
                    </a>
                </li>
            ))}
        </ul>
    );

    return (
        <nav className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto w-full">
            {/* Desktop View */}
            <div className="hidden lg:block">
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b pb-2">
                    Table of Contents
                </h4>
                {tocList}
            </div>

            {/* Mobile View (Accordion) */}
            <div className="lg:hidden w-full mb-6">
                <details className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 md:p-5 group shadow-sm">
                    <summary className="font-bold text-blue-900 cursor-pointer list-none flex justify-between items-center text-base">
                        <span>Table of Contents</span>
                        <span className="transition-transform duration-300 group-open:rotate-180 text-blue-500 bg-white p-1 rounded-full shadow-sm">
                            <svg fill="none" height="18" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" width="18"><path d="M19 9l-7 7-7-7"></path></svg>
                        </span>
                    </summary>
                    <div className="mt-4 pt-4 border-t border-blue-100 max-h-[60vh] overflow-y-auto">
                        {tocList}
                    </div>
                </details>
            </div>
        </nav>
    );
}
