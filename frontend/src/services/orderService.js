import { apiFetch } from './api';

export async function createOrder({ addressText, paymentMethod, notes }) {
  const res = await apiFetch('/api/orders', {
    method: 'POST',
    body: { addressText, paymentMethod, notes },
    auth: true,
  });
  return res.data;
}

export async function getMyOrders() {
  const res = await apiFetch('/api/orders/my', { auth: true });
  return res.data;
}

export async function getOrderById(orderId) {
  const res = await apiFetch(`/api/orders/${orderId}`, { auth: true });
  return res.data;
}

export async function getOrderTracking(orderId) {
  const res = await apiFetch(`/api/orders/${orderId}/tracking`, { auth: true });
  return res.data;
}

export async function cancelOrder(orderId) {
  const res = await apiFetch(`/api/orders/${orderId}/cancel`, {
    method: 'PATCH',
    auth: true,
  });
  return res.data;
}

export async function createRazorpayOrder(orderId) {
  const res = await apiFetch('/api/payment/razorpay/create', {
    method: 'POST',
    body: { orderId },
    auth: true,
  });
  return res.data;
}

export async function verifyRazorpayPayment(payload) {
  const res = await apiFetch('/api/payment/razorpay/verify', {
    method: 'POST',
    body: payload,
    auth: true,
  });
  return res.data;
}

export async function getInvoice(orderId) {
  const res = await apiFetch(`/api/invoice/${orderId}`, { auth: true });
  return res.data;
}
