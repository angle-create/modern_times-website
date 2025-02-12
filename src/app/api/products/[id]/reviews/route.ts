import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { z } from 'zod'

const reviewCreateSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(1, 'コメントは必須です').max(1000, 'コメントは1000文字以内で入力してください'),
  authorName: z.string().min(1, '名前は必須です').max(100, '名前は100文字以内で入力してください'),
  authorEmail: z.string().email('有効なメールアドレスを入力してください'),
  imageUrl: z.string().url('有効なURLを入力してください').optional(),
})

// レビュー一覧の取得
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const productId = parseInt(params.id)
    if (isNaN(productId)) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      )
    }

    // 承認済みのレビューのみを取得（管理者の場合は全て取得）
    const session = await getServerSession(authOptions)
    const isAdmin = session?.user.role === 'admin'

    const reviews = await prisma.review.findMany({
      where: {
        productId,
        ...(isAdmin ? {} : { isApproved: true }),
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        rating: true,
        comment: true,
        authorName: true,
        imageUrl: true,
        isApproved: true,
        createdAt: true,
      },
    })

    // 評価の集計
    const stats = await prisma.review.groupBy({
      by: ['rating'],
      where: {
        productId,
        isApproved: true,
      },
      _count: true,
    })

    const totalReviews = stats.reduce((sum, stat) => sum + stat._count, 0)
    const averageRating = stats.reduce((sum, stat) => sum + stat.rating * stat._count, 0) / (totalReviews || 1)

    return NextResponse.json({
      reviews,
      stats: {
        totalReviews,
        averageRating: Math.round(averageRating * 10) / 10,
        ratingDistribution: stats.reduce((acc, stat) => {
          acc[stat.rating] = stat._count
          return acc
        }, {} as Record<number, number>),
      },
    })
  } catch (error) {
    console.error('Reviews fetch error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

// レビューの投稿
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const productId = parseInt(params.id)
    if (isNaN(productId)) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      )
    }

    // 商品の存在確認
    const product = await prisma.product.findUnique({
      where: { id: productId },
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const validatedData = reviewCreateSchema.parse(body)

    // レビューの作成
    const review = await prisma.review.create({
      data: {
        ...validatedData,
        productId,
        isApproved: false, // デフォルトで未承認
      },
    })

    return NextResponse.json(review, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors },
        { status: 400 }
      )
    }

    console.error('Review creation error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
} 