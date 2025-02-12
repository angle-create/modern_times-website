'use client'

import { Category, Product } from '@prisma/client'
import { useRef } from 'react'

interface ProductFormProps {
  categories: Category[]
  product?: Product
  action: (formData: FormData) => Promise<void>
  submitLabel: string
}

export function ProductForm({
  categories,
  product,
  action,
  submitLabel,
}: ProductFormProps) {
  const formRef = useRef<HTMLFormElement>(null)

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await action(formData)
        formRef.current?.reset()
      }}
      className="space-y-6 p-6"
    >
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            商品名
          </label>
          <input
            type="text"
            name="name"
            id="name"
            defaultValue={product?.name}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brown-500 focus:ring-brown-500 sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="categoryId"
            className="block text-sm font-medium text-gray-700"
          >
            カテゴリ
          </label>
          <select
            id="categoryId"
            name="categoryId"
            defaultValue={product?.categoryId}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brown-500 focus:ring-brown-500 sm:text-sm"
          >
            <option value="">カテゴリを選択</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700"
          >
            価格
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">¥</span>
            </div>
            <input
              type="number"
              name="price"
              id="price"
              defaultValue={product?.price}
              required
              min="0"
              className="mt-1 block w-full pl-7 rounded-md border-gray-300 shadow-sm focus:border-brown-500 focus:ring-brown-500 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="stock"
            className="block text-sm font-medium text-gray-700"
          >
            在庫数
          </label>
          <input
            type="number"
            name="stock"
            id="stock"
            defaultValue={product?.stock}
            required
            min="0"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brown-500 focus:ring-brown-500 sm:text-sm"
          />
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="imageUrl"
            className="block text-sm font-medium text-gray-700"
          >
            商品画像URL
          </label>
          <input
            type="url"
            name="imageUrl"
            id="imageUrl"
            defaultValue={product?.imageUrl || ''}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brown-500 focus:ring-brown-500 sm:text-sm"
          />
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            商品説明
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            defaultValue={product?.description || ''}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brown-500 focus:ring-brown-500 sm:text-sm"
          />
        </div>

        <div className="sm:col-span-2">
          <div className="flex items-center">
            <input
              id="isAvailable"
              name="isAvailable"
              type="checkbox"
              defaultChecked={product?.isAvailable ?? true}
              value="true"
              className="h-4 w-4 text-brown-600 focus:ring-brown-500 border-gray-300 rounded"
            />
            <label
              htmlFor="isAvailable"
              className="ml-2 block text-sm text-gray-700"
            >
              この商品を販売可能にする
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-brown-600 hover:bg-brown-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brown-500"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  )
} 