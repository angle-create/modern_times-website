import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { z } from 'zod'

const orderItemSchema = z.object({
  productId: z.number().int('商品IDは整数である必要があります'),
  quantity: z.number().int('数量は整数である必要があります').min(1, '数量は1以上である必要があります'),
})

const orderCreateSchema = z.object({
  customerName: z.string().min(1, '名前は必須です').max(100, '名前は100文字以内で入力してください'),
  customerEmail: z.string().email('有効なメールアドレスを入力してください'),
  customerPhone: z.string().regex(/^[0-9-]+$/, '電話番号は数字とハイフンのみ使用できます').optional(),
  note: z.string().optional(),
  items: z.array(orderItemSchema).min(1, '商品を1つ以上選択してください'),
})

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    const where = status ? { status } : {}

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
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
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.order.count({ where }),
    ])

    return NextResponse.json({
      orders,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Orders fetch error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = orderCreateSchema.parse(body)

    // トランザクションで注文処理を実行
    const result = await prisma.$transaction(async (tx) => {
      // 商品情報の取得と在庫チェック
      const products = await Promise.all(
        validatedData.items.map(async (item) => {
          const product = await tx.product.findUnique({
            where: { id: item.productId },
          })

          if (!product) {
            throw new Error(`商品ID ${item.productId} が見つかりません`)
          }

          if (!product.isAvailable) {
            throw new Error(`商品「${product.name}」は現在販売停止中です`)
          }

          if (product.stock < item.quantity) {
            throw new Error(`商品「${product.name}」の在庫が不足しています`)
          }

          return {
            ...product,
            orderQuantity: item.quantity,
          }
        })
      )

      // 注文番号の生成（現在のタイムスタンプと乱数を組み合わせる）
      const orderNumber = `ORD${Date.now()}${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, '0')}`

      // 合計金額の計算
      const totalAmount = products.reduce(
        (sum, product) => sum + product.price * product.orderQuantity,
        0
      )

      // 注文の作成
      const order = await tx.order.create({
        data: {
          orderNumber,
          customerName: validatedData.customerName,
          customerEmail: validatedData.customerEmail,
          customerPhone: validatedData.customerPhone,
          totalAmount,
          note: validatedData.note,
          items: {
            create: products.map((product) => ({
              productId: product.id,
              name: product.name,
              price: product.price,
              quantity: product.orderQuantity,
            })),
          },
        },
        include: {
          items: true,
        },
      })

      // 在庫数の更新
      await Promise.all(
        products.map((product) =>
          tx.product.update({
            where: { id: product.id },
            data: {
              stock: {
                decrement: product.orderQuantity,
              },
            },
          })
        )
      )

      // 在庫履歴の記録
      await Promise.all(
        products.map((product) =>
          tx.stockLog.create({
            data: {
              productId: product.id,
              quantity: product.orderQuantity,
              type: 'decrease',
              note: `注文番号: ${orderNumber}`,
            },
          })
        )
      )

      return order
    })

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors },
        { status: 400 }
      )
    }

    console.error('Order creation error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    )
  }
} 