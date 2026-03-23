import { Metadata } from 'next';
import { getAllPosts } from "@/lib/posts";
import BlogClient from "./BlogClient";

export const metadata: Metadata = {
  title: 'Bitácora de Desarrollo',
  description: 'Artículos, tutoriales y reflexiones sobre programación, React, Next.js y desarrollo de videojuegos.',
};

export default function BlogIndex() {
  const posts = getAllPosts();
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
      <BlogClient posts={posts} />;
    </>
  )
}