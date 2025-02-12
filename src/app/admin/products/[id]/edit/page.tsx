import { prisma } from '@/lib/prisma'
import { ProductForm } from '../../product-form'
import { redirect } from 'next/navigation'
import { notFound } from 'next/navigation'

interface Props {
  params: {
    id: string
  }
}

export default async function EditProductPage({ params }: Props) {
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: {
        id: parseInt(params.id),
      },
    }),
    prisma.category.findMany({
      orderBy: {
        name: 'asc',
      },
    }),
  ])

  if (!product) {
    notFound()
  }

  async function updateProduct(formData: FormData) {
    'use server'

    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const price = parseInt(formData.get('price') as string)
    const categoryId = parseInt(formData.get('categoryId') as string)
    const stock = parseInt(formData.get('stock') as string)
    const imageUrl = formData.get('imageUrl') as string
    const isAvailable = formData.get('isAvailable') === 'true'

    await prisma.product.update({
      where: {
        id: product.id,
      },
      data: {
        name,
        description,
        price,
        categoryId,
        stock,
        imageUrl,
        isAvailable,
      },
    })

    redirect('/admin/products')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">商品を編集</h1>
      </div>

      <div className="bg-white shadow rounded-lg">
        <ProductForm
          categories={categories}
          product={product}
          action={updateProduct}
          submitLabel="変更を保存"
        />
      </div>
    </div>
  )
} 