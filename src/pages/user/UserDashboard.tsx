import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  CircularProgress,
  Alert,
  IconButton,
  Rating,
  Badge,
  Paper,
  Tabs,
  Tab
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  SportsSoccer as SportsIcon,
  Event as EventIcon,
  Star as StarIcon,
  AccessTime as TimeIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingIcon,
  CalendarToday as CalendarIcon,
  DirectionsRun as ActivityIcon,
  BookOnline as BookingIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Group as GroupIcon,
  SportsSoccer as SoccerIcon,
  SportsCricket as CricketIcon,
  SportsTennis as TennisIcon,
  SportsBasketball as BasketballIcon,
  EmojiEvents as TrophyIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { BACKEND_API_URL } from '../../utils/constant';
import TurfCard from '../TurfCard';

import { format } from 'date-fns';
import { Event } from '../../types';

interface Turf {
  id: number;
  name: string;
  sportType: string;
  location: {
    address: string;
    city: string;
  };
  images: string[];
  rating: {
    average: number;
    count: number;
  };
  pricing: {
    hourlyRate: number;
    currency: string;
  };
  distance?: number;
  isAvailable?: boolean;
}


interface Booking {
  id: number;
  turf: {
    name: string;
    sportType: string;
    location: string;
  };
  date: string;
  start_time: string;
  end_time: string;
  total_price: number;
  status_text: string;
  paymentStatus: string;
}


const isRegistrationOpen = (event: Event) => {
  const now = new Date();
  const startDate = new Date(event.event_start_date);
  // return startDate > now;
  return false;
};

const UserDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nearbyTurfs, setNearbyTurfs] = useState<Turf[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [statistics, setStatistics] = useState({
    totalBookings: 0,
    completedBookings: 0,
    totalSpent: 0,
    // favoriteSport: ''
  });

  
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');

      // Fetch nearby turfs
      const turfsResponse = await fetch(BACKEND_API_URL+'turfs/nearby', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': `application/json`
        }
      });
      const turfsData = await turfsResponse.json();
    
      // Fetch events
      const eventsResponse = await fetch(BACKEND_API_URL+'events/upcoming', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': `application/json`
        }
      });
      const eventsData = await eventsResponse.json();

      // Fetch user dashboard data
      const dashboardResponse = await fetch(BACKEND_API_URL+'slot-bookings/my/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': `application/json`
        }
      });
      const dashboardData = await dashboardResponse.json();

      console.log("dashboardData:", dashboardData)
      console.log("eventsData:", eventsData)
      
      setNearbyTurfs(turfsData.turfs || []);
      setEvents(eventsData.data.data || []);
      setRecentBookings(dashboardData.recent_bookings || []);
      
      
      setStatistics({
        totalBookings: dashboardData?.data?.total_bookings || 0,
        completedBookings: dashboardData.data?.completed_bookings || 0,
        totalSpent: dashboardData.data?.total_spent || 0,
        // favoriteSport: dashboardData.statistics?.favoriteSport || ''
      });
    } catch (err: any) {
      setError('Failed to load dashboard data');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      case 'completed': return 'info';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  
  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'tournament': return 'error';
      case 'league': return 'warning';
      case 'championship': return 'success';
      case 'friendly': return 'info';
      case 'training': return 'default';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  const getSportIcon = (sport: string) => {
    console.log("Sport: ", sport.toLowerCase());
    switch (sport.toLowerCase()) {
      case 'football': return <SoccerIcon />;
      case 'cricket': return <CricketIcon />;
      case 'tennis': return <TennisIcon />;
      case 'basketball': return <BasketballIcon />;
      default: return <TrophyIcon />;
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Welcome Section */}
      <Box mb={4}>
        <Typography variant="h4" gutterBottom>
          Welcome back, {user?.name}! 👋
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Your Game. Your Journey. All in One Place. Discover nearby turfs, upcoming events, and manage your bookings
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Statistics Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <BookingIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">{statistics.totalBookings}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Bookings
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                  <ActivityIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">{statistics.completedBookings}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Completed
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                  <MoneyIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">₹{statistics.totalSpent}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Spent
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        {/* <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
                  <SportsIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">{statistics.favoriteSport || 'N/A'}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Favorite Sport
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid> */}
      </Grid>

      {/* Quick Actions */}
      <Box mb={4}>
        <Typography variant="h5" gutterBottom>
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          <Grid item>
            <Button
              variant="contained"
              startIcon={<BookingIcon />}
              onClick={() => navigate('/turfs')}
            >
              Book a Turf
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              startIcon={<EventIcon />}
              onClick={() => navigate('/events')}
            >
              View Events
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              startIcon={<CalendarIcon />}
              onClick={() => navigate('/user/bookings')}
            >
              My Bookings
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Main Content Tabs */}
      <Paper sx={{ width: '100%' }}>
        <Tabs value={activeTab} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="Nearby Turfs" />
          <Tab label="Upcoming Events" />
          <Tab label="Recent Bookings" />
        </Tabs>

        {/* Nearby Turfs Tab */}
        {activeTab === 0 && (
          <Box p={3}>
            <Typography variant="h6" gutterBottom>
              Turfs Near You
            </Typography>
            <Grid container spacing={3}>
              {nearbyTurfs.map((turf: any) => (
                <TurfCard key={turf.id} turfItem={turf}  />
              ))}
              {nearbyTurfs.length === 0 && (
                <Grid item xs={12}>
                  <Box textAlign="center" py={4}>
                    <Typography variant="body1" color="text.secondary">
                      No turfs found nearby. Try expanding your search area.
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Box>
        )}

        {/* Events Tab */}
        {activeTab === 1 && (
          <Box p={3}>
            <Typography variant="h6" gutterBottom>
              Upcoming Events
            </Typography>
            <Grid container spacing={3}>
              {events.map((event: any) => (
                 <Grid item xs={12} md={6} lg={4} key={event.id}>
                 <Card 
                   sx={{ 
                     height: '100%',
                     display: 'flex',
                     flexDirection: 'column',
                     '&:hover': { boxShadow: 4 }
                   }}
                 >
                   <CardContent sx={{ flexGrow: 1 }}>
                     <Box>
                       <Typography>
                           { event.banner && <img className='event_img' src={event.banner_url} 
                           style={{width: '100%', height: '200px ', objectFit: 'cover', borderRadius: '10px'}} 
                           alt={event.title} /> }
                       </Typography>
                     </Box>
                     <Box display="flex" alignItems="center" mb={2}>
                         <Avatar sx={{ mr: 1, bgcolor: 'primary.main' }}>
                         {getSportIcon(event.sports_type)}
                       </Avatar>
                       <Box flex={1}>
                         <Typography variant="h6" noWrap>
                           {event.title}
                         </Typography>
                         <Typography variant="caption" color="text.secondary">
                           {event.location}
                         </Typography>
                       </Box>
                     </Box>
                     <Typography 
                       variant="body2" 
                       color="text.secondary" 
                       sx={{ 
                         mb: 2,
                         display: '-webkit-box',
                         WebkitLineClamp: 2,
                         WebkitBoxOrient: 'vertical',
                         overflow: 'hidden'
                       }}
                     >
                       {!! event.description !!}
                       <div dangerouslySetInnerHTML={{__html:  event.description}} />
                     </Typography>
   
                     <Box display="flex" gap={1} mb={2}>
                       <Chip
                         label={event.event_type}
                         color={getEventTypeColor(event.event_type) as any}
                         size="small"
                       />
                       <Chip
                         label={event.sports_type}
                         color={getStatusColor(event.sports_type) as any}
                         size="small"
                       />
                     </Box>
                     <Box display="flex" alignItems="center" mb={1}>
                       <TimeIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                       <Typography variant="body2">
                         {format(new Date(event.event_start_date), 'MMM dd, yyyy HH:mm')} - {format(new Date(event.event_end_date), 'MMM dd, yyyy HH:mm')}
                       </Typography>
                     </Box>
   
                     <Box display="flex" alignItems="center" mb={1}>
                       <LocationIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                       <Typography variant="body2" noWrap>
                         {event.address}
                       </Typography>
                     </Box>
   
                     <Box display="flex" alignItems="center" mb={2}>
                       <GroupIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                       <Typography variant="body2">
                        {event.team_limit || '∞'} participants
                       </Typography>
                     </Box>
   
                     {event.registration_amount > 0 && (
                       <Box display="flex" alignItems="center" mb={2}>
                         <MoneyIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                         <Typography variant="body2">
                           Entry Fee: ₹{event.registration_amount}
                         </Typography>
                       </Box>
                     )}
   
                     {event.user_name  && (
                       <Box display="flex" alignItems="center" mb={2}>
                         <Typography variant="body2">
                           Organized by: {event.user_name}
                         </Typography>
                       </Box>
                     )}
   
                     <Box display="flex" gap={1} mt="auto">
                       <Button
                         variant="outlined"
                         size="small"
                         startIcon={<ViewIcon />}
                         onClick={() => {
                           setSelectedEvent(event);
                           setViewDialogOpen(true);
                         }}
                         fullWidth
                       >
                         View Details
                       </Button>
                       {isRegistrationOpen(event) && (
                         <Button
                           variant="contained"
                           size="small"
                           fullWidth
                         >
                           Register
                         </Button>
                       )}
                     </Box>
                   </CardContent>
                 </Card>
               </Grid>
              ))}
              {events.length === 0 && (
                <Grid item xs={12}>
                  <Box textAlign="center" py={4}>
                    <Typography variant="body1" color="text.secondary">
                      No upcoming events found.
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Box>
        )}

        {/* Recent Bookings Tab */}
        {activeTab === 2 && (
          <Box p={3}>
            <Typography variant="h6" gutterBottom>
              Recent Bookings
            </Typography>
            <List>
              {recentBookings.map((booking, index) => (
                <React.Fragment key={booking.id}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar>
                        <SportsIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={booking.turf.name}
                      secondary={
                        <Box>
                          <Typography variant="body2">
                            {formatDate(booking.date)} • {formatTime(booking.start_time.slice(0, 5))} - {formatTime(booking.end_time).slice(0, 5)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {booking.turf.location || 'Location not available'} • ₹{booking.total_price}
                          </Typography>
                        </Box>
                      }
                    />
                    <Box display="flex" alignItems="center" gap={1}>
                      <Chip
                        label={booking.status_text}
                        color={getStatusColor(booking.status_text) as any}
                        size="small"
                      />
                      {/* <Chip
                        label={booking.paymentStatus}
                        color={booking.paymentStatus === 'paid' ? 'success' : 'warning'}
                        size="small"
                      /> */}
                    </Box>
                  </ListItem>
                  {index < recentBookings.length - 1 && <Divider />}
                </React.Fragment>
              ))}
              {recentBookings.length === 0 && (
                <Box textAlign="center" py={4}>
                  <Typography variant="body1" color="text.secondary">
                    No recent bookings found.
                  </Typography>
                </Box>
              )}
            </List>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default UserDashboard; 