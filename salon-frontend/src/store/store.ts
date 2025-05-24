import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slice/cartSlice';
import notificationReducer from './slice/notificationSlice';

import { userApi } from './api/userApi';
import { salonApi } from './api/salonApi';
import { categoryApi } from './api/categoryApi';
import { serviceOfferingApi } from './api/serviceOfferingApi';
import { bookingApi } from './api/bookingApi';
import { reviewApi } from './api/reviewApi';
import { paymentApi } from './api/paymentApi';
import { notificationApi } from './api/notificationApi';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    notifications: notificationReducer,
    [userApi.reducerPath]: userApi.reducer,
    [salonApi.reducerPath]: salonApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [serviceOfferingApi.reducerPath]: serviceOfferingApi.reducer,
    [bookingApi.reducerPath]: bookingApi.reducer,
    [reviewApi.reducerPath]: reviewApi.reducer,
    [paymentApi.reducerPath]: paymentApi.reducer,
    [notificationApi.reducerPath]: notificationApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      userApi.middleware,
      salonApi.middleware,
      categoryApi.middleware,
      serviceOfferingApi.middleware,
      bookingApi.middleware,
      reviewApi.middleware,
      paymentApi.middleware,
      notificationApi.middleware,
    ]),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;