import React from 'react';
import { Box } from '@mui/material';
import Navigation from './Navigation';
import NotificationCenter from './NotificationCenter';
import CartSidebar from './cart/CartSidebar';

interface LayoutProps {
  children: React.ReactNode;
}



const Layout : React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', width: '100vw', margin: 0, padding: 0 }}>
      <Navigation />
      <Box component="main" sx={{ flexGrow: 1, width: '100%', margin: 0, padding: 0 }}>
        {children}
      </Box>
      <NotificationCenter />
      <CartSidebar />
    </Box>
  );
};


export default Layout;
