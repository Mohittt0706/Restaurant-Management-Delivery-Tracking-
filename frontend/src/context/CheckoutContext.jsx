import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const CheckoutContext = createContext(null);

const initialState = {
  fullName: '',
  phone: '',
  address: '',
  paymentMethod: null,
  orderId: null,
  orderNumber: null,
  invoiceData: null,
};

export function CheckoutProvider({ children }) {
  const [checkout, setCheckout] = useState(initialState);

  const setCustomerDetails = useCallback(({ fullName, phone, address }) => {
    setCheckout((prev) => ({ ...prev, fullName, phone, address }));
  }, []);

  const setPaymentMethod = useCallback((method) => {
    setCheckout((prev) => ({ ...prev, paymentMethod: method }));
  }, []);

  const setOrderConfirmed = useCallback(({ orderId, orderNumber }) => {
    setCheckout((prev) => ({ ...prev, orderId, orderNumber }));
  }, []);

  const setInvoiceData = useCallback((data) => {
    setCheckout((prev) => ({ ...prev, invoiceData: data }));
  }, []);

  const resetCheckout = useCallback(() => {
    setCheckout(initialState);
  }, []);

  const value = useMemo(
    () => ({
      ...checkout,
      setCustomerDetails,
      setPaymentMethod,
      setOrderConfirmed,
      setInvoiceData,
      resetCheckout,
    }),
    [checkout, setCustomerDetails, setPaymentMethod, setOrderConfirmed, setInvoiceData, resetCheckout],
  );

  return <CheckoutContext.Provider value={value}>{children}</CheckoutContext.Provider>;
}

export function useCheckout() {
  const context = useContext(CheckoutContext);
  if (!context) {
    throw new Error('useCheckout must be used within a CheckoutProvider');
  }
  return context;
}
