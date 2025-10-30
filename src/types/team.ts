
export interface Team {
    id: string;
    name: string;
    sport: string;
    players: number;
    rating: number;
    wins: number;
    losses: number;
    location?: string;
    logo?: string;
    members?: TeamMember[];
    isAvailable?: boolean;
    availableSlots?: string[];
  }
  
  export interface TeamMember {
    id: string;
    name: string;
    role: 'captain' | 'player';
    available: boolean;
  }
  
  export interface Connection {
    id: string;
    fromTeamId: string;
    toTeamId: string;
    status: 'pending' | 'accepted' | 'rejected';
    createdAt: string;
  }
  
  export interface Notification {
    id: string;
    type: 'connection_request' | 'connection_accepted' | 'team_available' | 'match_request' | 'match_confirmed' | 'match_cancelled';
    message: string;
    fromTeamId?: string;
    toTeamId?: string;
    read: boolean;
    createdAt: string;
  }
  
  export interface MatchChallenge {
    id: string;
    fromTeamId: string;
    toTeamId: string;
    proposedTime?: string;
    status: 'pending' | 'accepted' | 'rejected' | 'counter_proposed';
    message?: string;
    createdAt: string;
  }