import React from 'react';
import { Button } from './Button';
import { Mail, Phone, MapPin } from 'lucide-react';

export const Contact: React.FC = () => {
  return (
    <div id="contato" className="bg-brand-900 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 text-white">
          
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl mb-6">
              Pronto para transformar seu negócio?
            </h2>
            <p className="text-brand-100 text-lg mb-8">
              Fale com um de nossos consultores e descubra como o SistemCloud pode economizar seu tempo e dinheiro.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center">
                <Phone className="h-6 w-6 text-brand-400 mr-4" />
                <span className="text-lg">+55 (11) 99999-9999</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-6 w-6 text-brand-400 mr-4" />
                <span className="text-lg">contato@sistemcloud.com.br</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-6 w-6 text-brand-400 mr-4" />
                <span className="text-lg">Av. Paulista, 1000 - São Paulo, SP</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 text-gray-900 shadow-2xl">
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome Completo</label>
                <input type="text" id="name" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 border p-3" placeholder="Seu nome" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-mail Corporativo</label>
                <input type="email" id="email" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 border p-3" placeholder="seu@email.com" />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Mensagem</label>
                <textarea id="message" rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 border p-3" placeholder="Como podemos ajudar?"></textarea>
              </div>
              <Button fullWidth variant="primary">
                Enviar Mensagem
              </Button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};