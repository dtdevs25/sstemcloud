import React, { useState } from 'react';
import { X, CreditCard, QrCode, Copy, CheckCircle, ExternalLink, Zap, MessageCircle } from 'lucide-react';
import { Button } from './Button';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const pixKey = "19991472282";

  if (!isOpen) return null;

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleHotmartRedirect = () => {
    window.open('https://pay.hotmart.com/G31174149Q?off=om2yn0en&checkoutMode=10&offDiscount=S%C3%93HOJE&src=paginadevendas', '_blank');
  };

  const handleWhatsAppConfirm = () => {
    const message = encodeURIComponent("Olá Daniel! Realizei o pagamento via Pix para o SST em Cloud. Segue o comprovante.");
    window.open(`https://wa.me/5519991472282?text=${message}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">

        {/* Header Azul - Ultra Compacto */}
        <div className="bg-blue-600 py-2 px-4 flex justify-between items-center text-white shrink-0">
          <p className="text-white font-bold text-sm">Escolha a melhor forma de pagamento</p>
          <button
            onClick={onClose}
            className="p-1 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 md:p-6 overflow-y-auto bg-slate-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* OPÇÃO 1: HOTMART */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-orange-200 hover:shadow-md transition-all flex flex-col">

              <div className="mb-6 flex justify-center">
                <img src="https://i.pinimg.com/736x/63/bb/dc/63bbdca7af4430b13d271eab29287dcb.jpg" alt="Hotmart" className="h-20 w-auto object-contain transition-all" />
              </div>

              <div className="flex items-center gap-3 mb-4">
                <div className="bg-orange-100 p-3 rounded-xl text-orange-600">
                  <CreditCard size={28} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-800">Plataforma Hotmart</h3>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Cartão / Boleto / Pix</p>
                </div>
              </div>

              <ul className="space-y-3 mb-6 flex-1">
                <li className="flex items-start gap-2 text-sm text-slate-600">
                  <CheckCircle size={16} className="text-green-500 mt-0.5 shrink-0" />
                  <span>Parcele em até <strong>12x no cartão</strong></span>
                </li>
                <li className="flex items-start gap-2 text-sm text-slate-600">
                  <CheckCircle size={16} className="text-green-500 mt-0.5 shrink-0" />
                  <span>Aceita Visa, Master, Elo e outros</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-slate-600">
                  <CheckCircle size={16} className="text-green-500 mt-0.5 shrink-0" />
                  <span>Compra Segura e Garantia de 7 dias</span>
                </li>
              </ul>

              <Button
                onClick={handleHotmartRedirect}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-orange-200 flex items-center justify-center gap-2 text-base"
              >
                Pagar na Hotmart <ExternalLink size={18} />
              </Button>
            </div>

            {/* OPÇÃO 2: PIX DIRETO */}
            <div className="bg-white p-5 rounded-2xl border-2 border-green-500 shadow-xl relative overflow-hidden flex flex-col">
              <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                Liberação Imediata
              </div>

              <div className="flex items-center gap-3 mb-3">
                <div className="bg-green-100 p-3 rounded-xl text-green-600">
                  <QrCode size={28} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-800">Pix Direto</h3>
                  <p className="text-xs text-green-600 font-bold uppercase tracking-wider flex items-center gap-1">
                    <Zap size={12} fill="currentColor" /> Bônus Liberados Agora
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center mb-4 bg-slate-50 p-2 rounded-xl border border-dashed border-slate-300">
                {/* QR Code Aumentado (w-32 h-32 = 128px) */}
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${pixKey}`}
                  alt="QR Code Pix"
                  className="w-32 h-32 mix-blend-multiply mb-2"
                />

                <div className="text-center w-full pt-2 border-t border-slate-200 mt-1">
                  <p className="text-sm font-bold text-slate-700">Daniel Pereira dos Santos</p>
                  <p className="text-xs text-slate-500 uppercase font-semibold">Banco: Nubank</p>
                </div>
              </div>

              <div className="mb-4">
                {/* Exibindo apenas o botão, sem o valor da chave */}
                <button
                  onClick={handleCopyPix}
                  className={`w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${copied ? 'bg-slate-700 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}
                >
                  {copied ? <CheckCircle size={18} /> : <Copy size={18} />}
                  {copied ? 'Chave Copiada!' : 'Copiar Chave Pix'}
                </button>
              </div>

              <button
                onClick={handleWhatsAppConfirm}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-green-200 flex items-center justify-center gap-2 text-base transition-colors mt-auto"
              >
                <MessageCircle size={20} />
                Informar Pagamento
              </button>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-3 text-center border-t border-gray-100">
          <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
            <CheckCircle size={12} /> Compra 100% Segura. Seus dados estão protegidos.
          </p>
        </div>

      </div>
    </div>
  );
};