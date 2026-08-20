import React from 'react';
import StatCard from '../../components/DeliveryPartnerDashboard/StatCard';
import { Package, Bike, Truck, CheckCircle2 } from 'lucide-react';

export default function DashboardHome({ stats }) {
  const assignedCount = stats?.assignedOrders ?? 0;
  const activeCount = stats?.activeDeliveries ?? 0;
  const outForDeliveryCount = stats?.outForDelivery ?? 0;
  const deliveredCount = stats?.deliveredOrders ?? 0;

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
      {assignedCount === 0 && (
        <div className="p-8 bg-cult-espresso border border-cult-bronze text-center space-y-4">
          <p className="text-xs font-mono text-cult-ember uppercase tracking-widest">
            Partner Console Ready
          </p>
          <p className="text-sm font-body text-cult-warmgray">
            Your assigned orders and active dispatches will display here in real-time.
          </p>
        </div>
      )}
    </div>
  );
}