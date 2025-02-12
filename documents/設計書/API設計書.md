# Modern Times ウェブサイト API設計書

## 1. 概要

### 1.1 基本情報
- ベースURL: `https://api.modern-times.com`
- APIバージョン: v1
- レスポンス形式: JSON
- 文字エンコーディング: UTF-8

### 1.2 認証
- JWT認証
- トークンの有効期限: 24時間
- リフレッシュトークンの有効期限: 30日

### 1.3 共通レスポンス形式
#### 成功時
```json
{
  "status": "success",
  "data": {
    // レスポンスデータ
  }
}
```

#### エラー時
```json
{
  "status": "error",
  "error": {
    "code": "ERROR_CODE",
    "message": "エラーメッセージ"
  }
}
```

## 2. エンドポイント一覧

### 2.1 認証API
#### ログイン
- エンドポイント: `POST /api/auth/login`
- 説明: ユーザー認証を行い、JWTトークンを発行
- リクエスト:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- レスポンス:
  ```json
  {
    "status": "success",
    "data": {
      "token": "string",
      "refreshToken": "string",
      "user": {
        "id": "string",
        "email": "string",
        "name": "string",
        "role": "string"
      }
    }
  }
  ```

### 2.2 商品API
#### 商品一覧取得
- エンドポイント: `GET /api/products`
- 説明: 商品一覧を取得
- クエリパラメータ:
  - `category`: カテゴリーID
  - `search`: 検索キーワード
  - `sort`: ソート順（price-asc, price-desc, etc.）
  - `page`: ページ番号
  - `limit`: 1ページあたりの件数
- レスポンス:
  ```json
  {
    "status": "success",
    "data": {
      "products": [
        {
          "id": "string",
          "name": "string",
          "price": "number",
          "description": "string",
          "imageUrl": "string",
          "stock": "number",
          "isAvailable": "boolean"
        }
      ],
      "pagination": {
        "total": "number",
        "page": "number",
        "limit": "number",
        "totalPages": "number"
      }
    }
  }
  ```

#### 商品詳細取得
- エンドポイント: `GET /api/products/{id}`
- 説明: 指定したIDの商品詳細を取得
- パスパラメータ:
  - `id`: 商品ID
- レスポンス:
  ```json
  {
    "status": "success",
    "data": {
      "product": {
        "id": "string",
        "name": "string",
        "price": "number",
        "description": "string",
        "imageUrl": "string",
        "stock": "number",
        "isAvailable": "boolean",
        "category": {
          "id": "string",
          "name": "string"
        }
      }
    }
  }
  ```

### 2.3 カートAPI
#### カートアイテム追加
- エンドポイント: `POST /api/cart`
- 説明: カートに商品を追加
- リクエスト:
  ```json
  {
    "productId": "string",
    "quantity": "number"
  }
  ```
- レスポンス:
  ```json
  {
    "status": "success",
    "data": {
      "cartItem": {
        "id": "string",
        "productId": "string",
        "quantity": "number",
        "product": {
          "name": "string",
          "price": "number",
          "imageUrl": "string"
        }
      }
    }
  }
  ```

### 2.4 注文API
#### 注文作成
- エンドポイント: `POST /api/orders`
- 説明: 注文を作成
- リクエスト:
  ```json
  {
    "items": [
      {
        "productId": "string",
        "quantity": "number"
      }
    ],
    "shippingAddress": {
      "name": "string",
      "postalCode": "string",
      "prefecture": "string",
      "city": "string",
      "street": "string"
    },
    "paymentMethod": "string"
  }
  ```
- レスポンス:
  ```json
  {
    "status": "success",
    "data": {
      "order": {
        "id": "string",
        "totalAmount": "number",
        "status": "string",
        "items": [
          {
            "productId": "string",
            "quantity": "number",
            "price": "number"
          }
        ]
      }
    }
  }
  ```

## 3. エラーコード

### 3.1 共通エラー
- `INVALID_REQUEST`: リクエストが不正
- `UNAUTHORIZED`: 認証エラー
- `FORBIDDEN`: 権限エラー
- `NOT_FOUND`: リソースが見つからない
- `INTERNAL_ERROR`: サーバー内部エラー

### 3.2 業務エラー
- `PRODUCT_OUT_OF_STOCK`: 商品在庫不足
- `INVALID_PAYMENT_METHOD`: 無効な支払い方法
- `ORDER_ALREADY_PROCESSED`: 注文済み
- `CART_ITEM_NOT_FOUND`: カートアイテムが見つからない

## 4. レート制限
- 認証なし: 60リクエスト/分
- 認証あり: 1000リクエスト/分
- 管理者: 3000リクエスト/分

## 5. セキュリティ

### 5.1 認証ヘッダー
```
Authorization: Bearer {token}
```

### 5.2 CORS設定
- 許可オリジン: `https://modern-times.com`
- 許可メソッド: GET, POST, PUT, DELETE
- 許可ヘッダー: Content-Type, Authorization

### 5.3 APIキー
- 開発環境: `dev_api_key`
- ステージング環境: `stg_api_key`
- 本番環境: `prod_api_key` 