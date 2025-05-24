export interface UserCreationDto {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  password: string;
  gender: 'MALE' | 'FEMALE';
}

export interface UserDto {
  userId: string;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  gender: 'MALE' | 'FEMALE';
}

export interface SalonCreationDto {
  salonName: string;
  openTime: Date | null;
  closeTime: Date | null;
  address: string;
  landmark?: string;
  city: string;
  state: string;
  zipcode: string;
  email: string;
  contactNumber: string;
  user: UserCreationDto;
}

export interface SalonRequestDto {
  salonName: string;
  active: boolean;
  openTime: string;
  closeTime: string;
  address: string;
  landmark?: string;
  city: string;
  state: string;
  zipcode: string;
  email: string;
  contactNumber: string;
}

export interface SalonResponseDto {
  salonId: number;
  salonName: string;
  active: boolean;
  openTime: string;
  closeTime: string;
  address: string;
  landmark?: string;
  city: string;
  state: string;
  zipcode: string;
  email: string;
  contactNumber: string;
  salonImages: string[];
  user: UserDto;
}

export interface CategoryRequestDto {
  name: string;
}

export interface CategoryResponseDto {
  id: number;
  name: string;
  image?: string;
  salonId: number;
}

export interface ServiceOfferingRequestDto {
  name: string;
  description?: string;
  price: number;
  duration: string;
  categoryId: number;
  available: boolean;
}

export interface ServiceOfferingResponseDto {
  id: number;
  name: string;
  description?: string;
  price: number;
  duration: number;
  salonId: number;
  categoryId: number;
  available: boolean;
  image?: string;
}

export interface BookingRequestDto {
  startTime: string;
  serviceIds: number[];
  paymentMethod: 'STRIPE';
}

export interface BookingResponseDto {
  id: number;
  salonId: number;
  customerUserId: string;
  startTime: string;
  endTime: string;
  serviceIds: number[];
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  totalPrice: number;
  salon: SalonResponseDto;
  customer: UserDto;
  services: ServiceOfferingResponseDto[];
}

export interface PaymentLinkResponseDto {
  paymentLinkUrl: string;
}

export interface ReviewRequestDto {
  reviewText: string;
  rating: number;
  salonId: number;
}

export interface ReviewResponseDto {
  id: number;
  reviewText: string;
  rating: number;
  salon: SalonResponseDto;
  user: UserDto;
  createdAt: string;
}

export interface PaymentOrderDto {
  id: number;
  amount: number;
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'EXPIRED';
  paymentMethod: 'STRIPE';
  customerUserId: string;
  bookingId: number;
  salonId: number;
}

export interface NotificationDto {
  id: number;
  type: string;
  notificationRead: boolean;
  description: string;
  userId: string;
  bookingId?: number;
  salonId?: number;
  createdAt: string;
}

export interface SalonBookingReportDto {
  totalEarnings: number;
  totalBookings: number;
  cancelledBookings: number;
  totalRefund: number;
}