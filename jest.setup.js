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

// Next.js APIルートのテストに必要なグローバルオブジェクト
global.Request = class Request {
  constructor(input, init) {
    this.url = input;
    this.method = init?.method || 'GET';
    this.headers = new Headers(init?.headers);
    this.body = init?.body;
  }
};

global.Headers = class Headers {
  constructor(init) {
    this._headers = new Map();
    if (init) {
      Object.entries(init).forEach(([key, value]) => {
        this._headers.set(key.toLowerCase(), value);
      });
    }
  }
  get(name) {
    return this._headers.get(name.toLowerCase()) || null;
  }
  set(name, value) {
    this._headers.set(name.toLowerCase(), value);
  }
};

// 環境変数の設定
process.env = {
  ...process.env,
  NEXT_PUBLIC_API_URL: 'http://localhost:3000/api',
};

// グローバルオブジェクトのモック
global.Response = class Response {
  constructor(body, init) {
    this.body = body
    this.init = init
    this.status = init?.status || 200
    this.ok = this.status >= 200 && this.status < 300
    this.headers = new Headers(init?.headers)
  }

  async json() {
    return typeof this.body === 'string' ? JSON.parse(this.body) : this.body
  }
}

// next/navigationのモック
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
}))

// next-authのモック
jest.mock('next-auth', () => ({
  getServerSession: jest.fn(() => Promise.resolve({
    user: {
      id: '1',
      name: 'テストユーザー',
      email: 'test@example.com',
    }
  })),
})) 