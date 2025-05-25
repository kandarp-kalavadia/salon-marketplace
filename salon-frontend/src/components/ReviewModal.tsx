// src/components/salon/ReviewModal.tsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Rating,
  Box,
  Typography,
} from '@mui/material';
import { useCreateReviewMutation } from '../store/api/reviewApi';
import { ReviewRequestDto } from '../types/api';

interface ReviewModalProps {
  open: boolean;
  onClose: () => void;
  salonId: number;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ open, onClose, salonId }) => {
  const [rating, setRating] = useState<number | null>(0);
  const [reviewText, setReviewText] = useState('');
  const [createReview, { isLoading: isReviewSubmitting }] = useCreateReviewMutation();

  const handleSubmitReview = async () => {
    if (!rating || !reviewText.trim()) {
      return;
    }

    try {
      await createReview({
        salonId,
        rating,
        reviewText,
      } as ReviewRequestDto).unwrap();
      setRating(0);
      setReviewText('');
      onClose();
    } catch (error) {
      console.error('Failed to submit review:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Write a Review</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Rating
          </Typography>
          <Rating
            value={rating}
            onChange={(event, newValue) => setRating(newValue)}
            precision={0.5}
          />
          <TextField
            fullWidth
            label="Your Review"
            multiline
            rows={4}
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            sx={{ mt: 2 }}
            disabled={isReviewSubmitting}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isReviewSubmitting}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmitReview}
          variant="contained"
          disabled={isReviewSubmitting || !rating || !reviewText.trim()}
        >
          {isReviewSubmitting ? 'Submitting...' : 'Submit Review'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReviewModal;