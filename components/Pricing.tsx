import React, { useState, useEffect, useRef } from 'react';
import { Button } from './Button';
import { Check, Clock, ShoppingCart } from 'lucide-react';

interface PricingProps {
  onBuyClick: () => void;
}

export const Pricing: React.FC<PricingProps> = ({ onBuyClick }) => {
  // Timer de 10 minutos (600 segundos)
  const [timeLeft, setTimeLeft] = useState(600);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); 
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div id="pricing" className="relative bg-brand-50 py-32 md:py-48">
      
      {/* Cloud Divider Top */}
      <div className="cloud-divider top-0">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="xMidYMax slice" className="fill-white">
           <path d="M0,0 L0,60 C80,60 100,20 180,20 C260,20 280,70 360,70 C440,70 460,30 540,30 C620,30 640,80 720,80 C800,80 820,40 900,40 C980,40 1000,90 1080,90 C1160,90 1180,50 1200,50 L1200,0 Z" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center">
        
        {/* Card Único Promocional - Reduzido max-w-lg (aprox 20% menor que 2xl) */}
        <div ref={sectionRef} className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-transform duration-300 border-4 border-white ring-4 ring-brand-100">
            
            {/* Faixa de Urgência */}
            <div className="bg-yellow-400 py-3 flex items-center justify-center gap-2 animate-pulse">
              <Clock className="w-5 h-5 text-red-700" />
              <p className="text-red-800 font-bold text-sm md:text-base uppercase tracking-wider">
                Oferta Especial encerra em: <span className="text-red-900 font-black font-mono text-lg ml-1">{formatTime(timeLeft)}</span>
              </p>
            </div>

            <div className="p-6 md:p-8 text-center">
              
              <h2 className="text-3xl md:text-4xl font-black text-red-600 uppercase tracking-tighter drop-shadow-sm mb-6">
                PREÇO PROMOCIONAL
              </h2>
              
              <div className="space-y-1 mb-8">
                <p className="text-gray-600 font-bold uppercase text-xs md:text-sm tracking-wide">
                  CONTEÚDO COMPLETO
                </p>
                <p className="text-gray-600 font-bold uppercase text-xs md:text-sm tracking-wide">
                  100% REVISADO E ATUALIZADO
                </p>
                <p className="text-gray-600 font-bold uppercase text-xs md:text-sm tracking-wide">
                  COM TODAS AS NRs VIGENTES
                </p>
              </div>

              <div className="flex flex-col items-center justify-center space-y-4">
                
                {/* Preço Antigo com Risco Animado (SVG) */}
                <div className="relative inline-block">
                  <span className="text-2xl md:text-3xl font-bold text-gray-400 relative z-0">de R$497</span>
                  
                  {/* SVG Hand Drawn X em Loop Sequencial */}
                  <svg 
                    className={`absolute top-0 left-0 w-full h-full pointer-events-none overflow-visible draw-x ${isVisible ? 'animate-draw-x-loop' : ''}`} 
                    viewBox="0 0 100 50" 
                    preserveAspectRatio="none"
                  >
                    <path d="M0,50 L100,0" stroke="#dc2626" strokeWidth="8" fill="none" strokeLinecap="round" />
                    <path d="M0,0 L100,50" stroke="#dc2626" strokeWidth="8" fill="none" strokeLinecap="round" />
                  </svg>
                </div>

                <p className="text-lg text-gray-500 font-medium">por apenas</p>

                {/* Preço Novo com Círculo Animado em Loop Sequencial */}
                <div className="relative py-4 px-8">
                  {/* SVG Hand Drawn Circle */}
                  <svg 
                    className={`absolute inset-0 w-full h-full pointer-events-none overflow-visible draw-circle scale-110 md:scale-125 ${isVisible ? 'animate-draw-loop' : ''}`} 
                    viewBox="0 0 200 80" 
                    preserveAspectRatio="none"
                  >
                    <path d="M15,40 C15,10 185,10 185,40 C185,70 15,70 15,40" stroke="#4ade80" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>

                  <span className="relative text-4xl md:text-6xl font-extrabold text-gray-900 z-10">
                    12x R$16,67
                  </span>
                </div>

                <p className="text-xl md:text-2xl font-bold text-gray-800 mt-2">
                  ou R$167,00 à vista!
                </p>

              </div>

              <div className="mt-10">
                <Button 
                  fullWidth
                  onClick={onBuyClick}
                  className="rounded-xl py-5 text-lg md:text-xl font-black shadow-xl shadow-green-500/30 hover:shadow-green-500/50 hover:-translate-y-1 transform transition-all duration-300 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white flex items-center justify-center gap-3 animate-pulse ring-4 ring-green-100"
                >
                  <ShoppingCart size={24} strokeWidth={3} />
                  Comprar agora
                </Button>
                <p className="mt-4 text-xs md:text-sm font-medium text-gray-400 flex justify-center items-center gap-2">
                  <Check size={14} className="text-green-500" /> Compra 100% Segura e Acesso Imediato
                </p>
              </div>

            </div>
        </div>

      </div>
      
      {/* Cloud Divider Bottom */}
      <div className="cloud-divider bottom-0">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="xMidYMin slice" className="fill-white">
           <path d="M0,120 L0,60 C80,60 100,20 180,20 C260,20 280,70 360,70 C440,70 460,30 540,30 C620,30 640,80 720,80 C800,80 820,40 900,40 C980,40 1000,90 1080,90 C1160,90 1180,50 1200,120 Z" />
        </svg>
      </div>
    </div>
  );
};