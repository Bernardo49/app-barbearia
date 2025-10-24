'use client';

import { useApp } from '@/contexts/AppContext';
import { AVAILABLE_TIMES, formatDate, isWeekend, BARBERS } from '@/lib/constants';
import { useState } from 'react';

export default function BookingPage() {
  const {
    selectedDate,
    selectedTime,
    clientName,
    clientPhone,
    selectedBarber,
    setSelectedDate,
    setSelectedTime,
    setClientName,
    setClientPhone,
    setCurrentPage,
    addAppointment,
    selectedService,
    isTimeAvailable,
    resetBooking
  } = useApp();
  
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // Gerar dias do mês
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const isCurrentMonth = date.getMonth() === month;
      const isPast = date < today;
      const isWeekendDay = isWeekend(date);
      const dateString = formatDate(date);
      
      days.push({
        date,
        dateString,
        day: date.getDate(),
        isCurrentMonth,
        isPast,
        isWeekend: isWeekendDay,
        isSelected: selectedDate === dateString,
        isAvailable: isCurrentMonth && !isPast && !isWeekendDay
      });
    }
    
    return days;
  };
  
  const handleDateSelect = (dateString: string, isAvailable: boolean) => {
    if (!isAvailable) return;
    setSelectedDate(dateString);
    setSelectedTime(null);
  };
  
  const handleTimeSelect = (time: string) => {
    if (!selectedBarber || !selectedDate) return;
    
    // Se for "any", verificar se pelo menos um barbeiro está disponível
    if (selectedBarber === 'any') {
      const hasAvailableBarber = BARBERS.some(barber => 
        isTimeAvailable(selectedDate, time, barber.id)
      );
      if (!hasAvailableBarber) return;
    } else {
      if (!isTimeAvailable(selectedDate, time, selectedBarber)) return;
    }
    
    setSelectedTime(time);
  };
  
  const handleSubmit = () => {
    if (!selectedService || !selectedBarber || !selectedDate || !selectedTime || !clientName || !clientPhone) {
      alert('Por favor, preencha todos os campos');
      return;
    }
    
    // Se for "any", escolher um barbeiro disponível aleatoriamente
    let finalBarberId = selectedBarber;
    if (selectedBarber === 'any') {
      const availableBarbers = BARBERS.filter(barber => 
        isTimeAvailable(selectedDate, selectedTime, barber.id)
      );
      if (availableBarbers.length > 0) {
        finalBarberId = availableBarbers[Math.floor(Math.random() * availableBarbers.length)].id;
      }
    }
    
    addAppointment({
      clientName,
      clientPhone,
      serviceId: selectedService,
      barberId: finalBarberId,
      date: selectedDate,
      time: selectedTime
    });
    
    resetBooking();
    setCurrentPage('success');
  };
  
  const getAvailableTimesForDate = () => {
    if (!selectedDate || !selectedBarber) return [];
    
    if (selectedBarber === 'any') {
      // Para "any", mostrar horários onde pelo menos um barbeiro está disponível
      return AVAILABLE_TIMES.filter(time => 
        BARBERS.some(barber => isTimeAvailable(selectedDate, time, barber.id))
      );
    }
    
    return AVAILABLE_TIMES.filter(time => 
      isTimeAvailable(selectedDate, time, selectedBarber)
    );
  };
  
  const getBarberDisplayName = () => {
    if (selectedBarber === 'any') {
      return 'Sem preferência de barbeiro';
    }
    const barber = BARBERS.find(b => b.id === selectedBarber);
    return barber ? barber.name : 'Barbeiro';
  };
  
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  
  return (
    <div className="min-h-screen bg-[#F7F7F8] p-4">
      <div className="max-w-md mx-auto pt-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-geist-sans font-bold text-[#111827] mb-2">
            Agendamento
          </h2>
          <p className="text-[#6B7280] font-inter">
            Escolha a data e horário
          </p>
        </div>
        
        {/* Informações da seleção */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 mb-6">
          <div className="text-center">
            <span className="text-[#111827] font-inter font-medium">
              {getBarberDisplayName()}
            </span>
            {selectedBarber === 'any' && (
              <p className="text-sm text-[#6B7280] font-inter mt-1">
                Será atendido por qualquer barbeiro disponível
              </p>
            )}
          </div>
        </div>
        
        {/* Calendário */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 mb-6">
          {/* Header do calendário */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
              className="p-2 hover:bg-[#F9FAFB] rounded-lg transition-colors"
            >
              ←
            </button>
            <h3 className="text-lg font-geist-sans font-bold text-[#111827]">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h3>
            <button
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
              className="p-2 hover:bg-[#F9FAFB] rounded-lg transition-colors"
            >
              →
            </button>
          </div>
          
          {/* Dias da semana */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map(day => (
              <div key={day} className="text-center text-xs font-inter font-semibold text-[#6B7280] py-2">
                {day}
              </div>
            ))}
          </div>
          
          {/* Dias do mês */}
          <div className="grid grid-cols-7 gap-1">
            {generateCalendarDays().map((day, index) => (
              <button
                key={index}
                onClick={() => handleDateSelect(day.dateString, day.isAvailable)}
                disabled={!day.isAvailable}
                className={`
                  aspect-square flex items-center justify-center text-sm rounded-lg transition-all font-inter
                  ${day.isSelected 
                    ? 'bg-[#1E3A8A] text-white font-bold' 
                    : day.isAvailable
                    ? 'hover:bg-[#F9FAFB] text-[#111827] font-medium'
                    : 'text-[#6B7280] cursor-not-allowed'
                  }
                  ${!day.isCurrentMonth ? 'opacity-30' : ''}
                `}
              >
                {day.day}
              </button>
            ))}
          </div>
        </div>
        
        {/* Horários disponíveis */}
        {selectedDate && (
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 mb-6">
            <h3 className="text-lg font-geist-sans font-bold text-[#111827] mb-4">
              Horários Disponíveis
            </h3>
            
            <div className="grid grid-cols-3 gap-2">
              {getAvailableTimesForDate().map(time => (
                <button
                  key={time}
                  onClick={() => handleTimeSelect(time)}
                  className={`
                    py-3 px-2 rounded-lg text-sm font-inter font-medium transition-all
                    ${selectedTime === time
                      ? 'bg-[#1E3A8A] text-white'
                      : 'bg-[#F9FAFB] text-[#111827] hover:bg-[#E5E7EB] border border-[#E5E7EB]'
                    }
                  `}
                >
                  {time}
                </button>
              ))}
            </div>
            
            {getAvailableTimesForDate().length === 0 && (
              <p className="text-[#6B7280] font-inter text-center py-4">
                Não há horários disponíveis para esta data
              </p>
            )}
          </div>
        )}
        
        {/* Formulário de dados do cliente */}
        {selectedTime && (
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 mb-6">
            <h3 className="text-lg font-geist-sans font-bold text-[#111827] mb-4">
              Os Seus Dados
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-inter font-medium text-[#111827] mb-2">
                  Nome
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Digite o seu nome"
                  className="w-full p-3 border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#1E3A8A] focus:border-[#1E3A8A] outline-none font-inter"
                />
              </div>
              
              <div>
                <label className="block text-sm font-inter font-medium text-[#111827] mb-2">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Digite o seu email"
                  className="w-full p-3 border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#1E3A8A] focus:border-[#1E3A8A] outline-none font-inter"
                />
              </div>
              
              <div>
                <label className="block text-sm font-inter font-medium text-[#111827] mb-2">
                  Telemóvel
                </label>
                <input
                  type="tel"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="Digite o seu telemóvel"
                  className="w-full p-3 border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#1E3A8A] focus:border-[#1E3A8A] outline-none font-inter"
                />
              </div>
            </div>
          </div>
        )}
        
        {/* Botão de confirmação */}
        {selectedTime && clientName && clientPhone && (
          <button
            onClick={handleSubmit}
            className="w-full bg-[#1E3A8A] text-white text-lg font-geist-sans font-bold py-4 px-6 rounded-xl hover:bg-[#1E40AF] transition-colors duration-200"
          >
            Confirmar Marcação
          </button>
        )}
      </div>
    </div>
  );
}