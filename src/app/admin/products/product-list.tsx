'use client'

import { Product, Category } from '@prisma/client'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { DeleteDialog } from './delete-dialog'
import { deleteProduct } from './actions'
import { useRouter } from 'next/navigation'

type ProductWithCategory = Product & {
  category: Category
}

interface ProductListProps {
  products: ProductWithCategory[]
}

export function ProductList({ products }: ProductListProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  async function handleDelete(id: number) {
    try {
      setIsDeleting(true)
      await deleteProduct(id)
      setSelectedProduct(null)
      router.refresh()
    } catch (error) {
      console.error('削除に失敗しました:', error)
      // TODO: エラー表示の実装
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                商品画像
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                商品名
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                カテゴリ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                価格
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                在庫数
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ステータス
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      width={48}
                      height={48}
                      className="object-cover rounded"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                      <span className="text-gray-400">No image</span>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {product.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {product.category.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    ¥{product.price.toLocaleString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{product.stock}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      product.isAvailable
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {product.isAvailable ? '販売中' : '停止中'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <Link
                    href={`/admin/products/${product.id}/edit`}
                    className="text-brown-600 hover:text-brown-900"
                  >
                    編集
                  </Link>
                  <button
                    onClick={() => setSelectedProduct(product)}
                    className="text-red-600 hover:text-red-900"
                    disabled={isDeleting}
                  >
                    {isDeleting ? '削除中...' : '削除'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedProduct && (
        <DeleteDialog
          isOpen={true}
          onClose={() => setSelectedProduct(null)}
          onConfirm={() => handleDelete(selectedProduct.id)}
          productName={selectedProduct.name}
        />
      )}
    </>
  )
} 