import React from 'react';
import { MapPin, Navigation, Clock, Compass } from 'lucide-react';

export default function RouteMapPlaceholder({ activeOrder }) {
  if (!activeOrder) {
    return (
      <div className="bg-cult-espresso border border-cult-bronze p-16 text-center space-y-3">
        <Compass className="w-12 h-12 text-cult-warmgray/40 mx-auto" />
        <p className="font-heading text-lg text-cult-cream">No active delivery selected</p>
        <p className="text-xs font-body text-cult-warmgray">Accept an assigned order to view route details and ETA.</p>
      </div>
    );
  }

  const restaurantLocation = "CULT Central Kitchen — 12th Main Rd, Indiranagar, Bengaluru";
  const customerLocation = activeOrder.address || "Customer Address";
  const distance = activeOrder.distance || "3.8 km";
  const eta = activeOrder.eta || "15 mins";

  return (
    <div className="bg-cult-espresso border border-cult-bronze p-6 space-y-6">
      {/* Route Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Pickup Location */}
        <div className="p-4 bg-cult-charcoal border border-cult-bronze space-y-1">
          <div className="flex items-center gap-2 text-cult-ember font-bold text-xs uppercase tracking-wider">
            <MapPin className="w-4 h-4" />
            <span>Pickup: Restaurant</span>
          </div>
          <p className="text-xs font-body text-cult-cream">{restaurantLocation}</p>
        </div>

        {/* Dropoff Location */}
        <div className="p-4 bg-cult-charcoal border border-cult-bronze space-y-1">
          <div className="flex items-center gap-2 text-cult-gold font-bold text-xs uppercase tracking-wider">
            <Navigation className="w-4 h-4" />
            <span>Dropoff: Customer</span>
          </div>
          <p className="text-xs font-body text-cult-cream">{customerLocation}</p>
        </div>
      </div>

      {/* Distance & ETA Highlights */}
      <div className="flex items-center justify-between p-4 bg-cult-charcoal border border-cult-bronze/70 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-cult-warmgray uppercase text-[10px] tracking-wider">Distance:</span>
          <span className="font-mono font-bold text-cult-cream">{distance}</span>
        </div>

        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-cult-ember" />
          <span className="text-cult-warmgray uppercase text-[10px] tracking-wider">Estimated ETA:</span>
          <span className="font-mono font-bold text-cult-ember text-sm">{eta}</span>
        </div>
      </div>

      {/* Visual Map Canvas Placeholder */}
      <div className="relative h-64 bg-cult-charcoal border border-cult-bronze overflow-hidden flex items-center justify-center p-6 rounded-sm">
        {/* Grid lines background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#3a2e2215_1px,transparent_1px),linear-gradient(to_bottom,#3a2e2215_1px,transparent_1px)] bg-[size:24px_24px]" />

        {/* SVG Route Line */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M 120 180 Q 250 80 480 120 T 750 160"
            fill="none"
            stroke="#E8642C"
            strokeWidth="3"
            strokeDasharray="6 6"
            className="animate-pulse"
          />
        </svg>

        {/* Start Pin */}
        <div className="absolute left-1/6 bottom-1/4 flex flex-col items-center gap-1 z-10">
          <div className="w-8 h-8 rounded-full bg-cult-ember text-cult-cream flex items-center justify-center shadow-lg">
            <MapPin className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-mono font-bold bg-cult-espresso px-2 py-0.5 border border-cult-bronze text-cult-cream">
            CULT Kitchen
          </span>
        </div>

        {/* End Pin */}
        <div className="absolute right-1/6 top-1/4 flex flex-col items-center gap-1 z-10">
          <div className="w-8 h-8 rounded-full bg-cult-gold text-cult-charcoal flex items-center justify-center shadow-lg font-bold">
            <Navigation className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-mono font-bold bg-cult-espresso px-2 py-0.5 border border-cult-bronze text-cult-cream">
            Customer Dropoff
          </span>
        </div>

        {/* Map Label Overlay */}
        <div className="absolute bottom-3 right-3 bg-cult-espresso/90 border border-cult-bronze px-3 py-1 text-[10px] font-mono text-cult-warmgray">
          Static Route Preview Mode
        </div>
      </div>
    </div>
  );
}
