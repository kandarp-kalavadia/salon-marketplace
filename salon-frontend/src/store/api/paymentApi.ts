import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../baseQuery';
import type { PaymentOrderDto } from '../../types/api';

export const paymentApi = createApi({
  reducerPath: 'paymentApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Payment'],
  endpoints: (builder) => ({
    getPaymentOrderById: builder.query<PaymentOrderDto, number>({
      query: (paymentOrderId) => `/payments/${paymentOrderId}`,
      providesTags: (result, error, paymentOrderId) => [{ type: 'Payment', id: paymentOrderId }],
    }),
  }),
});

export const { useGetPaymentOrderByIdQuery } = paymentApi;