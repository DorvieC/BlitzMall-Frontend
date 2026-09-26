import apiClient from './client';

export interface CreateOrderDto {
  deliveryAddress: string;
  phone: string;
  comment?: string;
  paymentMethod?: string;
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
  paymentMethod?: string;
  createdDate?: string;
  items: OrderItemDto[];
}

export const ordersApi = {
  create: async (dto: CreateOrderDto): Promise<OrderDto> => {
    const { data } = await apiClient.post<OrderDto>('/order', dto);
    return data;
  },

  getMyOrders: async (): Promise<OrderDto[]> => {
    const { data } = await apiClient.get<OrderDto[]>('/order/my');
    return data;
  },
};
