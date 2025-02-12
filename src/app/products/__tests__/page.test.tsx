import { render, screen, fireEvent } from '@testing-library/react'
import ProductList from '../page'

// モックデータ
const mockProducts = [
  {
    id: '1',
    name: 'テスト商品1',
    price: 1000,
    description: 'テスト商品1の説明',
    imageUrl: '/images/test1.jpg',
  },
  {
    id: '2',
    name: 'テスト商品2',
    price: 2000,
    description: 'テスト商品2の説明',
    imageUrl: '/images/test2.jpg',
  },
]

// APIレスポンスのモック
jest.mock('@/lib/api', () => ({
  getProducts: jest.fn(() => Promise.resolve(mockProducts)),
}))

describe('ProductList', () => {
  it('商品一覧が表示されること', async () => {
    render(<ProductList />)
    
    // ローディング状態の確認
    expect(screen.getByText(/読み込み中/i)).toBeInTheDocument()
    
    // 商品が表示されることを確認
    const products = await screen.findAllByRole('article')
    expect(products).toHaveLength(2)
    
    // 商品の詳細が正しく表示されることを確認
    expect(screen.getByText('テスト商品1')).toBeInTheDocument()
    expect(screen.getByText('1,000円')).toBeInTheDocument()
  })

  it('商品検索が機能すること', async () => {
    render(<ProductList />)
    
    // 検索フィールドに入力
    const searchInput = screen.getByRole('searchbox')
    fireEvent.change(searchInput, { target: { value: 'テスト商品1' } })
    
    // 検索結果が表示されることを確認
    const products = await screen.findAllByRole('article')
    expect(products).toHaveLength(1)
    expect(screen.getByText('テスト商品1')).toBeInTheDocument()
    expect(screen.queryByText('テスト商品2')).not.toBeInTheDocument()
  })

  it('商品のソートが機能すること', async () => {
    render(<ProductList />)
    
    // ソートセレクトを変更
    const sortSelect = screen.getByRole('combobox')
    fireEvent.change(sortSelect, { target: { value: 'price-desc' } })
    
    // ソート結果が表示されることを確認
    const products = await screen.findAllByRole('article')
    const prices = products.map(product => 
      product.textContent?.match(/\d+,\d+円/)?.[0]
    )
    expect(prices).toEqual(['2,000円', '1,000円'])
  })
}) 