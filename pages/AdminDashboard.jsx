import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// --- DATOS INICIALES ---
const INITIAL_ORDERS = [
  {
    id: 'ORD-1001', customer: 'Carlos Mendoza', phone: '0414-1234567',
    address: 'Urb. Corinsa, Calle 5, Casa #12', sede: 'Cagua', total: 185.0,
    paymentMethod: 'Pago Móvil', paymentRef: '8492', status: 'Pendiente',
    date: '2026-09-09 08:30 AM',
    items: [{ name: 'Tomate Perita', qty: 2, price: 40.0 }, { name: 'Carne Molida', qty: 1, price: 105.0 }],
  },
  {
    id: 'ORD-1002', customer: 'Ana Gómez', phone: '0424-9876543',
    address: 'Av. Las Delicias, Res. El Bosque', sede: 'Maracay', total: 120.0,
    paymentMethod: 'Zelle', paymentRef: 'ZEL-9921', status: 'En Preparación',
    date: '2026-09-09 09:15 AM',
    items: [{ name: 'Harina PAN', qty: 2, price: 35.0 }, { name: 'Queso Llanero', qty: 1, price: 110.0 }],
  },
];

const INITIAL_INVENTORY = [
  { id: 1, name: 'Tomate Perita', category: 'Frutas y Hortalizas', price: 40.0, stockCagua: 45, stockMaracay: 30, stockTurmero: 20 },
  { id: 2, name: 'Cebolla Blanca', category: 'Frutas y Hortalizas', price: 30.0, stockCagua: 50, stockMaracay: 40, stockTurmero: 35 },
];

const INITIAL_PAYMENTS = [
  { id: 1, type: 'Pago Móvil', details: 'Banesco / 0414-1234567 / V-12345678' },
  { id: 2, type: 'Zelle', details: 'pagos@ortifresca.com' }
];

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'inventory' | 'control' | 'payments'
  
  // Estados Globales
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [controlOrders, setControlOrders] = useState([]); // Archivo de facturas entregadas
  const [inventory, setInventory] = useState(INITIAL_INVENTORY);
  const [paymentMethods, setPaymentMethods] = useState(INITIAL_PAYMENTS);
  
  const [selectedSedeFilter, setSelectedSedeFilter] = useState('Todas');
  const [expandedProductId, setExpandedProductId] = useState(null); // Controla el acordeón del inventario

  // --------------------------------------------------------
  // LÓGICA DE PEDIDOS Y CONTROL (180 DÍAS)
  // --------------------------------------------------------
  
  // Limpieza automática de facturas mayores a 180 días
  useEffect(() => {
    const msIn180Days = 180 * 24 * 60 * 60 * 1000;
    const now = new Date().getTime();
    
    setControlOrders(prev => prev.filter(order => {
      const orderDate = new Date(order.deliveredAt).getTime();
      return (now - orderDate) <= msIn180Days;
    }));
  }, []);

  const handleStatusChange = (orderId, newStatus) => {
    if (newStatus === 'Entregado') {
      // Mover a la sección de control
      const orderToMove = orders.find((ord) => ord.id === orderId);
      const archivedOrder = { ...orderToMove, status: 'Entregado', deliveredAt: new Date().toISOString() };
      
      setControlOrders((prev) => [archivedOrder, ...prev]);
      setOrders((prev) => prev.filter((ord) => ord.id !== orderId));
    } else {
      // Actualizar estado normal
      setOrders((prev) => prev.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord)));
    }
  };

  const filteredOrders = orders.filter((ord) => selectedSedeFilter === 'Todas' ? true : ord.sede === selectedSedeFilter);

  // --------------------------------------------------------
  // LÓGICA DE INVENTARIO
  // --------------------------------------------------------
  const handleAddProduct = () => {
    const newProduct = {
      id: Date.now(),
      name: 'Nuevo Producto',
      category: 'General',
      price: 0,
      stockCagua: 0, stockMaracay: 0, stockTurmero: 0
    };
    setInventory([newProduct, ...inventory]);
    setExpandedProductId(newProduct.id); // Lo abre automáticamente para editar
  };

  const handleUpdateProduct = (id, field, value) => {
    setInventory((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: field.includes('stock') || field === 'price' ? Number(value) : value } : item))
    );
  };

  const handleDeleteProduct = (id) => {
    if(window.confirm('¿Seguro que deseas eliminar este producto?')) {
      setInventory((prev) => prev.filter((item) => item.id !== id));
    }
  };

  // --------------------------------------------------------
  // LÓGICA DE MÉTODOS DE PAGO
  // --------------------------------------------------------
  const handleAddPayment = () => {
    const newPayment = { id: Date.now(), type: 'Nuevo Método', details: 'Detalles de la cuenta...' };
    setPaymentMethods([...paymentMethods, newPayment]);
  };

  const handleUpdatePayment = (id, field, value) => {
    setPaymentMethods(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const handleDeletePayment = (id) => {
    setPaymentMethods(prev => prev.filter(p => p.id !== id));
  };

  // --------------------------------------------------------
  // RENDERIZADO DE PESTAÑAS (TABS)
  // --------------------------------------------------------
  const renderTabs = () => (
    <div className="flex flex-wrap gap-2 mb-6 bg-white p-3 rounded-2xl shadow-sm border border-gray-200">
      <button onClick={() => setActiveTab('orders')} className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${activeTab === 'orders' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
        📦 Pedidos Activos ({orders.length})
      </button>
      <button onClick={() => setActiveTab('control')} className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${activeTab === 'control' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
        🗄️ Control y Archivo ({controlOrders.length})
      </button>
      <button onClick={() => setActiveTab('inventory')} className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${activeTab === 'inventory' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
        🥬 Inventario
      </button>
      <button onClick={() => setActiveTab('payments')} className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${activeTab === 'payments' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
        💳 Métodos de Pago
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-emerald-900 text-white px-6 py-4 flex flex-col sm:flex-row items-center justify-between shadow-md gap-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">⚙️</span>
          <div>
            <h1 className="font-black text-lg leading-tight">OrtiFresca - Panel Admin</h1>
            <p className="text-xs text-emerald-300">Gestión de Operaciones, Inventario y Pagos</p>
          </div>
        </div>
        <button onClick={() => navigate('/')} className="bg-emerald-800 hover:bg-emerald-700 text-xs font-bold px-4 py-2 rounded-xl transition-all">
          Volver a la Tienda 🏪
        </button>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto w-full p-6 flex-1">
        
        {renderTabs()}

        {/* ==========================================
            PESTAÑA 1: PEDIDOS ACTIVOS
        ========================================== */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="flex justify-end items-center gap-2 text-xs font-bold text-gray-600 mb-4">
              <span>Filtrar Sede:</span>
              <select value={selectedSedeFilter} onChange={(e) => setSelectedSedeFilter(e.target.value)} className="bg-white border border-gray-300 rounded-xl px-3 py-1.5 focus:outline-none">
                <option value="Todas">Todas las Sedes</option>
                <option value="Cagua">Cagua</option>
                <option value="Maracay">Maracay</option>
                <option value="Turmero">Turmero</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOrders.length === 0 ? (
                <div className="col-span-full bg-white p-12 text-center rounded-3xl text-gray-400">No hay pedidos activos.</div>
              ) : (
                filteredOrders.map((ord) => (
                  <div key={ord.id} className="bg-white rounded-3xl border border-emerald-100 p-5 shadow-sm flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start border-b border-gray-100 pb-3">
                        <div>
                          <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">{ord.id}</span>
                          <h3 className="font-extrabold text-gray-800 text-base mt-2">{ord.customer}</h3>
                          <p className="text-xs text-gray-400">{ord.phone}</p>
                        </div>
                        <span className="text-xs font-bold bg-orange-100 text-orange-800 px-2.5 py-1 rounded-full">📍 {ord.sede}</span>
                      </div>
                      <div className="text-xs text-gray-600 space-y-1">
                        <p><strong>Dirección:</strong> {ord.address}</p>
                        <p><strong>Pago:</strong> {ord.paymentMethod} (Ref: {ord.paymentRef})</p>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-gray-100 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold">Total:</span>
                        <span className="text-lg font-black text-emerald-700">Bs. {ord.total.toFixed(2)}</span>
                      </div>
                      <select
                        value={ord.status}
                        onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                        className={`w-full text-xs font-black py-2 px-3 rounded-xl border focus:outline-none cursor-pointer ${
                          ord.status === 'Pendiente' ? 'bg-yellow-50 text-yellow-800' : 'bg-blue-50 text-blue-800'
                        }`}
                      >
                        <option value="Pendiente">⏳ Pendiente</option>
                        <option value="En Preparación">📦 En Preparación</option>
                        <option value="Entregado">✅ Marcar como Entregado</option>
                      </select>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ==========================================
            PESTAÑA 2: CONTROL Y ARCHIVO (180 DÍAS)
        ========================================== */}
        {activeTab === 'control' && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-100 text-blue-800 text-xs p-3 rounded-xl font-bold flex gap-2 items-center">
              <span>ℹ️</span> Aquí se archivan los pedidos entregados. Se eliminarán automáticamente después de 180 días.
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {controlOrders.length === 0 ? (
                <div className="col-span-full bg-white p-12 text-center rounded-3xl text-gray-400">No hay facturas archivadas.</div>
              ) : (
                controlOrders.map((ord) => (
                  <div key={ord.id} className="bg-gray-50 opacity-80 rounded-3xl border border-gray-200 p-5 shadow-sm">
                    <div className="flex justify-between items-start border-b border-gray-200 pb-3 mb-3">
                      <div>
                        <span className="text-xs font-black text-gray-600 bg-gray-200 px-2.5 py-1 rounded-full">{ord.id}</span>
                        <h3 className="font-extrabold text-gray-700 text-base mt-2">{ord.customer}</h3>
                      </div>
                      <span className="text-[10px] font-bold text-gray-500 bg-white px-2 py-1 rounded-lg border">✅ Entregado</span>
                    </div>
                    <div className="text-xs text-gray-500 space-y-1 mb-3">
                      <p><strong>Sede:</strong> {ord.sede}</p>
                      <p><strong>Entregado el:</strong> {new Date(ord.deliveredAt).toLocaleDateString()}</p>
                      <p><strong>Monto:</strong> Bs. {ord.total.toFixed(2)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ==========================================
            PESTAÑA 3: INVENTARIO DESPLEGABLE
        ========================================== */}
        {activeTab === 'inventory' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
              <h2 className="font-black text-gray-800">Catálogo de Productos</h2>
              <button 
                onClick={handleAddProduct}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md transition-all"
              >
                + Agregar Producto
              </button>
            </div>

            <div className="space-y-3">
              {inventory.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden transition-all">
                  {/* Fila Resumen (Clic para desplegar) */}
                  <div 
                    onClick={() => setExpandedProductId(expandedProductId === item.id ? null : item.id)}
                    className="flex flex-wrap justify-between items-center p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-xl">{expandedProductId === item.id ? '📂' : '📁'}</span>
                      <div>
                        <h3 className="font-black text-gray-800">{item.name}</h3>
                        <p className="text-xs text-gray-500">{item.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <span className="font-black text-emerald-700">Bs. {item.price.toFixed(2)}</span>
                      <span className="text-xs font-bold text-gray-400 hidden sm:block">
                        Total Stock: {item.stockCagua + item.stockMaracay + item.stockTurmero}
                      </span>
                    </div>
                  </div>

                  {/* Detalle Desplegable (Formulario) */}
                  {expandedProductId === item.id && (
                    <div className="p-4 bg-gray-50 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      <div className="space-y-3">
                        <label className="block text-xs font-bold text-gray-600">Nombre del Producto</label>
                        <input type="text" value={item.name} onChange={(e) => handleUpdateProduct(item.id, 'name', e.target.value)} className="w-full text-sm p-2 rounded-lg border border-gray-300 focus:outline-emerald-500" />
                        
                        <label className="block text-xs font-bold text-gray-600 mt-2">Categoría</label>
                        <input type="text" value={item.category} onChange={(e) => handleUpdateProduct(item.id, 'category', e.target.value)} className="w-full text-sm p-2 rounded-lg border border-gray-300 focus:outline-emerald-500" />
                        
                        <label className="block text-xs font-bold text-gray-600 mt-2">Precio Base (Bs.)</label>
                        <input type="number" value={item.price} onChange={(e) => handleUpdateProduct(item.id, 'price', e.target.value)} className="w-full text-sm p-2 rounded-lg border border-gray-300 focus:outline-emerald-500" />
                      </div>

                      <div className="space-y-3 bg-white p-4 rounded-xl border border-gray-200">
                        <h4 className="text-xs font-black text-gray-800 mb-2">📦 Stock por Sedes</h4>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600 font-bold">Cagua:</span>
                          <input type="number" value={item.stockCagua} onChange={(e) => handleUpdateProduct(item.id, 'stockCagua', e.target.value)} className="w-20 text-center p-1 border rounded-lg" />
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600 font-bold">Maracay:</span>
                          <input type="number" value={item.stockMaracay} onChange={(e) => handleUpdateProduct(item.id, 'stockMaracay', e.target.value)} className="w-20 text-center p-1 border rounded-lg" />
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600 font-bold">Turmero:</span>
                          <input type="number" value={item.stockTurmero} onChange={(e) => handleUpdateProduct(item.id, 'stockTurmero', e.target.value)} className="w-20 text-center p-1 border rounded-lg" />
                        </div>

                        <div className="pt-4 mt-4 border-t border-gray-100 text-right">
                          <button onClick={() => handleDeleteProduct(item.id)} className="text-xs font-bold text-red-500 hover:text-red-700 bg-red-50 px-3 py-1.5 rounded-lg transition-colors">
                            🗑️ Eliminar Producto
                          </button>
                        </div>
                      </div>

                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==========================================
            PESTAÑA 4: MÉTODOS DE PAGO
        ========================================== */}
        {activeTab === 'payments' && (
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-black text-gray-800">Cuentas y Métodos de Pago</h2>
              <button 
                onClick={handleAddPayment}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md transition-all"
              >
                + Nuevo Método
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paymentMethods.map((payment) => (
                <div key={payment.id} className="bg-gray-50 border border-gray-200 rounded-2xl p-4 space-y-3 relative group">
                  <button 
                    onClick={() => handleDeletePayment(payment.id)}
                    className="absolute top-3 right-3 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Eliminar método"
                  >
                    ✕
                  </button>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-gray-400 mb-1">Nombre / Tipo</label>
                    <input 
                      type="text" 
                      value={payment.type} 
                      onChange={(e) => handleUpdatePayment(payment.id, 'type', e.target.value)} 
                      className="w-full text-sm font-bold text-gray-800 bg-transparent border-b border-gray-300 focus:border-emerald-500 focus:outline-none py-1" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-gray-400 mb-1">Detalles (Banco, Teléfono, CI, Email)</label>
                    <textarea 
                      rows="2"
                      value={payment.details} 
                      onChange={(e) => handleUpdatePayment(payment.id, 'details', e.target.value)} 
                      className="w-full text-sm text-gray-600 bg-white border border-gray-200 rounded-lg p-2 focus:border-emerald-500 focus:outline-none resize-none" 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};