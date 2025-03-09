import { defineStore } from "pinia";
import { ref } from "vue";

export const useNotificationStore = defineStore("notification", () => {
const notification = ref(null);

const setNotification=(data)=>{
  notification.value=data
}

return {  
  notification,
  setNotification
}
});