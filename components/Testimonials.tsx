import React from 'react';
import { Star, Quote } from 'lucide-react';
import { Testimonial } from '../types';

const testimonials: Testimonial[] = [
  {
    name: "Henrique Kazu",
    role: "Engenheiro de Segurança",
    content: "Encontrei uma grande quantidade de conteúdo valioso. Fiquei surpreso com a qualidade dos materiais úteis disponíveis. Além disso, o suporte foi muito acessível e rápido.",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  {
    name: "George Rodrigues",
    role: "Técnico de Segurança",
    content: "Ótimo material. Muito claro as planilhas. Muito contente com esse material!!!! Obrigado pela atenção!",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  {
    name: "Renata Pereira",
    role: "Técnica de Segurança",
    content: "Adorei! Já comprei muitos materiais de Segurança do Trabalho online, este me chamou a atenção pela organização e pelos bônus. Super indico! Parabéns!",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  {
    name: "Gleisson Ribeiro",
    role: "Técnico de Segurança",
    content: "Um vasto material de SST, além do material BÔNUS, que é simplesmente SENSACIONAL! Vale muito o investimento.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  {
    name: "Miguel Sousa",
    role: "Técnico de Segurança",
    content: "Como iniciante na área, a planilha da CIPA automatizada foi fundamental para conduzir minha primeira eleição. Excelente.",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  {
    name: "Rafael Virgilio",
    role: "Técnico de Segurança",
    content: "Fiz aquisição do SST em CLOUD. Essas suas planilhas são muito legais mesmo.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  }
];

export const Testimonials: React.FC = () => {
  return (
    <div id="depoimentos" className="bg-white py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight uppercase">
            O que dizem os profissionais
          </h2>
          <div className="w-20 h-1.5 bg-brand-500 mx-auto mt-4 rounded-full"></div>
          <p className="mt-4 text-lg text-gray-600">
            Junte-se a centenas de profissionais de SST que transformaram sua rotina.
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col"
            >
              <div className="flex items-center gap-4 mb-6">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name} 
                  className="w-14 h-14 rounded-full object-cover ring-4 ring-brand-50"
                />
                <div>
                  <h4 className="font-bold text-gray-900 text-lg leading-tight">{testimonial.name}</h4>
                  <p className="text-sm text-brand-600 font-medium">{testimonial.role}</p>
                </div>
              </div>

              <div className="flex text-yellow-400 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
              </div>

              <div className="relative flex-1">
                <Quote className="absolute -top-2 -left-2 text-gray-100 w-10 h-10 transform -scale-x-100" />
                <p className="text-gray-600 italic leading-relaxed relative z-10 pl-2">
                  "{testimonial.content}"
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};