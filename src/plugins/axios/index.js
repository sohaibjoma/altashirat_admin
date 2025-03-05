import axios from "axios";

const token = localStorage.getItem("userToken");
import { useAppLocale } from "../../store/appLocale";


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
  (response) => response,
  (error) => {
    throw error
    Promise.reject(error)
  }
);

export default AxiosInstance
