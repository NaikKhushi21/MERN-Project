import { create } from "zustand";
import { useAuthStore } from "./auth";

export const useReviewStore = create((set) => ({
    reviews: [],
    loading: false,

    fetchReviews: async (productId) => {
        set({ loading: true });
        try {
            const res = await fetch(`/api/reviews/products/${productId}/reviews`);
            const data = await res.json();

            if (data.success) {
                set({ reviews: data.data, loading: false });
            } else {
                set({ loading: false });
            }
        } catch (error) {
            console.error("Error fetching reviews:", error);
            set({ loading: false });
        }
    },

    createReview: async (productId, rating, comment) => {
        const { getAuthHeaders, isAuthenticated } = useAuthStore.getState();
        
        if (!isAuthenticated) {
            return { success: false, message: "Please login to leave a review" };
        }

        set({ loading: true });
        try {
            const headers = getAuthHeaders();
            const res = await fetch(`/api/reviews/products/${productId}/reviews`, {
                method: "POST",
                headers,
                body: JSON.stringify({ rating, comment }),
            });

            const data = await res.json();

            if (data.success) {
                set((state) => ({
                    reviews: [data.data, ...state.reviews],
                    loading: false,
                }));
                return { success: true, message: "Review added successfully" };
            } else {
                set({ loading: false });
                return { success: false, message: data.message };
            }
        } catch (error) {
            set({ loading: false });
            return { success: false, message: "Network error. Please try again." };
        }
    },

    updateReview: async (reviewId, rating, comment) => {
        const { getAuthHeaders } = useAuthStore.getState();
        set({ loading: true });
        try {
            const headers = getAuthHeaders();
            const res = await fetch(`/api/reviews/${reviewId}`, {
                method: "PUT",
                headers,
                body: JSON.stringify({ rating, comment }),
            });

            const data = await res.json();

            if (data.success) {
                set((state) => ({
                    reviews: state.reviews.map((review) =>
                        review._id === reviewId ? data.data : review
                    ),
                    loading: false,
                }));
                return { success: true, message: "Review updated successfully" };
            } else {
                set({ loading: false });
                return { success: false, message: data.message };
            }
        } catch (error) {
            set({ loading: false });
            return { success: false, message: "Network error. Please try again." };
        }
    },

    deleteReview: async (reviewId) => {
        const { getAuthHeaders } = useAuthStore.getState();
        set({ loading: true });
        try {
            const headers = getAuthHeaders();
            const res = await fetch(`/api/reviews/${reviewId}`, {
                method: "DELETE",
                headers,
            });

            const data = await res.json();

            if (data.success) {
                set((state) => ({
                    reviews: state.reviews.filter((review) => review._id !== reviewId),
                    loading: false,
                }));
                return { success: true, message: "Review deleted successfully" };
            } else {
                set({ loading: false });
                return { success: false, message: data.message };
            }
        } catch (error) {
            set({ loading: false });
            return { success: false, message: "Network error. Please try again." };
        }
    },
}));
