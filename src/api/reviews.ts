import apiClient from './client';

export interface Review {
  id: number;
  productId: number;
  userId: number;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface CreateReviewDto {
  productId: number;
  rating: number;
  comment?: string;
}

export const reviewsApi = {
  getByProduct: async (productId: number): Promise<Review[]> => {
    const { data } = await apiClient.get<Review[]>(`/review?productId=${productId}`);
    return data;
  },

  create: async (dto: CreateReviewDto): Promise<Review> => {
    const { data } = await apiClient.post<Review>('/review', dto);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/review/${id}`);
  },
};
