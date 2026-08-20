import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import ManagerDashboardPage from './pages/ManagerDashboard/ManagerDashboardPage';

import MenuPage from './pages/MenuPage';
import FoodDetailsPage from './pages/FoodDetailsPage';
import CartPage from './pages/CartPage';
import { CartProvider } from './context/CartContext';

function Layout() {
  const location = useLocation();
  const isManagerRoute = location.pathname.startsWith('/manager') || location.pathname.startsWith('/dashboard');

  return (
    <>
      {!isManagerRoute && <Navbar />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/menu/:id" element={<FoodDetailsPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/about" element={<div className="min-h-screen bg-cult-charcoal flex items-center justify-center"><h1 className="font-display text-5xl text-cult-cream tracking-widest">ABOUT</h1></div>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/manager" element={<ManagerDashboardPage />} />
        <Route path="/dashboard" element={<ManagerDashboardPage />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Layout />
      </CartProvider>
    </BrowserRouter>
  );
}
