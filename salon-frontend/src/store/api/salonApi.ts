import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../baseQuery';
import type { SalonCreationDto, SalonResponseDto } from '../../types/api';

export const salonApi = createApi({
  reducerPath: 'salonApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Salon'],
  endpoints: (builder) => ({
    createSalon: builder.mutation<SalonResponseDto, { salon: SalonCreationDto; images?: File[] }>({
      query: ({ salon, images }) => {
        const formData = new FormData();
        formData.append('salon', new Blob([JSON.stringify(salon)], { type: 'application/json' }));
        images?.forEach((image) => formData.append('images', image));
        return {
          url: '/salons/signup',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['Salon'],
    }),
    getSalonById: builder.query<SalonResponseDto, number>({
      query: (salonId) => `/salons/${salonId}`,
      providesTags: (result, error, salonId) => [{ type: 'Salon', id: salonId }],
    }),
    updateSalon: builder.mutation<SalonResponseDto, { salonId: number; salon: SalonCreationDto; images?: File[] }>({
      query: ({ salonId, salon, images }) => {
        const formData = new FormData();
        formData.append('salon', new Blob([JSON.stringify(salon)], { type: 'application/json' }));
        images?.forEach((image) => formData.append('images', image));
        return {
          url: `/salons/${salonId}`,
          method: 'PUT',
          body: formData,
        };
      },
      invalidatesTags: ['Salon'],
    }),
    deleteSalon: builder.mutation<void, number>({
      query: (salonId) => ({
        url: `/salons/${salonId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Salon'],
    }),
    getAllSalons: builder.query<SalonResponseDto[], void>({
      query: () => '/salons',
      providesTags: (result) =>
        result
          ? [...result.map(({ salonId }) => ({ type: 'Salon' as const, id: salonId })), 'Salon']
          : ['Salon'],
    }),
    getSalonByOwnerId: builder.query<SalonResponseDto, string>({
      query: (ownerId) => `/salons/owner/${ownerId}`,
      providesTags: (result, error, ownerId) => [{ type: 'Salon', id: ownerId }],
    }),
    getSalonImage: builder.query<string, string>({
      query: (filename) => `/salons/images/${filename}`,
      providesTags: ['Salon'],
    }),
    searchSalons: builder.query<SalonResponseDto[], string>({
      query:  (keyword) => `/salons/searchs?query=${keyword}`,
      providesTags: ['Salon'],
    }),
  }),
});

export const {
  useCreateSalonMutation,
  useGetSalonByIdQuery,
  useUpdateSalonMutation,
  useDeleteSalonMutation,
  useGetAllSalonsQuery,
  useGetSalonByOwnerIdQuery,
  useGetSalonImageQuery,
  useSearchSalonsQuery,
} = salonApi;