import { create } from 'zustand';

export interface CartItem {
  product: any;
  quantity: number;
  customImages?: (string | null)[]; // Array of Data URLs, length matches quantity
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  
  // Actions
  addItem: (product: any, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  setCustomImage: (productId: string, imageIndex: number, imageStr: string) => void;
  clearCart: () => void;
  
  // Drawer state
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  
  // Derived state (getters)
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isOpen: false,

  addItem: (product, quantity = 1) => {
    set((state) => {
      const existingItem = state.items.find(item => item.product.id === product.id);
      
      if (existingItem) {
        return {
          items: state.items.map(item => {
            if (item.product.id === product.id) {
              const newQuantity = item.quantity + quantity;
              const newCustomImages = item.customImages ? [...item.customImages] : Array(item.quantity).fill(null);
              // Append new nulls for the added quantity
              for (let i = 0; i < quantity; i++) {
                newCustomImages.push(null);
              }
              return { ...item, quantity: newQuantity, customImages: newCustomImages };
            }
            return item;
          }),
          isOpen: true // auto open cart on add
        };
      }
      
      return { 
        items: [...state.items, { product, quantity, customImages: Array(quantity).fill(null) }],
        isOpen: true 
      };
    });
  },

  removeItem: (productId) => {
    set((state) => ({
      items: state.items.filter(item => item.product.id !== productId)
    }));
  },

  updateQuantity: (productId, quantity) => {
    set((state) => ({
      items: state.items.map(item => {
        if (item.product.id === productId) {
          const newQty = Math.max(1, quantity);
          let newCustomImages = item.customImages ? [...item.customImages] : Array(item.quantity).fill(null);
          
          if (newQty > newCustomImages.length) {
            // pad with nulls
            const diff = newQty - newCustomImages.length;
            for (let i = 0; i < diff; i++) newCustomImages.push(null);
          } else if (newQty < newCustomImages.length) {
            // truncate
            newCustomImages = newCustomImages.slice(0, newQty);
          }
          
          return { ...item, quantity: newQty, customImages: newCustomImages };
        }
        return item;
      })
    }));
  },

  setCustomImage: (productId, imageIndex, imageStr) => {
    set((state) => ({
      items: state.items.map(item => {
        if (item.product.id === productId) {
          const newImages = item.customImages ? [...item.customImages] : Array(item.quantity).fill(null);
          newImages[imageIndex] = imageStr;
          return { ...item, customImages: newImages };
        }
        return item;
      })
    }));
  },

  clearCart: () => set({ items: [] }),

  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

  getTotal: () => {
    const { items } = get();
    return items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  },

  getItemCount: () => {
    const { items } = get();
    return items.reduce((count, item) => count + item.quantity, 0);
  },
}));
