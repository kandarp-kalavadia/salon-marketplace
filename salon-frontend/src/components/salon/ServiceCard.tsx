import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  Divider,
} from '@mui/material';
import {
  Schedule as ScheduleIcon,
  Add as AddIcon,
  Login as LoginIcon,
} from '@mui/icons-material';
import { ServiceOfferingResponseDto } from '../../types/api';
import { useAuth } from '../../auth/AuthContext';

interface ServiceCardProps {
  service: ServiceOfferingResponseDto;
  onAddToCart: () => void;
  isCustomer: boolean;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ 
  service, 
  onAddToCart, 
  isCustomer 
}) => {

  const {login}= useAuth();
  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

 

  return (
    <Card 
      variant="outlined" 
      sx={{ 
        borderRadius: 2,
        transition: 'all 0.2s ease',
        '&:hover': {
          borderColor: 'primary.main',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        },
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Box display="flex" justifyContent="space-between" alignItems="start" sx={{ mb: 2 }}>
          <Box sx={{ flexGrow: 1, mr: 2 }}>
            <Typography 
              variant="subtitle1" 
              fontWeight={600}
              sx={{ mb: 0.5 }}
            >
              {service.name}
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ 
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                lineHeight: 1.4,
                mb: 1,
              }}
            >
              {service.description || 'Professional service with experienced staff'}
            </Typography>
          </Box>
          <Typography 
            variant="h6" 
            fontWeight={700} 
            color="primary.main"
            sx={{ minWidth: 'fit-content' }}
          >
            {formatPrice(service.price)}
          </Typography>
        </Box>

        <Box 
          display="flex" 
          alignItems="center" 
          justifyContent="space-between" 
          sx={{ mb: 2 }}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <ScheduleIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {service.duration} Min
            </Typography>
          </Box>
          
          {service.available ? (
            <Chip 
              label="Available" 
              color="success" 
              size="small"
              variant="outlined"
            />
          ) : (
            <Chip 
              label="Unavailable" 
              color="default" 
              size="small"
              variant="outlined"
            />
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

        {isCustomer ? (
          <Button
            fullWidth
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onAddToCart}
            disabled={!service.available}
            sx={{ 
              fontWeight: 600,
              py: 1,
            }}
          >
            Add to Cart
          </Button>
        ) : (
          <Button
            fullWidth
            variant="outlined"
            startIcon={<LoginIcon />}
            onClick={login}
            disabled={!service.available}
            sx={{ 
              fontWeight: 600,
              py: 1,
            }}
          >
            Sign In to Book
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ServiceCard;
