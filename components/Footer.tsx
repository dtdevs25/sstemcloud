import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white pt-10 pb-8 relative overflow-hidden">

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-center gap-12 mb-10">

          {/* Badge Moderno e Clean */}
          {/* Badge Imagem */}
          <div className="flex-shrink-0 mr-4">
            <img
              src="https://algodaocru.com.br/wp-content/uploads/2017/10/selo-de-garantia-7-dias-1.png"
              alt="Garantia de 7 Dias"
              className="w-32 h-auto object-contain hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Texto de Garantia */}
          <div className="text-center md:text-left max-w-lg">
            <h2 className="text-3xl md:text-4xl font-black text-black uppercase tracking-tight mb-3">
              Satisfação Garantida
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed font-medium">
              Se o material não atender suas expectativas, você pode solicitar o cancelamento dentro dos primeiros <span className="text-yellow-600 font-bold">7 dias</span> e devolveremos todo o valor investido.
            </p>
          </div>

        </div>

        {/* Copyright */}
        <div className="border-t border-gray-100 pt-6 text-center">
          <p className="text-gray-900 font-medium text-sm">
            &copy; SST EM CLOUD {new Date().getFullYear()} | Todos os direitos reservados.
          </p>
          <div className="flex justify-center space-x-6 mt-4 opacity-70">
            <a href="https://www.youtube.com/@PapodeSST" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-red-600 transition-colors">Youtube</a>
            <a href="https://www.instagram.com/sstemcloud/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-pink-600 transition-colors">Instagram</a>
            <a href="https://www.linkedin.com/company/sst-em-cloud" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-700 transition-colors">Linkedin</a>
            <a href="https://www.facebook.com/SSTemCLOUD/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600 transition-colors">Facebook</a>
          </div>
        </div>
      </div>
    </footer>
  );
};