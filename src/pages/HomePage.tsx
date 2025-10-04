import React from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Container,
  TextField,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import {
  Facebook,
  Instagram,
  Twitter,
  SportsSoccer,
  BookOnline,
  Event,
  LocationOn,
} from "@mui/icons-material";
import Logo from "../components/Logo";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  // Featured turfs mock data
  const turfs = [
    {
      name: "Green Field Turf",
      location: "Mumbai",
      price: "₹1200/hr",
      image:
        "https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf?w=800",
    },
    {
      name: "Urban Sports Arena",
      location: "Pune",
      price: "₹1500/hr",
      image:
        "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?w=800",
    },
    {
      name: "ProPlay Turf",
      location: "Bengaluru",
      price: "₹1000/hr",
      image:
        "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?w=800",
    },
    {
      name: "Elite Sports Hub",
      location: "Delhi",
      price: "₹1800/hr",
      image:
        "https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf?w=800",
    },
  ];

  // Testimonials mock data
  const testimonials = [
    {
      name: "Rahul Mehta",
      review:
        "Booking with KhelWell was super easy. The turf quality was excellent!",
    },
    {
      name: "Sneha Kapoor",
      review: "I love how convenient it is to book my weekly football sessions.",
    },
    {
      name: "Arjun Nair",
      review:
        "Great platform! Found amazing tournaments and joined effortlessly.",
    },
  ];

  // Features
  const features = [
    {
      icon: <SportsSoccer sx={{ fontSize: 40 }} />,
      title: "Premium Turfs",
      description: "Find and book the best sports turfs in your area",
    },
    {
      icon: <BookOnline sx={{ fontSize: 40 }} />,
      title: "Easy Booking",
      description: "Book your preferred time slot with just a few clicks",
    },
    {
      icon: <Event sx={{ fontSize: 40 }} />,
      title: "Sports Events",
      description: "Participate in tournaments and events",
    },
    {
      icon: <LocationOn sx={{ fontSize: 40 }} />,
      title: "Multiple Locations",
      description: "Turfs available across different locations",
    },
  ];

  // Slider settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 960,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          position: "relative",
          color: "white",
          textAlign: "center",
          py: 12,
          backgroundImage:
            "url('https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf?w=1600')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Container maxWidth="md">
          <Logo variant="default" size="large" color="white" />
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            Find & Book Sports Turfs Instantly
          </Typography>
          <Typography variant="h6" sx={{ mb: 4 }}>
            Football · Cricket · Tennis · Badminton & more
          </Typography>

          {/* Search Form */}
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} sm={4}>
              <TextField
                select
                fullWidth
                label="Select City"
                variant="outlined"
                sx={{ bgcolor: "white", borderRadius: 1 }}
              >
                <MenuItem value="Mumbai">Mumbai</MenuItem>
                <MenuItem value="Pune">Pune</MenuItem>
                <MenuItem value="Delhi">Delhi</MenuItem>
                <MenuItem value="Bengaluru">Bengaluru</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                select
                fullWidth
                label="Select Sport"
                variant="outlined"
                sx={{ bgcolor: "white", borderRadius: 1 }}
              >
                <MenuItem value="Football">Football</MenuItem>
                <MenuItem value="Cricket">Cricket</MenuItem>
                <MenuItem value="Tennis">Tennis</MenuItem>
                <MenuItem value="Badminton">Badminton</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                fullWidth
                size="large"
                variant="contained"
                sx={{ height: "100%" }}
                onClick={() => navigate("/turfs")}
              >
                Search
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Featured Turfs */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" textAlign="center" gutterBottom>
          Featured Turfs
        </Typography>
        <Slider {...sliderSettings}>
          {turfs.map((turf, index) => (
            <Box key={index} px={2}>
              <Card sx={{ borderRadius: 3, overflow: "hidden" }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={turf.image}
                  alt={turf.name}
                />
                <CardContent>
                  <Typography variant="h6">{turf.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {turf.location}
                  </Typography>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {turf.price}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Slider>
      </Container>

      {/* Why Choose Us */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" textAlign="center" gutterBottom>
          Why Choose KhelWell?
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  textAlign: "center",
                  p: 3,
                  borderRadius: 3,
                  boxShadow: 3,
                  transition: "all 0.3s ease",
                  "&:hover": { transform: "translateY(-6px)" },
                }}
              >
                <Box color="primary.main" mb={2}>
                  {feature.icon}
                </Box>
                <Typography variant="h6">{feature.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Testimonials */}
      <Box sx={{ bgcolor: "#f9f9f9", py: 8 }}>
        <Container maxWidth="md">
          <Typography variant="h4" textAlign="center" gutterBottom>
            What Our Players Say
          </Typography>
          <Slider {...sliderSettings}>
            {testimonials.map((t, i) => (
              <Box key={i} px={2}>
                <Card
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    textAlign: "center",
                    minHeight: 180,
                  }}
                >
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    “{t.review}”
                  </Typography>
                  <Typography variant="subtitle1" fontWeight="bold">
                    - {t.name}
                  </Typography>
                </Card>
              </Box>
            ))}
          </Slider>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          py: 8,
          textAlign: "center",
          background:
            "linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)",
          color: "white",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Ready to Play?
        </Typography>
        <Button
          variant="contained"
          size="large"
          sx={{ mt: 2, bgcolor: "white", color: "green" }}
          onClick={() => navigate("/turfs")}
        >
          Start Booking Now
        </Button>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: "#1b5e20", color: "white", py: 4 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Logo variant="default" size="medium" color="white" />
              <Typography variant="body2" sx={{ mt: 2 }}>
                © {new Date().getFullYear()} KhelWell. All rights reserved.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Quick Links
              </Typography>
              <Typography variant="body2">About Us</Typography>
              <Typography variant="body2">Contact</Typography>
              <Typography variant="body2">Privacy Policy</Typography>
              <Typography variant="body2">Terms & Conditions</Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Follow Us
              </Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Facebook />
                <Instagram />
                <Twitter />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
