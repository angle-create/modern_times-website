# Modern Times ウェブサイト リニューアル設計書

## 1. デザインコンセプト
- **配色**: 温かみのある配色（ベージュ、ブラウン、クリーム色をベースに）
- **タイポグラフィ**: 読みやすさを重視
- **ナビゲーション**: シンプルで直感的
- **ビジュアル**: 手作りの雰囲気を大切にした写真とイラストの使用

## 2. サイト構成
- **トップページ**
  - ヒーローセクション（店舗の雰囲気写真）
  - お知らせ
  - おすすめ商品
- **メニュー**
  - ケーキ
  - 焼き菓子
  - ドリンク
- **店舗情報**
  - アクセス
  - 営業時間
  - 駐車場情報
- **お問い合わせ**

## 3. 技術スタック
- **フロントエンド**: Next.js
- **スタイリング**: Tailwind CSS
- **アニメーション**: Framer Motion
- **CMS**: Contentful
- **ホスティング**: Vercel
- **バックエンド**: 
  - **API**: Next.js API Routes
  - **データベース**: PostgreSQL
  - **ORM**: Prisma
  - **認証**: NextAuth.js
  - **画像ストレージ**: Cloudinary

## 4. 改善ポイント
- ナビゲーションの簡素化
- メニューの階層構造をフラット化
- モバイルでの操作性向上
- 視覚的な改善
  - 商品写真の大きさを統一
  - 余白の適切な活用
  - フォントサイズの最適化
- コンテンツの整理
  - 重要な情報を優先的に表示
  - 不要な装飾を削除
  - 文章の簡潔化
- パフォーマンス最適化
  - 画像の最適化
  - ページ読み込み速度の向上
  - モバイルファーストの設計

## 5. 実装計画
- **フェーズ1（2週間）**
  - プロジェクトセットアップ
  - コンポーネント設計
  - ベースレイアウト作成
- **フェーズ2（2週間）**
  - 各ページの実装
  - コンテンツ移行
  - レスポンシブ対応
- **フェーズ3（1週間）**
  - テスト
  - パフォーマンス最適化
  - コンテンツ調整

## 6. バックエンド設計

### 6.1 データベース設計
```sql
-- 商品カテゴリ
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 商品
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  category_id INTEGER REFERENCES categories(id),
  name VARCHAR(200) NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  image_url VARCHAR(500),
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- お知らせ
CREATE TABLE news (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  image_url VARCHAR(500),
  published_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 店舗情報
CREATE TABLE store_info (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  address TEXT NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(100),
  business_hours TEXT,
  parking_info TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- お問い合わせ
CREATE TABLE inquiries (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  subject VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 6.2 API エンドポイント
```
/api
├── products
│   ├── GET /api/products - 商品一覧取得
│   ├── GET /api/products/:id - 商品詳細取得
│   └── GET /api/products/category/:slug - カテゴリ別商品取得
├── news
│   ├── GET /api/news - お知らせ一覧取得
│   └── GET /api/news/:id - お知らせ詳細取得
├── store
│   └── GET /api/store - 店舗情報取得
└── contact
    └── POST /api/contact - お問い合わせ送信
```

### 6.3 セキュリティ対策
- CORS設定
- Rate Limiting
- API認証（管理画面用）
- XSS対策
- CSRF対策
- 入力値バリデーション

### 6.4 パフォーマンス最適化
- キャッシュ戦略
- 画像最適化
- データベースインデックス
- クエリ最適化