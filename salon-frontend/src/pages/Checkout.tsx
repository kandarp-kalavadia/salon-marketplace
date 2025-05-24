import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Paper,
  Chip,
  Alert,
} from '@mui/material';
import {
  CalendarToday as CalendarIcon,
  Schedule as ScheduleIcon,
  Payment as PaymentIcon,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import LoadingSpinner from '../components/LoadingSpinner';
import { clearCart } from '../store/slice/cartSlice';
import { useCreateBookingMutation } from '../store/api/bookingApi';
import { useAuth } from '../auth/AuthContext';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user,hasRole } = useAuth();
  const { items: cartItems, total } = useSelector((state: RootState) => state.cart);
  
  const [createBooking, { isLoading: bookingLoading }] = useCreateBookingMutation();
  
  const [bookingForm, setBookingForm] = useState({
    date: '',
    timeSlot: '',
    notes: '',
  });
  
  const [availableTimes] = useState([
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM',
    '5:00 PM', '6:00 PM', '7:00 PM',
  ]);

  const [error, setError] = useState<string | null>(null);

  // Redirect if not customer or cart is empty
  React.useEffect(() => {
    if (!user || !hasRole('CUSTOMER')) {
      navigate('/');
    } else if (cartItems.length === 0) {
      navigate('/');
    }
  }, [user, cartItems, navigate]);

  const handleFormChange = (field: string, value: string) => {
    setBookingForm(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleProceedToPayment = async () => {
    if (!bookingForm.date || !bookingForm.timeSlot) {
      setError('Please select a date and time for your appointment.');
      return;
    }

    try {
      // Create a single booking with all service IDs
      const bookingResponse = await createBooking({
        serviceIds: cartItems.map(item => item.serviceId),
        startTime: `${bookingForm.date}T${convertTimeToHour(bookingForm.timeSlot)}:00`,
        paymentMethod: 'STRIPE',
      }).unwrap();

      // Clear cart after successful booking creation
      dispatch(clearCart());

      // Store payment data in session storage for success/cancel pages
      const paymentData = {
        amount: total,
        services: cartItems.map(item => item.serviceName),
        date: bookingForm.date,
        timeSlot: bookingForm.timeSlot,
      };
      sessionStorage.setItem('paymentData', JSON.stringify(paymentData));

      // Redirect to the payment link returned from the booking creation
      if (bookingResponse.paymentLinkUrl) {
        window.location.href = bookingResponse.paymentLinkUrl;
      } else {
        throw new Error('No payment link provided in booking response');
      }

    } catch (error: any) {
      console.error('Booking creation failed:', error);
      if(error?.data?.detail){
          setError(error?.data?.detail);
      }else{
          setError(error?.data?.message || 'Failed to create booking. Please try again.');
      }
    }
  };

  const convertTimeToHour = (timeString: string): string => {
    const [time, period] = timeString.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    
    if (period === 'PM' && hours !== 12) {
      hours += 12;
    } else if (period === 'AM' && hours === 12) {
      hours = 0;
    }
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  if (!user || !hasRole('CUSTOMER') || cartItems.length === 0) {
    return <LoadingSpinner fullScreen />;
  }

  if (bookingLoading) {
    return <LoadingSpinner fullScreen message="Processing your booking..." />;
  }

  const totalDuration = cartItems.reduce((sum, item) => sum + item.duration, 0);
  const salonName = cartItems[0]?.salonName || '';

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Checkout
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Booking Details */}
         <Grid size={{ xs: 12, md: 8 }}>
          <Card elevation={2} sx={{ mb: 3, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Booking Details
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Salon: {salonName}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Total Duration: {totalDuration} minutes
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                {cartItems.map((item, index) => (
                  <Paper
                    key={item.id}
                    elevation={1}
                    sx={{ 
                      p: 2, 
                      mb: index < cartItems.length - 1 ? 2 : 0,
                      bgcolor: 'grey.50',
                      borderRadius: 2,
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={2}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          bgcolor: 'primary.main',
                          borderRadius: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                        }}
                      >
                        <ScheduleIcon />
                      </Box>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {item.serviceName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.duration} minutes
                        </Typography>
                      </Box>
                      <Typography variant="h6" fontWeight={600} color="primary.main">
                        ${item.price}
                      </Typography>
                    </Box>
                  </Paper>
                ))}
              </Box>

              <Paper elevation={1} sx={{ p: 2, bgcolor: 'primary.lighter' }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6" fontWeight={600}>
                    Total Amount
                  </Typography>
                  <Typography variant="h5" fontWeight={700} color="primary.main">
                    ${total.toFixed(2)}
                  </Typography>
                </Box>
              </Paper>
            </CardContent>
          </Card>

          {/* Appointment Scheduling */}
          <Card elevation={2} sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Select Date & Time
              </Typography>

              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      label="Preferred Date"
                      type="date"
                      value={bookingForm.date}
                      onChange={(e) => handleFormChange('date', e.target.value)}
                      slotProps={{
                        inputLabel: { shrink: true },
                        htmlInput: {
                          min: new Date().toISOString().split('T')[0],
                        },
                      }}
                    />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel>Time Slot</InputLabel>
                    <Select
                      value={bookingForm.timeSlot}
                      label="Time Slot"
                      onChange={(e) => handleFormChange('timeSlot', e.target.value)}
                    >
                      {availableTimes.map((time) => (
                        <MenuItem key={time} value={time}>
                          {time}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
               
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Summary */}
       <Grid size={{ xs: 12, md: 4 }}>
          <Card elevation={2} sx={{ borderRadius: 2, position: 'sticky', top: 24 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Booking Summary
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Services ({cartItems.length})
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    ${total.toFixed(2)}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Service Fee
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    $0.00
                  </Typography>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="h6" fontWeight={600}>
                    Total
                  </Typography>
                  <Typography variant="h6" fontWeight={700} color="primary.main">
                    ${(total).toFixed(2)}
                  </Typography>
                </Box>
              </Box>

              {bookingForm.date && bookingForm.timeSlot && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Appointment Details:
                  </Typography>
                  <Chip 
                    icon={<CalendarIcon />}
                    label={new Date(bookingForm.date).toLocaleDateString()}
                    variant="outlined"
                    sx={{ mr: 1, mb: 1 }}
                  />
                  <Chip 
                    icon={<ScheduleIcon />}
                    label={bookingForm.timeSlot}
                    variant="outlined"
                    sx={{ mb: 1 }}
                  />
                </Box>
              )}

              <Button
                fullWidth
                variant="contained"
                size="large"
                startIcon={<PaymentIcon />}
                onClick={handleProceedToPayment}
                disabled={!bookingForm.date || !bookingForm.timeSlot}
                sx={{ fontWeight: 600 }}
              >
                Proceed to Payment
              </Button>

              <Typography 
                variant="caption" 
                color="text.secondary" 
                display="block" 
                textAlign="center"
                sx={{ mt: 2 }}
              >
                You will be redirected to our secure payment gateway
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Checkout;
