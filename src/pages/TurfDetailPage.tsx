import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Container,
  Rating,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
} from '@mui/material';
import {
  LocationOn,
  SportsSoccer,
  AccessTime,
  AttachMoney,
  Star,
  CheckCircle,
  Cancel,
  Schedule,
  Event,
  RateReview,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { turfService } from '../services/turfService';
import { useAuth } from '../context/AuthContext';
import { Turf } from '../types';
import toast from 'react-hot-toast';
import SlotBooking from '../components/SlotBooking';
import ReviewList from '../components/ReviewList';
import ReviewForm from '../components/ReviewForm';
import ImageGallery from '../components/ImageSlider/ImageGallery';
import { string } from 'yup';
import { BACKEND_API_URL, formatPrice } from '../utils/constant';

const TurfDetailPage: React.FC = () => {
  const param = useParams();
  const slug = param.slug || '';
  const id = param.id || '';
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const [selectedSportTab, setSelectedSportTab] = useState(0);


  const [selectedSport, setSelectedSport] = useState(0);
  const [selectedSportPrice, setSelectedSportPrice] =  useState<number | 0>(0);

    const { data: turfResponse, isLoading, error } = useQuery(
      ['turfs', slug],
      () => turfService.getTurfBySlug(slug),
      { keepPreviousData: true }
    );
  
    // Normalize backend response to expected shape used in UI
    const turf = React.useMemo(() => {
      if (!turfResponse) return null;
      
      try {
        const raw = (turfResponse as any).data || turfResponse;
        // setActiveTabForBooking(raw[0].rate_per_hour)
        return raw;
      } catch (e) {
        console.error('Error normalizing turfs response:', e);
        return null;
      }
    }, [turfResponse]);
    
    useEffect(() => {
      const first = turf?.sports && turf.sports.length > 0 ? turf.sports[0] : null;
      if (first) {
        setSelectedSport(first.id);
        setSelectedSportPrice(first.rate_per_hour);
      } 
    }, [turf?.sports]);


    const handleBooking = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setBookingDialogOpen(true);
  };

  const handleReviewSubmit = async (rating: number, comment: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(BACKEND_API_URL+'reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          turf_id: parseInt(turf.id!),
          rating,
          comment
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Review submitted successfully!');
        setShowReviewForm(false);
        // Refresh the turf data to update rating
        queryClient.invalidateQueries(['turf', id]);
      } else {
        throw new Error(data.message || 'Failed to submit review');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit review');
    }
  };

  const getSportIcon = (sportType: string) => {
    switch (sportType) {
      case 'football':
        return '⚽';
      case 'cricket':
        return '🏏';
      case 'tennis':
        return '🎾';
      case 'basketball':
        return '🏀';
      case 'badminton':
        return '🏸';
      case 'volleyball':
        return '🏐';
      default:
        return '🏟️';
    }
  };



  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || !turf) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">
          Failed to load turf details. Please try again later.
        </Alert>
      </Container>
    );
  }



  interface CustomTabPanelProps {
    children?: React.ReactNode;
    value: number;
    index: number;
    [key: string]: any;
  }

  function CustomTabPanel(props: CustomTabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
      </div>
    );
  }

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }


const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
   setSelectedSportTab(newValue);
};


  const handleSelectedSportType = (sport_id: number, price: any) =>{
      setSelectedSport(sport_id)
      setSelectedSportPrice(price)
  }

  console.log("selectedSport:", selectedSport);
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            {turf?.name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <LocationOn sx={{ color: 'text.secondary', mr: 1 }} />
            <Typography variant="body1" color="text.secondary">
                  {turf?.address || 'Address'}
                  {/* {turf.location?.city || 'City'}, 
                  {turf.location?.state || 'State'} - 
                  {turf.location?.zipCode || 'ZIP'} */}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip
              icon={<SportsSoccer />}
              label={turf.sportType}
              color="primary"
              variant="outlined"
            />
            <Rating value={turf.rating?.average || 0} precision={0.5} readOnly />
            <Typography variant="body2" color="text.secondary">
              ({turf.rating?.count || 0} reviews)
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={4}>
          {/* Main Content */}
          <Grid item xs={12} md={7}>
            <ImageGallery images={ turf?.images } />

            {/* Show if multiple sports available */}
            {
              turf?.sports && turf.sports.length > 0 && 
               <Card sx={{ mb: 3}}>
                <CardContent>
                  <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs
                      value={selectedSportTab}
                      onChange={handleTabChange}
                      aria-label="sports tabs"
                      variant="scrollable"
                      scrollButtons="auto"
                    >
                      {turf?.sports?.map(
                        (
                          sport: { id: number; name: string; sport_type?: { name?: string } },
                          idx: number
                        ) => (
                          <Tab
                            key={sport.id}
                            label={sport.sport_type?.name || sport.name}
                            {...a11yProps(idx)}
                          />
                        )
                      )}
                    </Tabs>
                  </Box>
                  {turf?.sports?.map(
                    (
                      sport: { 
                        id: number; 
                        name: string; 
                        rate_per_hour: string,
                        dimensions?:string, 
                        capacity?: string,
                        rules?: string 
                        sport_type?: {
                           name?: string,
                        }
                      },
                      idx: number
                    ) => (
                      <CustomTabPanel value={selectedSportTab} index={idx} key={sport.id}>
                        {/* Add more sport details here if available */}
                        <Box>
                           <Typography variant="h6" className="text-lg font-semibold py-2">{sport?.sport_type?.name} Details</Typography>
                              <Typography variant="body2"><strong>Rate Per Hour:</strong> ₹{sport?.rate_per_hour}</Typography>
                              <Typography variant="body2"><strong>Dimensions:</strong> {sport?.dimensions}</Typography>
                              <Typography variant="body2"><strong>Capacity:</strong> {sport?.capacity} people</Typography>
                              <Typography variant="body2"><strong>Rules:</strong></Typography>
                              <Typography variant="body2">{sport?.rules}</Typography>
                        </Box>
                      </CustomTabPanel>
                    )
                  )}
                </CardContent>
              </Card>    
            }          
               
            {/* Description */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  About { turf?.name }
                </Typography>
                <Typography variant="body1" paragraph>
                  {turf.description}
                </Typography>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="h6" gutterBottom>
                  Turf Details
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <List dense>
                      <ListItem>
                        <ListItemIcon>
                          <SportsSoccer />
                        </ListItemIcon>
                        <ListItemText
                          primary="Sport Type"
                          // secondary={turf.sportType.charAt(0).toUpperCase() + turf.sportType.slice(1)}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <AttachMoney />
                        </ListItemIcon>
                        <ListItemText
                          primary="Price"
                          secondary={formatPrice(selectedSportPrice || 0)}
                        />
                      </ListItem>
                    </List>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <List dense>
                      <ListItem>
                        <ListItemIcon>
                          <CheckCircle />
                        </ListItemIcon>
                        <ListItemText
                          primary="Surface"
                          // secondary={turf.surface.replace('_', ' ').charAt(0).toUpperCase() + turf.surface.replace('_', ' ').slice(1)}
                        />
                      </ListItem>
                      {turf.size && (
                        <ListItem>
                          <ListItemIcon>
                            <Schedule />
                          </ListItemIcon>
                          <ListItemText
                            primary="Size"
                            secondary={`${turf.size.length} x ${turf.size.width} ${turf.size.unit}`}
                          />
                        </ListItem>
                      )}
                    </List>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Amenities */}
            {turf?.sports?.length > 0 && (
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Amenities
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {turf.sports.map((
                      sport: { 
                        id: number; 
                        name: string; 
                        rate_per_hour: string,
                        dimensions?:string, 
                        capacity?: string,
                        rules?: string 
                        sport_type?: {
                           name?: string,
                        }
                      },
                      idx: number) => (
                      <Chip key={idx} label={sport?.name} variant="outlined" />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            )}

            {/* Operating Hours */}
            {turf.timing && (
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Operating Hours
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {turf.timing}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Open on: {turf.timing}
                  </Typography>
                </CardContent>
              </Card>
            )}

            {/* Reviews Section */}
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Reviews & Ratings
                  </Typography>
                  {user && (
                    <Button
                      variant="outlined"
                      startIcon={<RateReview />}
                      onClick={() => setShowReviewForm(!showReviewForm)}
                    >
                      {showReviewForm ? 'Cancel Review' : 'Write a Review'}
                    </Button>
                  )}
                </Box>

                {showReviewForm && (
                  <ReviewForm
                    turfId={parseInt(turf.id!)}
                    turfName={turf.name}
                    onSubmit={handleReviewSubmit}
                    onCancel={() => setShowReviewForm(false)}
                  />
                )}

                <ReviewList 
                  turfId={parseInt(turf.id!)} 
                  onReviewUpdate={() => {
                    queryClient.invalidateQueries(['turf', id]);
                  }}
                  avgTurfRating={turf.rating?.average || 0}
                />
              
              </CardContent>
            </Card>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={5}>
            <Card sx={{ position: 'sticky', top: 20 }}>
              <CardContent>
                <Typography variant="h4" color="primary" gutterBottom>
                  {formatPrice(selectedSportPrice || 0)}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  per hour
                </Typography>
                <div className="booking-section">
                    <div className='sport-choose-area'>
                        {
                            turf?.sports?.map((
                              sport: { 
                                id: number; 
                                name: string; 
                                rate_per_hour: number; 
                                sport_type?: { name?: string } 
                              },
                              idx: number
                            ) =>  (
                                <div className={`option-${idx}`}  key={idx} >
                                    <input 
                                        type="radio" 
                                        className="sport-list" 
                                        name="booking-type"
                                        checked={selectedSport === sport.id}
                                        onChange={() => handleSelectedSportType(sport.id,sport.rate_per_hour)}
                                />
                                <span>{ sport.sport_type?.name || sport.name }</span>
                                </div>
                            ))
                        }
                    </div>
                </div>
                {/* <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handleBooking}
                  sx={{ mt: 2, mb: 2 }}
                >
                  Book Now
                </Button> */}

                {user && (
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<RateReview />}
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    sx={{ mb: 2 }}
                  >
                    {showReviewForm ? 'Cancel Review' : 'Write a Review'}
                  </Button>
                )}

                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Quick Info
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <Star color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Rating"
                        secondary={`${turf.rating?.average || 0}/5 (${turf.rating?.count || 0} reviews)`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle color="success" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Status"
                        secondary={turf.status ? 'Available' : 'Not Available'}
                      />
                    </ListItem>
                  </List>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Slot Booking Component */}
        {bookingDialogOpen && (
          <SlotBooking
            turfId={turf.id!}
            onBookingComplete={(booking) => {
              toast.success('Booking created successfully!');
              setBookingDialogOpen(false);
              queryClient.invalidateQueries(['bookings']);
            }}
            onClose={() => setBookingDialogOpen(false)}
          />
        )}
      </Container>
  );
};

export default TurfDetailPage; 