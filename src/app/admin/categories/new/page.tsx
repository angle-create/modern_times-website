import { CategoryForm } from '../category-form'
import { createCategory } from '../actions'
import { redirect } from 'next/navigation'

export default function NewCategoryPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">カテゴリを追加</h1>
      </div>

      <div className="bg-white shadow rounded-lg">
        <CategoryForm
          action={createCategory}
          submitLabel="カテゴリを追加"
        />
      </div>
    </div>
  )
} 