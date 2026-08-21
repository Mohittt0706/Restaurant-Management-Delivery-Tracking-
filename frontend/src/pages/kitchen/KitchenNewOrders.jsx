import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Inbox, Loader2 } from 'lucide-react';
import { useKitchen } from '../../context/KitchenContext';

function NewOrderCard({ order }) {
  const { acceptOrder } = useKitchen();
  const [accepting, setAccepting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleAccept = async () => {
    setAccepting(true);
    setErrorMsg(null);
    const res = await acceptOrder(order.id);
    setAccepting(false);
    if (!res.success) {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="bg-cult-espresso border border-cult-bronze p-6 rounded-sm flex flex-col justify-between hover:border-cult-ember/40 transition-colors duration-300">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-lg tracking-wider text-cult-cream">
            {order.displayNumber}
          </h3>
          <span className="font-body text-xs tracking-widest uppercase px-3 py-1 bg-cult-gold/20 text-cult-gold border border-cult-gold/40">
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
            Payment: <span className="text-cult-cream uppercase">{order.paymentStatus}</span>
          </p>
          {order.specialRequirement && (
            <div>
              <p className="font-body text-cult-warmgray">Special Requirement:</p>
              <p className="font-body text-cult-cream italic">{order.specialRequirement}</p>
            </div>
          )}
        </div>

        {errorMsg && (
          <p className="font-body text-xs text-red-400 mb-3 bg-red-950/40 p-2 border border-red-800/40">
            {errorMsg}
          </p>
        )}
      </div>

      <button
        onClick={handleAccept}
        disabled={accepting}
        className="w-full font-body text-xs tracking-widest uppercase text-cult-cream bg-cult-ember py-3 hover:bg-cult-deep-red transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
      >
        {accepting ? (
          <>
            <Loader2 size={14} className="animate-spin" />
            Accepting...
          </>
        ) : (
          'Accept Order'
        )}
      </button>
    </div>
  );
}

export default function KitchenNewOrders() {
  const { newOrders, loading, error } = useKitchen();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-cult-ember border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-mono text-cult-warmgray uppercase tracking-widest">Loading new orders…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center space-y-3 p-8 bg-cult-espresso border border-cult-bronze max-w-md mx-auto mt-20">
        <p className="font-heading text-lg text-cult-ember">{error}</p>
        <p className="text-xs font-body text-cult-warmgray">
          Unable to load new orders.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {newOrders.length === 0 ? (
        <div className="bg-cult-espresso border border-cult-bronze p-16 text-center space-y-3 rounded-sm">
          <Inbox className="w-12 h-12 text-cult-warmgray/40 mx-auto" />
          <p className="font-heading text-lg text-cult-cream">No new orders</p>
          <p className="text-xs font-body text-cult-warmgray">
            New incoming orders will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence>
            {newOrders.map((order) => (
              <NewOrderCard key={order.id} order={order} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
