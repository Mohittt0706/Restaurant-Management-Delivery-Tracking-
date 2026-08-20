import React, { useState } from 'react';
import OrderDetailPanel from '../../components/DeliveryPartnerDashboard/OrderDetailPanel';
import { Package, Eye, CheckCircle2, Plus } from 'lucide-react';

export default function AssignedOrders({ orders = [], onAcceptOrder, onAddTestOrder }) {
  const [selectedOrder, setSelectedOrder] = useState(null);

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-heading text-lg text-cult-cream">Assigned Orders List</h2>
          <p className="text-xs font-body text-cult-warmgray">Review details and accept orders for dispatch</p>
        </div>

        <button
          onClick={onAddTestOrder}
          className="bg-cult-ember text-cult-cream px-4 py-2 text-xs uppercase font-body tracking-widest font-medium hover:bg-cult-deep-red transition-colors flex items-center gap-2 cursor-pointer shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>Simulate Incoming Order</span>
        </button>
      </div>

      {/* Orders Table */}
      <div className="bg-cult-espresso border border-cult-bronze overflow-hidden">
        {orders.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <Package className="w-12 h-12 text-cult-warmgray/40 mx-auto" />
            <p className="font-heading text-lg text-cult-cream">No orders assigned yet</p>
            <p className="text-xs font-body text-cult-warmgray">
              Orders assigned by the manager will automatically appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-cult-charcoal border-b border-cult-bronze text-cult-warmgray uppercase font-mono tracking-wider">
                <tr>
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Customer Name</th>
                  <th className="p-4">Contact</th>
                  <th className="p-4">Delivery Address</th>
                  <th className="p-4">Items</th>
                  <th className="p-4">Payment</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cult-bronze/40">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-cult-charcoal/40 transition-colors">
                    <td className="p-4 font-mono font-bold text-cult-ember">#{ord.id}</td>
                    <td className="p-4 font-body font-bold text-cult-cream">{ord.customerName}</td>
                    <td className="p-4 text-cult-warmgray font-mono">{ord.contact}</td>
                    <td className="p-4 text-cult-cream max-w-xs truncate">{ord.address}</td>
                    <td className="p-4 text-cult-warmgray">{ord.items?.length || 0} items</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 text-[10px] uppercase font-mono font-bold bg-cult-gold/20 text-cult-gold border border-cult-gold/40">
                        {ord.paymentStatus || 'Paid'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 text-[10px] uppercase font-mono font-bold bg-cult-ember/20 text-cult-ember border border-cult-ember/40">
                        {ord.status || 'Assigned'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedOrder(ord)}
                          className="p-2 text-cult-warmgray hover:text-cult-cream transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {ord.status === 'Assigned' && (
                          <button
                            onClick={() => onAcceptOrder(ord.id)}
                            className="px-3 py-1.5 bg-cult-ember text-cult-cream text-[11px] uppercase font-body tracking-wider hover:bg-cult-deep-red flex items-center gap-1 cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Accept</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      <OrderDetailPanel
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        order={selectedOrder}
        onAccept={onAcceptOrder}
      />
    </div>
  );
}
