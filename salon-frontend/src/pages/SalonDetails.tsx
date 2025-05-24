import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Rating,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Schedule as ScheduleIcon,
  ExpandMore as ExpandMoreIcon,
  ContentCut as ContentCutIcon,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';

import LoadingSpinner from '../components/LoadingSpinner';
import ServiceCard from '../components/salon/ServiceCard';
import ReviewCard from '../components/salon/ReviewCard';
import { useGetSalonByIdQuery } from '../store/api/salonApi';
import { useGetCategoriesBySalonIdQuery } from '../store/api/categoryApi';
import { useGetServiceOfferingsBySalonIdQuery } from '../store/api/serviceOfferingApi';
import { useGetReviewsBySalonQuery } from '../store/api/reviewApi';
import { addToCart } from '../store/slice/cartSlice';
import { ServiceOfferingResponseDto } from '../types/api';
import { useAuth } from '../auth/AuthContext';

const SalonDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user,hasRole } = useAuth();
  const { items: cartItems, total } = useSelector((state: RootState) => state.cart);
  
  const salonId = parseInt(id || '0');
  
  const { data: salon, isLoading: salonLoading } = useGetSalonByIdQuery(salonId);
  const { data: categories = [], isLoading: categoriesLoading } = useGetCategoriesBySalonIdQuery(salonId);
  const { data: services = [], isLoading: servicesLoading } = useGetServiceOfferingsBySalonIdQuery(salonId);
  const { data: reviews = [], isLoading: reviewsLoading } = useGetReviewsBySalonQuery(salonId);

  const [expandedCategory, setExpandedCategory] = useState<number | false>(false);

  const handleAccordionChange = (categoryId: number) => (
    event: React.SyntheticEvent,
    isExpanded: boolean
  ) => {
    setExpandedCategory(isExpanded ? categoryId : false);
  };

  const handleAddToCart = (service: ServiceOfferingResponseDto) => {
    if (!user || !hasRole('CUSTOMER')) {
      // Redirect to login
      navigate('/');
      return;
    }

    dispatch(addToCart({
      serviceId: service.id,
      serviceName: service.name,
      duration: service.duration,
      price: service.price,
      salonId: salon!.salonId,
      salonName: salon!.salonName,
      categoryId: service.categoryId,
    }));
  };

  const handleProceedToCheckout = () => {
    navigate('/checkout');
  };

  if (salonLoading) {
    return <LoadingSpinner fullScreen message="Loading salon details..." />;
  }

  if (!salon) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h4" color="error">
          Salon not found
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate('/')}
          sx={{ mt: 2 }}
        >
          Back to Home
        </Button>
      </Container>
    );
  }

  // Calculate if salon is open based on openTime and closeTime
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

  // Calculate rating and review count from reviews
  const reviewCount = reviews.length;
  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / reviews.length
    : 0;


  const servicesByCategory = categories.map(category => ({
    ...category,
    services: services.filter(service => service.categoryId === category.id),
  }));

  return (
    <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh' }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Salon Header */}
        <Card elevation={2} sx={{ mb: 4, borderRadius: 3, overflow: 'hidden' }}>
          <Box sx={{ position: 'relative', height: { xs: 250, md: 350 } }}>
            <img
              src={ salon.salonImages?.[0]
                ? `${import.meta.env.VITE_BACKEND_URL}${salon.salonImages[0]}` : 
                'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=1200&h=400'}
              alt={salon.salonName}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                color: 'white',
                p: 3,
              }}
            >
              <Typography variant="h3" component="h1" fontWeight={700} sx={{ mb: 1 }}>
                {salon.salonName}
              </Typography>
              <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
                <Box display="flex" alignItems="center">
                  <Rating value={averageRating} precision={0.1} readOnly sx={{ mr: 1 ,color:'white'}} />
                  <Typography variant="h6" fontWeight={600}>
                    {averageRating}
                  </Typography>
                  <Typography variant="body2" sx={{ ml: 1, opacity: 0.8 }}>
                    ({reviewCount} reviews)
                  </Typography>
                </Box>
                <Chip 
                  label={isSalonOpen() ? "Open Now" : "Closed"} 
                  color={isSalonOpen() ? "success" : "error"}
                  sx={{ fontWeight: 600 }}
                />
              </Box>
            </Box>
          </Box>

          <CardContent sx={{ p: 3 }}>
            <Grid container spacing={3}>
               <Grid size={{ xs: 12, md: 4 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Address
                </Typography>
                <Box display="flex" alignItems="start" gap={1}>
                  <LocationIcon color="disabled" sx={{ mt: 0.5 }} />
                  <Typography color="text.secondary">
                    {salon.address}
                  </Typography>
                </Box>
              </Grid>
             <Grid size={{ xs: 12, md: 4 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Contact
                </Typography>
                <Box display="flex" alignItems="center" gap={1} sx={{ mb: 1 }}>
                  <PhoneIcon color="disabled" />
                  <Typography color="text.secondary">
                    {salon.contactNumber}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <EmailIcon color="disabled" />
                  <Typography color="text.secondary">
                    {salon.email}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Hours
                </Typography>
                <Box display="flex" alignItems="start" gap={1}>
                  <ScheduleIcon color="disabled" sx={{ mt: 0.5 }} />
                  <Typography color="text.secondary">
                    Mon-sun: {salon.openTime} - {salon.closeTime}<br />
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Grid container spacing={4}>
          {/* Services Section */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>
              Services
            </Typography>

            {categoriesLoading || servicesLoading ? (
              <LoadingSpinner message="Loading services..." />
            ) : (
              <Box sx={{ mb: 4 }}>
                {servicesByCategory.map((category) => (
                  <Accordion
                    key={category.id}
                    expanded={expandedCategory === category.id}
                    onChange={handleAccordionChange(category.id)}
                    sx={{ mb: 2, borderRadius: 2, '&:before': { display: 'none' } }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      sx={{ 
                        bgcolor: 'primary.main',
                        color: 'white',
                        borderRadius: '12px 12px 0 0',
                        '&.Mui-expanded': {
                          borderRadius: '12px 12px 0 0',
                        },
                      }}
                    >
                      <Box display="flex" alignItems="center" gap={2}>
                        <ContentCutIcon />
                        <Typography variant="h6" fontWeight={600}>
                          {category.name}
                        </Typography>
                        <Chip 
                          label={`${category.services.length} services`}
                          size="small"
                          sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                        />
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails sx={{ p: 3 }}>
                      <Grid container spacing={2}>
                        {category.services.map((service) => (
                          <Grid size={{ xs: 12, md: 6 }} key={service.id}>
                            <ServiceCard
                              service={service}
                              onAddToCart={() => handleAddToCart(service)}
                              isCustomer={hasRole('CUSTOMER')}
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
            )}
          </Grid>

          {/* Sidebar */}
          <Grid size={{ xs: 12, md: 4 }} >
            <Box sx={{ position: 'sticky', top: 24 }}>
              {/* Cart Summary - Customer Only */}
              {hasRole('CUSTOMER') && cartItems.length > 0 && (
                <Card elevation={2} sx={{ mb: 3, borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Your Cart
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      {cartItems.map((item) => (
                        <Box
                          key={item.id}
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                          sx={{ py: 1 }}
                        >
                          <Box>
                            <Typography variant="body2" fontWeight={500}>
                              {item.serviceName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {item.duration} min
                            </Typography>
                          </Box>
                          <Typography variant="body2" fontWeight={600}>
                            ${item.price}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                      <Typography variant="h6" fontWeight={600}>
                        Total
                      </Typography>
                      <Typography variant="h5" fontWeight={700} color="primary.main">
                        ${total.toFixed(2)}
                      </Typography>
                    </Box>
                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      onClick={handleProceedToCheckout}
                      sx={{ fontWeight: 600 }}
                    >
                      Proceed to Checkout
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Reviews Section */}
              <Card elevation={2} sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                    <Typography variant="h6" fontWeight={600}>
                      Customer Reviews
                    </Typography>
                    {hasRole('CUSTOMER') && (
                      <Button 
                        size="small" 
                        variant="outlined"
                        sx={{ textTransform: 'none' }}
                      >
                        Write Review
                      </Button>
                    )}
                  </Box>

                  {reviewsLoading ? (
                    <LoadingSpinner message="Loading reviews..." />
                  ) : reviews.length === 0 ? (
                    <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ py: 2 }}>
                      No reviews yet. Be the first to review!
                    </Typography>
                  ) : (
                    <Box>
                      {reviews.slice(0, 3).map((review) => (
                        <ReviewCard key={review.id} review={review} />
                      ))}
                      {reviews.length > 3 && (
                        <Button 
                          fullWidth 
                          variant="text" 
                          size="small"
                          sx={{ mt: 2 }}
                        >
                          View All Reviews ({reviews.length})
                        </Button>
                      )}
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default SalonDetails;
