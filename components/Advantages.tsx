import React from 'react';
import { Smartphone, Settings, Headset, ThumbsUp } from 'lucide-react';

const advantages = [
  {
    title: '100% DIGITAL',
    description: 'Acesse todo o material de qualquer lugar, seja pelo celular, tablet ou computador, sem necessidade de instalações complexas.',
    icon: <Smartphone size={64} className="text-white drop-shadow-sm" />,
  },
  {
    title: 'CUSTOMIZÁVEL',
    description: 'Arquivos 100% editáveis. Insira sua logomarca, altere textos e adapte todo o conteúdo para a realidade do seu cliente.',
    icon: <Settings size={64} className="text-white drop-shadow-sm" />,
  },
  {
    title: 'SUPORTE',
    description: 'Conte com uma equipe especializada pronta para tirar suas dúvidas e auxiliar no uso das planilhas e documentos.',
    icon: <Headset size={64} className="text-white drop-shadow-sm" />,
  },
  {
    title: 'CONTEÚDO',
    description: 'Material completo, constantemente atualizado com as normas vigentes e aprovado por profissionais da área.',
    icon: <ThumbsUp size={64} className="text-white drop-shadow-sm" />,
  }
];

export const Advantages: React.FC = () => {
  return (
    <div className="py-20 bg-sky-400 relative z-20 border-t border-brand-400">
      {/* Decoração de fundo sutil */}
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white uppercase tracking-tight drop-shadow-md">
            Veja abaixo algumas vantagens
          </h2>
          <div className="w-24 h-1.5 bg-white/30 mx-auto mt-6 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {advantages.map((item, index) => (
            <div key={index} className="group h-80 [perspective:1000px] cursor-pointer">
              <div className="relative w-full h-full duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] rounded-[2rem] shadow-2xl">
                
                {/* Frente do Card */}
                <div className="absolute inset-0 w-full h-full bg-white rounded-[2rem] [backface-visibility:hidden] flex flex-col items-center justify-center p-6 border-4 border-white/50 shadow-lg">
                  {/* Ícone Branco com Fundo Azul */}
                  <div className="mb-6 relative transform transition-transform group-hover:scale-110 duration-300 bg-sky-500 p-4 rounded-full shadow-md">
                     {item.icon}
                  </div>
                  <h3 className="text-2xl font-black text-gray-800 uppercase tracking-wide text-center">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs text-gray-400 font-bold uppercase tracking-wider">Passe o mouse</p>
                </div>

                {/* Verso do Card (Gradiente Melhorado) */}
                <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-brand-700 via-brand-600 to-brand-800 rounded-[2rem] [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col items-center justify-center p-8 border-4 border-brand-500 text-center shadow-inner">
                  <h3 className="text-xl font-bold text-white mb-4 uppercase drop-shadow-md">{item.title}</h3>
                  <p className="text-blue-50 font-medium leading-relaxed text-sm md:text-base">
                    {item.description}
                  </p>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};