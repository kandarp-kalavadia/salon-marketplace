import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../baseQuery';
import type { BookingRequestDto, BookingResponseDto, PaymentLinkResponseDto, SalonBookingReportDto } from '../../types/api';

export const bookingApi = createApi({
  reducerPath: 'bookingApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Booking'],
  endpoints: (builder) => ({
    createBooking: builder.mutation<PaymentLinkResponseDto, BookingRequestDto>({
      query: (booking) => ({
        url: '/bookings',
        method: 'POST',
        body: booking,
      }),
      invalidatesTags: ['Booking'],
    }),
    getBookingById: builder.query<BookingResponseDto, number>({
      query: (bookingId) => `/bookings/${bookingId}`,
      providesTags: (result, error, bookingId) => [{ type: 'Booking', id: bookingId }],
    }),
    updateBookingStatus: builder.mutation<BookingResponseDto, { bookingId: number; status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' }>({
      query: ({ bookingId, status }) => ({
        url: `/bookings/${bookingId}/status`,
        method: 'PUT',
        params: { status },
      }),
      invalidatesTags: ['Booking'],
    }),
    getBookingsBySalon: builder.query<BookingResponseDto[], void>({
      query: () => '/bookings/salon',
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Booking' as const, id })), 'Booking']
          : ['Booking'],
    }),
    getBookingsByCustomer: builder.query<BookingResponseDto[], void>({
      query: () => '/bookings/customer',
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Booking' as const, id })), 'Booking']
          : ['Booking'],
    }),
    getBookedSlots: builder.query<BookingResponseDto[], string>({
      query: (date) => `/bookings/booked-slots/${date}`,
      providesTags: ['Booking'],
    }),
    getSalonReport: builder.query<SalonBookingReportDto, void>({
      query: () => '/bookings/report',
      providesTags: ['Booking'],
    }),
  }),
});

export const {
  useCreateBookingMutation,
  useGetBookingByIdQuery,
  useUpdateBookingStatusMutation,
  useGetBookingsBySalonQuery,
  useGetBookingsByCustomerQuery,
  useGetBookedSlotsQuery,
  useGetSalonReportQuery,
} = bookingApi;