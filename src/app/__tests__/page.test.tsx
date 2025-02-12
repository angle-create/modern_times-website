import { render, screen } from '@testing-library/react'
import Home from '../page'

describe('Home', () => {
  it('メインコンテンツが表示されること', () => {
    render(<Home />)
    
    // ヘッダーテキストが表示されることを確認
    expect(screen.getByRole('heading', { name: /Modern Times/i })).toBeInTheDocument()
    
    // メインビジュアルが表示されることを確認
    expect(screen.getByRole('img', { name: /main visual/i })).toBeInTheDocument()
    
    // 新着商品セクションが表示されることを確認
    expect(screen.getByText(/新着商品/i)).toBeInTheDocument()
  })

  it('商品一覧へのリンクが機能すること', () => {
    render(<Home />)
    
    const productLink = screen.getByRole('link', { name: /商品一覧へ/i })
    expect(productLink).toBeInTheDocument()
    expect(productLink).toHaveAttribute('href', '/products')
  })

  it('お知らせセクションが表示されること', () => {
    render(<Home />)
    
    expect(screen.getByText(/お知らせ/i)).toBeInTheDocument()
    // お知らせ一覧へのリンクを確認
    const newsLink = screen.getByRole('link', { name: /お知らせ一覧へ/i })
    expect(newsLink).toBeInTheDocument()
    expect(newsLink).toHaveAttribute('href', '/news')
  })
}) 