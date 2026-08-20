import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  ClipboardList,
  ChefHat,
  CheckCircle,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

const sidebarLinks = [
  { label: 'Dashboard', to: '/kitchen', icon: LayoutDashboard, end: true },
  { label: 'New Orders', to: '/kitchen/new-orders', icon: ClipboardList },
  { label: 'Preparing', to: '/kitchen/preparing', icon: ChefHat },
  { label: 'Ready', to: '/kitchen/ready', icon: CheckCircle },
];

export default function KitchenLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-cult-charcoal">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-cult-espresso border-r border-cult-bronze/20 flex flex-col transform transition-transform duration-300 lg:transform-none ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-cult-bronze/20">
          <div className="flex items-center gap-2">
            <ChefHat size={20} className="text-cult-ember" />
            <span className="font-display text-xl tracking-widest text-cult-cream">
              KITCHEN
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-cult-warmgray hover:text-cult-cream"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 py-4 px-3">
          {sidebarLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 mb-1 font-body text-sm tracking-wide transition-colors duration-200 ${
                  isActive
                    ? 'bg-cult-ember/10 text-cult-ember border-l-2 border-cult-ember'
                    : 'text-cult-warmgray hover:text-cult-cream hover:bg-cult-charcoal/40'
                }`
              }
            >
              <link.icon size={18} />
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-cult-bronze/20">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full font-body text-sm tracking-wide text-cult-warmgray hover:text-red-400 transition-colors duration-200"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-cult-espresso border-b border-cult-bronze/20 flex items-center justify-between px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-cult-warmgray hover:text-cult-cream"
          >
            <Menu size={22} />
          </button>
          <div className="flex-1" />
          <span className="font-display text-xl tracking-widest text-cult-cream">KITCHEN</span>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
