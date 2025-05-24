import { Container, Typography, Grid, Card, CardContent, Avatar, Chip, CircularProgress, Box } from '@mui/material';
import { useGetReviewsBySalonQuery } from '../../store/api/reviewApi';
import { useGetSalonByOwnerIdQuery } from '../../store/api/salonApi';
import { ReviewResponseDto } from '../../types/api';
import { useAuth } from '../../auth/AuthContext';

const SalonReviews = () => {
  const { user } = useAuth();
  const ownerId = user?.profile.sub;
  const { data: salon, isLoading: salonLoading, error: salonError } = useGetSalonByOwnerIdQuery(ownerId as string, {
    skip: !ownerId,
  });
  const salonId = salon?.salonId;
  const { data: reviews, isLoading: reviewsLoading, error: reviewsError } = useGetReviewsBySalonQuery(salonId as number, {
    skip: !salonId,
  });

  if (salonLoading || reviewsLoading) {
    return (
      <Container maxWidth="lg" className="mt-6 mb-6">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (salonError || reviewsError || !ownerId) {
    return (
      <Container maxWidth="lg" className="mt-6 mb-6">
        <Typography color="error" align="center">
          Failed to load reviews. Please try again later.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" className="mt-6 mb-6">
      <Typography variant="h5" className="font-bold mb-4">Reviews</Typography>
      {reviews?.length === 0 ? (
        <Typography className="text-center text-gray-500 py-4">No reviews found.</Typography>
      ) : (
        <Grid container spacing={3}>
          {reviews?.map((review: ReviewResponseDto) => (
             <Grid size={{ xs: 12, md: 6 }} key={review.id}>
              <Card variant="outlined" className="shadow-md rounded-lg">
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center" className="mb-2">
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar className="bg-blue-600 w-8 h-8">
                        {review.user.firstName?.charAt(0) || 'U'}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" className="font-medium">
                          {review.user.firstName} {review.user.lastName}
                        </Typography>
                        <Typography variant="caption" className="text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Box>
                    <Chip
                      label={`${review.rating}/5`}
                      color="primary"
                      size="small"
                    />
                  </Box>
                  <Typography className="text-gray-600">{review.reviewText}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default SalonReviews;