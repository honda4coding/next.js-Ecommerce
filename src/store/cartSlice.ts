import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  totalQuantity: number;
  totalAmount: number;
}


const loadCartFromStorage = (): CartState => {
  if (typeof window === 'undefined') return { items: [], totalQuantity: 0, totalAmount: 0 };
  const savedCart = localStorage.getItem('cart');
  if (savedCart) {
    try {
      const parsed = JSON.parse(savedCart);
      return {
        items: Array.isArray(parsed.items) ? parsed.items : [],
        totalQuantity: typeof parsed.totalQuantity === 'number' ? parsed.totalQuantity : 0,
        totalAmount: typeof parsed.totalAmount === 'number' ? parsed.totalAmount : 0,
      };
    } catch (e) {
      return { items: [], totalQuantity: 0, totalAmount: 0 };
    }
  }
  return { items: [], totalQuantity: 0, totalAmount: 0 };
};


const saveCartToStorage = (state: CartState) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('cart', JSON.stringify(state));
  }
};

const initialState: CartState = loadCartFromStorage();

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItemToCart(state, action: PayloadAction<CartItem>) {
      if (!state.items) state.items = [];
      
      const newItem = action.payload;
      const existingItem = state.items.find((item) => item.id === newItem.id);
      
      if (!existingItem) {
        state.items.push({ ...newItem, quantity: 1 });
      } else {
        existingItem.quantity++;
      }
      
      state.totalQuantity = state.items.reduce((acc, item) => acc + item.quantity, 0);
      state.totalAmount = state.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      saveCartToStorage(state);
    },
    removeItemFromCart(state, action: PayloadAction<string>) {
      if (!state.items) state.items = [];
      const id = action.payload;
      const existingItem = state.items.find((item) => item.id === id);
      if (existingItem) {
        if (existingItem.quantity === 1) {
          state.items = state.items.filter((item) => item.id !== id);
        } else {
          existingItem.quantity--;
        }
      }
      state.totalQuantity = state.items.reduce((acc, item) => acc + item.quantity, 0);
      state.totalAmount = state.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      saveCartToStorage(state);
    },
    deleteFromCart(state, action: PayloadAction<string>) {
      if (!state.items) state.items = [];
      state.items = state.items.filter(item => item.id !== action.payload);
      state.totalQuantity = state.items.reduce((acc, item) => acc + item.quantity, 0);
      state.totalAmount = state.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      saveCartToStorage(state);
    },
    updateQuantity(state, action: PayloadAction<{ id: string; quantity: number }>) {
      if (!state.items) state.items = [];
      const item = state.items.find(i => i.id === action.payload.id);
      if (item && action.payload.quantity > 0) {
        item.quantity = action.payload.quantity;
      }
      state.totalQuantity = state.items.reduce((acc, item) => acc + item.quantity, 0);
      state.totalAmount = state.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      saveCartToStorage(state);
    },
    clearCart(state) {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
      saveCartToStorage(state);
    },
  },
});

export const { addItemToCart, removeItemFromCart, deleteFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
