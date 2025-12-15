import React from 'react';
import { CheckCircle, FileCheck, ShoppingCart } from 'lucide-react';

interface HeroProps {
  onBuyClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onBuyClick }) => {
  return (
    <div className="relative bg-sky-400 pt-16 pb-32 lg:pt-24 lg:pb-56">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 flex flex-col items-center text-center">
        
        {/* Text Content - Centralizado */}
        <div className="max-w-4xl mx-auto mb-8">
          <h1 className="text-4xl tracking-tight font-extrabold sm:text-5xl md:text-6xl mb-6 drop-shadow-sm font-display">
            {/* Texto Branco e destaque em Azul Escuro, Fonte Nova */}
            <span className="block text-white">Gerencie suas atividades</span>
            <span className="block text-brand-900 mt-2">com inteligência</span>
          </h1>
          <p className="mt-4 text-lg text-white/90 sm:mt-6 sm:max-w-2xl sm:mx-auto md:text-xl font-medium">
            Tenha acesso ao pacote mais completo de Saúde e Segurança do Trabalho e impressione seu chefe ou seus clientes com conteúdos personalizados e completos!
          </p>
          
          <div className="mt-8 pt-6 border-t border-white/20 inline-block w-full">
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-bold tracking-wide uppercase">
              {/* Badges com texto e ícone VERDES */}
              <span className="flex items-center bg-white rounded-full px-5 py-2 shadow-lg text-green-600 hover:scale-105 transition-transform">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2"/> Acesso Imediato
              </span>
              <span className="flex items-center bg-white rounded-full px-5 py-2 shadow-lg text-green-600 hover:scale-105 transition-transform">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2"/> Conteúdo Editável
              </span>
              <span className="flex items-center bg-white rounded-full px-5 py-2 shadow-lg text-green-600 hover:scale-105 transition-transform">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2"/> Suporte Especializado
              </span>
            </div>
          </div>
        </div>

        {/* Container Central para Vídeo e Botão - Com margem inferior aumentada */}
        <div className="relative w-full flex flex-col items-center mt-6 mb-24">
          
          {/* Image/Mockup - Tamanho Reduzido (max-w-4xl) */}
          <div className="relative w-[85%] max-w-4xl z-10">
            <div className="rounded-2xl shadow-2xl bg-gray-900 overflow-hidden border-8 border-white/30 transform hover:scale-[1.01] transition-transform duration-300 animate-float relative z-10">
              <iframe 
                className="w-full aspect-video" 
                src="https://www.youtube.com/embed/e7GQsteoNIM?start=105&autoplay=1&mute=1" 
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowFullScreen
              ></iframe>
            </div>

            {/* Floating badge - Movido sutilmente para a esquerda (left-[33%]) */}
            <div className="absolute -bottom-8 left-[33%] transform -translate-x-1/2 bg-white p-4 rounded-xl shadow-2xl hidden md:block animate-bounce-slow z-20 min-w-[280px] border border-gray-100">
              <div className="flex items-center gap-4 justify-center">
                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <FileCheck className="h-6 w-6 text-green-600" />
                </div>
                <div className="text-left">
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Gerador de Certificados</p>
                  <p className="text-xl font-extrabold text-gray-900 leading-none">Modo Automático</p>
                </div>
              </div>
            </div>
          </div>

          {/* Botão Chamativo de Compra - Texto e Posição ajustados */}
          <button 
            onClick={onBuyClick}
            className="mt-24 relative group inline-flex items-center justify-center px-12 py-6 text-2xl font-black text-white transition-all duration-300 bg-gradient-to-r from-orange-500 to-red-600 rounded-full focus:outline-none focus:ring-4 focus:ring-offset-4 focus:ring-orange-400 hover:scale-110 shadow-[0_0_50px_-10px_rgba(255,69,0,0.6)] z-30"
          >
            {/* Animação de brilho de fundo */}
            <span className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity"></span>
            
            {/* Animação de Ping no fundo para chamar atenção constante */}
            <span className="absolute -inset-1 rounded-full bg-orange-400 opacity-30 animate-ping duration-1000"></span>

            <ShoppingCart className="w-8 h-8 mr-3 animate-bounce" strokeWidth={3} />
            Comprar agora
          </button>
        
        </div>

      </div>

      {/* Cloud Divider Bottom */}
      <div className="cloud-divider bottom-0">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="xMidYMin slice" className="fill-white">
          <path d="M0,120 L0,60 C80,60 100,20 180,20 C260,20 280,70 360,70 C440,70 460,30 540,30 C620,30 640,80 720,80 C800,80 820,40 900,40 C980,40 1000,90 1080,90 C1160,90 1180,50 1200,50 L1200,120 Z" />
        </svg>
      </div>
    </div>
  );
};