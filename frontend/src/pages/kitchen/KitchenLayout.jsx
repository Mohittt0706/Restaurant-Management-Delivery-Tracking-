import { useState, useEffect } from 'react';
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
import { useAuth } from '../../context/AuthContext';

const sidebarLinks = [
  { label: 'Dashboard', to: '/kitchen', icon: LayoutDashboard, end: true },
  { label: 'New Orders', to: '/kitchen/new-orders', icon: ClipboardList },
  { label: 'Preparing', to: '/kitchen/preparing', icon: ChefHat },
  { label: 'Ready', to: '/kitchen/ready', icon: CheckCircle },
];

function LiveClock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const date = now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const time = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <div className="text-right">
      <p className="font-body text-sm text-cult-cream">Kitchen Staff</p>
      <p className="font-body text-xs text-cult-ember">Kitchen</p>
      <p className="font-body text-xs text-cult-warmgray mt-1">{date}</p>
      <p className="font-body text-xs text-cult-warmgray">{time}</p>
    </div>
  );
}

export default function KitchenLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
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

        {/* Logout at bottom of sidebar */}
        <div className="p-4 border-t border-cult-bronze/20 space-y-3">
          {user && (
            <div className="px-2 text-xs font-body text-cult-warmgray truncate">
              <span className="block text-[10px] uppercase tracking-wider text-cult-warmgray/60">Logged in as</span>
              <span className="font-semibold text-cult-cream truncate">{user.name || user.email}</span>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 text-xs uppercase tracking-widest font-body font-semibold rounded border border-red-500/30 text-red-400 bg-red-500/10 hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-300 transition-all duration-200 cursor-pointer shadow-sm"
          >
            <LogOut size={16} />
            <span>Logout</span>
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
          <LiveClock />
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
