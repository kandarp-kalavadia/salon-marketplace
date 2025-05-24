import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Button,
} from '@mui/material';
import {
  LocationOn as LocationIcon,
} from '@mui/icons-material';

import {
  People as PeopleIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { SalonResponseDto } from '../../types/api';
import { useGetCategoriesBySalonIdQuery } from '../../store/api/categoryApi';
import { useGetReviewsBySalonQuery } from '../../store/api/reviewApi';

interface SalonCardProps {
  salon: SalonResponseDto;
}




const SalonCard: React.FC<SalonCardProps> = ({ salon }) => {
  const navigate = useNavigate();

    const { data: categories = [] } = useGetCategoriesBySalonIdQuery(salon.salonId);
    const { data: reviews = [] } = useGetReviewsBySalonQuery(salon.salonId);
    
    const reviewCount = reviews.length;


  const handleCardClick = () => {
    navigate(`/salon/${salon.salonId}`);
  };

  
  const getStatusColor = (isOpen: boolean) => {
    return isOpen ? 'success' : 'default';
  };

  const getStatusText = (isOpen: boolean) => {
    return isOpen ? 'Open Now' : 'Closed';
  };

  const isSalonOpen = () => {
    if (!salon.openTime || !salon.closeTime) return false;
    
    const now = new Date();
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentTime = currentHours * 60 + currentMinutes;

    // Assuming openTime and closeTime are in "HH:mm" format
    const [openHours, openMinutes] = salon.openTime.split(':').map(Number);
    const [closeHours, closeMinutes] = salon.closeTime.split(':').map(Number);
    
    const openTimeInMinutes = openHours * 60 + openMinutes;
    const closeTimeInMinutes = closeHours * 60 + closeMinutes;

    return currentTime >= openTimeInMinutes && currentTime <= closeTimeInMinutes;
  };

  

  return (
    <Card 
      sx={{ 
        borderRadius: 3,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        },
      }}
      onClick={handleCardClick}
      className="card-hover"
    >
      <Box sx={{ position: 'relative' }}>
       <CardMedia
            component="img"
            height="200"
            image={
              salon.salonImages?.[0]
                ? `${import.meta.env.VITE_BACKEND_URL}${salon.salonImages[0]}`
                : 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&h=300'
            }
            alt={salon.salonName}
            sx={{ objectFit: 'cover' }}
          />
        
        {/* Status Badge */}
        <Chip
          label={getStatusText(isSalonOpen())}
          color={getStatusColor(isSalonOpen())}
          size="small"
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            fontWeight: 600,
            fontSize: '0.75rem',
          }}
        />
      </Box>

      <CardContent sx={{ p: 3 }}>
        <Typography 
          variant="h6" 
          component="h3" 
          fontWeight={600}
          sx={{ 
            mb: 1,
            fontFamily: 'Poppins, sans-serif',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {salon.salonName}
        </Typography>

        <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
          <LocationIcon sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} />
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              flexGrow: 1,
            }}
          >
            {salon.address}
          </Typography>
        </Box>

        {/* Stats Row */}
        <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Box display="flex" alignItems="center" gap={2}>
            <Box display="flex" alignItems="center">
              <PeopleIcon sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} />
              <Typography variant="caption" color="text.secondary">
                {reviewCount} reviews
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Service Categories */}
        <Box sx={{ mb: 2 }}>
          <Box display="flex" flexWrap="wrap" gap={0.5}>
            {categories?.slice(0, 3).map((category) => (
              <Chip
                key={category.id}
                label={category.name}
                size="small"
                variant="outlined"
                sx={{ 
                  fontSize: '0.75rem',
                  height: 24,
                  bgcolor: 'primary.lighter',
                  borderColor: 'primary.light',
                  color: 'primary.main',
                }}
              />
            ))}
            {categories && categories.length > 3 && (
              <Chip
                label={`+${categories.length - 3} more`}
                size="small"
                variant="outlined"
                sx={{ 
                  fontSize: '0.75rem',
                  height: 24,
                  color: 'text.secondary',
                }}
              />
            )}
          </Box>
        </Box>

        <Button
          fullWidth
          variant="contained"
          sx={{ 
            fontWeight: 600,
            py: 1,
            borderRadius: 2,
          }}
        >
          View Services
        </Button>
      </CardContent>
    </Card>
  );
};

export default SalonCard;
