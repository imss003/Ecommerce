import {create} from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios";

export const useProductStore = create((set) => ({
    products: new Array(),
    loading: false,
    setProducts: (product) => set({product}),

    createProduct: async (productData) => {
        set({loading: true});
        try {
            const res = await axios.post("/product/", productData);
            
            set((prevState) => {
                // console.log("prevstate in createProduct is: ", prevState);
                // console.log("response in createProduct is: ", res.data);
                return {
                    products: [...prevState.products, res.data],
                    loading: false
                }
            });
            toast.success("Product created successfully!!");
        } catch (error) {
            console.log("Error in createProduct in product store: ", error);
            toast.error("error in product store: ", error);
            set({loading: false});
        }
    },
    deleteProduct: async(productId) => {
        set({loading: true});
        try {
            await axios.post(`/product/${productId}`);
            set((prevState) =>({
                products: prevState.products.filter((product) => product._id !== productId),
                loading: false
            }));
            toast.success("Product deleted successfully!!");
        } catch (error) {
            set({loading: true});
            console.log("Error in deleteProduct: ", error);
            toast.error("Something went wrong!!");
        }
    },
    fetchAllProducts: async() => {
        set({loading: true});
        try {
            const response = await axios.get("/product/");
            // console.log("response in fetchAllPrducts is: ", response);
            set({products: response.data.products, loading: false});
        } catch (error) {
            set({error: "Failed to fetch products!!", loading: false});
            toast.error("Error in fetchAllProducts: ", error);
        }
    },
    toggleFeaturedProduct: async(productId) => { //will update the isFeatured prop of the product
        set({loading: true});
        console.log("Reached here");
        try {
            const response = await axios.patch(`/product/${productId}`);
            console.log("Response is: ", response.data);
            set((state) => {
                let updatedProducts = [];
                console.log("State is: ", state);
                updatedProducts = state.products.map((product) => product._id === productId ? {...product, isFeatured: response.data.isFeatured} : product);
                console.log("Updated product in toggleFeaturedProduct is: ", updatedProducts);
                return {
                    products: updatedProducts,
                    loading: false
                };
            });
            toast.success("Product feature status updated!");
        } catch (error) {
            console.log("Error in toggleFeaturedProduct: ", error);
            set({loading: false});
            toast.error(error.response.data.error || "Failed to update product");
        }
    },
    fetchProductsByCategory: async(category) => {
        set({loading: true});
        try {
            const response = await axios.get(`/product/category/${category}`);
            console.log("Response in fetchProductsByCategory is: ". response);
            set({products: response.data.products, loading: false});
        } catch (error) {
            console.log("Error in fetchProductsByCategory: ", error);
            set({loading: false});
            toast.error("Something went wrong!!");
        }
    },
    fetchFeaturedProducts: async () => {
		set({ loading: true });
		try {
			const response = await axios.get("/product/featured");
			set({ products: response.data, loading: false });
		} catch (error) {
			set({ error: "Failed to fetch products", loading: false });
			console.log("Error fetching featured products:", error);
		}
	},
}))