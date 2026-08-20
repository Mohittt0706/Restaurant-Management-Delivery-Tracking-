import { motion } from 'framer-motion';
import { ClipboardList, ChefHat, CheckCircle, AlertTriangle } from 'lucide-react';
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
  const { newOrders, preparingOrders, readyOrders, loading } = useKitchen();

  const delayedCount = preparingOrders.filter((o) => {
    if (!o.acceptedAt) return false;
    return Date.now() - o.acceptedAt > 15 * 60 * 1000;
  }).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-cult-ember border-t-transparent rounded-full animate-spin" />
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
        <motion.h1
          variants={fadeInUp}
          className="font-display text-3xl md:text-4xl tracking-widest text-cult-cream mb-8"
        >
          KITCHEN DASHBOARD
        </motion.h1>

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
