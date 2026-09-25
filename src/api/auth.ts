import apiClient from './client';
import type { AuthResponse, LoginDto, RegisterDto, User } from '../types';

function buildUser(res: AuthResponse): User {
  return {
    name: res.name,
    email: res.email,
    role: res.role,
  };
}

export const authApi = {
  login: async (dto: LoginDto): Promise<{ token: string; user: User }> => {
    const { data } = await apiClient.post<AuthResponse>('/auth/login', dto);
    return { token: data.token, user: buildUser(data) };
  },

  register: async (dto: RegisterDto): Promise<{ token: string; user: User }> => {
    const { data } = await apiClient.post<AuthResponse>('/auth/register', dto);
    return { token: data.token, user: buildUser(data) };
  },

  firebaseLogin: async (idToken: string): Promise<{ token: string; user: User }> => {
    const { data } = await apiClient.post<AuthResponse>('/auth/firebase-login', { idToken });
    return { token: data.token, user: buildUser(data) };
  },
};
