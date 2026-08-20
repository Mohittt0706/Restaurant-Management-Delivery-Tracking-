import React from 'react';
import StatCard from '../../components/ManagerDashboard/StatCard';
import { 
  ShoppingBag, 
  IndianRupee, 
  Clock, 
  Flame, 
  CheckCircle2, 
  Bike 
} from 'lucide-react';

export default function DashboardHome({ orders = [], stats = null }) {
  const fromOrders = {
    totalOrders: orders.length,
    todaysRevenue: orders.reduce((sum, o) => sum + (o.amount || 0), 0),
    pendingOrders: orders.filter((o) => o.orderStatus === 'CONFIRMED' || o.orderStatus === 'PLACED' || o.orderStatus === 'Pending').length,
    preparingOrders: orders.filter((o) => o.orderStatus === 'PREPARING').length,
    deliveredOrders: orders.filter((o) => o.orderStatus === 'DELIVERED').length,
    activeDeliveries: orders.filter((o) => o.assignedPartnerId || o.orderStatus === 'OUT_FOR_DELIVERY' || o.orderStatus === 'ASSIGNED').length,
  };

  const s = stats || fromOrders;

  return (
    <div className="space-y-6">
      {/* Overview Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          icon={ShoppingBag}
          label="Total Orders"
          value={s.totalOrders}
        />
        <StatCard
          icon={IndianRupee}
          label="Today's Revenue"
          value={`₹${s.todaysRevenue}`}
        />
        <StatCard
          icon={Clock}
          label="Pending Orders"
          value={s.pendingOrders}
        />
        <StatCard
          icon={Flame}
          label="Preparing Orders"
          value={s.preparingOrders}
        />
        <StatCard
          icon={CheckCircle2}
          label="Delivered Orders"
          value={s.deliveredOrders}
        />
        <StatCard
          icon={Bike}
          label="Active Deliveries"
          value={s.activeDeliveries}
        />
      </div>

      {/* Empty State Banner */}
      {s.totalOrders === 0 && (
        <div className="p-8 bg-cult-espresso border border-cult-bronze text-center space-y-2">
          <p className="text-xs font-mono text-cult-ember uppercase tracking-widest">
            System Initialized — Ready for Operation
          </p>
          <p className="text-sm font-body text-cult-warmgray">
            Dashboard metrics start at 0 and update in real-time as orders move through the system.
          </p>
        </div>
      )}
    </div>
  );
}
