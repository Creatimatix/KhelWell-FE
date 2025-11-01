import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Grid,
  Chip,
  IconButton,
  Button,
  Paper,
  LinearProgress,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tab,
  Tabs,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  Edit as EditIcon,
  LocationOn as MapPinIcon,
  CalendarMonth as CalendarIcon,
  EmojiEvents as TrophyIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  Group as GroupIcon,
  SportsScore as TargetIcon,
  Whatshot as FireIcon,
  WorkspacePremium as MilitaryIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Timer as ClockIcon,
  Instagram as InstagramIcon,
  Twitter as TwitterIcon,
  Facebook as FacebookIcon,
  Share as ShareIcon,
  Add as AddIcon,
  Image as ImageIcon,
} from '@mui/icons-material';
import { Team } from '../../types/team';
// import { ImageWithFallback } from './figma/ImageWithFallback';
import { ShareProfileDialog } from './ShareProfileDialog';
import { AddAchievementDialog, NewAchievement } from './AddAchievementDialog';

interface UserProfileProps {
  userTeams: Team[];
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: 'trophy' | 'fire' | 'star' | 'target' | 'military';
  unlockedAt: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface CustomAchievement {
  id: string;
  title: string;
  description: string;
  photoUrl: string;
  date: string;
  isCustom: true;
}

interface MatchHistory {
  id: string;
  teamName: string;
  opponent: string;
  sport: string;
  result: 'win' | 'loss' | 'draw';
  score: string;
  date: string;
  location: string;
}

interface Activity {
  id: string;
  type: 'match' | 'team_join' | 'achievement' | 'milestone';
  title: string;
  description: string;
  timestamp: string;
  icon: React.ReactNode;
}

interface UserStats {
  totalMatches: number;
  wins: number;
  losses: number;
  draws: number;
  totalTeams: number;
  achievements: number;
  winRate: number;
  currentStreak: number;
  bestStreak: number;
  totalHours: number;
}

const mockAchievements: Achievement[] = [
  {
    id: '1',
    title: 'First Victory',
    description: 'Won your first match',
    icon: 'trophy',
    unlockedAt: '2024-10-15',
    rarity: 'common',
  },
  {
    id: '2',
    title: 'Hat Trick',
    description: 'Won 3 matches in a row',
    icon: 'fire',
    unlockedAt: '2024-10-20',
    rarity: 'rare',
  },
  {
    id: '3',
    title: 'Team Captain',
    description: 'Became captain of a team',
    icon: 'star',
    unlockedAt: '2024-10-10',
    rarity: 'common',
  },
  {
    id: '4',
    title: 'Perfect Score',
    description: 'Achieved a perfect match score',
    icon: 'target',
    unlockedAt: '2024-10-25',
    rarity: 'epic',
  },
  {
    id: '5',
    title: 'Undefeated Champion',
    description: 'Won 10 consecutive matches',
    icon: 'military',
    unlockedAt: '2024-10-30',
    rarity: 'legendary',
  },
];

const mockMatchHistory: MatchHistory[] = [
  {
    id: '1',
    teamName: 'Thunder FC',
    opponent: 'Lightning United',
    sport: 'Football',
    result: 'win',
    score: '3-2',
    date: '2024-10-30',
    location: 'Downtown Arena',
  },
  {
    id: '2',
    teamName: 'Thunder FC',
    opponent: 'Storm Strikers',
    sport: 'Football',
    result: 'win',
    score: '2-1',
    date: '2024-10-28',
    location: 'City Stadium',
  },
  {
    id: '3',
    teamName: 'Thunder FC',
    opponent: 'Phoenix FC',
    sport: 'Football',
    result: 'loss',
    score: '1-2',
    date: '2024-10-25',
    location: 'Phoenix Arena',
  },
  {
    id: '4',
    teamName: 'Thunder FC',
    opponent: 'Eagles United',
    sport: 'Football',
    result: 'win',
    score: '4-1',
    date: '2024-10-22',
    location: 'Downtown Arena',
  },
  {
    id: '5',
    teamName: 'Thunder FC',
    opponent: 'Dynamo FC',
    sport: 'Football',
    result: 'draw',
    score: '2-2',
    date: '2024-10-20',
    location: 'Central Park',
  },
];

export function UserPublicProfile({ userTeams }: UserProfileProps) {
  const [currentTab, setCurrentTab] = useState(0);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [addAchievementOpen, setAddAchievementOpen] = useState(false);
  const [customAchievements, setCustomAchievements] = useState<CustomAchievement[]>([]);
  const [profileData, setProfileData] = useState({
    name: 'Alex Johnson',
    bio: 'Passionate athlete & team player | Love the competition & camaraderie 🏆',
    location: 'New York, NY',
    joinDate: 'January 2024',
    coverImage: '',
    avatarImage: '',
    instagram: '@alexjsports',
    twitter: '@alexjsports',
    facebook: 'alexjsports',
  });

  // Generate shareable profile URL
  const profileUrl = `${window.location.origin}${window.location.pathname}?profile=${encodeURIComponent(profileData.name.toLowerCase().replace(/\s+/g, '-'))}&view=public`;

  // Calculate user stats
  const calculateStats = (): UserStats => {
    const wins = mockMatchHistory.filter(m => m.result === 'win').length;
    const losses = mockMatchHistory.filter(m => m.result === 'loss').length;
    const draws = mockMatchHistory.filter(m => m.result === 'draw').length;
    const totalMatches = mockMatchHistory.length;
    const winRate = totalMatches > 0 ? Math.round((wins / totalMatches) * 100) : 0;

    return {
      totalMatches,
      wins,
      losses,
      draws,
      totalTeams: userTeams.length,
      achievements: mockAchievements.length + customAchievements.length,
      winRate,
      currentStreak: 2,
      bestStreak: 5,
      totalHours: 127,
    };
  };

  const stats = calculateStats();

  // Generate activity feed
  const generateActivities = (): Activity[] => {
    const activities: Activity[] = [];

    // Recent matches
    mockMatchHistory.slice(0, 3).forEach(match => {
      activities.push({
        id: `match-${match.id}`,
        type: 'match',
        title: match.result === 'win' ? '🎉 Match Victory!' : match.result === 'loss' ? 'Match Played' : 'Match Draw',
        description: `${match.teamName} vs ${match.opponent} - ${match.score}`,
        timestamp: match.date,
        icon: match.result === 'win' ? <TrophyIcon color="success" /> : match.result === 'loss' ? <CancelIcon color="error" /> : <CheckCircleIcon color="info" />,
      });
    });

    // Recent achievements
    mockAchievements.slice(0, 2).forEach(achievement => {
      activities.push({
        id: `achievement-${achievement.id}`,
        type: 'achievement',
        title: `🏆 Achievement Unlocked!`,
        description: achievement.title,
        timestamp: achievement.unlockedAt,
        icon: <StarIcon sx={{ color: 'warning.main' }} />,
      });
    });

    // Sort by date
    return activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  const activities = generateActivities();

  const getAchievementIcon = (icon: string) => {
    switch (icon) {
      case 'trophy':
        return <TrophyIcon />;
      case 'fire':
        return <FireIcon />;
      case 'star':
        return <StarIcon />;
      case 'target':
        return <TargetIcon />;
      case 'military':
        return <MilitaryIcon />;
      default:
        return <TrophyIcon />;
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'default';
      case 'rare':
        return 'info';
      case 'epic':
        return 'secondary';
      case 'legendary':
        return 'warning';
      default:
        return 'default';
    }
  };

  const handleSaveProfile = () => {
    setEditDialogOpen(false);
  };

  const handleAddAchievement = (newAchievement: NewAchievement) => {
    const achievement: CustomAchievement = {
      id: `custom-${Date.now()}`,
      ...newAchievement,
      isCustom: true,
    };
    setCustomAchievements([achievement, ...customAchievements]);
  };

  const handleDeleteAchievement = (id: string) => {
    setCustomAchievements(customAchievements.filter(a => a.id !== id));
  };

  return (
    <Box>
      {/* Cover Photo & Profile Header */}
      <Card sx={{ mb: 3, overflow: 'hidden' }}>
        <Box
          sx={{
            height: 240,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            position: 'relative',
            display: 'flex',
            alignItems: 'flex-end',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              display: 'flex',
              gap: 1,
            }}
          >
            <IconButton
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                color: 'white',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.3)',
                },
              }}
              onClick={() => setShareDialogOpen(true)}
            >
              <ShareIcon />
            </IconButton>
            <IconButton
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                color: 'white',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.3)',
                },
              }}
              onClick={() => setEditDialogOpen(true)}
            >
              <EditIcon />
            </IconButton>
          </Box>
        </Box>

        <CardContent sx={{ mt: -8 }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
            <Avatar
              sx={{
                width: 160,
                height: 160,
                border: '6px solid white',
                boxShadow: 3,
              }}
            >
              {profileData.name.charAt(0)}
            </Avatar>

            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box>
                  <Typography variant="h4" gutterBottom>
                    {profileData.name}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    {profileData.bio}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
                    <Chip icon={<MapPinIcon />} label={profileData.location} variant="outlined" />
                    <Chip icon={<CalendarIcon />} label={`Joined ${profileData.joinDate}`} variant="outlined" />
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton size="small" color="primary">
                      <InstagramIcon />
                    </IconButton>
                    <IconButton size="small" color="primary">
                      <TwitterIcon />
                    </IconButton>
                    <IconButton size="small" color="primary">
                      <FacebookIcon />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={4} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <TrophyIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
              <Typography variant="h4">{stats.wins}</Typography>
              <Typography variant="body2" color="text.secondary">
                Wins
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} sm={4} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <TargetIcon sx={{ fontSize: 40, color: 'error.main', mb: 1 }} />
              <Typography variant="h4">{stats.totalMatches}</Typography>
              <Typography variant="body2" color="text.secondary">
                Matches
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} sm={4} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <GroupIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4">{stats.totalTeams}</Typography>
              <Typography variant="body2" color="text.secondary">
                Teams
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} sm={4} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <StarIcon sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
              <Typography variant="h4">{stats.achievements}</Typography>
              <Typography variant="body2" color="text.secondary">
                Achievements
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} sm={4} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <TrendingUpIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h4">{stats.winRate}%</Typography>
              <Typography variant="body2" color="text.secondary">
                Win Rate
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} sm={4} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <FireIcon sx={{ fontSize: 40, color: 'error.main', mb: 1 }} />
              <Typography variant="h4">{stats.currentStreak}</Typography>
              <Typography variant="body2" color="text.secondary">
                Win Streak
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Performance Chart */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Performance Overview
          </Typography>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Win Rate
                  </Typography>
                  <Typography variant="body2">{stats.winRate}%</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={stats.winRate}
                  color="success"
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Match Participation
                  </Typography>
                  <Typography variant="body2">85%</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={85}
                  color="primary"
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>

              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Team Contribution
                  </Typography>
                  <Typography variant="body2">92%</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={92}
                  color="secondary"
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Paper sx={{ p: 2, bgcolor: 'success.light', color: 'success.contrastText' }}>
                    <Typography variant="h5">{stats.wins}</Typography>
                    <Typography variant="caption">Victories</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper sx={{ p: 2, bgcolor: 'error.light', color: 'error.contrastText' }}>
                    <Typography variant="h5">{stats.losses}</Typography>
                    <Typography variant="caption">Defeats</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper sx={{ p: 2, bgcolor: 'info.light', color: 'info.contrastText' }}>
                    <Typography variant="h5">{stats.draws}</Typography>
                    <Typography variant="caption">Draws</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper sx={{ p: 2, bgcolor: 'warning.light', color: 'warning.contrastText' }}>
                    <Typography variant="h5">{stats.bestStreak}</Typography>
                    <Typography variant="caption">Best Streak</Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Content Tabs */}
      <Paper sx={{ mb: 2 }}>
        <Tabs
          value={currentTab}
          onChange={(_, newValue) => setCurrentTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Activity" />
          <Tab label="Achievements" />
          <Tab label="Match History" />
          <Tab label="Teams" />
        </Tabs>
      </Paper>

      {/* Activity Tab */}
      {currentTab === 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <List>
              {activities.map((activity, index) => (
                <Box key={activity.id}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.light' }}>
                        {activity.icon}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={activity.title}
                      secondary={
                        <>
                          <Typography component="span" variant="body2" color="text.primary">
                            {activity.description}
                          </Typography>
                          <Typography component="div" variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                            <ClockIcon sx={{ fontSize: 14, verticalAlign: 'middle', mr: 0.5 }} />
                            {new Date(activity.timestamp).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                  {index < activities.length - 1 && <Divider variant="inset" component="li" />}
                </Box>
              ))}
            </List>
          </CardContent>
        </Card>
      )}

      {/* Achievements Tab */}
      {currentTab === 1 && (
        <Box>
          {/* Add Achievement Button */}
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setAddAchievementOpen(true)}
            >
              Add Achievement
            </Button>
          </Box>

          <Grid container spacing={3}>
            {/* Custom Achievements */}
            {customAchievements.map((achievement) => (
              <Grid item xs={12} sm={6} md={4} key={achievement.id}>
                <Card
                  sx={{
                    height: '100%',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 6,
                    },
                    position: 'relative',
                  }}
                >
                  <Box
                    sx={{
                      position: 'relative',
                      height: 200,
                      overflow: 'hidden',
                    }}
                  >
                    {/* <ImageWithFallback
                      src={achievement.photoUrl}
                      alt={achievement.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    /> */}
                    <IconButton
                      onClick={() => handleDeleteAchievement(achievement.id)}
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        bgcolor: 'rgba(0, 0, 0, 0.6)',
                        color: 'white',
                        '&:hover': {
                          bgcolor: 'rgba(0, 0, 0, 0.8)',
                        },
                      }}
                      size="small"
                    >
                      <CancelIcon />
                    </IconButton>
                    <Chip
                      icon={<ImageIcon />}
                      label="CUSTOM"
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 8,
                        left: 8,
                        bgcolor: 'rgba(0, 0, 0, 0.6)',
                        color: 'white',
                      }}
                    />
                  </Box>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {achievement.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {achievement.description}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(achievement.date).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}

            {/* System Achievements */}
            {mockAchievements.map((achievement) => (
              <Grid item xs={12} sm={6} md={4} key={achievement.id}>
                <Card
                  sx={{
                    height: '100%',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 6,
                    },
                  }}
                >
                  <CardContent>
                    <Box sx={{ textAlign: 'center', mb: 2 }}>
                      <Avatar
                        sx={{
                          width: 80,
                          height: 80,
                          bgcolor: `${getRarityColor(achievement.rarity)}.light`,
                          color: `${getRarityColor(achievement.rarity)}.dark`,
                          margin: '0 auto',
                          mb: 2,
                        }}
                      >
                        {getAchievementIcon(achievement.icon)}
                      </Avatar>
                      <Chip
                        label={achievement.rarity.toUpperCase()}
                        color={getRarityColor(achievement.rarity) as any}
                        size="small"
                        sx={{ mb: 1 }}
                      />
                      <Typography variant="h6" gutterBottom>
                        {achievement.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {achievement.description}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Unlocked on {new Date(achievement.unlockedAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}

            {/* Empty State */}
            {customAchievements.length === 0 && mockAchievements.length === 0 && (
              <Grid item xs={12}>
                <Card>
                  <CardContent sx={{ textAlign: 'center', py: 8 }}>
                    <TrophyIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                    <Typography color="text.secondary" gutterBottom>
                      No achievements yet
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => setAddAchievementOpen(true)}
                      sx={{ mt: 2 }}
                    >
                      Add Your First Achievement
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>
        </Box>
      )}

      {/* Match History Tab */}
      {currentTab === 2 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Match History
            </Typography>
            <List>
              {mockMatchHistory.map((match, index) => (
                <Box key={match.id}>
                  <ListItem>
                    <ListItemAvatar>
                      {match.result === 'win' ? (
                        <Avatar sx={{ bgcolor: 'success.light' }}>
                          <CheckCircleIcon sx={{ color: 'success.dark' }} />
                        </Avatar>
                      ) : match.result === 'loss' ? (
                        <Avatar sx={{ bgcolor: 'error.light' }}>
                          <CancelIcon sx={{ color: 'error.dark' }} />
                        </Avatar>
                      ) : (
                        <Avatar sx={{ bgcolor: 'info.light' }}>
                          <CheckCircleIcon sx={{ color: 'info.dark' }} />
                        </Avatar>
                      )}
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle1">
                            {match.teamName} vs {match.opponent}
                          </Typography>
                          <Chip
                            label={match.result.toUpperCase()}
                            color={
                              match.result === 'win'
                                ? 'success'
                                : match.result === 'loss'
                                ? 'error'
                                : 'info'
                            }
                            size="small"
                          />
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography component="span" variant="body2" color="text.primary">
                            Score: {match.score} • {match.sport}
                          </Typography>
                          <Typography component="div" variant="caption" color="text.secondary">
                            <MapPinIcon sx={{ fontSize: 14, verticalAlign: 'middle', mr: 0.5 }} />
                            {match.location} • {new Date(match.date).toLocaleDateString()}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                  {index < mockMatchHistory.length - 1 && <Divider variant="inset" component="li" />}
                </Box>
              ))}
            </List>
          </CardContent>
        </Card>
      )}

      {/* Teams Tab */}
      {currentTab === 3 && (
        <Grid container spacing={3}>
          {userTeams.map((team) => (
            <Grid item xs={12} sm={6} md={4} key={team.id}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Avatar sx={{ width: 56, height: 56, bgcolor: 'primary.main' }}>
                      {team.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="h6">{team.name}</Typography>
                      <Chip label={team.sport} size="small" />
                    </Box>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        Wins
                      </Typography>
                      <Typography variant="h6" color="success.main">
                        {team.wins}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        Losses
                      </Typography>
                      <Typography variant="h6" color="error.main">
                        {team.losses}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        Rating
                      </Typography>
                      <Typography variant="h6">{team.rating}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        Members
                      </Typography>
                      <Typography variant="h6">{team.members?.length || 0}</Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
          {userTeams.length === 0 && (
            <Grid item xs={12}>
              <Card>
                <CardContent sx={{ textAlign: 'center', py: 8 }}>
                  <GroupIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                  <Typography color="text.secondary">
                    No teams joined yet
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      )}

      {/* Share Profile Dialog */}
      <ShareProfileDialog
        open={shareDialogOpen}
        onClose={() => setShareDialogOpen(false)}
        profileUrl={profileUrl}
        userName={profileData.name}
      />

      {/* Add Achievement Dialog */}
      <AddAchievementDialog
        open={addAchievementOpen}
        onClose={() => setAddAchievementOpen(false)}
        onAdd={handleAddAchievement}
      />

      {/* Edit Profile Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Name"
              fullWidth
              value={profileData.name}
              onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
            />
            <TextField
              label="Bio"
              fullWidth
              multiline
              rows={3}
              value={profileData.bio}
              onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
            />
            <TextField
              label="Location"
              fullWidth
              value={profileData.location}
              onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
            />
            <Divider />
            <Typography variant="subtitle2" color="text.secondary">
              Social Media
            </Typography>
            <TextField
              label="Instagram"
              fullWidth
              value={profileData.instagram}
              onChange={(e) => setProfileData({ ...profileData, instagram: e.target.value })}
            />
            <TextField
              label="Twitter"
              fullWidth
              value={profileData.twitter}
              onChange={(e) => setProfileData({ ...profileData, twitter: e.target.value })}
            />
            <TextField
              label="Facebook"
              fullWidth
              value={profileData.facebook}
              onChange={(e) => setProfileData({ ...profileData, facebook: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveProfile}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
