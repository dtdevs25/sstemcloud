import React from 'react';
import { X, CreditCard, QrCode, CheckCircle, ExternalLink, Zap, MessageCircle } from 'lucide-react';
import { Button } from './Button';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}



export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose }) => {
  // Trava de scroll para evitar que a página pule
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Link de pagamento do Mercado Pago
  const paymentLink = "https://mpago.la/1Ba138T";

  const handleHotmartRedirect = () => {
    window.open('https://pay.hotmart.com/G31174149Q?off=om2yn0en&checkoutMode=10&offDiscount=S%C3%93HOJE&src=paginadevendas', '_blank');
  };

  const handleWhatsAppConfirm = () => {
    const message = encodeURIComponent("Olá Daniel! Realizei o pagamento via Pix de R$ 157,00 para o SST em Cloud. Segue o comprovante.");
    window.open(`https://wa.me/5519991472282?text=${message}`, '_blank');
  };

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
    >
      <div
        className={`relative bg-white rounded-[2rem] shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[95%] sm:max-h-[90%] transition-transform duration-500 ${isOpen ? 'translate-y-0 scale-100' : 'translate-y-20 scale-95'}`}
      >
        {/* Header Azul - Ultra Compacto */}
        <div className="bg-blue-600 py-2.5 px-5 flex justify-between items-center text-white shrink-0">
          <p className="text-white font-bold text-sm uppercase tracking-tight">Pagamento Seguro</p>
          <button
            onClick={onClose}
            className="p-1.5 bg-white/10 hover:bg-white/20 rounded-full transition-all active:scale-95"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-3 md:p-4 overflow-y-auto bg-slate-50 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5">

            {/* OPÇÃO 1: HOTMART */}
            <div className="bg-white p-4 md:p-4 rounded-3xl border border-slate-200 shadow-sm flex flex-col border-b-4 border-b-orange-200">
              <div className="mb-3 md:mb-2 flex justify-center h-14 md:h-16">
                <img src="https://i.pinimg.com/736x/63/bb/dc/63bbdca7af4430b13d271eab29287dcb.jpg" alt="Hotmart" className="h-full w-full object-contain scale-[1.35] md:scale-[1.4] origin-center" />
              </div>

              <div className="flex items-center gap-3 md:gap-3 mb-4 md:mb-3 mt-1 md:mt-1">
                <div className="bg-orange-100 p-2 md:p-2 rounded-2xl text-orange-600">
                  <CreditCard size={20} className="md:w-5 md:h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base md:text-base text-slate-800 leading-tight">Cartão ou Boleto</h3>
                  <p className="text-[10px] md:text-[10px] text-slate-500 font-black uppercase tracking-widest">Plataforma Hotmart</p>
                </div>
              </div>

              <div className="space-y-2 md:space-y-1.5 mb-4 md:mb-3 flex-1">
                <div className="flex items-center gap-2 md:gap-2 text-sm md:text-sm text-slate-600 font-medium">
                  <CheckCircle size={16} className="text-green-500 md:w-4 md:h-4" />
                  <span>Parcelamento em até 12x</span>
                </div>
                <div className="flex items-center gap-2 md:gap-2 text-sm md:text-sm text-slate-600 font-medium">
                  <CheckCircle size={16} className="text-green-500 md:w-4 md:h-4" />
                  <span>Liberação automática</span>
                </div>
              </div>

              <Button
                onClick={handleHotmartRedirect}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-black py-3 md:py-2.5 rounded-xl md:rounded-xl shadow-lg shadow-orange-100 flex items-center justify-center gap-2 text-sm md:text-sm transition-all active:scale-95 mt-auto"
              >
                IR PARA HOTMART <ExternalLink size={16} className="md:w-4 md:h-4" />
              </Button>
            </div>

            {/* OPÇÃO 2: PIX DIRETO */}
            <div className="bg-white p-4 md:p-4 rounded-3xl border-2 border-green-500 shadow-xl relative flex flex-col overflow-hidden">
              <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] md:text-[10px] font-black px-3 py-1 rounded-bl-2xl uppercase tracking-tighter">
                Preço Promocional
              </div>

              <div className="flex items-center gap-3 mb-4 md:mb-3 mt-1 md:mt-1">
                <div className="bg-green-100 p-2 rounded-2xl text-green-600">
                  <QrCode size={20} className="md:w-5 md:h-5" />
                </div>
                <div className="flex flex-col">
                  <h3 className="font-extrabold text-base md:text-base text-slate-800 leading-tight">Pix Direto</h3>
                  <p className="text-xs md:text-xs text-green-600 font-black uppercase flex items-center gap-1">
                    <Zap size={10} className="md:w-2.5 md:h-2.5" fill="currentColor" /> R$ 157,00 À VISTA
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center mb-4 md:mb-3 bg-slate-50 p-3 md:p-3 rounded-[1.5rem] md:rounded-[1.5rem] border border-dashed border-slate-300">
                <div className="bg-white p-2 md:p-1.5 rounded-xl shadow-sm mb-2">
                  {/* Estabilizado: a imagem não recarrega do zero ao abrir o modal */}
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(paymentLink)}`}
                    alt="QR Code Pagamento"
                    className="w-28 h-28 md:w-28 md:h-28 mix-blend-multiply"
                  />
                </div>

                <div className="text-center w-full">
                  <p className="text-sm md:text-sm font-black text-slate-800 leading-tight">DANIEL PEREIRA DOS SANTOS</p>
                  <p className="text-[10px] md:text-[10px] text-slate-500 font-bold uppercase mt-0.5 md:mt-0.5">Mercado Pago</p>
                </div>
              </div>

              <div className="space-y-2 md:space-y-2 mt-auto">
                <a
                  href={paymentLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-slate-800 hover:bg-slate-900 text-white py-3 md:py-2.5 rounded-xl md:rounded-xl font-black text-sm md:text-sm transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg"
                >
                  <ExternalLink size={16} className="md:w-4 md:h-4" />
                  ACESSAR LINK PARA PAGAR
                </a>

                <button
                  onClick={handleWhatsAppConfirm}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-black py-3 md:py-2.5 rounded-xl md:rounded-xl shadow-lg shadow-green-100 flex items-center justify-center gap-2 text-sm md:text-sm transition-all active:scale-95"
                >
                  <MessageCircle size={18} className="md:w-4 md:h-4" />
                  ENVIAR COMPROVANTE
                </button>
              </div>
            </div>

          </div>
        </div>

        <div className="bg-white p-3 md:p-3 text-center border-t border-slate-100 shrink-0">
          <p className="text-[10px] sm:text-xs md:text-[10px] text-slate-400 font-bold flex items-center justify-center gap-1 uppercase tracking-widest">
            <CheckCircle size={14} className="md:w-3 md:h-3" /> Transação 100% Criptografada e Segura
          </p>
        </div>

      </div>
    </div>
  );
};