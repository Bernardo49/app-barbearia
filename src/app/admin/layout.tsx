import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Painel Administrativo - Barbearia Torres Vedras",
  description: "Painel privado de gestão da Barbearia Torres Vedras",
  robots: "noindex, nofollow", // Impede indexação pelos motores de busca
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F7F7F8] font-inter">
      {children}
    </div>
  );
}