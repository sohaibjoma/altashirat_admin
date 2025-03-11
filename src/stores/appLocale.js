import { defineStore } from "pinia";
import { ref } from "vue";

export const useAppLocale = defineStore("appLocale", () => {
  const appLocale = ref(localStorage.getItem("appLocale") || "en");

  function setAppLocale(newVal){
    appLocale.value = newVal;
  }
  return { appLocale, setAppLocale };
});