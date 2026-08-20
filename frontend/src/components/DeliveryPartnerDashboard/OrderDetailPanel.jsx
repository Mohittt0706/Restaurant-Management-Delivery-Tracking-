import React from 'react';
import { X, CheckCircle2 } from 'lucide-react';

export default function OrderDetailPanel({ isOpen, onClose, order, onAccept }) {
  if (!isOpen || !order) return null;

  const isAccepted = order.status !== 'Assigned';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-xl bg-cult-espresso border border-cult-bronze p-6 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-cult-bronze pb-4">
          <div>
            <h3 className="font-heading text-xl text-cult-cream">
              Assigned Order #{order.id}
            </h3>
            <p className="text-xs font-mono text-cult-warmgray mt-0.5">
              Status: <span className="text-cult-ember font-bold uppercase">{order.status || 'Assigned'}</span>
            </p>
          </div>
          <button onClick={onClose} className="text-cult-warmgray hover:text-cult-cream">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Customer Information */}
        <div className="p-4 bg-cult-charcoal border border-cult-bronze text-xs space-y-2">
          <span className="text-cult-ember font-bold uppercase tracking-wider block">
            Customer & Delivery Info
          </span>
          <div className="grid grid-cols-2 gap-2 text-cult-cream">
            <p><strong className="text-cult-warmgray">Name:</strong> {order.customerName}</p>
            <p><strong className="text-cult-warmgray">Contact:</strong> {order.contact}</p>
          </div>
          <p className="text-cult-cream"><strong className="text-cult-warmgray">Address:</strong> {order.address}</p>
        </div>

        {/* Order Items */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-cult-warmgray mb-2">
            Items to Pick Up
          </h4>
          <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
            {order.items?.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center p-2.5 bg-cult-charcoal border border-cult-bronze/50 text-xs">
                <span className="text-cult-cream font-medium">
                  <strong className="text-cult-gold mr-2">{item.quantity}x</strong>
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Badge */}
        <div className="flex items-center justify-between p-3 bg-cult-charcoal border border-cult-bronze text-xs">
          <span className="text-cult-warmgray uppercase text-[10px] tracking-wider">Payment Status</span>
          <span className="font-bold font-mono text-cult-gold uppercase px-2.5 py-1 bg-cult-gold/20 border border-cult-gold/30">
            {order.paymentStatus || 'Paid'}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 border border-cult-bronze text-cult-cream uppercase text-xs font-body tracking-widest hover:border-cult-warmgray"
          >
            Close
          </button>

          {!isAccepted && (
            <button
              type="button"
              onClick={() => {
                onAccept(order.id);
                onClose();
              }}
              className="flex-1 py-3 bg-cult-ember text-cult-cream uppercase text-xs font-body tracking-widest hover:bg-cult-deep-red flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Accept Order</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
