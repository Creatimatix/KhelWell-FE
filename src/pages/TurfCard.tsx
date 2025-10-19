import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Rating,
  Chip,
  GridProps,
} from '@mui/material';
import { LocationOn, SportsSoccer } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { formatPrice, TurfDefaultImg } from '../utils/constant';

// Type definitions
interface TurfImage {
  id: number;
  turf_id: number;
  image_path: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

interface Sport {
  id: number;
  name: string;
}

interface Rating {
  average: number;
  count: number;
}

interface Turf {
  id: number;
  name: string;
  slug: string;
  address: string;
  location: string;
  description: string;
  features: string;
  benefits: string;
  rules: string;
  min_price: number | null;
  pricing: string | null;
  rating: string | number;
  latitude: string;
  longitude: string;
  timing: string;
  images: TurfImage[];
  sports: Sport[];
  status: number;
  created_at: string;
  updated_at: string;
}

interface TurfCardProps {
  turfItem: Turf;
}

const TurfCard: React.FC<TurfCardProps> = ({ turfItem }) => {
  const navigate = useNavigate();

  if (!turfItem) {
    return null;
  }

  // Handle rating - convert string to number if needed
  const getRatingValue = (): number => {
    if (typeof turfItem.rating === 'string') {
      const parsed = parseFloat(turfItem.rating);
      return isNaN(parsed) ? 0 : parsed;
    }
    return turfItem.rating || 0;
  };

  // Get default image or use placeholder
  const getImageUrl = (): string => {
    if (turfItem.images && turfItem.images.length > 0) {
      const defaultImage = turfItem.images.find((img) => img.is_default) || turfItem.images[0];
      return defaultImage?.image_path || TurfDefaultImg;
    }
    return TurfDefaultImg;
  };

  // Get sports/type
  const getSportType = (): string => {
    if (turfItem.sports && turfItem.sports.length > 0) {
      return turfItem.sports[0].name || 'Multi-sport';
    }
    return 'Multi-sport';
  };

  const ratingValue = getRatingValue();

  const handleCardClick = (): void => {
    navigate(`/turf/${turfItem.slug}`);
  };

  const handleViewDetailsClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation();
    navigate(`/turf/${turfItem.slug}`);
  };

  return (
    <Grid item xs={12} sm={6} md={4} key={turfItem.id}>
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
        onClick={handleCardClick}
      >
        {/* Card Image */}
        <CardMedia
          component="img"
          height="200"
          image={getImageUrl()}
          alt={turfItem.name}
          sx={{
            objectFit: 'cover',
            backgroundColor: '#f0f0f0',
          }}
        />

        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Turf Name and Sport Type */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
            <Typography 
              variant="h6" 
              component="h3" 
              sx={{ flexGrow: 1, fontSize: '1rem', fontWeight: 600 }}
              noWrap
            >
              {turfItem.name}
            </Typography>
            <Chip
              label={getSportType()}
              size="small"
              icon={<SportsSoccer />}
              color="primary"
              variant="outlined"
            />
          </Box>

          {/* Location */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5, gap: 0.5 }}>
            <LocationOn sx={{ fontSize: 16, color: 'text.secondary', mt: 0.25, flexShrink: 0 }} />
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ fontSize: '0.875rem' }}
              noWrap
            >
              {turfItem.location || 'Location not specified'}
            </Typography>
          </Box>

          {/* Rating */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
            <Rating
              value={ratingValue}
              precision={0.5}
              readOnly
              size="small"
            />
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
              ({ratingValue} rating)
            </Typography>
          </Box>

          {/* Price and Button */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto', gap: 1 }}>
            <Typography 
              variant="h6" 
              color="primary" 
              sx={{ fontSize: '1.1rem', fontWeight: 600 }}
            >
              {formatPrice(turfItem.min_price)}
            </Typography>
            <Button
              variant="contained"
              size="small"
              onClick={handleViewDetailsClick}
              sx={{ textTransform: 'none' }}
            >
              View Details
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default TurfCard;