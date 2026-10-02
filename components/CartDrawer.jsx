import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export const CartDrawer = () => {
  const navigate = useNavigate();
  const { 
    cart = [], 
    isCartOpen, 
    toggleCart, 
    setIsCartOpen, 
    updateQuantity, 
    removeFromCart, 
    selectedSede = 'Principal' 
  } = useCart();
  
  const EXCHANGE_RATE = 36.50; // Tasa BCV

  // Si no está abierto, no renderizamos nada
  if (!isCartOpen) return null;

  // Función unificada para cerrar el carrito
  const handleClose = () => {
    if (toggleCart) toggleCart();
    else if (setIsCartOpen) setIsCartOpen(false);
  };

  const totalBs = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalUSD = totalBs / EXCHANGE_RATE;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Fondo oscuro con evento para cerrar al hacer clic afuera */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
        onClick={handleClose}
      />

      {/* Panel lateral del Carrito */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-right duration-300">
        
        {/* Cabecera del Carrito */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-emerald-900 text-white">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🛒</span>
            <div>
              <h2 className="font-extrabold text-base leading-tight">Tu Carrito</h2>
              <p className="text-[10px] text-emerald-200">Sede {selectedSede}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="bg-emerald-800 hover:bg-emerald-700 text-white p-2 rounded-xl text-xs font-bold transition-colors"
          >
            ✕ Cerrar
          </button>
        </div>

        {/* Lista de Ítems */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 divide-y divide-gray-100">
          {cart.length === 0 ? (
            <div className="text-center py-16 text-gray-400 space-y-3">
              <span className="text-5xl block">🛍️</span>
              <p className="font-extrabold text-sm text-gray-600">Tu carrito está vacío</p>
              <p className="text-xs">Agrega productos frescos desde el catálogo.</p>
            </div>
          ) : (
            cart.map((item) => {
              const itemTotalBs = item.price * item.quantity;
              const itemTotalUSD = itemTotalBs / EXCHANGE_RATE;

              return (
                <div key={item.id} className="pt-4 first:pt-0 flex justify-between items-center gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl bg-emerald-50 p-2 rounded-2xl">{item.image || '📦'}</span>
                    <div>
                      <h4 className="font-extrabold text-sm text-gray-800 leading-tight">{item.name}</h4>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Bs. {item.price.toFixed(2)} (${(item.price / EXCHANGE_RATE).toFixed(2)} USD)
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity && updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 bg-gray-100 rounded-lg text-xs font-black text-gray-600 hover:bg-gray-200"
                        >
                          -
                        </button>
                        <span className="text-xs font-black w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity && updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 bg-emerald-600 text-white rounded-lg text-xs font-black hover:bg-emerald-700"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex flex-col items-end gap-1">
                    <p className="text-sm font-black text-emerald-700 leading-tight">
                      Bs. {itemTotalBs.toFixed(2)}
                    </p>
                    <p className="text-[11px] font-bold text-gray-400">
                      ${itemTotalUSD.toFixed(2)} USD
                    </p>
                    <button
                      onClick={() => removeFromCart && removeFromCart(item.id)}
                      className="text-[10px] text-red-500 font-bold hover:underline mt-1"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer con Totales Bimoneda */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-gray-100 bg-gray-50 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-gray-500">
                <span>Subtotal</span>
                <span>Bs. {totalBs.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center border-t border-gray-200 pt-2">
                <span className="font-extrabold text-gray-800 text-sm">Total Estimado</span>
                <div className="text-right">
                  <p className="text-xl font-black text-emerald-700 leading-tight">
                    Bs. {totalBs.toFixed(2)}
                  </p>
                  <p className="text-xs font-extrabold text-emerald-600">
                    ${totalUSD.toFixed(2)} USD
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                handleClose();
                navigate('/checkout');
              }}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3.5 rounded-2xl shadow-md transition-all active:scale-95 text-sm"
            >
              Proceder al Pago 🚀
            </button>
          </div>
        )}

      </div>
    </div>
  );
};