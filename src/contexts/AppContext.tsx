'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Appointment, AppointmentWithDetails } from '@/lib/types';
import { SERVICES, BARBERS } from '@/lib/constants';
import { 
  sendConfirmationEmail, 
  sendNewAppointmentNotification, 
  sendCancellationEmail,
  scheduleReminderEmail,
  checkPendingReminders,
  AppointmentEmailData 
} from '@/lib/email';

interface AppContextType {
  // Estado da navegação
  currentPage: string;
  setCurrentPage: (page: string) => void;
  
  // Estado do agendamento em progresso
  selectedService: string | null;
  selectedBarber: string | null;
  selectedDate: string | null;
  selectedTime: string | null;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  
  // Funções para atualizar o agendamento
  setSelectedService: (serviceId: string | null) => void;
  setSelectedBarber: (barberId: string | null) => void;
  setSelectedDate: (date: string | null) => void;
  setSelectedTime: (time: string | null) => void;
  setClientName: (name: string) => void;
  setClientPhone: (phone: string) => void;
  setClientEmail: (email: string) => void;
  
  // Agendamentos salvos
  appointments: Appointment[];
  addAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt'>) => void;
  getAppointmentsWithDetails: () => AppointmentWithDetails[];
  
  // Gerenciamento de status (Admin)
  updateAppointmentStatus: (appointmentId: string, status: string) => void;
  cancelAppointment: (appointmentId: string, reason?: string) => void;
  
  // Configurações de notificação
  emailNotificationsEnabled: boolean;
  setEmailNotificationsEnabled: (enabled: boolean) => void;
  
  // Notificações visuais (Admin)
  markAppointmentAsViewed: (appointmentId: string) => void;
  getUnviewedCount: () => number;
  getRecentAppointments: () => AppointmentWithDetails[];
  refreshAppointments: () => void;
  
  // Verificar disponibilidade
  isTimeAvailable: (date: string, time: string, barberId: string) => boolean;
  
  // Reset do formulário
  resetBooking: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  // Estado da navegação
  const [currentPage, setCurrentPage] = useState('home');
  
  // Estado do agendamento em progresso
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedBarber, setSelectedBarber] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  
  // Agendamentos salvos
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  
  // Configurações de notificação (ativadas por padrão)
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(true);
  
  // Verificar lembretes pendentes quando a app carrega
  useEffect(() => {
    if (emailNotificationsEnabled && appointments.length > 0) {
      checkPendingReminders(getAppointmentsWithDetails());
    }
  }, [appointments, emailNotificationsEnabled]);
  
  const addAppointment = async (appointmentData: Omit<Appointment, 'id' | 'createdAt'>) => {
    const newAppointment: Appointment = {
      ...appointmentData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: 'pending', // Status inicial sempre pendente
      viewed: false // Nova marcação sempre não vista
    };
    
    setAppointments(prev => [...prev, newAppointment]);
    
    // Enviar notificações por email se estiverem ativadas
    if (emailNotificationsEnabled && clientEmail) {
      const service = SERVICES.find(s => s.id === appointmentData.serviceId);
      const barber = BARBERS.find(b => b.id === appointmentData.barberId);
      
      const emailData: AppointmentEmailData = {
        clientName: appointmentData.clientName,
        clientEmail: clientEmail,
        serviceName: service?.name || 'Serviço não encontrado',
        barberName: barber?.name || 'Sem preferência de barbeiro',
        date: appointmentData.date,
        time: appointmentData.time,
        price: service?.price || 0,
        appointmentId: newAppointment.id
      };
      
      try {
        // Enviar email de confirmação para o cliente
        await sendConfirmationEmail(emailData);
        console.log('✅ Email de confirmação enviado para o cliente');
        
        // Enviar notificação para o dono da barbearia
        await sendNewAppointmentNotification(emailData);
        console.log('✅ Notificação enviada para o dono da barbearia');
        
        // Agendar lembrete automático 24h antes
        scheduleReminderEmail(emailData);
        console.log('⏰ Lembrete agendado para 24h antes da marcação');
        
      } catch (error) {
        console.error('❌ Erro ao enviar notificações:', error);
      }
    }
  };
  
  const updateAppointmentStatus = (appointmentId: string, status: string) => {
    setAppointments(prev => 
      prev.map(appointment => 
        appointment.id === appointmentId 
          ? { ...appointment, status }
          : appointment
      )
    );
  };
  
  const cancelAppointment = async (appointmentId: string, reason?: string) => {
    const appointment = appointments.find(apt => apt.id === appointmentId);
    
    setAppointments(prev => 
      prev.map(appointment => 
        appointment.id === appointmentId 
          ? { ...appointment, status: 'cancelled' }
          : appointment
      )
    );
    
    // Enviar email de cancelamento se as notificações estiverem ativadas
    if (emailNotificationsEnabled && appointment && clientEmail) {
      const service = SERVICES.find(s => s.id === appointment.serviceId);
      const barber = BARBERS.find(b => b.id === appointment.barberId);
      
      const emailData: AppointmentEmailData = {
        clientName: appointment.clientName,
        clientEmail: clientEmail,
        serviceName: service?.name || 'Serviço não encontrado',
        barberName: barber?.name || 'Sem preferência de barbeiro',
        date: appointment.date,
        time: appointment.time,
        price: service?.price || 0,
        appointmentId: appointment.id,
        cancelReason: reason
      };
      
      try {
        await sendCancellationEmail(emailData);
        console.log('✅ Email de cancelamento enviado para o cliente');
      } catch (error) {
        console.error('❌ Erro ao enviar email de cancelamento:', error);
      }
    }
  };
  
  // Marcar marcação como vista
  const markAppointmentAsViewed = (appointmentId: string) => {
    setAppointments(prev => 
      prev.map(appointment => 
        appointment.id === appointmentId 
          ? { ...appointment, viewed: true }
          : appointment
      )
    );
  };
  
  // Contar marcações não vistas
  const getUnviewedCount = (): number => {
    return appointments.filter(apt => !apt.viewed).length;
  };
  
  // Obter marcações recentes (últimas 24h ou não vistas)
  const getRecentAppointments = (): AppointmentWithDetails[] => {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    return getAppointmentsWithDetails()
      .filter(apt => {
        const createdAt = new Date(apt.createdAt);
        return !apt.viewed || createdAt > yesterday;
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };
  
  // Função para simular atualização (em produção seria uma chamada à API)
  const refreshAppointments = () => {
    // Simular nova marcação para demonstração
    console.log('🔄 Verificando novas marcações...');
  };
  
  const getAppointmentsWithDetails = (): AppointmentWithDetails[] => {
    return appointments.map(appointment => {
      const service = SERVICES.find(s => s.id === appointment.serviceId);
      const barber = BARBERS.find(b => b.id === appointment.barberId);
      
      return {
        ...appointment,
        serviceName: service?.name || 'Serviço não encontrado',
        servicePrice: service?.price || 0,
        barberName: barber?.name || 'Sem preferência de barbeiro'
      };
    });
  };
  
  const isTimeAvailable = (date: string, time: string, barberId: string): boolean => {
    return !appointments.some(appointment => 
      appointment.date === date && 
      appointment.time === time && 
      appointment.barberId === barberId &&
      appointment.status !== 'cancelled' // Horários cancelados ficam disponíveis
    );
  };
  
  const resetBooking = () => {
    setSelectedService(null);
    setSelectedBarber(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setClientName('');
    setClientPhone('');
    setClientEmail('');
  };
  
  return (
    <AppContext.Provider value={{
      currentPage,
      setCurrentPage,
      selectedService,
      selectedBarber,
      selectedDate,
      selectedTime,
      clientName,
      clientPhone,
      clientEmail,
      setSelectedService,
      setSelectedBarber,
      setSelectedDate,
      setSelectedTime,
      setClientName,
      setClientPhone,
      setClientEmail,
      appointments,
      addAppointment,
      getAppointmentsWithDetails,
      updateAppointmentStatus,
      cancelAppointment,
      emailNotificationsEnabled,
      setEmailNotificationsEnabled,
      markAppointmentAsViewed,
      getUnviewedCount,
      getRecentAppointments,
      refreshAppointments,
      isTimeAvailable,
      resetBooking
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}