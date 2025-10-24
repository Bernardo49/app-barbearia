'use client';

import { useApp } from '@/contexts/AppContext';

export default function SuccessPage() {
  const { setCurrentPage, resetBooking } = useApp();
  
  const handleGoHome = () => {
    resetBooking();
    setCurrentPage('home');
  };
  
  const handleNewBooking = () => {
    resetBooking();
    setCurrentPage('services');
  };
  
  return (
    <div className="min-h-screen bg-[#F7F7F8] p-4">
      <div className="max-w-md mx-auto pt-16">
        <div className="text-center">
          {/* Mensagem de sucesso */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-8 mb-8">
            <h1 className="text-3xl font-geist-sans font-bold text-[#111827] mb-4">
              ✅ Marcação confirmada. Até já!
            </h1>
            
            <p className="text-lg text-[#6B7280] font-inter mb-6">
              A sua marcação foi feita com sucesso!
            </p>
            
            <div className="bg-[#F7F7F8] p-4 rounded-lg">
              <h3 className="text-lg font-geist-sans font-bold text-[#111827] mb-3">
                O que acontece agora?
              </h3>
              <div className="space-y-3 text-left">
                <div className="flex items-start gap-3">
                  <div className="bg-[#1E3A8A] text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-sm font-bold">1</span>
                  </div>
                  <p className="text-[#6B7280] font-inter">
                    Recebemos a sua marcação e ela está confirmada
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-[#1E3A8A] text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-sm font-bold">2</span>
                  </div>
                  <p className="text-[#6B7280] font-inter">
                    Compareça no horário marcado na barbearia
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-[#1E3A8A] text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-sm font-bold">3</span>
                  </div>
                  <p className="text-[#6B7280] font-inter">
                    Em caso de imprevisto, ligue para reagendar
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Botões de ação */}
          <div className="space-y-4">
            <button
              onClick={handleGoHome}
              className="w-full bg-[#1E3A8A] text-white font-geist-sans font-bold py-4 px-6 rounded-xl hover:bg-[#1E40AF] transition-colors duration-200"
            >
              Voltar ao Início
            </button>
            
            <button
              onClick={handleNewBooking}
              className="w-full bg-white text-[#111827] font-inter font-semibold py-4 px-6 rounded-xl border border-[#E5E7EB] hover:bg-[#F9FAFB] transition-colors duration-200"
            >
              Fazer Nova Marcação
            </button>
          </div>
          
          {/* Informações de contato */}
          <div className="mt-8 p-4 bg-white rounded-xl border border-[#E5E7EB]">
            <p className="text-[#6B7280] text-sm font-inter">
              Para reagendamentos ou dúvidas, entre em contato conosco
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}