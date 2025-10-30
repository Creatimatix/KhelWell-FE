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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Grid,
  Tabs,
  Tab,
  Alert,
} from '@mui/material';
import {
  SportsMma as SwordsIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as XCircleIcon,
  AccessTime as ClockIcon,
  Event as CalendarIcon,
  EmojiEvents as TrophyIcon,
  GpsFixed as TargetIcon,
} from '@mui/icons-material';
// import { toast } from 'sonner@2.0.3';
import toast from 'react-hot-toast';
import { Team, Connection, MatchChallenge, Notification } from '../../types/team';

const SUGGESTED_TEAMS: Team[] = [
  { id: 'st1', name: 'Warriors United', sport: 'Football', players: 11, rating: 1150, wins: 8, losses: 3, location: 'Downtown Arena' },
  { id: 'st2', name: 'Street Strikers', sport: 'Football', players: 11, rating: 1050, wins: 4, losses: 5, location: 'City Park' },
  { id: 'st3', name: 'Phoenix FC', sport: 'Football', players: 11, rating: 1400, wins: 12, losses: 2, location: 'Sports Complex' },
  { id: 'st4', name: 'Lions CC', sport: 'Cricket', players: 11, rating: 1200, wins: 6, losses: 4, location: 'Cricket Ground' },
  { id: 'st5', name: 'Royal Challengers', sport: 'Cricket', players: 11, rating: 1350, wins: 10, losses: 3, location: 'Main Stadium' },
];

interface MatchChallengesProps {
  userTeams: Team[];
  setUserTeams: (teams: Team[]) => void;
  matchChallenges: MatchChallenge[];
  setMatchChallenges: (challenges: MatchChallenge[]) => void;
  connections: Connection[];
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
}

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

export function MatchChallenges({
  userTeams,
  matchChallenges,
  setMatchChallenges,
  connections,
  addNotification,
}: MatchChallengesProps) {
  const [isChallengeDialogOpen, setIsChallengeDialogOpen] = useState(false);
  const [isCounterDialogOpen, setIsCounterDialogOpen] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<MatchChallenge | null>(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [challengeData, setChallengeData] = useState({
    myTeamId: '',
    opponentTeamId: '',
    proposedTime: '',
    message: '',
  });
  const [counterTime, setCounterTime] = useState('');

  const handleSendChallenge = () => {
    if (!challengeData.myTeamId || !challengeData.opponentTeamId) {
      toast.error('Please select both teams');
      return;
    }

    const newChallenge: MatchChallenge = {
      id: Date.now().toString(),
      fromTeamId: challengeData.myTeamId,
      toTeamId: challengeData.opponentTeamId,
      proposedTime: challengeData.proposedTime,
      status: 'pending',
      message: challengeData.message,
      createdAt: new Date().toISOString(),
    };

    setMatchChallenges([...matchChallenges, newChallenge]);

    const myTeam = userTeams.find((t) => t.id === challengeData.myTeamId);

    addNotification({
      type: 'match_request',
      message: `${myTeam?.name} sent you a match challenge${challengeData.proposedTime ? ` for ${challengeData.proposedTime}` : ''}`,
      fromTeamId: challengeData.myTeamId,
      toTeamId: challengeData.opponentTeamId,
    });

    toast.success('Match challenge sent!');
    setChallengeData({ myTeamId: '', opponentTeamId: '', proposedTime: '', message: '' });
    setIsChallengeDialogOpen(false);
  };

  const handleAcceptChallenge = (challengeId: string) => {
    setMatchChallenges(
      matchChallenges.map((ch) =>
        ch.id === challengeId ? { ...ch, status: 'accepted' } : ch
      )
    );

    const challenge = matchChallenges.find((c) => c.id === challengeId);
    if (challenge) {
      const fromTeam = userTeams.find((t) => t.id === challenge.fromTeamId) ||
                       SUGGESTED_TEAMS.find((t) => t.id === challenge.fromTeamId);

      addNotification({
        type: 'match_confirmed',
        message: `Match confirmed with ${fromTeam?.name}${challenge.proposedTime ? ` at ${challenge.proposedTime}` : ''}!`,
        fromTeamId: challenge.toTeamId,
        toTeamId: challenge.fromTeamId,
      });
    }

    toast.success('Match challenge accepted!');
  };

  const handleRejectChallenge = (challengeId: string) => {
    setMatchChallenges(
      matchChallenges.map((ch) =>
        ch.id === challengeId ? { ...ch, status: 'rejected' } : ch
      )
    );
    toast.error('Match challenge declined');
  };

  const handleCounterPropose = () => {
    if (!counterTime.trim() || !selectedChallenge) {
      toast.error('Please enter a proposed time');
      return;
    }

    setMatchChallenges(
      matchChallenges.map((ch) =>
        ch.id === selectedChallenge.id
          ? { ...ch, status: 'counter_proposed', proposedTime: counterTime }
          : ch
      )
    );

    const challenge = selectedChallenge;
    const myTeam = userTeams.find((t) => t.id === challenge.toTeamId);

    addNotification({
      type: 'match_request',
      message: `${myTeam?.name} proposed a different time: ${counterTime}`,
      fromTeamId: challenge.toTeamId,
      toTeamId: challenge.fromTeamId,
    });

    toast.success('Counter proposal sent!');
    setCounterTime('');
    setIsCounterDialogOpen(false);
    setSelectedChallenge(null);
  };

  const getConnectedTeams = () => {
    return connections
      .filter((conn) => conn.status === 'accepted')
      .map((conn) => {
        const teamId = userTeams.some((t) => t.id === conn.fromTeamId)
          ? conn.toTeamId
          : conn.fromTeamId;
        return SUGGESTED_TEAMS.find((t) => t.id === teamId);
      })
      .filter(Boolean) as Team[];
  };

  const connectedTeams = getConnectedTeams();
  const pendingChallenges = matchChallenges.filter((ch) => ch.status === 'pending');
  const acceptedChallenges = matchChallenges.filter((ch) => ch.status === 'accepted');
  const counterProposedChallenges = matchChallenges.filter((ch) => ch.status === 'counter_proposed');

  const ChallengeCard = ({ challenge, showActions = false }: { challenge: MatchChallenge; showActions?: boolean }) => {
    const fromTeam = userTeams.find((t) => t.id === challenge.fromTeamId) ||
                     SUGGESTED_TEAMS.find((t) => t.id === challenge.fromTeamId);
    const toTeam = userTeams.find((t) => t.id === challenge.toTeamId) ||
                   SUGGESTED_TEAMS.find((t) => t.id === challenge.toTeamId);

    const getStatusColor = (status: string) => {
      switch (status) {
        case 'accepted': return 'success';
        case 'rejected': return 'error';
        case 'counter_proposed': return 'info';
        default: return 'default';
      }
    };

    return (
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <SwordsIcon />
                <Typography variant="h6">
                  {fromTeam?.name} vs {toTeam?.name}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {fromTeam?.sport} Match
              </Typography>
            </Box>
            <Chip
              label={challenge.status.replace('_', ' ')}
              color={getStatusColor(challenge.status) as any}
              size="small"
              icon={
                challenge.status === 'pending' ? <ClockIcon /> :
                challenge.status === 'accepted' ? <CheckCircleIcon /> :
                challenge.status === 'rejected' ? <XCircleIcon /> : undefined
              }
            />
          </Box>

          {challenge.proposedTime && (
            <Alert severity="info" icon={<CalendarIcon />} sx={{ mb: 2 }}>
              Proposed: {challenge.proposedTime}
            </Alert>
          )}

          {challenge.message && (
            <Alert severity="info" sx={{ mb: 2 }}>
              {challenge.message}
            </Alert>
          )}

          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={6}>
              <Typography variant="caption" color="text.secondary">From</Typography>
              <Typography variant="body2">{fromTeam?.name}</Typography>
              <Typography variant="caption" color="text.secondary">
                Rating: {fromTeam?.rating}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="caption" color="text.secondary">To</Typography>
              <Typography variant="body2">{toTeam?.name}</Typography>
              <Typography variant="caption" color="text.secondary">
                Rating: {toTeam?.rating}
              </Typography>
            </Grid>
          </Grid>

          {showActions && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                color="success"
                size="small"
                startIcon={<CheckCircleIcon />}
                onClick={() => handleAcceptChallenge(challenge.id)}
                fullWidth
              >
                Accept
              </Button>
              <Button
                variant="outlined"
                size="small"
                startIcon={<CalendarIcon />}
                onClick={() => {
                  setSelectedChallenge(challenge);
                  setIsCounterDialogOpen(true);
                }}
                fullWidth
              >
                Counter
              </Button>
              <Button
                variant="outlined"
                color="error"
                size="small"
                startIcon={<XCircleIcon />}
                onClick={() => handleRejectChallenge(challenge.id)}
              >
                Decline
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography variant="h5" gutterBottom>
            Match Challenges
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Challenge connected teams and manage match requests
          </Typography>
        </Box>
        {userTeams.length > 0 && connectedTeams.length > 0 && (
          <Button
            variant="contained"
            startIcon={<SwordsIcon />}
            onClick={() => setIsChallengeDialogOpen(true)}
          >
            Send Challenge
          </Button>
        )}
      </Box>

      {userTeams.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <TrophyIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
            <Typography color="text.secondary">
              Create a team first to challenge others
            </Typography>
          </CardContent>
        </Card>
      ) : connectedTeams.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <TargetIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
            <Typography color="text.secondary">
              Connect with teams first before sending challenges
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Box>
          <Tabs value={currentTab} onChange={(_, newValue) => setCurrentTab(newValue)}>
            <Tab label={`Pending (${pendingChallenges.length})`} />
            <Tab label={`Scheduled (${acceptedChallenges.length})`} />
            <Tab label={`Counter (${counterProposedChallenges.length})`} />
          </Tabs>

          <TabPanel value={currentTab} index={0}>
            {pendingChallenges.length === 0 ? (
              <Card>
                <CardContent sx={{ textAlign: 'center', py: 8 }}>
                  <ClockIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                  <Typography color="text.secondary">No pending challenges</Typography>
                </CardContent>
              </Card>
            ) : (
              pendingChallenges.map((challenge) => (
                <ChallengeCard key={challenge.id} challenge={challenge} showActions={true} />
              ))
            )}
          </TabPanel>

          <TabPanel value={currentTab} index={1}>
            {acceptedChallenges.length === 0 ? (
              <Card>
                <CardContent sx={{ textAlign: 'center', py: 8 }}>
                  <CheckCircleIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                  <Typography color="text.secondary">No scheduled matches</Typography>
                </CardContent>
              </Card>
            ) : (
              acceptedChallenges.map((challenge) => (
                <ChallengeCard key={challenge.id} challenge={challenge} />
              ))
            )}
          </TabPanel>

          <TabPanel value={currentTab} index={2}>
            {counterProposedChallenges.length === 0 ? (
              <Card>
                <CardContent sx={{ textAlign: 'center', py: 8 }}>
                  <CalendarIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                  <Typography color="text.secondary">No counter proposals</Typography>
                </CardContent>
              </Card>
            ) : (
              counterProposedChallenges.map((challenge) => (
                <ChallengeCard key={challenge.id} challenge={challenge} showActions={true} />
              ))
            )}
          </TabPanel>
        </Box>
      )}

      {/* Send Challenge Dialog */}
      <Dialog open={isChallengeDialogOpen} onClose={() => setIsChallengeDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Send Match Challenge</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>My Team</InputLabel>
              <Select
                value={challengeData.myTeamId}
                label="My Team"
                onChange={(e) => setChallengeData({ ...challengeData, myTeamId: e.target.value })}
              >
                {userTeams.map((team) => (
                  <MenuItem key={team.id} value={team.id}>
                    {team.name} ({team.sport})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Challenge Team</InputLabel>
              <Select
                value={challengeData.opponentTeamId}
                label="Challenge Team"
                onChange={(e) => setChallengeData({ ...challengeData, opponentTeamId: e.target.value })}
              >
                {connectedTeams.map((team) => (
                  <MenuItem key={team.id} value={team.id}>
                    {team.name} ({team.sport})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Proposed Time (Optional)"
              placeholder="e.g., Saturday 5:00 PM"
              value={challengeData.proposedTime}
              onChange={(e) => setChallengeData({ ...challengeData, proposedTime: e.target.value })}
            />
            <TextField
              label="Message (Optional)"
              multiline
              rows={3}
              placeholder="Add a message..."
              value={challengeData.message}
              onChange={(e) => setChallengeData({ ...challengeData, message: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsChallengeDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" startIcon={<SwordsIcon />} onClick={handleSendChallenge}>
            Send Challenge
          </Button>
        </DialogActions>
      </Dialog>

      {/* Counter Proposal Dialog */}
      <Dialog open={isCounterDialogOpen} onClose={() => setIsCounterDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Counter Propose Time</DialogTitle>
        <DialogContent>
          <TextField
            label="Proposed Time"
            fullWidth
            margin="normal"
            placeholder="e.g., Sunday 3:00 PM"
            value={counterTime}
            onChange={(e) => setCounterTime(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsCounterDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" startIcon={<CalendarIcon />} onClick={handleCounterPropose}>
            Send Counter Proposal
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
