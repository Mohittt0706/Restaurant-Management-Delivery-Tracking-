import React, { useState } from 'react';
import Sidebar from '../../components/ManagerDashboard/Sidebar';
import Topbar from '../../components/ManagerDashboard/Topbar';
import Toast from '../../components/common/Toast';

import DashboardHome from './DashboardHome';
import Menu from './Menu';
import Orders from './Orders';
import Kitchen from './Kitchen';
import Delivery from './Delivery';
import PaymentsInvoices from './PaymentsInvoices';
import Reports from './Reports';

export default function ManagerDashboardPage() {
  const [activeSection, setActiveSection] = useState('dashboard');

  // STRICTLY INITIALIZED AS EMPTY ARRAYS — NO MOCK/SEED DATA
  const [menuItems, setMenuItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [partners, setPartners] = useState([]);
  const [invoices, setInvoices] = useState([]);

  // Toast Notification State (Reusing existing Toast component)
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
  };

  // --- MENU ACTIONS ---
  const handleAddItem = (newItem) => {
    setMenuItems((prev) => [newItem, ...prev]);
    triggerToast('Item Added');
  };

  const handleEditItem = (updatedItem) => {
    setMenuItems((prev) =>
      prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
    triggerToast('Item Updated');
  };

  const handleDeleteItem = (itemId) => {
    setMenuItems((prev) => prev.filter((item) => item.id !== itemId));
    triggerToast('Item Deleted');
  };

  const handleToggleAvailability = (itemId) => {
    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, available: !item.available } : item
      )
    );
    triggerToast('Availability Updated');
  };

  // --- DELIVERY ACTIONS ---
  const handleAddPartner = (newPartner) => {
    setPartners((prev) => [...prev, newPartner]);
    triggerToast('Partner Added');
  };

  const handleAssignPartner = (orderId, partnerId) => {
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === orderId
          ? {
              ...ord,
              assignedPartnerId: partnerId,
              orderStatus: 'Out for Delivery'
            }
          : ord
      )
    );
    triggerToast('Partner Assigned');
  };

  // --- KITCHEN ACTIONS ---
  const handleMoveOrderStage = (orderId, newStage) => {
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === orderId ? { ...ord, orderStatus: newStage } : ord
      )
    );
    triggerToast(`Order Status Updated: ${newStage}`);
  };

  // --- INVOICE ACTIONS ---
  const handleDownloadInvoiceClick = () => {
    triggerToast('Feature coming soon');
  };

  // Section titles map
  const sectionTitles = {
    dashboard: 'Dashboard Overview',
    menu: 'Menu Management',
    orders: 'Orders Master',
    kitchen: 'Kitchen Workflow (KDS)',
    delivery: 'Delivery Dispatch & Fleet',
    payments: 'Payments & Invoices',
    reports: 'Reports & Analytics',
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
        <Topbar title={sectionTitles[activeSection] || 'Manager Dashboard'} />

        {/* Dynamic Section Content Area */}
        <main className="flex-1 p-8 ml-64 overflow-y-auto">
          {activeSection === 'dashboard' && (
            <DashboardHome orders={orders} />
          )}

          {activeSection === 'menu' && (
            <Menu
              menuItems={menuItems}
              onAddItem={handleAddItem}
              onEditItem={handleEditItem}
              onDeleteItem={handleDeleteItem}
              onToggleAvailability={handleToggleAvailability}
            />
          )}

          {activeSection === 'orders' && (
            <Orders orders={orders} />
          )}

          {activeSection === 'kitchen' && (
            <Kitchen
              orders={orders}
              onMoveOrderStage={handleMoveOrderStage}
            />
          )}

          {activeSection === 'delivery' && (
            <Delivery
              orders={orders}
              partners={partners}
              onAddPartner={handleAddPartner}
              onAssignPartner={handleAssignPartner}
            />
          )}

          {activeSection === 'payments' && (
            <PaymentsInvoices
              invoices={invoices}
              onDownloadInvoiceClick={handleDownloadInvoiceClick}
            />
          )}

          {activeSection === 'reports' && (
            <Reports
              salesData={[]}
              revenueData={[]}
              ordersData={[]}
              deliveryPerformanceData={[]}
            />
          )}
        </main>
      </div>
    </div>
  );
}
