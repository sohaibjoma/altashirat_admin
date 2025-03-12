<template>
  <v-container v-if="setting">
    <v-card class="pa-5">
      <v-card-title></v-card-title>
      <v-card-text>
        <LocaleSelector
          :hint="$t('actions.language')"
          name="locale"
          rules="required"
          v-model="formData.locale"
          :label="$t('actions.language')"
        />
      </v-card-text>
      <v-card-actions>
        <MainButton
          color="secondary"
          width="135px"
          class="me-5"
          type="submit"
          @click="updateSetting"
        >
          Save
        </MainButton>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useApi } from "../../../composables/api";
import { useI18n } from "vue-i18n";

const { GET, POST } = useApi();
const route = useRoute();
const router = useRouter();
const { t } = useI18n();

const setting = ref(null);
const formData = ref({ value: "", locale: "en" });

const fetchSetting = async () => {
  try {
    const response = await GET(`admin-panel/settings/${route.params.id}`);
    if (response?.data) {
      setting.value = { ...response.data };
      formData.value = { value: response.data.value };
    console.log(setting.value.key);
    }
  } catch (error) {
    console.error("Error fetching setting:", error);
  }
};

onMounted(fetchSetting);

// Format setting key for display (with null check)
const formattedKey = computed(() => setting.value?.key?.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()) || "");

let settingID = route.params.id
const updateSetting = async () => {
  await POST(`admin-panel/settings/${settingID}`, {
    value: formData.value.value,
    locale: formData.value.locale,
  });
  router.push("/settings");
};
</script>

<style scoped></style>