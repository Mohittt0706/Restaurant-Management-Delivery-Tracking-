import React from 'react';
import StatusStepper from '../../components/DeliveryPartnerDashboard/StatusStepper';

export default function DeliveryStatus({ activeOrder, onAdvanceStage }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-lg text-cult-cream">Delivery Workflow Status</h2>
        <p className="text-xs font-body text-cult-warmgray">Sequential 5-stage status advancement for active dispatch</p>
      </div>

      <StatusStepper
        activeOrder={activeOrder}
        onAdvanceStage={onAdvanceStage}
      />
    </div>
  );
}
