import { supabase } from '../../../src/lib/supabase';
import { notFound } from 'next/navigation';
import ClientBlogPost from './ClientBlogPost';

export const revalidate = 60;

type Props = {
    params: Promise<{ slug: string }>;
};

export default async function BlogPostPage({ params }: Props) {
    const { slug } = await params;

    // Validate slug
    if (!slug) {
        notFound();
    }

    const { data: post, error } = await supabase
        .from('blog_posts')
        .select('*')
        .or(`slug.eq."${slug}",id.eq."${slug}"`)
        .maybeSingle();

    if (error) {
        throw new Error('Failed to fetch the blog post from the server');
    }

    if (!post) {
        notFound();
    }

    return <ClientBlogPost post={post} />;
}
