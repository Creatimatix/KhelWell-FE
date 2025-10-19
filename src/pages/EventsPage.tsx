import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Alert,
  CircularProgress,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Divider,
  IconButton,
  Tooltip,
  Badge,
  Paper
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  LocationOn as LocationIcon,
  Group as GroupIcon,
  AttachMoney as MoneyIcon,
  SportsSoccer as SoccerIcon,
  SportsCricket as CricketIcon,
  SportsTennis as TennisIcon,
  SportsBasketball as BasketballIcon,
  EmojiEvents as TrophyIcon,
  Add as AddIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { BACKEND_API_URL } from '../utils/constant';

interface Event {
  id: string;
  title: string;
  description: string;
  sports_type: string;
  event_start_date: string;
  event_end_date: string;
  registration_start_date: string;
  registration_end_date: string;
  startTime: string;
  endTime: string;
  location: string;
  address: string;
  rules: string;
  team_limit?: number;
  currentParticipants: number;
  registration_amount: number;
  user_name: string;
  event_type: string;
  is_active: string;
  banner?: string;
  banner_url?: string;
  createdBy: {
    name: string;
    email: string;
    user_name: string;
  };
}

const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sportFilter, setSportFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [eventTypeFilter, setEventTypeFilter] = useState<string>('all');
  
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch(BACKEND_API_URL+"events");
      
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }

      const data = await response.json();
      setEvents(data.events.data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load events');
    } finally {
      setLoading(false);
    }
  };

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

  const getStatusColor = (is_active: string) => {
    // switch (is_active) {
    //   case 'upcoming': return 'primary';
    //   case 'ongoing': return 'success';
    //   case 'completed': return 'info';
    //   case 'cancelled': return 'error';
    //   default: return 'default';
    // }
    return is_active === 'true' ? 'success' : 'error';
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


  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSport = sportFilter === 'all' || event.sports_type === sportFilter;
    const matchesStatus = statusFilter === 'all' || event.is_active === statusFilter;
    const matchesType = eventTypeFilter === 'all' || event.event_type === eventTypeFilter;

    return matchesSearch && matchesSport && matchesStatus && matchesType;
  });

  const isRegistrationOpen = (event: Event) => {
    const now = new Date();
    const startDate = new Date(event.event_start_date);
    // return startDate > now;
    return false;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Helpdesk Ribbon for Users */}
      {user && user.role !== 'admin' && (
        <Paper 
          sx={{ 
            mb: 3, 
            p: 2, 
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            color: 'white',
            textAlign: 'center'
          }}
        >
          <Typography variant="h6" gutterBottom>
            🎯 Want to publish your event?
          </Typography>
          <Typography variant="body1">
            Contact our helpdesk at <strong>+91 99999 99999</strong> to get your event featured!
          </Typography>
        </Paper>
      )}

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          Sports Events & Tournaments
        </Typography>
        {user && user.role === 'admin' && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/admin/events')}
          >
            Create Event
          </Button>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Sport</InputLabel>
                <Select
                  value={sportFilter}
                  label="Sport"
                  onChange={(e) => setSportFilter(e.target.value)}
                >
                  <MenuItem value="all">All Sports</MenuItem>
                  <MenuItem value="football">Football</MenuItem>
                  <MenuItem value="cricket">Cricket</MenuItem>
                  <MenuItem value="tennis">Tennis</MenuItem>
                  <MenuItem value="basketball">Basketball</MenuItem>
                  <MenuItem value="badminton">Badminton</MenuItem>
                  <MenuItem value="volleyball">Volleyball</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {/* <Grid item xs={12} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="upcoming">Upcoming</MenuItem>
                  <MenuItem value="ongoing">Ongoing</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Event Type</InputLabel>
                <Select
                  value={eventTypeFilter}
                  label="Event Type"
                  onChange={(e) => setEventTypeFilter(e.target.value)}
                >
                  <MenuItem value="all">All Types</MenuItem>
                  <MenuItem value="tournament">Tournament</MenuItem>
                  <MenuItem value="league">League</MenuItem>
                  <MenuItem value="championship">Championship</MenuItem>
                  <MenuItem value="friendly">Friendly</MenuItem>
                  <MenuItem value="training">Training</MenuItem>
                </Select>
              </FormControl>
            </Grid> */}
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => {
                  setSearchTerm('');
                  setSportFilter('all');
                  setStatusFilter('all');
                  setEventTypeFilter('all');
                }}
              >
                Clear Filters
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {filteredEvents.length === 0 ? (
        <Card>
          <CardContent>
            <Typography variant="h6" textAlign="center" color="text.secondary">
              No events found
            </Typography>
            <Typography textAlign="center" color="text.secondary">
              Try adjusting your search criteria or check back later for new events.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {filteredEvents.map((event) => (
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
        </Grid>
      )}

      {/* Event Details Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedEvent?.title}
        </DialogTitle>
        <DialogContent>
          {selectedEvent && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                { selectedEvent.banner && <img className='event_img' src={selectedEvent.banner_url} 
                        style={{width: '100%', height: '300px ', objectFit: 'cover', borderRadius: '10px'}} 
                        alt={selectedEvent.title} /> }
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>Event Type</Typography>
                <Chip
                  label={selectedEvent.event_type}
                  color={getEventTypeColor(selectedEvent.event_type) as any}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>Status</Typography>
                <Chip
                  label={selectedEvent.sports_type}
                  color={getStatusColor(selectedEvent.sports_type) as any}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>Registration Duration</Typography>
                <Typography>
                  {format(new Date(selectedEvent.registration_start_date), 'EEEE, MMMM dd, yyyy')} - 
                  {format(new Date(selectedEvent.registration_end_date), 'EEEE, MMMM dd, yyyy')}
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>Event Start and End </Typography>
                <Typography>
                  {format(new Date(selectedEvent.event_start_date), 'EEEE, MMMM dd, yyyy HH:mm')} - 
                  {format(new Date(selectedEvent.event_end_date), 'EEEE, MMMM dd, yyyy HH:mm')}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>Location</Typography>
                <Typography>
                  {selectedEvent.address}
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>Total Participants</Typography>
                <Typography>
                   {selectedEvent.team_limit || '∞'}
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>Entry Fee</Typography>
                <Typography>
                  {selectedEvent.registration_amount > 0 ? `₹${selectedEvent.registration_amount}` : 'Free'}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>Organizer</Typography>
                <Typography>
                  {selectedEvent.user_name}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>Details About Event</Typography>
                <Typography variant="body1" paragraph>
                  <div dangerouslySetInnerHTML={{__html:  selectedEvent.description}} />
                </Typography>
              </Grid>
              <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>Rules</Typography>
                <Typography variant="body1" paragraph>
                  <div dangerouslySetInnerHTML={{__html:  selectedEvent.rules}} />
                </Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
          {selectedEvent && isRegistrationOpen(selectedEvent) && (
            <Button variant="contained">
              Register for Event
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EventsPage; 