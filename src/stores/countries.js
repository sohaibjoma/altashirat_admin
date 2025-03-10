import { defineStore } from "pinia";
import { ref } from "vue";
import { useApi } from "../composables/api"; // Adjust path if needed

export const useCountriesStore = defineStore("countries", () => {
  const countries = ref([]);
  const { GET } = useApi();

  // Fetch all countries
  const fetchAllCountries = async () => {
    try {
      const response = await GET("/countries?pagination=all");
      countries.value = response.data.data || [];
    } catch (error) {
      console.error("Error fetching all countries:", error);
    }
  };

  // Fetch paginated countries
  const fetchPaginatedCountries = async (page = 1) => {
    try {
      const response = await GET(`/countries?page=${page}`);
      countries.value = response.data.data || [];
    } catch (error) {
      console.error("Error fetching paginated countries:", error);
    }
  };

  // Extract country codes (flag + phone code)
  const getCountryCodes = () => {
    return countries.value.map((item) => ({
      flag: item.flag, 
      code: item.phone_code, 
    }));
  }

  return {
    countries,
    fetchAllCountries,
    fetchPaginatedCountries,
    getCountryCodes,
  };
});
