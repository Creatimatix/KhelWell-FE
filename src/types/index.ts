export interface User {
  id?: number; // For backend compatibility
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'owner' | 'admin';
  preference: string;
  gender: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  profileImage?: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Sport {
  id: number;
  id_turf: number;
  id_sport: number;
  name: string;
  rate_per_hour: number;
  sport_type: {
    id: number;
    name: string;
  };
  dimensions: string;
  capacity: number;
  rules: string;
  status: number;
  created_at: string;
  updated_at: string;
}

export interface Turf {
  id: number;
  name: string;
  slug: string;
  location: string;
  address: string;
  rating: {
    average: number;
    count: number;
  };
  timing: string;
  pricing: any;
  latitude: string;
  longitude: string;
  status: number;
  features: string;
  benefits: string;
  description: string;
  rules: string;
  created_at: string;
  updated_at: string;
  min_price: number;
  sports: Sport[];
  images: any[];
  approved_reviews: any[];
  rate_per_hour: number;
  sport_type:  {
    id: number;
    name: string;
  };
}

export interface Slot {
  startTime: string;
  endTime: string;
  price: number;
  isAvailable: boolean;
}

export interface Booking {
  _id: string;
  user: User;
  turf: Turf;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: 'cash' | 'online' | 'card';
  paymentId?: string;
  specialRequests?: string;
  cancellationReason?: string;
  cancelledBy?: 'user' | 'owner' | 'admin';
  cancelledAt?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  formattedDate?: string;
}

export interface Event {
  _id: string;
  title: string;
  description: string;
  image?: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  location: string;
  sportType: 'football' | 'cricket' | 'tennis' | 'basketball' | 'badminton' | 'volleyball' | 'multi-sport' | 'general';
  type: 'tournament' | 'championship' | 'league' | 'exhibition' | 'training' | 'other';
  entryFee: number;
  maxParticipants?: number;
  currentParticipants: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  isActive: boolean;
  createdBy: User;
  registrationDeadline?: string;
  prizes?: Array<{
    position: string;
    prize: string;
  }>;
  rules?: string[];
  contactInfo?: {
    name: string;
    phone: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  isOngoing?: boolean;
  isUpcoming?: boolean;
  event_start_date: string;
  status_info?: {
    status: string;
    time_until_start: string;
  }
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  loading: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
  gender: string;
  preference: string;
  role?: 'user' | 'owner';
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export interface SearchFilters {
  city?: string;
  sportType?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
} 

export interface TimeSlot {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  isBooked: boolean;
  value: number;
}


export interface TimeRange {
  startTime: string;
  endTime: string;
  duration: number;
  totalPrice: number;
  start_slot_value: number;
  end_slot_value: number;
}
