import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { CartDrawer } from './components/CartDrawer';
import { Home } from './pages/Home';
import { Checkout } from './pages/Checkout';
import { AdminDashboard } from './pages/AdminDashboard';

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        {/* Navbar global */}
        <Navbar />
        
        {/* Carrito lateral visible en toda la app */}
        <CartDrawer />

        {/* Rutas de la aplicación */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}