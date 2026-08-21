import { useState } from 'react';
import { NavLink, Outlet, useNavigate, Navigate, useLocation } from 'react-router-dom';
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

const sectionTitles = {
  '/kitchen': 'Dashboard Overview',
  '/kitchen/new-orders': 'New Orders',
  '/kitchen/preparing': 'Preparing',
  '/kitchen/ready': 'Ready',
};

const sidebarLinks = [
  { label: 'Dashboard', to: '/kitchen', icon: LayoutDashboard, end: true },
  { label: 'New Orders', to: '/kitchen/new-orders', icon: ClipboardList },
  { label: 'Preparing', to: '/kitchen/preparing', icon: ChefHat },
  { label: 'Ready', to: '/kitchen/ready', icon: CheckCircle },
];

export default function KitchenLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const topbarTitle = sectionTitles[location.pathname] || 'Kitchen Dashboard';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'KITCHEN') {
    return (
      <div className="min-h-screen bg-cult-charcoal text-cult-cream flex items-center justify-center font-body">
        <div className="text-center space-y-3 p-8 bg-cult-espresso border border-cult-bronze">
          <p className="font-heading text-lg text-cult-ember">Access Restricted</p>
          <p className="text-xs text-cult-warmgray">
            This area is only available to KITCHEN accounts. Sign in with a kitchen account to continue.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cult-charcoal text-cult-cream flex font-body">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-cult-espresso border-r border-cult-bronze min-h-screen flex flex-col transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="h-20 flex items-center px-6 border-b border-cult-bronze">
          <span className="font-display text-3xl tracking-widest text-cult-cream">
            CULT
          </span>
          <span className="ml-2 px-2 py-0.5 text-[10px] uppercase font-mono font-bold bg-cult-ember/20 text-cult-ember border border-cult-ember/30 rounded">
            Kitchen
          </span>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto">
          {sidebarLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-4 py-3 text-xs uppercase tracking-widest font-body font-medium rounded transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-cult-ember text-cult-cream shadow-lg shadow-cult-ember/20'
                    : 'text-cult-warmgray hover:text-cult-cream hover:bg-cult-charcoal/50'
                }`
              }
            >
              <link.icon className="w-4 h-4 shrink-0" />
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-cult-bronze space-y-2">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full font-body text-sm tracking-wide text-cult-warmgray hover:text-red-400 transition-colors duration-200 cursor-pointer"
          >
            <LogOut size={18} />
            Logout
          </button>
          <p className="text-[10px] font-mono text-cult-warmgray/60 uppercase tracking-widest text-center">
            CULT Kitchen v1.0
          </p>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 ml-64">
        <header className="h-20 bg-cult-espresso border-b border-cult-bronze px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-cult-warmgray hover:text-cult-cream"
            >
              <Menu size={22} />
            </button>
            <div>
              <h1 className="font-heading text-2xl text-cult-cream tracking-wide">
                {topbarTitle}
              </h1>
              <p className="text-xs font-body text-cult-warmgray">
                Kitchen Control Panel
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-body font-medium text-cult-cream uppercase tracking-wider">
                Restaurant Kitchen
              </p>
              <p className="text-[10px] font-mono text-cult-warmgray">
                CULT Kitchen
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-cult-charcoal border border-cult-bronze flex items-center justify-center text-cult-ember shadow-md">
              <ChefHat className="w-5 h-5" />
            </div>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
