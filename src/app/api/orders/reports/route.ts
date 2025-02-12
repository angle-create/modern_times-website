import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

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
    const startDate = searchParams.get('startDate')
      ? new Date(searchParams.get('startDate')!)
      : new Date(new Date().setDate(new Date().getDate() - 30)) // デフォルトは過去30日
    const endDate = searchParams.get('endDate')
      ? new Date(searchParams.get('endDate')!)
      : new Date()

    // 期間内の注文を取得
    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        status: {
          not: 'cancelled',
        },
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                category: true,
              },
            },
          },
        },
      },
    })

    // 日別売上
    const dailySales = orders.reduce((acc, order) => {
      const date = order.createdAt.toISOString().split('T')[0]
      acc[date] = (acc[date] || 0) + order.totalAmount
      return acc
    }, {} as Record<string, number>)

    // カテゴリー別売上
    const categorySales = orders.reduce((acc, order) => {
      order.items.forEach((item) => {
        const categoryName = item.product.category.name
        acc[categoryName] = (acc[categoryName] || 0) + (item.price * item.quantity)
      })
      return acc
    }, {} as Record<string, number>)

    // 商品別売上ランキング
    const productSales = orders.reduce((acc, order) => {
      order.items.forEach((item) => {
        if (!acc[item.productId]) {
          acc[item.productId] = {
            productId: item.productId,
            name: item.name,
            quantity: 0,
            amount: 0,
          }
        }
        acc[item.productId].quantity += item.quantity
        acc[item.productId].amount += item.price * item.quantity
      })
      return acc
    }, {} as Record<number, { productId: number; name: string; quantity: number; amount: number }>)

    // 集計結果
    const summary = {
      period: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      },
      totalOrders: orders.length,
      totalSales: orders.reduce((sum, order) => sum + order.totalAmount, 0),
      averageOrderValue:
        orders.length > 0
          ? Math.round(
              orders.reduce((sum, order) => sum + order.totalAmount, 0) /
                orders.length
            )
          : 0,
      dailySales: Object.entries(dailySales)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, amount]) => ({
          date,
          amount,
        })),
      categorySales: Object.entries(categorySales).map(
        ([category, amount]) => ({
          category,
          amount,
        })
      ),
      topProducts: Object.values(productSales)
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 10),
    }

    return NextResponse.json(summary)
  } catch (error) {
    console.error('Sales report generation error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
} 