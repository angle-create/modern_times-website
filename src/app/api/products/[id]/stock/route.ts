import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { z } from 'zod'

const stockUpdateSchema = z.object({
  quantity: z.number().int('数量は整数である必要があります'),
  type: z.enum(['increase', 'decrease'], {
    required_error: '操作タイプは increase または decrease である必要があります',
  }),
  note: z.string().optional(),
})

const alertThresholdSchema = z.object({
  threshold: z.number().int('アラートしきい値は整数である必要があります').min(0, 'アラートしきい値は0以上である必要があります'),
})

// 在庫情報の取得
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

    const product = await prisma.product.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        stock: true,
        alertThreshold: true,
        stockLogs: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 10,
        },
      },
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Stock info fetch error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

// 在庫数の更新
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
    const validatedData = stockUpdateSchema.parse(body)

    // トランザクションで在庫更新と履歴記録を実行
    const result = await prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({
        where: { id },
        select: { stock: true },
      })

      if (!product) {
        throw new Error('Product not found')
      }

      // 在庫数の計算
      let newStock = product.stock
      if (validatedData.type === 'increase') {
        newStock += validatedData.quantity
      } else {
        newStock -= validatedData.quantity
        if (newStock < 0) {
          throw new Error('在庫数が不足しています')
        }
      }

      // 在庫数の更新
      const updatedProduct = await tx.product.update({
        where: { id },
        data: { stock: newStock },
      })

      // 在庫履歴の記録
      await tx.stockLog.create({
        data: {
          productId: id,
          quantity: validatedData.quantity,
          type: validatedData.type,
          note: validatedData.note,
        },
      })

      return updatedProduct
    })

    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors },
        { status: 400 }
      )
    }

    console.error('Stock update error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    )
  }
}

// アラートしきい値の更新
export async function PATCH(
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
    const validatedData = alertThresholdSchema.parse(body)

    const product = await prisma.product.update({
      where: { id },
      data: {
        alertThreshold: validatedData.threshold,
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors },
        { status: 400 }
      )
    }

    console.error('Alert threshold update error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
} 