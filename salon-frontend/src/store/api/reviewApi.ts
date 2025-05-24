import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../baseQuery';
import type { ReviewRequestDto, ReviewResponseDto } from '../../types/api';

export const reviewApi = createApi({
  reducerPath: 'reviewApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Review'],
  endpoints: (builder) => ({
    createReview: builder.mutation<ReviewResponseDto, ReviewRequestDto>({
      query: (review) => ({
        url: '/reviews',
        method: 'POST',
        body: review,
      }),
      invalidatesTags: ['Review'],
    }),
    getReviewById: builder.query<ReviewResponseDto, number>({
      query: (id) => `/reviews/${id}`,
      providesTags: (result, error, id) => [{ type: 'Review', id }],
    }),
    updateReview: builder.mutation<ReviewResponseDto, { id: number; review: ReviewRequestDto }>({
      query: ({ id, review }) => ({
        url: `/reviews/${id}`,
        method: 'PUT',
        body: review,
      }),
      invalidatesTags: ['Review'],
    }),
    deleteReview: builder.mutation<void, number>({
      query: (id) => ({
        url: `/reviews/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Review'],
    }),
    getReviewsByUser: builder.query<ReviewResponseDto[], void>({
      query: () => '/reviews/user',
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Review' as const, id })), 'Review']
          : ['Review'],
    }),
    getReviewsBySalon: builder.query<ReviewResponseDto[], number>({
      query: (salonId) => `/reviews/salon/${salonId}`,
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Review' as const, id })), 'Review']
          : ['Review'],
    }),
  }),
});

export const {
  useCreateReviewMutation,
  useGetReviewByIdQuery,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
  useGetReviewsByUserQuery,
  useGetReviewsBySalonQuery,
} = reviewApi;