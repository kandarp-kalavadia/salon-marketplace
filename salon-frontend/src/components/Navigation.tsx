import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  TextField,
  InputAdornment,
  Button,
  IconButton,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  Chip,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  ListItemButton,
} from '@mui/material';
import {
  Search as SearchIcon,
  ShoppingCart as ShoppingCartIcon,
  Notifications as NotificationsIcon,
  ContentCut as ContentCutIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../store/store';

import SignupModal from './auth/SignupModal';
import SalonSignupModal from './auth/SalonSignupModal';
import { toggleCart } from '../store/slice/cartSlice';
import { toggleNotifications } from '../store/slice/notificationSlice';
import { useAuth } from '../auth/AuthContext';
import SearchBar from './SearchBar';

const Navigation: React.FC = () => {
  const dispatch : AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated , logout, hasRole, login} = useAuth();
  const { items: cartItems } = useSelector((state: RootState) => state.cart);
  const { unreadCount } = useSelector((state: RootState) => state.notifications);
  
  const [profileMenuAnchor, setProfileMenuAnchor] = useState<null | HTMLElement>(null);
  const [signupModalOpen, setSignupModalOpen] = useState(false);
  const [salonSignupModalOpen, setSalonSignupModalOpen] = useState(false);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // State for mobile menu


  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setProfileMenuAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };

  const handleLogout = () => {
    handleProfileMenuClose();
    logout();
  };

  const handleCartToggle = () => {
    dispatch(toggleCart());
  };

  const handleNotificationsToggle = () => {
    dispatch(toggleNotifications());
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const getUserInitials = (firstName: string | undefined, lastName: string | undefined) => {
    if(firstName && lastName){
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    }else{
      return "FirstName LastName"
    }
  };

  const isCustomerOrGuest = !user || hasRole('CUSTOMER');


  // Mobile menu content
  const mobileMenu = (
  <Box
    sx={{ width: 250 }}
    role="presentation"
    onClick={handleMobileMenuToggle}
    onKeyDown={handleMobileMenuToggle}
  >
    <List>
      {!isAuthenticated && (
        <>
        
          <ListItemButton onClick={() => login()}>
            <ListItemText primary="Sign In" />
          </ListItemButton>
          <ListItemButton onClick={() => setSignupModalOpen(true)}>
            <ListItemText primary="Sign Up" />
          </ListItemButton>
          <ListItemButton onClick={() => setSalonSignupModalOpen(true)}>
            <ListItemText primary="Become a Partner" />
          </ListItemButton>
        </>
      )}
      
     
    </List>
  </Box>
);

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={1}
        sx={{ 
          bgcolor: 'background.paper', 
          color: 'text.primary',
          borderBottom: 1,
          borderColor: 'grey.200'
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* Logo */}
          <Box 
            display="flex" 
            alignItems="center" 
            sx={{ cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            <ContentCutIcon sx={{ color: 'primary.main', mr: 1, fontSize: '2rem' }} />
            <Typography 
              variant="h4" 
              component="div" 
              sx={{ 
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 700,
                color: 'text.primary'
              }}
            >
              SalonHub
            </Typography>
          </Box>

          {/* Search Bar - Only for customers/guests */}
          {isCustomerOrGuest && (
              <Box sx={{ display: { xs: 'none', md: 'flex' }}}>

            <SearchBar/>
            </Box>
          )}

          {/* Navigation Actions */}
          <Box display="flex" alignItems="center" gap={2}>
            {/* Guest Navigation */}
            {!isAuthenticated && (
              <>
                <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3 }}>
                 
                  <Button 
                    color="inherit" 
                    sx={{ fontWeight: 500 }}
                    onClick={() => setSalonSignupModalOpen(true)}
                  >
                    Become a Partner
                  </Button>
                </Box>
                <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3 }}>
                    <Button 
                      color="inherit" 
                      sx={{ fontWeight: 500 }}
                      onClick={() => login()}
                    >
                      Sign In
                    </Button>
                </Box>
                <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3 }}>
                  <Button 
                    variant="contained" 
                    sx={{ fontWeight: 600 }}
                    onClick={() => setSignupModalOpen(true)}
                  >
                    Sign Up
                  </Button>
                </Box>
              </>
            )}

            {/* Customer Navigation */}
            {isAuthenticated && hasRole('CUSTOMER') && (
              <>
               
                <IconButton 
                  color="inherit" 
                  onClick={handleCartToggle}
                  sx={{ position: 'relative' }}
                >
                  <Badge badgeContent={cartItems.length} color="secondary">
                    <ShoppingCartIcon />
                  </Badge>
                </IconButton>
              </>
            )}

            {/* Notifications - All logged-in users */}
            {isAuthenticated && (
              <IconButton 
                color="inherit" 
                onClick={handleNotificationsToggle}
                sx={{ position: 'relative' }}
              >
                <Badge badgeContent={unreadCount} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            )}

            {/* Profile Menu - All logged-in users */}
            {isAuthenticated && user && (
              <>
                <IconButton 
                  onClick={handleProfileMenuOpen}
                  sx={{ p: 0.5 }}
                >
                  <Avatar 
                    sx={{ 
                      bgcolor: 'primary.main',
                      width: 40,
                      height: 40,
                      fontSize: '0.875rem',
                      fontWeight: 600
                    }}
                  >
                    {getUserInitials(user?.profile?.given_name, user.profile.family_name)}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={profileMenuAnchor}
                  open={Boolean(profileMenuAnchor)}
                  onClose={handleProfileMenuClose}
                  PaperProps={{
                    sx: {
                      mt: 1,
                      minWidth: 200,
                      borderRadius: 2,
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    },
                  }}
                >
                  <Box sx={{ px: 2, py: 1, borderBottom: 1, borderColor: 'grey.200' }}>
                    <Typography variant="subtitle2" fontWeight={600}>
                      {user?.profile?.given_name +" "+user.profile.family_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user.profile.email}
                    </Typography>
                    
                  </Box>
                  
                  {/* {hasRole('CUSTOMER') && (
                    <Box>
                      <MenuItem onClick={() => { handleProfileMenuClose(); navigate('/profile'); }}>
                        My Profile
                      </MenuItem>
                      <MenuItem onClick={() => { handleProfileMenuClose(); navigate('/bookings'); }}>
                        My Bookings
                      </MenuItem>
                    </Box>
                  )} */}
                  
                  {hasRole('SALON_OWNER') && (
                    <Box>
                      <MenuItem onClick={() => { handleProfileMenuClose(); navigate('/salon-dashboard'); }}>
                        Salon Dashboard
                      </MenuItem>
                      {/* <MenuItem onClick={() => { handleProfileMenuClose(); navigate('/salon-profile'); }}>
                        Salon Profile
                      </MenuItem> */}
                    </Box>
                  )}
                  
                  {hasRole('ADMIN') && (
                    <MenuItem onClick={() => { handleProfileMenuClose(); navigate('/admin-dashboard'); }}>
                      Admin Dashboard
                    </MenuItem>
                  )}
                  
                  <Box sx={{ borderTop: 1, borderColor: 'grey.200', mt: 1 }}>
                    <MenuItem 
                      onClick={handleLogout}
                      sx={{ color: 'error.main', fontWeight: 500 }}
                    >
                      Sign Out
                    </MenuItem>
                  </Box>
                </Menu>
              </>
            )}

            {/* Mobile menu button */}
            {!isAuthenticated && (
            <IconButton
              color="inherit"
              sx={{ display: { xs: 'block', md: 'none' } }}
              onClick={handleMobileMenuToggle}
            >
              <MenuIcon />
            </IconButton>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Menu Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={handleMobileMenuToggle}
      >
        {mobileMenu}
      </Drawer>

      {/* Auth Modals */}
     
      <SignupModal 
        open={signupModalOpen} 
        onClose={() => setSignupModalOpen(false)}
        onSwitchToLogin={() => {
          setSignupModalOpen(false);
          login();
        }}
        onSwitchToSalonSignup={() => {
          setSignupModalOpen(false);
          setSalonSignupModalOpen(true);
        }}
      />
      <SalonSignupModal 
        open={salonSignupModalOpen} 
        onClose={() => setSalonSignupModalOpen(false)}
      />
    </>
  );
};

export default Navigation;
