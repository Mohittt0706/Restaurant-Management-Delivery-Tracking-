import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  MapPin, 
  Truck,
  LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'assigned', label: 'Assigned Orders', icon: Package },
  { id: 'route', label: 'Route & ETA', icon: MapPin },
  { id: 'status', label: 'Delivery Status', icon: Truck },
];

export default function Sidebar({ activeSection, onSelectSection }) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className="w-64 bg-cult-espresso border-r border-cult-bronze min-h-screen flex flex-col fixed left-0 top-0 bottom-0 z-40">
      {/* Brand Logo */}
      <div className="h-20 flex items-center px-6 border-b border-cult-bronze">
        <span className="font-display text-3xl tracking-widest text-cult-cream">
          CULT
        </span>
        <span className="ml-2 px-2 py-0.5 text-[10px] uppercase font-mono font-bold bg-cult-ember/20 text-cult-ember border border-cult-ember/30 rounded">
          Partner
        </span>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectSection(item.id)}
              className={`w-full flex items-center gap-3.5 px-4 py-3 text-xs uppercase tracking-widest font-body font-medium rounded transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-cult-ember text-cult-cream shadow-lg shadow-cult-ember/20'
                  : 'text-cult-warmgray hover:text-cult-cream hover:bg-cult-charcoal/50'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-cult-cream' : 'text-cult-warmgray'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom Sidebar Footer with Logout */}
      <div className="p-4 border-t border-cult-bronze space-y-3">
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
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Logout</span>
        </button>
        <p className="text-[10px] font-mono text-cult-warmgray/60 uppercase tracking-widest text-center">
          CULT Delivery Partner v1.0
        </p>
      </div>
    </aside>
  );
}
