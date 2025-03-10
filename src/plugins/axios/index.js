import axios from "axios";
import { useAuthStore } from "../../stores/auth";
import { useNotificationStore } from "../../stores/notification";
import { useErrorStore } from "../../stores/errors";

const axiosInstance = axios.create({
  baseURL: "https://intern.api.altashirat.solutionplus.net/api",
});

axiosInstance.interceptors.request.use((config) => {
  const authStore = useAuthStore();
  const token = authStore.token;

  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const notificationStore = useNotificationStore();
    const errorStore = useErrorStore();

    errorStore.clearErrors();

    if (error.response) {
      if (error.response.status === 409 || error.response.status === 422) {
        errorStore.setErrors(error.response.data.errors);
        notificationStore.setNotification(
          "Please fix the errors in the form.",
          "error"
        );
      } else {
        console.error("API Error:", error.response);
        notificationStore.setNotification(
          "An unexpected error occurred.",
          "error"
        );
      }
    } else {
      console.error("Network Error:", error);
      notificationStore.setNotification(
        "Network issue. Please try again later.",
        "error"
      );
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
