'use client'

import { Category } from '@prisma/client'
import Link from 'next/link'
import { useState } from 'react'
import { DeleteDialog } from './delete-dialog'
import { deleteCategory } from './actions'
import { useRouter } from 'next/navigation'

interface CategoryWithCount extends Category {
  _count: {
    products: number
  }
}

interface CategoryListProps {
  categories: CategoryWithCount[]
}

export function CategoryList({ categories }: CategoryListProps) {
  const [selectedCategory, setSelectedCategory] = useState<CategoryWithCount | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  async function handleDelete(id: number) {
    try {
      setIsDeleting(true)
      await deleteCategory(id)
      setSelectedCategory(null)
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
                カテゴリ名
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                スラッグ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                商品数
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories.map((category) => (
              <tr key={category.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {category.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{category.slug}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {category._count.products}件
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <Link
                    href={`/admin/categories/${category.id}/edit`}
                    className="text-brown-600 hover:text-brown-900"
                  >
                    編集
                  </Link>
                  <button
                    onClick={() => setSelectedCategory(category)}
                    className={`${
                      isDeleting
                        ? 'text-gray-400'
                        : category._count.products > 0
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-red-600 hover:text-red-900'
                    }`}
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

      {selectedCategory && (
        <DeleteDialog
          isOpen={true}
          onClose={() => setSelectedCategory(null)}
          onConfirm={() => handleDelete(selectedCategory.id)}
          categoryName={selectedCategory.name}
          hasProducts={selectedCategory._count.products > 0}
        />
      )}
    </>
  )
} 