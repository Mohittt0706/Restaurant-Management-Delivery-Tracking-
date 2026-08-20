import React, { useState } from 'react';
import { X, Bike } from 'lucide-react';

export default function AssignPartnerModal({ isOpen, onClose, onAssign, orderId, partners }) {
  const [selectedPartnerId, setSelectedPartnerId] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedPartnerId) return;

    onAssign(orderId, selectedPartnerId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-cult-espresso border border-cult-bronze p-6 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-cult-bronze pb-4">
          <h3 className="font-heading text-xl text-cult-cream">
            Assign Delivery Partner
          </h3>
          <button onClick={onClose} className="text-cult-warmgray hover:text-cult-cream">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase font-body tracking-wider text-cult-warmgray mb-2">
              Select Available Partner for Order #{orderId}
            </label>
            {partners.length === 0 ? (
              <p className="text-xs text-cult-ember italic p-3 bg-cult-charcoal border border-cult-bronze">
                No delivery partners added yet. Please add a delivery partner first in the Delivery section.
              </p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {partners.map((p) => (
                  <label
                    key={p.id}
                    className={`flex items-center justify-between p-3 border cursor-pointer transition-colors ${
                      selectedPartnerId === p.id
                        ? 'bg-cult-ember/20 border-cult-ember text-cult-cream'
                        : 'bg-cult-charcoal border-cult-bronze text-cult-warmgray hover:text-cult-cream'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="partner"
                        value={p.id}
                        checked={selectedPartnerId === p.id}
                        onChange={() => setSelectedPartnerId(p.id)}
                        className="accent-cult-ember"
                      />
                      <div>
                        <p className="text-xs font-bold text-cult-cream">{p.name}</p>
                        <p className="text-[10px] text-cult-warmgray">{p.contact}</p>
                      </div>
                    </div>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 border border-cult-bronze bg-cult-espresso">
                      {p.status || 'Available'}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-cult-bronze text-cult-cream uppercase text-xs font-body tracking-widest hover:border-cult-warmgray"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={partners.length === 0 || !selectedPartnerId}
              className="flex-1 py-3 bg-cult-ember text-cult-cream uppercase text-xs font-body tracking-widest hover:bg-cult-deep-red disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Assign Partner
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
