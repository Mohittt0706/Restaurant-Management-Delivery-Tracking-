import React, { useState, useEffect, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import Sidebar from '../../components/DeliveryPartnerDashboard/Sidebar';
import Topbar from '../../components/DeliveryPartnerDashboard/Topbar';
import Toast from '../../components/common/Toast';
import { useAuth } from '../../context/AuthContext';
import { deliveryService } from '../../services/deliveryService';

import DashboardHome from './DashboardHome';
import AssignedOrders from './AssignedOrders';
import RouteETA from './RouteETA';
import DeliveryStatus from './DeliveryStatus';

const STATUS_LABEL = {
  ASSIGNED: 'Assigned',
  ACCEPTED: 'Accepted',
  PICKED_UP: 'Picked Up',
  OUT_FOR_DELIVERY: 'Out for Delivery',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
};

function mapDelivery(d) {
  return {
    id: d.orderId,
    deliveryId: d.id,
    orderNumber: d.order?.orderNumber,
    customerName: d.order?.user?.name || 'Unknown',
    contact: d.order?.user?.phone || 'N/A',
    address: d.order?.addressText || 'N/A',
    items: (d.order?.items || []).map((i) => ({
      name: i.menuItem?.name || 'Item',
      quantity: i.quantity,
    })),
    paymentStatus: d.order?.paymentStatus || 'PENDING',
    status: STATUS_LABEL[d.status] || d.status,
    deliveryStatus: d.status,
    distance: d.estimatedDistance,
    eta: d.estimatedDuration,
    amount: d.order?.totalAmount,
    notes: d.order?.notes,
    createdAt: d.order?.createdAt,
    restaurantLocation: d.restaurantLocation || null,
  };
}

const STAGE_TO_ACTION = {
  Accepted: 'accept',
  'Picked Up': 'pickup',
  'Out for Delivery': 'out-for-delivery',
  Delivered: 'deliver',
};

export default function DeliveryPartnerDashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');

  const [stats, setStats] = useState({ assignedOrders: 0, activeDeliveries: 0, outForDelivery: 0, deliveredOrders: 0 });
  const [orders, setOrders] = useState([]);
  const [activeDelivery, setActiveDelivery] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderLoading, setOrderLoading] = useState(false);

  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const triggerToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
  }, []);

  const refreshDashboard = useCallback(async () => {
    try {
      const res = await deliveryService.getDashboard();
      setStats(res.data);
    } catch (err) {
      triggerToast(err.message, 'error');
    }
  }, [triggerToast]);

  const refreshOrders = useCallback(async () => {
    try {
      const res = await deliveryService.getMyOrders();
      setOrders(res.data.map(mapDelivery));
    } catch (err) {
      triggerToast(err.message, 'error');
    }
  }, [triggerToast]);

  const refreshActive = useCallback(async () => {
    try {
      const res = await deliveryService.getMyActiveDelivery();
      setActiveDelivery(res.data ? mapDelivery(res.data) : null);
    } catch (err) {
      triggerToast(err.message, 'error');
    }
  }, [triggerToast]);

  const refreshAll = useCallback(async () => {
    await Promise.all([refreshDashboard(), refreshOrders(), refreshActive()]);
  }, [refreshDashboard, refreshOrders, refreshActive]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await refreshAll();
      setLoading(false);
    })();
  }, [refreshAll]);

  const refreshSelectedOrder = useCallback(async (orderId) => {
    if (!orderId) return;
    try {
      const res = await deliveryService.getMyOrder(orderId);
      setSelectedOrder(mapDelivery(res.data));
    } catch (err) {
      triggerToast(err.message, 'error');
    }
  }, [triggerToast]);

  // Open order details from backend
  const handleSelectOrder = async (orderId) => {
    setOrderLoading(true);
    setSelectedOrder(null);
    try {
      const res = await deliveryService.getMyOrder(orderId);
      setSelectedOrder(mapDelivery(res.data));
    } catch (err) {
      triggerToast(err.message, 'error');
    } finally {
      setOrderLoading(false);
    }
  };

  // Accept Order
  const handleAcceptOrder = async (orderId) => {
    try {
      await deliveryService.acceptOrder(orderId);
      triggerToast('Order Accepted');
      await Promise.all([refreshAll(), refreshSelectedOrder(orderId)]);
    } catch (err) {
      triggerToast(err.message, 'error');
    }
  };

  // Sequential stage advancement (Accepted / Picked Up / Out for Delivery / Delivered)
  const handleAdvanceStage = async (orderId, stageLabel) => {
    const action = STAGE_TO_ACTION[stageLabel];
    if (!action) return;

    const toastMap = {
      accept: 'Order Accepted',
      pickup: 'Marked as Picked Up',
      'out-for-delivery': 'Out for Delivery',
      deliver: 'Order Delivered',
    };

    try {
      if (action === 'accept') {
        await deliveryService.acceptOrder(orderId);
      } else if (action === 'pickup') {
        await deliveryService.pickupOrder(orderId);
      } else if (action === 'out-for-delivery') {
        await deliveryService.markOutForDelivery(orderId);
      } else if (action === 'deliver') {
        await deliveryService.deliverOrder(orderId);
      }
      triggerToast(toastMap[action] || `Status updated to ${stageLabel}`);
      await Promise.all([refreshAll(), refreshSelectedOrder(orderId)]);
    } catch (err) {
      triggerToast(err.message, 'error');
    }
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
    if (section === 'dashboard') refreshDashboard();
    if (section === 'assigned') refreshOrders();
    if (section === 'route') refreshActive();
    if (section === 'status') refreshAll();
  };

  // Role gate: only DELIVERY role may access this dashboard
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (user?.role !== 'DELIVERY') {
    return (
      <div className="min-h-screen bg-cult-charcoal text-cult-cream flex items-center justify-center font-body">
        <div className="text-center space-y-3 p-8 bg-cult-espresso border border-cult-bronze">
          <p className="font-heading text-lg text-cult-ember">Access Restricted</p>
          <p className="text-xs text-cult-warmgray">
            This area is only available to DELIVERY accounts. Sign in with a delivery account to continue.
          </p>
        </div>
      </div>
    );
  }

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
        isVisible={!!toast}
        onClose={() => setToast(null)}
        message={toast?.message || ''}
        type={toast?.type || 'success'}
        duration={3000}
      />

      {/* Fixed Sidebar */}
      <Sidebar
        activeSection={activeSection}
        onSelectSection={handleSectionChange}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Sticky Topbar */}
        <Topbar title={sectionTitles[activeSection] || 'Delivery Console'} />

        {/* Dynamic Section Content Area */}
        <main className="flex-1 p-8 ml-64 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="text-center space-y-3">
                <div className="w-8 h-8 border-2 border-cult-ember border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs font-mono text-cult-warmgray uppercase tracking-widest">Loading partner data…</p>
              </div>
            </div>
          ) : (
            <>
              {activeSection === 'dashboard' && (
                <DashboardHome stats={stats} />
              )}

              {activeSection === 'assigned' && (
                <AssignedOrders
                  orders={orders}
                  onAcceptOrder={handleAcceptOrder}
                  onSelectOrder={handleSelectOrder}
                  selectedOrder={selectedOrder}
                  onCloseOrder={() => setSelectedOrder(null)}
                  orderLoading={orderLoading}
                />
              )}

              {activeSection === 'route' && (
                <RouteETA activeOrder={activeDelivery} />
              )}

              {activeSection === 'status' && (
                <DeliveryStatus
                  activeOrder={activeDelivery}
                  onAdvanceStage={handleAdvanceStage}
                />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}