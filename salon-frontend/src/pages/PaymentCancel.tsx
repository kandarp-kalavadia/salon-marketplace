import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Paper,
} from '@mui/material';
import {
  Cancel as CancelIcon,
  ShoppingCart as ShoppingCartIcon,
  Home as HomeIcon,
} from '@mui/icons-material';

const PaymentCancel: React.FC = () => {
  const navigate = useNavigate();

  const handleReturnToCart = () => {
    navigate('/checkout');
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Box textAlign="center" sx={{ mb: 4 }}>
        <CancelIcon 
          sx={{ 
            fontSize: 80, 
            color: 'warning.main', 
            mb: 2 
          }} 
        />
        <Typography 
          variant="h3" 
          component="h1" 
          fontWeight={700} 
          color="warning.main"
          sx={{ mb: 2, fontFamily: 'Poppins, sans-serif' }}
        >
          Payment Cancelled
        </Typography>
        <Typography 
          variant="h6" 
          color="text.secondary"
          sx={{ maxWidth: 600, mx: 'auto' }}
        >
          Your payment was cancelled and no charges were made to your account. Your booking has not been confirmed.
        </Typography>
      </Box>

      <Card elevation={3} sx={{ borderRadius: 3, mb: 4 }}>
        <CardContent sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            What happened?
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            The payment process was interrupted or cancelled. This can happen if:
          </Typography>
          
          <Box component="ul" sx={{ textAlign: 'left', maxWidth: 400, mx: 'auto', mb: 3 }}>
            <Typography component="li" variant="body2" sx={{ mb: 1 }}>
              You clicked the back button during payment
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 1 }}>
              The payment window was closed
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 1 }}>
              There was a connection issue
            </Typography>
            <Typography component="li" variant="body2">
              You chose to cancel the transaction
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Box display="flex" gap={2} justifyContent="center" sx={{ mb: 4 }}>
        
        <Button
          variant="outlined"
          size="large"
          startIcon={<HomeIcon />}
          onClick={handleBackToHome}
          sx={{ px: 4, fontWeight: 600 }}
        >
          Back to Home
        </Button>
      </Box>

      <Paper 
        elevation={2} 
        sx={{ 
          p: 3, 
          bgcolor: 'info.lighter', 
          borderRadius: 2,
          textAlign: 'center'
        }}
      >
        <Typography variant="body2" color="text.secondary">
          <strong>Need Help?</strong><br />
          If you're experiencing issues with payment or have questions about your booking, 
          please contact our customer support team. We're here to help you complete your appointment booking.
        </Typography>
      </Paper>
    </Container>
  );
};

export default PaymentCancel;
