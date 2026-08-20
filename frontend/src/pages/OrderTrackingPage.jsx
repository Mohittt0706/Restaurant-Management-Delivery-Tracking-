import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  RefreshCw,
  Loader2,
  CheckCircle2,
  Clock,
  ChefHat,
  UtensilsCrossed,
  Truck,
  MapPin,
  CircleCheckBig,
  Phone,
  User,
} from 'lucide-react';
import { getOrderTracking } from '../services/orderService';
import Footer from '../components/Footer/Footer';
import { fadeInUp, staggerContainer } from '../animations/variants';

const ORDER_STEPS = [
  { key: 'CONFIRMED', label: 'Order Confirmed', icon: CheckCircle2 },
  { key: 'PREPARING', label: 'Preparing', icon: ChefHat },
  { key: 'READY', label: 'Ready', icon: UtensilsCrossed },
  { key: 'ASSIGNED', label: 'Delivery Assigned', icon: User },
  { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: Truck },
  { key: 'DELIVERED', label: 'Delivered', icon: CircleCheckBig },
];

const STATUS_MESSAGES = {
  CONFIRMED: 'Your order has been confirmed.',
  PREPARING: 'Your order is being prepared.',
  READY: 'Your food is ready!',
  ASSIGNED: 'A delivery partner has been assigned to your order.',
  OUT_FOR_DELIVERY: 'Your order is out for delivery.',
  DELIVERED: 'Your order has been delivered.',
};

const DELIVERY_STATUS_LABELS = {
  ASSIGNED: 'Assigned',
  ACCEPTED: 'Partner Accepted',
  PICKED_UP: 'Picked Up',
  OUT_FOR_DELIVERY: 'Out for Delivery',
  DELIVERED: 'Delivered',
};

function getStepIndex(status) {
  const idx = ORDER_STEPS.findIndex((s) => s.key === status);
  return idx >= 0 ? idx : 0;
}

function formatTime(isoString) {
  if (!isoString) return null;
  const d = new Date(isoString);
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

function calcDuration(start, end) {
  if (!start || !end) return null;
  const ms = new Date(end) - new Date(start);
  const mins = Math.floor(ms / 60000);
  if (mins < 60) return `${mins} min`;
  const hrs = Math.floor(mins / 60);
  const remainMins = mins % 60;
  return `${hrs}h ${remainMins}m`;
}

export default function OrderTrackingPage() {
  const { id } = useParams();
  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [polling, setPolling] = useState(false);

  const fetchTracking = useCallback(async (isPoll = false) => {
    if (isPoll) setPolling(true);
    try {
      const data = await getOrderTracking(id);
      setTracking(data);
      setError(null);
    } catch (err) {
      if (!isPoll || !tracking) {
        setError(err.message || 'Unable to load order status.');
      }
    } finally {
      setLoading(false);
      setPolling(false);
    }
  }, [id, tracking]);

  useEffect(() => {
    fetchTracking();
    const interval = setInterval(() => {
      if (tracking && tracking.orderStatus !== 'DELIVERED') {
        fetchTracking(true);
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [fetchTracking, tracking?.orderStatus]);

  const currentIdx = tracking ? getStepIndex(tracking.orderStatus) : 0;
  const delivery = tracking?.deliveryPartner;

  if (loading) {
    return (
      <main className="min-h-screen bg-cult-charcoal pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={32} className="text-cult-ember animate-spin mx-auto mb-4" />
          <p className="font-body text-sm text-cult-warmgray">Loading Order...</p>
        </div>
      </main>
    );
  }

  if (error && !tracking) {
    return (
      <main className="min-h-screen bg-cult-charcoal pt-24 pb-16 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <p className="font-heading text-lg text-cult-cream mb-2">{error}</p>
          <button
            onClick={() => { setLoading(true); fetchTracking(); }}
            className="mt-6 font-body text-sm tracking-widest uppercase text-cult-cream bg-cult-ember px-8 py-3.5 hover:bg-cult-deep-red transition-colors duration-300 inline-flex items-center gap-2"
          >
            <RefreshCw size={14} />
            Try Again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-cult-charcoal pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-6 lg:px-10">
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
            <button
              onClick={() => fetchTracking(true)}
              disabled={polling}
              className="ml-auto text-cult-warmgray hover:text-cult-cream transition-colors"
              title="Refresh"
            >
              <RefreshCw size={16} className={polling ? 'animate-spin' : ''} />
            </button>
          </motion.div>
          <motion.h1
            variants={fadeInUp}
            className="font-display text-4xl md:text-5xl tracking-widest text-cult-cream"
          >
            ORDER TRACKING
          </motion.h1>
          <motion.p variants={fadeInUp} className="font-mono text-sm text-cult-ember mt-2">
            #{tracking?.orderNumber || id}
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12">
          {/* Status Timeline */}
          <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="lg:col-span-2">
            <div className="bg-cult-espresso border border-cult-bronze/30 p-8">
              <h2 className="font-display text-xl tracking-widest text-cult-cream mb-8">
                ORDER STATUS
              </h2>

              <div className="space-y-0">
                {ORDER_STEPS.map((step, idx) => {
                  const isCompleted = idx <= currentIdx;
                  const isCurrent = idx === currentIdx;
                  const Icon = step.icon;

                  return (
                    <div key={step.key} className="flex gap-4">
                      {/* Timeline line + dot */}
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-10 h-10 flex items-center justify-center shrink-0 border ${
                            isCurrent
                              ? 'bg-cult-ember border-cult-ember'
                              : isCompleted
                                ? 'bg-cult-ember/20 border-cult-ember/40'
                                : 'bg-cult-charcoal border-cult-bronze/30'
                          }`}
                        >
                          <Icon
                            size={18}
                            className={
                              isCurrent
                                ? 'text-cult-cream'
                                : isCompleted
                                  ? 'text-cult-ember'
                                  : 'text-cult-bronze'
                            }
                          />
                        </div>
                        {idx < ORDER_STEPS.length - 1 && (
                          <div
                            className={`w-px flex-1 min-h-[40px] ${
                              idx < currentIdx ? 'bg-cult-ember/40' : 'bg-cult-bronze/20'
                            }`}
                          />
                        )}
                      </div>

                      {/* Label */}
                      <div className="pb-8 pt-2">
                        <p
                          className={`font-body text-sm font-medium ${
                            isCurrent
                              ? 'text-cult-cream'
                              : isCompleted
                                ? 'text-cult-ember'
                                : 'text-cult-warmgray/50'
                          }`}
                        >
                          {step.label}
                        </p>
                        {isCurrent && (
                          <p className="font-body text-xs text-cult-warmgray mt-1">
                            {STATUS_MESSAGES[step.key]}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Payment Status */}
              {tracking && (
                <div className="mt-6 border-t border-cult-bronze/20 pt-6 flex items-center gap-3">
                  <span className="font-body text-xs text-cult-warmgray uppercase tracking-wider">
                    Payment:
                  </span>
                  <span
                    className={`px-2.5 py-1 text-[10px] uppercase font-mono font-bold border ${
                      tracking.paymentStatus === 'PAID'
                        ? 'bg-cult-gold/20 text-cult-gold border-cult-gold/40'
                        : 'bg-cult-ember/20 text-cult-ember border-cult-ember/40'
                    }`}
                  >
                    {tracking.paymentStatus} ({tracking.paymentMethod})
                  </span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Delivery Partner Info */}
          <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="lg:col-span-1">
            <div className="bg-cult-espresso border border-cult-bronze/30 p-6 sticky top-28">
              <h2 className="font-display text-xl tracking-widest text-cult-cream mb-6">
                DELIVERY PARTNER
              </h2>

              {!delivery ? (
                <div className="text-center py-8">
                  <Truck size={36} className="text-cult-bronze/40 mx-auto mb-4" />
                  <p className="font-body text-sm text-cult-warmgray">
                    Delivery partner will be assigned soon.
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  {/* Partner Info */}
                  <div className="text-center pb-5 border-b border-cult-bronze/20">
                    <div className="w-16 h-16 bg-cult-ember/20 border border-cult-ember/40 flex items-center justify-center mx-auto mb-3">
                      <Truck size={28} className="text-cult-ember" />
                    </div>
                    <p className="font-body text-sm font-bold text-cult-cream">
                      {delivery.name}
                    </p>
                    <p className="font-body text-xs text-cult-warmgray">Delivery Partner</p>
                  </div>

                  {/* Contact + Status */}
                  <div className="space-y-3 text-xs">
                    {delivery.phone && (
                      <div className="flex items-center gap-3">
                        <Phone size={14} className="text-cult-ember shrink-0" />
                        <span className="text-cult-cream font-mono">{delivery.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <Clock size={14} className="text-cult-ember shrink-0" />
                      <span className="text-cult-warmgray">Status:</span>
                      <span className="text-cult-cream font-bold uppercase">
                        {DELIVERY_STATUS_LABELS[delivery.status] || delivery.status}
                      </span>
                    </div>
                  </div>

                  {/* Delivery Times */}
                  <div className="border-t border-cult-bronze/20 pt-4 space-y-3 text-xs">
                    <p className="font-body text-[10px] tracking-widest uppercase text-cult-warmgray mb-2">
                      Delivery Information
                    </p>
                    {delivery.assignedAt && (
                      <div className="flex justify-between">
                        <span className="text-cult-warmgray">Assigned At</span>
                        <span className="text-cult-cream font-mono">{formatTime(delivery.assignedAt)}</span>
                      </div>
                    )}
                    {delivery.pickedUpAt && (
                      <div className="flex justify-between">
                        <span className="text-cult-warmgray">Picked Up At</span>
                        <span className="text-cult-cream font-mono">{formatTime(delivery.pickedUpAt)}</span>
                      </div>
                    )}
                    {delivery.deliveredAt && (
                      <div className="flex justify-between">
                        <span className="text-cult-warmgray">Delivered At</span>
                        <span className="text-cult-cream font-mono">{formatTime(delivery.deliveredAt)}</span>
                      </div>
                    )}
                    {delivery.assignedAt && delivery.deliveredAt && (
                      <div className="flex justify-between border-t border-cult-bronze/20 pt-3">
                        <span className="text-cult-warmgray">Total Delivery Time</span>
                        <span className="text-cult-ember font-bold font-mono">
                          {calcDuration(delivery.assignedAt, delivery.deliveredAt)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
