import { create } from "zustand";
import { useAuthStore } from "./auth";

export const useOrderStore = create((set) => ({
    orders: [],
    order: null,
    loading: false,

    createOrder: async (shippingAddress, paymentMethod) => {
        const { getAuthHeaders } = useAuthStore.getState();
        set({ loading: true });
        try {
            const headers = getAuthHeaders();
            const res = await fetch("/api/orders", {
                method: "POST",
                headers,
                body: JSON.stringify({ shippingAddress, paymentMethod }),
            });

            const data = await res.json();

            if (data.success) {
                set({ order: data.data, loading: false });
                return { success: true, data: data.data, message: "Order placed successfully!" };
            } else {
                set({ loading: false });
                return { success: false, message: data.message };
            }
        } catch (error) {
            set({ loading: false });
            return { success: false, message: "Network error. Please try again." };
        }
    },

    fetchOrders: async () => {
        const { getAuthHeaders, isAuthenticated } = useAuthStore.getState();
        
        if (!isAuthenticated) {
            return;
        }

        set({ loading: true });
        try {
            const headers = getAuthHeaders();
            const res = await fetch("/api/orders", {
                headers,
            });

            const data = await res.json();

            if (data.success) {
                set({ orders: data.data, loading: false });
            } else {
                set({ loading: false });
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
            set({ loading: false });
        }
    },

    fetchOrder: async (orderId) => {
        const { getAuthHeaders } = useAuthStore.getState();
        set({ loading: true });
        try {
            const headers = getAuthHeaders();
            const res = await fetch(`/api/orders/${orderId}`, {
                headers,
            });

            const data = await res.json();

            if (data.success) {
                set({ order: data.data, loading: false });
            } else {
                set({ loading: false });
            }
        } catch (error) {
            console.error("Error fetching order:", error);
            set({ loading: false });
        }
    },
}));
