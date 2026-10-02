import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export const Navbar = () => {
  const navigate = useNavigate();
  const { cart, toggleCart, selectedSede, setSelectedSede } = useCart();
  
  // Tasa del día (BCV / Oficial)
  const [exchangeRate] = useState(36.50);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm">
      {/* Cinta de Tasa BCV del Día */}
      <div className="bg-emerald-950 text-emerald-100 text-[11px] font-bold py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-800 text-emerald-200 px-2 py-0.5 rounded-md text-[10px] uppercase font-black tracking-wider">
              Tasa Oficial
            </span>
            <span>💵 1 USD = <strong className="text-white">Bs. {exchangeRate.toFixed(2)}</strong></span>
          </div>
          <span className="hidden sm:inline-block text-emerald-300/80 font-medium">
            Precios actualizados automáticamente
          </span>
        </div>
      </div>

      {/* Barra de Navegación Principal */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        
        {/* Logo y Marca */}
        <div 
          onClick={() => navigate('/')} 
          className="flex items-center gap-2 cursor-pointer select-none group"
        >
          <span className="text-3xl group-hover:scale-110 transition-transform">🥬</span>
          <div>
            <h1 className="text-xl font-black text-emerald-700 leading-none">HortiFresca</h1>
            <p className="text-[10px] font-bold text-gray-400">Tu mercado online</p>
          </div>
        </div>

        {/* Acciones: Selector de Sede, Panel Admin y Carrito */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Selector de Sede */}
          <div className="flex items-center bg-gray-100 p-1 rounded-2xl border border-gray-200">
            <span className="text-xs pl-2.5 pr-1 font-bold text-gray-500 hidden sm:inline">Sede:</span>
            <select
              value={selectedSede}
              onChange={(e) => setSelectedSede(e.target.value)}
              className="bg-white text-xs font-black text-gray-800 py-1.5 px-2.5 rounded-xl border-0 focus:outline-none cursor-pointer shadow-sm"
            >
              <option value="Cagua">📍 Cagua</option>
              <option value="Maracay">📍 Maracay</option>
              <option value="Turmero">📍 Turmero</option>
            </select>
          </div>

          {/* Botón Acceso Admin */}
          <button
            onClick={() => navigate('/admin')}
            className="p-2 text-gray-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-all"
            title="Panel de Administración"
          >
            ⚙️
          </button>

          {/* Botón Carrito */}
          <button
            onClick={toggleCart}
            className="relative bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-3.5 py-2 rounded-2xl flex items-center gap-2 shadow-sm transition-all active:scale-95 text-xs sm:text-sm"
          >
            <span>🛒</span>
            <span className="hidden sm:inline">Carrito</span>
            {totalItems > 0 && (
              <span className="bg-orange-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse">
                {totalItems}
              </span>
            )}
          </button>

        </div>

      </div>
    </header>
  );
};