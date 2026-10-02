import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

export const QuickBuyModal = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const EXCHANGE_RATE = 36.50; // Tasa BCV

  if (!product) return null;

  const totalBs = product.price * quantity;
  const totalUSD = totalBs / EXCHANGE_RATE;
  const unitUSD = product.price / EXCHANGE_RATE;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-100 p-2 rounded-full text-xs font-bold"
        >
          ✕
        </button>

        <div className="flex gap-4 items-center">
          <div className="w-20 h-20 bg-emerald-50 rounded-2xl flex items-center justify-center text-4xl">
            {product.image}
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
              {product.unit}
            </span>
            <h3 className="font-extrabold text-gray-800 text-lg mt-1">{product.name}</h3>
            <p className="text-xs font-bold text-gray-500">
              Bs. {product.price.toFixed(2)} <span className="text-gray-400">(${unitUSD.toFixed(2)} USD)</span>
            </p>
          </div>
        </div>

        {/* Seleccionador de Cantidad */}
        <div className="flex items-center justify-between bg-gray-50 p-3 rounded-2xl">
          <span className="text-xs font-bold text-gray-600">Cantidad:</span>
          <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-1">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 font-bold text-gray-700 transition-colors"
            >
              -
            </button>
            <span className="font-black text-sm w-6 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="w-8 h-8 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors"
            >
              +
            </button>
          </div>
        </div>

        {/* Resumen de Total Bimoneda */}
        <div className="bg-emerald-50/60 p-4 rounded-2xl flex justify-between items-center border border-emerald-100">
          <span className="text-xs font-bold text-emerald-900">Total a pagar:</span>
          <div className="text-right">
            <p className="text-lg font-black text-emerald-700 leading-tight">
              Bs. {totalBs.toFixed(2)}
            </p>
            <p className="text-xs font-bold text-emerald-600">
              ${totalUSD.toFixed(2)} USD
            </p>
          </div>
        </div>

        <button
          onClick={handleAddToCart}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3.5 rounded-2xl shadow-md transition-all active:scale-95"
        >
          Agregar al Carrito 🛒
        </button>
      </div>
    </div>
  );
};