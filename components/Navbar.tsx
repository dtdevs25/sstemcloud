import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { AboutModal } from './AboutModal';

interface NavbarProps {
  onLoginClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onLoginClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsModalOpen(true);
    setIsOpen(false);
  };

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  return (
    <>
      <nav className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40 transition-all duration-300 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">

            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                {/* Logo Image */}
                <img
                  src="/logo.png"
                  alt="Logo SSTemCloud"
                  className="h-16 w-auto mr-3 object-contain transition-transform duration-300 group-hover:scale-105"
                />
                <span className="font-extrabold text-2xl text-gray-900 tracking-tight group-hover:text-brand-700 transition-colors">
                  SSTem<span className="text-brand-500">Cloud</span>
                </span>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <button onClick={openModal} className="text-gray-600 hover:text-brand-600 font-medium transition-colors focus:outline-none hover:bg-gray-50 px-3 py-2 rounded-lg">
                O Drive
              </button>

              <a
                href="#pricing"
                onClick={(e) => handleScroll(e, 'pricing')}
                className="text-gray-600 hover:text-brand-600 font-medium transition-colors hover:bg-gray-50 px-3 py-2 rounded-lg"
              >
                Comprar
              </a>

              <a
                href="#depoimentos"
                onClick={(e) => handleScroll(e, 'depoimentos')}
                className="text-gray-600 hover:text-brand-600 font-medium transition-colors hover:bg-gray-50 px-3 py-2 rounded-lg"
              >
                Depoimentos
              </a>

              <a
                href="#faq"
                onClick={(e) => handleScroll(e, 'faq')}
                className="text-gray-600 hover:text-brand-600 font-medium transition-colors hover:bg-gray-50 px-3 py-2 rounded-lg"
              >
                FAQ
              </a>

              {/* Botão Área do Cliente - Estilo Idêntico ao 'Ver Planos' do Login */}
              <button
                onClick={onLoginClick}
                className="inline-flex items-center justify-center px-6 py-2 border-2 border-sky-100 rounded-full text-sky-600 font-bold hover:bg-sky-50 hover:border-sky-200 transition-colors text-sm uppercase tracking-wide"
              >
                Área do Cliente
              </button>
            </div>

            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-500"
              >
                <span className="sr-only">Abrir menu</span>
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-white border-b border-gray-100 shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <button onClick={openModal} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-brand-600 hover:bg-gray-50">O Drive</button>

              <a
                href="#pricing"
                onClick={(e) => handleScroll(e, 'pricing')}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-brand-600 hover:bg-gray-50"
              >
                Comprar
              </a>

              <a
                href="#depoimentos"
                onClick={(e) => handleScroll(e, 'depoimentos')}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-brand-600 hover:bg-gray-50"
              >
                Depoimentos
              </a>

              <a
                href="#faq"
                onClick={(e) => handleScroll(e, 'faq')}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-brand-600 hover:bg-gray-50"
              >
                FAQ
              </a>

              <button
                onClick={() => {
                  setIsOpen(false);
                  onLoginClick();
                }}
                className="w-full mt-4 flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-brand-600 hover:bg-brand-700 shadow-sm"
              >
                Área do Cliente
              </button>
            </div>
          </div>
        )}
      </nav>

      <AboutModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};