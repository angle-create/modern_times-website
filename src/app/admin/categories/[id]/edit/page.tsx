import { prisma } from '@/lib/prisma'
import { CategoryForm } from '../../category-form'
import { updateCategory } from '../../actions'
import { notFound } from 'next/navigation'

interface Props {
  params: {
    id: string
  }
}

export default async function EditCategoryPage({ params }: Props) {
  const category = await prisma.category.findUnique({
    where: {
      id: parseInt(params.id),
    },
  })

  if (!category) {
    notFound()
  }

  async function handleUpdate(formData: FormData) {
    'use server'
    await updateCategory(category.id, formData)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">カテゴリを編集</h1>
      </div>

      <div className="bg-white shadow rounded-lg">
        <CategoryForm
          category={category}
          action={handleUpdate}
          submitLabel="変更を保存"
        />
      </div>
    </div>
  )
} 