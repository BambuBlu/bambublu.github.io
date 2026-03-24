/* eslint-disable @typescript-eslint/no-explicit-any */
import { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.tobiasmoscatelli.com';

export const dynamic = 'force-static'; 

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  try {
    const res = await fetch(`${SITE_URL}/api/blog`, { next: { revalidate: 3600 } });
    
    if (!res.ok) {
      console.error('Error al generar el sitemap: No se pudo conectar a la API del blog');
      return routes;
    }

    const posts = await res.json();

    const postRoutes: MetadataRoute.Sitemap = posts.map((post: any) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.date || new Date()),
      changeFrequency: 'monthly',
      priority: 0.6,
    }));

    return [...routes, ...postRoutes];
  } catch (error) {
    console.error('Error procesando el sitemap:', error);
    return routes;
  }
}