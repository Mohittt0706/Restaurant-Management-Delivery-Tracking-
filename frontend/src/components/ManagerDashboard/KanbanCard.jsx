import React from 'react';
import { Clock, ArrowRight } from 'lucide-react';

export default function KanbanCard({ order, onMoveStage, stage }) {
  let nextLabel = '';
  if (stage === 'New Orders') nextLabel = 'Start Preparing';
  else if (stage === 'Preparing') nextLabel = 'Mark Ready';

  return (
    <div className="bg-cult-charcoal border border-cult-bronze p-4 space-y-3 shadow-md hover:border-cult-ember/40 transition-colors">
      <div className="flex justify-between items-center">
        <span className="font-mono font-bold text-xs text-cult-ember">#{order.id}</span>
        <div className="flex items-center gap-1 text-[10px] font-mono text-cult-warmgray">
          <Clock className="w-3 h-3 text-cult-gold" />
          <span>{order.prepTime || '15 min'}</span>
        </div>
      </div>

      <div className="space-y-1">
        {order.items?.map((item, i) => (
          <p key={i} className="text-xs text-cult-cream font-medium">
            <span className="text-cult-gold font-bold mr-1.5">{item.quantity}x</span>
            {item.name}
          </p>
        ))}
      </div>

      {order.specialRequirements && (
        <div className="p-2 bg-cult-espresso border border-cult-ember/30 text-[10px] text-cult-ember">
          Note: "{order.specialRequirements}"
        </div>
      )}

      {nextLabel && (
        <button
          onClick={() => onMoveStage(order.id)}
          className="w-full py-2 bg-cult-ember/20 border border-cult-ember text-cult-cream text-[11px] uppercase tracking-widest font-body font-medium hover:bg-cult-ember hover:text-cult-cream transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span>{nextLabel}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
