import { defineStore } from "pinia";
import { ref } from "vue";

export const useErrorStore = defineStore("error", () => {
const error = ref(null);

const setApiError=(data)=>{
  error.value=data
}

return {  
  error,
  setApiError
}
});