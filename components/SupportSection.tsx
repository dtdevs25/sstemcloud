import React from 'react';
import { Layers, Paintbrush, Flame, ShoppingCart, ArrowLeft, MoreVertical, Phone, Video, Cloud, Send } from 'lucide-react';

export const SupportSection: React.FC = () => {
  const currentDate = new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <section className="bg-white py-20 overflow-hidden border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
          
          {/* Coluna da Esquerda: Texto e Ícones */}
          <div className="w-full lg:w-1/2 space-y-10">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold uppercase leading-tight text-center lg:text-left text-gray-900 drop-shadow-sm">
              Conte com nosso suporte <br />
              <span className="text-brand-600">pelo WhatsApp</span>
            </h2>

            <div className="space-y-8">
              {/* Item 1 */}
              <div className="flex items-start gap-4 group">
                {/* Ícone Branco com Fundo Azul */}
                <div className="flex-shrink-0 mt-1 p-3 bg-brand-600 rounded-xl shadow-md group-hover:bg-brand-700 transition-colors">
                  <Layers className="w-8 h-8 text-white" />
                </div>
                <p className="text-lg text-gray-600 font-medium leading-relaxed">
                  Você terá um arquivo guia para encontrar todos os arquivos que precisa, para acessá-los mais rápido.
                </p>
              </div>

              {/* Item 2 */}
              <div className="flex items-start gap-4 group">
                <div className="flex-shrink-0 mt-1 p-3 bg-brand-600 rounded-xl shadow-md group-hover:bg-brand-700 transition-colors">
                  <Paintbrush className="w-8 h-8 text-white" />
                </div>
                <p className="text-lg text-gray-600 font-medium leading-relaxed">
                  Te auxiliaremos nas personalizações que deseja realizar nos materiais do drive, caso não consiga fazer sozinho(a).
                </p>
              </div>

              {/* Item 3 */}
              <div className="flex items-start gap-4 group">
                <div className="flex-shrink-0 mt-1 p-3 bg-brand-600 rounded-xl shadow-md group-hover:bg-brand-700 transition-colors">
                  <Flame className="w-8 h-8 text-white" />
                </div>
                <p className="text-lg text-gray-600 font-medium leading-relaxed">
                  Nosso canal no WhatsApp funciona em horários especiais para atender sua necessidade.
                </p>
              </div>

              {/* Item 4 */}
              <div className="flex items-start gap-4 group">
                <div className="flex-shrink-0 mt-1 p-3 bg-brand-600 rounded-xl shadow-md group-hover:bg-brand-700 transition-colors">
                  <ShoppingCart className="w-8 h-8 text-white" />
                </div>
                <p className="text-lg text-gray-600 font-medium leading-relaxed">
                  Você terá suporte após adquirir o material por tempo indeterminado. Um dos nossos valores é fazer você viver a melhor experiência.
                </p>
              </div>
            </div>
          </div>

          {/* Coluna da Direita: Mockup do iPhone */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
            <div className="relative mx-auto border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[650px] w-[320px] shadow-2xl flex flex-col overflow-hidden ring-1 ring-gray-900/10">
              {/* Câmera/Notch */}
              <div className="h-[32px] w-[3px] bg-gray-800 absolute -left-[17px] top-[72px] rounded-l-lg"></div>
              <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[124px] rounded-l-lg"></div>
              <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[178px] rounded-l-lg"></div>
              <div className="h-[64px] w-[3px] bg-gray-800 absolute -right-[17px] top-[142px] rounded-r-lg"></div>
              
              {/* Tela do Celular */}
              <div className="rounded-[2rem] overflow-hidden w-full h-full bg-[#efe7dd] relative flex flex-col">
                
                {/* Header do WhatsApp com Nuvem Azul em Círculo Branco */}
                <div className="bg-[#075e54] px-4 py-3 flex items-center gap-2 text-white shadow-md z-10">
                   <ArrowLeft size={20} />
                   <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                      <Cloud className="text-sky-500 w-5 h-5 fill-current" />
                   </div>
                   <div className="flex-1 ml-1">
                      <h3 className="font-bold text-sm leading-tight">SST em CLOUD</h3>
                      <p className="text-[10px] opacity-90 truncate">visto por último hoje às 16:56</p>
                   </div>
                   <div className="flex gap-3">
                      <Video size={18} />
                      <Phone size={18} />
                      <MoreVertical size={18} />
                   </div>
                </div>

                {/* Área de Mensagens */}
                <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-opacity-10">
                   
                   {/* Data Atualizada */}
                   <div className="flex justify-center mb-4">
                      <span className="bg-[#e1f3fb] text-gray-600 text-xs px-2 py-1 rounded shadow-sm uppercase">{currentDate}</span>
                   </div>

                   {/* Aviso de Criptografia */}
                   <div className="flex justify-center mb-4">
                      <div className="bg-[#fffae6] text-[10px] text-gray-600 p-2 rounded-lg text-center shadow-sm border border-yellow-200 max-w-[90%]">
                         🔒 As mensagens e as chamadas são protegidas com a criptografia de ponta a ponta.
                      </div>
                   </div>

                   <div className="flex justify-center mb-2">
                      <span className="bg-[#e1f3fb] text-gray-600 text-xs px-2 py-1 rounded shadow-sm">Hoje</span>
                   </div>

                   {/* Msg 1 - Usuário (Verde Claro) */}
                   <div className="flex justify-end">
                      <div className="bg-[#dcf8c6] p-2 rounded-lg rounded-tr-none shadow-sm max-w-[80%]">
                         <p className="text-sm text-gray-800">Esse Drive realmente vai me ajudar no dia a dia?</p>
                         <span className="text-[10px] text-gray-500 float-right mt-1 ml-2 flex items-center gap-0.5">
                            16:26 <span className="text-blue-500">✓✓</span>
                         </span>
                      </div>
                   </div>

                   {/* Msg 2 - Suporte (Branco) - Sem nome */}
                   <div className="flex justify-start">
                      <div className="bg-white p-2 rounded-lg rounded-tl-none shadow-sm max-w-[90%]">
                         <p className="text-sm text-gray-800">
                           Com certeza! 🚀 <br/><br/>
                           São mais de <strong>44GB de arquivos</strong> focados em Segurança do Trabalho.
                         </p>
                         <span className="text-[10px] text-gray-500 float-right mt-1 ml-2">
                            16:55
                         </span>
                      </div>
                   </div>

                    {/* Msg 3 - Suporte continuação */}
                   <div className="flex justify-start">
                      <div className="bg-white p-2 rounded-lg rounded-tl-none shadow-sm max-w-[90%]">
                         <p className="text-sm text-gray-800">
                           Suas atividades serão muito mais fáceis e rápidas. Tudo organizado para você baixar e editar!
                         </p>
                         <span className="text-[10px] text-gray-500 float-right mt-1 ml-2">
                            16:55
                         </span>
                      </div>
                   </div>

                   {/* Msg 4 - Usuário */}
                   <div className="flex justify-end">
                      <div className="bg-[#dcf8c6] p-2 rounded-lg rounded-tr-none shadow-sm max-w-[80%]">
                         <p className="text-sm text-gray-800">Perfeito! Era isso que eu precisava. 😍</p>
                         <span className="text-[10px] text-gray-500 float-right mt-1 ml-2 flex items-center gap-0.5">
                            16:56 <span className="text-blue-500">✓✓</span>
                         </span>
                      </div>
                   </div>

                </div>

                {/* Input Area - Com avião de papel */}
                <div className="bg-gray-100 px-2 py-2 flex items-center gap-2">
                   <div className="bg-white flex-1 rounded-full px-4 py-2 text-sm text-gray-400 shadow-sm border border-gray-200">
                      Digite uma me...
                   </div>
                   <div className="bg-[#075e54] p-2.5 rounded-full text-white shadow-sm flex items-center justify-center">
                      <Send className="w-4 h-4 ml-0.5" />
                   </div>
                </div>

                {/* Home Indicator */}
                <div className="bg-black h-full pb-1 pt-2 flex justify-center bg-opacity-5 absolute bottom-0 w-full pointer-events-none">
                  <div className="w-1/3 h-1 bg-gray-400 rounded-full"></div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};