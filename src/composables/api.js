
import AxiosInstance from "../plugins/axios";
import { ref } from "vue";

export function useApi() {
  const loading = ref(false);
  const api = AxiosInstance;

const GET = async(endpoint, options = {}) => {
  try{
    loading.value = true;
    const response = await api.get(endpoint, options);
    return response;
  }catch(err){
    console.log("API Error:", err.response?.data);
    throw err; // Re-throw to let the caller handle it
  }finally{
    loading.value = false;
  }
}

  const POST = async(endpoint,data) =>{
    try{
      loading.value = true;
      const response = await api.post(endpoint,data);
      return response;
    } catch (err) {
      console.log("API Error:", err.response.data);
    } finally {
      loading.value = false;
    }
  }

  const DELETE = async(endpoint) =>{
    try{
      loading.value = true;
      const response = await api.delete(endpoint);
      return response;
    } catch (err) {
      console.log("API Error:", err.response.data);
    } finally {
      loading.value = false;
    }
  }

const GETByLocale = async (endpoint, locale) => {
  return GET(endpoint, { headers: { "x-locale": locale } });
};
  const UPDATEBothLocales = async (endpoint, valueToUpdate) => {
    try {
      loading.value = true;
      const locales = ['ar', 'en'];
      
      const responses = await Promise.all(
        locales.map(locale => {
          const payload = new FormData();
          payload.append("_method", "put");
          payload.append("locale", locale);
          payload.append("value", valueToUpdate); // Changed from data.value.value to valueToUpdate
          return api.post(endpoint, payload);
        })
      );
      
      return responses; // Returns an array of [arResponse, enResponse]
    } catch (err) {
      console.error("API Error:", err.response?.data);
      throw err; // Re-throw to let the caller handle it
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    GET,
    POST,
    DELETE,
    GETByLocale,
    UPDATEBothLocales
  }
}