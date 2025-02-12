type PaginationProps = {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <nav className="flex justify-center" aria-label="ページネーション">
      <ul className="flex items-center gap-2">
        <li>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brown-50"
            aria-label="前のページ"
          >
            ←
          </button>
        </li>
        {pages.map((page) => (
          <li key={page}>
            <button
              onClick={() => onPageChange(page)}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                currentPage === page
                  ? 'bg-brown-600 text-white'
                  : 'text-gray-700 hover:bg-brown-50'
              }`}
            >
              {page}
            </button>
          </li>
        ))}
        <li>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brown-50"
            aria-label="次のページ"
          >
            →
          </button>
        </li>
      </ul>
    </nav>
  )
} 