import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { FaqItem } from '../types';

const faqs: FaqItem[] = [
  {
    question: 'Pago só uma vez ou terei novas cobranças?',
    answer: 'O pagamento é feito somente uma vez, não será cobrado nenhum valor futuro para ter acesso ao DRIVE.',
  },
  {
    question: 'Quando vou ter acesso?',
    answer: 'Após a efetivação da compra, o sistema de pagamentos processará seu pagamento, quando computado pelo sistema o acesso for enviado automaticamente ao e-mail cadastrado.',
  },
  {
    question: 'Posso baixar os arquivos para meu computador?',
    answer: 'Sim, você pode baixar qualquer arquivo do SST em Cloud no seu computador, celular ou tablet, baixe o quanto quiser.',
  },
  {
    question: 'Posso editar os arquivos, colocar minha logo?',
    answer: 'Sim, os arquivos são totalmente editáveis e você pode inserir sua Logomarca, modificando os detalhes que achar necessário e adaptar para seu uso.',
  },
  {
    question: 'As planilhas automatizadas tem senha?',
    answer: 'Sim, algumas planilhas têm senha para evitar a perda de fórmulas e campos protegidos para garantir seu funcionamento, mas se necessário é só solicitar que enviemos.',
  },
];

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div id="faq" className="relative bg-brand-50 pt-32 pb-48 md:pt-48 md:pb-64">
      {/* Cloud Divider Top - Nuvens Brancas penduradas */}
      <div className="cloud-divider top-0">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="xMidYMax slice" className="fill-white">
           <path d="M0,0 L0,60 C80,60 100,20 180,20 C260,20 280,70 360,70 C440,70 460,30 540,30 C620,30 640,80 720,80 C800,80 820,40 900,40 C980,40 1000,90 1080,90 C1160,90 1180,50 1200,50 L1200,0 Z" />
        </svg>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <h2 className="text-3xl font-extrabold text-white text-center mb-12 drop-shadow-md">
          PERGUNTAS FREQUENTES
        </h2>
        <dl className="space-y-6 divide-y divide-white/20">
          {faqs.map((faq, index) => (
            <div key={index} className="pt-6">
              <dt className="text-lg">
                <button
                  onClick={() => toggleFaq(index)}
                  className="text-left w-full flex justify-between items-start text-blue-100 hover:text-white transition-colors focus:outline-none group"
                >
                  <span className="font-bold text-white text-lg group-hover:translate-x-1 transition-transform">{faq.question}</span>
                  <span className="ml-6 h-7 flex items-center">
                    {openIndex === index ? (
                      <ChevronUp className="h-6 w-6 text-white bg-white/20 rounded-full" />
                    ) : (
                      <ChevronDown className="h-6 w-6 text-blue-100" />
                    )}
                  </span>
                </button>
              </dt>
              {openIndex === index && (
                <dd className="mt-4 pr-12">
                  <div className="text-base text-gray-800 bg-white/90 p-6 rounded-2xl shadow-lg animate-fadeIn transform origin-top">
                    {faq.answer}
                  </div>
                </dd>
              )}
            </div>
          ))}
        </dl>
      </div>

      {/* Cloud Divider Bottom - Transição para Branco (Rodapé de Garantia) */}
      <div className="cloud-divider bottom-0">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="xMidYMin slice" className="fill-white">
           {/* Bumps apontando para cima */}
           <path d="M0,120 L0,60 C80,60 100,20 180,20 C260,20 280,70 360,70 C440,70 460,30 540,30 C620,30 640,80 720,80 C800,80 820,40 900,40 C980,40 1000,90 1080,90 C1160,90 1180,50 1200,50 L1200,120 Z" />
        </svg>
      </div>
    </div>
  );
};