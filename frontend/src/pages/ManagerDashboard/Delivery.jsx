import React, { useState } from 'react';
import AssignPartnerModal from '../../components/ManagerDashboard/AssignPartnerModal';
import AddPartnerModal from '../../components/ManagerDashboard/AddPartnerModal';
import { Bike, UserPlus, UserCheck, Clock } from 'lucide-react';

export default function Delivery({
  orders = [],
  partners = [],
  onAddPartner,
  onAssignPartner
}) {
  const [selectedOrderIdForAssign, setSelectedOrderIdForAssign] = useState(null);
  const [isAddPartnerOpen, setIsAddPartnerOpen] = useState(false);

  // Ready orders waiting for delivery partner assignment
  const readyUnassigned = orders.filter(
    (o) => o.orderStatus === 'Ready' && !o.assignedPartnerId
  );

  // Active deliveries
  const activeDeliveries = orders.filter(
    (o) => o.assignedPartnerId || o.orderStatus === 'Out for Delivery' || o.orderStatus === 'Assigned'
  );

  return (
    <div className="space-y-8">
      {/* Top Header Action */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-heading text-lg text-cult-cream">Delivery Operations</h2>
          <p className="text-xs font-body text-cult-warmgray">Assign drivers and monitor active dispatch</p>
        </div>

        <button
          onClick={() => setIsAddPartnerOpen(true)}
          className="bg-cult-ember text-cult-cream px-5 py-2.5 text-xs uppercase font-body tracking-widest font-medium hover:bg-cult-deep-red transition-colors flex items-center gap-2 cursor-pointer shadow-lg"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Partner</span>
        </button>
      </div>

      {/* Grid: Ready Unassigned Orders & Delivery Partners List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Unassigned Ready Orders */}
        <div className="bg-cult-espresso border border-cult-bronze p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-cult-bronze pb-3">
            <h3 className="font-heading text-sm uppercase tracking-wider text-cult-cream flex items-center gap-2">
              <Clock className="w-4 h-4 text-cult-gold" /> Unassigned Ready Orders ({readyUnassigned.length})
            </h3>
          </div>

          {readyUnassigned.length === 0 ? (
            <div className="p-8 text-center text-xs font-body text-cult-warmgray/60 italic border border-dashed border-cult-bronze/40">
              No orders ready yet for assignment
            </div>
          ) : (
            <div className="space-y-3">
              {readyUnassigned.map((ord) => (
                <div key={ord.id} className="p-4 bg-cult-charcoal border border-cult-bronze flex items-center justify-between gap-4">
                  <div>
                    <span className="font-mono font-bold text-xs text-cult-ember">#{ord.id}</span>
                    <p className="text-xs font-body font-bold text-cult-cream mt-0.5">{ord.customerName}</p>
                    <p className="text-[10px] text-cult-warmgray">{ord.address}</p>
                  </div>

                  <button
                    onClick={() => setSelectedOrderIdForAssign(ord.id)}
                    className="px-3.5 py-2 bg-cult-ember text-cult-cream text-xs uppercase font-body tracking-widest hover:bg-cult-deep-red flex items-center gap-1.5 cursor-pointer"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Assign Partner</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Delivery Partners Fleet List */}
        <div className="bg-cult-espresso border border-cult-bronze p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-cult-bronze pb-3">
            <h3 className="font-heading text-sm uppercase tracking-wider text-cult-cream flex items-center gap-2">
              <Bike className="w-4 h-4 text-cult-ember" /> Delivery Partners ({partners.length})
            </h3>
          </div>

          {partners.length === 0 ? (
            <div className="p-8 text-center text-xs font-body text-cult-warmgray/60 italic border border-dashed border-cult-bronze/40">
              No delivery partners added yet — click Add Partner to register drivers
            </div>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {partners.map((p) => (
                <div key={p.id} className="p-3 bg-cult-charcoal border border-cult-bronze flex items-center justify-between">
                  <div>
                    <p className="text-xs font-body font-bold text-cult-cream">{p.name}</p>
                    <p className="text-[10px] font-mono text-cult-warmgray">{p.contact}</p>
                  </div>
                  <span className="px-2.5 py-1 text-[10px] uppercase font-mono font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-500/40">
                    {p.status || 'Available'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Active Deliveries Table */}
      <div className="bg-cult-espresso border border-cult-bronze p-6 space-y-4">
        <h3 className="font-heading text-sm uppercase tracking-wider text-cult-cream">
          Active Deliveries
        </h3>

        {activeDeliveries.length === 0 ? (
          <div className="p-12 text-center text-xs font-body text-cult-warmgray/60 italic border border-dashed border-cult-bronze/40">
            No active deliveries in transit
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-cult-charcoal border-b border-cult-bronze text-cult-warmgray uppercase font-mono tracking-wider">
                <tr>
                  <th className="p-3">Order ID</th>
                  <th className="p-3">Assigned Partner</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Delivery Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cult-bronze/40">
                {activeDeliveries.map((ord) => {
                  const partner = partners.find((p) => p.id === ord.assignedPartnerId);
                  return (
                    <tr key={ord.id} className="hover:bg-cult-charcoal/40 transition-colors">
                      <td className="p-3 font-mono font-bold text-cult-ember">#{ord.id}</td>
                      <td className="p-3 font-body font-bold text-cult-cream">
                        {partner ? partner.name : 'Unassigned'}
                      </td>
                      <td className="p-3 text-cult-warmgray">{ord.customerName}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 text-[10px] uppercase font-mono font-bold bg-cult-ember/20 text-cult-ember border border-cult-ember/40">
                          {ord.orderStatus || 'Out for Delivery'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      <AssignPartnerModal
        isOpen={!!selectedOrderIdForAssign}
        onClose={() => setSelectedOrderIdForAssign(null)}
        orderId={selectedOrderIdForAssign}
        partners={partners}
        onAssign={onAssignPartner}
      />

      <AddPartnerModal
        isOpen={isAddPartnerOpen}
        onClose={() => setIsAddPartnerOpen(false)}
        onAdd={onAddPartner}
      />
    </div>
  );
}
