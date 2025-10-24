'use client';

import { useApp } from '@/contexts/AppContext';

export default function AboutPage() {
  const { setCurrentPage } = useApp();
  
  return (
    <div className="min-h-screen bg-[#F7F7F8] p-4">
      <div className="max-w-md mx-auto pt-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-geist-sans font-bold text-[#111827] mb-2">
            Sobre Nós
          </h2>
          <p className="text-[#6B7280] font-inter">
            Conheça a nossa barbearia
          </p>
        </div>
        
        <div className="space-y-6">
          {/* Descrição principal */}
          <div className="bg-white p-6 rounded-xl border border-[#E5E7EB]">
            <h3 className="text-lg font-geist-sans font-bold text-[#111827] mb-3">
              Barbearia Torres Vedras
            </h3>
            <p className="text-[#6B7280] font-inter leading-relaxed">
              Somos especializados em cortes e atendimentos de qualidade. Marque o seu horário online de forma simples e rápida.
            </p>
          </div>
          
          {/* Nossos serviços */}
          <div className="bg-white p-6 rounded-xl border border-[#E5E7EB]">
            <h3 className="text-lg font-geist-sans font-bold text-[#111827] mb-4">
              Os Nossos Diferenciais
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="bg-[#1E3A8A] text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm font-bold">✓</span>
                </div>
                <p className="text-[#6B7280] font-inter">
                  Profissionais experientes e qualificados
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-[#1E3A8A] text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm font-bold">✓</span>
                </div>
                <p className="text-[#6B7280] font-inter">
                  Equipamentos modernos e esterilizados
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-[#1E3A8A] text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm font-bold">✓</span>
                </div>
                <p className="text-[#6B7280] font-inter">
                  Ambiente limpo e acolhedor
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-[#1E3A8A] text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm font-bold">✓</span>
                </div>
                <p className="text-[#6B7280] font-inter">
                  Agendamento online prático e rápido
                </p>
              </div>
            </div>
          </div>
          
          {/* Informações de contato */}
          <div className="bg-white p-6 rounded-xl border border-[#E5E7EB]">
            <h3 className="text-lg font-geist-sans font-bold text-[#111827] mb-4">
              Informações
            </h3>
            <div className="space-y-4">
              <div>
                <p className="font-geist-sans font-bold text-[#111827]">Localização</p>
                <p className="text-[#6B7280] font-inter text-sm">Torres Vedras, Portugal</p>
              </div>
              
              <div>
                <p className="font-geist-sans font-bold text-[#111827]">Horário de Funcionamento</p>
                <p className="text-[#6B7280] font-inter text-sm">Segunda a Sexta: 9h às 18h</p>
                <p className="text-[#6B7280] font-inter text-sm">Fins de semana: Fechado</p>
              </div>
              
              <div>
                <p className="font-geist-sans font-bold text-[#111827]">Contato</p>
                <p className="text-[#6B7280] font-inter text-sm">Para reagendamentos e dúvidas</p>
              </div>
            </div>
          </div>
          
          {/* Botão para agendar */}
          <button
            onClick={() => setCurrentPage('services')}
            className="w-full bg-[#1E3A8A] text-white text-lg font-geist-sans font-bold py-4 px-6 rounded-xl hover:bg-[#1E40AF] transition-colors duration-200"
          >
            Agendar Agora
          </button>
        </div>
      </div>
    </div>
  );
}