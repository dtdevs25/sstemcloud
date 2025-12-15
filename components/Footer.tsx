import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white pt-10 pb-8 relative overflow-hidden">
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-center gap-12 mb-10">
          
          {/* Badge Moderno e Clean */}
          <div className="flex-shrink-0 mr-4">
             <div className="relative group">
                <div className="absolute inset-0 bg-yellow-400 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <div className="relative bg-gradient-to-br from-yellow-400 to-yellow-600 w-32 h-32 rounded-3xl rotate-3 shadow-xl flex items-center justify-center transform group-hover:-rotate-3 transition-all duration-500">
                    <div className="absolute inset-1 bg-white rounded-2xl flex flex-col items-center justify-center border border-gray-100">
                        <ShieldCheck className="w-10 h-10 text-yellow-500 mb-1" />
                        <span className="text-4xl font-black text-gray-900 leading-none">7</span>
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Dias</span>
                    </div>
                </div>
                {/* Etiqueta Flutuante */}
                <div className="absolute -bottom-3 -right-3 bg-gray-900 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    100% GARANTIDO
                </div>
             </div>
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
        </div>
      </div>
    </footer>
  );
};