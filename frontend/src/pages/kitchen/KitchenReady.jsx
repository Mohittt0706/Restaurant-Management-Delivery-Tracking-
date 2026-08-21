import { AnimatePresence } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { useKitchen } from '../../context/KitchenContext';

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
    <div className="bg-cult-espresso border border-cult-bronze p-6 rounded-sm hover:border-cult-ember/40 transition-colors duration-300">
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
    </div>
  );
}

export default function KitchenReady() {
  const { readyOrders, loading, error } = useKitchen();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-cult-ember border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-mono text-cult-warmgray uppercase tracking-widest">Loading ready orders…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center space-y-3 p-8 bg-cult-espresso border border-cult-bronze max-w-md mx-auto mt-20">
        <p className="font-heading text-lg text-cult-ember">{error}</p>
        <p className="text-xs font-body text-cult-warmgray">
          Unable to load ready orders.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {readyOrders.length === 0 ? (
        <div className="bg-cult-espresso border border-cult-bronze p-16 text-center space-y-3 rounded-sm">
          <CheckCircle className="w-12 h-12 text-cult-warmgray/40 mx-auto" />
          <p className="font-heading text-lg text-cult-cream">No ready orders</p>
          <p className="text-xs font-body text-cult-warmgray">
            Orders marked as ready will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence>
            {readyOrders.map((order) => (
              <ReadyOrderCard key={order.id} order={order} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
