import React, { useState, useEffect } from 'react';

// Dados simulados para os 12 cards (3 linhas x 4 colunas)
const gifCards = Array.from({ length: 12 }).map((_, i) => ({
  id: i,
  title: `Material SST ${i + 1}`,
  description: 'Arquivo editável pronto para download.',
  // Usei placeholders aqui. Substitua essas URLs pelos links dos seus GIFs reais.
  image: `https://placehold.co/600x400/f1f5f9/334155?text=GIF+Preview+${i + 1}`, 
}));

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
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {gifCards.map((card) => (
            <div key={card.id} className="group relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col">
              
              {/* Área do GIF/Imagem */}
              <div className="relative aspect-video overflow-hidden bg-gray-100">
                <img 
                  src={card.image} 
                  alt={card.title} 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                {/* Overlay no hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                  {/* Opcional: ícone ou texto sobre o GIF no hover */}
                </div>
              </div>

              {/* Conteúdo do Card - Centralizado */}
              <div className="p-5 flex flex-col flex-1 items-center text-center">
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-brand-600 transition-colors">
                  {card.title}
                </h3>
                <p className="text-sm text-gray-500 flex-1">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};