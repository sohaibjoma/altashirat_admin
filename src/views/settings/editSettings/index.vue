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
        <Form @submit.prevent="updateSetting">
          <LocaleSelector
            name="locale"
            rules="required"
            v-model="formData.locale"
            :label="$t('actions.language')"
          />

          <TextArea
            v-if="setting?.layout === 'textarea'"
            name="textArea"
            rules="required"
            v-model="formData.value"
            @update:modelValue="updateField('value', $event)"
            :label="$t('settings.edit')"
          />

          <BooleanCheckbox
            v-if="setting?.layout === 'checkbox'"
            name="is_active"
            rules="required"
            v-model="formData.is_active"
            @update:modelValue="updateField('is_active', $event)"
            :label="$t('settings.active')"
          />

          <NumberInput
            v-if="setting?.layout === 'number'"
            name="max_value"
            rules="required"
            v-model="formData.max_value"
            @update:modelValue="updateField('max_value', $event)"
            :label="$t('settings.max_value')"
          />

          <RangeInput
            v-if="setting?.layout === 'range'"
            name="range"
            rules="required"
            v-model="formData.range"
            @update:modelValue="updateField('range', $event)"
            :label="$t('settings.range')"
            :min="0"
            :max="100"
            :step="1"
          />

          <TextInput
            v-if="setting?.layout === 'text'"
            name="text"
            rules="required"
            v-model="formData.value"
            @update:modelValue="updateField('value', $event)"
            :label="$t('settings.text')"
          />

          <div class="text-end">
            <MainButton color="secondary" width="135px" type="submit" class="me-9">
              {{ $t("titles.edit") }}
            </MainButton>
          </div>
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
const loading = ref(true);
const changedFields = ref({}); // Track modified fields

const formData = ref({
  value: "",
  locale: "",
  is_active: false,
  max_value: null,
  range: null,
});

const fetchSetting = async () => {
  try {
    const response = await GET(`admin-panel/settings/${settingID.value}`);

    console.log("Full API Response:", response);

    if (response.data.setting) {
      setting.value = response.data.setting;

      formData.value = {
        value: setting.value.value || "",
        locale: setting.value.locale || "en",
        is_active: setting.value.is_active || false,
        max_value: setting.value.max_value || null,
        range: setting.value.range || null,
      };
    }
  } catch (error) {
    console.error("Error fetching setting:", error);
  } finally {
    loading.value = false;
  }
};

const updateField = (field, value) => {
  changedFields.value[field] = value; // Simply track changes without modifying values
};

const updateSetting = async () => {
  try {
    const payload = new FormData();
    payload.append("_method", "put");
    payload.append("locale", formData.value.locale);

    // Convert values where necessary before appending
    for (const key in changedFields.value) {
      let value = changedFields.value[key];

      if (["range", "max_value"].includes(key)) {
        value = parseInt(value, 10);
        if (isNaN(value)) continue; // Skip appending if NaN
      }

      payload.append(key, value);
    }

    const response = await POST(`admin-panel/settings/${settingID.value}`, payload);
    console.log(response);
    router.push("/settings");
  } catch (error) {
    console.error("Error updating setting:", error);
  }
};

const formattedKey = computed(() => {
  return setting.value?.key ? t(`settings.${setting.value.key}`, setting.value.key) : "";
});

onMounted(() => {
  settingID.value = route.params.id;
  fetchSetting();
});
</script>

<style scoped></style>
