import { prisma } from '@/lib/prisma'
import { ProductList } from './product-list'
import Link from 'next/link'

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">商品管理</h1>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-brown-600 hover:bg-brown-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brown-500"
        >
          商品を追加
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg">
        <ProductList products={products} />
      </div>
    </div>
  )
} 