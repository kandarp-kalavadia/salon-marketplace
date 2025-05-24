import {
  Container, Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Chip, Avatar, Button, CircularProgress
} from '@mui/material';
import { useGetBookingsBySalonQuery, useUpdateBookingStatusMutation } from '../../store/api/bookingApi';

import { BookingResponseDto } from '../../types/api';

const Bookings = () => {
  
  const { data: bookings, isLoading: bookingsLoading, error: bookingsError } = useGetBookingsBySalonQuery();
  const [updateBookingStatus, { isLoading: isUpdating }] = useUpdateBookingStatusMutation();

  const handleStatusUpdate = async (bookingId: number, status: 'PENDING' | 'CONFIRMED' | 'CANCELLED') => {
    try {
      await updateBookingStatus({ bookingId, status }).unwrap();
    } catch (error) {
      console.error('Failed to update booking status:', error);
    }
  };

  if (bookingsLoading) {
    return (
      <Container maxWidth="lg" className="mt-6 mb-6">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (bookingsError) {
    return (
      <Container maxWidth="lg" className="mt-6 mb-6">
        <Typography color="error" align="center">
          Failed to load bookings. Please try again later.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" className="mt-6 mb-6">
      <Box className="mb-4">
        <Typography variant="h5" className="font-bold">Bookings</Typography>
      </Box>
      {bookings?.length === 0 ? (
        <Typography className="text-center text-gray-500 py-4">No bookings found.</Typography>
      ) : (
        <TableContainer component={Paper} className="shadow-md rounded-lg">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Customer</TableCell>
                <TableCell>Services</TableCell>
                <TableCell>Date & Time</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings?.map((booking: BookingResponseDto) => (
                <TableRow key={booking.id} hover>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar className="bg-blue-600 w-8 h-8">
                        {booking.customer.firstName?.charAt(0) || 'U'}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" className="font-medium">
                          {booking.customer.firstName} {booking.customer.lastName}
                        </Typography>
                        <Typography variant="caption" className="text-gray-500">
                          {booking.customer.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {booking.services.map((s) => (
                      <Typography key={s.id} variant="body2" className="font-medium">
                        {s.name}
                      </Typography>
                    ))}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(booking.startTime).toLocaleDateString()}
                    </Typography>
                    <Typography variant="caption" className="text-gray-500">
                      {new Date(booking.startTime).toLocaleTimeString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={booking.status}
                      color={
                        booking.status === 'CONFIRMED' ? 'success' :
                        booking.status === 'PENDING' ? 'warning' : 'error'
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" className="font-semibold">
                      ${booking.totalPrice.toFixed(2)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <Button
                        size="small"
                        variant="text"
                        onClick={() => handleStatusUpdate(booking.id, 'CONFIRMED')}
                        disabled={booking.status === 'CONFIRMED' || isUpdating}
                      >
                        Confirm
                      </Button>
                      <Button
                        size="small"
                        variant="text"
                        color="error"
                        onClick={() => handleStatusUpdate(booking.id, 'CANCELLED')}
                        disabled={booking.status === 'CANCELLED' || isUpdating}
                      >
                        Cancel
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default Bookings;