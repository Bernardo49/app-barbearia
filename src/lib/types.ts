export interface Service {
  id: string;
  name: string;
  duration: number; // em minutos
  price: number;
  description: string;
}

export interface Barber {
  id: string;
  name: string;
  specialties: string[];
  image?: string;
}

export interface Appointment {
  id: string;
  serviceId: string;
  barberId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  clientName: string;
  clientPhone: string;
  clientEmail?: string; // Campo opcional para notificações
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
  viewed?: boolean; // Campo para controlar se a marcação foi vista pelo dono
}

export interface AppointmentWithDetails extends Appointment {
  serviceName: string;
  servicePrice: number;
  barberName: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}