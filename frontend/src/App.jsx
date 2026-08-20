import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import LandingPage from './pages/LandingPage';
import MenuPage from './pages/MenuPage';
import FoodDetailsPage from './pages/FoodDetailsPage';
import CartPage from './pages/CartPage';
import AboutPage from './pages/AboutPage';
import Login from './pages/Login';
import Register from './pages/Register';
import ManagerDashboardPage from './pages/ManagerDashboard/ManagerDashboardPage';
import DeliveryPartnerDashboardPage from './pages/DeliveryPartnerDashboard/DeliveryPartnerDashboardPage';
import { CartProvider } from './context/CartContext';
import { KitchenProvider } from './context/KitchenContext';
import KitchenLayout from './pages/kitchen/KitchenLayout';
import KitchenDashboard from './pages/kitchen/KitchenDashboard';
import KitchenNewOrders from './pages/kitchen/KitchenNewOrders';
import KitchenPreparing from './pages/kitchen/KitchenPreparing';
import KitchenReady from './pages/kitchen/KitchenReady';

function Layout() {
  const location = useLocation();
  const isDashboardRoute = 
    location.pathname.startsWith('/manager') || 
    location.pathname.startsWith('/dashboard') || 
    location.pathname.startsWith('/delivery-partner') || 
    location.pathname.startsWith('/delivery-dashboard') ||
    location.pathname.startsWith('/kitchen');

  return (
    <>
      {!isDashboardRoute && <Navbar />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/menu/:id" element={<FoodDetailsPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/manager" element={<ManagerDashboardPage />} />
        <Route path="/dashboard" element={<ManagerDashboardPage />} />
        <Route
          path="/kitchen"
          element={
            <KitchenProvider>
              <KitchenLayout />
            </KitchenProvider>
          }
        >
          <Route index element={<KitchenDashboard />} />
          <Route path="new-orders" element={<KitchenNewOrders />} />
          <Route path="preparing" element={<KitchenPreparing />} />
          <Route path="ready" element={<KitchenReady />} />
        </Route>
        <Route path="/delivery-partner" element={<DeliveryPartnerDashboardPage />} />
        <Route path="/delivery-dashboard" element={<DeliveryPartnerDashboardPage />} />
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
