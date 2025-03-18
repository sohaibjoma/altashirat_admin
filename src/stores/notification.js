import { defineStore } from "pinia";
import { ref } from "vue";

export const useNotificationStore = defineStore("notification", () => {
  const message = ref(null);
  const type = ref(null);

  const setNotification = (newMessage, newType = "success") => {
    message.value = newMessage;
    type.value = newType;

    setTimeout(() => {
      clearNotification();
    }, 3000);
  };

  const clearNotification = () => {
    message.value = null;
    type.value = null;
  };

  return {
    message,
    type,
    setNotification,
    clearNotification,
  };
});
