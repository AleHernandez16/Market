import React, { useState, useMemo } from 'react';
import { Navbar } from '../components/Navbar';
import { ProductCard } from '../components/ProductCard';
import { QuickBuyModal } from '../components/QuickBuyModal';
import { CartDrawer } from '../components/CartDrawer';
import { useCart } from '../context/CartContext';
import { CATEGORIES } from '../data/Products';

export const Home = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const { selectedSede } = useCart();

  // Filtrado reactivo en tiempo real por búsqueda y categoría
  const filteredCategories = useMemo(() => {
    return CATEGORIES
      .filter((cat) => activeCategory === 'all' || cat.id === activeCategory)
      .map((cat) => {
        const matchedProducts = cat.products.filter((product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
        );
        return { ...cat, products: matchedProducts };
      })
      .filter((cat) => cat.products.length > 0);
  }, [searchTerm, activeCategory]);

  return (
    <div className="min-h-screen bg-gray-50">
    

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        
        {/* Banner Promocional */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-6 md:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 max-w-lg">
            <span className="bg-orange-500 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
              Delivery Express
            </span>
            <h1 className="text-2xl md:text-4xl font-black tracking-tight leading-tight">
              Todo lo fresco en un solo lugar ({selectedSede})
            </h1>
            <p className="text-emerald-100 text-sm md:text-base">
              Frutería, hortalizas, carnicería, charcutería, chucherías y bebidas directo a tu puerta.
            </p>
          </div>
          <div className="text-7xl md:text-8xl select-none">🧺</div>
        </section>

        {/* Sección de Búsqueda Rápida y Filtros */}
        <section className="sticky top-16 z-20 bg-gray-50/95 backdrop-blur-md pt-2 pb-4 space-y-4">
          
          {/* Input de Búsqueda en tiempo real */}
          <div className="relative max-w-2xl mx-auto">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="🔍 Buscar tomate, bistec, queso, queso llanero, Coca-Cola..."
              className="w-full px-5 py-3.5 pl-12 bg-white rounded-2xl border border-gray-200 shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-800 placeholder-gray-400 font-medium transition-all"
            />
            <span className="absolute left-4 top-3.5 text-lg">🔎</span>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-3.5 text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-2 py-1 rounded-full font-bold"
              >
                ✕ Limpiar
              </button>
            )}
          </div>

          {/* Chips / Botones de Filtro por Categoría */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none justify-start md:justify-center">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all shadow-sm ${
                activeCategory === 'all'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              ✨ Todos
            </button>

            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all shadow-sm ${
                  activeCategory === cat.id
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                {cat.title}
              </button>
            ))}
          </div>
        </section>

        {/* Renderizado de Categorías o Estado "Sin Resultados" */}
        {filteredCategories.length > 0 ? (
          filteredCategories.map((category) => (
            <section key={category.id} className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg md:text-xl font-extrabold text-gray-800">{category.title}</h2>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                  {category.products.length} {category.products.length === 1 ? 'producto' : 'productos'}
                </span>
              </div>

              <div className="flex gap-4 overflow-x-auto pb-4 pt-1 scrollbar-thin">
                {category.products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onSelectProduct={(p) => setSelectedProduct(p)}
                  />
                ))}
              </div>
            </section>
          ))
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center space-y-3 border border-gray-100 shadow-sm max-w-md mx-auto my-8">
            <span className="text-5xl block">🧐</span>
            <h3 className="font-extrabold text-gray-800 text-lg">No encontramos coincidencias</h3>
            <p className="text-xs text-gray-500">
              No hay productos que coincidan con "<span className="font-bold text-gray-700">{searchTerm}</span>".
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setActiveCategory('all');
              }}
              className="bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm hover:bg-emerald-700 transition-colors"
            >
              Ver todo el catálogo
            </button>
          </div>
        )}

      </main>

      <QuickBuyModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
};