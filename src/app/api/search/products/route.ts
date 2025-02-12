import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const searchQuerySchema = z.object({
  query: z.string().min(1, '検索キーワードを入力してください'),
  category: z.string().optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(50).default(12),
})

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query') || ''
    const category = searchParams.get('category')
    const minPrice = searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!) : undefined
    const maxPrice = searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : undefined
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')

    const validatedData = searchQuerySchema.parse({
      query,
      category,
      minPrice,
      maxPrice,
      page,
      limit,
    })

    const where = {
      AND: [
        {
          OR: [
            { name: { contains: validatedData.query, mode: 'insensitive' } },
            { description: { contains: validatedData.query, mode: 'insensitive' } },
          ],
        },
        validatedData.category ? { category: { slug: validatedData.category } } : {},
        validatedData.minPrice ? { price: { gte: validatedData.minPrice } } : {},
        validatedData.maxPrice ? { price: { lte: validatedData.maxPrice } } : {},
        { isAvailable: true },
      ],
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: (validatedData.page - 1) * validatedData.limit,
        take: validatedData.limit,
      }),
      prisma.product.count({ where }),
    ])

    return NextResponse.json({
      products,
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

    console.error('Products search error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
} 