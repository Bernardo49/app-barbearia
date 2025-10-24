'use client';

import { useApp } from '@/contexts/AppContext';
import Header from '@/components/Header';
import HomePage from '@/components/HomePage';
import ServicesPage from '@/components/ServicesPage';
import BarbersPage from '@/components/BarbersPage';
import BookingPage from '@/components/BookingPage';
import SuccessPage from '@/components/SuccessPage';
import AdminPage from '@/components/AdminPage';
import AboutPage from '@/components/AboutPage';

export default function App() {
  const { currentPage } = useApp();
  
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'services':
        return <ServicesPage />;
      case 'barbers':
        return <BarbersPage />;
      case 'booking':
        return <BookingPage />;
      case 'success':
        return <SuccessPage />;
      case 'admin':
        return <AdminPage />;
      case 'about':
        return <AboutPage />;
      default:
        return <HomePage />;
    }
  };
  
  return (
    <div className="min-h-screen bg-[#F7F7F8] font-inter">
      <Header />
      <main>
        {renderCurrentPage()}
      </main>
    </div>
  );
}