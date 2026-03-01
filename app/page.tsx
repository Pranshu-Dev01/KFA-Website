import { Metadata, ResolvingMetadata } from 'next';
import { supabase } from '../src/lib/supabase';
import { PageClient } from './PageClient';

type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
    { searchParams }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const params = await searchParams;
    const postSlug = params.post as string;

    if (postSlug) {
        try {
            // Fetch post data for dynamic tags
            const { data: post, error } = await supabase
                .from('blog_posts')
                .select('title, excerpt, featured_image, slug')
                .or(`slug.eq."${postSlug}",id.eq."${postSlug}"`)
                .maybeSingle();

            if (post) {
                const previousImages = (await parent).openGraph?.images || [];
                return {
                    title: `${post.title} | Krishna Flute Academy`,
                    description: post.excerpt,
                    openGraph: {
                        title: post.title,
                        description: post.excerpt,
                        url: `https://krishnafluteacademy.com/?post=${post.slug || postSlug}`,
                        images: post.featured_image ? [post.featured_image, ...previousImages] : previousImages,
                        type: 'article',
                    },
                    twitter: {
                        card: 'summary_large_image',
                        title: post.title,
                        description: post.excerpt,
                        images: post.featured_image ? [post.featured_image] : [],
                    },
                };
            }
        } catch (e) {
            console.error('Error generating metadata:', e);
        }
    }

    return {}; // Fallback to layout metadata
}

export default function Page() {
    return <PageClient />;
}
