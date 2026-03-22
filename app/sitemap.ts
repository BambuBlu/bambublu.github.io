import { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/posts';

const SITE_URL = 'https://www.tobiasmoscatelli.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    {
      url: `${SITE_URL}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 1,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ];

  const posts = getAllPosts();
  const postRoutes = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...routes, ...postRoutes];
}