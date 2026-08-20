import React from 'react';
import KanbanColumn from '../../components/ManagerDashboard/KanbanColumn';

export default function Kitchen({ orders = [], onMoveOrderStage }) {
  const newOrders = orders.filter((o) => o.orderStatus === 'CONFIRMED' || o.orderStatus === 'PLACED');
  const preparingOrders = orders.filter((o) => o.orderStatus === 'PREPARING');
  const readyOrders = orders.filter((o) => o.orderStatus === 'READY');

  return (
    <div className="space-y-6">
      {/* 3 Kanban Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KanbanColumn
          title="New Orders"
          orders={newOrders}
          onMoveStage={(id) => onMoveOrderStage(id, 'PREPARING')}
          emptyMessage="No new orders in queue"
        />

        <KanbanColumn
          title="Preparing"
          orders={preparingOrders}
          onMoveStage={(id) => onMoveOrderStage(id, 'READY')}
          emptyMessage="No orders currently preparing"
        />

        <KanbanColumn
          title="Ready"
          orders={readyOrders}
          onMoveStage={() => {}}
          emptyMessage="No orders ready for pickup"
        />
      </div>
    </div>
  );
}
