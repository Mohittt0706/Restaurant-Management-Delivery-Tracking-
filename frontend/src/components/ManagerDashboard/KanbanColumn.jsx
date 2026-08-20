import React from 'react';
import KanbanCard from './KanbanCard';

export default function KanbanColumn({ title, orders, onMoveStage, emptyMessage }) {
  return (
    <div className="bg-cult-espresso border border-cult-bronze p-4 flex flex-col min-h-[450px]">
      <div className="flex items-center justify-between border-b border-cult-bronze pb-3 mb-4">
        <h3 className="font-heading text-sm uppercase tracking-wider text-cult-cream">
          {title}
        </h3>
        <span className="px-2 py-0.5 text-xs font-mono font-bold bg-cult-charcoal text-cult-ember border border-cult-bronze">
          {orders.length}
        </span>
      </div>

      <div className="flex-1 space-y-3">
        {orders.length === 0 ? (
          <div className="h-full flex items-center justify-center p-6 text-center text-xs font-body text-cult-warmgray/60 italic border border-dashed border-cult-bronze/40">
            {emptyMessage || 'No orders in this stage'}
          </div>
        ) : (
          orders.map((ord) => (
            <KanbanCard
              key={ord.id}
              order={ord}
              stage={title}
              onMoveStage={onMoveStage}
            />
          ))
        )}
      </div>
    </div>
  );
}
