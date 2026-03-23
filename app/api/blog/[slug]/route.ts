import { NextResponse } from 'next/server';
import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const n2m = new NotionToMarkdown({ notionClient: notion });
const DATABASE_ID = process.env.NOTION_DATABASE_ID || '';

export const revalidate = 60;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!DATABASE_ID) return NextResponse.json({ error: 'Falta ID' }, { status: 500 });

  const { slug } = await params;

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await (notion.databases as any).query({
      database_id: DATABASE_ID,
      filter: {
        property: 'Slug',
        rich_text: {
          equals: slug,
        },
      },
    });

    if (!response.results.length) {
      return NextResponse.json({ error: 'Post no encontrado' }, { status: 404 });
    }

    const page = response.results[0];

    const mdBlocks = await n2m.pageToMarkdown(page.id);
    const mdString = n2m.toMarkdownString(mdBlocks);

    const post = {
      id: page.id,
      title: page.properties.Name?.title[0]?.plain_text || 'Sin título',
      summary: page.properties.Summary?.rich_text[0]?.plain_text || '',
      date: page.properties.Date?.date?.start || page.created_time,
      content: mdString.parent 
    };

    return NextResponse.json(post);
  } catch (error) {
    console.error("Notion API Error:", error);
    return NextResponse.json({ error: 'Error al cargar el post' }, { status: 500 });
  }
}