import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');

  if (!slug) return NextResponse.json({ error: 'Slug requerido' }, { status: 400 });

  try {
    const stats = await redis.hgetall(`blog:${slug}`);
    
    return NextResponse.json({
      views: stats?.views || 0,
      claps: stats?.claps || 0,
    });
  } catch (error) {
    console.error("Redis GET Error:", error);
    return NextResponse.json({ error: 'Error leyendo stats' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { slug, action } = await request.json();

    if (!slug || !action) return NextResponse.json({ error: 'Faltan datos' }, { status: 400 });

    let newValue = 0;
    
    if (action === 'view') {
      newValue = await redis.hincrby(`blog:${slug}`, 'views', 1);
    } else if (action === 'clap') {
      newValue = await redis.hincrby(`blog:${slug}`, 'claps', 1);
    }

    return NextResponse.json({ success: true, [action === 'view' ? 'views' : 'claps']: newValue });
  } catch (error) {
    console.error("Redis POST Error:", error);
    return NextResponse.json({ error: 'Error actualizando stats' }, { status: 500 });
  }
}