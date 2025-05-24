import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../baseQuery';
import type { UserCreationDto, UserDto } from '../../types/api';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User'],
  endpoints: (builder) => ({
    createCustomerUser: builder.mutation<string, UserCreationDto>({
      query: (user) => ({
        url: '/users/signup',
        method: 'POST',
        body: user,
      }),
      invalidatesTags: ['User'],
    }),
    getUserById: builder.query<UserDto, string>({
      query: (userId) => `/users/${userId}`,
      providesTags: (result, error, userId) => [{ type: 'User', id: userId }],
    }),
  }),
});

export const { useCreateCustomerUserMutation, useGetUserByIdQuery } = userApi;