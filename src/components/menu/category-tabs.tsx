import { Category } from '@/types/product'

type CategoryTabsProps = {
  categories: Category[]
  activeCategory: string
  onCategoryChange: (categorySlug: string) => void
}

export function CategoryTabs({
  categories,
  activeCategory,
  onCategoryChange,
}: CategoryTabsProps) {
  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8" aria-label="カテゴリー">
        <button
          onClick={() => onCategoryChange('all')}
          className={`
            whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm
            ${
              activeCategory === 'all'
                ? 'border-brown-600 text-brown-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }
          `}
        >
          すべて
        </button>
        {categories.map((category) => (
          <button
            key={category.slug}
            onClick={() => onCategoryChange(category.slug)}
            className={`
              whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm
              ${
                activeCategory === category.slug
                  ? 'border-brown-600 text-brown-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            {category.name}
          </button>
        ))}
      </nav>
    </div>
  )
} 