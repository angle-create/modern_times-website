import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { z } from 'zod'

const categoryUpdateSchema = z.object({
  name: z.string().min(1, 'カテゴリー名は必須です').max(100, 'カテゴリー名は100文字以内で入力してください'),
  slug: z.string().min(1, 'スラッグは必須です')
    .regex(/^[a-z0-9-]+$/, 'スラッグは半角英数字とハイフンのみ使用できます')
    .max(100, 'スラッグは100文字以内で入力してください'),
})

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      )
    }

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        products: true,
        _count: {
          select: {
            products: true,
          },
        },
      },
    })

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(category)
  } catch (error) {
    console.error('Category fetch error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const validatedData = categoryUpdateSchema.parse(body)

    // スラッグの重複チェック（自分以外）
    const existingCategory = await prisma.category.findFirst({
      where: {
        slug: validatedData.slug,
        NOT: {
          id: id,
        },
      },
    })

    if (existingCategory) {
      return NextResponse.json(
        { error: '同じスラッグが既に使用されています' },
        { status: 400 }
      )
    }

    const category = await prisma.category.update({
      where: { id },
      data: validatedData,
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    })

    return NextResponse.json(category)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors },
        { status: 400 }
      )
    }

    console.error('Category update error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      )
    }

    // カテゴリーに紐づく商品の存在確認
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    })

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    if (category._count.products > 0) {
      return NextResponse.json(
        { error: 'このカテゴリーには商品が紐づいているため削除できません' },
        { status: 400 }
      )
    }

    await prisma.category.delete({
      where: { id },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Category deletion error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
} 