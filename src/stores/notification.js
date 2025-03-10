import { defineStore } from "pinia";
import { ref } from "vue";

export const useNotificationStore = defineStore("notification", () => {
  const isSuccess = ref(false);
  const isError = ref(false);
  const visible = ref(false);

  const setNotification = (type) => {
    console.log("setNotification called with:", type); // Debug log
  
    if (type === "success") {
      isSuccess.value = true;
      isError.value = false;
    } else if (type === "error") {
      isError.value = true;
      isSuccess.value = false;
    }
  
    visible.value = true;
  
    setTimeout(() => {
      clearNotification();
    }, 3000);
  };
  

  const clearNotification = () => {
    isSuccess.value = false;
    isError.value = false;
    visible.value = false;
  };

  return {
    visible,
    isSuccess,
    isError,
    setNotification,
    clearNotification,
  };
});
