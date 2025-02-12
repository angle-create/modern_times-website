import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SearchBar } from '../search-bar'

describe('SearchBar', () => {
  const mockOnSearch = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('検索バーが正しくレンダリングされること', () => {
    render(<SearchBar onSearch={mockOnSearch} />)
    
    const searchInput = screen.getByRole('searchbox', { name: '商品検索' })
    expect(searchInput).toBeInTheDocument()
    expect(searchInput).toHaveAttribute('placeholder', '商品を検索...')
  })

  it('入力値が変更されると検索が実行されること', async () => {
    render(<SearchBar onSearch={mockOnSearch} />)
    const user = userEvent.setup()

    const searchInput = screen.getByRole('searchbox', { name: '商品検索' })
    await user.type(searchInput, 'テスト')

    // デバウンス時間を待つ
    await waitFor(
      () => {
        expect(mockOnSearch).toHaveBeenCalledWith('テスト')
      },
      { timeout: 1000 }
    )
  })

  it('デバウンスが機能すること', async () => {
    render(<SearchBar onSearch={mockOnSearch} />)
    const user = userEvent.setup()

    const searchInput = screen.getByRole('searchbox', { name: '商品検索' })
    await user.type(searchInput, 'テ')
    await user.type(searchInput, 'ス')
    await user.type(searchInput, 'ト')

    // デバウンス時間内の呼び出しはまだ実行されていないことを確認
    expect(mockOnSearch).not.toHaveBeenCalled()

    // デバウンス時間後に最終的な値で1回だけ呼び出されることを確認
    await waitFor(
      () => {
        expect(mockOnSearch).toHaveBeenCalledTimes(1)
        expect(mockOnSearch).toHaveBeenCalledWith('テスト')
      },
      { timeout: 1000 }
    )
  })

  it('入力がクリアされた場合に空文字で検索が実行されること', async () => {
    render(<SearchBar onSearch={mockOnSearch} />)
    const user = userEvent.setup()

    const searchInput = screen.getByRole('searchbox', { name: '商品検索' })
    await user.type(searchInput, 'テスト')
    await user.clear(searchInput)

    await waitFor(
      () => {
        expect(mockOnSearch).toHaveBeenCalledWith('')
      },
      { timeout: 1000 }
    )
  })
}) 