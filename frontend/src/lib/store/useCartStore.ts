import { create } from 'zustand';
import { Product } from '@/lib/data/products';

export interface CartItem {
  product: Product;
  quantity: number;
  customImages?: (string | null)[]; // Array of Data URLs, length matches quantity
  customTexts?: (string | null)[]; // Array of custom text strings, length matches quantity
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  
  // Actions
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  setCustomImage: (productId: string, imageIndex: number, imageStr: string) => void;
  setCustomText: (productId: string, textIndex: number, text: string) => void;
  syncProducts: (products: Product[]) => void;
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
              const newCustomTexts = item.customTexts ? [...item.customTexts] : Array(item.quantity).fill(null);
              // Append new nulls for the added quantity
              for (let i = 0; i < quantity; i++) {
                newCustomImages.push(null);
                newCustomTexts.push(null);
              }
              return { ...item, quantity: newQuantity, customImages: newCustomImages, customTexts: newCustomTexts };
            }
            return item;
          }),
          isOpen: true // auto open cart on add
        };
      }
      
      return { 
        items: [
          ...state.items, 
          { 
            product, 
            quantity, 
            customImages: Array(quantity).fill(null),
            customTexts: Array(quantity).fill(null),
          }
        ],
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
          let newCustomTexts = item.customTexts ? [...item.customTexts] : Array(item.quantity).fill(null);
          
          if (newQty > newCustomImages.length) {
            // pad with nulls
            const diff = newQty - newCustomImages.length;
            for (let i = 0; i < diff; i++) {
              newCustomImages.push(null);
              newCustomTexts.push(null);
            }
          } else if (newQty < newCustomImages.length) {
            // truncate
            newCustomImages = newCustomImages.slice(0, newQty);
            newCustomTexts = newCustomTexts.slice(0, newQty);
          }
          
          return { ...item, quantity: newQty, customImages: newCustomImages, customTexts: newCustomTexts };
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

  setCustomText: (productId, textIndex, text) => {
    set((state) => ({
      items: state.items.map(item => {
        if (item.product.id === productId) {
          const newTexts = item.customTexts ? [...item.customTexts] : Array(item.quantity).fill(null);
          newTexts[textIndex] = text;
          return { ...item, customTexts: newTexts };
        }
        return item;
      })
    }));
  },

  syncProducts: (products) => {
    if (products.length === 0) return;

    set((state) => {
      const productMap = new Map(products.map((product) => [product.id, product]));
      return {
        items: state.items
          .filter((item) => productMap.has(item.product.id))
          .map((item) => ({
            ...item,
            product: productMap.get(item.product.id) || item.product,
          })),
      };
    });
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
