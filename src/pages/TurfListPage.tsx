import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Container,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Rating,
  Chip,
  Pagination,
  CircularProgress,
  Alert,
  InputAdornment,
} from '@mui/material';
import { Search, LocationOn, SportsSoccer } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { turfService } from '../services/turfService';
import { SearchFilters } from '../types';
import { TurfDefaultImg } from '../utils/constant';

const sportTypes = [
  'football',
  'cricket',
  'tennis',
  'basketball',
  'badminton',
  'volleyball',
  'multi-sport',
];

const TurfListPage: React.FC = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<SearchFilters>({
    page: 1,
    limit: 12,
  });
  const [searchTerm, setSearchTerm] = useState('');

  const { data: turfsResponse, isLoading, error } = useQuery(
    ['turfs', filters],
    () => turfService.getTurfs(filters),
    { keepPreviousData: true }
  );

  // Normalize backend response to expected shape used in UI
  const turfsData = React.useMemo(() => {
    if (!turfsResponse) return null;
    
    try {
      const raw = (turfsResponse as any).data || turfsResponse;

      // If raw has turfs and pagination style
      if (raw && raw.turfs) {
        const pagination = {
          currentPage: raw.turfs.current_page || 1,
          totalPages: raw.turfs.last_page || 1,
          totalItems: raw.turfs.total || (raw.turfs.data ? raw.turfs.data.length : 0),
          itemsPerPage: raw.turfs.per_page || (raw.turfs.data ? raw.turfs.data.length : 0),
        };
        return { data: raw.turfs.data || [], pagination };
      }

      // If response follows ApiResponse<T> with data and pagination
      if ((turfsResponse as any).data && (turfsResponse as any).data.length !== undefined) {
        const pagination = (turfsResponse as any).pagination || null;
        return { data: (turfsResponse as any).data, pagination };
      }

      // Fallback: return as-is if it's already matching
      return turfsResponse;
    } catch (e) {
      console.error('Error normalizing turfs response:', e);
      return null;
    }
  }, [turfsResponse]);

  const handleSearch = () => {
    console.log("searchTerm:", searchTerm)
    setFilters(prev => ({
      ...prev,
      city: searchTerm,
      page: 1,
    }));
  };

  const handleSportTypeChange = (sportType: string) => {
    setFilters(prev => ({
      ...prev,
      sportType: sportType === 'all' ? undefined : sportType,
      page: 1,
    }));
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setFilters(prev => ({
      ...prev,
      page,
    }));
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

  const formatPrice = (price: number) => {
    return `₹${price}/hour`;
  };

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">Failed to load turfs. Please try again later.</Alert>
      </Container>
    );
  }

  const normalizeRating = (v: unknown): number => {
    if (v == null) return 0;
    if (typeof v === 'number') return v;
    if (typeof v === 'string') {
      const n = parseFloat(v);
      return Number.isFinite(n) ? n : 0;
    }
    return 0;
  };


  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Find Your Perfect Turf
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Discover and book the best sports turfs in your area
        </Typography>
      </Box>

      {/* Search and Filters */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search by name, area, city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Sport Type</InputLabel>
              <Select
                value={filters.sportType || 'all'}
                onChange={(e) => handleSportTypeChange(e.target.value)}
                label="Sport Type"
              >
                <MenuItem value="all">All Sports</MenuItem>
                {sportTypes.map((sport) => (
                  <MenuItem key={sport} value={sport}>
                    {getSportIcon(sport)} {sport.charAt(0).toUpperCase() + sport.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleSearch}
              startIcon={<Search />}
            >
              Search
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Loading State */}
      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Turfs Grid */}
    {turfsData && turfsData.data && (
        <>
          <Grid container spacing={3}>
            {turfsData.data.map((turf: any) => (
              <Grid item xs={12} sm={6} md={4} key={turf.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                    },
                  }}
                  onClick={() => navigate(`/turf/${turf.slug}`)}
                >

                 {
                   (() => {
                     const defaultImage =
                       turf.images &&
                       turf.images.find((img: any) => img.is_default) ||
                       (turf.images && turf.images[0]);
                     return (
                       <CardMedia
                         component="img"
                         height="200"
                         image={defaultImage?.image_url || TurfDefaultImg}
                         alt={turf.name}
                       />
                     );
                   })()
                 }
                 
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography variant="h6" component="h3" sx={{ flexGrow: 1 }}>
                        {turf.name || turf.title || turf.turf_name}
                      </Typography>
                      <Chip
                        label={turf.sportType || turf.sport_type || 'multi-sport'}
                        size="small"
                        icon={<SportsSoccer />}
                        color="primary"
                      />
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationOn sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} />
                      <Typography variant="body2" color="text.secondary">
                        {turf?.address} 
                        {turf?.city ? ', '+turf.city : ''}
                        {turf?.state ? ', '+turf.state : ''}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Rating value={normalizeRating(turf?.average_rating ?? turf.average_rating ?? 0)} precision={0.5} readOnly size="small" />
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                        ({turf?.total_reviews || 0} reviews)
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h6" color="primary">
                        {formatPrice(turf?.min_price || 0)}
                        <sup>*</sup>
                      </Typography>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/turf/${turf.slug || turf.slug || turf.slug}`);
                        }}
                      >
                        View Details
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {turfsData.pagination && turfsData.pagination.totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={turfsData.pagination.totalPages}
                page={filters.page || 1}
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
            </Box>
          )}

          {/* No Results */}
          {turfsData.data.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No turfs found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your search criteria
              </Typography>
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default TurfListPage; 