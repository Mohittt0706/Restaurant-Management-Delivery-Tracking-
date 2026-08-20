import React, { useState } from 'react';
import OrderDetailsModal from '../../components/ManagerDashboard/OrderDetailsModal';
import { ShoppingBag, Eye } from 'lucide-react';

export default function Orders({ orders = [], onUpdateStatus }) {
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const filterTabs = ['All', 'CONFIRMED', 'PREPARING', 'READY', 'ASSIGNED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];

  const filteredOrders = orders.filter((o) =>
    selectedStatus === 'All' ? true : o.orderStatus === selectedStatus
  );

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {filterTabs.map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`px-3.5 py-2 text-xs uppercase font-body tracking-wider border transition-colors whitespace-nowrap ${
              selectedStatus === status
                ? 'bg-cult-ember border-cult-ember text-cult-cream font-bold'
                : 'bg-cult-espresso border-cult-bronze text-cult-warmgray hover:text-cult-cream'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-cult-espresso border border-cult-bronze overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <ShoppingBag className="w-12 h-12 text-cult-warmgray/40 mx-auto" />
            <p className="font-heading text-lg text-cult-cream">No orders yet</p>
            <p className="text-xs font-body text-cult-warmgray">
              Orders created in the system will automatically appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-cult-charcoal border-b border-cult-bronze text-cult-warmgray uppercase font-mono tracking-wider">
                <tr>
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Customer Name</th>
                  <th className="p-4">Items</th>
                  <th className="p-4">Payment Status</th>
                  <th className="p-4">Order Status</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cult-bronze/40">
                {filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-cult-charcoal/40 transition-colors">
                    <td className="p-4 font-mono font-bold text-cult-ember">#{ord.id}</td>
                    <td className="p-4 font-body font-bold text-cult-cream">{ord.customerName}</td>
                    <td className="p-4 text-cult-warmgray">{ord.items?.length || 0} items</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 text-[10px] uppercase font-mono font-bold bg-cult-gold/20 text-cult-gold border border-cult-gold/40">
                        {ord.paymentStatus || 'Pending'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 text-[10px] uppercase font-mono font-bold bg-cult-ember/20 text-cult-ember border border-cult-ember/40">
                        {ord.orderStatus || 'Placed'}
                      </span>
                    </td>
                    <td className="p-4 font-mono font-bold text-cult-gold">₹{ord.amount}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="p-2 text-cult-warmgray hover:text-cult-cream transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      <OrderDetailsModal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        order={selectedOrder}
        onUpdateStatus={onUpdateStatus}
      />
    </div>
  );
}
