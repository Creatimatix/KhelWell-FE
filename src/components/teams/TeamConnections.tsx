import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
} from '@mui/material';
import {
  Groups as UsersIcon,
  LocationOn as MapPinIcon,
  EmojiEvents as TrophyIcon,
  GpsFixed as TargetIcon,
  PersonAdd as UserPlusIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as XCircleIcon,
  AccessTime as ClockIcon,
} from '@mui/icons-material';
import toast from 'react-hot-toast';
import { Team, Connection, Notification } from '../../types/team';

const SUGGESTED_TEAMS: Team[] = [
  { id: 'st1', name: 'Warriors United', sport: 'Football', players: 11, rating: 1150, wins: 8, losses: 3, location: 'Downtown Arena' },
  { id: 'st2', name: 'Street Strikers', sport: 'Football', players: 11, rating: 1050, wins: 4, losses: 5, location: 'City Park' },
  { id: 'st3', name: 'Phoenix FC', sport: 'Football', players: 11, rating: 1400, wins: 12, losses: 2, location: 'Sports Complex' },
  { id: 'st4', name: 'Lions CC', sport: 'Cricket', players: 11, rating: 1200, wins: 6, losses: 4, location: 'Cricket Ground' },
  { id: 'st5', name: 'Royal Challengers', sport: 'Cricket', players: 11, rating: 1350, wins: 10, losses: 3, location: 'Main Stadium' },
  { id: 'st6', name: 'Thunder Strikers', sport: 'Cricket', players: 11, rating: 980, wins: 3, losses: 7, location: 'Local Field' },
  { id: 'st7', name: 'Hoops Masters', sport: 'Basketball', players: 5, rating: 1280, wins: 9, losses: 4, location: 'Indoor Court' },
  { id: 'st8', name: 'Net Ninjas', sport: 'Volleyball', players: 6, rating: 1100, wins: 5, losses: 5, location: 'Beach Arena' },
];

interface TeamConnectionsProps {
  userTeams: Team[];
  connections: Connection[];
  setConnections: (connections: Connection[]) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  showSuggestions?: boolean;
}

export function TeamConnections({
  userTeams,
  connections,
  setConnections,
  addNotification,
  showSuggestions = false,
}: TeamConnectionsProps) {
  const [filterSport, setFilterSport] = useState<string>('all');
  const [filterLocation, setFilterLocation] = useState<string>('all');

  const handleSendConnection = (fromTeamId: string, toTeamId: string) => {
    const newConnection: Connection = {
      id: Date.now().toString(),
      fromTeamId,
      toTeamId,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    setConnections([...connections, newConnection]);

    const fromTeam = userTeams.find((t) => t.id === fromTeamId);
    const toTeam = SUGGESTED_TEAMS.find((t) => t.id === toTeamId);

    addNotification({
      type: 'connection_request',
      message: `${fromTeam?.name} sent you a connection request`,
      fromTeamId,
      toTeamId,
    });

    toast.success('Connection request sent!');
  };

  const handleAcceptConnection = (connectionId: string) => {
    setConnections(
      connections.map((conn) =>
        conn.id === connectionId ? { ...conn, status: 'accepted' } : conn
      )
    );

    const connection = connections.find((c) => c.id === connectionId);
    if (connection) {
      const fromTeam = userTeams.find((t) => t.id === connection.fromTeamId) || 
                       SUGGESTED_TEAMS.find((t) => t.id === connection.fromTeamId);
      
      addNotification({
        type: 'connection_accepted',
        message: `Connection accepted! You are now connected with ${fromTeam?.name}`,
        fromTeamId: connection.toTeamId,
        toTeamId: connection.fromTeamId,
      });
    }

    toast.success('Connection accepted!');
  };

  const handleRejectConnection = (connectionId: string) => {
    setConnections(
      connections.map((conn) =>
        conn.id === connectionId ? { ...conn, status: 'rejected' } : conn
      )
    );
    toast.error('Connection request rejected');
  };

  const isConnected = (teamId: string) => {
    return connections.some(
      (conn) =>
        conn.status === 'accepted' &&
        (conn.fromTeamId === teamId || conn.toTeamId === teamId)
    );
  };

  const hasPendingRequest = (myTeamId: string, theirTeamId: string) => {
    return connections.some(
      (conn) =>
        conn.status === 'pending' &&
        conn.fromTeamId === myTeamId &&
        conn.toTeamId === theirTeamId
    );
  };

  const filteredSuggestions = SUGGESTED_TEAMS.filter((team) => {
    if (filterSport !== 'all' && team.sport !== filterSport) return false;
    if (filterLocation !== 'all' && team.location !== filterLocation) return false;
    return true;
  });

  const connectedTeams = connections
    .filter((conn) => conn.status === 'accepted')
    .map((conn) => {
      const teamId = userTeams.some((t) => t.id === conn.fromTeamId)
        ? conn.toTeamId
        : conn.fromTeamId;
      return SUGGESTED_TEAMS.find((t) => t.id === teamId);
    })
    .filter(Boolean) as Team[];

  const pendingConnections = connections.filter((conn) => conn.status === 'pending');

  const getDifficultyMatch = (teamRating: number, userRating: number) => {
    const diff = Math.abs(teamRating - userRating);
    if (diff < 100) return 'Similar Skill';
    if (teamRating > userRating) return 'Challenging';
    return 'Good Match';
  };

  if (showSuggestions) {
    return (
      <Box>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            Find Teams
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Connect with teams based on location, sport type, and skill level
          </Typography>
        </Box>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Filters
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Sport Type</InputLabel>
                  <Select
                    value={filterSport}
                    label="Sport Type"
                    onChange={(e) => setFilterSport(e.target.value)}
                  >
                    <MenuItem value="all">All Sports</MenuItem>
                    <MenuItem value="Football">Football</MenuItem>
                    <MenuItem value="Cricket">Cricket</MenuItem>
                    <MenuItem value="Basketball">Basketball</MenuItem>
                    <MenuItem value="Volleyball">Volleyball</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Location</InputLabel>
                  <Select
                    value={filterLocation}
                    label="Location"
                    onChange={(e) => setFilterLocation(e.target.value)}
                  >
                    <MenuItem value="all">All Locations</MenuItem>
                    <MenuItem value="Downtown Arena">Downtown Arena</MenuItem>
                    <MenuItem value="City Park">City Park</MenuItem>
                    <MenuItem value="Sports Complex">Sports Complex</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Typography variant="h6" gutterBottom>
          Suggested Teams ({filteredSuggestions.length})
        </Typography>
        <Grid container spacing={3}>
          {filteredSuggestions.map((team) => {
            const userTeam = userTeams.find((t) => t.sport === team.sport);
            const skillMatch = userTeam ? getDifficultyMatch(team.rating, userTeam.rating) : '';

            return (
              <Grid item xs={12} md={6} lg={4} key={team.id}>
                <Card sx={{ height: '100%', '&:hover': { boxShadow: 6 } }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Box>
                        <Typography variant="h6" gutterBottom>
                          {team.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {team.sport}
                        </Typography>
                      </Box>
                      <Chip label={team.sport} size="small" color="primary" />
                    </Box>

                    <Grid container spacing={1} sx={{ mb: 2 }}>
                      <Grid item xs={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <MapPinIcon fontSize="small" color="action" />
                          <Typography variant="caption" color="text.secondary" noWrap>
                            {team.location}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <UsersIcon fontSize="small" color="action" />
                          <Typography variant="caption" color="text.secondary">
                            {team.players} Players
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <TargetIcon fontSize="small" color="action" />
                          <Typography variant="caption" color="text.secondary">
                            Rating: {team.rating}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <TrophyIcon fontSize="small" color="action" />
                          <Typography variant="caption" color="text.secondary">
                            {team.wins}W - {team.losses}L
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>

                    {skillMatch && (
                      <Chip label={skillMatch} size="small" variant="outlined" sx={{ mb: 2, width: '100%' }} />
                    )}

                    {userTeams.length === 0 ? (
                      <Button disabled fullWidth>
                        Create a team first
                      </Button>
                    ) : isConnected(team.id) ? (
                      <Button
                        disabled
                        fullWidth
                        variant="contained"
                        color="success"
                        startIcon={<CheckCircleIcon />}
                      >
                        Connected
                      </Button>
                    ) : hasPendingRequest(userTeams[0].id, team.id) ? (
                      <Button disabled fullWidth variant="outlined" startIcon={<ClockIcon />}>
                        Request Pending
                      </Button>
                    ) : (
                      <Button
                        fullWidth
                        variant="contained"
                        startIcon={<UserPlusIcon />}
                        onClick={() => handleSendConnection(userTeams[0].id, team.id)}
                      >
                        Connect
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Team Connections
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage your team connections and requests
        </Typography>
      </Box>

      {pendingConnections.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Pending Requests ({pendingConnections.length})
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {pendingConnections.map((conn) => {
              const fromTeam = SUGGESTED_TEAMS.find((t) => t.id === conn.fromTeamId);
              if (!fromTeam) return null;

              return (
                <Card key={conn.id}>
                  <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: 'primary.light' }}>
                        <UsersIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1">{fromTeam.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {fromTeam.sport} • {fromTeam.location}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<CheckCircleIcon />}
                        onClick={() => handleAcceptConnection(conn.id)}
                      >
                        Accept
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<XCircleIcon />}
                        onClick={() => handleRejectConnection(conn.id)}
                      >
                        Decline
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              );
            })}
          </Box>
        </Box>
      )}

      <Typography variant="h6" gutterBottom>
        Connected Teams ({connectedTeams.length})
      </Typography>
      {connectedTeams.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <UsersIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
            <Typography color="text.secondary">
              No connections yet. Find teams to connect with!
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {connectedTeams.map((team) => (
            <Grid item xs={12} md={6} lg={4} key={team.id}>
              <Card sx={{ '&:hover': { boxShadow: 6 } }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        {team.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {team.sport}
                      </Typography>
                    </Box>
                    <Chip
                      label="Connected"
                      size="small"
                      color="success"
                      icon={<CheckCircleIcon />}
                    />
                  </Box>

                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <MapPinIcon fontSize="small" color="action" />
                        <Typography variant="caption" color="text.secondary" noWrap>
                          {team.location}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <TargetIcon fontSize="small" color="action" />
                        <Typography variant="caption" color="text.secondary">
                          Rating: {team.rating}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <TrophyIcon fontSize="small" color="action" />
                        <Typography variant="caption" color="text.secondary">
                          {team.wins}W - {team.losses}L
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
