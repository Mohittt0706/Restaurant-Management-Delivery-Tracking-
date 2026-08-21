import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ChefHat, Loader2, AlertTriangle } from 'lucide-react';
import { useKitchen } from '../../context/KitchenContext';

function PreparationTimer({ acceptedAt }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const start = acceptedAt || Date.now();
    const update = () => setElapsed(Math.max(0, Date.now() - start));
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [acceptedAt]);

  const totalSeconds = Math.floor(elapsed / 1000);
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');

  return (
    <span className="font-body text-lg text-cult-cream tabular-nums font-semibold">
      {minutes}:{seconds}
    </span>
  );
}

function PreparingOrderCard({ order }) {
  const { markReady } = useKitchen();
  const [marking, setMarking] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const isDelayed = order.acceptedAt && Date.now() - order.acceptedAt > 15 * 60 * 1000;

  const handleMarkReady = async () => {
    setMarking(true);
    setErrorMsg(null);
    const res = await markReady(order.id);
    setMarking(false);
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
          <div className="flex items-center gap-2">
            {isDelayed && (
              <span className="flex items-center gap-1 font-body text-xs tracking-widest uppercase px-2 py-1 bg-yellow-500/10 text-yellow-500 border border-yellow-500/30">
                <AlertTriangle size={12} />
                Delayed
              </span>
            )}
            <span className="font-body text-xs tracking-widest uppercase px-3 py-1 bg-cult-ember/20 text-cult-ember border border-cult-ember/40">
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

        {errorMsg && (
          <p className="font-body text-xs text-red-400 mb-3 bg-red-950/40 p-2 border border-red-800/40">
            {errorMsg}
          </p>
        )}
      </div>

      <button
        onClick={handleMarkReady}
        disabled={marking}
        className="w-full font-body text-xs tracking-widest uppercase text-cult-cream bg-green-700 py-3 hover:bg-green-800 transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
      >
        {marking ? (
          <>
            <Loader2 size={14} className="animate-spin" />
            Marking Ready...
          </>
        ) : (
          'Mark as Ready'
        )}
      </button>
    </div>
  );
}

export default function KitchenPreparing() {
  const { preparingOrders, loading, error } = useKitchen();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-cult-ember border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-mono text-cult-warmgray uppercase tracking-widest">Loading preparing orders…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center space-y-3 p-8 bg-cult-espresso border border-cult-bronze max-w-md mx-auto mt-20">
        <p className="font-heading text-lg text-cult-ember">{error}</p>
        <p className="text-xs font-body text-cult-warmgray">
          Unable to load preparing orders.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {preparingOrders.length === 0 ? (
        <div className="bg-cult-espresso border border-cult-bronze p-16 text-center space-y-3 rounded-sm">
          <ChefHat className="w-12 h-12 text-cult-warmgray/40 mx-auto" />
          <p className="font-heading text-lg text-cult-cream">No orders currently being prepared</p>
          <p className="text-xs font-body text-cult-warmgray">
            Accepted orders will appear here for preparation.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence>
            {preparingOrders.map((order) => (
              <PreparingOrderCard key={order.id} order={order} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
