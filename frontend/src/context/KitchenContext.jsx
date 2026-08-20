import { createContext, useContext, useReducer, useCallback } from 'react';

const KitchenContext = createContext(null);

const STATUSES = {
  NEW: 'new',
  PREPARING: 'preparing',
  READY: 'ready',
};

function kitchenReducer(state, action) {
  switch (action.type) {
    case 'ACCEPT_ORDER': {
      const order = state.orders.find((o) => o.id === action.payload);
      if (!order || order.status !== STATUSES.NEW) return state;
      return {
        ...state,
        orders: state.orders.map((o) =>
          o.id === action.payload
            ? { ...o, status: STATUSES.PREPARING, acceptedAt: Date.now() }
            : o
        ),
      };
    }
    case 'MARK_READY': {
      const order = state.orders.find((o) => o.id === action.payload);
      if (!order || order.status !== STATUSES.PREPARING) return state;
      return {
        ...state,
        orders: state.orders.map((o) =>
          o.id === action.payload
            ? {
                ...o,
                status: STATUSES.READY,
                readyAt: Date.now(),
                preparationTime: Date.now() - o.acceptedAt,
              }
            : o
        ),
      };
    }
    case 'SET_ORDERS': {
      return { ...state, orders: action.payload, loading: false };
    }
    case 'SET_LOADING': {
      return { ...state, loading: action.payload };
    }
    case 'SET_ERROR': {
      return { ...state, error: action.payload, loading: false };
    }
    default:
      return state;
  }
}

const initialState = {
  orders: [],
  loading: true,
  error: null,
};

export function KitchenProvider({ children }) {
  const [state, dispatch] = useReducer(kitchenReducer, initialState);

  const acceptOrder = useCallback((orderId) => {
    dispatch({ type: 'ACCEPT_ORDER', payload: orderId });
  }, []);

  const markReady = useCallback((orderId) => {
    dispatch({ type: 'MARK_READY', payload: orderId });
  }, []);

  const setOrders = useCallback((orders) => {
    dispatch({ type: 'SET_ORDERS', payload: orders });
  }, []);

  const setLoading = useCallback((loading) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  }, []);

  const setError = useCallback((error) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, []);

  const newOrders = state.orders.filter((o) => o.status === STATUSES.NEW);
  const preparingOrders = state.orders.filter((o) => o.status === STATUSES.PREPARING);
  const readyOrders = state.orders.filter((o) => o.status === STATUSES.READY);

  return (
    <KitchenContext.Provider
      value={{
        ...state,
        newOrders,
        preparingOrders,
        readyOrders,
        acceptOrder,
        markReady,
        setOrders,
        setLoading,
        setError,
      }}
    >
      {children}
    </KitchenContext.Provider>
  );
}

export function useKitchen() {
  const context = useContext(KitchenContext);
  if (!context) {
    throw new Error('useKitchen must be used within a KitchenProvider');
  }
  return context;
}

export { STATUSES };
