import { Suspense } from 'react';
import { Metadata } from 'next';
import BlogClient from "./BlogClient";
import LoadingBlogIndex from "./loading";

export const metadata: Metadata = {
  title: 'Bitácora de Desarrollo',
  description: 'Artículos, tutoriales y reflexiones sobre programación, React, Next.js y desarrollo de videojuegos.',
};

async function getNotionPosts() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/blog`, { next: { revalidate: 60 } });
  
  if (!res.ok) {
    console.error("Error al obtener los posts de Notion");
    return [];
  }
  
  return res.json();
}

async function BlogDataFetcher() {
  const posts = await getNotionPosts();
  return <BlogClient posts={posts} />;
}

export default function BlogIndex() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "Tobias Moscatelli",
            "url": "https://www.tobiasmoscatelli.com",
            "jobTitle": "Software Engineer & Game Developer",
            "sameAs": [
              "https://github.com/BambuBlu",
              "https://www.linkedin.com/in/tobiasmoscatelli"
            ]
          })
        }}
      />
      <Suspense fallback={<LoadingBlogIndex />}>
        <BlogDataFetcher />
      </Suspense>
    </>
  )
}