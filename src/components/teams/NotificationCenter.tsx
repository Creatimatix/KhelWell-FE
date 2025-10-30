import {
    Card,
    CardContent,
    CardHeader,
    Box,
    Typography,
    Button,
    IconButton,
    Chip,
    List,
    ListItem,
    ListItemText,
    Avatar,
    Divider,
  } from '@mui/material';
  import {
    Notifications as BellIcon,
    Close as XIcon,
    PersonAdd as UserPlusIcon,
    CheckCircle as CheckCircleIcon,
    Event as CalendarIcon,
    SportsMma as SwordsIcon,
    Cancel as XCircleIcon,
  } from '@mui/icons-material';
  import { Notification, Team } from '../../types/team';
  
  interface NotificationCenterProps {
    notifications: Notification[];
    setNotifications: (notifications: Notification[]) => void;
    userTeams: Team[];
    onClose: () => void;
  }
  
  export function NotificationCenter({
    notifications,
    setNotifications,
    onClose,
  }: NotificationCenterProps) {
    const handleMarkAsRead = (notificationId: string) => {
      setNotifications(
        notifications.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
      );
    };
  
    const handleMarkAllAsRead = () => {
      setNotifications(notifications.map((n) => ({ ...n, read: true })));
    };
  
    const handleClearAll = () => {
      setNotifications([]);
    };
  
    const getNotificationIcon = (type: Notification['type']) => {
      switch (type) {
        case 'connection_request':
          return <UserPlusIcon sx={{ color: 'info.main' }} />;
        case 'connection_accepted':
          return <CheckCircleIcon sx={{ color: 'success.main' }} />;
        case 'team_available':
          return <CalendarIcon sx={{ color: 'secondary.main' }} />;
        case 'match_request':
          return <SwordsIcon sx={{ color: 'warning.main' }} />;
        case 'match_confirmed':
          return <CheckCircleIcon sx={{ color: 'success.main' }} />;
        case 'match_cancelled':
          return <XCircleIcon sx={{ color: 'error.main' }} />;
        default:
          return <BellIcon />;
      }
    };
  
    const formatTime = (dateString: string) => {
      const date = new Date(dateString);
      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
      if (diffInSeconds < 60) return 'Just now';
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
      return `${Math.floor(diffInSeconds / 86400)}d ago`;
    };
  
    const unreadCount = notifications.filter((n) => !n.read).length;
  
    return (
      <Card sx={{ maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
        <CardHeader
          title={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <BellIcon />
              <Typography variant="h6">Notifications</Typography>
              {unreadCount > 0 && (
                <Chip label={unreadCount} size="small" color="error" />
              )}
            </Box>
          }
          action={
            <IconButton onClick={onClose}>
              <XIcon />
            </IconButton>
          }
        />
  
        {notifications.length > 0 && (
          <Box sx={{ px: 2, pb: 2, display: 'flex', gap: 1 }}>
            {unreadCount > 0 && (
              <Button size="small" variant="outlined" onClick={handleMarkAllAsRead}>
                Mark all read
              </Button>
            )}
            <Button size="small" variant="outlined" onClick={handleClearAll}>
              Clear all
            </Button>
          </Box>
        )}
  
        <CardContent sx={{ flexGrow: 1, overflow: 'auto', p: 0 }}>
          {notifications.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <BellIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
              <Typography color="text.secondary">No notifications yet</Typography>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {notifications.map((notification, index) => (
                <Box key={notification.id}>
                  <ListItem
                    sx={{
                      bgcolor: !notification.read ? 'action.hover' : 'transparent',
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'action.selected' },
                    }}
                    onClick={() => handleMarkAsRead(notification.id)}
                    secondaryAction={
                      !notification.read && (
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            bgcolor: 'primary.main',
                          }}
                        />
                      )
                    }
                  >
                    <Avatar sx={{ mr: 2 }}>
                      {getNotificationIcon(notification.type)}
                    </Avatar>
                    <ListItemText
                      primary={notification.message}
                      secondary={formatTime(notification.createdAt)}
                    />
                  </ListItem>
                  {index < notifications.length - 1 && <Divider />}
                </Box>
              ))}
            </List>
          )}
        </CardContent>
      </Card>
    );
  }
  