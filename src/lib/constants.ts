import { Service, Barber } from './types';

export const SERVICES: Service[] = [
  {
    id: 'corte',
    name: 'Corte de cabelo',
    price: 15,
    duration: 30
  },
  {
    id: 'barba',
    name: 'Barba',
    price: 10,
    duration: 20
  },
  {
    id: 'corte-barba',
    name: 'Corte + Barba',
    price: 20,
    duration: 45
  }
];

export const BARBERS: Barber[] = [
  { id: 'joao', name: 'João' },
  { id: 'miguel', name: 'Miguel' },
  { id: 'pedro', name: 'Pedro' }
];

// Horários disponíveis (9h às 18h)
export const AVAILABLE_TIMES = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
];

export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const formatTime = (time: string): string => {
  return time;
};

export const isWeekend = (date: Date): boolean => {
  const day = date.getDay();
  return day === 0 || day === 6; // Domingo ou Sábado
};