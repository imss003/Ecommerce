import {create} from "zustand";
import axios from "../lib/axios.js";
import toast from "react-hot-toast";

export const useUserStore = create((set, get) => ({
    user:null,
    loading: false,
    checkingAuth: true,
    signup: async({name, email, password, confirmPassword}) => {
        set({loading: true});
        if(password !== confirmPassword){
            set({loading: false});
            return toast.error("Password do not match");
        }
        try {
            const res = await axios.post("/auth/signup", {name, email, password});
            set({loading: false, user: res.data.user});
            return toast.success(res.data.message);
        } catch (error) {
            set({loading: false});
            toast.error(error.response.data.message || "An error occurred!!");
        }
    },
    login: async (email, password) => {
        set({ loading: true });
        try {
            const res = await axios.post("/auth/login", { email, password });
            localStorage.setItem("user", JSON.stringify(res.data.user)); // Persist user data
            set({ loading: false, user: res.data.user });
            return toast.success(res.data.message);
        } catch (error) {
            set({ loading: false });
            toast.error(error.response.data.message || "An error occurred!!");
        }
    },
    checkAuth: async () => {
        set({ checkingAuth: true });
        try {
            const response = await axios.get("/auth/profile");
            localStorage.setItem("user", JSON.stringify(response.data)); // Persist user data
            set({ user: response.data, checkingAuth: false });
        } catch (error) {
            localStorage.removeItem("user"); // Clear persisted user data
            set({ checkingAuth: false, user: null });
        }
    },
    logout: async () => {
        try {
            await axios.post("/auth/logout");
            localStorage.removeItem("user"); // Clear persisted user data
            set({ user: null });
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred during logout");
        }
    }
}));

// Axios interceptor for token refresh
let refreshPromise = null;

axios.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;
		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				// If a refresh is already in progress, wait for it to complete
				if (refreshPromise) {
					await refreshPromise;
					return axios(originalRequest);
				}

				// Start a new refresh process
				refreshPromise = useUserStore.getState().refreshToken();
				await refreshPromise;
				refreshPromise = null;

				return axios(originalRequest);
			} catch (refreshError) {
				// If refresh fails, redirect to login or handle as needed
				useUserStore.getState().logout();
				return Promise.reject(refreshError);
			}
		}
		return Promise.reject(error);
	}
);