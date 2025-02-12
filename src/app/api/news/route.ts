import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const news = await prisma.news.findMany({
      orderBy: {
        publishedAt: 'desc',
      },
    })

    return NextResponse.json(news)
  } catch (error) {
    console.error('News fetch error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
} 