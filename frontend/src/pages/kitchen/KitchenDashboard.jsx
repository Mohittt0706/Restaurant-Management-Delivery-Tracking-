import { motion } from 'framer-motion';
import { ClipboardList, ChefHat, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { useKitchen } from '../../context/KitchenContext';
import { fadeInUp, staggerContainer } from '../../animations/variants';

function StatCard({ icon: Icon, label, count, color }) {
  return (
    <motion.div
      variants={fadeInUp}
      className="bg-cult-espresso border border-cult-bronze/20 p-6 flex flex-col items-center text-center"
    >
      <div
        className={`w-12 h-12 flex items-center justify-center mb-4 ${color}`}
      >
        <Icon size={28} />
      </div>
      <p className="font-display text-3xl tracking-wider text-cult-cream mb-1">
        {count}
      </p>
      <p className="font-body text-xs tracking-widest uppercase text-cult-warmgray">
        {label}
      </p>
    </motion.div>
  );
}

export default function KitchenDashboard() {
  const { newOrders, preparingOrders, readyOrders, loading, error, refreshOrders } = useKitchen();

  const delayedCount = preparingOrders.filter((o) => {
    if (!o.acceptedAt) return false;
    return Date.now() - o.acceptedAt > 15 * 60 * 1000;
  }).length;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-cult-ember border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-body text-xs uppercase tracking-widest text-cult-warmgray">Loading kitchen dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="font-heading text-lg text-cult-cream mb-4">{error}</p>
        <button
          onClick={refreshOrders}
          className="inline-flex items-center gap-2 font-body text-xs tracking-widest uppercase bg-cult-ember px-6 py-3 text-cult-cream hover:bg-cult-deep-red transition-colors"
        >
          <RefreshCw size={14} />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <div className="flex items-center justify-between mb-8">
          <motion.h1
            variants={fadeInUp}
            className="font-display text-3xl md:text-4xl tracking-widest text-cult-cream"
          >
            KITCHEN DASHBOARD
          </motion.h1>
          <button
            onClick={refreshOrders}
            className="inline-flex items-center gap-2 font-body text-xs tracking-widest uppercase border border-cult-bronze/40 px-4 py-2 text-cult-cream hover:bg-cult-bronze/20 transition-colors"
            title="Refresh Orders"
          >
            <RefreshCw size={14} />
            Refresh
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={ClipboardList}
            label="New Orders"
            count={newOrders.length}
            color="text-cult-gold"
          />
          <StatCard
            icon={ChefHat}
            label="Preparing"
            count={preparingOrders.length}
            color="text-cult-ember"
          />
          <StatCard
            icon={CheckCircle}
            label="Ready"
            count={readyOrders.length}
            color="text-green-500"
          />
          <StatCard
            icon={AlertTriangle}
            label="Delayed"
            count={delayedCount}
            color="text-yellow-500"
          />
        </div>
      </motion.div>
    </div>
  );
}
