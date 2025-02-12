// テストで使用するグローバルなマッチャーを追加
import '@testing-library/jest-dom';

// テスト実行前のモック設定
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      query: '',
      asPath: '',
      push: jest.fn(),
      replace: jest.fn(),
    };
  },
}));

// フェッチのモック
global.fetch = jest.fn();

// 環境変数の設定
process.env = {
  ...process.env,
  NEXT_PUBLIC_API_URL: 'http://localhost:3000/api',
}; 