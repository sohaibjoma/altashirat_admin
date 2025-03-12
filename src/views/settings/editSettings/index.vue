<template>
  <v-container>
    <v-card class="pa-5 rounded-lg">
      <v-card-title class="border-s-xl border-primary">
        {{ formattedKey }}
      </v-card-title>

      <!-- Show loading indicator while fetching data -->
      <v-card-text v-if="loading" class="text-center">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </v-card-text>

      <!-- Render form only when data is available -->
      <v-card-text v-else>
        <Form v-slot="{ handleSubmit }">
          <form @submit.prevent="handleSubmit(updateSetting)">
          <LocaleSelector
            name="locale"
            rules="required"
            v-model="formData.locale"
            :label="$t('actions.language')"
          />

          <TextArea
            name="value"
            rules="required"
            v-model="formData.value"
            :label="$t('settings.edit')"
          />

          <div class="text-end">
            <MainButton color="secondary" width="135px" class="me-9" type="submit">
              {{ $t("titles.edit") }}
            </MainButton>
          </div>
          </form>
        </Form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useApi } from "../../../composables/api";
import { t } from "../../../plugins/i18n";

const { GET, POST } = useApi();
const route = useRoute();
const router = useRouter();

const settingID = ref("");
const setting = ref(null);
const loading = ref(true); // Track loading state

const formData = ref({
  value: "",
  locale: "",
});

const fetchSetting = async () => {
  try {
    const response = await GET(`admin-panel/settings/${settingID.value}`);

    console.log("Full API Response:", response);

    if (response.data.setting) {
      setting.value = response.data.setting;
    }
  } catch (error) {
    console.error("Error fetching setting:", error);
  } finally {
    loading.value = false; 
    formData.value.value = setting.value.value;
    formData.value.locale = setting.value.locale;// Stop loading regardless of success or error
  }
};

const formattedKey = computed(() => {
  return setting.value?.key ? t(`settings.${setting.value.key}`, setting.value.key) : "";
});

onMounted(() => {
  settingID.value = route.params.id;
  fetchSetting();
});

const updateSetting = async () => {
  try {
    await POST(`admin-panel/settings/${setting.value.key}`, {
      value: formData.value.value,
      locale: formData.value.locale,
    });
    router.push("/settings");
  } catch (error) {
    console.error("Error updating setting:", error);
  }
};
</script>

<style scoped></style>
