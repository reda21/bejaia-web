import { NextRequest, NextResponse } from 'next/server';
import {
  buildAllHistoryArticlePayloads,
  getHistoryArticlePayloadById,
} from '@/services/historyArticlesService';

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');

  if (id) {
    const article = getHistoryArticlePayloadById(id);
    if (!article) {
      return NextResponse.json({ error: 'Article introuvable' }, { status: 404 });
    }
    return NextResponse.json(
      { article },
      {
        headers: {
          'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
        },
      }
    );
  }

  const articles = buildAllHistoryArticlePayloads();
  return NextResponse.json(
    { articles, total: articles.length },
    {
      headers: {
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      },
    }
  );
}
