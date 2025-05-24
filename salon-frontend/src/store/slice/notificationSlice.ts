import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Notification {
  id: number;
  type: string;
  notificationRead: boolean;
  description: string;
  userId: string;
  bookingId?: number;
  salonId?: number;
  createdAt: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isOpen: boolean;
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  isOpen: false,
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setNotifications: (state, action: PayloadAction<Notification[]>) => {
      state.notifications = action.payload.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      state.unreadCount = action.payload.filter(n => !n.notificationRead).length;
    },
    
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.unshift(action.payload);
      if (!action.payload.notificationRead) {
        state.unreadCount += 1;
      }
    },
    
    markAsRead: (state, action: PayloadAction<number>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification && !notification.notificationRead) {
        notification.notificationRead = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    
    markAllAsRead: (state) => {
      state.notifications.forEach(notification => {
        notification.notificationRead = true;
      });
      state.unreadCount = 0;
    },
    
    toggleNotifications: (state) => {
      state.isOpen = !state.isOpen;
    },
    
    closeNotifications: (state) => {
      state.isOpen = false;
    },
    
    removeNotification: (state, action: PayloadAction<number>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
      if (notification && !notification.notificationRead) {
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
  },
});

export const {
  setNotifications,
  addNotification,
  markAsRead,
  markAllAsRead,
  toggleNotifications,
  closeNotifications,
  removeNotification,
} = notificationSlice.actions;

export default notificationSlice.reducer;
