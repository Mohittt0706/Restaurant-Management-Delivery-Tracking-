import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, RefreshCw } from 'lucide-react';
import { useKitchen } from '../../context/KitchenContext';
import { fadeInUp, staggerContainer } from '../../animations/variants';

function formatDuration(ms) {
  if (!ms || ms <= 0) return '0 sec';
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes === 0) return `${seconds} sec`;
  if (seconds === 0) return `${minutes} min`;
  return `${minutes} min ${seconds} sec`;
}

function ReadyOrderCard({ order }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="bg-cult-espresso border border-green-500/20 p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-lg tracking-wider text-cult-cream">
          {order.displayNumber}
        </h3>
        <span className="flex items-center gap-1 font-body text-xs tracking-widest uppercase px-3 py-1 bg-green-500/10 text-green-500 border border-green-500/30">
          <CheckCircle size={12} />
          READY
        </span>
      </div>

      <div className="space-y-2 mb-4">
        {order.items.map((item, i) => (
          <p key={i} className="font-body text-sm text-cult-warmgray">
            {item.name} <span className="text-cult-cream">× {item.quantity}</span>
          </p>
        ))}
      </div>

      {order.preparationTime && (
        <p className="font-body text-sm text-cult-warmgray">
          Preparation Time:{' '}
          <span className="text-cult-cream">
            {formatDuration(order.preparationTime)}
          </span>
        </p>
      )}
    </motion.div>
  );
}

export default function KitchenReady() {
  const { readyOrders, loading, error, refreshOrders } = useKitchen();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-cult-ember border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-body text-xs uppercase tracking-widest text-cult-warmgray">Loading ready orders...</p>
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
      <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
        <motion.h1
          variants={fadeInUp}
          className="font-display text-3xl md:text-4xl tracking-widest text-cult-cream mb-8"
        >
          READY
        </motion.h1>

        {readyOrders.length === 0 ? (
          <motion.div
            variants={fadeInUp}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <CheckCircle size={48} className="text-cult-bronze mb-4" />
            <p className="font-heading text-lg text-cult-cream mb-1">
              No ready orders
            </p>
            <p className="font-body text-sm text-cult-warmgray">
              Orders marked as ready will appear here.
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <AnimatePresence>
              {readyOrders.map((order) => (
                <ReadyOrderCard key={order.id} order={order} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </div>
  );
}
