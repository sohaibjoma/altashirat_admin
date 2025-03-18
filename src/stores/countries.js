import { defineStore } from "pinia";
import { ref } from "vue";
import { useApi } from "../composables/api";

export const useCountriesStore = defineStore("countries", () => {
  const countries = ref([]);
  const { GET } = useApi();

  const fetchAllCountries = async () => {
    try {
      const response = await GET("/countries?pagination=all");
      countries.value = response.data.data || [];
    } catch (error) {
      console.error("Error fetching all countries:", error);
    }
  };

  const fetchPaginatedCountries = async (page = 1) => {
    try {
      const response = await GET(`/countries?page=${page}`);
      countries.value = response.data.data || [];
    } catch (error) {
      console.error("Error fetching paginated countries:", error);
    }
  };

  const getCountryCodes = () => {
    return countries.value.map((item) => ({
      text: item.name,
      value: item.phone_code.replace(/^\+|^00/, ""),
      code: item.code.toLowerCase(),
      flag: item.flag,
    }));
  };

  return {
    countries,
    fetchAllCountries,
    fetchPaginatedCountries,
    getCountryCodes,
  };
});
