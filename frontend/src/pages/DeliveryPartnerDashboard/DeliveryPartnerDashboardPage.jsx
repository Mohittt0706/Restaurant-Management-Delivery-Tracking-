import React, { useState } from 'react';
import Sidebar from '../../components/DeliveryPartnerDashboard/Sidebar';
import Topbar from '../../components/DeliveryPartnerDashboard/Topbar';
import Toast from '../../components/common/Toast';

import DashboardHome from './DashboardHome';
import AssignedOrders from './AssignedOrders';
import RouteETA from './RouteETA';
import DeliveryStatus from './DeliveryStatus';

export default function DeliveryPartnerDashboardPage() {
  const [activeSection, setActiveSection] = useState('dashboard');

  // STRICTLY INITIALIZED AS EMPTY ARRAY — NO MOCK/SEED DATA
  const [orders, setOrders] = useState([]);

  // Toast Notification State (Reusing existing Toast component)
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
  };

  // Simulate assigning a test incoming order
  const handleAddTestOrder = () => {
    const newOrd = {
      id: Math.floor(1000 + Math.random() * 9000).toString(),
      customerName: 'Sarah Jenkins',
      contact: '+91 98765 12345',
      address: '42 Crescent Heights, 5th Block, Koramangala',
      items: [
        { name: 'CULT Signature Wagyu Burger', quantity: 1 },
        { name: 'Truffle Parmesan Fries', quantity: 1 },
      ],
      paymentStatus: 'Paid',
      status: 'Assigned', // Initial status
      distance: '3.4 km',
      eta: '18 mins',
    };

    setOrders((prev) => [newOrd, ...prev]);
    triggerToast('New Order Assigned to You');
  };

  // Accept Order action
  const handleAcceptOrder = (orderId) => {
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === orderId ? { ...ord, status: 'Accepted' } : ord
      )
    );
    triggerToast('Order Accepted');
  };

  // Advance delivery status stage sequentially
  const handleAdvanceStage = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === orderId ? { ...ord, status: newStatus } : ord
      )
    );

    const toastMap = {
      'Accepted': 'Order Accepted',
      'Picked Up': 'Marked as Picked Up',
      'Out for Delivery': 'Out for Delivery',
      'Delivered': 'Order Delivered',
    };

    triggerToast(toastMap[newStatus] || `Status updated to ${newStatus}`);
  };

  // Currently active order in progress (first non-delivered order, or latest accepted order)
  const activeOrder = orders.find(
    (o) => o.status !== 'Delivered'
  );

  // Section titles map
  const sectionTitles = {
    dashboard: 'Partner Overview',
    assigned: 'Assigned Orders',
    route: 'Navigation Route & ETA',
    status: 'Delivery Workflow Status',
  };

  return (
    <div className="min-h-screen bg-cult-charcoal text-cult-cream flex font-body">
      {/* Toast Notification */}
      <Toast
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        message={toastMessage}
        duration={3000}
      />

      {/* Fixed Sidebar */}
      <Sidebar
        activeSection={activeSection}
        onSelectSection={setActiveSection}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Sticky Topbar */}
        <Topbar title={sectionTitles[activeSection] || 'Delivery Console'} />

        {/* Dynamic Section Content Area */}
        <main className="flex-1 p-8 ml-64 overflow-y-auto">
          {activeSection === 'dashboard' && (
            <DashboardHome
              orders={orders}
              onAddTestOrder={handleAddTestOrder}
            />
          )}

          {activeSection === 'assigned' && (
            <AssignedOrders
              orders={orders}
              onAcceptOrder={handleAcceptOrder}
              onAddTestOrder={handleAddTestOrder}
            />
          )}

          {activeSection === 'route' && (
            <RouteETA activeOrder={activeOrder} />
          )}

          {activeSection === 'status' && (
            <DeliveryStatus
              activeOrder={activeOrder}
              onAdvanceStage={handleAdvanceStage}
            />
          )}
        </main>
      </div>
    </div>
  );
}
