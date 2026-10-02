import React from 'react';
import { useCart } from '../context/CartContext';

export const ProductCard = ({ product, onSelectProduct }) => {
  const { addToCart } = useCart();
  const EXCHANGE_RATE = 36.50; // Tasa BCV

  // Cálculo de precio en dólares
  const priceInUSD = (product.price / EXCHANGE_RATE).toFixed(2);

  return (
    <div className="min-w-[200px] max-w-[220px] bg-white rounded-3xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group flex-shrink-0">
      <div>
        {/* Visualización del producto */}
        <div className="w-full h-28 bg-emerald-50/50 rounded-2xl flex items-center justify-center text-5xl mb-3 group-hover:scale-105 transition-transform">
          {product.image}
        </div>

        {/* Unidad / Medida */}
        <span className="text-[10px] font-bold uppercase text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
          {product.unit}
        </span>

        {/* Nombre del Producto */}
        <h3 className="font-extrabold text-gray-800 text-sm mt-2 line-clamp-1">
          {product.name}
        </h3>
      </div>

      {/* Bloque de Precios (Bs. y $) y Botón */}
      <div className="mt-3 pt-2 border-t border-gray-50 flex items-center justify-between">
        <div>
          <p className="text-sm font-black text-emerald-700 leading-tight">
            Bs. {product.price.toFixed(2)}
          </p>
          <p className="text-[11px] font-bold text-gray-400">
            ${priceInUSD} USD
          </p>
        </div>

        <button
          onClick={() => onSelectProduct(product)}
          className="bg-orange-500 hover:bg-orange-600 text-white p-2.5 rounded-2xl shadow-sm transition-all active:scale-90"
          title="Agregar al carrito"
        >
          🛒
        </button>
      </div>
    </div>
  );
};