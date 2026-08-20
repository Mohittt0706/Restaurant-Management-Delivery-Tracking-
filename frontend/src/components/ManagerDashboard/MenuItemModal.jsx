import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function MenuItemModal({ isOpen, onClose, onSave, itemToEdit }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Starters');
  const [price, setPrice] = useState('');
  const [available, setAvailable] = useState(true);
  const [image, setImage] = useState('');

  useEffect(() => {
    if (itemToEdit) {
      setName(itemToEdit.name || '');
      setCategory(itemToEdit.category || 'Starters');
      setPrice(itemToEdit.price || '');
      setAvailable(itemToEdit.available !== undefined ? itemToEdit.available : true);
      setImage(itemToEdit.image || '');
    } else {
      setName('');
      setCategory('Starters');
      setPrice('');
      setAvailable(true);
      setImage('');
    }
  }, [itemToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !price) return;

    onSave({
      id: itemToEdit ? itemToEdit.id : Date.now().toString(),
      name,
      category,
      price: parseFloat(price),
      available,
      image: image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-cult-espresso border border-cult-bronze p-6 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-cult-bronze pb-4">
          <h3 className="font-heading text-xl text-cult-cream">
            {itemToEdit ? 'Edit Menu Item' : 'Add New Menu Item'}
          </h3>
          <button onClick={onClose} className="text-cult-warmgray hover:text-cult-cream">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase font-body tracking-wider text-cult-warmgray mb-1">
              Item Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Truffle Mushroom Arancini"
              className="w-full bg-cult-charcoal border border-cult-bronze text-cult-cream px-4 py-2.5 text-sm font-body outline-none focus:border-cult-ember"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase font-body tracking-wider text-cult-warmgray mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-cult-charcoal border border-cult-bronze text-cult-cream px-3 py-2.5 text-sm font-body outline-none focus:border-cult-ember"
              >
                <option value="Starters">Starters</option>
                <option value="Main Course">Main Course</option>
                <option value="Desserts">Desserts</option>
                <option value="Beverages">Beverages</option>
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase font-body tracking-wider text-cult-warmgray mb-1">
                Price (₹)
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="450"
                className="w-full bg-cult-charcoal border border-cult-bronze text-cult-cream px-4 py-2.5 text-sm font-body outline-none focus:border-cult-ember"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase font-body tracking-wider text-cult-warmgray mb-1">
              Image URL Placeholder
            </label>
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full bg-cult-charcoal border border-cult-bronze text-cult-cream px-4 py-2.5 text-sm font-body outline-none focus:border-cult-ember"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs uppercase font-body tracking-wider text-cult-warmgray">
              Availability Status
            </span>
            <button
              type="button"
              onClick={() => setAvailable(!available)}
              className={`px-4 py-1.5 rounded-full text-xs uppercase font-bold tracking-wider transition-colors ${
                available
                  ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/40'
                  : 'bg-rose-950/80 text-rose-400 border border-rose-500/40'
              }`}
            >
              {available ? 'In Stock (ON)' : 'Out of Stock (OFF)'}
            </button>
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
              Save Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
