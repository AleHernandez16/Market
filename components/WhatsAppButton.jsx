import React from 'react';
import { useCart } from '../context/CartContext';

export const WhatsAppButton = () => {
  const { selectedSede } = useCart();

  // Número de contacto oficial (Formato internacional sin el signo +)
  const phoneNumber = '584120000000'; 

  // Mensaje predeterminado dinámico
  const defaultMessage = encodeURIComponent(
    `¡Hola OrtiFresca! 👋 Quisiera realizar una consulta o pedido directo para la Sede ${selectedSede}.`
  );

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${defaultMessage}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className="fixed bottom-6 right-6 z-40 bg-green-500 hover:bg-green-600 text-white p-3.5 md:p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 flex items-center gap-2 group border-2 border-white"
    >
      {/* Indicador de estado en línea */}
      <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-300 border-2 border-white"></span>
      </span>

      {/* Ícono de Chat */}
      <span className="text-2xl md:text-3xl select-none">💬</span>

      {/* Etiqueta flotante expansible */}
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap text-xs md:text-sm font-black pr-1">
        ¿Atención personalizada?
      </span>
    </a>
  );
};