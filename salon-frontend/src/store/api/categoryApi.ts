import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../baseQuery';
import type { CategoryRequestDto, CategoryResponseDto } from '../../types/api';

export const categoryApi = createApi({
  reducerPath: 'categoryApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Category'],
  endpoints: (builder) => ({
    createCategory: builder.mutation<CategoryResponseDto, { category: CategoryRequestDto; image?: File }>({
      query: ({ category, image }) => {
        const formData = new FormData();
        formData.append('category', new Blob([JSON.stringify(category)], { type: 'application/json' }));
        if (image) formData.append('image', image);
        return {
          url: '/categories',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['Category'],
    }),
    getCategoryById: builder.query<CategoryResponseDto, number>({
      query: (id) => `/categories/${id}`,
      providesTags: (result, error, id) => [{ type: 'Category', id }],
    }),
    updateCategory: builder.mutation<CategoryResponseDto, { id: number; category: CategoryRequestDto; image?: File }>({
      query: ({ id, category, image }) => {
        const formData = new FormData();
        formData.append('category', new Blob([JSON.stringify(category)], { type: 'application/json' }));
        if (image) formData.append('image', image);
        return {
          url: `/categories/${id}`,
          method: 'PUT',
          body: formData,
        };
      },
      invalidatesTags: ['Category'],
    }),
    deleteCategory: builder.mutation<void, number>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Category'],
    }),
    getAllCategories: builder.query<CategoryResponseDto[], void>({
      query: () => '/categories',
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Category' as const, id })), 'Category']
          : ['Category'],
    }),
    getCategoriesBySalonId: builder.query<CategoryResponseDto[], number>({
      query: (salonId) => `/categories/salon/${salonId}`,
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Category' as const, id })), 'Category']
          : ['Category'],
    }),
    getCategoryImage: builder.query<string, string>({
      query: (filename) => `/categories/images/${filename}`,
      providesTags: ['Category'],
    }),
  }),
});

export const {
  useCreateCategoryMutation,
  useGetCategoryByIdQuery,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetAllCategoriesQuery,
  useGetCategoriesBySalonIdQuery,
  useGetCategoryImageQuery,
} = categoryApi;