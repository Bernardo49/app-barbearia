'use client';

import { useApp } from '@/contexts/AppContext';
import { BARBERS } from '@/lib/constants';

export default function BarbersPage() {
  const { setCurrentPage, setSelectedBarber, selectedBarber } = useApp();
  
  const handleBarberSelect = (barberId: string) => {
    setSelectedBarber(barberId);
    setCurrentPage('booking');
  };
  
  return (
    <div className="min-h-screen bg-[#F7F7F8] p-4">
      <div className="max-w-md mx-auto pt-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-geist-sans font-bold text-[#111827] mb-2">
            Escolha o seu Barbeiro
          </h2>
          <p className="text-[#6B7280] font-inter">
            Selecione o profissional de sua preferência
          </p>
        </div>
        
        <div className="space-y-4">
          {/* Opção "Sem preferência" */}
          <button
            onClick={() => handleBarberSelect('any')}
            className={`w-full bg-white p-6 rounded-xl border transition-all duration-200 hover:bg-[#F9FAFB] ${
              selectedBarber === 'any' 
                ? 'border-[#1E3A8A] border-2' 
                : 'border-[#E5E7EB] hover:border-[#D1D5DB]'
            }`}
          >
            <div className="text-left">
              <h3 className="text-xl font-geist-sans font-bold text-[#111827] mb-1">
                Sem preferência de barbeiro
              </h3>
              <p className="text-[#6B7280] font-inter">
                Qualquer barbeiro disponível
              </p>
            </div>
          </button>
          
          {/* Barbeiros específicos */}
          {BARBERS.map((barber) => (
            <button
              key={barber.id}
              onClick={() => handleBarberSelect(barber.id)}
              className={`w-full bg-white p-6 rounded-xl border transition-all duration-200 hover:bg-[#F9FAFB] ${
                selectedBarber === barber.id 
                  ? 'border-[#1E3A8A] border-2' 
                  : 'border-[#E5E7EB] hover:border-[#D1D5DB]'
              }`}
            >
              <div className="text-left">
                <h3 className="text-xl font-geist-sans font-bold text-[#111827] mb-1">
                  {barber.name}
                </h3>

              </div>
            </button>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-white rounded-xl border border-[#E5E7EB]">
          <p className="text-[#6B7280] text-sm text-center font-inter">
            Se não tiver preferência, escolha esta opção e será atendido por qualquer barbeiro disponível.
          </p>
        </div>
      </div>
    </div>
  );
}