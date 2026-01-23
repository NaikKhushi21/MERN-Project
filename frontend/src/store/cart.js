import { create } from "zustand";
import { useAuthStore } from "./auth";

export const useCartStore = create((set) => ({
    cart: null,
    loading: false,

    fetchCart: async () => {
        const { getAuthHeaders, isAuthenticated } = useAuthStore.getState();
        
        if (!isAuthenticated) {
            set({ cart: null });
            return;
        }

        set({ loading: true });
        try {
            const headers = getAuthHeaders();
            const res = await fetch("/api/cart", {
                headers,
            });

            const data = await res.json();

            if (data.success) {
                set({ cart: data.data, loading: false });
            } else {
                set({ loading: false });
            }
        } catch (error) {
            console.error("Error fetching cart:", error);
            set({ loading: false });
        }
    },

    addToCart: async (productId, quantity = 1) => {
        const { getAuthHeaders, isAuthenticated } = useAuthStore.getState();
        
        if (!isAuthenticated) {
            return { success: false, message: "Please login to add items to cart" };
        }

        set({ loading: true });
        try {
            const headers = getAuthHeaders();
            const res = await fetch("/api/cart", {
                method: "POST",
                headers,
                body: JSON.stringify({ productId, quantity }),
            });

            const data = await res.json();

            if (data.success) {
                set({ cart: data.data, loading: false });
                return { success: true, message: "Item added to cart" };
            } else {
                set({ loading: false });
                return { success: false, message: data.message };
            }
        } catch (error) {
            set({ loading: false });
            return { success: false, message: "Network error. Please try again." };
        }
    },

    updateCartItem: async (itemId, quantity) => {
        const { getAuthHeaders } = useAuthStore.getState();
        set({ loading: true });
        try {
            const headers = getAuthHeaders();
            const res = await fetch(`/api/cart/${itemId}`, {
                method: "PUT",
                headers,
                body: JSON.stringify({ quantity }),
            });

            const data = await res.json();

            if (data.success) {
                set({ cart: data.data, loading: false });
                return { success: true, message: "Cart updated" };
            } else {
                set({ loading: false });
                return { success: false, message: data.message };
            }
        } catch (error) {
            set({ loading: false });
            return { success: false, message: "Network error. Please try again." };
        }
    },

    removeFromCart: async (itemId) => {
        const { getAuthHeaders } = useAuthStore.getState();
        set({ loading: true });
        try {
            const headers = getAuthHeaders();
            const res = await fetch(`/api/cart/${itemId}`, {
                method: "DELETE",
                headers,
            });

            const data = await res.json();

            if (data.success) {
                set({ cart: data.data, loading: false });
                return { success: true, message: "Item removed from cart" };
            } else {
                set({ loading: false });
                return { success: false, message: data.message };
            }
        } catch (error) {
            set({ loading: false });
            return { success: false, message: "Network error. Please try again." };
        }
    },

    clearCart: async () => {
        const { getAuthHeaders } = useAuthStore.getState();
        set({ loading: true });
        try {
            const headers = getAuthHeaders();
            const res = await fetch("/api/cart", {
                method: "DELETE",
                headers,
            });

            const data = await res.json();

            if (data.success) {
                set({ cart: { ...data.data, items: [] }, loading: false });
                return { success: true, message: "Cart cleared" };
            } else {
                set({ loading: false });
                return { success: false, message: data.message };
            }
        } catch (error) {
            set({ loading: false });
            return { success: false, message: "Network error. Please try again." };
        }
    },

    getCartTotal: () => {
        const { cart } = useCartStore.getState();
        if (!cart || !cart.items) return 0;
        return cart.items.reduce((total, item) => {
            if (item.product && item.product.price) {
                return total + item.product.price * item.quantity;
            }
            return total;
        }, 0);
    },

    getCartItemCount: () => {
        const { cart } = useCartStore.getState();
        if (!cart || !cart.items) return 0;
        return cart.items.reduce((total, item) => total + item.quantity, 0);
    },
}));
