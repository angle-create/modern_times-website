import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { z } from 'zod'

const productCreateSchema = z.object({
  categoryId: z.number().int('カテゴリーIDは整数である必要があります'),
  name: z.string().min(1, '商品名は必須です').max(200, '商品名は200文字以内で入力してください'),
  description: z.string().optional(),
  price: z.number().int('価格は整数である必要があります').min(0, '価格は0以上である必要があります'),
  imageUrl: z.string().url('有効なURLを入力してください').optional(),
  isAvailable: z.boolean().default(true),
})

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
      },
      where: {
        isAvailable: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error('Products fetch error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = productCreateSchema.parse(body)

    // カテゴリーの存在確認
    const category = await prisma.category.findUnique({
      where: { id: validatedData.categoryId },
    })

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 400 }
      )
    }

    const product = await prisma.product.create({
      data: validatedData,
      include: {
        category: true,
      },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors },
        { status: 400 }
      )
    }

    console.error('Product creation error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
} 