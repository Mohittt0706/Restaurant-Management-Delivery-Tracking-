import React, { useState } from 'react';
import InvoiceDetailsModal from '../../components/ManagerDashboard/InvoiceDetailsModal';
import { CreditCard, Eye, Download } from 'lucide-react';

export default function PaymentsInvoices({ invoices = [], onDownloadInvoiceClick }) {
  const [selectedTab, setSelectedTab] = useState('All');
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const tabs = ['All', 'Razorpay', 'COD', 'Paid', 'Pending'];

  const filteredInvoices = invoices.filter((inv) => {
    if (selectedTab === 'All') return true;
    if (selectedTab === 'Razorpay') return inv.paymentMethod?.toLowerCase().includes('razorpay');
    if (selectedTab === 'COD') return inv.paymentMethod?.toLowerCase().includes('cod') || inv.paymentMethod?.toLowerCase().includes('cash');
    if (selectedTab === 'Paid') return inv.status?.toLowerCase() === 'paid';
    if (selectedTab === 'Pending') return inv.status?.toLowerCase() === 'pending';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`px-3.5 py-2 text-xs uppercase font-body tracking-wider border transition-colors whitespace-nowrap ${
              selectedTab === tab
                ? 'bg-cult-ember border-cult-ember text-cult-cream font-bold'
                : 'bg-cult-espresso border-cult-bronze text-cult-warmgray hover:text-cult-cream'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Invoice Table */}
      <div className="bg-cult-espresso border border-cult-bronze overflow-hidden">
        {filteredInvoices.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <CreditCard className="w-12 h-12 text-cult-warmgray/40 mx-auto" />
            <p className="font-heading text-lg text-cult-cream">No invoices yet</p>
            <p className="text-xs font-body text-cult-warmgray">
              Invoices will automatically generate once orders are placed and completed.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-cult-charcoal border-b border-cult-bronze text-cult-warmgray uppercase font-mono tracking-wider">
                <tr>
                  <th className="p-4">Invoice ID</th>
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Payment Method</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cult-bronze/40">
                {filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-cult-charcoal/40 transition-colors">
                    <td className="p-4 font-mono font-bold text-cult-cream">#{inv.id}</td>
                    <td className="p-4 font-mono text-cult-ember">#{inv.orderId}</td>
                    <td className="p-4 font-body font-bold text-cult-cream">{inv.customerName}</td>
                    <td className="p-4 text-cult-warmgray">{inv.paymentMethod}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 text-[10px] uppercase font-mono font-bold bg-cult-gold/20 text-cult-gold border border-cult-gold/40">
                        {inv.status}
                      </span>
                    </td>
                    <td className="p-4 font-mono font-bold text-cult-gold">₹{inv.amount}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedInvoice(inv)}
                          className="p-2 text-cult-warmgray hover:text-cult-cream transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={onDownloadInvoiceClick}
                          className="p-2 text-cult-warmgray hover:text-cult-ember transition-colors"
                          title="Download Invoice"
                        >
                          <Download className="w-4 h-4" />
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

      {/* Invoice Details Modal */}
      <InvoiceDetailsModal
        isOpen={!!selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
        invoice={selectedInvoice}
        onDownloadClick={() => {
          setSelectedInvoice(null);
          onDownloadInvoiceClick();
        }}
      />
    </div>
  );
}
