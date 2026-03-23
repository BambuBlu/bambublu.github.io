import { Metadata } from 'next';
import BlogClient from "./BlogClient";

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

export default async function BlogIndex() {
  const posts = await getNotionPosts();

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
      <BlogClient posts={posts} />
    </>
  )
}