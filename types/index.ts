export interface EventImage {
  id: string;
  image_url: string;
  event_id: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time?: string;
  location: string;
  image_url?: string;
  created_by: string;
  is_private: boolean;
  created_at: string;
  updated_at: string;
  event_images?: EventImage[];
  type?: string;
  capacity?: number;
  price?: number;
  logistics_phone?: string;
}

export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
}

export interface Team {
  id: string;
  name: string;
  description?: string;
  created_by: string;
  created_at: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

export interface DashboardStats {
  totalEvents: number;
  upcomingEvents: number;
  totalTeams: number;
  activeTeams: number;
} 