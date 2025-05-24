import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  Button,
  Divider,
  Chip,
  Paper,
} from '@mui/material';
import {
  Close as CloseIcon,
  Delete as DeleteIcon,
  ShoppingCart as ShoppingCartIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../store/store';
import { closeCart, removeFromCart } from '../../store/slice/cartSlice';
import { useAuth } from '../../auth/AuthContext';

const CartSidebar: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, total, isOpen } = useSelector((state: RootState) => state.cart);
  const { user,hasRole } = useAuth();

  const handleClose = () => {
    dispatch(closeCart());
  };

  const handleRemoveItem = (itemId: number) => {
    dispatch(removeFromCart(itemId));
  };

  const handleCheckout = () => {
    if (!user || !hasRole('CUSTOMER')) {
      // Should not happen as cart is only available for customers
      return;
    }
    handleClose();
    navigate('/checkout');
  };

  const formatDuration = (duration: number) => {
    if (duration >= 60) {
      const hours = Math.floor(duration / 60);
      const minutes = duration % 60;
      if (minutes === 0) {
        return `${hours}h`;
      }
      return `${hours}h ${minutes}m`;
    }
    return `${duration}min`;
  };
  const totalDuration = items.reduce((sum, item) => sum + item.duration, 0);
  const finalTotal = total ;

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={handleClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 400 },
          maxWidth: '100vw',
        },
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box 
          sx={{ 
            p: 2, 
            borderBottom: 1, 
            borderColor: 'grey.200',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <ShoppingCartIcon color="primary" />
            <Typography variant="h6" fontWeight={600}>
              Your Cart
            </Typography>
            {items.length > 0 && (
              <Chip 
                label={items.length} 
                size="small" 
                color="primary"
              />
            )}
          </Box>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Cart Items */}
        <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
          {items.length === 0 ? (
            <Box 
              sx={{ 
                p: 4, 
                textAlign: 'center',
                color: 'text.secondary',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <ShoppingCartIcon sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
              <Typography variant="h6" gutterBottom>
                Your cart is empty
              </Typography>
              <Typography variant="body2">
                Add some services to get started
              </Typography>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {items.map((item, index) => (
                <React.Fragment key={item.id}>
                  <ListItem 
                    sx={{ 
                      py: 2,
                      px: 2,
                      flexDirection: 'column',
                      alignItems: 'stretch',
                    }}
                  >
                    <Box display="flex" justifyContent="space-between" alignItems="start" sx={{ mb: 1 }}>
                      <Box sx={{ flexGrow: 1, mr: 2 }}>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {item.serviceName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.salonName}
                        </Typography>
                      </Box>
                      <IconButton 
                        onClick={() => handleRemoveItem(item.id)}
                        size="small"
                        color="error"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                    
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box display="flex" alignItems="center" gap={1}>
                        <ScheduleIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {formatDuration(item.duration)}
                        </Typography>
                      </Box>
                      <Typography variant="h6" fontWeight={700} color="primary.main">
                        ${item.price.toFixed(2)}
                      </Typography>
                    </Box>
                  </ListItem>
                  {index < items.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </Box>

        {/* Footer */}
        {items.length > 0 && (
          <Box sx={{ borderTop: 1, borderColor: 'grey.200' }}>
            {/* Summary */}
            <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50' }}>
              <Typography variant="subtitle2" gutterBottom>
                Appointment Summary
              </Typography>
              <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Total Duration
                </Typography>
                <Typography variant="body2">
                  {formatDuration(totalDuration)}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Services ({items.length})
                </Typography>
                <Typography variant="body2">
                  ${total.toFixed(2)}
                </Typography>
              </Box>
              
              <Divider sx={{ my: 1 }} />
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" fontWeight={600}>
                  Total
                </Typography>
                <Typography variant="h6" fontWeight={700} color="primary.main">
                  ${finalTotal.toFixed(2)}
                </Typography>
              </Box>
            </Paper>
            
            {/* Checkout Button */}
            <Box sx={{ p: 2 }}>
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleCheckout}
                sx={{ 
                  fontWeight: 600,
                  py: 1.5,
                }}
              >
                Proceed to Checkout
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Drawer>
  );
};

export default CartSidebar;
