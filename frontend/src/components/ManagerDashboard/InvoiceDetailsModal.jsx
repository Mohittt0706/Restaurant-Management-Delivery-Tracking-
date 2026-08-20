import React from 'react';
import { X, Download } from 'lucide-react';

export default function InvoiceDetailsModal({ isOpen, onClose, invoice, onDownloadClick }) {
  if (!isOpen || !invoice) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-cult-espresso border border-cult-bronze p-6 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-cult-bronze pb-4">
          <div>
            <h3 className="font-heading text-xl text-cult-cream">
              Invoice #{invoice.id}
            </h3>
            <p className="text-xs font-mono text-cult-warmgray mt-0.5">
              Order ID: #{invoice.orderId}
            </p>
          </div>
          <button onClick={onClose} className="text-cult-warmgray hover:text-cult-cream">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <div className="p-3 bg-cult-charcoal border border-cult-bronze flex justify-between items-center">
            <span className="text-cult-warmgray">Customer:</span>
            <span className="text-cult-cream font-bold">{invoice.customerName}</span>
          </div>

          <div className="p-3 bg-cult-charcoal border border-cult-bronze flex justify-between items-center">
            <span className="text-cult-warmgray">Payment Method:</span>
            <span className="text-cult-cream font-medium">{invoice.paymentMethod}</span>
          </div>

          <div className="p-3 bg-cult-charcoal border border-cult-bronze flex justify-between items-center">
            <span className="text-cult-warmgray">Payment Status:</span>
            <span className="text-cult-gold font-bold uppercase">{invoice.status}</span>
          </div>
        </div>

        {/* Amount Breakdown */}
        <div className="pt-2 space-y-1.5 text-xs text-cult-warmgray">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-mono text-cult-cream">₹{(invoice.amount * 0.95).toFixed(2)}</span>
          </div>
          <div className="flex justify-between"><span>Taxes (5%)</span><span className="font-mono text-cult-cream">₹{(invoice.amount * 0.05).toFixed(2)}</span></div>
          <div className="flex justify-between font-bold text-sm text-cult-cream pt-2 border-t border-cult-bronze">
            <span>Total Paid</span>
            <span className="font-mono text-cult-ember font-display text-xl">₹{invoice.amount}</span>
          </div>
        </div>

        <div className="pt-4 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 border border-cult-bronze text-cult-cream uppercase text-xs font-body tracking-widest hover:border-cult-warmgray"
          >
            Close
          </button>
          <button
            onClick={onDownloadClick}
            className="flex-1 py-3 bg-cult-ember text-cult-cream uppercase text-xs font-body tracking-widest hover:bg-cult-deep-red flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Download Invoice</span>
          </button>
        </div>
      </div>
    </div>
  );
}
