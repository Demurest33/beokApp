import { create } from "zustand";
import { productWithOptions } from "@/types/Menu";

interface CartState {
  products: productWithOptions[];
  addProduct: (product: productWithOptions) => void;
  removeProduct: (product: productWithOptions) => void;
  addOneToProduct: (product: productWithOptions) => void;
  substracOneToProduct: (product: productWithOptions) => void;
}

const useCartStore = create<CartState>((set) => ({
  products: [],
  // Si el prodcuto ya esta en el carrito, aumentar la cantidad
  // El producto debe ser exacamnete igual para que se sume la cantidad en las opciones seleccionadas
  addProduct: (product) =>
    set((state) => {
      const existingProduct = state.products.find(
        (p) =>
          p.id === product.id &&
          JSON.stringify(p.selectedOptions) ===
            JSON.stringify(product.selectedOptions)
      );

      if (existingProduct) {
        return {
          products: state.products.map((p) =>
            p.id === product.id &&
            JSON.stringify(p.selectedOptions) ===
              JSON.stringify(product.selectedOptions)
              ? { ...p, quantity: p.quantity + 1 }
              : p
          ),
        };
      }

      return {
        products: [...state.products, product],
      };
    }),
  removeProduct: (product) =>
    set((state) => ({
      products: state.products.filter(
        (p) =>
          p.id !== product.id ||
          JSON.stringify(p.selectedOptions) !==
            JSON.stringify(product.selectedOptions)
      ),
    })),

  addOneToProduct: (product) =>
    set((state) => ({
      products: state.products.map((p) =>
        p.id === product.id &&
        JSON.stringify(p.selectedOptions) ===
          JSON.stringify(product.selectedOptions)
          ? { ...p, quantity: p.quantity + 1 }
          : p
      ),
    })),

  substracOneToProduct: (product) =>
    set((state) => ({
      products: state.products.map((p) =>
        p.id === product.id &&
        JSON.stringify(p.selectedOptions) ===
          JSON.stringify(product.selectedOptions)
          ? { ...p, quantity: Math.max(p.quantity - 1, 1) } // Evita que baje de 1
          : p
      ),
    })),
}));

export default useCartStore;
