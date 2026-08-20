import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  MapPin, 
  Truck 
} from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'assigned', label: 'Assigned Orders', icon: Package },
  { id: 'route', label: 'Route & ETA', icon: MapPin },
  { id: 'status', label: 'Delivery Status', icon: Truck },
];

export default function Sidebar({ activeSection, onSelectSection }) {
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

      {/* Footer info */}
      <div className="p-4 border-t border-cult-bronze text-center">
        <p className="text-[10px] font-mono text-cult-warmgray/60 uppercase tracking-widest">
          CULT Delivery Partner v1.0
        </p>
      </div>
    </aside>
  );
}
