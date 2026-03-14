import React, { useState } from 'react';
import { MessageCircle, Send, X, Smile, Cloud } from 'lucide-react';

export const FloatingWhatsApp: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    const text = encodeURIComponent(message || "Olá! Gostaria de saber mais sobre o SST em Cloud.");
    const phone = '5519991472282'; // Número atualizado
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
    setIsOpen(false);
    setMessage('');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* Janela de Chat - Reduzida para w-[340px] */}
      {isOpen && (
        <div className="mb-4 w-[90vw] sm:w-[340px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-fadeIn origin-bottom-right transition-all">
          
          {/* Header */}
          <div className="bg-[#075e54] p-5 flex justify-between items-center text-white">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                    {/* Ícone de Nuvem Azul */}
                    <Cloud className="text-sky-500 w-7 h-7" fill="currentColor" />
                </div>
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-400 border-2 border-[#075e54] rounded-full"></span>
              </div>
              <div>
                <h3 className="font-bold text-base">Atendimento SST</h3>
                <p className="text-xs opacity-90">Online agora</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors p-1"
            >
              <X size={24} />
            </button>
          </div>

          {/* Body */}
          <div className="p-5 bg-[#e5ddd5] min-h-[250px] max-h-[400px] overflow-y-auto flex flex-col gap-4 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-opacity-50">
            {/* Mensagem do Sistema */}
            <div className="bg-white p-4 rounded-lg rounded-tl-none shadow-sm self-start max-w-[85%]">
              <p className="text-base text-gray-800 leading-relaxed">
                Olá! 👋 <br/>
                Como podemos ajudar você hoje? Digite sua dúvida abaixo que te responderemos no WhatsApp!
              </p>
              <span className="text-[11px] text-gray-400 float-right mt-1">Agora</span>
            </div>
          </div>

          {/* Footer Input */}
          <div className="p-4 bg-white border-t border-gray-100">
            <form onSubmit={handleSend} className="flex gap-3 items-center">
              <div className="flex-1 relative">
                 <input 
                  type="text" 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Digite sua mensagem..." 
                  className="w-full pl-4 pr-10 py-3 bg-gray-100 rounded-full text-base focus:outline-none focus:ring-1 focus:ring-[#075e54]"
                 />
                 <Smile className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600" />
              </div>
              <button 
                type="submit"
                className="bg-[#075e54] p-3 rounded-full text-white hover:bg-[#128c7e] transition-colors flex-shrink-0 shadow-sm"
              >
                <Send size={20} className="ml-0.5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Botão Flutuante */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center justify-center focus:outline-none"
        aria-label="Fale conosco no WhatsApp"
      >
        {/* Efeito Pulsante - Só mostra se fechado */}
        {!isOpen && (
          <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping"></span>
        )}
        
        <div className={`relative p-4 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center ${isOpen ? 'bg-gray-600 rotate-90' : 'bg-green-500 hover:bg-green-600 hover:scale-110'}`}>
           {isOpen ? <X className="h-8 w-8 text-white" /> : <MessageCircle className="h-8 w-8 text-white" />}
        </div>

        {!isOpen && (
          <span className="absolute right-full mr-4 bg-white text-gray-800 px-3 py-1 rounded-md text-sm font-medium shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Fale conosco agora!
          </span>
        )}
      </button>
    </div>
  );
};