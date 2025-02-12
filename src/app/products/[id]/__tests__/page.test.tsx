import { render, screen, fireEvent } from '@testing-library/react'
import ProductDetail from '../page'
import { useRouter } from 'next/navigation'

// モックデータ
const mockProduct = {
  id: '1',
  name: 'テスト商品1',
  price: 1000,
  description: '商品の詳細な説明です。',
  imageUrl: '/images/test1.jpg',
  stock: 5,
}

// APIレスポンスのモック
jest.mock('@/lib/api', () => ({
  getProduct: jest.fn(() => Promise.resolve(mockProduct)),
  addToCart: jest.fn(() => Promise.resolve({ success: true })),
}))

// ルーターのモック
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

describe('ProductDetail', () => {
  beforeEach(() => {
    // ルーターのモックをリセット
    (useRouter as jest.Mock).mockImplementation(() => ({
      push: jest.fn(),
    }))
  })

  it('商品詳細が表示されること', async () => {
    render(<ProductDetail params={{ id: '1' }} />)
    
    // 商品情報が表示されることを確認
    expect(await screen.findByText('テスト商品1')).toBeInTheDocument()
    expect(screen.getByText('1,000円')).toBeInTheDocument()
    expect(screen.getByText('商品の詳細な説明です。')).toBeInTheDocument()
    expect(screen.getByText('在庫: 5個')).toBeInTheDocument()
  })

  it('カートに追加できること', async () => {
    render(<ProductDetail params={{ id: '1' }} />)
    
    // 数量を選択
    const quantityInput = screen.getByRole('spinbutton')
    fireEvent.change(quantityInput, { target: { value: '2' } })
    
    // カートに追加ボタンをクリック
    const addToCartButton = screen.getByRole('button', { name: /カートに追加/i })
    fireEvent.click(addToCartButton)
    
    // 成功メッセージが表示されることを確認
    expect(await screen.findByText(/カートに追加しました/i)).toBeInTheDocument()
  })

  it('在庫以上の数量を選択できないこと', async () => {
    render(<ProductDetail params={{ id: '1' }} />)
    
    // 在庫以上の数量を入力
    const quantityInput = screen.getByRole('spinbutton')
    fireEvent.change(quantityInput, { target: { value: '6' } })
    
    // エラーメッセージが表示されることを確認
    expect(screen.getByText(/在庫が不足しています/i)).toBeInTheDocument()
    
    // カートに追加ボタンが無効化されていることを確認
    const addToCartButton = screen.getByRole('button', { name: /カートに追加/i })
    expect(addToCartButton).toBeDisabled()
  })
}) 