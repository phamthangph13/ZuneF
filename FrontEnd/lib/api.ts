const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// API Response types
interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

interface ApiError {
  message: string;
  status?: number;
}

// User types
interface User {
  _id: string;
  name: string;
  email: string;
  isVerified: boolean;
  role: string;
  createdAt: string;
}

// Account types
interface Account {
  _id: string;
  name: string;
  category: string[];
  price: number;
  Discount?: number;
  stock?: number;
  duration: '1_month' | '3_months' | '6_months' | '1_year';
  thumbnail?: string;
  imagepreview?: string[];
  videopreview?: string[];
  policy?: string[];
  description?: string[];
  createdAt: string;
  updatedAt: string;
}

// Category types
interface Category {
  _id: string;
  name: string;
  description?: string;
  slug: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

// Generic API call function
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders: Record<string, string> = {};

  // Only set Content-Type if not FormData (let browser set it for FormData)
  if (!(options.body instanceof FormData)) {
    defaultHeaders['Content-Type'] = 'application/json';
  }

  // Add authorization token if available
  const token = localStorage.getItem('token');
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}

// Authentication API
export const authApi = {
  register: async (name: string, email: string, password: string): Promise<ApiResponse> => {
    return apiCall('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  },

  login: async (email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> => {
    return apiCall('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  verify: async (token: string): Promise<ApiResponse> => {
    return apiCall(`/api/auth/verify?token=${token}`, {
      method: 'GET',
    });
  },

  forgetPassword: async (email: string): Promise<ApiResponse> => {
    return apiCall('/api/auth/forgetpassword', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  resetPassword: async (token: string, newPassword: string): Promise<ApiResponse> => {
    return apiCall('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    });
  },
};

// Account API
export const accountApi = {
  getAll: async (page?: number, limit?: number, search?: string, category?: string): Promise<ApiResponse<{ accounts?: Account[]; items?: Account[]; count?: number; pagination?: any; total?: number; totalPages?: number }>> => {
    let url = '/api/account/getall';
    const params = new URLSearchParams();
    
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    if (search) params.append('search', search);
    if (category && category !== 'all') params.append('category', category);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    return apiCall(url);
  },

  getById: async (id: string): Promise<ApiResponse<Account>> => {
    return apiCall(`/api/account/get/${id}`);
  },

  create: async (accountData: FormData): Promise<ApiResponse<Account>> => {
    return apiCall('/api/account/create', {
      method: 'POST',
      headers: {}, // Remove Content-Type to let browser set it for FormData
      body: accountData,
    });
  },

  update: async (id: string, accountData: FormData): Promise<ApiResponse<Account>> => {
    return apiCall(`/api/account/update/${id}`, {
      method: 'PUT',
      headers: {}, // Remove Content-Type to let browser set it for FormData
      body: accountData,
    });
  },

  delete: async (id: string): Promise<ApiResponse> => {
    return apiCall(`/api/account/delete/${id}`, {
      method: 'DELETE',
    });
  },
};

// File API
export const fileApi = {
  uploadSingle: async (file: File): Promise<ApiResponse<{ fileId: string; filename: string }>> => {
    const formData = new FormData();
    formData.append('file', file);
    
    return apiCall('/api/files/upload/single', {
      method: 'POST',
      headers: {}, // Remove Content-Type to let browser set it for FormData
      body: formData,
    });
  },

  uploadMultiple: async (files: File[]): Promise<ApiResponse<{ files: Array<{ fileId: string; filename: string }> }>> => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    
    return apiCall('/api/files/upload/multiple', {
      method: 'POST',
      headers: {}, // Remove Content-Type to let browser set it for FormData
      body: formData,
    });
  },

  getFile: async (id: string): Promise<Blob> => {
    const response = await fetch(`${API_BASE_URL}/api/files/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.statusText}`);
    }
    return response.blob();
  },

  getFileInfo: async (id: string): Promise<ApiResponse<{ filename: string; mimetype: string; size: number }>> => {
    return apiCall(`/api/files/info/${id}`);
  },

  deleteFile: async (id: string): Promise<ApiResponse> => {
    return apiCall(`/api/files/${id}`, {
      method: 'DELETE',
    });
  },

  getAllFiles: async (): Promise<ApiResponse<Array<{ _id: string; filename: string; mimetype: string; uploadDate: string }>>> => {
    return apiCall('/api/files');
  },
};

// User API
export const userApi = {
  getAll: async (page: number = 1, limit: number = 10, search?: string, role?: string): Promise<ApiResponse<{ users: User[]; pagination: { page: number; limit: number; total: number; totalPages: number } }>> => {
    let url = `/api/user/getall?page=${page}&limit=${limit}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    if (role && role !== 'all') url += `&role=${role}`;
    
    return apiCall(url);
  },

  getById: async (id: string): Promise<ApiResponse<User>> => {
    return apiCall(`/api/user/get/${id}`);
  },

  update: async (id: string, userData: { name?: string; email?: string; role?: string; isVerified?: boolean }): Promise<ApiResponse<User>> => {
    return apiCall(`/api/user/update/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  delete: async (id: string): Promise<ApiResponse> => {
    return apiCall(`/api/user/delete/${id}`, {
      method: 'DELETE',
    });
  },

  updatePassword: async (id: string, newPassword: string): Promise<ApiResponse> => {
    return apiCall(`/api/user/update-password/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ newPassword }),
    });
  },
};

// Category API
export const categoryApi = {
  getAll: async (page?: number, limit?: number, search?: string, isActive?: boolean): Promise<ApiResponse<{ categories?: Category[]; items?: Category[]; count?: number; pagination?: any; total?: number; totalPages?: number }>> => {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    if (search) params.append('search', search);
    if (isActive !== undefined) params.append('isActive', isActive.toString());
    
    const queryString = params.toString();
    return apiCall(
      `/api/category/getall${queryString ? `?${queryString}` : ''}`
    );
  },

  getActive: async (): Promise<ApiResponse<{ data: Category[]; count: number }>> => {
    return apiCall('/api/category/active');
  },

  getById: async (id: string): Promise<ApiResponse<Category>> => {
    return apiCall(`/api/category/get/${id}`);
  },

  getBySlug: async (slug: string): Promise<ApiResponse<Category>> => {
    return apiCall(`/api/category/slug/${slug}`);
  },

  create: async (categoryData: { name: string; description?: string; slug?: string; isActive?: boolean; sortOrder?: number }): Promise<ApiResponse<Category>> => {
    return apiCall('/api/category/create', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  },

  update: async (id: string, categoryData: { name?: string; description?: string; slug?: string; isActive?: boolean; sortOrder?: number }): Promise<ApiResponse<Category>> => {
    return apiCall(`/api/category/update/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    });
  },

  delete: async (id: string): Promise<ApiResponse> => {
    return apiCall(`/api/category/delete/${id}`, {
      method: 'DELETE',
    });
  },
};

// Export types
export type { User, Account, Category, ApiResponse, ApiError };