import { render, screen } from '@testing-library/react'
import ProductPage from '../page'
import { getProduct } from '@/lib/api'

// モックデータ
const mockProduct = {
  id: '1',
  name: 'テスト商品',
  price: 1000,
  description: 'テスト商品の説明',
  imageUrl: '/images/test1.jpg',
}

// APIのモック
jest.mock('@/lib/api', () => ({
  getProduct: jest.fn(() => Promise.resolve(mockProduct)),
}))

describe('ProductPage', () => {
  it('商品の詳細が表示されること', async () => {
    render(await ProductPage({ params: { id: '1' } }))

    // 商品名が表示されることを確認
    expect(screen.getByRole('heading', { name: mockProduct.name })).toBeInTheDocument()
    
    // 商品画像が表示されることを確認
    expect(screen.getByRole('img', { name: mockProduct.name })).toBeInTheDocument()
    
    // 商品価格が表示されることを確認
    expect(screen.getByText(/1,000/)).toBeInTheDocument()
    
    // 商品説明が表示されることを確認
    expect(screen.getByText(mockProduct.description)).toBeInTheDocument()
  })

  it('APIから商品データを取得すること', async () => {
    await ProductPage({ params: { id: '1' } })
    expect(getProduct).toHaveBeenCalledWith('1')
  })
}) 