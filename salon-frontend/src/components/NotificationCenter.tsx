import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  CircularProgress,
} from '@mui/material';
import {
  Close as CloseIcon,
  CalendarToday as CalendarIcon,
  Payment as PaymentIcon,
  Star as StarIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { closeNotifications, markAsRead } from '../store/slice/notificationSlice';
import {
  useGetNotificationsBySalonOwnerIdQuery,
  useGetNotificationsByUserIdQuery,
  useMarkNotificationAsReadMutation,
} from '../store/api/notificationApi';
import { NotificationDto } from '../types/api';
import { useAuth } from '../auth/AuthContext';


const NotificationCenter: React.FC = () => {
  const dispatch = useDispatch();
  const { user,hasRole } = useAuth();
  const { isOpen } = useSelector((state: RootState) => state.notifications);
  const userId = user?.profile.sub;
  

const isSalonOwner = hasRole('SALON_OWNER');
const isCustomer = hasRole('CUSTOMER');

let notifications: NotificationDto[] | undefined; // Replace 'any' with the appropriate type for notifications
let isLoading: boolean = false;
let error: any = null; // Replace 'any' with the appropriate error type

if (isSalonOwner) {

  const { data: notificationsData, isLoading: notificationsLoading, error: notificationsError } =
    useGetNotificationsBySalonOwnerIdQuery(userId as string, {
      skip: !isSalonOwner,
    });

  notifications = notificationsData;
  isLoading =  notificationsLoading;
  error = notificationsError;
} else if (isCustomer) {
  const { data: notificationsData, isLoading: customerLoading, error: customerError } = useGetNotificationsByUserIdQuery(
    userId as string
  );

  // Adjust based on what customerData contains; for example:
  notifications = notificationsData 
  isLoading = customerLoading;
  error = customerError;
}



  const [markNotificationAsReadApi] = useMarkNotificationAsReadMutation();


  const handleClose = () => {
    dispatch(closeNotifications());
  };

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await markNotificationAsReadApi(notificationId).unwrap();
      dispatch(markAsRead(notificationId));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

 

  const getNotificationTitle = (type: string): string => {
    switch (type) {
      case 'Booking':
        return 'New Booking';
      case 'PAYMENT':
        return 'Payment Update';
      case 'REVIEW':
        return 'New Review';
      case 'SYSTEM':
        return 'System Alert';
      default:
        return 'Notification';
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'BOOKING':
        return <CalendarIcon color="primary" />;
      case 'PAYMENT':
        return <PaymentIcon color="success" />;
      case 'REVIEW':
        return <StarIcon color="warning" />;
      case 'SYSTEM':
        return <InfoIcon color="info" />;
      default:
        return <InfoIcon />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'BOOKING':
        return 'primary';
      case 'PAYMENT':
        return 'success';
      case 'REVIEW':
        return 'warning';
      case 'SYSTEM':
        return 'info';
      default:
        return 'default';
    }
  };

  const unreadCount = notifications?.filter((n: NotificationDto) => !n.notificationRead).length || 0;


  if (isLoading) {
    return (
      <Drawer anchor="right" open={isOpen} onClose={handleClose}>
        <Box sx={{ width: { xs: '100%', sm: 400 }, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      </Drawer>
    );
  }

  if (error) {
    return (
      <Drawer anchor="right" open={isOpen} onClose={handleClose}>
        <Box sx={{ width: { xs: '100%', sm: 400 }, height: '100%', p: 2 }}>
          <Typography color="error" align="center">
            Failed to load notifications. Please try again later.
          </Typography>
        </Box>
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={handleClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 400 },
          maxWidth: '100vw',
        },
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box
          sx={{
            p: 2,
            borderBottom: 1,
            borderColor: 'grey.200',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box>
            <Typography variant="h6" fontWeight={600}>
              Notifications
            </Typography>
            {unreadCount > 0 && (
              <Chip label={`${unreadCount} unread`} size="small" color="error" sx={{ mt: 0.5 }} />
            )}
          </Box>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>


        {/* Notifications List */}
        <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
          {notifications?.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
              <InfoIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
              <Typography variant="body1">No notifications yet</Typography>
              <Typography variant="body2">You'll see your notifications here when you have them</Typography>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {notifications?.map((notification: NotificationDto, index: number) => (
                <React.Fragment key={notification.id}>
                  <ListItem
                    sx={{
                      py: 2,
                      bgcolor: notification.notificationRead ? 'transparent' : 'primary.lighter',
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: 'grey.50',
                      },
                    }}
                    onClick={() => {
                      if (!notification.notificationRead) {
                        handleMarkAsRead(notification.id);
                      }
                    }}
                  >
                    <ListItemIcon>{getNotificationIcon(notification.type)}</ListItemIcon>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography
                            variant="subtitle2"
                            fontWeight={notification.notificationRead ? 400 : 600}
                          >
                            {getNotificationTitle(notification.type)}
                          </Typography>
                          <Chip
                            label={notification.type}
                            size="small"
                            color={getNotificationColor(notification.type) as any}
                            variant="outlined"
                            sx={{ fontSize: '0.6875rem', height: 20 }}
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }} component="div">
                            {notification.description}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" component="div">
                            {notification.createdAt}
                          </Typography>
                        </Box>
                      }
                    />
                    {!notification.notificationRead && (
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          bgcolor: 'primary.main',
                          ml: 1,
                        }}
                      />
                    )}
                  </ListItem>
                </React.Fragment>
              ))}
            </List>
          )}
        </Box>
      </Box>
    </Drawer>
  );
};

export default NotificationCenter;