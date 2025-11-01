import { useState } from 'react';
import {
  Box,
  Container,
  Tabs,
  Tab,
  Paper,
  ThemeProvider,
  CssBaseline,
} from '@mui/material';
import { TeamManager } from '../../components/teams/TeamManager';
import { TeamConnections } from '../../components/teams/TeamConnections';
import { TeamAvailability } from '../../components/teams/TeamAvailability';
import { MatchChallenges } from '../../components/teams/MatchChallenges';
import { theme } from '../../pages/user/teamTheme';
import { useNotification } from '../../components/Layout';
import { Connection, MatchChallenge } from '../../types/team';
import { UserPublicProfile } from './UserPublicProfile';

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
  // Get centralized notification function and user teams from Layout context
  // All notifications will appear in the header bell at the top of the page
  const { addNotification, userTeams, setUserTeams } = useNotification();

  const [connections, setConnections] = useState<Connection[]>([]);
  const [matchChallenges, setMatchChallenges] = useState<MatchChallenge[]>([]);
  const [currentTab, setCurrentTab] = useState(0);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      
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
              <Tab label="Public Profile" />
              
            </Tabs>
          </Paper>

          <TabPanel value={currentTab} index={0}>
            <TeamManager userTeams={userTeams} setUserTeams={setUserTeams} />
          </TabPanel>

          {/* Pass addNotification function to team components 
              All notifications from team actions will appear in the header bell */}
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

          <TabPanel value={currentTab} index={5}>
            <UserPublicProfile userTeams={userTeams} />
          </TabPanel>

        </Container>
      </Box>
    </ThemeProvider>
  );
}