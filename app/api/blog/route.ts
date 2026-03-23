/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import * as NotionLog from '@notionhq/client'; 

const notion = new NotionLog.Client({ auth: process.env.NOTION_TOKEN });
const DATABASE_ID = process.env.NOTION_DATABASE_ID || '';

export const revalidate = 60;

export async function GET() {
  if (!DATABASE_ID) {
    return NextResponse.json({ error: 'Falta el ID de la base de datos' }, { status: 500 });
  }

  try {
    const response = await (notion as any).databases.query({
      database_id: DATABASE_ID,
      filter: {
        property: 'Published',
        checkbox: {
          equals: true, 
        },
      },
      sorts: [
        {
          property: 'Date',
          direction: 'descending', 
        },
      ],
    });

    const posts = response.results.map((page: any) => {
      return {
        id: page.id,
        title: page.properties.Name?.title[0]?.plain_text || 'Sin título',
        slug: page.properties.Slug?.rich_text[0]?.plain_text || page.id,
        summary: page.properties.Summary?.rich_text[0]?.plain_text || '',
        date: page.properties.Date?.date?.start || page.created_time,
      };
    });

    return NextResponse.json(posts);
  } catch (error: any) {
    console.error("Notion API Error Detail:", error.message || error);
    return NextResponse.json({ error: 'Fallo al conectar con Notion', details: error.message }, { status: 500 });
  }
}