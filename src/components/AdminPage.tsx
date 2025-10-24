'use client';

import { useApp } from '@/contexts/AppContext';

export default function AdminPage() {
  const { getAppointmentsWithDetails } = useApp();
  
  const appointments = getAppointmentsWithDetails();
  const sortedAppointments = appointments.sort((a, b) => {
    const dateA = new Date(`${a.date} ${a.time}`);
    const dateB = new Date(`${b.date} ${b.time}`);
    return dateB.getTime() - dateA.getTime();
  });
  
  const formatDisplayDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('pt-PT', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const getTodayAppointments = () => {
    const today = new Date().toISOString().split('T')[0];
    return appointments.filter(apt => apt.date === today);
  };
  
  const getUpcomingAppointments = () => {
    const today = new Date().toISOString().split('T')[0];
    return appointments.filter(apt => apt.date > today);
  };
  
  const getPastAppointments = () => {
    const today = new Date().toISOString().split('T')[0];
    return appointments.filter(apt => apt.date < today);
  };
  
  const todayAppointments = getTodayAppointments();
  const upcomingAppointments = getUpcomingAppointments();
  const pastAppointments = getPastAppointments();
  
  const AppointmentCard = ({ appointment, isPast = false }: { appointment: any, isPast?: boolean }) => (
    <div className={`bg-white p-4 rounded-xl border border-[#E5E7EB] ${isPast ? 'opacity-75' : ''}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-geist-sans font-bold text-[#111827] text-lg mb-1">
            {appointment.clientName}
          </h3>
          <div className="flex items-center gap-2 text-[#6B7280] mb-2">
            <span className="text-sm font-inter">{appointment.clientPhone}</span>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-inter font-semibold ${
          isPast ? 'bg-[#F7F7F8] text-[#6B7280]' : 'bg-[#1E3A8A] text-white'
        }`}>
          {isPast ? 'Concluído' : 'Agendado'}
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-[#111827]">
          <span className="font-inter font-medium">Barbeiro: {appointment.barberName}</span>
        </div>
        
        <div className="flex items-center gap-2 text-[#111827]">
          <span className="font-inter">{formatDisplayDate(appointment.date)}</span>
        </div>
        
        <div className="flex items-center gap-2 text-[#111827]">
          <span className="font-inter">{appointment.time}</span>
        </div>
        
        <div className="flex items-center justify-between pt-2 border-t border-[#E5E7EB]">
          <span className="font-inter font-medium text-[#111827]">
            {appointment.serviceName}
          </span>
          <div className="flex items-center gap-1 text-[#1E3A8A] font-inter font-bold">
            <span>{appointment.servicePrice}€</span>
          </div>
        </div>
      </div>
    </div>
  );
  
  return (
    <div className="min-h-screen bg-[#F7F7F8] p-4">
      <div className="max-w-2xl mx-auto pt-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-geist-sans font-bold text-[#111827] mb-2">
            Painel Administrativo
          </h2>
          <p className="text-[#6B7280] font-inter">
            Gerencie todas as marcações da barbearia
          </p>
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800 font-inter">
              💡 <strong>Acesso Completo:</strong> Para funcionalidades avançadas de gestão, 
              acesse <span className="font-mono">www.agendamento24.pt/admin</span>
            </p>
          </div>
        </div>
        
        {/* Estatísticas */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl border border-[#E5E7EB] text-center">
            <div className="text-2xl font-geist-sans font-bold text-[#1E3A8A] mb-1">
              {todayAppointments.length}
            </div>
            <div className="text-sm text-[#6B7280] font-inter">Hoje</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-[#E5E7EB] text-center">
            <div className="text-2xl font-geist-sans font-bold text-[#1E3A8A] mb-1">
              {upcomingAppointments.length}
            </div>
            <div className="text-sm text-[#6B7280] font-inter">Próximos</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-[#E5E7EB] text-center">
            <div className="text-2xl font-geist-sans font-bold text-[#1E3A8A] mb-1">
              {appointments.length}
            </div>
            <div className="text-sm text-[#6B7280] font-inter">Total</div>
          </div>
        </div>
        
        {appointments.length === 0 ? (
          <div className="bg-white p-8 rounded-xl border border-[#E5E7EB] text-center">
            <h3 className="text-xl font-geist-sans font-bold text-[#6B7280] mb-2">
              Nenhuma marcação ainda
            </h3>
            <p className="text-[#6B7280] font-inter">
              As marcações dos clientes aparecerão aqui
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Agendamentos de hoje */}
            {todayAppointments.length > 0 && (
              <div>
                <h3 className="text-xl font-geist-sans font-bold text-[#111827] mb-4 flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#1E3A8A] rounded-full"></div>
                  Hoje ({todayAppointments.length})
                </h3>
                <div className="space-y-4">
                  {todayAppointments
                    .sort((a, b) => a.time.localeCompare(b.time))
                    .map(appointment => (
                      <AppointmentCard key={appointment.id} appointment={appointment} />
                    ))}
                </div>
              </div>
            )}
            
            {/* Próximos agendamentos */}
            {upcomingAppointments.length > 0 && (
              <div>
                <h3 className="text-xl font-geist-sans font-bold text-[#111827] mb-4 flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#1E3A8A] rounded-full"></div>
                  Próximos ({upcomingAppointments.length})
                </h3>
                <div className="space-y-4">
                  {upcomingAppointments
                    .sort((a, b) => {
                      const dateA = new Date(`${a.date} ${a.time}`);
                      const dateB = new Date(`${b.date} ${b.time}`);
                      return dateA.getTime() - dateB.getTime();
                    })
                    .map(appointment => (
                      <AppointmentCard key={appointment.id} appointment={appointment} />
                    ))}
                </div>
              </div>
            )}
            
            {/* Agendamentos passados */}
            {pastAppointments.length > 0 && (
              <div>
                <h3 className="text-xl font-geist-sans font-bold text-[#111827] mb-4 flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#6B7280] rounded-full"></div>
                  Histórico ({pastAppointments.length})
                </h3>
                <div className="space-y-4">
                  {pastAppointments
                    .sort((a, b) => {
                      const dateA = new Date(`${a.date} ${a.time}`);
                      const dateB = new Date(`${b.date} ${b.time}`);
                      return dateB.getTime() - dateA.getTime();
                    })
                    .slice(0, 10) // Mostrar apenas os 10 mais recentes
                    .map(appointment => (
                      <AppointmentCard key={appointment.id} appointment={appointment} isPast />
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}