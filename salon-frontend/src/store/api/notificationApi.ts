import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../baseQuery';
import type { NotificationDto } from '../../types/api';

export const notificationApi = createApi({
  reducerPath: 'notificationApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Notification'],
  endpoints: (builder) => ({
    getNotificationsByUserId: builder.query<NotificationDto[], string>({
      query: (userId) => `/notifications/user/${userId}`,
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Notification' as const, id })), 'Notification']
          : ['Notification'],
    }),
    getNotificationsBySalonOwnerId: builder.query<NotificationDto[], string>({
      query: (salonOwnerId) => `/notifications/salon/${salonOwnerId}`,
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Notification' as const, id })), 'Notification']
          : ['Notification'],
    }),
    markNotificationAsRead: builder.mutation<NotificationDto, number>({
      query: (notificationId) => ({
        url: `/notifications/read/${notificationId}`,
        method: 'PUT',
      }),
      invalidatesTags: ['Notification'],
    }),
    deleteNotification: builder.mutation<void, number>({
      query: (notificationId) => ({
        url: `/notifications/${notificationId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Notification'],
    }),
  }),
});

export const {
  useGetNotificationsByUserIdQuery,
  useGetNotificationsBySalonOwnerIdQuery,
  useMarkNotificationAsReadMutation,
  useDeleteNotificationMutation,
} = notificationApi;