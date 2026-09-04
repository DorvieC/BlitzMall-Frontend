export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  roleId: number;
  roleName?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
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
  rating?: number;
  reviewCount?: number;
  brandId?: number;
  brandName?: string;
  categoryId?: number;
  categoryName?: string;
  sellerId?: number;
  badge?: string;
}

export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  productImageUrl?: string;
  quantity: number;
  unitPrice: number;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}
