# レビューAPI仕様書

## 概要
商品レビューの投稿、取得、承認、削除などの操作を行うためのAPIです。

## エンドポイント一覧

### 1. 商品別レビュー一覧取得
```
GET /api/products/{productId}/reviews
```

#### リクエストパラメータ
なし

#### レスポンス
```json
{
  "reviews": [
    {
      "id": 1,
      "rating": 5,
      "comment": "とても美味しかったです",
      "authorName": "山田太郎",
      "imageUrl": "https://example.com/image.jpg",
      "isApproved": true,
      "createdAt": "2024-02-20T10:00:00Z"
    }
  ],
  "stats": {
    "totalReviews": 10,
    "averageRating": 4.5,
    "ratingDistribution": {
      "1": 0,
      "2": 1,
      "3": 2,
      "4": 3,
      "5": 4
    }
  }
}
```

### 2. レビュー投稿
```
POST /api/products/{productId}/reviews
```

#### リクエストボディ
```json
{
  "rating": 5,
  "comment": "とても美味しかったです",
  "authorName": "山田太郎",
  "authorEmail": "yamada@example.com",
  "imageUrl": "https://example.com/image.jpg"
}
```

#### バリデーション
- rating: 1-5の整数
- comment: 1000文字以内の文字列
- authorName: 100文字以内の文字列
- authorEmail: 有効なメールアドレス形式
- imageUrl: 有効なURL形式（オプション）

#### レスポンス
```json
{
  "id": 1,
  "rating": 5,
  "comment": "とても美味しかったです",
  "authorName": "山田太郎",
  "imageUrl": "https://example.com/image.jpg",
  "isApproved": false,
  "createdAt": "2024-02-20T10:00:00Z"
}
```

### 3. レビュー詳細取得（管理者用）
```
GET /api/reviews/{reviewId}
```

#### 認証
- 管理者権限が必要

#### レスポンス
```json
{
  "id": 1,
  "rating": 5,
  "comment": "とても美味しかったです",
  "authorName": "山田太郎",
  "authorEmail": "yamada@example.com",
  "imageUrl": "https://example.com/image.jpg",
  "isApproved": false,
  "createdAt": "2024-02-20T10:00:00Z",
  "product": {
    "id": 1,
    "name": "ストロベリーショートケーキ"
  }
}
```

### 4. レビュー承認状態更新（管理者用）
```
PUT /api/reviews/{reviewId}
```

#### 認証
- 管理者権限が必要

#### リクエストボディ
```json
{
  "isApproved": true
}
```

#### レスポンス
```json
{
  "id": 1,
  "isApproved": true,
  "updatedAt": "2024-02-20T10:30:00Z"
}
```

### 5. レビュー削除（管理者用）
```
DELETE /api/reviews/{reviewId}
```

#### 認証
- 管理者権限が必要

#### レスポンス
- 204 No Content

### 6. 未承認レビュー一覧取得（管理者用）
```
GET /api/reviews/pending
```

#### 認証
- 管理者権限が必要

#### クエリパラメータ
- page: ページ番号（デフォルト: 1）
- limit: 1ページあたりの表示件数（デフォルト: 10）

#### レスポンス
```json
{
  "reviews": [
    {
      "id": 1,
      "rating": 5,
      "comment": "とても美味しかったです",
      "authorName": "山田太郎",
      "imageUrl": "https://example.com/image.jpg",
      "isApproved": false,
      "createdAt": "2024-02-20T10:00:00Z",
      "product": {
        "id": 1,
        "name": "ストロベリーショートケーキ"
      }
    }
  ],
  "pagination": {
    "total": 20,
    "page": 1,
    "limit": 10,
    "totalPages": 2
  }
}
```

## エラーレスポンス

### 400 Bad Request
```json
{
  "error": "バリデーションエラー",
  "details": [
    {
      "field": "rating",
      "message": "評価は1から5の間で入力してください"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "error": "認証が必要です"
}
```

### 403 Forbidden
```json
{
  "error": "この操作を行う権限がありません"
}
```

### 404 Not Found
```json
{
  "error": "指定されたレビューが見つかりません"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error"
}
```

## 認証
- 管理者用APIは、NextAuth.jsによる認証が必要です
- セッションのroleが'admin'である必要があります

## レート制限
- 未認証ユーザー: 1分あたり60リクエスト
- 認証済みユーザー: 1分あたり120リクエスト

## 注意事項
1. レビュー投稿時の画像
   - 画像のアップロードは別途画像アップロードAPIを使用
   - アップロード後に取得したURLをimageUrlとして使用

2. レビューの承認
   - 承認されたレビューのみが一般ユーザーに公開
   - 承認状態の変更は管理者のみ可能

3. データの永続性
   - レビューの削除は物理削除
   - 削除されたレビューは復元不可 