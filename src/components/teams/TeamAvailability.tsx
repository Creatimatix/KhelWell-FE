import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Switch,
  FormControlLabel,
  TextField,
  Chip,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Alert,
} from '@mui/material';
import {
  Event as CalendarIcon,
  AccessTime as ClockIcon,
  Groups as UsersIcon,
  CheckCircle as CheckCircleIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import toast from 'react-hot-toast';
import { Team, Connection, Notification } from '../../types/team';

interface TeamAvailabilityProps {
  userTeams: Team[];
  setUserTeams: (teams: Team[]) => void;
  connections: Connection[];
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
}

export function TeamAvailability({
  userTeams,
  setUserTeams,
  connections,
  addNotification,
}: TeamAvailabilityProps) {
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');
  const [timeSlot, setTimeSlot] = useState('');

  const handleToggleAvailability = (teamId: string, isAvailable: boolean) => {
    setUserTeams(
      userTeams.map((team) =>
        team.id === teamId ? { ...team, isAvailable } : team
      )
    );

    const team = userTeams.find((t) => t.id === teamId);
    
    if (isAvailable) {
      const connectedTeamIds = connections
        .filter((conn) => conn.status === 'accepted' && 
                (conn.fromTeamId === teamId || conn.toTeamId === teamId))
        .map((conn) => conn.fromTeamId === teamId ? conn.toTeamId : conn.fromTeamId);

      connectedTeamIds.forEach((connectedId) => {
        addNotification({
          type: 'team_available',
          message: `${team?.name} is now available for a match!`,
          fromTeamId: teamId,
          toTeamId: connectedId,
        });
      });

      toast.success('Your team is now available for matches. Connected teams have been notified!');
    } else {
      toast.error('Team marked as unavailable');
    }
  };

  const handleAddTimeSlot = (teamId: string) => {
    if (!timeSlot.trim()) {
      toast.error('Please enter a time slot');
      return;
    }

    setUserTeams(
      userTeams.map((team) =>
        team.id === teamId
          ? { ...team, availableSlots: [...(team.availableSlots || []), timeSlot] }
          : team
      )
    );

    setTimeSlot('');
    setSelectedTeamId('');
    toast.success('Time slot added');
  };

  const handleRemoveTimeSlot = (teamId: string, slot: string) => {
    setUserTeams(
      userTeams.map((team) =>
        team.id === teamId
          ? { ...team, availableSlots: team.availableSlots?.filter((s) => s !== slot) }
          : team
      )
    );
    toast.success('Time slot removed');
  };

  const getConnectedTeamsCount = (teamId: string) => {
    return connections.filter(
      (conn) =>
        conn.status === 'accepted' &&
        (conn.fromTeamId === teamId || conn.toTeamId === teamId)
    ).length;
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Team Availability
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Mark your team as available and notify connected teams
        </Typography>
      </Box>

      {userTeams.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <UsersIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
            <Typography color="text.secondary">
              Create a team first to manage availability
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {userTeams.map((team) => {
            const connectedCount = getConnectedTeamsCount(team.id);
            return (
              <Grid item xs={12} lg={6} key={team.id}>
                <Card
                  sx={{
                    border: team.isAvailable ? 2 : 1,
                    borderColor: team.isAvailable ? 'success.main' : 'divider',
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <Typography variant="h6">{team.name}</Typography>
                          {team.isAvailable && (
                            <Chip
                              label="Available"
                              size="small"
                              color="success"
                              icon={<CheckCircleIcon />}
                            />
                          )}
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {team.sport} • {connectedCount} connected teams
                        </Typography>
                      </Box>
                    </Box>

                    <Card variant="outlined" sx={{ mb: 3, bgcolor: 'action.hover' }}>
                      <CardContent>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={team.isAvailable || false}
                              onChange={(e) => handleToggleAvailability(team.id, e.target.checked)}
                            />
                          }
                          label={
                            <Box>
                              <Typography variant="body2">Available for Matches</Typography>
                              <Typography variant="caption" color="text.secondary">
                                {team.isAvailable
                                  ? 'Connected teams will be notified'
                                  : 'Enable to notify connected teams'}
                              </Typography>
                            </Box>
                          }
                        />
                      </CardContent>
                    </Card>

                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="subtitle2">Preferred Time Slots</Typography>
                        <Chip label={team.availableSlots?.length || 0} size="small" variant="outlined" />
                      </Box>

                      {selectedTeamId === team.id ? (
                        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                          <TextField
                            size="small"
                            fullWidth
                            placeholder="e.g., Mon 5-7 PM, Sat 9-11 AM"
                            value={timeSlot}
                            onChange={(e) => setTimeSlot(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                handleAddTimeSlot(team.id);
                              }
                            }}
                          />
                          <Button
                            size="small"
                            variant="contained"
                            onClick={() => handleAddTimeSlot(team.id)}
                          >
                            Add
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => {
                              setSelectedTeamId('');
                              setTimeSlot('');
                            }}
                          >
                            Cancel
                          </Button>
                        </Box>
                      ) : (
                        <Button
                          fullWidth
                          variant="outlined"
                          size="small"
                          startIcon={<ClockIcon />}
                          onClick={() => setSelectedTeamId(team.id)}
                          sx={{ mb: 2 }}
                        >
                          Add Time Slot
                        </Button>
                      )}

                      <List dense>
                        {team.availableSlots?.length === 0 ? (
                          <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 2 }}>
                            No time slots added
                          </Typography>
                        ) : (
                          team.availableSlots?.map((slot, index) => (
                            <ListItem
                              key={index}
                              sx={{ bgcolor: 'action.hover', mb: 1, borderRadius: 1 }}
                            >
                              <CalendarIcon fontSize="small" sx={{ mr: 2, color: 'action.active' }} />
                              <ListItemText primary={slot} />
                              <ListItemSecondaryAction>
                                <IconButton
                                  edge="end"
                                  size="small"
                                  onClick={() => handleRemoveTimeSlot(team.id, slot)}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </ListItemSecondaryAction>
                            </ListItem>
                          ))
                        )}
                      </List>
                    </Box>

                    {connectedCount === 0 && (
                      <Alert severity="info" sx={{ mt: 2 }}>
                        Connect with teams first to notify them about your availability
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
}
