import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function AddPartnerModal({ isOpen, onClose, onAdd }) {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [status, setStatus] = useState('Available');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !contact.trim()) return;

    onAdd({
      id: Date.now().toString(),
      name,
      contact,
      status
    });

    setName('');
    setContact('');
    setStatus('Available');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-cult-espresso border border-cult-bronze p-6 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-cult-bronze pb-4">
          <h3 className="font-heading text-xl text-cult-cream">
            Add Delivery Partner
          </h3>
          <button onClick={onClose} className="text-cult-warmgray hover:text-cult-cream">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase font-body tracking-wider text-cult-warmgray mb-1">
              Partner Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex Rivers"
              className="w-full bg-cult-charcoal border border-cult-bronze text-cult-cream px-4 py-2.5 text-sm font-body outline-none focus:border-cult-ember"
            />
          </div>

          <div>
            <label className="block text-xs uppercase font-body tracking-wider text-cult-warmgray mb-1">
              Contact Phone
            </label>
            <input
              type="tel"
              required
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full bg-cult-charcoal border border-cult-bronze text-cult-cream px-4 py-2.5 text-sm font-body outline-none focus:border-cult-ember"
            />
          </div>

          <div>
            <label className="block text-xs uppercase font-body tracking-wider text-cult-warmgray mb-1">
              Status Toggle
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-cult-charcoal border border-cult-bronze text-cult-cream px-3 py-2.5 text-sm font-body outline-none focus:border-cult-ember"
            >
              <option value="Available">Available</option>
              <option value="Busy">Busy</option>
            </select>
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
              className="flex-1 py-3 bg-cult-ember text-cult-cream uppercase text-xs font-body tracking-widest hover:bg-cult-deep-red"
            >
              Add Partner
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
