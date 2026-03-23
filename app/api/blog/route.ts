/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';

const NOTION_TOKEN = process.env.NOTION_TOKEN || '';
const DATABASE_ID = process.env.NOTION_DATABASE_ID || '';

export const revalidate = 60;

export async function GET() {
  if (!NOTION_TOKEN || !DATABASE_ID) {
    return NextResponse.json({ error: 'Configuración incompleta (Token/ID)' }, { status: 500 });
  }

  try {
    const res = await fetch(`https://api.notion.com/v1/databases/${DATABASE_ID}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_TOKEN}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filter: {
          property: 'Published',
          checkbox: { equals: true },
        },
        sorts: [
          { property: 'Date', direction: 'descending' },
        ],
      }),
      next: { revalidate: 60 }
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Notion API Direct Error:", errorData);
      return NextResponse.json({ error: 'Notion respondió con error', details: errorData }, { status: res.status });
    }

    const data = await res.json();

    const posts = data.results.map((page: any) => {
      return {
        id: page.id,
        title: page.properties.Name?.title[0]?.plain_text || 'Sin título',
        slug: page.properties.Slug?.rich_text[0]?.plain_text || page.id,
        summary: page.properties.Summary?.rich_text[0]?.plain_text || '',
        date: page.properties['Last Edited Time']?.last_edited_time || page.last_edited_time,
        readTime: page.properties.Time?.rich_text[0]?.plain_text || '5 min'
      };
    });

    return NextResponse.json(posts);
  } catch (error: any) {
    console.error("Fetch Error:", error.message);
    return NextResponse.json({ error: 'Fallo crítico de conexión', details: error.message }, { status: 500 });
  }
}