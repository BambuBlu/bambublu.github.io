/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';

const NOTION_TOKEN = process.env.NOTION_TOKEN || '';
const DATABASE_ID = process.env.NOTION_DATABASE_ID || '';

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  try {
    const res = await fetch(`https://api.notion.com/v1/databases/${DATABASE_ID}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_TOKEN}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filter: { property: 'Slug', rich_text: { equals: slug } }
      }),
    });

    const data = await res.json();
    if (!data.results.length) return NextResponse.json({ error: 'Post no encontrado' }, { status: 404 });

    const page = data.results[0];
    const pageId = page.id;

    const blocksRes = await fetch(`https://api.notion.com/v1/blocks/${pageId}/children?page_size=100`, {
      headers: {
        'Authorization': `Bearer ${NOTION_TOKEN}`,
        'Notion-Version': '2022-06-28',
      },
    });
    const blocksData = await blocksRes.json();

    const getText = (richTextArr: any[]) => {
      return richTextArr?.map((t: any) => t.plain_text).join('') || '';
    };

    const content = blocksData.results.map((block: any) => {
      switch (block.type) {
        case 'paragraph':
          return getText(block.paragraph.rich_text);
        
        case 'heading_1':
          return `# ${getText(block.heading_1.rich_text)}`;
        
        case 'heading_2':
          return `## ${getText(block.heading_2.rich_text)}`;
        
        case 'heading_3':
          return `### ${getText(block.heading_3.rich_text)}`;
        
        case 'bulleted_list_item':
          return `* ${getText(block.bulleted_list_item.rich_text)}`;
        
        case 'numbered_list_item':
          return `1. ${getText(block.numbered_list_item.rich_text)}`;
        
        case 'code':
          const codeText = getText(block.code.rich_text);
          return `\`\`\`${block.code.language}\n${codeText}\n\`\`\``;
        
        case 'image':
          const url = block.image.type === 'external' ? block.image.external.url : block.image.file.url;
          const caption = getText(block.image.caption);
          return `![${caption}](${url})`;

        case 'divider':
          return '---';

        default:
          return '';
      }
    }).join('\n\n');

    return NextResponse.json({
      title: page.properties.Name?.title[0]?.plain_text || 'Sin título',
      content: content,
      date: page.properties['Last Edited Time']?.last_edited_time || page.last_edited_time,
      readTime: page.properties.Time?.rich_text[0]?.plain_text || '5 min',
      category: page.properties.Category?.select?.name || 'Development'
    });

  } catch (error) {
    console.error("Error en API de artículo:", error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}