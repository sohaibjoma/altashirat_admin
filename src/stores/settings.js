import { defineStore } from "pinia";
import { ref } from "vue";
import { useApi } from "../composables/api";

export const useSettingsStore = defineStore("settings", () => {
  const { GET, POST } = useApi();
  const settings = ref([]);
  const loading = ref(false);

  // Fetch all settings
  const fetchSettings = async () => {
    loading.value = true;
    try {
      const response = await GET("admin-panel/settings");
      settings.value = response.data.settings; // Ensure this matches API response structure
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      loading.value = false;
    }
  };

  // Fetch a single setting by ID
  const fetchSettingById = async (id) => {
    try {
      const response = await GET(`admin-panel/settings/${id}`);
      return response.data.setting;
    } catch (error) {
      console.error("Error fetching setting:", error);
    }
  };

  // Update a setting
  const updateSetting = async (id, updatedData) => {
    try {
      const payload = new FormData();
      payload.append("_method", "put");
      Object.keys(updatedData).forEach((key) => {
        payload.append(key, updatedData[key]);
      });

      const response = await POST(`admin-panel/settings/${id}`, payload);
      await fetchSettings(); // Refresh settings after update
      return response;
    } catch (error) {
      console.error("Error updating setting:", error);
    }
  };

  return { settings, loading, fetchSettings, fetchSettingById, updateSetting };
});
