import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,

            login: async (email, password) => {
                try {
                    const res = await fetch("/api/auth/login", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ email, password }),
                    });

                    const data = await res.json();

                    if (!data.success) {
                        return { success: false, message: data.message };
                    }

                    set({
                        user: data.data,
                        token: data.data.token,
                        isAuthenticated: true,
                    });

                    return { success: true, message: "Login successful" };
                } catch (error) {
                    return { success: false, message: "Network error. Please try again." };
                }
            },

            register: async (name, email, password) => {
                try {
                    const res = await fetch("/api/auth/register", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ name, email, password }),
                    });

                    const data = await res.json();

                    if (!data.success) {
                        return { success: false, message: data.message };
                    }

                    set({
                        user: data.data,
                        token: data.data.token,
                        isAuthenticated: true,
                    });

                    return { success: true, message: "Registration successful" };
                } catch (error) {
                    return { success: false, message: "Network error. Please try again." };
                }
            },

            logout: () => {
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                });
            },

            getAuthHeaders: () => {
                const state = useAuthStore.getState();
                return {
                    "Content-Type": "application/json",
                    ...(state.token && { Authorization: `Bearer ${state.token}` }),
                };
            },

            deleteAccount: async () => {
                const { getAuthHeaders } = useAuthStore.getState();
                try {
                    const headers = getAuthHeaders();
                    const res = await fetch("/api/auth/me", {
                        method: "DELETE",
                        headers,
                    });

                    const data = await res.json();

                    if (data.success) {
                        set({
                            user: null,
                            token: null,
                            isAuthenticated: false,
                        });
                        return { success: true, message: data.message };
                    } else {
                        return { success: false, message: data.message };
                    }
                } catch (error) {
                    return { success: false, message: "Network error. Please try again." };
                }
            },
        }),
        {
            name: "auth-storage",
        }
    )
);
