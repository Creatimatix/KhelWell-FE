import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Chip,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  Add as PlusIcon,
  Groups as UsersIcon,
  EmojiEvents as TrophyIcon,
  GpsFixed as TargetIcon,
  PersonAdd as UserPlusIcon,
  EmojiEvents as CrownIcon,
  Close as XIcon,
} from '@mui/icons-material';
import toast from 'react-hot-toast';
import { Team, TeamMember } from '../../types/team';

const SPORTS_TYPES = ['Football', 'Cricket', 'Basketball', 'Volleyball', 'Tennis', 'Badminton'];

interface TeamManagerProps {
  userTeams: Team[];
  setUserTeams: (teams: Team[]) => void;
}

export function TeamManager({ userTeams, setUserTeams }: TeamManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [memberDialogOpen, setMemberDialogOpen] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');
  const [newMemberName, setNewMemberName] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    sport: '',
    players: '',
    location: '',
  });

  const handleCreateTeam = () => {
    if (!formData.name || !formData.sport || !formData.players) {
      toast.error('Please fill all required fields');
      return;
    }

    const newTeam: Team = {
      id: Date.now().toString(),
      name: formData.name,
      sport: formData.sport,
      players: parseInt(formData.players),
      rating: 1000,
      wins: 0,
      losses: 0,
      location: formData.location || 'Not specified',
      members: [],
      isAvailable: false,
      availableSlots: [],
    };

    setUserTeams([...userTeams, newTeam]);
    setFormData({ name: '', sport: '', players: '', location: '' });
    setIsOpen(false);
    toast.success('Team created successfully!');
  };

  const handleAddMember = () => {
    if (!newMemberName.trim()) {
      toast.error('Please enter member name');
      return;
    }

    setUserTeams(
      userTeams.map((team) => {
        if (team.id === selectedTeamId) {
          const newMember: TeamMember = {
            id: Date.now().toString(),
            name: newMemberName,
            role: team.members?.length === 0 ? 'captain' : 'player',
            available: true,
          };
          return {
            ...team,
            members: [...(team.members || []), newMember],
          };
        }
        return team;
      })
    );

    toast.success('Member added successfully!');
    setNewMemberName('');
  };

  const handleRemoveMember = (teamId: string, memberId: string) => {
    setUserTeams(
      userTeams.map((team) => {
        if (team.id === teamId) {
          return {
            ...team,
            members: team.members?.filter((m) => m.id !== memberId),
          };
        }
        return team;
      })
    );
    toast.success('Member removed');
  };

  const handleToggleCaptain = (teamId: string, memberId: string) => {
    setUserTeams(
      userTeams.map((team) => {
        if (team.id === teamId) {
          return {
            ...team,
            members: team.members?.map((m) => ({
              ...m,
              role: m.id === memberId ? 'captain' : 'player',
            })),
          };
        }
        return team;
      })
    );
    toast.success('Captain assigned');
  };

  const getRatingLevel = (rating: number) => {
    if (rating < 1100) return { label: 'Beginner', color: 'success' as const };
    if (rating < 1300) return { label: 'Intermediate', color: 'warning' as const };
    if (rating < 1500) return { label: 'Advanced', color: 'info' as const };
    return { label: 'Expert', color: 'error' as const };
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" gutterBottom>
            My Teams
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Create and manage your sports teams
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<PlusIcon />}
          onClick={() => setIsOpen(true)}
        >
          Create Team
        </Button>
      </Box>

      {userTeams.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <UsersIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
            <Typography color="text.secondary">
              No teams yet. Create your first team to get started!
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {userTeams.map((team) => {
            const level = getRatingLevel(team.rating);
            return (
              <Grid item xs={12} lg={4} key={team.id}>
                <Card sx={{ height: '100%', '&:hover': { boxShadow: 6 } }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Box>
                        <Typography variant="h6" gutterBottom>
                          {team.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {team.sport} • {team.location}
                        </Typography>
                      </Box>
                      <Chip label={team.sport} size="small" />
                    </Box>

                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid item xs={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <UsersIcon fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary">
                            {team.players} Players
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <TrophyIcon fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary">
                            {team.wins}W - {team.losses}L
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <TargetIcon fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary">
                            Rating: {team.rating}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>

                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          Level
                        </Typography>
                        <Typography variant="caption">{level.label}</Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={Math.min((team.rating / 2000) * 100, 100)}
                        color={level.color}
                      />
                    </Box>

                    <Box sx={{ borderTop: 1, borderColor: 'divider', pt: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="subtitle2">
                          Team Members ({team.members?.length || 0})
                        </Typography>
                        <Button
                          size="small"
                          startIcon={<UserPlusIcon />}
                          onClick={() => {
                            setSelectedTeamId(team.id);
                            setMemberDialogOpen(true);
                          }}
                        >
                          Add
                        </Button>
                      </Box>
                      <List dense sx={{ maxHeight: 160, overflow: 'auto' }}>
                        {team.members?.length === 0 ? (
                          <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 2 }}>
                            No members added yet
                          </Typography>
                        ) : (
                          team.members?.map((member) => (
                            <ListItem key={member.id} sx={{ bgcolor: 'action.hover', mb: 1, borderRadius: 1 }}>
                              {member.role === 'captain' && (
                                <CrownIcon fontSize="small" sx={{ color: 'warning.main', mr: 1 }} />
                              )}
                              <ListItemText primary={member.name} />
                              <ListItemSecondaryAction>
                                {member.role !== 'captain' && (
                                  <Button
                                    size="small"
                                    onClick={() => handleToggleCaptain(team.id, member.id)}
                                  >
                                    Make Captain
                                  </Button>
                                )}
                                <IconButton
                                  edge="end"
                                  size="small"
                                  onClick={() => handleRemoveMember(team.id, member.id)}
                                >
                                  <XIcon fontSize="small" />
                                </IconButton>
                              </ListItemSecondaryAction>
                            </ListItem>
                          ))
                        )}
                      </List>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Create Team Dialog */}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Team</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Team Name"
              fullWidth
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <FormControl fullWidth required>
              <InputLabel>Sport Type</InputLabel>
              <Select
                value={formData.sport}
                label="Sport Type"
                onChange={(e) => setFormData({ ...formData, sport: e.target.value })}
              >
                {SPORTS_TYPES.map((sport) => (
                  <MenuItem key={sport} value={sport}>
                    {sport}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Number of Players"
              type="number"
              fullWidth
              required
              value={formData.players}
              onChange={(e) => setFormData({ ...formData, players: e.target.value })}
            />
            <TextField
              label="Location"
              fullWidth
              placeholder="e.g., Downtown Arena, City Park"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateTeam}>
            Create Team
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Member Dialog */}
      <Dialog open={memberDialogOpen} onClose={() => setMemberDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Team Member</DialogTitle>
        <DialogContent>
          <TextField
            label="Member Name"
            fullWidth
            margin="normal"
            value={newMemberName}
            onChange={(e) => setNewMemberName(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAddMember();
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMemberDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" startIcon={<UserPlusIcon />} onClick={handleAddMember}>
            Add Member
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
