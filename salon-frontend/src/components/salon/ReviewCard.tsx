import React from 'react';
import {
  Box,
  Typography,
  Rating,
  Avatar,
  Divider,
} from '@mui/material';
import { ReviewResponseDto } from '../../types/api';

interface ReviewCardProps {
  review: ReviewResponseDto;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  const getInitials = (firstName?: string, lastName?: string) => {
    const first = firstName?.charAt(0) || '';
    const last = lastName?.charAt(0) || '';
    return `${first}${last}`.toUpperCase() || 'U';
  };

  const formatCustomerName = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return 'Anonymous User';
    if (firstName && lastName) return `${firstName} ${lastName.charAt(0)}.`;
    return firstName || lastName || 'Anonymous User';
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Box display="flex" alignItems="center" gap={2} sx={{ mb: 1.5 }}>
        <Avatar 
          sx={{ 
            bgcolor: 'primary.main',
            width: 36,
            height: 36,
            fontSize: '0.875rem',
            fontWeight: 600,
          }}
        >
          {getInitials(review.user.firstName, review.user.lastName)}
        </Avatar>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle2" fontWeight={600}>
            {formatCustomerName(review.user.firstName, review.user.lastName)}
          </Typography>
          <Box display="flex" alignItems="center" gap={1}>
            <Rating 
              value={review.rating} 
              size="small" 
              readOnly
              sx={{ fontSize: '1rem' }}
            />
            <Typography variant="caption" color="text.secondary">
              {review.createdAt}
            </Typography>
          </Box>
        </Box>
      </Box>
      
      <Typography 
        variant="body2" 
        color="text.secondary"
        sx={{ 
          mb: 1.5,
          lineHeight: 1.5,
        }}
      >
        {review.reviewText}
      </Typography>
      
      {review.salon.salonName && (
        <Typography 
          variant="caption" 
          color="primary.main"
          sx={{ 
            bgcolor: 'primary.lighter',
            px: 1,
            py: 0.5,
            borderRadius: 1,
            fontWeight: 500,
            display: 'inline-block',
          }}
        >
          Salon : {review.salon.salonName}
        </Typography>
      )}
      
      <Divider sx={{ mt: 2 }} />
    </Box>
  );
};

export default ReviewCard;
