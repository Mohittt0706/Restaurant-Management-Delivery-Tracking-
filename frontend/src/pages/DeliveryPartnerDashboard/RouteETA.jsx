import React from 'react';
import RouteMapPlaceholder from '../../components/DeliveryPartnerDashboard/RouteMapPlaceholder';

export default function RouteETA({ activeOrder }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-lg text-cult-cream">Navigation & Route ETA</h2>
        <p className="text-xs font-body text-cult-warmgray">Visual route mapping and estimated dropoff timeline</p>
      </div>

      <RouteMapPlaceholder activeOrder={activeOrder} />
    </div>
  );
}
