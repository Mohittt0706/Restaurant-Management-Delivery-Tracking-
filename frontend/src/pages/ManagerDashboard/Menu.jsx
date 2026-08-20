import React, { useState } from 'react';
import MenuItemModal from '../../components/ManagerDashboard/MenuItemModal';
import { Plus, Edit2, Trash2, UtensilsCrossed, ToggleLeft, ToggleRight } from 'lucide-react';

export default function Menu({ menuItems = [], categories = [], onAddItem, onEditItem, onDeleteItem, onToggleAvailability }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [itemToDelete, setItemToDelete] = useState(null);

  const categoryTabs = ['All', ...categories.map((c) => c.name)];

  const filteredItems = menuItems.filter((item) => 
    selectedCategory === 'All' ? true : item.category === selectedCategory
  );

  const handleOpenAdd = () => {
    setItemToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setItemToEdit(item);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      onDeleteItem(itemToDelete.id);
      setItemToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
          {categoryTabs.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs uppercase font-body tracking-wider border transition-colors ${
                selectedCategory === cat
                  ? 'bg-cult-ember border-cult-ember text-cult-cream font-bold'
                  : 'bg-cult-espresso border-cult-bronze text-cult-warmgray hover:text-cult-cream'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Add Item Button */}
        <button
          onClick={handleOpenAdd}
          className="bg-cult-ember text-cult-cream px-5 py-2.5 text-xs uppercase font-body tracking-widest font-medium hover:bg-cult-deep-red transition-colors flex items-center gap-2 cursor-pointer shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>Add Item</span>
        </button>
      </div>

      {/* Menu Table / Grid */}
      <div className="bg-cult-espresso border border-cult-bronze overflow-hidden">
        {filteredItems.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <UtensilsCrossed className="w-12 h-12 text-cult-warmgray/40 mx-auto" />
            <p className="font-heading text-lg text-cult-cream">No menu items yet</p>
            <p className="text-xs font-body text-cult-warmgray">Click Add Item to get started adding items to your menu.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-cult-charcoal border-b border-cult-bronze text-cult-warmgray uppercase font-mono tracking-wider">
                <tr>
                  <th className="p-4">Item</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Availability</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cult-bronze/40">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-cult-charcoal/40 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={item.image} alt={item.name} className="w-10 h-10 object-cover border border-cult-bronze rounded" />
                        <span className="font-body font-bold text-cult-cream">{item.name}</span>
                      </div>
                    </td>
                    <td className="p-4 font-mono text-cult-warmgray uppercase">{item.category}</td>
                    <td className="p-4 font-mono text-cult-gold font-bold">₹{item.price}</td>
                    <td className="p-4">
                      <button
                        onClick={() => onToggleAvailability(item.id)}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        {item.available ? (
                          <>
                            <ToggleRight className="w-6 h-6 text-emerald-400" />
                            <span className="text-[11px] text-emerald-400 font-mono">ON</span>
                          </>
                        ) : (
                          <>
                            <ToggleLeft className="w-6 h-6 text-rose-400" />
                            <span className="text-[11px] text-rose-400 font-mono">OFF</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-2 text-cult-warmgray hover:text-cult-ember transition-colors"
                          title="Edit Item"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setItemToDelete(item)}
                          className="p-2 text-cult-warmgray hover:text-rose-400 transition-colors"
                          title="Delete Item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      <MenuItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(data) => {
          if (itemToEdit) {
            onEditItem(data);
          } else {
            onAddItem(data);
          }
        }}
        itemToEdit={itemToEdit}
        categories={categories}
      />

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-cult-espresso border border-cult-bronze p-6 text-center space-y-4">
            <h3 className="font-heading text-lg text-cult-cream">Confirm Delete</h3>
            <p className="text-xs text-cult-warmgray">
              Are you sure you want to delete <strong className="text-cult-cream">{itemToDelete.name}</strong>?
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setItemToDelete(null)}
                className="flex-1 py-2.5 border border-cult-bronze text-cult-cream text-xs uppercase font-body tracking-wider"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 bg-rose-600 text-white text-xs uppercase font-body tracking-wider hover:bg-rose-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
