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

export default function DashboardHome({ orders = [] }) {
  // Compute dynamic stats based only on real local state orders array
  const totalOrders = orders.length;
  const todaysRevenue = orders.reduce((sum, o) => sum + (o.amount || 0), 0);
  const pendingOrders = orders.filter((o) => o.orderStatus === 'Placed' || o.orderStatus === 'Pending').length;
  const preparingOrders = orders.filter((o) => o.orderStatus === 'Preparing').length;
  const deliveredOrders = orders.filter((o) => o.orderStatus === 'Delivered').length;
  const activeDeliveries = orders.filter((o) => o.orderStatus === 'Out for Delivery' || o.orderStatus === 'Assigned').length;

  return (
    <div className="space-y-6">
      {/* Overview Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          icon={ShoppingBag}
          label="Total Orders"
          value={totalOrders}
        />
        <StatCard
          icon={IndianRupee}
          label="Today's Revenue"
          value={`₹${todaysRevenue}`}
        />
        <StatCard
          icon={Clock}
          label="Pending Orders"
          value={pendingOrders}
        />
        <StatCard
          icon={Flame}
          label="Preparing Orders"
          value={preparingOrders}
        />
        <StatCard
          icon={CheckCircle2}
          label="Delivered Orders"
          value={deliveredOrders}
        />
        <StatCard
          icon={Bike}
          label="Active Deliveries"
          value={activeDeliveries}
        />
      </div>

      {/* Empty State Banner */}
      {totalOrders === 0 && (
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
