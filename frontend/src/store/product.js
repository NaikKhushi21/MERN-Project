import { create } from "zustand";
import { useAuthStore } from "./auth";

export const useProductStore = create((set, get) => ({
    products: [],
    product: null,
    categories: [],
    loading: false,
    pagination: null,
    filters: {
        search: "",
        category: "",
        minPrice: "",
        maxPrice: "",
        sort: "newest",
    },

    setFilters: (filters) => set({ filters: { ...get().filters, ...filters } }),

    fetchProducts: async (params = {}) => {
        set({ loading: true });
        try {
            const { filters } = get();
            const queryParams = new URLSearchParams({
                ...filters,
                ...params,
            });

            const res = await fetch(`/api/products?${queryParams}`);
            const data = await res.json();

            if (data.success) {
                set({
                    products: data.data,
                    pagination: data.pagination,
                    loading: false,
                });
            } else {
                set({ loading: false });
            }
        } catch (error) {
            console.error("Error fetching products:", error);
            set({ loading: false });
        }
    },

    fetchProduct: async (id) => {
        set({ loading: true });
        try {
            const res = await fetch(`/api/products/${id}`);
            const data = await res.json();

            if (data.success) {
                set({ product: data.data, loading: false });
            } else {
                set({ loading: false });
            }
        } catch (error) {
            console.error("Error fetching product:", error);
            set({ loading: false });
        }
    },

    createProduct: async (newProduct, imageFile) => {
        const { getAuthHeaders } = useAuthStore.getState();
        const headers = getAuthHeaders();

        try {
            let imageUrl = newProduct.image;

            // If image file is provided, upload it
            if (imageFile) {
                const formData = new FormData();
                formData.append("image", imageFile);

                const uploadRes = await fetch("/api/products/upload", {
                    method: "POST",
                    headers: {
                        Authorization: headers.Authorization,
                    },
                    body: formData,
                });

                if (uploadRes.ok) {
                    const uploadData = await uploadRes.json();
                    imageUrl = uploadData.data.url;
                } else {
                    // If upload fails, use the image URL if provided
                    if (!newProduct.image) {
                        return { success: false, message: "Image upload failed" };
                    }
                }
            }

            const productData = {
                ...newProduct,
                image: imageUrl,
                category: newProduct.category === "" || newProduct.category === undefined ? null : newProduct.category,
                price: Number(newProduct.price),
                stock: Number(newProduct.stock) || 0,
            };

            const res = await fetch("/api/products", {
                method: "POST",
                headers,
                body: JSON.stringify(productData),
            });

            const data = await res.json();

            if (data.success) {
                set((state) => ({
                    products: [data.data, ...state.products],
                }));
                return { success: true, message: "Product created successfully" };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            return { success: false, message: "Network error. Please try again." };
        }
    },

    updateProduct: async (pid, updatedProduct) => {
        const { getAuthHeaders } = useAuthStore.getState();
        const headers = getAuthHeaders();

        try {
            // Clean the data - convert empty category to null
            const cleanedData = {
                ...updatedProduct,
                category: updatedProduct.category === "" || updatedProduct.category === undefined ? null : updatedProduct.category,
                price: Number(updatedProduct.price),
                stock: Number(updatedProduct.stock) || 0,
            };

            const res = await fetch(`/api/products/${pid}`, {
                method: "PUT",
                headers,
                body: JSON.stringify(cleanedData),
            });

            const data = await res.json();

            if (data.success) {
                set((state) => ({
                    products: state.products.map((product) =>
                        product._id === pid ? data.data : product
                    ),
                    product: state.product?._id === pid ? data.data : state.product,
                }));
                return { success: true, message: "Product updated successfully" };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            return { success: false, message: "Network error. Please try again." };
        }
    },

    deleteProduct: async (pid) => {
        const { getAuthHeaders } = useAuthStore.getState();
        const headers = getAuthHeaders();

        try {
            const res = await fetch(`/api/products/${pid}`, {
                method: "DELETE",
                headers,
            });

            const data = await res.json();

            if (data.success) {
                set((state) => ({
                    products: state.products.filter((product) => product._id !== pid),
                    product: state.product?._id === pid ? null : state.product,
                }));
                return { success: true, message: data.message };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            return { success: false, message: "Network error. Please try again." };
        }
    },

    fetchCategories: async () => {
        try {
            const res = await fetch("/api/categories");
            const data = await res.json();

            if (data.success) {
                set({ categories: data.data });
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    },
}));
