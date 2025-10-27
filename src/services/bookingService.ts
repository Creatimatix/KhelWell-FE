import axios from 'axios';
import { Booking, ApiResponse } from '../types';
import { BACKEND_API_URL } from '../utils/constant';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface CreateBookingData {
  turfId: string;
  date: string;
  startTime: string;
  endTime: string;
  specialRequests?: string;
}

export interface SlotBookingData {
  turfId: number;
  sportId: number;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  start_slot_value: number;
  end_slot_value: number;
  totalPrice: number;
  status: number;
  specialRequests: string;
  sportType: string;
}

export interface SlotBookingResponse {
  success: boolean;
  message: string;
  data?: {
    booking: {
      id: number;
      user: {
        id: number;
        name: string;
        email: string;
      };
      turf: {
        id: number;
        name: string;
        location: string;
        address: string;
      };
      sport: {
        id: number;
        name: string;
        type: string;
      };
      date: string;
      start_time: string;
      end_time: string;
      duration: string;
      start_slot_value: number;
      end_slot_value: number;
      total_price: string;
      status: number;
      special_requests: string;
      created_at: string;
    };
  };
}

export interface BookedSlot {
  id: number;
  user: {
    id: number;
    name: string;
    email: string;
  };
  sport: {
    id: number;
    name: string;
    type: string;
  };
  date: string;
  start_time: string;
  end_time: string;
  duration: string;
  start_slot_value: number;
  end_slot_value: number;
  total_price: string;
  status: string;
  status_text: string;
  special_requests: string;
  created_at: string;
}

export interface BookedSlotsResponse {
  success: boolean;
  data: BookedSlot[];
}

export const bookingService = {
  async createBooking(bookingData: CreateBookingData): Promise<Booking> {
    const response = await api.post<Booking>('/bookings', bookingData);
    return response.data;
  },

  async createSlotBooking(bookingData: SlotBookingData): Promise<SlotBookingResponse> {
    const response = await axios.post<SlotBookingResponse>(
      BACKEND_API_URL+'slot-bookings',
      bookingData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`,
        },
      }
    );
    return response.data;
  },

  async getUserBookings(): Promise<Booking[]> {
    const response = await api.get<Booking[]>('/bookings/user');
    return response.data;
  },

  async getOwnerBookings(): Promise<Booking[]> {
    const response = await api.get<Booking[]>('/bookings/owner');
    return response.data;
  },

  async getBookingById(id: string): Promise<Booking> {
    const response = await api.get<Booking>(`/bookings/${id}`);
    return response.data;
  },

  async cancelBooking(id: string, reason?: string): Promise<{ message: string }> {
    const response = await api.put<{ message: string }>(`/bookings/${id}/cancel`, { reason });
    return response.data;
  },

  async updateBookingStatus(id: string, status: string): Promise<Booking> {
    const response = await api.put<Booking>(`/bookings/${id}/status`, { status });
    return response.data;
  },

  async getBookedSlots(turfId: number, sportId: number, date: string): Promise<number[]> {
    try {
      console.log("turfId", turfId);
      console.log("sportId", sportId);
      console.log("date", date);
      
      const response = await api.post<BookedSlotsResponse>(
        `${BACKEND_API_URL}slot-bookings/turf/${turfId}`,
        { sport_id: sportId, date },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`,
          },
        }
      );

      console.log("response", response);

      if (response.data.success && response.data.data) {
        // Extract all slot values from the booked slots
        const bookedSlots: number[] = [];
        response.data.data.forEach((booking) => {
          // Add all slot values from start_slot_value to end_slot_value (inclusive)
          for (let i = booking.start_slot_value; i <= booking.end_slot_value; i++) {
            bookedSlots.push(i);
          }
        });
        return bookedSlots;
      }
      return [];
    } catch (error) {
      console.error('Error fetching booked slots:', error);
      return [];
    }
  },
}; 