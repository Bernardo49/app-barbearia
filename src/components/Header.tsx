'use client';

import { useApp } from '@/contexts/AppContext';

export default function Header() {
  const { setCurrentPage, currentPage } = useApp();
  
  return (
    <header className="bg-white border-b border-[#E5E7EB] shadow-sm">
      <div className="max-w-md mx-auto px-4 py-4 relative">
        <div className="text-center">
          <button
            onClick={() => setCurrentPage('home')}
            className="text-[#1E3A8A] font-geist-sans font-bold text-xl"
          >
            Barbearia Torres Vedras
          </button>
        </div>
        
        {currentPage !== 'home' && (
          <button
            onClick={() => setCurrentPage('home')}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#6B7280] hover:text-[#1E3A8A] transition-colors duration-200"
          >
            Voltar
          </button>
        )}
      </div>
    </header>
  );
}