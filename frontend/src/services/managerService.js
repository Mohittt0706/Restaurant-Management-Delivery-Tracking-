import { apiFetch } from './api';

const json = (p) => apiFetch(p, { auth: true });
const send = (p, method, body) => apiFetch(p, { method, body, auth: true });

export const managerService = {
  // Dashboard
  getDashboard: () => json('/api/manager/dashboard'),

  // Orders
  getOrders: (status) => json(`/api/manager/orders${status ? `?status=${status}` : ''}`),
  getOrderDetails: (id) => json(`/api/orders/${id}`),
  updateOrderStatus: (id, status) => send(`/api/orders/${id}/status`, 'PATCH', { status }),

  // Menu
  getMenuItems: () => json('/api/menu'),
  getCategories: () => json('/api/categories'),
  createMenuItem: (data) => send('/api/menu', 'POST', data),
  updateMenuItem: (id, data) => send(`/api/menu/${id}`, 'PUT', data),
  toggleMenuItemAvailability: (id, availability) => send(`/api/menu/${id}/availability`, 'PATCH', { availability }),
  deleteMenuItem: (id) => send(`/api/menu/${id}`, 'DELETE'),

  // Kitchen
  getKitchenOrders: () => json('/api/kitchen/orders'),
  kitchenAcceptOrder: (id) => send(`/api/kitchen/orders/${id}/accept`, 'PATCH'),
  kitchenMarkReady: (id) => send(`/api/kitchen/orders/${id}/ready`, 'PATCH'),

  // Delivery
  getDeliveryPartners: () => json('/api/manager/delivery-partners'),
  addDeliveryPartner: (data) => send('/api/manager/delivery-partners', 'POST', data),
  assignDelivery: (orderId, deliveryPartnerId) =>
    send(`/api/manager/deliveries/${orderId}/assign`, 'POST', { deliveryPartnerId }),

  // Payments & Invoices
  getInvoices: () => json('/api/invoices'),

  // Reports
  getSalesReport: () => json('/api/reports/sales'),
  getRevenueReport: () => json('/api/reports/revenue'),
  getOrdersReport: () => json('/api/reports/orders'),
  getDeliveryPerformanceReport: () => json('/api/reports/delivery-performance'),
};