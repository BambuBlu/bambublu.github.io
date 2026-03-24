import { Suspense } from 'react';
import { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogPostClient from "./BlogPostClient";
import LoadingSlug from "./loading";

async function getNotionPostBySlug(slug: string) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/blog/${slug}`, { next: { revalidate: 60 } });
  
  if (!res.ok) return null;
  return res.json();
}

export async function generateStaticParams() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/blog`);
  
  if (!res.ok) return [];
   
  const posts = await res.json();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return posts.map((post: any) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getNotionPostBySlug(slug);

  if (!post) {
    return { title: 'Post no encontrado' };
  }

  return {
    title: post.title,
    alternates: {
      canonical: `/blog/${slug}`, 
    },
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      type: 'article',
      publishedTime: new Date(post.date).toISOString(),
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.summary, 
    }
  };
}

async function BlogPostFetcher({ slug }: { slug: string }) {
  const post = await getNotionPostBySlug(slug);

  if (!post) return notFound();

  const postData = {
      ...post,
      slug: slug,
      category: post.category || 'Development',
      readTime: post.readTime || '5 min' 
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.summary,
    "datePublished": new Date(post.date).toISOString(),
    "author": [{
        "@type": "Person",
        "name": "Tobias Moscatelli",
        "url": "https://www.tobiasmoscatelli.com"
    }]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogPostClient post={postData} slug={slug} />
    </>
  );
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  return (
    <Suspense fallback={<LoadingSlug />}>
      <BlogPostFetcher slug={slug} />
    </Suspense>
  );
}