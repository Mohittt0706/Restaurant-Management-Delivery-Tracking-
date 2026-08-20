import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChefHat, Loader2, AlertTriangle } from 'lucide-react';
import { useKitchen } from '../../context/KitchenContext';
import { fadeInUp, staggerContainer } from '../../animations/variants';

function PreparationTimer({ acceptedAt }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const start = acceptedAt;
    const update = () => setElapsed(Date.now() - start);
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [acceptedAt]);

  const totalSeconds = Math.floor(elapsed / 1000);
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');

  return (
    <span className="font-body text-lg text-cult-cream tabular-nums">
      {minutes}:{seconds}
    </span>
  );
}

function PreparingOrderCard({ order }) {
  const { markReady } = useKitchen();
  const [marking, setMarking] = useState(false);
  const isDelayed = order.acceptedAt && Date.now() - order.acceptedAt > 15 * 60 * 1000;

  const handleMarkReady = () => {
    setMarking(true);
    setTimeout(() => {
      markReady(order.id);
      setMarking(false);
    }, 800);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="bg-cult-espresso border border-cult-bronze/20 p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-lg tracking-wider text-cult-cream">
          #{order.id}
        </h3>
        <div className="flex items-center gap-2">
          {isDelayed && (
            <span className="flex items-center gap-1 font-body text-xs tracking-widest uppercase px-2 py-1 bg-yellow-500/10 text-yellow-500 border border-yellow-500/30">
              <AlertTriangle size={12} />
              Delayed
            </span>
          )}
          <span className="font-body text-xs tracking-widest uppercase px-3 py-1 bg-cult-ember/10 text-cult-ember border border-cult-ember/30">
            PREPARING
          </span>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        {order.items.map((item, i) => (
          <p key={i} className="font-body text-sm text-cult-warmgray">
            {item.name} <span className="text-cult-cream">× {item.quantity}</span>
          </p>
        ))}
      </div>

      {order.specialRequirement && (
        <div className="mb-4">
          <p className="font-body text-xs text-cult-warmgray">Special Requirement:</p>
          <p className="font-body text-sm text-cult-cream italic">{order.specialRequirement}</p>
        </div>
      )}

      <div className="mb-4">
        <p className="font-body text-xs text-cult-warmgray mb-1">Preparation Time</p>
        <PreparationTimer acceptedAt={order.acceptedAt} />
      </div>

      <button
        onClick={handleMarkReady}
        disabled={marking}
        className="w-full font-body text-sm tracking-widest uppercase text-cult-cream bg-green-700 py-3 hover:bg-green-800 transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {marking ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Marking Ready...
          </>
        ) : (
          'Mark as Ready'
        )}
      </button>
    </motion.div>
  );
}

export default function KitchenPreparing() {
  const { preparingOrders, loading } = useKitchen();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-cult-ember border-t-transparent rounded-full animate-spin" />
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
          PREPARING
        </motion.h1>

        {preparingOrders.length === 0 ? (
          <motion.div
            variants={fadeInUp}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <ChefHat size={48} className="text-cult-bronze mb-4" />
            <p className="font-heading text-lg text-cult-cream mb-1">
              No orders currently being prepared
            </p>
            <p className="font-body text-sm text-cult-warmgray">
              Accepted orders will appear here for preparation.
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <AnimatePresence>
              {preparingOrders.map((order) => (
                <PreparingOrderCard key={order.id} order={order} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </div>
  );
}
