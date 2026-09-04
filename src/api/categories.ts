import apiClient from './client';

export interface Category {
  id: number;
  name: string;
  description?: string;
  parentCategoryId?: number;
}

export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    const { data } = await apiClient.get<Category[]>('/category');
    return data;
  },

  getById: async (id: number): Promise<Category> => {
    const { data } = await apiClient.get<Category>(`/category/${id}`);
    return data;
  },
};
