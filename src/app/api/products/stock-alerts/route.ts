import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // アラートしきい値を下回っている商品を取得
    const lowStockProducts = await prisma.product.findMany({
      where: {
        stock: {
          lte: prisma.product.fields.alertThreshold,
        },
      },
      select: {
        id: true,
        name: true,
        stock: true,
        alertThreshold: true,
        category: {
          select: {
            name: true,
          },
        },
      },
      orderBy: [
        {
          stock: 'asc',
        },
        {
          name: 'asc',
        },
      ],
    })

    return NextResponse.json({
      products: lowStockProducts.map(product => ({
        id: product.id,
        name: product.name,
        stock: product.stock,
        alertThreshold: product.alertThreshold,
        categoryName: product.category.name,
        status: product.stock === 0 ? '在庫切れ' : '在庫残りわずか',
      })),
    })
  } catch (error) {
    console.error('Stock alerts fetch error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
} 