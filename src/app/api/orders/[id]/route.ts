import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { z } from 'zod'

const orderUpdateSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'preparing', 'completed', 'cancelled']),
  note: z.string().optional(),
})

export async function GET(
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

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                category: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error('Order fetch error:', error)
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
    const validatedData = orderUpdateSchema.parse(body)

    // 注文の存在確認
    const existingOrder = await prisma.order.findUnique({
      where: { id },
    })

    if (!existingOrder) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // キャンセルの場合は在庫を戻す
    if (validatedData.status === 'cancelled' && existingOrder.status !== 'cancelled') {
      await prisma.$transaction(async (tx) => {
        // 注文アイテムの取得
        const orderItems = await tx.orderItem.findMany({
          where: { orderId: id },
        })

        // 在庫の復元
        await Promise.all(
          orderItems.map((item) =>
            tx.product.update({
              where: { id: item.productId },
              data: {
                stock: {
                  increment: item.quantity,
                },
              },
            })
          )
        )

        // 在庫履歴の記録
        await Promise.all(
          orderItems.map((item) =>
            tx.stockLog.create({
              data: {
                productId: item.productId,
                quantity: item.quantity,
                type: 'increase',
                note: `注文キャンセル: ${existingOrder.orderNumber}`,
              },
            })
          )
        )

        // 注文状態の更新
        await tx.order.update({
          where: { id },
          data: {
            status: validatedData.status,
            note: validatedData.note,
          },
        })
      })

      const updatedOrder = await prisma.order.findUnique({
        where: { id },
        include: {
          items: true,
        },
      })

      return NextResponse.json(updatedOrder)
    }

    // 通常の状態更新
    const order = await prisma.order.update({
      where: { id },
      data: {
        status: validatedData.status,
        note: validatedData.note,
      },
      include: {
        items: true,
      },
    })

    return NextResponse.json(order)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors },
        { status: 400 }
      )
    }

    console.error('Order update error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
} 