import React from 'react';
import ReportChart from '../../components/ManagerDashboard/ReportChart';

export default function Reports({ 
  salesData = [], 
  revenueData = [], 
  ordersData = [], 
  deliveryPerformanceData = [] 
}) {
  return (
    <div className="space-y-6">
      {/* 4 Report Tiles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ReportChart
          title="Sales Report"
          data={salesData}
          type="bar"
          dataKey="amount"
          nameKey="name"
        />

        <ReportChart
          title="Revenue Trends"
          data={revenueData}
          type="line"
          dataKey="revenue"
          nameKey="date"
        />

        <ReportChart
          title="Orders Volume"
          data={ordersData}
          type="bar"
          dataKey="count"
          nameKey="date"
        />

        <ReportChart
          title="Delivery Performance"
          data={deliveryPerformanceData}
          type="line"
          dataKey="avgMinutes"
          nameKey="partner"
        />
      </div>

      {/* Banner */}
      <div className="p-6 bg-cult-espresso border border-cult-bronze text-center space-y-1">
        <p className="text-xs font-mono uppercase text-cult-ember tracking-widest font-bold">
          Summary Analytics
        </p>
        <p className="text-xs font-body text-cult-warmgray">
          Charts automatically populate as orders, menu items, and deliveries are processed through local state.
        </p>
      </div>
    </div>
  );
}
