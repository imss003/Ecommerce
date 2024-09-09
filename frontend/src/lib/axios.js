import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.mode === "development" ? "http://localhost:8000/api" : "/api", //import.meta.mode is a way to determine the current mode in Vite.It can either be "development" or "production".
    withCredentials: true //allows to send cookies to the server and sends it for every request
});

export default axiosInstance;