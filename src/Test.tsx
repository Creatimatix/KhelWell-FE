import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Box,
  Button,
  Card,
  CardContent,
  Paper,
  Avatar,
} from "@mui/material";
import {
  SportsSoccer,
  SportsCricket,
  SportsTennis,
  SportsBasketball,
  SportsHandball,
  SportsVolleyball,
  SportsMartialArts,
  CheckCircle,
  People,
  Event,
  LocationOn,
  Star,
  TrendingUp,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Header from "./components/Header/Header";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  // "Everything You Need for Sports" cards
  const essentials = [
    {
      title: "Instant Booking",
      items: [
        "Real-time availability",
        "Instant confirmation",
        "Flexible scheduling",
        "Easy cancellation",
      ],
    },
    {
      title: "Sports Events",
      items: [
        "Tournament registration",
        "Team management",
        "Event tracking",
        "Prize pools",
      ],
    },
    {
      title: "Premium Locations",
      items: [
        "Multiple locations",
        "Quality facilities",
        "Professional maintenance",
        "Safety standards",
      ],
    },
    {
      title: "Secure Payments",
      items: [
        "Multiple payment methods",
        "Secure transactions",
        "Payment history",
        "Refund policy",
      ],
    },
  ];

  // Sports grid
  const sports = [
    { icon: <SportsSoccer />, name: "Football" },
    { icon: <SportsCricket />, name: "Cricket" },
    { icon: <SportsTennis />, name: "Tennis" },
    { icon: <SportsBasketball />, name: "Basketball" },
    { icon: <SportsHandball />, name: "Badminton" },
    { icon: <SportsVolleyball />, name: "Volleyball" },
    { icon: <SportsMartialArts />, name: "Karate" },
  ];

  // Stats
  const stats = [
    { number: "500+", label: "Premium Turfs", sub: "Across multiple cities" },
    { number: "50K+", label: "Active Users", sub: "Sports enthusiasts" },
    { number: "1000+", label: "Events Hosted", sub: "Tournaments & leagues" },
    { number: "4.8", label: "User Rating", sub: "Average satisfaction" },
    { number: "95%", label: "Success Rate", sub: "Booking completion" },
    { number: "25+", label: "Cities Covered", sub: "Pan India presence" },
  ];

  // Testimonials
  const testimonials = [
    {
      name: "Rahul Sharma",
      role: "Football Enthusiast",
      review:
        "KhelWell has transformed how I book turfs. The interface is simple, and I can now book games with friends instantly!",
    },
    {
      name: "Sneha Reddy",
      role: "Basketball Player",
      review:
        "Organizing matches is so easy. The recent tournament I joined was fantastic. Highly recommend KhelWell!",
    },
    {
      name: "Vikram Singh",
      role: "Turf Owner",
      review:
        "As a turf owner, KhelWell has helped me reach more customers and manage bookings efficiently.",
    },
  ];

  return (
    <Box>
      {/* Header */}
      <Header />
  
      {/* Hero */}
      <Box
        sx={{
          py: 10,
          background: "linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)",
          color: "white",
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" fontWeight="bold" gutterBottom>
                Your Sports Journey{" "}
                <Box component="span" color="yellow">
                  Starts Here
                </Box>
              </Typography>
              <Typography variant="h6" sx={{ mb: 4 }}>
                Book premium sports turfs, join exciting tournaments, and
                connect with sports enthusiasts. Your ultimate destination for
                everything sports.
              </Typography>
              <Box display="flex" gap={2} mb={4}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate("/register")}
                >
                  Get Started Free
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate("/turfs")}
                  sx={{ color: "white", borderColor: "white" }}
                >
                  Browse Turfs
                </Button>
              </Box>
              <Box display="flex" gap={6}>
                <Box textAlign="center">
                  <Typography variant="h4">50+</Typography>
                  <Typography>Premium Turfs</Typography>
                </Box>
                <Box textAlign="center">
                  <Typography variant="h4">1000+</Typography>
                  <Typography>Happy Users</Typography>
                </Box>
                <Box textAlign="center">
                  <Typography variant="h4">24/7</Typography>
                  <Typography>Support</Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 4, borderRadius: 3 }}>
                <Typography variant="h5" gutterBottom>
                  Why Choose KhelWell?
                </Typography>
                {[
                  {
                    title: "Quick & Easy",
                    desc: "Book your slot in under 30 seconds.",
                  },
                  {
                    title: "Verified Facilities",
                    desc: "All turfs are verified and well-maintained.",
                  },
                  {
                    title: "24/7 Support",
                    desc: "Our support team is always available.",
                  },
                  {
                    title: "Best Prices",
                    desc: "Competitive pricing with no hidden charges.",
                  },
                ].map((f, i) => (
                  <Box display="flex" mb={2} key={i}>
                    <CheckCircle color="success" sx={{ mr: 1 }} />
                    <Box>
                      <Typography variant="subtitle1">{f.title}</Typography>
                      <Typography variant="body2">{f.desc}</Typography>
                    </Box>
                  </Box>
                ))}
                <Box mt={2} p={2} bgcolor="#e8f5e9" borderRadius={2}>
                  <Typography variant="body1" fontWeight="bold">
                    🎉 Join the Sports Revolution!
                  </Typography>
                  <Typography variant="body2">
                    Be part of a growing community of sports enthusiasts. Book,
                    play, compete, and win!
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Everything You Need for Sports */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" textAlign="center" gutterBottom>
          Everything You Need for Sports
        </Typography>
        <Typography variant="h6" textAlign="center" sx={{ mb: 6 }}>
          From booking turfs to joining tournaments, we've got everything
          covered for your sports journey.
        </Typography>
        <Grid container spacing={4}>
          {essentials.map((e, i) => (
            <Grid item xs={12} md={3} key={i}>
              <Card sx={{ p: 3, borderRadius: 3 }}>
                <Typography variant="h6" gutterBottom>
                  {e.title}
                </Typography>
                {e.items.map((item, idx) => (
                  <Box display="flex" alignItems="center" mb={1} key={idx}>
                    <CheckCircle color="success" sx={{ mr: 1, fontSize: 18 }} />
                    <Typography variant="body2">{item}</Typography>
                  </Box>
                ))}
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Sports We Support */}
      <Box sx={{ bgcolor: "#f9f9f9", py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" textAlign="center" gutterBottom>
            Sports We Support
          </Typography>
          <Typography variant="h6" textAlign="center" sx={{ mb: 4 }}>
            From football to tennis, we have facilities for all your favorite
            sports.
          </Typography>
          <Grid container spacing={3} justifyContent="center">
            {sports.map((s, i) => (
              <Grid item xs={6} sm={4} md={2} key={i}>
                <Card sx={{ textAlign: "center", py: 3 }}>
                  <Box mb={1} color="primary.main">
                    {s.icon}
                  </Box>
                  <Typography>{s.name}</Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" textAlign="center" gutterBottom>
          KhelWell by the Numbers
        </Typography>
        <Typography variant="h6" textAlign="center" sx={{ mb: 6 }}>
          Join thousands of sports enthusiasts who trust KhelWell for their turf
          bookings and events.
        </Typography>
        <Grid container spacing={4}>
          {stats.map((st, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Paper sx={{ p: 4, textAlign: "center", borderRadius: 3 }}>
                <Typography variant="h3">{st.number}</Typography>
                <Typography variant="h6">{st.label}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {st.sub}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
        <Box
          mt={6}
          p={3}
          textAlign="center"
          bgcolor="#f1f8e9"
          borderRadius={2}
        >
          🏆 Trusted by Sports Enthusiasts Nationwide
        </Box>
      </Container>

      {/* Testimonials */}
      <Box sx={{ bgcolor: "#f9f9f9", py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" textAlign="center" gutterBottom>
            What Our Users Say
          </Typography>
          <Typography variant="h6" textAlign="center" sx={{ mb: 6 }}>
            Join thousands of satisfied sports enthusiasts who trust KhelWell
          </Typography>
          <Grid container spacing={4}>
            {testimonials.map((t, i) => (
              <Grid item xs={12} md={4} key={i}>
                <Card sx={{ p: 3, borderRadius: 3 }}>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    “{t.review}”
                  </Typography>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {t.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t.role}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Box
            mt={6}
            textAlign="center"
            bgcolor="#ede7f6"
            p={3}
            borderRadius={2}
          >
            ⭐ 4.8/5 Average Rating — Based on 10,000+ reviews from satisfied
            users
          </Box>
        </Container>
      </Box>

      {/* Final CTA */}
      <Box sx={{ py: 8, textAlign: "center", bgcolor: "#2e7d32", color: "white" }}>
        <Typography variant="h4" gutterBottom>
          Ready to Start Your Sports Journey?
        </Typography>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Join thousands of sports enthusiasts who trust KhelWell for their
          sports needs.
        </Typography>
        <Button
          variant="contained"
          sx={{ bgcolor: "white", color: "green", mr: 2 }}
          onClick={() => navigate("/register")}
        >
          Sign Up Now
        </Button>
        <Button variant="outlined" sx={{ color: "white", borderColor: "white" }} onClick={() => navigate("/login")}>
          Login
        </Button>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: "#111", color: "white", py: 3, textAlign: "center" }}>
        © {new Date().getFullYear()} KhelWell. Your Game. Your Journey. All in
        One Place.
      </Box>
    </Box>
  );
};

export default HomePage;
