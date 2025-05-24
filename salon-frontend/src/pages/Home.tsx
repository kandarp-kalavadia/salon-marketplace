import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Rating,
  Paper,
  Avatar,
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  Star as StarIcon,
  People as PeopleIcon,
  TrendingUp as TrendingIcon,
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import SalonCard from '../components/salon/SalonCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { useSearchSalonsQuery } from '../store/api/salonApi';
import { useAuth } from '../auth/AuthContext';
import SearchBar from '../components/SearchBar';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user,hasRole } = useAuth();
   const location = useLocation();
  const params = new URLSearchParams(location.search);
  const searchTerm = params.get('search') || '';
  

  const { data: salons = [], isLoading } = useSearchSalonsQuery(searchTerm);


  const isCustomerOrGuest = !user || hasRole('CUSTOMER');

  // Redirect role-based users to their dashboards
  React.useEffect(() => {
    if (hasRole('SALON_OWNER')) {
      navigate('/salon-dashboard');
    } else if (hasRole('ADMIN')) {
      navigate('/admin-dashboard');
    }
  }, [user, navigate]);

  if (!isCustomerOrGuest) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: { xs: 8, md: 16 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography
                variant="h2"
                component="h1"
                fontWeight={700}
                sx={{
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  lineHeight: 1.2,
                  mb: 3,
                  fontFamily: 'Poppins, sans-serif',
                }}
              >
                Book Your Perfect{' '}
                <Box component="span" sx={{ color: '#FFD700' }}>
                  Beauty
                </Box>{' '}
                Experience
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  mb: 4,
                  opacity: 0.9,
                  lineHeight: 1.6,
                  fontWeight: 400,
                }}
              >
                Discover top-rated salons in your area and book appointments with
                certified professionals. From haircuts to spa treatments, find
                everything you need for your beauty routine.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    bgcolor: 'white',
                    color: 'primary.main',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    '&:hover': {
                      bgcolor: 'grey.100',
                    },
                  }}
                  onClick={() => {
                    document.getElementById('search-section')?.scrollIntoView({
                      behavior: 'smooth',
                    });
                  }}
                >
                  Explore Services
                </Button>
                
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ position: 'relative' }}>
                <img
                  src="https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
                  alt="Modern salon interior"
                  style={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: '16px',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Paper
                  elevation={3}
                  sx={{
                    position: 'absolute',
                    bottom: -20,
                    left: -20,
                    p: 2,
                    borderRadius: 2,
                    bgcolor: 'white',
                    color: 'text.primary',
                  }}
                >
                  <Box display="flex" alignItems="center" gap={1}>
                    <Box>
                      <Typography variant="caption" fontWeight={600}>
                        5,000+ Happy Customers
                      </Typography>
                      <Box display="flex" alignItems="center">
                        <Rating value={5} size="small" readOnly />
                        <Typography variant="caption" sx={{ ml: 0.5 }}>
                          4.9 rating
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Paper>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Search Section */}
      <Container maxWidth="lg" id="search-section">
        <Box sx={{ py: 8 }}>
          <Box textAlign="center" sx={{ mb: 6 }}>
            <Typography
              variant="h3"
              component="h2"
              fontWeight={700}
              sx={{ mb: 2, fontFamily: 'Poppins, sans-serif' }}
            >
              Find Salons Near You
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              Explore our network of professional salons and discover the perfect
              match for your beauty needs.
            </Typography>
          </Box>

          {/* Search Filters */}
          <Paper elevation={2} sx={{ p: 3, borderRadius: 3, mb: 6 , textAlign:'center'}}>
            <SearchBar initialSearchTerm={searchTerm} />
          </Paper>
          {/* Salons Grid */}
          {isLoading ? (
            <LoadingSpinner message="Finding salons for you..." />
          ) : (
            <>
              <Grid container spacing={4}>
                {salons.map((salon) => (
                  <Grid size={{ xs: 12, md: 3,lg:4 }} key={salon.salonId}>
                    <SalonCard salon={salon} />
                  </Grid>
                ))}
              </Grid>
            </>
          )}
        </Box>
      </Container>

      {/* Stats Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {[
              { icon: PeopleIcon, value: '10,000+', label: 'Happy Customers' },
              { icon: LocationIcon, value: '500+', label: 'Partner Salons' },
              { icon: StarIcon, value: '4.8', label: 'Average Rating' },
              { icon: TrendingIcon, value: '99%', label: 'Satisfaction Rate' },
            ].map((stat, index) => (
              <Grid size={{ xs: 6, md: 3 }}  key={index}>
                <Box textAlign="center">
                  <stat.icon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
