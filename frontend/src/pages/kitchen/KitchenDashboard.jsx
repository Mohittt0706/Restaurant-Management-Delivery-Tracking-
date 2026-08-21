import { ClipboardList, ChefHat, CheckCircle, AlertTriangle } from 'lucide-react';
import { useKitchen } from '../../context/KitchenContext';

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="bg-cult-espresso border border-cult-bronze p-6 rounded-sm space-y-3 hover:border-cult-ember/40 transition-colors duration-300">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase font-body tracking-widest text-cult-warmgray font-medium">
          {label}
        </span>
        {Icon && (
          <div className="p-2 rounded bg-cult-charcoal border border-cult-bronze text-cult-ember">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>
      <p className="font-display text-4xl text-cult-cream tracking-wider font-bold">
        {value}
      </p>
    </div>
  );
}

export default function KitchenDashboard() {
  const { newOrders, preparingOrders, readyOrders, loading, error } = useKitchen();

  const delayedCount = preparingOrders.filter((o) => {
    if (!o.acceptedAt) return false;
    return Date.now() - o.acceptedAt > 15 * 60 * 1000;
  }).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-cult-ember border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-mono text-cult-warmgray uppercase tracking-widest">Loading kitchen data…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center space-y-3 p-8 bg-cult-espresso border border-cult-bronze max-w-md mx-auto mt-20">
        <p className="font-heading text-lg text-cult-ember">{error}</p>
        <p className="text-xs font-body text-cult-warmgray">
          Unable to load kitchen dashboard data.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={ClipboardList}
          label="New Orders"
          value={newOrders.length}
        />
        <StatCard
          icon={ChefHat}
          label="Preparing"
          value={preparingOrders.length}
        />
        <StatCard
          icon={CheckCircle}
          label="Ready"
          value={readyOrders.length}
        />
        <StatCard
          icon={AlertTriangle}
          label="Delayed"
          value={delayedCount}
        />
      </div>
    </div>
  );
}
