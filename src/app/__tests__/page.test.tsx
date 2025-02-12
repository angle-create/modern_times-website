import { render, screen } from '@testing-library/react'
import Home from '../page'

describe('Home', () => {
  it('メインコンテンツが表示されること', () => {
    render(<Home />)
    
    // メインビジュアルが表示されることを確認
    expect(screen.getByRole('img', { name: 'Modern Times店内' })).toBeInTheDocument()
    
    // おすすめ商品セクションが表示されることを確認
    expect(screen.getByRole('heading', { name: 'おすすめ商品' })).toBeInTheDocument()
  })

  it('メニューページへのリンクが機能すること', () => {
    render(<Home />)
    
    const menuLink = screen.getByRole('link', { name: 'メニューを見る' })
    expect(menuLink).toBeInTheDocument()
    expect(menuLink).toHaveAttribute('href', '/menu')
  })

  it('お知らせセクションが表示されること', () => {
    render(<Home />)
    
    expect(screen.getByRole('heading', { name: 'お知らせ' })).toBeInTheDocument()
    // お知らせ一覧へのリンクを確認
    const newsLink = screen.getByRole('link', { name: 'お知らせ一覧を見る' })
    expect(newsLink).toBeInTheDocument()
    expect(newsLink).toHaveAttribute('href', '/news')
  })
}) 