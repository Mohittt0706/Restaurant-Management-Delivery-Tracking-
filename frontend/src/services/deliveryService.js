import { apiFetch } from './api';

const json = (p) => apiFetch(p, { auth: true });
const patch = (p) => apiFetch(p, { method: 'PATCH', auth: true });

export const deliveryService = {
  getDashboard: () => json('/api/delivery/dashboard'),
  getMyOrders: () => json('/api/delivery/my-orders'),
  getMyOrder: (id) => json(`/api/delivery/my-orders/${id}`),
  getMyActiveDelivery: () => json('/api/delivery/my-active'),

  acceptOrder: (id) => patch(`/api/delivery/my-orders/${id}/accept`),
  pickupOrder: (id) => patch(`/api/delivery/my-orders/${id}/pickup`),
  markOutForDelivery: (id) => patch(`/api/delivery/my-orders/${id}/out-for-delivery`),
  deliverOrder: (id) => patch(`/api/delivery/my-orders/${id}/deliver`),
};