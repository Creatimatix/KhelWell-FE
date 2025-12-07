

import React from "react";
import {
    Box,
  Button,
  Card,
  Container,
  Grid,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import {
  Search,
  EventAvailable,
  SportsSoccer,
  PostAdd,
  Group,
  CheckCircleOutline,
  CalendarToday,
  Person,
} from "@mui/icons-material";
import { InfoOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

// Single source of truth for the color system — tweak these to re-theme the page
export const THEME_COLORS = {
  primary: "#2A7F62",
  primaryDark: "#1E5A46",
  secondary: "#A2D5C6",
  accent: "#7BCFB1",
  accentLight: "#DFF6ED",
  bg: "#F6FFFA",
  text: "#1A1A1A",
  muted: "#E8F5F0"
};

// Realistic-ish Hero SVG (non-faced silhouettes, turf texture, goal, simple stands)
const HeroSVG: React.FC<{ sx?: any }> = ({ sx }) => (
  <Box sx={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", ...sx }}>
    {/* HERO BANNER (primary image replacing the animation) */}
    <img
      src={process.env.PUBLIC_URL + "/Banner.png"}
      alt="Banner"
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        position: "relative",
        zIndex: 0,
      }}
    />

    {/* OPTIONAL FLOATING MINI-ANIMATIONS (top layer) */}
    <img
      src={process.env.PUBLIC_URL + "/animations/mini-cricket.webp"}
      alt="Cricket"
      style={{ position: "absolute", left: "8%", top: "20%", width: 120, zIndex: 1 }}
    />
    <img
      src={process.env.PUBLIC_URL + "/animations/mini-football.webp"}
      alt="Football"
      style={{ position: "absolute", right: "10%", top: "30%", width: 130, zIndex: 1 }}
    />
    <img
      src={process.env.PUBLIC_URL + "/animations/mini-badminton.webp"}
      alt="Badminton"
      style={{ position: "absolute", left: "40%", top: "5%", width: 110, zIndex: 1 }}
    />
    <img
      src={process.env.PUBLIC_URL + "/animations/mini-tennis.webp"}
      alt="Tennis"
      style={{ position: "absolute", right: "30%", top: "12%", width: 110, zIndex: 1 }}
    />
    <img
      src={process.env.PUBLIC_URL + "/animations/mini-volleyball.webp"}
      alt="Volleyball"
      style={{ position: "absolute", left: "25%", bottom: "12%", width: 120, zIndex: 1 }}
    />
    <img
      src={process.env.PUBLIC_URL + "/animations/mini-karate.webp"}
      alt="Karate"
      style={{ position: "absolute", right: "25%", bottom: "10%", width: 120, zIndex: 1 }}
    />
  </Box>
);

// Small feature checkmark icon (tuned to theme)
const FeatureSVG: React.FC<{ sx?: any }> = ({ sx }) => (
  <Box component="svg" viewBox="0 0 80 80" sx={{ width: 56, height: 56, ...sx }}>
    <rect x="2" y="2" width="76" height="76" rx="12" fill={THEME_COLORS.secondary} />
    <path d="M20 44 L34 56 L58 26" stroke={THEME_COLORS.primary} strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </Box>
);


// Simple Book Cricket mini-game
//

const BookCricket: React.FC = () => {
  const BALLS_PER_OVER = 6;
  const DEFAULT_PAGES_POOL = 50;

  // editable overs (not fixed). Defaults to 2 overs but user can change.
  const [oversInput, setOversInput] = React.useState<number>(2);
  const [overs, setOvers] = React.useState<number>(2);

  // pool of pages (outcome is derived from page number's last digit)
  const pagesCount = DEFAULT_PAGES_POOL;

  // game state
  const [flipsDone, setFlipsDone] = React.useState<number>(0); // total flips/bowls done
  const [score, setScore] = React.useState<number>(0);
  const [wickets, setWickets] = React.useState<number>(0);
  const [history, setHistory] = React.useState<string[]>([]);

  // UI / animation state
  const [isFlipping, setIsFlipping] = React.useState<boolean>(false);
  const [currentPageNumber, setCurrentPageNumber] = React.useState<number | null>(null);
  const [currentReveal, setCurrentReveal] = React.useState<string | null>(null);
  const [coverVisible, setCoverVisible] = React.useState<boolean>(true);

  // game control
  const [gameOver, setGameOver] = React.useState<boolean>(false);

  // rules dialog
  const [rulesOpen, setRulesOpen] = React.useState<boolean>(false);

  const timeouts = React.useRef<ReturnType<typeof setTimeout>[]>([]);
  React.useEffect(() => {
    return () => {
      timeouts.current.forEach((t) => clearTimeout(t));
      timeouts.current = [];
    };
  }, []);

  const ballsBowled = flipsDone;
  const ballsRemaining = Math.max(0, overs * BALLS_PER_OVER - ballsBowled);
  const oversBowled = Math.floor(ballsBowled / BALLS_PER_OVER);

  // friendly label for outcome
  const labelForOutcome = (o: string | null) => {
    if (!o) return "-";
    if (o === "W" || o === "0") return "Oops!";
    if (o === "1" || o === "2") return "Nice shot!";
    if (o === "4") return "Boundary!";
    if (o === "6") return "Sixer!";
    return o;
  };

  // derive outcome from final page number's last digit
  const outcomeFromPageNum = (pageNum: number): string => {
    const d = Math.abs(pageNum) % 10;
    if (d === 0) return "W";
    if (d === 1) return "1";
    if (d === 2) return "2";
    if (d === 4) return "4";
    if (d === 6) return "6";
    return "0";
  };

  // Play Ball: show page number immediately, then reveal friendly label and update score/wicket.
  // Stops the game if wicket occurs or overs completed.
  const playBall = () => {
    if (isFlipping || gameOver) return;

    setIsFlipping(true);
    setCoverVisible(false);

    // pick random page (1..pagesCount)
    const pageNum = Math.floor(Math.random() * pagesCount) + 1;
    setCurrentPageNumber(pageNum);

    const SHOW_PAGE_MS = 1000;
    const REVEAL_MS = 1000;

    // After showing page number, compute outcome and reveal
    const tReveal = setTimeout(() => {
      const outcome = outcomeFromPageNum(pageNum);
      const friendly = labelForOutcome(outcome);
      setCurrentReveal(friendly);

      // apply outcome
      if (outcome === "W") {
        setWickets((w) => w + 1);
        setGameOver(true); // game should stop on wicket
      } else if (outcome !== "0") {
        // numeric run
        const parsed = parseInt(outcome, 10);
        if (!Number.isNaN(parsed)) {
          setScore((s) => s + parsed);
        }
      }

      setHistory((h) => [outcome, ...h].slice(0, 24));
    }, SHOW_PAGE_MS);
    timeouts.current.push(tReveal);

    // After reveal hold, return to cover and finalize flips / check overs
    const tFinish = setTimeout(() => {
      setCurrentReveal(null);
      setCurrentPageNumber(null);
      setCoverVisible(true);

      setFlipsDone((f) => {
        const next = f + 1;
        // if overs completed, mark game over
        if (next >= overs * BALLS_PER_OVER) {
          setGameOver(true);
        }
        return next;
      });

      // if wicket already set gameOver earlier, keep it; otherwise check again
      setIsFlipping(false);
    }, SHOW_PAGE_MS + REVEAL_MS);
    timeouts.current.push(tFinish);
  };

  const resetGame = (keepOvers = true) => {
    timeouts.current.forEach((t) => clearTimeout(t));
    timeouts.current = [];

    setFlipsDone(0);
    setScore(0);
    setWickets(0);
    setHistory([]);
    setIsFlipping(false);
    setCurrentPageNumber(null);
    setCurrentReveal(null);
    setCoverVisible(true);
    setGameOver(false);

    if (!keepOvers) {
      setOvers(oversInput || 1);
    }
  };

  // when user edits overs input and confirms, update overs used for the session
  const applyOvers = () => {
    const val = Math.max(1, Math.floor(Number(oversInput) || 1));
    setOvers(val);
    // reset counts to start fresh with new overs
    resetGame(true);
  };

  return (
    <Box sx={{ mx: "auto", maxWidth: 1200, px: { xs: 2, md: 6 }, py: { xs: 3, md: 4 } }}>
      <Card variant="outlined" sx={{ p: 3, position: "relative" }}>
        {/* Info icon top-right */}
        <Box sx={{ position: "absolute", right: 12, top: 12, zIndex: 99 }}>
          <Tooltip title="Game rules">
            <IconButton size="small" onClick={() => setRulesOpen(true)}>
              <InfoOutlined />
            </IconButton>
          </Tooltip>
        </Box>

        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <Typography variant="h6" fontWeight={700}>Book Cricket — Flick & Reveal</Typography>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Click Play Ball — a random page number is shown, then the outcome is revealed. Game stops on wicket or when selected overs complete.
            </Typography>

            <Box sx={{ display: "flex", gap: 1, mb: 2, alignItems: "center" }}>
              <Button variant="contained" onClick={playBall} disabled={isFlipping || gameOver || ballsRemaining <= 0}>
                Play Ball
              </Button>

              <Button variant="outlined" onClick={() => resetGame(true)}>Reset</Button>

              <TextField
                label="Overs"
                size="small"
                type="number"
                inputProps={{ min: 1, step: 1 }}
                value={oversInput}
                onChange={(e) => setOversInput(Number(e.target.value))}
                onKeyDown={(e) => { if (e.key === "Enter") applyOvers(); }}
                sx={{ width: 100 }}
              />
              <Button size="small" onClick={applyOvers}>Set</Button>
            </Box>

            <Typography variant="body2" sx={{ mt: 1 }}>Flips: {flipsDone} • Overs selected: {overs}</Typography>
            <Typography variant="body2">Wickets: {wickets}</Typography>
            {gameOver && (
              <Typography variant="subtitle2" color="error" sx={{ mt: 1 }}>
                Game over {wickets > 0 ? "(Wicket)" : "(Overs complete)"}
              </Typography>
            )}
          </Grid>

          <Grid item xs={12} md={4} sx={{ display: "flex", justifyContent: "center" }}>
            <Box sx={{ width: 260, height: 170, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {/* PLAYBOOK cover */}
              <Box
                sx={{
                  position: "absolute",
                  width: "92%",
                  height: "86%",
                  bgcolor: THEME_COLORS.primary,
                  borderRadius: 1.5,
                  boxShadow: "0 12px 36px rgba(18,60,46,0.12)",
                  zIndex: 20,
                  display: coverVisible ? "flex" : "none",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontWeight: 900,
                }}
              >
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 900, letterSpacing: 1 }}>PLAYBOOK</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.95 }}>{isFlipping ? "Working..." : "Tap Play Ball"}</Typography>
                </Box>
              </Box>

              {/* stacked static pages */}
              <Box sx={{ position: "absolute", width: "76%", height: "70%", zIndex: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {Array.from({ length: 8 }).map((_, i) => (
                  <Box key={i} sx={{ position: "absolute", width: "100%", height: "100%", top: `${i * 1.6}px`, left: `${i * 0.6}px`, bgcolor: "white", borderRadius: 0.9, boxShadow: "0 6px 18px rgba(0,0,0,0.06)", zIndex: i + 5 }} />
                ))}
              </Box>

              {/* page layer */}
              <Box sx={{ position: "absolute", width: "76%", height: "70%", zIndex: 30, display: coverVisible ? "none" : "flex", alignItems: "center", justifyContent: "center" }}>
                {currentPageNumber && !currentReveal && (
                  <Box sx={{ width: "100%", height: "100%", bgcolor: "white", borderRadius: 0.9, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 26px rgba(0,0,0,0.10)" }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>Page {currentPageNumber}</Typography>
                    <Typography variant="caption" color="text.secondary">Reading...</Typography>
                  </Box>
                )}

                {currentReveal && (
                  <Box sx={{ width: "100%", height: "100%", bgcolor: THEME_COLORS.primaryDark, color: "white", borderRadius: 0.9, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxShadow: "0 12px 36px rgba(0,0,0,0.12)" }}>
                    <Typography variant="h5" sx={{ fontWeight: 900 }}>{currentReveal}</Typography>
                  </Box>
                )}
              </Box>
            </Box>

            <Typography variant="caption" sx={{ display: "block", mt: 1, textAlign: "center" }}>Flips: {flipsDone}</Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2">Last deliveries</Typography>
            <Box sx={{ display: "flex", gap: 1, mt: 1, flexWrap: "wrap" }}>
              {history.length === 0 ? (
                <Typography variant="body2" color="text.secondary">No balls yet</Typography>
              ) : (
                history.map((h, i) => (
                 <Box key={i} sx={{ px: 1.25, py: 0.5, bgcolor: THEME_COLORS.accentLight, borderRadius: 1 }}>
                  {/* show actual score symbol from the page (W / 0 / 1 / 2 / 4 / 6) */}
                  <Typography variant="body2" fontWeight={700}>
                    {h}
                  </Typography>
              </Box>
              ))
              )}
            </Box>

            <Typography variant="caption" display="block" sx={{ mt: 2, color: "text.secondary" }}>
              Overs: {oversBowled}.{Math.max(0, ballsBowled % BALLS_PER_OVER)} {gameOver ? "(Game Over)" : ""}
            </Typography>

            <Paper elevation={0} sx={{ mt: 2, p: 2, bgcolor: THEME_COLORS.muted, textAlign: "center" }}>
              <Typography variant="h4" fontWeight={900}>{score}</Typography>
              <Typography variant="caption" color="text.secondary">Total Score</Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Rules dialog */}
        <Dialog open={rulesOpen} onClose={() => setRulesOpen(false)}>
          <DialogTitle>Book Cricket — Rules</DialogTitle>
          <DialogContent>
            <Typography variant="body2" paragraph>
              - Set overs (any positive integer). Each Play Ball is one delivery (ball).
            </Typography>
            <Typography variant="body2" paragraph>
              - When you click Play Ball a random page number (1..50) is shown, then outcome is derived from the page number's last digit:
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText primary="Page ending with 1 → 1 run" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Page ending with 2 → 2 runs" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Page ending with 4 → 4 runs" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Page ending with 6 → 6 runs" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Page ending with 0 → Wicket (game ends)" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Any other last digit → 0 (dot)" />
              </ListItem>
            </List>
            <Typography variant="body2" paragraph>
              - Game also ends when selected overs are completed.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setRulesOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </Card>
    </Box>
  );
};


// Cricket Game code ends here



// HowTo illustration — realistic desk + phone + calendar motif
const HowToSVG: React.FC<{ sx?: any }> = ({ sx }) => (
  <Box component="svg" viewBox="0 0 680 420" sx={{ width: "100%", height: "100%", ...sx }}>
    <defs>
      <linearGradient id="cardGrad" x1="0" x2="1">
        <stop offset="0" stopColor={THEME_COLORS.secondary} />
        <stop offset="1" stopColor="#FFFFFF" />
      </linearGradient>
    </defs>
    <rect x="0" y="0" width="100%" height="100%" rx="14" fill="url(#cardGrad)" />

    {/* phone with booking card */}
    <g transform="translate(40,40)">
      <rect x="0" y="0" width="220" height="360" rx="18" fill="#FFF" stroke="#E6F3EC" strokeWidth="2" />
      <rect x="20" y="30" width="180" height="120" rx="10" fill={THEME_COLORS.primary} opacity="0.15" />
      <rect x="20" y="170" width="180" height="28" rx="8" fill="#F2F7F3" />
      <rect x="20" y="210" width="140" height="18" rx="6" fill="#F6FBF8" />
    </g>

    {/* calendar */}
    <g transform="translate(300,60)">
      <rect x="0" y="0" width="220" height="200" rx="10" fill="#FFF" stroke="#E6F3EC" strokeWidth="1.5" />
      <rect x="14" y="16" width="60" height="18" rx="6" fill={THEME_COLORS.primary} opacity="0.12" />
      <g transform="translate(14,60)" fill="#123C2E" opacity="0.95">
        {Array.from({ length: 3 }).map((_, r) => (
          <g key={r} transform={`translate(0,${r * 28})`}>
            <rect width="60" height="18" rx="6" fill="#F6FBF8" />
          </g>
        ))}
      </g>
    </g>

    {/* flow arrow */}
    <path d="M260 220 q40 30 80 0" stroke={THEME_COLORS.muted} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </Box>
);

// Connect SVG — people nodes and connecting lines
const ConnectSVG: React.FC<{ sx?: any }> = ({ sx }) => (
  <Box component="svg" viewBox="0 0 360 160" sx={{ width: "100%", height: "100%", ...sx }}>
    <g fill="none" stroke={THEME_COLORS.primary} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 100 C70 20, 140 20, 180 100" />
      <circle cx="40" cy="60" r="14" fill={THEME_COLORS.secondary} stroke={THEME_COLORS.primary} />
      <circle cx="160" cy="60" r="14" fill={THEME_COLORS.secondary} stroke={THEME_COLORS.primary} />
      <circle cx="260" cy="60" r="14" fill={THEME_COLORS.secondary} stroke={THEME_COLORS.primary} />
    </g>
  </Box>
);

// Sports SVG used in hero right column (compact)
const SportsSVG: React.FC<{ sx?: any }> = ({ sx }) => (
  <Box
    sx={{
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      // ensure no border/shadow on the wrapper
      boxShadow: "none",
      border: "none",
      background: "transparent",
      ...sx,
    }}
  >
    <Box
      component="img"
      src={process.env.PUBLIC_URL + "/Banner1.png"}
      alt="Hero banner"
      sx={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        borderRadius: 0,
        display: "block",
        // ensure image itself shows no border/shadow
        boxShadow: "none",
        border: "none",
      }}
    />
  </Box>
);

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const quickFeatures = [
    {
      title: "Search playgrounds",
      desc: "Filter by sport, location, date and amenities. Preview turf photos, pricing and available slots.",
      icon: <Search fontSize="large" sx={{ color: THEME_COLORS.primary }} />,
    },
    {
      title: "Book playground",
      desc: "Select slot, add extras and pay securely. Receive instant confirmation and e-ticket.",
      icon: <EventAvailable fontSize="large" sx={{ color: THEME_COLORS.primary }} />,
    },
    {
      title: "Challenge Teams",
      desc: "Create matches, invite teams or accept challenges. Manage rules, fees and team sizes.",
      icon: <Group fontSize="large" sx={{ color: THEME_COLORS.primary }} />,
    },
    {
      title: "Play & Track",
      desc: "Check-in, play and record scores. Match history syncs to your profile and calendar.",
      icon: <SportsSoccer fontSize="large" sx={{ color: THEME_COLORS.primary }} />,
    },
    {
      title: "Post Activities",
      desc: "Publish practices, trials or tournaments. Manage registrations and communication.",
      icon: <PostAdd fontSize="large" sx={{ color: THEME_COLORS.primary }} />,
    },
    {
      title: "Connect",
      desc: "Discover players and teams by skill, location or availability. Message to organize games.",
      icon: <CheckCircleOutline fontSize="large" sx={{ color: THEME_COLORS.primary }} />,
    },
  ];

  const howSteps = [
    {
      title: "Find a playground",
      text: "Search by location, sport and preferred time. Compare photos, amenities and slot availability.",
      icon: <Search sx={{ color: THEME_COLORS.primary }} />,
    },
    {
      title: "Select & confirm",
      text: "Choose a slot, select add-ons (balls, coaching), confirm rules and complete payment.",
      icon: <CalendarToday sx={{ color: THEME_COLORS.primary }} />,
    },
    {
      title: "Invite & organize",
      text: "Invite teammates or accept challengers. Use built-in messaging to finalize teams and fees.",
      icon: <Person sx={{ color: THEME_COLORS.primary }} />,
    },
    {
      title: "Play & log",
      text: "Check in on arrival, play the match and save results to your profile and team calendar.",
      icon: <SportsSoccer sx={{ color: THEME_COLORS.primary }} />,
    },
  ];

  const testimonials = [
    { name: "Rahul S.", text: "Easy booking and reliable turfs. Great experience." },
    { name: "Sneha R.", text: "Tournament management and scheduling made simple." },
  ];

  return (
    <Box sx={{ bgcolor: THEME_COLORS.bg, color: THEME_COLORS.text, minHeight: "100vh" }}>
      {/* Hero */}
      <Box component="header" sx={{ width: "100%", position: "relative" }}>
        <Box
          sx={{
            width: "100vw",
            marginLeft: "50%",
            transform: "translateX(-50%)",
            background: `linear-gradient(90deg, ${THEME_COLORS.primary} 0%, ${THEME_COLORS.accent} 100%)`,
            color: "white",
            pt: { xs: 6, md: 8 },
            pb: { xs: 6, md: 10 },
            borderBottomLeftRadius: 24,
            borderBottomRightRadius: 24,
            boxShadow: '0 20px 40px rgba(18,60,46,0.04)'
          }}
        >
          <Container maxWidth={false} sx={{ px: 0 }}>
            <Box sx={{ mx: "auto", maxWidth: 1400, px: { xs: 2, md: 6 } }}>
              <Grid container spacing={4} alignItems="center">
                <Grid item xs={12} md={6}>
                  <Typography variant="h3" fontWeight={800} gutterBottom sx={{ color: "common.white", letterSpacing: '-0.02em' }}>
                    Book playgrounds. Organize matches. Play together.
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 3, color: "rgba(255,255,255,0.95)" }}>
                    A simple, reliable portal to find turfs, schedule games and connect with players and teams.
                  </Typography>

                  <Box display="flex" gap={2} flexWrap="wrap" mb={3}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => navigate("/turfs")}
                      sx={{
                        bgcolor: THEME_COLORS.accentLight,
                        color: THEME_COLORS.primaryDark,
                        fontWeight: 700,
                        px: 4,
                        py: 1.5,
                        boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                        '&:hover': { bgcolor: THEME_COLORS.accent }
                      }}
                    >
                      Browse Turfs
                    </Button>

                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => navigate("/register")}
                      sx={{
                        bgcolor: 'rgba(255,255,255,0.92)',
                        color: THEME_COLORS.primaryDark,
                        fontWeight: 700,
                        px: 4,
                        py: 1.5,
                        border: '1px solid rgba(255,255,255,0.6)',
                        boxShadow: '0 4px 14px rgba(0,0,0,0.18)',
                        '&:hover': { bgcolor: '#fff' }
                      }}
                    >
                      Create Account
                    </Button>
                  </Box>

                  <Box display="flex" gap={2}>
                    <Paper elevation={0} sx={{ px: 3, py: 1, display: 'flex', gap: 2, alignItems: 'center', background: 'rgba(255,255,255,0.18)', borderRadius: 2 }}>
                      <Search sx={{ color: 'white' }} />
                      <Typography variant="body2" sx={{ color: 'white' }}>Search turfs near you</Typography>
                    </Paper>
                    <Paper elevation={0} sx={{ px: 3, py: 1, display: 'flex', gap: 2, alignItems: 'center', background: 'rgba(255,255,255,0.12)', borderRadius: 2 }}>
                      <EventAvailable sx={{ color: 'white' }} />
                      <Typography variant="body2" sx={{ color: 'white' }}>Instant booking</Typography>
                    </Paper>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box sx={{ width: '100%', height: { xs: 220, md: 420 }, borderRadius: 2, overflow: 'hidden', boxShadow: 0 }}>
                    <SportsSVG sx={{ display: { xs: 'none', md: 'block' } }} />
                    <HeroSVG sx={{ display: { xs: 'block', md: 'none' } }} />
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Container>
        </Box>
      </Box>

      <BookCricket />

      {/* How to book & play */}
      <Box component="section" sx={{ width: '100%', py: { xs: 5, md: 8 } }}>
        <Container maxWidth={false} sx={{ px: 0 }}>
          <Box sx={{ mx: 'auto', maxWidth: 1200, px: { xs: 2, md: 6 } }}>
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={7}>
                <Typography variant="h5" gutterBottom sx={{ color: THEME_COLORS.text }}>
                  How to book & play
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Step-by-step flow from searching a turf to playing and recording results.
                </Typography>

                <Grid container spacing={2}>
                  {howSteps.map((s, idx) => (
                    <Grid item xs={12} sm={6} key={idx}>
                      <Card variant="outlined" sx={{ p: 2, height: '100%', transition: 'transform 220ms', '&:hover': { transform: 'translateY(-6px)' } }}>
                        <List disablePadding>
                          <ListItem disableGutters>
                            <ListItemIcon sx={{ minWidth: 48 }}>{s.icon}</ListItemIcon>
                            <ListItemText
                              primary={<Typography variant="subtitle1" fontWeight={700}>{s.title}</Typography>}
                              secondary={<Typography variant="body2" color="text.secondary">{s.text}</Typography>}
                            />
                          </ListItem>
                        </List>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Grid>

              <Grid item xs={12} md={5}>
                <Box sx={{ p: 2, borderRadius: 2, boxShadow: 1, height: '100%', bgcolor: 'transparent' }}>
                  <HowToSVG sx={{ width: '100%', height: 320 }} />
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>

<Box component="section" sx={{ width: '100%', py: { xs: 5, md: 8 } }}></Box>

      {/* What you can do (features) */}
      <Box component="section" sx={{ width: '100%', py: { xs: 5, md: 8 } }}>
        <Container maxWidth={false} sx={{ px: 0 }}>
          <Box sx={{ mx: 'auto', maxWidth: 1200, px: { xs: 2, md: 6 } }}>
            <Typography variant="h5" textAlign="center" gutterBottom sx={{ color: THEME_COLORS.text }}>
              What you can do
            </Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 4 }}>
              Tools for quick bookings, match management and building your community.
            </Typography>

            <Grid container spacing={3}>
              {quickFeatures.map((f, i) => (
                <Grid item xs={12} sm={6} md={4} key={i}>
                  <Card variant="outlined" sx={{ p: 3, height: '100%', display: 'flex', gap: 2, alignItems: 'flex-start', borderColor: 'transparent', boxShadow: '0 8px 20px rgba(18,60,46,0.03)' }}>
                    <FeatureSVG />
                    <Box>
                      <Typography variant="subtitle1" fontWeight={700} sx={{ color: THEME_COLORS.text }}>
                        {f.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {f.desc}
                      </Typography>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </Box>

      {/* Community / Connect */}
      <Box component="section" sx={{ width: '100%', bgcolor: 'white', py: { xs: 4, md: 6 } }}>
        <Container maxWidth={false} sx={{ px: 0 }}>
          <Box sx={{ mx: 'auto', maxWidth: 1200, px: { xs: 2, md: 6 } }}>
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={6}>
                <ConnectSVG sx={{ width: '80%', height: 120 }} />
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom sx={{ color: THEME_COLORS.text }}>
                  Build your team and community
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Discover players and teams nearby, message them directly and organize regular matches or tournaments.
                </Typography>
                <Button variant="contained" onClick={() => navigate('/register')} sx={{ bgcolor: THEME_COLORS.primary, '&:hover': { bgcolor: THEME_COLORS.accent } }}>Join the Community</Button>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>

      {/* Sports + testimonials */}
      <Container maxWidth={false} sx={{ px: 0 }}>
        <Box sx={{ mx: 'auto', maxWidth: 1200, px: { xs: 2, md: 6 }, py: { xs: 4, md: 8 } }}>
          <Grid container spacing={6}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom sx={{ color: THEME_COLORS.text }}>
                Sports we support
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Popular turf sports across partner venues.
              </Typography>
              <Grid container spacing={2}>
                <Grid item>
                  <Paper sx={{ px: 3, py: 1.5, display: 'flex', gap: 2, alignItems: 'center' }}>
                    {/* <SportsSoccer sx={{ color: THEME_COLORS.primary }} /> */}
                    <Typography>Football</Typography>
                  </Paper>
                </Grid>
                <Grid item>
                  <Paper sx={{ px: 3, py: 1.5, display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Typography>Cricket</Typography>
                  </Paper>
                </Grid>
                <Grid item>
                  <Paper sx={{ px: 3, py: 1.5, display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Typography>Tennis</Typography>
                  </Paper>
                </Grid>
                <Grid item>
                  <Paper sx={{ px: 3, py: 1.5, display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Typography>Vollyball</Typography>
                  </Paper>
                </Grid>
                <Grid item>
                  <Paper sx={{ px: 3, py: 1.5, display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Typography>Badminton</Typography>
                  </Paper>
                </Grid>
                <Grid item>
                  <Paper sx={{ px: 3, py: 1.5, display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Typography>Karate</Typography>
                  </Paper>
                </Grid>
                <Grid item>
                  <Paper sx={{ px: 3, py: 1.5, display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Typography>Kabaddi</Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom sx={{ color: THEME_COLORS.text }}>
                What users say
              </Typography>
              <Grid container spacing={2}>
                {testimonials.map((t, i) => (
                  <Grid item xs={12} key={i}>
                    <Card sx={{ p: 2 }}>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        {t.text}
                      </Typography>
                      <Typography variant="subtitle2" color="text.secondary">
                        — {t.name}
                      </Typography>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Container>

      {/* CTA footer */}
      <Box component="footer" sx={{ width: '100%', bgcolor: THEME_COLORS.primary, color: 'white', py: { xs: 5, md: 6 } }}>
        <Container maxWidth={false} sx={{ px: 0 }}>
          <Box sx={{ mx: 'auto', maxWidth: 1200, px: { xs: 2, md: 6 }, textAlign: 'center' }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
              Ready to book and play?
            </Typography>
            <Typography variant="body2" sx={{ mb: 3, opacity: 0.95 }}>
              Join the community, create matches and grow your team.
            </Typography>
            <Button variant="contained" onClick={() => navigate('/register')} sx={{ bgcolor: 'white', color: THEME_COLORS.primary, '&:hover': { bgcolor: '#ffffffea' } }}>
              Create Account
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;

