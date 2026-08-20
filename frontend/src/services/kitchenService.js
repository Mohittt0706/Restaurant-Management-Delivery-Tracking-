import { apiFetch } from './api';

export const kitchenService = {
  async getNewOrders() {
    const res = await apiFetch('/api/kitchen/orders/new', { auth: true });
    return (res.data || []).map(normalizeOrder);
  },

  async getPreparingOrders() {
    const res = await apiFetch('/api/kitchen/orders/preparing', { auth: true });
    return (res.data || []).map(normalizeOrder);
  },

  async getReadyOrders() {
    const res = await apiFetch('/api/kitchen/orders/ready', { auth: true });
    return (res.data || []).map(normalizeOrder);
  },

  async getKitchenOrderById(id) {
    const res = await apiFetch(`/api/kitchen/orders/${id}`, { auth: true });
    return res.data ? normalizeOrder(res.data) : null;
  },

  async acceptOrder(id) {
    const res = await apiFetch(`/api/kitchen/orders/${id}/accept`, {
      method: 'PATCH',
      auth: true,
    });
    return res.data ? normalizeOrder(res.data) : null;
  },

  async markOrderReady(id) {
    const res = await apiFetch(`/api/kitchen/orders/${id}/ready`, {
      method: 'PATCH',
      auth: true,
    });
    return res.data ? normalizeOrder(res.data) : null;
  },
};

function normalizeOrder(order) {
  if (!order) return null;
  return {
    ...order,
    id: order.id,
    displayNumber: order.orderNumber || `#${order.id.slice(0, 6)}`,
    status: (order.status || '').toLowerCase(), // 'placed', 'confirmed', 'preparing', 'ready'
    acceptedAt: order.preparationStartedAt ? new Date(order.preparationStartedAt).getTime() : null,
    readyAt: order.preparationCompletedAt ? new Date(order.preparationCompletedAt).getTime() : null,
    preparationTime:
      order.preparationStartedAt && order.preparationCompletedAt
        ? new Date(order.preparationCompletedAt).getTime() - new Date(order.preparationStartedAt).getTime()
        : null,
    paymentStatus: order.paymentStatus || (order.payment ? order.payment.status : 'PENDING'),
    specialRequirement: order.specialRequirements || order.notes || '',
    items: (order.items || []).map((i) => ({
      ...i,
      name: i.menuItem?.name || i.name || 'Food Item',
      quantity: i.quantity,
    })),
  };
}
