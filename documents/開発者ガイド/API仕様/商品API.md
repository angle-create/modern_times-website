# 商品API仕様

## 概要
商品の取得、登録、更新、削除を行うためのAPIエンドポイントです。
商品情報の管理や在庫管理などの機能を提供します。

## 認証要件
- GET（一覧・詳細）：認証不要
- POST、PUT、DELETE：管理者認証必要
- 在庫管理API：管理者認証必要

## エンドポイント一覧

### 商品一覧の取得
```
GET /api/products
```

#### クエリパラメータ
- `category`: カテゴリーID（任意）
- `page`: ページ番号（デフォルト: 1）
- `limit`: 1ページあたりの件数（デフォルト: 12、最大: 50）
- `sort`: ソート順（created_at_desc, price_asc, price_desc）

#### レスポンス
```json
{
  "products": [
    {
      "id": 1,
      "categoryId": 1,
      "name": "string",
      "description": "string",
      "price": 0,
      "imageUrl": "string",
      "isAvailable": true,
      "stock": 0,
      "createdAt": "string",
      "updatedAt": "string",
      "category": {
        "id": 1,
        "name": "string",
        "slug": "string"
      }
    }
  ],
  "pagination": {
    "total": 0,
    "page": 1,
    "limit": 12,
    "totalPages": 0
  }
}
```

### 商品詳細の取得
```
GET /api/products/{id}
```

#### パスパラメータ
- `id`: 商品ID（必須）

#### レスポンス
```json
{
  "id": 1,
  "categoryId": 1,
  "name": "string",
  "description": "string",
  "price": 0,
  "imageUrl": "string",
  "isAvailable": true,
  "stock": 0,
  "createdAt": "string",
  "updatedAt": "string",
  "category": {
    "id": 1,
    "name": "string",
    "slug": "string"
  }
}
```

### 商品の登録
```
POST /api/products
```

#### リクエストボディ
```json
{
  "categoryId": 1,
  "name": "string",
  "description": "string",
  "price": 0,
  "imageUrl": "string",
  "isAvailable": true,
  "stock": 0
}
```

#### バリデーション
- `categoryId`: 必須、整数
- `name`: 必須、1-200文字
- `description`: 任意、最大1000文字
- `price`: 必須、0以上の整数
- `imageUrl`: 任意、有効なURL
- `isAvailable`: 任意、真偽値
- `stock`: 任意、0以上の整数

#### レスポンス
```json
{
  "id": 1,
  "categoryId": 1,
  "name": "string",
  "description": "string",
  "price": 0,
  "imageUrl": "string",
  "isAvailable": true,
  "stock": 0,
  "createdAt": "string",
  "updatedAt": "string"
}
```

### 商品の更新
```
PUT /api/products/{id}
```

#### パスパラメータ
- `id`: 商品ID（必須）

#### リクエストボディ
```json
{
  "categoryId": 1,
  "name": "string",
  "description": "string",
  "price": 0,
  "imageUrl": "string",
  "isAvailable": true,
  "stock": 0
}
```

#### バリデーション
新規登録時と同じ

#### レスポンス
```json
{
  "id": 1,
  "categoryId": 1,
  "name": "string",
  "description": "string",
  "price": 0,
  "imageUrl": "string",
  "isAvailable": true,
  "stock": 0,
  "createdAt": "string",
  "updatedAt": "string"
}
```

### 商品の削除
```
DELETE /api/products/{id}
```

#### パスパラメータ
- `id`: 商品ID（必須）

#### レスポンス
- 成功時: 204 No Content
- 失敗時: エラーレスポンス

### 在庫数の更新
```
PUT /api/products/{id}/stock
```

#### パスパラメータ
- `id`: 商品ID（必須）

#### リクエストボディ
```json
{
  "stock": 0,
  "operation": "set" | "add" | "subtract"
}
```

#### バリデーション
- `stock`: 必須、0以上の整数
- `operation`: 必須、"set"/"add"/"subtract"のいずれか

#### レスポンス
```json
{
  "id": 1,
  "stock": 0,
  "updatedAt": "string"
}
```

## エラーレスポンス

### バリデーションエラー
```json
{
  "error": "Validation Error",
  "details": [
    {
      "field": "string",
      "message": "string"
    }
  ]
}
```

### 認証エラー
```json
{
  "error": "Unauthorized",
  "message": "認証が必要です"
}
```

### 権限エラー
```json
{
  "error": "Forbidden",
  "message": "権限がありません"
}
```

### リソース未検出
```json
{
  "error": "Not Found",
  "message": "商品が見つかりません"
}
```

## 実装例

### 商品一覧の取得
```typescript
const response = await fetch('/api/products?category=1&page=1&limit=12')
const data = await response.json()
```

### 商品の登録
```typescript
const response = await fetch('/api/products', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    categoryId: 1,
    name: '商品名',
    price: 1000,
  }),
})
const data = await response.json()
```

## 注意事項
1. 画像アップロードは別APIを使用
2. 在庫数の更新は排他制御を実装
3. キャッシュの適切な管理が必要

## Rate Limiting
- 認証なし: 60リクエスト/分
- 認証あり: 1000リクエスト/分

## サポート
APIに関する技術的な質問は、開発チームまでお問い合わせください。 