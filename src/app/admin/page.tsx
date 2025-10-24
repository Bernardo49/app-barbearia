'use client';

import { useApp } from '@/contexts/AppContext';
import { useState, useEffect } from 'react';
import { Check, X, Clock, CheckCircle, XCircle, Mail, Calendar, User, Scissors, Euro, Settings, Bell, BellOff, Eye, EyeOff, RefreshCw } from 'lucide-react';

export default function AdminPage() {
  const { 
    getAppointmentsWithDetails, 
    updateAppointmentStatus, 
    cancelAppointment,
    emailNotificationsEnabled,
    setEmailNotificationsEnabled,
    markAppointmentAsViewed,
    getUnviewedCount,
    getRecentAppointments,
    refreshAppointments
  } = useApp();
  
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showSettings, setShowSettings] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [appointmentToCancel, setAppointmentToCancel] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'unviewed' | 'today' | 'week' | 'cancelled'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const appointments = getAppointmentsWithDetails();
  const unviewedCount = getUnviewedCount();
  const recentAppointments = getRecentAppointments();
  
  // Auto-refresh a cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      refreshAppointments();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Filtrar marcações baseado no filtro selecionado
  const getFilteredAppointments = () => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    let filtered = appointments;
    
    switch (filter) {
      case 'unviewed':
        filtered = appointments.filter(apt => !apt.viewed);
        break;
      case 'today':
        filtered = appointments.filter(apt => apt.date === today);
        break;
      case 'week':
        filtered = appointments.filter(apt => {
          const aptDate = new Date(apt.date + 'T00:00:00');
          return aptDate >= weekStart;
        });
        break;
      case 'cancelled':
        filtered = appointments.filter(apt => apt.status === 'cancelled');
        break;
      default:
        filtered = appointments;
    }
    
    // Aplicar filtro de status se não for 'all'
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(apt => apt.status === selectedStatus);
    }
    
    // Ordenar por data e hora (mais recente primeiro)
    return filtered.sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.time}`);
      const dateB = new Date(`${b.date} ${b.time}`);
      return dateB.getTime() - dateA.getTime();
    });
  };
  
  const filteredAppointments = getFilteredAppointments();
  
  const formatDisplayDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('pt-PT', {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  
  // Estatísticas do dia
  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter(apt => apt.date === today);
  const todayEarnings = todayAppointments
    .filter(apt => apt.status === 'completed')
    .reduce((sum, apt) => sum + apt.servicePrice, 0);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'confirmed': return <Check className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'confirmed': return 'Confirmada';
      case 'completed': return 'Concluída';
      case 'cancelled': return 'Cancelada';
      default: return 'Pendente';
    }
  };
  
  const handleStatusChange = (appointmentId: string, newStatus: string) => {
    updateAppointmentStatus(appointmentId, newStatus);
  };
  
  const handleCancelAppointment = async (appointmentId: string, clientName: string, clientEmail?: string) => {
    if (cancelReason.trim()) {
      cancelAppointment(appointmentId, cancelReason);
      
      // Simular envio de email (em produção, seria uma chamada para API)
      if (emailNotificationsEnabled && clientEmail) {
        console.log(`📧 Email de cancelamento enviado para ${clientName} (${clientEmail})`);
        console.log(`Motivo: ${cancelReason}`);
        alert(`Marcação cancelada e email enviado para ${clientName} com o motivo: "${cancelReason}"`);
      } else {
        alert(`Marcação cancelada para ${clientName}`);
      }
      
      // Reset
      setCancelReason('');
      setAppointmentToCancel(null);
    } else {
      alert('Por favor, indique o motivo do cancelamento.');
    }
  };
  
  const handleMarkAsViewed = (appointmentId: string) => {
    markAppointmentAsViewed(appointmentId);
  };
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    refreshAppointments();
    setTimeout(() => setIsRefreshing(false), 1000);
  };
  
  return (
    <div className="min-h-screen bg-[#F7F7F8]">
      {/* Header */}
      <div className="bg-white border-b border-[#E5E7EB] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-geist-sans font-bold text-[#111827]">
                Painel Administrativo
              </h1>
              <p className="text-[#6B7280] font-inter mt-1">
                Gestão completa das marcações da barbearia
              </p>
            </div>
            <div className="flex items-center gap-4">
              {/* Sino de Notificações */}
              <div className="relative">
                <Bell className={`w-6 h-6 text-[#1E3A8A] ${unviewedCount > 0 ? 'animate-pulse' : ''}`} />
                {unviewedCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#1E3A8A] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-inter font-bold">
                    {unviewedCount}
                  </span>
                )}
              </div>
              
              {/* Botão Atualizar */}
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-inter"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                Atualizar
              </button>
              
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="flex items-center gap-2 px-4 py-2 bg-[#1E3A8A] text-white rounded-lg hover:bg-[#1E40AF] transition-colors font-inter"
              >
                <Settings className="w-4 h-4" />
                Configurações
              </button>
              <div className="text-right">
                <div className="text-sm text-[#6B7280] font-inter">Acesso Privado</div>
                <div className="text-lg font-geist-sans font-bold text-[#1E3A8A]">
                  www.agendamento24.pt/admin
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Configurações de Notificação */}
        {showSettings && (
          <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm mb-8">
            <div className="p-6 border-b border-[#E5E7EB]">
              <h3 className="text-lg font-geist-sans font-bold text-[#111827] flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Configurações de Notificação
              </h3>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between p-4 bg-[#F7F7F8] rounded-lg">
                <div className="flex items-center gap-3">
                  {emailNotificationsEnabled ? (
                    <Bell className="w-5 h-5 text-green-600" />
                  ) : (
                    <BellOff className="w-5 h-5 text-red-600" />
                  )}
                  <div>
                    <h4 className="font-geist-sans font-bold text-[#111827]">
                      Notificações Automáticas por Email
                    </h4>
                    <p className="text-sm text-[#6B7280] font-inter">
                      Enviar emails automáticos para clientes e dono da barbearia
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setEmailNotificationsEnabled(!emailNotificationsEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    emailNotificationsEnabled ? 'bg-[#1E3A8A]' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      emailNotificationsEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              
              {emailNotificationsEnabled && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h5 className="font-inter font-bold text-green-800 mb-2">
                    ✅ Notificações Ativadas
                  </h5>
                  <ul className="text-sm text-green-700 font-inter space-y-1">
                    <li>• Email de confirmação para clientes após marcação</li>
                    <li>• Lembrete automático 24h antes da marcação</li>
                    <li>• Notificação para o dono sobre novas marcações</li>
                    <li>• Email de cancelamento quando marcação é cancelada</li>
                  </ul>
                  <div className="mt-3 text-xs text-green-600 font-inter">
                    📧 Emails enviados de: 24agendamento24@gmail.com
                  </div>
                </div>
              )}
              
              {!emailNotificationsEnabled && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h5 className="font-inter font-bold text-red-800 mb-2">
                    ❌ Notificações Desativadas
                  </h5>
                  <p className="text-sm text-red-700 font-inter">
                    Os clientes não receberão emails automáticos sobre suas marcações.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Resumo Diário */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-[#E5E7EB] shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-5 h-5 text-[#1E3A8A]" />
              <span className="text-sm font-inter text-[#6B7280]">Hoje</span>
            </div>
            <div className="text-2xl font-geist-sans font-bold text-[#111827]">
              {todayAppointments.length}
            </div>
            <div className="text-sm text-[#6B7280] font-inter">marcações</div>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-[#E5E7EB] shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <Euro className="w-5 h-5 text-green-600" />
              <span className="text-sm font-inter text-[#6B7280]">Ganhos Hoje</span>
            </div>
            <div className="text-2xl font-geist-sans font-bold text-green-600">
              {todayEarnings}€
            </div>
            <div className="text-sm text-[#6B7280] font-inter">concluídas</div>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-[#E5E7EB] shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <Bell className="w-5 h-5 text-[#1E3A8A]" />
              <span className="text-sm font-inter text-[#6B7280]">Não Vistas</span>
            </div>
            <div className="text-2xl font-geist-sans font-bold text-[#1E3A8A]">
              {unviewedCount}
            </div>
            <div className="text-sm text-[#6B7280] font-inter">marcações</div>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-[#E5E7EB] shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-yellow-600" />
              <span className="text-sm font-inter text-[#6B7280]">Pendentes</span>
            </div>
            <div className="text-2xl font-geist-sans font-bold text-yellow-600">
              {appointments.filter(apt => apt.status === 'pending').length}
            </div>
            <div className="text-sm text-[#6B7280] font-inter">marcações</div>
          </div>
        </div>
        
        {/* Filtros Rápidos */}
        <div className="bg-white p-6 rounded-xl border border-[#E5E7EB] shadow-sm mb-8">
          <h3 className="text-lg font-geist-sans font-bold text-[#111827] mb-4">
            Filtros Rápidos
          </h3>
          <div className="flex flex-wrap gap-3 mb-4">
            {[
              { value: 'all', label: 'Todas', count: appointments.length },
              { value: 'unviewed', label: 'Não vistas', count: unviewedCount },
              { value: 'today', label: 'Hoje', count: todayAppointments.length },
              { value: 'week', label: 'Esta semana', count: appointments.filter(apt => {
                const now = new Date();
                const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                const aptDate = new Date(apt.date + 'T00:00:00');
                return aptDate >= weekStart;
              }).length },
              { value: 'cancelled', label: 'Canceladas', count: appointments.filter(apt => apt.status === 'cancelled').length }
            ].map(filterOption => (
              <button
                key={filterOption.value}
                onClick={() => setFilter(filterOption.value as any)}
                className={`px-4 py-2 rounded-lg font-inter font-medium transition-all ${
                  filter === filterOption.value
                    ? 'bg-[#1E3A8A] text-white'
                    : 'bg-[#F7F7F8] text-[#6B7280] hover:bg-[#E5E7EB]'
                }`}
              >
                {filterOption.label} ({filterOption.count})
              </button>
            ))}
          </div>
          
          {/* Filtros de Status */}
          <div className="flex flex-wrap gap-3">
            {[
              { value: 'all', label: 'Todos os Status', count: appointments.length },
              { value: 'pending', label: 'Pendentes', count: appointments.filter(apt => apt.status === 'pending').length },
              { value: 'confirmed', label: 'Confirmadas', count: appointments.filter(apt => apt.status === 'confirmed').length },
              { value: 'completed', label: 'Concluídas', count: appointments.filter(apt => apt.status === 'completed').length },
              { value: 'cancelled', label: 'Canceladas', count: appointments.filter(apt => apt.status === 'cancelled').length }
            ].map(statusFilter => (
              <button
                key={statusFilter.value}
                onClick={() => setSelectedStatus(statusFilter.value)}
                className={`px-3 py-1 rounded-lg font-inter text-sm transition-all ${
                  selectedStatus === statusFilter.value
                    ? 'bg-[#1E3A8A] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {statusFilter.label} ({statusFilter.count})
              </button>
            ))}
          </div>
        </div>
        
        {/* Lista de Marcações */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm">
          <div className="p-6 border-b border-[#E5E7EB]">
            <h3 className="text-lg font-geist-sans font-bold text-[#111827]">
              {filter === 'unviewed' ? 'Marcações Não Vistas' : 
               filter === 'today' ? 'Marcações de Hoje' :
               filter === 'week' ? 'Marcações da Semana' :
               filter === 'cancelled' ? 'Marcações Canceladas' :
               'Todas as Marcações'} ({filteredAppointments.length})
            </h3>
          </div>
          
          {filteredAppointments.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-[#6B7280] font-inter">
                {filter === 'unviewed' ? 'Nenhuma marcação não vista' :
                 filter === 'today' ? 'Nenhuma marcação para hoje' :
                 filter === 'week' ? 'Nenhuma marcação esta semana' :
                 filter === 'cancelled' ? 'Nenhuma marcação cancelada' :
                 selectedStatus === 'all' 
                  ? 'Nenhuma marcação encontrada'
                  : `Nenhuma marcação ${getStatusText(selectedStatus).toLowerCase()} encontrada`
                }
              </div>
            </div>
          ) : (
            <div className="divide-y divide-[#E5E7EB]">
              {filteredAppointments.map(appointment => (
                <div 
                  key={appointment.id} 
                  className={`p-6 transition-colors ${
                    !appointment.viewed ? 'bg-[#F7F7F8] border-l-4 border-l-[#1E3A8A]' : 'hover:bg-[#F7F7F8]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-6">
                    {/* Informações do Cliente */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <User className="w-5 h-5 text-[#6B7280]" />
                        <div className="flex items-center gap-2">
                          <h4 className="font-geist-sans font-bold text-[#111827] text-lg">
                            {appointment.clientName}
                          </h4>
                          {!appointment.viewed && (
                            <span className="px-2 py-1 bg-[#1E3A8A] text-white text-xs rounded-full font-inter font-bold">
                              Nova
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-[#6B7280] font-inter text-sm mb-4">
                        {appointment.clientPhone}
                        {appointment.clientEmail && (
                          <span className="ml-2 text-blue-600">
                            📧 {appointment.clientEmail}
                          </span>
                        )}
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <Scissors className="w-4 h-4 text-[#6B7280]" />
                          <span className="font-inter text-[#111827]">
                            {appointment.serviceName}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-[#6B7280]" />
                          <span className="font-inter text-[#111827]">
                            {appointment.barberName}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Euro className="w-4 h-4 text-green-600" />
                          <span className="font-inter font-bold text-green-600">
                            {appointment.servicePrice}€
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-[#6B7280] font-inter">
                        <span>{formatDisplayDate(appointment.date)}</span>
                        <span>•</span>
                        <span>{appointment.time}</span>
                      </div>
                    </div>
                    
                    {/* Status e Ações */}
                    <div className="flex flex-col items-end gap-3">
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(appointment.status)}`}>
                        {getStatusIcon(appointment.status)}
                        <span className="text-sm font-inter font-medium">
                          {getStatusText(appointment.status)}
                        </span>
                      </div>
                      
                      {/* Ações Rápidas */}
                      <div className="flex flex-col gap-2">
                        {!appointment.viewed && (
                          <button
                            onClick={() => handleMarkAsViewed(appointment.id)}
                            className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors font-inter"
                          >
                            <Eye className="w-3 h-3" />
                            Marcar como vista
                          </button>
                        )}
                        
                        <select
                          value={appointment.status}
                          onChange={(e) => handleStatusChange(appointment.id, e.target.value)}
                          className="px-3 py-1 text-sm border border-[#E5E7EB] rounded-lg font-inter focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent"
                        >
                          <option value="pending">Pendente</option>
                          <option value="confirmed">Confirmada</option>
                          <option value="completed">Concluída</option>
                          <option value="cancelled">Cancelada</option>
                        </select>
                        
                        {appointment.status !== 'cancelled' && (
                          <button
                            onClick={() => setAppointmentToCancel(appointment.id)}
                            className="flex items-center gap-2 px-3 py-1 text-sm bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 transition-colors font-inter"
                          >
                            <Mail className="w-3 h-3" />
                            Cancelar
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Modal de Cancelamento */}
                  {appointmentToCancel === appointment.id && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <h5 className="font-inter font-bold text-red-800 mb-2">
                        Cancelar marcação de {appointment.clientName}
                      </h5>
                      <textarea
                        value={cancelReason}
                        onChange={(e) => setCancelReason(e.target.value)}
                        placeholder="Motivo do cancelamento (será enviado por email ao cliente)..."
                        className="w-full p-3 border border-red-300 rounded-lg font-inter text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        rows={3}
                      />
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => handleCancelAppointment(appointment.id, appointment.clientName, appointment.clientEmail)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-inter text-sm"
                        >
                          Confirmar Cancelamento
                        </button>
                        <button
                          onClick={() => {
                            setAppointmentToCancel(null);
                            setCancelReason('');
                          }}
                          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-inter text-sm"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}