import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Inbox, Loader2 } from 'lucide-react';
import { useKitchen } from '../../context/KitchenContext';
import { fadeInUp, staggerContainer } from '../../animations/variants';

function NewOrderCard({ order }) {
  const { acceptOrder } = useKitchen();
  const [accepting, setAccepting] = useState(false);

  const handleAccept = () => {
    setAccepting(true);
    setTimeout(() => {
      acceptOrder(order.id);
      setAccepting(false);
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
        <span className="font-body text-xs tracking-widest uppercase px-3 py-1 bg-cult-gold/10 text-cult-gold border border-cult-gold/30">
          NEW
        </span>
      </div>

      <div className="space-y-2 mb-4">
        {order.items.map((item, i) => (
          <p key={i} className="font-body text-sm text-cult-warmgray">
            {item.name} <span className="text-cult-cream">× {item.quantity}</span>
          </p>
        ))}
      </div>

      <div className="space-y-2 mb-4 text-sm">
        <p className="font-body text-cult-warmgray">
          Payment: <span className="text-cult-cream">{order.paymentStatus}</span>
        </p>
        {order.specialRequirement && (
          <div>
            <p className="font-body text-cult-warmgray">Special Requirement:</p>
            <p className="font-body text-cult-cream italic">{order.specialRequirement}</p>
          </div>
        )}
        {order.priority && (
          <p className="font-body text-cult-warmgray">
            Priority: <span className="text-cult-cream">{order.priority}</span>
          </p>
        )}
      </div>

      <button
        onClick={handleAccept}
        disabled={accepting}
        className="w-full font-body text-sm tracking-widest uppercase text-cult-cream bg-cult-ember py-3 hover:bg-cult-deep-red transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {accepting ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Accepting...
          </>
        ) : (
          'Accept Order'
        )}
      </button>
    </motion.div>
  );
}

export default function KitchenNewOrders() {
  const { newOrders, loading } = useKitchen();

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
          NEW ORDERS
        </motion.h1>

        {newOrders.length === 0 ? (
          <motion.div
            variants={fadeInUp}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <Inbox size={48} className="text-cult-bronze mb-4" />
            <p className="font-heading text-lg text-cult-cream mb-1">
              No new orders
            </p>
            <p className="font-body text-sm text-cult-warmgray">
              New incoming orders will appear here.
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <AnimatePresence>
              {newOrders.map((order) => (
                <NewOrderCard key={order.id} order={order} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </div>
  );
}
