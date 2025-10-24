'use client';

import { useApp } from '@/contexts/AppContext';

export default function HomePage() {
  const { setCurrentPage } = useApp();
  
  return (
    <div className="min-h-screen bg-[#F7F7F8] p-4">
      <div className="max-w-md mx-auto pt-8">
        {/* Boas-vindas */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-geist-sans font-bold text-[#111827] mb-2">
            Bem-vindo à
          </h1>
          <h2 className="text-2xl font-geist-sans font-bold text-[#1E3A8A] mb-4">
            Barbearia Torres Vedras
          </h2>
          <p className="text-[#6B7280] text-lg font-inter">
            Agende o seu horário de forma simples e rápida
          </p>
        </div>
        
        {/* Botão Principal */}
        <button
          onClick={() => setCurrentPage('services')}
          className="w-full bg-[#1E3A8A] text-white text-xl font-geist-sans font-bold py-6 px-8 rounded-xl hover:bg-[#1E40AF] transition-colors duration-200 mb-8"
        >
          Agendar Agora
        </button>
        
        {/* Botões Secundários */}
        <div className="space-y-4">
          <button
            onClick={() => setCurrentPage('about')}
            className="w-full bg-white text-[#111827] font-inter font-semibold py-4 px-6 rounded-xl border border-[#E5E7EB] hover:bg-[#F9FAFB] transition-colors duration-200"
          >
            Sobre Nós
          </button>
          
          <button
            onClick={() => setCurrentPage('admin')}
            className="w-full bg-white text-[#111827] font-inter font-semibold py-4 px-6 rounded-xl border border-[#E5E7EB] hover:bg-[#F9FAFB] transition-colors duration-200"
          >
            Painel do Dono
          </button>
        </div>
        
        {/* Informações de Contato */}
        <div className="mt-12 text-center text-[#6B7280] text-sm font-inter">
          <p>Horário de funcionamento:</p>
          <p className="font-semibold">Segunda a Sexta: 9h às 18h</p>
        </div>
      </div>
    </div>
  );
}