import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const STATUS_OPTIONS = ['CONFIRMED', 'PREPARING', 'READY', 'ASSIGNED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];

export default function OrderDetailsModal({ isOpen, onClose, order, onUpdateStatus }) {
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (order?.orderStatus) setStatus(order.orderStatus);
  }, [order]);

  if (!isOpen || !order) return null;

  const handleUpdateStatus = () => {
    if (status && status !== order.orderStatus && onUpdateStatus) {
      onUpdateStatus(order.id, status);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-xl bg-cult-espresso border border-cult-bronze p-6 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-cult-bronze pb-4">
          <div>
            <h3 className="font-heading text-xl text-cult-cream">
              Order Details #{order.id}
            </h3>
            <p className="text-xs font-mono text-cult-warmgray mt-0.5">
              Placed on {order.createdAt || 'Just now'}
            </p>
          </div>
          <button onClick={onClose} className="text-cult-warmgray hover:text-cult-cream">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Customer Details */}
        <div className="p-4 bg-cult-charcoal border border-cult-bronze text-xs space-y-1.5">
          <span className="text-cult-ember font-bold uppercase tracking-wider block mb-1">
            Customer Information
          </span>
          <p className="text-cult-cream"><strong className="text-cult-warmgray">Name:</strong> {order.customerName}</p>
          <p className="text-cult-cream"><strong className="text-cult-warmgray">Contact:</strong> {order.contact || 'N/A'}</p>
          <p className="text-cult-cream"><strong className="text-cult-warmgray">Delivery Address:</strong> {order.address || 'N/A'}</p>
        </div>

        {/* Items List */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-cult-warmgray mb-2">
            Ordered Items
          </h4>
          <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
            {order.items?.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center p-2.5 bg-cult-charcoal border border-cult-bronze/50 text-xs">
                <span className="text-cult-cream font-medium">
                  {item.quantity}x {item.name}
                </span>
                <span className="font-mono text-cult-gold">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Status & Payment Badges */}
        <div className="grid grid-cols-2 gap-4 text-xs pt-2">
          <div className="p-3 bg-cult-charcoal border border-cult-bronze">
            <span className="text-cult-warmgray block uppercase text-[10px] tracking-wider">Payment Status</span>
            <span className="font-bold text-cult-gold uppercase mt-1 block">{order.paymentStatus || 'Pending'}</span>
          </div>
          <div className="p-3 bg-cult-charcoal border border-cult-bronze">
            <span className="text-cult-warmgray block uppercase text-[10px] tracking-wider">Order Status</span>
            <span className="font-bold text-cult-ember uppercase mt-1 block">{order.orderStatus || 'Placed'}</span>
          </div>
        </div>

        {/* Total Amount */}
        <div className="flex justify-between items-center pt-4 border-t border-cult-bronze">
          <span className="text-sm font-bold uppercase tracking-widest text-cult-cream">Total Amount</span>
          <span className="font-display text-2xl text-cult-ember font-bold">₹{order.amount}</span>
        </div>

        {/* Update Status Control */}
        {onUpdateStatus && (
          <div className="flex items-center gap-3 pt-1">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="flex-1 bg-cult-charcoal border border-cult-bronze text-cult-cream px-3 py-2.5 text-xs font-mono uppercase outline-none focus:border-cult-ember"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <button
              onClick={handleUpdateStatus}
              disabled={!status || status === order.orderStatus}
              className="px-4 py-2.5 bg-cult-ember text-cult-cream text-xs uppercase font-body tracking-widest hover:bg-cult-deep-red disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Update Status
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
