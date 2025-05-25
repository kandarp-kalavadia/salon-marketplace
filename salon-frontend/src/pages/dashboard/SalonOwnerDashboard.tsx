import React from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import {
  Box, Drawer, AppBar, Toolbar, Typography, List, ListItemIcon, ListItemText,
  IconButton, useTheme, useMediaQuery,
  ListItemButton
} from '@mui/material';
import {
  CalendarToday as CalendarIcon, Category as CategoryIcon, RoomService as ServiceIcon,
  Star as StarIcon, Menu as MenuIcon,
} from '@mui/icons-material';

import Bookings from '../Salon/Bookings';
import Categories from '../Salon/Categories';
import { useAuth } from '../../auth/AuthContext';
import SalonReviews from '../Salon/SalonReviews';
import Services from '../Salon/Services';

const drawerWidth = 280;
const otherNavHeight = 64; // Adjust based on your other navigation component's height


const SalonOwnerDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: 'Bookings', icon: CalendarIcon, path: '/salon-dashboard/bookings' },
    { text: 'Categories', icon: CategoryIcon, path: '/salon-dashboard/categories' },
    { text: 'Services', icon: ServiceIcon, path: '/salon-dashboard/services' },
    { text: 'Reviews', icon: StarIcon, path: '/salon-dashboard/reviews' },
  ];

  const getCurrentPath = () => location.pathname;

  const drawer = (
    <Box>
      <Box sx={{ p: 3, borderBottom: 1, borderColor: 'grey.200' }}>
        
        <Typography variant="h6" fontWeight={700} className="text-blue-600">
          Salon Dashboard
        </Typography>
        <Typography variant="body2" className="text-gray-500">
          {user?.profile.family_name +""+ user?.profile.given_name}
        </Typography>
      </Box>
      <List sx={{ pt: 2 }}>
        {menuItems.map((item) => (
              <ListItemButton
                key={item.text}
                selected={getCurrentPath() === item.path}
                onClick={() => navigate(item.path)}
                sx={{
                  mx: 2,
                  borderRadius: 2,
                  mb: 0.5,
                  '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: 'white',
                    '&:hover': { bgcolor: 'primary.dark' },
                    '& .MuiListItemIcon-root': { color: 'white' },
                  },
                }}
              >
                <ListItemIcon>
                  <item.icon />
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  slotProps={{
                    primary: { fontWeight: 500 },
                  }}
                />
              </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
<Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Mobile Toolbar with Hamburger Menu */}
      <Toolbar
        sx={{
          display: { md: 'none' }, // Show only on mobile
          position: 'fixed',
          top: `${otherNavHeight}px`, // Below other navigation component
          width: '100%',
          bgcolor: 'background.paper',
          zIndex: 1200, // Below other nav (assumed 1300), above Drawer
        }}
      >
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap>
          Salon Dashboard
        </Typography>
      </Toolbar>

      {/* Main Layout */}
      <Box
        sx={{
          display: 'flex',
          flexGrow: 1,
          mt: { xs: `${otherNavHeight + 64}px`, md: `${otherNavHeight}px` }, // Offset for other nav + Toolbar (mobile) or other nav (desktop)
        }}
      >
        {/* Drawer */}
        <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
          <Drawer
            variant={isMobile ? 'temporary' : 'permanent'}
            open={isMobile ? mobileOpen : true}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: drawerWidth,
                borderRight: 1,
                borderColor: 'grey.200',
                top: {
                  xs: `${otherNavHeight + 64}px`, // Other nav + Toolbar (mobile)
                  md: `${otherNavHeight}px`, // Other nav only (desktop)
                },
                height: {
                  xs: `calc(100vh - ${otherNavHeight + 64}px)`,
                  md: `calc(100vh - ${otherNavHeight}px)`,
                },
                zIndex: 1199, // Below Toolbar (1200) and other nav (assumed 1300)
              },
            }}
          >
            {drawer}
          </Drawer>
        </Box>

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: { md: `calc(100% - ${drawerWidth}px)` },
            minHeight: `calc(100vh - ${otherNavHeight}px)`,
            bgcolor: 'grey.50',
            p: 3,
          }}
        >
          <Routes>
            <Route path="/" element={<Navigate to="/salon-dashboard/bookings" />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/services" element={<Services />} />
            <Route path="/reviews" element={<SalonReviews />} />
          </Routes>
        </Box>
      </Box>
    </Box>
  );
};

export default SalonOwnerDashboard;