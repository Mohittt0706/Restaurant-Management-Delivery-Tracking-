import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/menu" element={<div className="min-h-screen bg-cult-charcoal flex items-center justify-center"><h1 className="font-display text-5xl text-cult-cream tracking-widest">MENU</h1></div>} />
        <Route path="/about" element={<div className="min-h-screen bg-cult-charcoal flex items-center justify-center"><h1 className="font-display text-5xl text-cult-cream tracking-widest">ABOUT</h1></div>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}
