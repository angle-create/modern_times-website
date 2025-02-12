import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // 商品の売れ筋ランキング（上位5件）
    const topProducts = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: {
        quantity: true
      },
      orderBy: {
        _sum: {
          quantity: 'desc'
        }
      },
      take: 5
    })

    // 商品詳細の取得
    const productDetails = await Promise.all(
      topProducts.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          include: { category: true }
        })
        return {
          ...product,
          totalSold: item._sum.quantity
        }
      })
    )

    // カテゴリー別の商品数
    const categoryStats = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        _count: {
          select: { products: true }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })

    // 過去7日間のアクセス統計
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const pageViews = await prisma.pageView.groupBy({
      by: ['path'],
      where: {
        createdAt: {
          gte: sevenDaysAgo
        }
      },
      _count: true,
      orderBy: {
        _count: {
          path: 'desc'
        }
      },
      take: 10
    })

    return NextResponse.json({
      topProducts: productDetails,
      categoryStats: categoryStats.map(cat => ({
        id: cat.id,
        name: cat.name,
        productCount: cat._count.products
      })),
      pageViews: pageViews.map(view => ({
        path: view.path,
        views: view._count
      }))
    })
  } catch (error) {
    console.error('Statistics error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
} 