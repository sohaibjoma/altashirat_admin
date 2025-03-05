
import AxiosInstance from "../plugins/axios";
import { ref } from "vue";

export function useApi() {
  const loading = ref(false);
  const api = AxiosInstance;

  const GET = async(endpoint) =>{
    try{
      loading.value = true;
      const response = await api.get(endpoint);
      return response;
    }catch(err){
      console.log("API Error:", err.response.data);
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

  return {
    loading,
    GET,
    POST,
    DELETE
  }
}