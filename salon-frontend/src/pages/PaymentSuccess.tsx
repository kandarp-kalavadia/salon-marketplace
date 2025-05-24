import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider,
  Paper,
  Grid,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  CalendarToday as CalendarIcon,
  Schedule as ScheduleIcon,
  Receipt as ReceiptIcon,
} from '@mui/icons-material';

interface PaymentData {
  amount: number;
  services: string[];
  date: string;
  timeSlot: string;
}

const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);

  useEffect(() => {
    // Retrieve payment data from session storage
    const storedData = sessionStorage.getItem('paymentData');
    if (storedData) {
      setPaymentData(JSON.parse(storedData));
      // Clear the data after use
      sessionStorage.removeItem('paymentData');
    } else {
      // If no payment data, redirect to home
      navigate('/');
    }
  }, [navigate]);

  const handleViewBookings = () => {
    navigate('/bookings');
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  if (!paymentData) {
    return null;
  }

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Box textAlign="center" sx={{ mb: 4 }}>
        <CheckCircleIcon 
          sx={{ 
            fontSize: 80, 
            color: 'success.main', 
            mb: 2 
          }} 
        />
        <Typography 
          variant="h3" 
          component="h1" 
          fontWeight={700} 
          color="success.main"
          sx={{ mb: 2, fontFamily: 'Poppins, sans-serif' }}
        >
          Payment Successful!
        </Typography>
        <Typography 
          variant="h6" 
          color="text.secondary"
          sx={{ maxWidth: 600, mx: 'auto' }}
        >
          Thank you for your booking. Your appointment has been confirmed and you will receive a confirmation notification shortly.
        </Typography>
      </Box>

      <Card elevation={3} sx={{ borderRadius: 3, mb: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Box display="flex" alignItems="center" gap={2} sx={{ mb: 3 }}>
            <ReceiptIcon color="primary" />
            <Typography variant="h5" fontWeight={600}>
              Booking Summary
            </Typography>
          </Box>

          <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
              <Paper elevation={1} sx={{ p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Appointment Details
                </Typography>
                <Box display="flex" alignItems="center" gap={1} sx={{ mb: 2 }}>
                  <CalendarIcon fontSize="small" color="primary" />
                  <Typography variant="body1">
                    {new Date(paymentData.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <ScheduleIcon fontSize="small" color="primary" />
                  <Typography variant="body1">
                    {paymentData.timeSlot}
                  </Typography>
                </Box>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Paper elevation={1} sx={{ p: 3, bgcolor: 'primary.lighter', borderRadius: 2 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Payment Details
                </Typography>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body1" color="text.secondary">
                    Total Amount Paid
                  </Typography>
                  <Typography variant="h5" fontWeight={700} color="primary.main">
                    ${(paymentData.amount * 1.08).toFixed(2)}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Includes taxes and fees
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" fontWeight={600} gutterBottom>
            Services Booked
          </Typography>
          <List>
            {paymentData.services.map((service, index) => (
              <ListItem key={index} sx={{ px: 0 }}>
                <ListItemText
                  primary={service}
                  secondary="Professional service with certified stylist"
                />
                <Chip 
                  label="Confirmed" 
                  color="success" 
                  size="small"
                  variant="outlined"
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      <Box display="flex" gap={2} justifyContent="center">
        <Button
          variant="contained"
          size="large"
          onClick={handleViewBookings}
          sx={{ px: 4, fontWeight: 600 }}
        >
          View My Bookings
        </Button>
        <Button
          variant="outlined"
          size="large"
          onClick={handleBackToHome}
          sx={{ px: 4, fontWeight: 600 }}
        >
          Back to Home
        </Button>
      </Box>

      <Paper 
        elevation={2} 
        sx={{ 
          mt: 4, 
          p: 3, 
          bgcolor: 'info.lighter', 
          borderRadius: 2,
          textAlign: 'center'
        }}
      >
        <Typography variant="body2" color="text.secondary">
          <strong>What's Next?</strong><br />
          You will receive a confirmation email with your booking details and the salon's contact information. 
          If you need to reschedule or cancel, please contact the salon directly or manage your booking through your account.
        </Typography>
      </Paper>
    </Container>
  );
};

export default PaymentSuccess;
