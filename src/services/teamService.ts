/**
 * Team Service
 * 
 * Handles all team-related API calls including:
 * - Team creation with logo upload
 * - Team management (update, delete)
 * - Team member management
 * 
 * All requests use FormData for file uploads and include authentication tokens
 * API Base: Configured in BACKEND_API_URL constant
 */

import axios from 'axios';
import { Team, TeamMember } from '../types/team';
import { BACKEND_API_URL } from '../utils/constant';

const API_URL = BACKEND_API_URL;

// Create axios instance for team API calls
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface BackendResponse<T> {
  status: string;
  message: string;
  data: T;
  statusCode: number;
}

export interface CreateTeamData {
  name: string;
  sport: string;
  players: number;
  location?: string;
  logo?: File | string;
}

export const teamService = {
  // Create a new team with optional logo upload
  async createTeam(teamData: CreateTeamData): Promise<Team> {
    // Create FormData for file upload if logo exists
    const formData = new FormData();
    formData.append('name', teamData.name);
    formData.append('sport', teamData.sport);
    formData.append('players', teamData.players.toString());
    
    if (teamData.location) {
      formData.append('location', teamData.location);
    }
    
    if (teamData.logo instanceof File) {
      formData.append('logo', teamData.logo);
    }

    // Use multipart/form-data content type for file upload
    const response = await api.post<BackendResponse<Team>>('/team/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${localStorage.getItem('aut_token')}`,
      },
    });

    return response.data.data;
  },

  // Get all teams for the current user
  async getMyTeams(): Promise<Team[]> {
    const response = await api.get<BackendResponse<Team[]>>('/team/my-teams');
    return response.data.data;
  },

  // Get team by ID
  async getTeamById(teamId: string): Promise<Team> {
    const response = await api.get<BackendResponse<Team>>(`/team/${teamId}`);
    return response.data.data;
  },

  // Update team information
  async updateTeam(teamId: string, teamData: Partial<CreateTeamData>): Promise<Team> {
    const formData = new FormData();
    
    if (teamData.name) formData.append('name', teamData.name);
    if (teamData.sport) formData.append('sport', teamData.sport);
    if (teamData.players) formData.append('players', teamData.players.toString());
    if (teamData.location) formData.append('location', teamData.location);
    if (teamData.logo instanceof File) {
      formData.append('logo', teamData.logo);
    }

    const response = await api.post<BackendResponse<Team>>(`/team/${teamId}/update`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.data;
  },

  // Add member to team
  async addMember(teamId: string, memberName: string): Promise<Team> {
    const response = await api.post<BackendResponse<Team>>(`/team/${teamId}/add-member`, {
      name: memberName,
    });
    return response.data.data;
  },

  // Remove member from team
  async removeMember(teamId: string, memberId: string): Promise<Team> {
    const response = await api.post<BackendResponse<Team>>(`/team/${teamId}/remove-member`, {
      memberId,
    });
    return response.data.data;
  },

  // Delete team
  async deleteTeam(teamId: string): Promise<void> {
    await api.delete(`/team/${teamId}`);
  },
};

