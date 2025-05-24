import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../baseQuery';
import type { ServiceOfferingRequestDto, ServiceOfferingResponseDto } from '../../types/api';

export const serviceOfferingApi = createApi({
  reducerPath: 'serviceOfferingApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['ServiceOffering'],
  endpoints: (builder) => ({
    createServiceOffering: builder.mutation<ServiceOfferingResponseDto, { serviceOffering: ServiceOfferingRequestDto; image?: File }>({
      query: ({ serviceOffering, image }) => {
        const formData = new FormData();
        formData.append('serviceOffering', new Blob([JSON.stringify(serviceOffering)], { type: 'application/json' }));
        if (image) formData.append('image', image);
        return {
          url: '/salonservices',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['ServiceOffering'],
    }),
    getServiceOfferingById: builder.query<ServiceOfferingResponseDto, number>({
      query: (id) => `/salonservices/${id}`,
      providesTags: (result, error, id) => [{ type: 'ServiceOffering', id }],
    }),
    updateServiceOffering: builder.mutation<ServiceOfferingResponseDto, { id: number; serviceOffering: ServiceOfferingRequestDto; image?: File }>({
      query: ({ id, serviceOffering, image }) => {
        const formData = new FormData();
        formData.append('serviceOffering', new Blob([JSON.stringify(serviceOffering)], { type: 'application/json' }));
        if (image) formData.append('image', image);
        return {
          url: `/salonservices/${id}`,
          method: 'PUT',
          body: formData,
        };
      },
      invalidatesTags: ['ServiceOffering'],
    }),
    deleteServiceOffering: builder.mutation<void, number>({
      query: (id) => ({
        url: `/salonservices/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ServiceOffering'],
    }),
    getAllServiceOfferings: builder.query<ServiceOfferingResponseDto[], void>({
      query: () => '/salonservices',
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'ServiceOffering' as const, id })), 'ServiceOffering']
          : ['ServiceOffering'],
    }),
    getServiceOfferingsBySalonId: builder.query<ServiceOfferingResponseDto[], number>({
      query: (salonId) => `/salonservices/salon/${salonId}`,
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'ServiceOffering' as const, id })), 'ServiceOffering']
          : ['ServiceOffering'],
    }),
    getServiceOfferingsByCategoryId: builder.query<ServiceOfferingResponseDto[], number>({
      query: (categoryId) => `/salonservices/category/${categoryId}`,
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'ServiceOffering' as const, id })), 'ServiceOffering']
          : ['ServiceOffering'],
    }),
    getServiceOfferingByIds: builder.query<ServiceOfferingResponseDto[], number[]>({
      query: (ids) => `/salonservices/list/${ids.join(',')}`,
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'ServiceOffering' as const, id })), 'ServiceOffering']
          : ['ServiceOffering'],
    }),
    getServiceOfferingImage: builder.query<string, string>({
      query: (filename) => `/salonservices/images/${filename}`,
      providesTags: ['ServiceOffering'],
    }),
  }),
});

export const {
  useCreateServiceOfferingMutation,
  useGetServiceOfferingByIdQuery,
  useUpdateServiceOfferingMutation,
  useDeleteServiceOfferingMutation,
  useGetAllServiceOfferingsQuery,
  useGetServiceOfferingsBySalonIdQuery,
  useGetServiceOfferingsByCategoryIdQuery,
  useGetServiceOfferingByIdsQuery,
  useGetServiceOfferingImageQuery,
} = serviceOfferingApi;