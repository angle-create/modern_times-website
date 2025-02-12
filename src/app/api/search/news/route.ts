import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const searchQuerySchema = z.object({
  query: z.string().min(1, '検索キーワードを入力してください'),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(50).default(12),
})

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query') || ''
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')

    const validatedData = searchQuerySchema.parse({
      query,
      startDate,
      endDate,
      page,
      limit,
    })

    const where = {
      AND: [
        {
          OR: [
            { title: { contains: validatedData.query, mode: 'insensitive' } },
            { content: { contains: validatedData.query, mode: 'insensitive' } },
          ],
        },
        validatedData.startDate
          ? { publishedAt: { gte: new Date(validatedData.startDate) } }
          : {},
        validatedData.endDate
          ? { publishedAt: { lte: new Date(validatedData.endDate) } }
          : {},
      ],
    }

    const [news, total] = await Promise.all([
      prisma.news.findMany({
        where,
        orderBy: {
          publishedAt: 'desc',
        },
        skip: (validatedData.page - 1) * validatedData.limit,
        take: validatedData.limit,
      }),
      prisma.news.count({ where }),
    ])

    return NextResponse.json({
      news,
      pagination: {
        total,
        page: validatedData.page,
        limit: validatedData.limit,
        totalPages: Math.ceil(total / validatedData.limit),
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors },
        { status: 400 }
      )
    }

    console.error('News search error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
} 