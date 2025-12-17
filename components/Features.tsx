import React, { useState, useEffect } from 'react';

// Dados dos 12 cards com GIFs reais
const gifCards = [
  {
    id: 0,
    title: 'Cartaz de Ergonomia',
    description: 'Material visual para conscientização ergonômica.',
    image: '/CartazErgonomia.gif',
  },
  {
    id: 1,
    title: 'Estatística de Acidentes',
    description: 'Planilha para controle estatístico de acidentes.',
    image: '/EstatisticaAcidente.gif',
  },
  {
    id: 2,
    title: 'Gestão de Espaços Confinados',
    description: 'Sistema completo para gestão de espaços confinados.',
    image: '/GestãoEspaçosConfinados.gif',
  },
  {
    id: 3,
    title: 'Gestão do PGR',
    description: 'Ferramenta para gestão do Programa de Gerenciamento de Riscos.',
    image: '/GestãoPGR.gif',
  },
  {
    id: 4,
    title: 'Gestão de Acidentes',
    description: 'Sistema de gestão e acompanhamento de acidentes.',
    image: '/GestãodeAcidentes.gif',
  },
  {
    id: 5,
    title: 'Inspeção de Segurança',
    description: 'Checklist completo para inspeções de segurança.',
    image: '/InspeçãodeSegurança.gif',
  },
  {
    id: 6,
    title: 'Investigação de Acidentes',
    description: 'Modelo para investigação e análise de acidentes.',
    image: '/InvestigaçãoAcidente.gif',
  },
  {
    id: 7,
    title: 'Kanban SST',
    description: 'Quadro Kanban para gestão de tarefas de SST.',
    image: '/Kanban.gif',
  },
  {
    id: 8,
    title: 'Liberação de Trabalho',
    description: 'Sistema de permissão e liberação de trabalhos.',
    image: '/LiberaçãodeTrabalho.gif',
  },
  {
    id: 9,
    title: 'PGR Completo',
    description: 'Programa de Gerenciamento de Riscos completo.',
    image: '/PGR.gif',
  },
  {
    id: 10,
    title: 'Processo Eleitoral CIPA',
    description: 'Gestão do processo eleitoral da CIPA.',
    image: '/ProcessoeleitoralCIPA.gif',
  },
  {
    id: 11,
    title: 'Treinamento de Empilhadeira',
    description: 'Material para treinamento de operadores de empilhadeira.',
    image: '/TreinamentoEmpilhadeira.gif',
  },
];

export const Features: React.FC = () => {
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  const words = ["Word", "Power Point", "Excel"];
  const colors = ["text-blue-700", "text-red-600", "text-green-700"]; // Cores específicas para cada ferramenta

  useEffect(() => {
    const handleTyping = () => {
      const i = loopNum % words.length;
      const fullText = words[i];

      setText(isDeleting
        ? fullText.substring(0, text.length - 1)
        : fullText.substring(0, text.length + 1)
      );

      setTypingSpeed(isDeleting ? 50 : 150);

      if (!isDeleting && text === fullText) {
        setTimeout(() => setIsDeleting(true), 1500); // Pausa quando termina de escrever
      } else if (isDeleting && text === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, typingSpeed, words]);

  // Determina a cor baseada na palavra atual
  const currentColor = colors[loopNum % words.length];

  return (
    <div id="recursos" className="relative py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Título Dinâmico */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight min-h-[3.5rem]">
            Diversos arquivos editáveis em <br className="md:hidden" />
            <span className={`${currentColor} transition-colors duration-300`}>
              {text}
            </span>
            <span className="animate-pulse text-gray-400">|</span>
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Tenha acesso a uma biblioteca completa para otimizar sua gestão de segurança.
          </p>
        </div>

        {/* Grid de 12 Cards (4 colunas em telas grandes) */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {gifCards.map((card) => (
            <div key={card.id} className="group relative rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer bg-white">

              {/* Área do GIF/Imagem */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Título abaixo da imagem */}
              <div className="p-3 bg-white">
                <h3 className="text-sm font-semibold text-gray-800 leading-tight text-center">
                  {card.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* Texto Descritivo */}
        <div className="mt-16 text-center max-w-4xl mx-auto">
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
            O <span className="font-bold text-gray-900">SST em CLOUD</span> é um diretório completo com milhares de arquivos de Saúde, Segurança do Trabalho e Meio Ambiente armazenado na <span className="font-bold text-brand-600">NUVEM</span>, podendo ser acessado de qualquer dispositivo com acesso a internet.
          </p>
        </div>

      </div>
    </div>
  );
};