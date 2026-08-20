import React, { useState, useEffect, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import Sidebar from '../../components/ManagerDashboard/Sidebar';
import Topbar from '../../components/ManagerDashboard/Topbar';
import Toast from '../../components/common/Toast';
import { useAuth } from '../../context/AuthContext';
import { managerService } from '../../services/managerService';

import DashboardHome from './DashboardHome';
import Menu from './Menu';
import Orders from './Orders';
import Kitchen from './Kitchen';
import Delivery from './Delivery';
import PaymentsInvoices from './PaymentsInvoices';
import Reports from './Reports';

function mapOrder(o) {
  return {
    id: o.id,
    orderNumber: o.orderNumber,
    customerName: o.user?.name || 'Unknown',
    contact: o.user?.phone || 'N/A',
    address: o.addressText || 'N/A',
    items: (o.items || []).map((i) => ({
      name: i.menuItem?.name || 'Item',
      price: i.price,
      quantity: i.quantity,
    })),
    paymentStatus: o.paymentStatus,
    orderStatus: o.status,
    amount: o.totalAmount,
    createdAt: o.createdAt,
    assignedPartnerId: o.delivery?.deliveryPartner?.id || null,
    notes: o.notes || '',
    prepTime: `${Math.max(1, Math.round((Date.now() - new Date(o.createdAt).getTime()) / 60000))} min`,
  };
}

function mapMenuItem(m) {
  return {
    id: m.id,
    name: m.name,
    category: m.category?.name || '',
    categoryId: m.categoryId,
    price: m.price,
    image: m.image || '',
    available: m.availability,
    description: m.description,
    shortDescription: m.shortDescription,
  };
}

function mapPartner(p) {
  return { id: p.id, name: p.name, contact: p.phone || p.email || '', status: 'Available' };
}

function mapInvoice(i) {
  return {
    id: i.id,
    orderId: i.order?.id || i.orderId,
    customerName: i.order?.user?.name || 'Unknown',
    paymentMethod: i.order?.paymentMethod || '—',
    status: i.order?.paymentStatus || 'PENDING',
    amount: i.totalAmount,
    invoiceNumber: i.invoiceNumber,
    createdAt: i.createdAt,
  };
}

export default function ManagerDashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');

  const [dashboard, setDashboard] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [partners, setPartners] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [reports, setReports] = useState({
    sales: [],
    revenue: [],
    orders: [],
    delivery: [],
  });

  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const triggerToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
  }, []);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [dash, menuRes, catRes, ordersRes, partnerRes, invoiceRes, salesRes, revenueRes, ordersReportRes, deliveryPerfRes] =
        await Promise.all([
          managerService.getDashboard(),
          managerService.getMenuItems(),
          managerService.getCategories(),
          managerService.getOrders(),
          managerService.getDeliveryPartners(),
          managerService.getInvoices(),
          managerService.getSalesReport(),
          managerService.getRevenueReport(),
          managerService.getOrdersReport(),
          managerService.getDeliveryPerformanceReport(),
        ]);

      setDashboard(dash.data);
      setMenuItems(menuRes.data.map(mapMenuItem));
      setCategories(catRes.data);
      setOrders(ordersRes.data.map(mapOrder));
      setPartners(partnerRes.data.map(mapPartner));
      setInvoices(invoiceRes.data.map(mapInvoice));
      setReports({
        sales: (salesRes.data?.topSellingItems || []).map((i) => ({ name: i.name, amount: i.revenue })),
        revenue: revenueRes.data?.dailyRevenue || [],
        orders: ordersReportRes.data?.dailyOrders || [],
        delivery: deliveryPerfRes.data?.byPartner || [],
      });
    } catch (err) {
      triggerToast(err.message || 'Failed to load dashboard data.', 'error');
    } finally {
      setLoading(false);
    }
  }, [triggerToast]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const refreshOrders = useCallback(async () => {
    try {
      const ordersRes = await managerService.getOrders();
      setOrders(ordersRes.data.map(mapOrder));
    } catch (err) {
      triggerToast(err.message, 'error');
    }
  }, [triggerToast]);

  const refreshMenu = useCallback(async () => {
    try {
      const [menuRes, catRes] = await Promise.all([
        managerService.getMenuItems(),
        managerService.getCategories(),
      ]);
      setMenuItems(menuRes.data.map(mapMenuItem));
      setCategories(catRes.data);
    } catch (err) {
      triggerToast(err.message, 'error');
    }
  }, [triggerToast]);

  const refreshPartners = useCallback(async () => {
    try {
      const res = await managerService.getDeliveryPartners();
      setPartners(res.data.map(mapPartner));
    } catch (err) {
      triggerToast(err.message, 'error');
    }
  }, [triggerToast]);

  const refreshDashboard = useCallback(async () => {
    try {
      const res = await managerService.getDashboard();
      setDashboard(res.data);
    } catch (err) {
      triggerToast(err.message, 'error');
    }
  }, [triggerToast]);

  // --- MENU ACTIONS ---
  const handleAddItem = async (data) => {
    try {
      await managerService.createMenuItem({
        name: data.name,
        price: data.price,
        categoryId: data.categoryId,
        image: data.image,
        availability: data.available,
      });
      triggerToast('Item Added');
      await refreshMenu();
    } catch (err) {
      triggerToast(err.message, 'error');
    }
  };

  const handleEditItem = async (data) => {
    try {
      await managerService.updateMenuItem(data.id, {
        name: data.name,
        price: data.price,
        categoryId: data.categoryId,
        image: data.image,
        availability: data.available,
      });
      triggerToast('Item Updated');
      await refreshMenu();
    } catch (err) {
      triggerToast(err.message, 'error');
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await managerService.deleteMenuItem(itemId);
      triggerToast('Item Deleted');
      await refreshMenu();
    } catch (err) {
      triggerToast(err.message, 'error');
    }
  };

  const handleToggleAvailability = async (itemId) => {
    const item = menuItems.find((i) => i.id === itemId);
    if (!item) return;
    try {
      await managerService.toggleMenuItemAvailability(itemId, !item.available);
      triggerToast('Availability Updated');
      await refreshMenu();
    } catch (err) {
      triggerToast(err.message, 'error');
    }
  };

  // --- DELIVERY ACTIONS ---
  const handleAddPartner = async (data) => {
    try {
      await managerService.addDeliveryPartner({ name: data.name, phone: data.contact });
      triggerToast('Partner Added');
      await refreshPartners();
    } catch (err) {
      triggerToast(err.message, 'error');
    }
  };

  const handleAssignPartner = async (orderId, partnerId) => {
    try {
      await managerService.assignDelivery(orderId, partnerId);
      triggerToast('Partner Assigned');
      await Promise.all([refreshOrders(), refreshDashboard()]);
    } catch (err) {
      triggerToast(err.message, 'error');
    }
  };

  // --- KITCHEN ACTIONS ---
  const handleMoveOrderStage = async (orderId, newStage) => {
    try {
      if (newStage === 'PREPARING') {
        await managerService.kitchenAcceptOrder(orderId);
      } else if (newStage === 'READY') {
        await managerService.kitchenMarkReady(orderId);
      } else {
        return;
      }
      triggerToast(`Order Status Updated: ${newStage}`);
      await Promise.all([refreshOrders(), refreshDashboard()]);
    } catch (err) {
      triggerToast(err.message, 'error');
    }
  };

  // --- ORDER STATUS (Details Modal) ---
  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await managerService.updateOrderStatus(orderId, status);
      triggerToast(`Order Status Updated: ${status}`);
      await Promise.all([refreshOrders(), refreshDashboard()]);
    } catch (err) {
      triggerToast(err.message, 'error');
    }
  };

  // --- INVOICE ACTIONS ---
  const handleDownloadInvoiceClick = () => {
    triggerToast('Feature coming soon');
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
    if (section === 'dashboard') refreshDashboard();
    if (section === 'reports') fetchAll();
  };

  // Role gate: only MANAGER (admin) role may access the dashboard
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (user?.role !== 'MANAGER') {
    return (
      <div className="min-h-screen bg-cult-charcoal text-cult-cream flex items-center justify-center font-body">
        <div className="text-center space-y-3 p-8 bg-cult-espresso border border-cult-bronze">
          <p className="font-heading text-lg text-cult-ember">Access Restricted</p>
          <p className="text-xs text-cult-warmgray">
            This area is only available to MANAGER accounts. Sign in with a manager account to continue.
          </p>
        </div>
      </div>
    );
  }

  const stats = dashboard
    ? {
        totalOrders: dashboard.totalOrders,
        todaysRevenue: dashboard.todayRevenue,
        pendingOrders: (dashboard.ordersByStatus?.PLACED || 0) + (dashboard.ordersByStatus?.CONFIRMED || 0),
        preparingOrders: dashboard.ordersByStatus?.PREPARING || 0,
        deliveredOrders: dashboard.ordersByStatus?.DELIVERED || 0,
        activeDeliveries: dashboard.activeDeliveries,
      }
    : null;

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
        <Topbar title={sectionTitles[activeSection] || 'Manager Dashboard'} />

        {/* Dynamic Section Content Area */}
        <main className="flex-1 p-8 ml-64 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="text-center space-y-3">
                <div className="w-8 h-8 border-2 border-cult-ember border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs font-mono text-cult-warmgray uppercase tracking-widest">Loading dashboard data…</p>
              </div>
            </div>
          ) : (
            <>
              {activeSection === 'dashboard' && (
                <DashboardHome orders={orders} stats={stats} />
              )}

              {activeSection === 'menu' && (
                <Menu
                  menuItems={menuItems}
                  categories={categories}
                  onAddItem={handleAddItem}
                  onEditItem={handleEditItem}
                  onDeleteItem={handleDeleteItem}
                  onToggleAvailability={handleToggleAvailability}
                />
              )}

              {activeSection === 'orders' && (
                <Orders
                  orders={orders}
                  onUpdateStatus={handleUpdateOrderStatus}
                />
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
                  salesData={reports.sales}
                  revenueData={reports.revenue}
                  ordersData={reports.orders}
                  deliveryPerformanceData={reports.delivery}
                />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}