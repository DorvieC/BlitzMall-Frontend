import apiClient from './client';
import type { Product } from '../types';

export const productsApi = {
  getAll: async (): Promise<Product[]> => {
    const { data } = await apiClient.get<Product[]>('/product');
    return data;
  },

  getById: async (id: number): Promise<Product> => {
    const { data } = await apiClient.get<Product>(`/product/${id}`);
    return data;
  },

  create: async (dto: Omit<Product, 'id'>): Promise<Product> => {
    const { data } = await apiClient.post<Product>('/product', dto);
    return data;
  },

  update: async (id: number, dto: Partial<Product>): Promise<Product> => {
    const { data } = await apiClient.put<Product>(`/product/${id}`, dto);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/product/${id}`);
  },
};
