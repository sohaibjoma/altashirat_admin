import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";
import { useApi } from "../composables/api";

export const useSettingsStore = defineStore("settings", () => {
  const { GET} = useApi();
  const settings = ref([]);
  const singleSetting = ref(null);
  const loading = ref(false);

  // Fetch all settings
  const fetchSettings = async () => {
    loading.value = true;
    try {
      const response = await GET("admin-panel/settings?pagination=all");
      if (response.data?.data) {
        settings.value = response.data.data;
      } else {
        console.error("Unexpected API response structure:", response.data);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      loading.value = false;
    }
  };

  // Convert settings array to an object (computed property)
  const settingsObject = computed(() => {
    return settings.value.reduce((acc, setting) => {
      acc[setting.id] = setting.value;
      return acc;
    }, {});
  });


  return { settings, loading, fetchSettings, settingsObject };
});
