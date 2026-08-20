import { createContext, useContext, useReducer, useCallback } from 'react';

const CartContext = createContext(null);

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const { item, quantity } = action.payload;
      const existing = state.items.find((i) => i.productId === item.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.productId === item.id
              ? {
                  ...i,
                  quantity: i.quantity + quantity,
                  subtotal: (i.quantity + quantity) * i.price,
                }
              : i
          ),
        };
      }
      return {
        ...state,
        items: [
          ...state.items,
          {
            productId: item.id,
            name: item.name,
            image: item.image,
            price: item.price,
            quantity,
            subtotal: item.price * quantity,
          },
        ],
      };
    }
    case 'INCREMENT': {
      return {
        ...state,
        items: state.items.map((i) =>
          i.productId === action.payload
            ? { ...i, quantity: i.quantity + 1, subtotal: (i.quantity + 1) * i.price }
            : i
        ),
      };
    }
    case 'DECREMENT': {
      return {
        ...state,
        items: state.items.map((i) =>
          i.productId === action.payload && i.quantity > 1
            ? { ...i, quantity: i.quantity - 1, subtotal: (i.quantity - 1) * i.price }
            : i
        ),
      };
    }
    case 'REMOVE': {
      return {
        ...state,
        items: state.items.filter((i) => i.productId !== action.payload),
      };
    }
    case 'SET_SPECIAL_PREFERENCE': {
      return { ...state, specialPreference: action.payload };
    }
    case 'SET_CUTLERY': {
      return { ...state, cutleryRequired: action.payload };
    }
    case 'RESET_CART': {
      return initialState;
    }
    default:
      return state;
  }
}

const initialState = {
  items: [],
  specialPreference: '',
  cutleryRequired: false,
};

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, initialState);

  const addToCart = useCallback((item, quantity) => {
    dispatch({ type: 'ADD_TO_CART', payload: { item, quantity } });
  }, []);

  const increment = useCallback((productId) => {
    dispatch({ type: 'INCREMENT', payload: productId });
  }, []);

  const decrement = useCallback((productId) => {
    dispatch({ type: 'DECREMENT', payload: productId });
  }, []);

  const removeItem = useCallback((productId) => {
    dispatch({ type: 'REMOVE', payload: productId });
  }, []);

  const setSpecialPreference = useCallback((value) => {
    dispatch({ type: 'SET_SPECIAL_PREFERENCE', payload: value });
  }, []);

  const setCutlery = useCallback((value) => {
    dispatch({ type: 'SET_CUTLERY', payload: value });
  }, []);

  const resetCart = useCallback(() => {
    dispatch({ type: 'RESET_CART' });
  }, []);

  const total = cart.items.reduce((sum, item) => sum + item.subtotal, 0);
  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        ...cart,
        total,
        itemCount,
        addToCart,
        increment,
        decrement,
        removeItem,
        setSpecialPreference,
        setCutlery,
        resetCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
