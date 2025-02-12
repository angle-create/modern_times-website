# 注文API仕様

## 概要
注文の作成、取得、更新、キャンセルなどの機能を提供するAPIエンドポイントです。
注文管理や在庫管理と連携して動作します。

## 認証要件
- GET（一覧・詳細）：管理者認証必要
- POST：認証必要（一般ユーザー可）
- PUT：管理者認証必要
- DELETE：管理者認証必要

## エンドポイント一覧

### 注文一覧の取得
```
GET /api/orders
```

#### クエリパラメータ
- `status`: 注文ステータス（任意）
- `page`: ページ番号（デフォルト: 1）
- `limit`: 1ページあたりの件数（デフォルト: 10、最大: 50）
- `sort`: ソート順（created_at_desc, total_amount_desc）
- `startDate`: 開始日（YYYY-MM-DD形式）
- `endDate`: 終了日（YYYY-MM-DD形式）

#### レスポンス
```json
{
  "orders": [
    {
      "id": 1,
      "userId": 1,
      "status": "pending",
      "totalAmount": 0,
      "shippingAddress": {
        "name": "string",
        "postalCode": "string",
        "address": "string",
        "phone": "string"
      },
      "items": [
        {
          "id": 1,
          "productId": 1,
          "name": "string",
          "price": 0,
          "quantity": 0
        }
      ],
      "createdAt": "string",
      "updatedAt": "string"
    }
  ],
  "pagination": {
    "total": 0,
    "page": 1,
    "limit": 10,
    "totalPages": 0
  }
}
```

### 注文詳細の取得
```
GET /api/orders/{id}
```

#### パスパラメータ
- `id`: 注文ID（必須）

#### レスポンス
```json
{
  "id": 1,
  "userId": 1,
  "status": "pending",
  "totalAmount": 0,
  "shippingAddress": {
    "name": "string",
    "postalCode": "string",
    "address": "string",
    "phone": "string"
  },
  "items": [
    {
      "id": 1,
      "productId": 1,
      "name": "string",
      "price": 0,
      "quantity": 0
    }
  ],
  "createdAt": "string",
  "updatedAt": "string"
}
```

### 注文の作成
```
POST /api/orders
```

#### リクエストボディ
```json
{
  "items": [
    {
      "productId": 1,
      "quantity": 1
    }
  ],
  "shippingAddress": {
    "name": "string",
    "postalCode": "string",
    "address": "string",
    "phone": "string"
  }
}
```

#### バリデーション
- `items`: 必須、配列（最低1つのアイテム）
  - `productId`: 必須、整数
  - `quantity`: 必須、1以上の整数
- `shippingAddress`: 必須
  - `name`: 必須、1-100文字
  - `postalCode`: 必須、郵便番号形式
  - `address`: 必須、1-200文字
  - `phone`: 必須、電話番号形式

#### レスポンス
```json
{
  "id": 1,
  "userId": 1,
  "status": "pending",
  "totalAmount": 0,
  "shippingAddress": {
    "name": "string",
    "postalCode": "string",
    "address": "string",
    "phone": "string"
  },
  "items": [
    {
      "id": 1,
      "productId": 1,
      "name": "string",
      "price": 0,
      "quantity": 0
    }
  ],
  "createdAt": "string",
  "updatedAt": "string"
}
```

### 注文ステータスの更新
```
PUT /api/orders/{id}
```

#### パスパラメータ
- `id`: 注文ID（必須）

#### リクエストボディ
```json
{
  "status": "confirmed" | "preparing" | "shipped" | "completed" | "cancelled"
}
```

#### バリデーション
- `status`: 必須、指定された値のいずれか

#### レスポンス
```json
{
  "id": 1,
  "status": "string",
  "updatedAt": "string"
}
```

### 注文のキャンセル
```
DELETE /api/orders/{id}
```

#### パスパラメータ
- `id`: 注文ID（必須）

#### レスポンス
- 成功時: 204 No Content
- 失敗時: エラーレスポンス

## 注文ステータス

### ステータスの種類
- `pending`: 注文受付
- `confirmed`: 注文確認済み
- `preparing`: 準備中
- `shipped`: 発送済み
- `completed`: 完了
- `cancelled`: キャンセル

### ステータスの遷移
1. pending → confirmed
2. confirmed → preparing
3. preparing → shipped
4. shipped → completed
※ キャンセルは pending, confirmed の状態でのみ可能

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
  "message": "注文が見つかりません"
}
```

## 実装例

### 注文の作成
```typescript
const response = await fetch('/api/orders', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    items: [
      {
        productId: 1,
        quantity: 2,
      },
    ],
    shippingAddress: {
      name: '山田太郎',
      postalCode: '123-4567',
      address: '東京都渋谷区...',
      phone: '03-1234-5678',
    },
  }),
})
const data = await response.json()
```

### 注文ステータスの更新
```typescript
const response = await fetch('/api/orders/1', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    status: 'confirmed',
  }),
})
const data = await response.json()
```

## 注意事項
1. 在庫数の確認と更新は自動的に行われる
2. キャンセル時は在庫が自動的に戻される
3. 注文作成時は在庫数が確保される
4. 同時実行制御により在庫の整合性を保証

## Rate Limiting
- 認証なし: 60リクエスト/分
- 認証あり: 1000リクエスト/分

## サポート
APIに関する技術的な質問は、開発チームまでお問い合わせください。 