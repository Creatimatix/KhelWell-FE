import { useState } from 'react';
import {
  Box,
  Container,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Tabs,
  Tab,
  Paper,
  ThemeProvider,
  CssBaseline,
} from '@mui/material';
import {
  EmojiEvents as TrophyIcon,
  Notifications as BellIcon,
} from '@mui/icons-material';
import { TeamManager } from '../../components/teams/TeamManager';
import { TeamConnections } from '../../components/teams/TeamConnections';
import { TeamAvailability } from '../../components/teams/TeamAvailability';
import { MatchChallenges } from '../../components/teams/MatchChallenges';
import { NotificationCenter } from '../../components/teams/NotificationCenter';
import { theme } from '../../pages/user/teamTheme';
import { Team, Connection, MatchChallenge, Notification } from '../../types/team';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function UserTeams() {
  const [userTeams, setUserTeams] = useState<Team[]>([
    {
      id: '1',
      name: 'Thunder FC',
      sport: 'Football',
      players: 11,
      rating: 1200,
      wins: 5,
      losses: 2,
      location: 'Downtown Arena',
      members: [
        { id: 'm1', name: 'John Doe', role: 'captain', available: true },
        { id: 'm2', name: 'Mike Smith', role: 'player', available: true },
        { id: 'm3', name: 'Sarah Johnson', role: 'player', available: true },
      ],
      isAvailable: false,
      availableSlots: [],
    },
  ]);

  const [connections, setConnections] = useState<Connection[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [matchChallenges, setMatchChallenges] = useState<MatchChallenge[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      read: false,
    };
    setNotifications([newNotification, ...notifications]);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="sticky" color="primary" elevation={1}>
          <Toolbar>
            <TrophyIcon sx={{ mr: 2, fontSize: 32 }} />
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6" component="div">
                Sports Team Manager
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.9 }}>
                Connect, compete, and build your legacy
              </Typography>
            </Box>
            <IconButton
              color="inherit"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Badge badgeContent={unreadCount} color="error">
                <BellIcon />
              </Badge>
            </IconButton>
          </Toolbar>
        </AppBar>

        {showNotifications && (
          <Box
            sx={{
              position: 'fixed',
              top: 80,
              right: 16,
              zIndex: 1300,
              width: 400,
              maxWidth: '90vw',
            }}
          >
            <NotificationCenter
              notifications={notifications}
              setNotifications={setNotifications}
              userTeams={userTeams}
              onClose={() => setShowNotifications(false)}
            />
          </Box>
        )}

        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Paper sx={{ mb: 3 }}>
            <Tabs
              value={currentTab}
              onChange={(_, newValue) => setCurrentTab(newValue)}
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label="My Teams" />
              <Tab label="Connections" />
              <Tab label="Availability" />
              <Tab label="Matches" />
              <Tab label="Find Teams" />
            </Tabs>
          </Paper>

          <TabPanel value={currentTab} index={0}>
            <TeamManager userTeams={userTeams} setUserTeams={setUserTeams} />
          </TabPanel>

          <TabPanel value={currentTab} index={1}>
            <TeamConnections
              userTeams={userTeams}
              connections={connections}
              setConnections={setConnections}
              addNotification={addNotification}
            />
          </TabPanel>

          <TabPanel value={currentTab} index={2}>
            <TeamAvailability
              userTeams={userTeams}
              setUserTeams={setUserTeams}
              connections={connections}
              addNotification={addNotification}
            />
          </TabPanel>

          <TabPanel value={currentTab} index={3}>
            <MatchChallenges
              userTeams={userTeams}
              setUserTeams={setUserTeams}
              matchChallenges={matchChallenges}
              setMatchChallenges={setMatchChallenges}
              connections={connections}
              addNotification={addNotification}
            />
          </TabPanel>

          <TabPanel value={currentTab} index={4}>
            <TeamConnections
              userTeams={userTeams}
              connections={connections}
              setConnections={setConnections}
              addNotification={addNotification}
              showSuggestions={true}
            />
          </TabPanel>
        </Container>
      </Box>
    </ThemeProvider>
  );
}