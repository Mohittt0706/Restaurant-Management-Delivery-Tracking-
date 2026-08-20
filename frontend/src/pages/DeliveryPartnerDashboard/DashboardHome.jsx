import React from 'react';
import StatCard from '../../components/DeliveryPartnerDashboard/StatCard';
import { Package, Bike, Truck, CheckCircle2, Plus } from 'lucide-react';

export default function DashboardHome({ orders = [], onAddTestOrder }) {
  const assignedCount = orders.filter((o) => o.status === 'Assigned').length;
  const activeCount = orders.filter((o) => o.status !== 'Assigned' && o.status !== 'Delivered').length;
  const outForDeliveryCount = orders.filter((o) => o.status === 'Out for Delivery').length;
  const deliveredCount = orders.filter((o) => o.status === 'Delivered').length;

  return (
    <div className="space-y-6">
      {/* 4 Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Package}
          label="Assigned Orders"
          value={assignedCount}
        />
        <StatCard
          icon={Bike}
          label="Active Deliveries"
          value={activeCount}
        />
        <StatCard
          icon={Truck}
          label="Out for Delivery"
          value={outForDeliveryCount}
        />
        <StatCard
          icon={CheckCircle2}
          label="Delivered Orders"
          value={deliveredCount}
        />
      </div>

      {/* Empty State Banner */}
      {orders.length === 0 && (
        <div className="p-8 bg-cult-espresso border border-cult-bronze text-center space-y-4">
          <p className="text-xs font-mono text-cult-ember uppercase tracking-widest">
            Partner Console Ready
          </p>
          <p className="text-sm font-body text-cult-warmgray">
            Your assigned orders and active dispatches will display here in real-time.
          </p>
          <div>
            <button
              onClick={onAddTestOrder}
              className="px-4 py-2 bg-cult-ember/20 border border-cult-ember text-cult-cream text-xs uppercase font-body tracking-wider hover:bg-cult-ember transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Simulate Incoming Assigned Order</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
