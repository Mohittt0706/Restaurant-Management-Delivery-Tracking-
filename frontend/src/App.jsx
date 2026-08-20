import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar/Navbar';
import LandingPage from './pages/LandingPage';
<<<<<<< HEAD
import MenuPage from './pages/MenuPage';
import FoodDetailsPage from './pages/FoodDetailsPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
=======
import Login from './pages/Login';
import Register from './pages/Register';
>>>>>>> dc2bd8c610aae17221d06e90a153a9df70108f13

export default function App() {
  return (
    <BrowserRouter>
<<<<<<< HEAD
      <CartProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/menu/:id" element={<FoodDetailsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </CartProvider>
=======
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/menu" element={<div className="min-h-screen bg-cult-charcoal flex items-center justify-center"><h1 className="font-display text-5xl text-cult-cream tracking-widest">MENU</h1></div>} />
        <Route path="/about" element={<div className="min-h-screen bg-cult-charcoal flex items-center justify-center"><h1 className="font-display text-5xl text-cult-cream tracking-widest">ABOUT</h1></div>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
>>>>>>> dc2bd8c610aae17221d06e90a153a9df70108f13
    </BrowserRouter>
  );
}
