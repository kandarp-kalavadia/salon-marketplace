import React from 'react';
import {
  Menu,
  MenuItem,
  Box,
  Typography,
  Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

interface ProfileMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({ anchorEl, open, onClose }) => {
  const navigate = useNavigate();
  const { user, logout,hasRole } = useAuth();

  const handleLogout = () => {
    onClose();
    logout();
  };

  const handleNavigation = (path: string) => {
    onClose();
    navigate(path);
  };

  if (!user) return null;

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          mt: 1,
          minWidth: 200,
          borderRadius: 2,
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        },
      }}
    >
      {/* User Info */}
      <Box sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: 'grey.200' }}>
        <Typography variant="subtitle2" fontWeight={600}>
          {user.profile.given_name} {user.profile.family_name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {user.profile.email}
        </Typography>
       
      </Box>
      
      {/* Role-specific menu items */}
      {/* {hasRole('CUSTOMER') && (
        <>
          <MenuItem onClick={() => handleNavigation('/profile')}>
            My Profile
          </MenuItem>
          <MenuItem onClick={() => handleNavigation('/bookings')}>
            My Bookings
          </MenuItem>
          <MenuItem onClick={() => handleNavigation('/reviews')}>
            My Reviews
          </MenuItem>
        </>
      )} */}
      
      {hasRole('SALON_OWNER') && (
        <>
          <MenuItem onClick={() => handleNavigation('/salon-dashboard')}>
            Salon Dashboard
          </MenuItem>
          {/* <MenuItem onClick={() => handleNavigation('/salon-profile')}>
            Salon Profile
          </MenuItem>
          <MenuItem onClick={() => handleNavigation('/salon-settings')}>
            Settings
          </MenuItem> */}
        </>
      )}
      
      {hasRole('ADMIN') && (
        <>
          <MenuItem onClick={() => handleNavigation('/admin-dashboard')}>
            Admin Dashboard
          </MenuItem>
          <MenuItem onClick={() => handleNavigation('/admin-users')}>
            Manage Users
          </MenuItem>
          <MenuItem onClick={() => handleNavigation('/admin-salons')}>
            Manage Salons
          </MenuItem>
          <MenuItem onClick={() => handleNavigation('/admin-settings')}>
            System Settings
          </MenuItem>
        </>
      )}
      
      <Divider sx={{ my: 1 }} />
      
      {/* Logout */}
      <MenuItem 
        onClick={handleLogout}
        sx={{ color: 'error.main', fontWeight: 500 }}
      >
        Sign Out
      </MenuItem>
    </Menu>
  );
};

export default ProfileMenu;
