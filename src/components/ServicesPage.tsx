'use client';

import { useApp } from '@/contexts/AppContext';
import { SERVICES } from '@/lib/constants';

export default function ServicesPage() {
  const { setCurrentPage, setSelectedService, selectedService } = useApp();
  
  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
    setCurrentPage('barbers');
  };
  
  return (
    <div className="min-h-screen bg-[#F7F7F8] p-4">
      <div className="max-w-md mx-auto pt-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-geist-sans font-bold text-[#111827] mb-2">
            Escolha o seu Serviço
          </h2>
          <p className="text-[#6B7280] font-inter">
            Selecione o serviço desejado
          </p>
        </div>
        
        <div className="space-y-4">
          {SERVICES.map((service) => (
            <button
              key={service.id}
              onClick={() => handleServiceSelect(service.id)}
              className={`w-full bg-white p-6 rounded-xl border transition-all duration-200 hover:bg-[#F9FAFB] ${
                selectedService === service.id 
                  ? 'border-[#1E3A8A] border-2' 
                  : 'border-[#E5E7EB] hover:border-[#D1D5DB]'
              }`}
            >
              <div className="text-left">
                <h3 className="text-xl font-geist-sans font-bold text-[#111827] mb-2">
                  {service.name}
                </h3>
                <div className="flex items-center gap-4 text-[#6B7280] font-inter">
                  <span className="font-semibold">{service.price}€</span>
                  <span>{service.duration} min</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}