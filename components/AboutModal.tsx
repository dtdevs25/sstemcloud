import React from 'react';
import { X, Youtube, Instagram, Linkedin, Facebook } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col md:flex-row">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors z-10"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Left Column: Photo & Socials */}
        <div className="bg-brand-50 md:w-1/3 p-8 flex flex-col items-center justify-center border-r border-gray-100">
          <div className="w-48 h-48 rounded-full border-4 border-white shadow-lg overflow-hidden mb-6 bg-gray-200">
            {/* Foto do Daniel */}
            <img
              src="/profile.jpg"
              alt="Daniel Santos"
              className="w-full h-full object-cover object-top"
            />
          </div>

          <h3 className="text-xl font-bold text-gray-900 text-center mb-1">Daniel Santos</h3>
          <p className="text-sm text-brand-700 font-medium mb-6">Engenheiro de Segurança</p>

          <div className="flex space-x-4">
            <a href="https://www.youtube.com/@PapodeSST" target="_blank" rel="noopener noreferrer" className="p-2 bg-white rounded-full text-red-600 hover:scale-110 transition-transform shadow-sm hover:shadow-md"><Youtube size={20} /></a>
            <a href="https://www.instagram.com/sstemcloud/" target="_blank" rel="noopener noreferrer" className="p-2 bg-white rounded-full text-pink-600 hover:scale-110 transition-transform shadow-sm hover:shadow-md"><Instagram size={20} /></a>
            <a href="https://www.linkedin.com/company/sst-em-cloud" target="_blank" rel="noopener noreferrer" className="p-2 bg-white rounded-full text-blue-700 hover:scale-110 transition-transform shadow-sm hover:shadow-md"><Linkedin size={20} /></a>
            <a href="https://www.facebook.com/SSTemCLOUD/" target="_blank" rel="noopener noreferrer" className="p-2 bg-white rounded-full text-blue-600 hover:scale-110 transition-transform shadow-sm hover:shadow-md"><Facebook size={20} /></a>
          </div>
        </div>

        {/* Right Column: Text Content */}
        <div className="md:w-2/3 p-8 md:p-12 overflow-y-auto max-h-[80vh] md:max-h-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Sobre o Drive SST em Cloud</h2>
          <div className="space-y-4 text-gray-600 leading-relaxed text-justify">
            <p>
              Olá, sou o <strong>Daniel Santos!</strong>
            </p>
            <p>
              Com trajetória sólida no setor industrial, acumulei vivência em empresas de diversos ramos, como graxa, óleo, embalagens plásticas, logística e eletrônicos.
            </p>
            <p>
              Minha busca por conhecimento me levou à graduação em Engenharia Ambiental e pós-graduação em Engenharia de Segurança do Trabalho. Essa jornada me consolidou como um profissional completo e dedicado na área de SST.
            </p>
            <p>
              Motivado pela necessidade de ter acesso rápido e organizado a materiais referenciais nas empresas onde atuava, criei o drive <strong>SST em Cloud</strong>. Essa ferramenta, além de ter otimizando meu trabalho, se tornou um sucesso, me inspirando a compartilhá-la com a comunidade SST.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};