import axios from "axios";

const token = localStorage.getItem("userToken");
import { useAppLocale } from "../../store/appLocale";
import { useErrorStore } from "../../stores/errors";
import { useNotificationStore } from "../../stores/notification";


const AxiosInstance = axios.create({
  baseURL: "https://intern.api.altashirat.solutionplus.net/api",
  headers:{
    Authorization:token? `Bearer ${token}` : "",
  } 
});

AxiosInstance.interceptors.request.use(
  (config) => {
    const usedAppLocale = useAppLocale();
    config.headers["x-locale"]= localStorage.getItem("locale") || usedAppLocale.appLocale
    console.log(config);
    return config;
  },
  (error) => Promise.reject(error)
);

AxiosInstance.interceptors.response.use(
  (response) => {
    const errorStore = useErrorStore();
    const notificationStore = useNotificationStore();
    if (response.data.errors) {
      if(response.data.errors.status === 409){
      errorStore.setApiError(response.data.errors); 
      }  
      else if(response.data.errors.status === 422){
        errorStore.setApiError(response.data.errors); 
      }
    }
    if (response.data.message) {
      notificationStore.setNotification("sucess"); 
    }
    return response 
  },
  (error) => {
    Promise.reject(error)
  }
);

export default AxiosInstance
