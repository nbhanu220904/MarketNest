import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:4000/api",
    withCredentials: true
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

API.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const { data } = await axios.post(
                    "http://localhost:4000/api/auth/refresh",
                    {},
                    { withCredentials: true }
                );
                localStorage.setItem("accessToken", data.accessToken);
                originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
                return API(originalRequest);
            } catch (err) {
                // Refresh token expired or invalid
                localStorage.removeItem("accessToken");
                localStorage.removeItem("userInfo");
                window.location.href = "/login";
                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    }
);

export default API;
