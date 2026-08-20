import { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { kitchenService } from '../services/kitchenService';

const KitchenContext = createContext(null);

const STATUSES = {
  NEW: 'new',
  PREPARING: 'preparing',
  READY: 'ready',
};

function kitchenReducer(state, action) {
  switch (action.type) {
    case 'SET_NEW_ORDERS':
      return { ...state, newOrders: action.payload };
    case 'SET_PREPARING_ORDERS':
      return { ...state, preparingOrders: action.payload };
    case 'SET_READY_ORDERS':
      return { ...state, readyOrders: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'MOVE_TO_PREPARING': {
      const { orderId, updatedOrder } = action.payload;
      return {
        ...state,
        newOrders: state.newOrders.filter((o) => o.id !== orderId),
        preparingOrders: [
          ...state.preparingOrders.filter((o) => o.id !== orderId),
          updatedOrder,
        ],
      };
    }
    case 'MOVE_TO_READY': {
      const { orderId, updatedOrder } = action.payload;
      return {
        ...state,
        preparingOrders: state.preparingOrders.filter((o) => o.id !== orderId),
        readyOrders: [
          ...state.readyOrders.filter((o) => o.id !== orderId),
          updatedOrder,
        ],
      };
    }
    default:
      return state;
  }
}

const initialState = {
  newOrders: [],
  preparingOrders: [],
  readyOrders: [],
  loading: true,
  error: null,
};

export function KitchenProvider({ children }) {
  const [state, dispatch] = useReducer(kitchenReducer, initialState);

  const fetchAllOrders = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const [newRes, prepRes, readyRes] = await Promise.all([
        kitchenService.getNewOrders().catch(() => []),
        kitchenService.getPreparingOrders().catch(() => []),
        kitchenService.getReadyOrders().catch(() => []),
      ]);

      dispatch({ type: 'SET_NEW_ORDERS', payload: newRes });
      dispatch({ type: 'SET_PREPARING_ORDERS', payload: prepRes });
      dispatch({ type: 'SET_READY_ORDERS', payload: readyRes });
      dispatch({ type: 'SET_ERROR', payload: null });
    } catch (err) {
      console.error('Error fetching kitchen orders:', err);
      dispatch({ type: 'SET_ERROR', payload: 'Unable to load kitchen orders.' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  useEffect(() => {
    fetchAllOrders();
  }, [fetchAllOrders]);

  const acceptOrder = useCallback(async (orderId) => {
    try {
      const updated = await kitchenService.acceptOrder(orderId);
      if (updated) {
        dispatch({
          type: 'MOVE_TO_PREPARING',
          payload: { orderId, updatedOrder: updated },
        });
      } else {
        await fetchAllOrders();
      }
      return { success: true };
    } catch (err) {
      console.error('Accept order error:', err);
      const msg = err?.message || 'Unable to accept order. Please try again.';
      return { success: false, message: msg };
    }
  }, [fetchAllOrders]);

  const markReady = useCallback(async (orderId) => {
    try {
      const updated = await kitchenService.markOrderReady(orderId);
      if (updated) {
        dispatch({
          type: 'MOVE_TO_READY',
          payload: { orderId, updatedOrder: updated },
        });
      } else {
        await fetchAllOrders();
      }
      return { success: true };
    } catch (err) {
      console.error('Mark ready error:', err);
      const msg = err?.message || 'Unable to mark order ready. Please try again.';
      return { success: false, message: msg };
    }
  }, [fetchAllOrders]);

  return (
    <KitchenContext.Provider
      value={{
        ...state,
        orders: [...state.newOrders, ...state.preparingOrders, ...state.readyOrders],
        acceptOrder,
        markReady,
        refreshOrders: fetchAllOrders,
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
