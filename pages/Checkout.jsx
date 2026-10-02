import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export const Checkout = () => {
  const navigate = useNavigate();
  const { cart, clearCart, selectedSede } = useCart();
  
  const EXCHANGE_RATE = 36.50; // Tasa BCV
  const WHATSAPP_PHONE = '584120000000'; // Número oficial de la tienda (sin el signo +)

  const [paymentMethod, setPaymentMethod] = useState('pagomovil');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    reference: '',
  });

  const totalBs = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalUSD = totalBs / EXCHANGE_RATE;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    // 1. Construir el listado detallado de ítems
    const itemsText = cart
      .map(
        (item) =>
          `• *${item.quantity}x* ${item.name} → Bs. ${(item.price * item.quantity).toFixed(2)} ($${((item.price * item.quantity) / EXCHANGE_RATE).toFixed(2)})`
      )
      .join('\n');

    // 2. Formatear el mensaje completo con emojis y formato de negritas para WhatsApp
    const rawMessage = `🛒 *NUEVO PEDIDO - ORTIFRESCA* 🥬
📍 *Sede de Despacho:* ${selectedSede}

👤 *Datos del Cliente:*
• *Nombre:* ${formData.name}
• *Teléfono:* ${formData.phone}
• *Dirección:* ${formData.address}

📋 *Detalle de Productos:*
${itemsText}

💵 *Monto Total:*
• *Bolívares:* Bs. ${totalBs.toFixed(2)}
• *Dólares:* $${totalUSD.toFixed(2)} USD
_(Tasa BCV: Bs. ${EXCHANGE_RATE.toFixed(2)} / USD)_

💳 *Método de Pago:* ${paymentMethod.toUpperCase()}
${formData.reference ? `🔢 *Nº Referencia:* ${formData.reference}` : '🤝 *Pago en efectivo contra entrega*'}

¡Quedo a la espera de la confirmación de mi pedido! 🚀`;

    // 3. Crear el enlace directo a WhatsApp
    const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(rawMessage)}`;

    // 4. Vaciar carrito, abrir WhatsApp y redirigir al inicio
    clearCart();
    window.open(whatsappUrl, '_blank');
    navigate('/');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <span className="text-6xl mb-4">🛒</span>
        <h2 className="text-2xl font-black text-gray-800">No tienes productos en tu carrito</h2>
        <p className="text-gray-500 text-sm mt-1 mb-6">Selecciona algunos productos antes de procesar el pago.</p>
        <button
          onClick={() => navigate('/')}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-6 py-3 rounded-2xl shadow-md transition-all"
        >
          Volver a la Tienda
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Cabecera */}
        <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <button
            onClick={() => navigate('/')}
            className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3.5 py-2 rounded-xl hover:bg-emerald-100 transition-colors"
          >
            ← Volver al Catálogo
          </button>
          <div className="text-right">
            <h1 className="text-lg font-black text-gray-800">Finalizar Compra</h1>
            <p className="text-[11px] font-bold text-emerald-600">Sede {selectedSede}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Columna Izquierda: Formulario de Despacho y Pago */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Datos de Entrega */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
              <h2 className="font-extrabold text-gray-800 text-base flex items-center gap-2">
                <span>📍</span> Datos de Despacho
              </h2>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Nombre Completo</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej. Pedro Pérez"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Teléfono WhatsApp</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="0412-1234567"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Dirección Exacta de Entrega</label>
                <textarea
                  required
                  rows="2"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Sector, calle, número de casa/apto y referencia"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                ></textarea>
              </div>
            </div>

            {/* Método de Pago */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
              <h2 className="font-extrabold text-gray-800 text-base flex items-center gap-2">
                <span>💳</span> Método de Pago
              </h2>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'pagomovil', label: 'Pago Móvil', icon: '📱' },
                  { id: 'zelle', label: 'Zelle', icon: '💵' },
                  { id: 'efectivo', label: 'Efectivo', icon: '🤝' },
                ].map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setPaymentMethod(method.id)}
                    className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1 ${
                      paymentMethod === method.id
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-extrabold shadow-sm'
                        : 'border-gray-200 bg-white text-gray-600 font-bold hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-xl">{method.icon}</span>
                    <span className="text-xs">{method.label}</span>
                  </button>
                ))}
              </div>

              {/* Detalles e Instrucciones según método seleccionado */}
              <div className="bg-emerald-950 text-emerald-100 p-4 rounded-2xl text-xs space-y-2">
                {paymentMethod === 'pagomovil' && (
                  <>
                    <p className="font-bold text-white uppercase text-[10px] tracking-wider">Datos Pago Móvil:</p>
                    <p>Banco: <strong>Banesco (0134)</strong></p>
                    <p>CI/RIF: <strong>J-12345678-9</strong></p>
                    <p>Teléfono: <strong>0412-0000000</strong></p>
                    <div className="pt-2 border-t border-emerald-800/80 flex justify-between font-black text-white text-sm">
                      <span>Monto exacto a transferir:</span>
                      <span className="text-emerald-300">Bs. {totalBs.toFixed(2)}</span>
                    </div>
                  </>
                )}

                {paymentMethod === 'zelle' && (
                  <>
                    <p className="font-bold text-white uppercase text-[10px] tracking-wider">Datos Zelle:</p>
                    <p>Correo: <strong>pagos@ortifresca.com</strong></p>
                    <p>Titular: <strong>OrtiFresca LLC</strong></p>
                    <div className="pt-2 border-t border-emerald-800/80 flex justify-between font-black text-white text-sm">
                      <span>Monto exacto a transferir:</span>
                      <span className="text-emerald-300">${totalUSD.toFixed(2)} USD</span>
                    </div>
                  </>
                )}

                {paymentMethod === 'efectivo' && (
                  <>
                    <p className="font-bold text-white uppercase text-[10px] tracking-wider">Pago en Efectivo contra entrega:</p>
                    <p>Puedes pagar en Bolívares o divisas al recibir tu pedido.</p>
                    <div className="pt-2 border-t border-emerald-800/80 flex justify-between font-black text-white text-xs">
                      <span>Monto total:</span>
                      <span className="text-emerald-300">Bs. {totalBs.toFixed(2)} (${totalUSD.toFixed(2)} USD)</span>
                    </div>
                  </>
                )}
              </div>

              {paymentMethod !== 'efectivo' && (
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">
                    Número de Referencia del Pago
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.reference}
                    onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                    placeholder="Ej. 984210"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-4 rounded-2xl shadow-lg transition-all active:scale-95 text-sm flex items-center justify-center gap-2"
            >
              <span>Confirmar y Enviar a WhatsApp</span>
              <span>🚀</span>
            </button>
          </form>

          {/* Columna Derecha: Resumen Bimoneda de la Orden */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4 h-fit sticky top-6">
            <h2 className="font-extrabold text-gray-800 text-base flex items-center gap-2 border-b border-gray-100 pb-3">
              <span>📋</span> Resumen de la Orden
            </h2>

            <div className="divide-y divide-gray-100 max-h-60 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.id} className="py-2.5 flex justify-between items-center text-xs">
                  <div>
                    <p className="font-extrabold text-gray-800">{item.name}</p>
                    <p className="text-gray-400">{item.quantity} x Bs. {item.price.toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-emerald-700">Bs. {(item.price * item.quantity).toFixed(2)}</p>
                    <p className="text-[10px] text-gray-400">
                      ${((item.price * item.quantity) / EXCHANGE_RATE).toFixed(2)} USD
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Totales Bimoneda */}
            <div className="bg-gray-50 p-4 rounded-2xl space-y-2 border border-gray-100">
              <div className="flex justify-between items-center text-xs text-gray-500 font-bold">
                <span>Tasa de Cambio BCV:</span>
                <span>Bs. {EXCHANGE_RATE.toFixed(2)} / USD</span>
              </div>
              <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                <span className="font-extrabold text-gray-800 text-sm">Total a Pagar:</span>
                <div className="text-right">
                  <p className="text-xl font-black text-emerald-700 leading-tight">
                    Bs. {totalBs.toFixed(2)}
                  </p>
                  <p className="text-xs font-black text-emerald-600">
                    ${totalUSD.toFixed(2)} USD
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};