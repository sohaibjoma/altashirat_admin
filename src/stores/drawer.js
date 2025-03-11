import { defineStore } from "pinia";
import { ref } from "vue"

export const useDrawerStore = defineStore("drawer", () => {
  const drawer = ref(localStorage.getItem("drawer") || false);

  function toggleDrawer() {
    drawer.value = !drawer.value;
    localStorage.setItem("drawer", drawer.value);
  }
  return{ drawer, toggleDrawer };
});