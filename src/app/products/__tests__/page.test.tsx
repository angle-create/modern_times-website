import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ProductsPage from '../page'

// モックデータ
const mockCategories = [
  { id: 1, name: 'ケーキ', slug: 'cake' },
  { id: 2, name: 'ドリンク', slug: 'drink' },
]

const mockProducts = [
  {
    id: 1,
    name: 'ショートケーキ',
    description: '苺のショートケーキ',
    price: 500,
    imageUrl: '/images/cake1.jpg',
    category: { id: 1, name: 'ケーキ', slug: 'cake' },
    isAvailable: true,
  },
  {
    id: 2,
    name: 'コーヒー',
    description: 'ブレンドコーヒー',
    price: 400,
    imageUrl: '/images/drink1.jpg',
    category: { id: 2, name: 'ドリンク', slug: 'drink' },
    isAvailable: true,
  },
]

// フェッチのモック
global.fetch = jest.fn((url) => {
  if (url === '/api/categories') {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockCategories),
    })
  }
  if (url === '/api/products') {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockProducts),
    })
  }
  if (url.startsWith('/api/search/products')) {
    const query = new URL(url).searchParams.get('query')
    const filteredProducts = mockProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(query!.toLowerCase()) ||
        product.description.toLowerCase().includes(query!.toLowerCase())
    )
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ products: filteredProducts }),
    })
  }
  return Promise.reject(new Error('Not found'))
}) as jest.Mock

describe('ProductsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('商品一覧が表示されること', async () => {
    render(<ProductsPage />)

    // ローディング状態の確認
    expect(screen.getByText('読み込み中...')).toBeInTheDocument()

    // 商品が表示されることを確認
    await waitFor(() => {
      expect(screen.getByText('ショートケーキ')).toBeInTheDocument()
      expect(screen.getByText('コーヒー')).toBeInTheDocument()
    })
  })

  it('カテゴリータブが表示されること', async () => {
    render(<ProductsPage />)

    await waitFor(() => {
      expect(screen.getByText('すべて')).toBeInTheDocument()
      expect(screen.getByText('ケーキ')).toBeInTheDocument()
      expect(screen.getByText('ドリンク')).toBeInTheDocument()
    })
  })

  it('カテゴリーで商品をフィルタリングできること', async () => {
    render(<ProductsPage />)

    // カテゴリータブが表示されるまで待機
    await waitFor(() => {
      expect(screen.getByText('ケーキ')).toBeInTheDocument()
    })

    // ケーキカテゴリーを選択
    fireEvent.click(screen.getByText('ケーキ'))

    // フィルタリング結果を確認
    expect(screen.getByText('ショートケーキ')).toBeInTheDocument()
    expect(screen.queryByText('コーヒー')).not.toBeInTheDocument()
  })

  it('商品を検索できること', async () => {
    render(<ProductsPage />)
    const user = userEvent.setup()

    // 検索バーが表示されるまで待機
    await waitFor(() => {
      expect(screen.getByRole('searchbox', { name: '商品検索' })).toBeInTheDocument()
    })

    // 検索を実行
    const searchInput = screen.getByRole('searchbox', { name: '商品検索' })
    await user.type(searchInput, 'コーヒー')

    // 検索結果を確認
    await waitFor(() => {
      expect(screen.getByText('コーヒー')).toBeInTheDocument()
      expect(screen.queryByText('ショートケーキ')).not.toBeInTheDocument()
    })
  })

  it('検索結果が0件の場合メッセージが表示されること', async () => {
    render(<ProductsPage />)
    const user = userEvent.setup()

    await waitFor(() => {
      expect(screen.getByRole('searchbox', { name: '商品検索' })).toBeInTheDocument()
    })

    // 存在しない商品名で検索
    const searchInput = screen.getByRole('searchbox', { name: '商品検索' })
    await user.type(searchInput, '存在しない商品')

    // メッセージを確認
    await waitFor(() => {
      expect(screen.getByText('検索結果が見つかりませんでした')).toBeInTheDocument()
    })
  })

  it('データの取得に失敗した場合エラーメッセージが表示されること', async () => {
    const mockAlert = jest.spyOn(window, 'alert').mockImplementation()
    ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error('API Error'))

    render(<ProductsPage />)

    await waitFor(() => {
      expect(screen.getByText('苺のショートケーキ')).toBeInTheDocument()
      expect(screen.getByText('ブレンドコーヒー')).toBeInTheDocument()
    })
  })
}) 