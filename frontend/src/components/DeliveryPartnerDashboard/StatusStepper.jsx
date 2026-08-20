import React from 'react';
import { Check, ArrowRight, PackageCheck, Bike, CheckCircle2 } from 'lucide-react';

const stages = [
  { id: 'Assigned', label: 'Assigned', actionLabel: 'Accept Order' },
  { id: 'Accepted', label: 'Accepted', actionLabel: 'Mark Picked Up' },
  { id: 'Picked Up', label: 'Picked Up', actionLabel: 'Mark Out for Delivery' },
  { id: 'Out for Delivery', label: 'Out for Delivery', actionLabel: 'Mark Delivered' },
  { id: 'Delivered', label: 'Delivered', actionLabel: 'Completed' },
];

export default function StatusStepper({ activeOrder, onAdvanceStage }) {
  if (!activeOrder) {
    return (
      <div className="bg-cult-espresso border border-cult-bronze p-16 text-center space-y-3">
        <PackageCheck className="w-12 h-12 text-cult-warmgray/40 mx-auto" />
        <p className="font-heading text-lg text-cult-cream">No active order selected</p>
        <p className="text-xs font-body text-cult-warmgray">Assigned orders accepted for delivery will appear here for stage tracking.</p>
      </div>
    );
  }

  const currentStatus = activeOrder.status || 'Assigned';
  const currentStageIndex = stages.findIndex((s) => s.id === currentStatus);

  const canAdvance = currentStageIndex >= 0 && currentStageIndex < stages.length - 1;
  const nextStage = canAdvance ? stages[currentStageIndex + 1] : null;

  return (
    <div className="bg-cult-espresso border border-cult-bronze p-8 space-y-8">
      {/* Active Order Summary Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-cult-bronze pb-4 gap-2">
        <div>
          <span className="text-xs font-mono font-bold text-cult-ember">Active Order #{activeOrder.id}</span>
          <h3 className="font-heading text-xl text-cult-cream">{activeOrder.customerName}</h3>
          <p className="text-xs font-body text-cult-warmgray">{activeOrder.address}</p>
        </div>

        <div className="px-4 py-2 bg-cult-charcoal border border-cult-bronze text-right">
          <span className="text-[10px] uppercase font-mono text-cult-warmgray block">Current Stage</span>
          <span className="text-sm font-bold uppercase text-cult-ember font-mono">{currentStatus}</span>
        </div>
      </div>

      {/* 5-Stage Sequential Stepper Bar */}
      <div className="relative py-4">
        <div className="overflow-x-auto pb-4">
          <div className="flex items-center justify-between min-w-[600px] relative">
            {/* Connecting line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-cult-charcoal border-t border-cult-bronze -translate-y-1/2 z-0" />

            {stages.map((stage, idx) => {
              const isCompleted = idx < currentStageIndex;
              const isCurrent = idx === currentStageIndex;

              return (
                <div key={stage.id} className="relative z-10 flex flex-col items-center gap-2">
                  {/* Stage Icon Circle */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 border ${
                      isCompleted
                        ? 'bg-emerald-950 text-emerald-400 border-emerald-500/50'
                        : isCurrent
                        ? 'bg-cult-ember text-cult-cream border-cult-ember ring-4 ring-cult-ember/20 shadow-lg'
                        : 'bg-cult-charcoal text-cult-warmgray border-cult-bronze'
                    }`}
                  >
                    {isCompleted ? <Check className="w-5 h-5" /> : idx + 1}
                  </div>

                  {/* Stage Label */}
                  <span
                    className={`text-xs uppercase font-mono tracking-wider text-center ${
                      isCurrent
                        ? 'text-cult-cream font-bold'
                        : isCompleted
                        ? 'text-emerald-400 font-medium'
                        : 'text-cult-warmgray/60'
                    }`}
                  >
                    {stage.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sequential Advancement Action Button */}
      <div className="pt-4 border-t border-cult-bronze">
        {canAdvance && nextStage ? (
          <button
            onClick={() => onAdvanceStage(activeOrder.id, nextStage.id)}
            className="w-full py-4 bg-cult-ember text-cult-cream text-xs uppercase tracking-widest font-body font-bold hover:bg-cult-deep-red transition-all duration-300 flex items-center justify-center gap-2 shadow-xl cursor-pointer"
          >
            <span>Proceed to Next Stage: {nextStage.actionLabel}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <div className="p-4 bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-center text-xs font-mono uppercase font-bold flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Delivery Completed Successfully</span>
          </div>
        )}
      </div>
    </div>
  );
}
