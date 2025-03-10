import { defineStore } from "pinia";
import { ref } from "vue";

export const useErrorStore = defineStore("error", () => {
  const errors = ref({});

  const setErrors = (newErrors) => {
    errors.value = newErrors;
  };

  const clearErrors = () => {
    errors.value = {};
  };

  const getErrorsForField = (fieldName) => {
    return errors.value[fieldName] || [];
  };

  return {
    errors,
    setErrors,
    clearErrors,
    getErrorsForField,
  };
});
