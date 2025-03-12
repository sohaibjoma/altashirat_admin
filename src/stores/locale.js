import { defineStore } from "pinia";
import { ref } from "vue";

export const useLocaleStore = defineStore("locale", ()=> {

  const locale = ref(localStorage.getItem("locale")||"en");


  function setLocale(newVal){
    locale.value = newVal;
  }

  return { locale, setLocale };
});

