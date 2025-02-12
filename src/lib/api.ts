// APIクライアントの実装
import { Product } from '@/types/product';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export async function getProducts() {
  const response = await fetch(`${API_BASE_URL}/products`);
  if (!response.ok) {
    throw new Error('商品の取得に失敗しました');
  }
  return response.json();
}

export async function getProduct(id: string) {
  const response = await fetch(`${API_BASE_URL}/products/${id}`);
  if (!response.ok) {
    throw new Error('商品の取得に失敗しました');
  }
  return response.json();
}

export async function getCartItems() {
  const response = await fetch(`${API_BASE_URL}/cart`);
  if (!response.ok) {
    throw new Error('カート情報の取得に失敗しました');
  }
  return response.json();
}

export async function updateCartItem(productId: string, quantity: number) {
  const response = await fetch(`${API_BASE_URL}/cart`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ productId, quantity }),
  });
  if (!response.ok) {
    throw new Error('カートの更新に失敗しました');
  }
  return response.json();
}

export async function removeCartItem(productId: string) {
  const response = await fetch(`${API_BASE_URL}/cart`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ productId }),
  });
  if (!response.ok) {
    throw new Error('カートからの削除に失敗しました');
  }
  return response.json();
}

export async function getOrder(orderId: string) {
  const response = await fetch(`${API_BASE_URL}/orders/${orderId}`);
  if (!response.ok) {
    throw new Error('注文情報の取得に失敗しました');
  }
  return response.json();
}

export async function createOrder(orderData: any) {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderData),
  });
  if (!response.ok) {
    throw new Error('注文の作成に失敗しました');
  }
  return response.json();
}

export async function getUser() {
  const response = await fetch(`${API_BASE_URL}/user`);
  if (!response.ok) {
    throw new Error('ユーザー情報の取得に失敗しました');
  }
  return response.json();
}

export async function addToCart(productId: string, quantity: number) {
  const response = await fetch(`${API_BASE_URL}/cart`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ productId, quantity }),
  });
  if (!response.ok) {
    throw new Error('カートへの追加に失敗しました');
  }
  return response.json();
} 