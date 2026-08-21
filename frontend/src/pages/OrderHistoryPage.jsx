import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, Package, Clock, CheckCircle2, Truck, XCircle, FileText } from 'lucide-react';
import { getMyOrders } from '../services/orderService';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer/Footer';
import { fadeIn, fadeInUp, staggerContainer } from '../animations/variants';

const STATUS_CONFIG = {
  CONFIRMED: { label: 'Confirmed', icon: CheckCircle2, color: 'text-cult-gold' },
  PREPARING: { label: 'Preparing', icon: Clock, color: 'text-cult-ember' },
  READY: { label: 'Ready', icon: Package, color: 'text-cult-gold' },
  ASSIGNED: { label: 'Assigned', icon: Truck, color: 'text-cult-ember' },
  OUT_FOR_DELIVERY: { label: 'Out for Delivery', icon: Truck, color: 'text-cult-ember' },
  DELIVERED: { label: 'Delivered', icon: CheckCircle2, color: 'text-green-500' },
  CANCELLED: { label: 'Cancelled', icon: XCircle, color: 'text-red-500' },
};

function formatDate(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getMyOrders();
        setOrders(data || []);
      } catch (err) {
        setError(err.message || 'Unable to load order history.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, navigate]);

  return (
    <main className="min-h-screen bg-cult-charcoal pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="mb-10"
        >
          <motion.div variants={fadeInUp} className="flex items-center gap-4 mb-4">
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 font-body text-sm tracking-widest uppercase text-cult-warmgray hover:text-cult-cream transition-colors duration-300"
            >
              <ArrowLeft size={16} />
              Menu
            </Link>
          </motion.div>
          <motion.h1
            variants={fadeInUp}
            className="font-display text-4xl md:text-5xl tracking-widest text-cult-cream"
          >
            ORDER HISTORY
          </motion.h1>
        </motion.div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 size={32} className="text-cult-ember animate-spin mb-4" />
            <p className="font-body text-sm text-cult-warmgray tracking-widest uppercase">
              Loading orders...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="text-center py-24">
            <p className="font-heading text-lg text-cult-cream mb-4">{error}</p>
            <button
              onClick={() => { setLoading(true); setError(null); getMyOrders().then(setOrders).catch((e) => setError(e.message)).finally(() => setLoading(false)); }}
              className="font-body text-xs tracking-widest uppercase px-6 py-3 bg-cult-ember text-cult-cream hover:bg-cult-deep-red transition-all duration-300"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && orders.length === 0 && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="text-center py-24"
          >
            <Package size={48} className="text-cult-bronze/40 mx-auto mb-6" />
            <p className="font-heading text-xl text-cult-cream mb-2">No order history available.</p>
            <p className="font-body text-cult-warmgray mb-8">
              Your past orders will appear here once you place one.
            </p>
            <Link
              to="/menu"
              className="font-body text-sm tracking-widest uppercase text-cult-cream bg-cult-ember px-8 py-3.5 hover:bg-cult-deep-red transition-colors duration-300 inline-block"
            >
              Browse Menu
            </Link>
          </motion.div>
        )}

        {/* Orders List */}
        {!loading && !error && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order) => {
              const statusCfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.CONFIRMED;
              const StatusIcon = statusCfg.icon;

              return (
                <motion.div
                  key={order.id}
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  className="bg-cult-espresso border border-cult-bronze/30 p-5 hover:border-cult-ember/40 transition-colors duration-300"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Order Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-mono text-xs text-cult-ember">
                          #{order.orderNumber || order.id?.slice(0, 8)}
                        </span>
                        <span className={`flex items-center gap-1.5 text-xs font-body font-medium ${statusCfg.color}`}>
                          <StatusIcon size={14} />
                          {statusCfg.label}
                        </span>
                      </div>
                      <p className="font-body text-xs text-cult-warmgray mb-1">
                        {formatDate(order.createdAt)}
                      </p>
                      {order.items && order.items.length > 0 && (
                        <p className="font-body text-xs text-cult-warmgray truncate">
                          {order.items.map((i) => i.name || i.menuItem?.name).filter(Boolean).join(', ')}
                        </p>
                      )}
                    </div>

                    {/* Total + Action */}
                    <div className="flex items-center gap-4 shrink-0">
                      <span className="font-body text-sm font-semibold text-cult-cream">
                        ₹{order.totalAmount}
                      </span>
                      {order.paymentStatus === 'PAID' && (
                        <Link
                          to={`/invoice/${order.id}`}
                          className="font-body text-xs tracking-widest uppercase px-4 py-2 border border-cult-gold text-cult-gold hover:bg-cult-gold hover:text-cult-charcoal transition-all duration-300 flex items-center gap-1.5"
                        >
                          <FileText size={12} />
                          Invoice
                        </Link>
                      )}
                      {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
                        <Link
                          to={`/orders/${order.id}/tracking`}
                          className="font-body text-xs tracking-widest uppercase px-4 py-2 border border-cult-ember text-cult-ember hover:bg-cult-ember hover:text-cult-cream transition-all duration-300"
                        >
                          Track
                        </Link>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
