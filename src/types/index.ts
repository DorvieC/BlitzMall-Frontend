export interface User {
  id: number;
  name?: string;
  status?: string;
  email: string;
  phone?: string;
  roleId: number;
  createdAt?: string;
  updatedAt?: string;
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
  rating?: number;
  reviewCount?: number;
  brandId?: number;
  brandName?: string;
  categoryId?: number;
  categoryName?: string;
  sellerId?: number;
  quantity?: number;
  badge?: string;
}

export interface CartItem {
  id: number;
  cartId: number;
  productId: number;
  quantity: number;
  unitPrice: number;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}
export interface CreateProductDto {
  name: string;
  description?: string;
  price: number;
  quantity: number;
  brandId: number;
  categoryId: number;
  imgUrls?: string[];
}
export interface BasketProps {
  cartItems?: CartItem[];
  products?: Product[]; 
  suggestions?: Product[]; 
  favoriteIds?: number[]; 
  bonuses?: number; 
  cashback?: number; 
  onQuantityChange?: (cartItemId: number, quantity: number) => void;
  onRemove?: (cartItemId: number) => void;
  onClear?: () => void;
  onToggleFavorite?: (productId: number) => void;
  onApplyPromo?: (code: string) => void;
  onAddToCart?: (productId: number) => void;
  onCheckout?: () => void;
}

export interface PaymentMethod {
  id: string;
  name: string;
  description: string; 
  requiresCard?: boolean;
}

export interface PaymentFormData {
  paymentMethodId: string;
  cardNumber?: string;
  cardExpiry?: string;
  cardCvv?: string;
}


export interface OrderItem {
  id: string;
  name: string;
  variant: string;
  qty: number;
  brand: string;
  price: number;
  image: string;
}

export interface CheckoutPaymentProps {
  items: OrderItem[];
  itemsCount?: number;
  goodsTotal?: number;
  deliveryPrice?: number;
  deliveryLabel?: string;
  cashback?: number;
  paymentMethods?: PaymentMethod[];
  onBack?: () => void;
  onSubmit?: (data: PaymentFormData) => void;
  onApplyPromo?: (code: string) => void;
}
export interface OrderItem {
  id: string;
  name: string;
  variant: string;
  qty: number;
  brand: string;
  price: number;
  image: string;
}

export interface PaymentNavState {
  paymentMethodId?: string;
  paymentMethodName?: string;
  items?: OrderItem[];
  itemsCount?: number;
  goodsTotal?: number;
  deliveryPrice?: number;
  deliveryLabel?: string;
  cashback?: number;
  total?: number;
}

export interface DeliveryMethod {
  id: string;
  name: string;
  eta: string; 
  price: number; 
}

export interface CheckoutFormData {
  firstName: string;
  lastName: string;
  phone: string;
  city: string;
  deliveryMethodId: string;
  address: string;
  comment: string;
}

export interface CheckoutDeliveryProps {
  itemsCount?: number;
  goodsTotal?: number;
  cashback?: number;
  deliveryMethods?: DeliveryMethod[];
  onSubmit?: (data: CheckoutFormData) => void;
  onApplyPromo?: (code: string) => void;
}
export interface DeliveryMethod {
  id: string;
  name: string;
  eta: string; // напр. "1-2 дні"
  price: number; // 0 = безкоштовно
}

export interface CheckoutFormData {
  firstName: string;
  lastName: string;
  phone: string;
  city: string;
  deliveryMethodId: string;
  address: string;
  comment: string;
}

export interface CheckoutDeliveryProps {
  itemsCount?: number;
  goodsTotal?: number;
  cashback?: number;
  deliveryMethods?: DeliveryMethod[];
  onSubmit?: (data: CheckoutFormData) => void;
  onApplyPromo?: (code: string) => void;
}