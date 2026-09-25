export interface User {
  id?: number;
  name: string;
  email: string;
  role: string;
  phone?: string;
  status?: string;
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  name: string;
  role: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  oldPrice?: number;
  imageUrl?: string;
  imgUrls?: string[];
  rating?: number;
  reviewCount?: number;
  brandId?: number;
  brandName?: string;
  categoryId?: number;
  categoryName?: string;
  sellerId?: number;
  sellerName?: string;
  quantity?: number;
  badge?: string;
  isActive?: boolean;
}

export interface CartItem {
  id: number;
  cartId: number;
  productId: number;
  quantity: number;
  unitPrice: number;
}

export interface Review {
  id: number;
  productId: number;
  userId: number;
  rating: number;
  text?: string;
  createdDate?: string;
  updatedDate?: string;
}

export interface CreateReviewDto {
  productId: number;
  rating: number;
  text?: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

export interface OrderItemDto {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface OrderDto {
  id: number;
  orderStatus: string;
  totalAmount: number;
  deliveryAddress: string;
  phone: string;
  comment?: string;
  createdDate?: string;
  items: OrderItemDto[];
}

export interface Category {
  id: number;
  name: string;
  parentId?: number;
}

export interface Cart {
  id: number;
  userId: number;
  items: CartItem[];
}

