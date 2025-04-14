<template>
  <v-container>
    <v-card class="pe-5 pt-5 pb-5">
      <v-card-title class="pink-border">
        {{ formattedKey }}
      </v-card-title>

      <v-card-text>
        <!-- Form only renders when data is loaded -->
        <Form 
          v-if="!loading && setting"
          v-slot="{ handleSubmit }"
          :initial-values="formValues"
          ref="form"
        >
          <form @submit.prevent="handleSubmit(updateSetting)">
            <LocaleSelector
              name="locale"
              v-if="['textarea', 'text'].includes(setting?.layout)"
              v-model="formValues.locale"
              :label="t('actions.language')"
              @update:modelValue="handleLocaleChange"

            />

            <div class="px-4">
              <TextArea
              v-if="setting.layout === 'textarea'"
              name="value"
              v-model="formValues.value"
              :label="t('settings.edit')"
              rules="required"
            />
            </div>



            <BooleanCheckbox
              v-if="setting.layout === 'checkbox'"
              name="is_active"
              v-model="formValues.is_active"
              :label="t('settings.active')"
              rules="requiredBoolean"
            />

            <RangeInput
              v-if="setting.layout === 'range'"
              name="range"
              v-model="formValues.range"
              :label="t('settings.range')"
              :min="0"
              :max="100"
              :step="1"
              rules="required|range"
            />

            <NumberInput
              v-if="setting.layout === 'number'"
              name="max_value"
              v-model="formValues.max_value"
              :label="t('settings.max_value')"
              rules="required|numberRule"
            />

            <TextInput
              v-if="setting.layout === 'text'"
              name="text"
              v-model="formValues.value"
              :label="t('settings.edit')"
              rules="required"
            />

            <div class="text-end mt-4">
              <MainButton
                color="secondary"
                width="135px"
                type="submit"
                :loading="updatingBothLocales || loading"
                :disabled="loading"
              >
                {{ t("titles.edit") }}
              </MainButton>
            </div>
          </form>
        </Form>
        
        <!-- Loading state -->
        <v-skeleton-loader 
          v-else
          type="article, actions" 
          class="mt-4"
        />
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useApi } from "../../../composables/api";
import { t } from "../../../plugins/i18n";
import { Form } from "vee-validate";
import { useNotificationStore } from "../../../stores/notification";

const { GET, POST, UPDATEBothLocales } = useApi();
const route = useRoute();
const router = useRouter();
const notificationStore = useNotificationStore();

// Reactive state
const settingID = ref("");
const setting = ref(null);
const loading = ref(true);
const updatingBothLocales = ref(false);
const form = ref(null);

// Form values structure
const formValues = ref({
  value: '',
  locale: 'en',
  is_active: 0,
  max_value: 0,
  range: 0
});

// Fetch setting data
const fetchSetting = async () => {
  try {
    loading.value = true;
    const response = await GET(`admin-panel/settings/${settingID.value}`);

    if (response.data?.setting) {
      setting.value = response.data.setting;
      
      // Update form values with proper type conversion
      formValues.value = {
        value: setting.value.value !== null ? String(setting.value.value) : '',
        locale: setting.value.locale || localStorage.getItem("locale") || "en",
        is_active: setting.value.value === 1 ? 1 : 0,
        max_value: setting.value.value !== null ? Number(setting.value.value) : 0,
        range: setting.value.value !== null ? Number(setting.value.value) : 0,
      };
    } else {
      notificationStore.setNotification(
        t("notifications.setting_load_error"),
        "error"
      );
    }
  } catch (error) {
    notificationStore.setNotification(
      t("notifications.setting_load_error"),
      "error"
    );
  } finally {
    loading.value = false;
  }
};

// Handle locale change
const handleLocaleChange = async (newLocale) => {
  if (!newLocale || !setting.value) return;
  
  try {
    loading.value = true;
    const response = await GET(`admin-panel/settings/${settingID.value}`, {
      headers: { "x-locale": newLocale }
    });

    if (response?.data?.setting) {
      formValues.value = {
        ...formValues.value,
        value: response.data.setting.value !== null 
          ? String(response.data.setting.value) 
          : '',
        locale: newLocale
      };
    }
  } catch (error) {
    notificationStore.setNotification(
      t("notifications.locale_data_load_error"),
      "error"
    );
  } finally {
    loading.value = false;
  }
};

// Update setting
const updateSetting = async () => {
  if (loading.value || !setting.value) return;
  
  try {
    updatingBothLocales.value = true;

    if (['textarea', 'text'].includes(setting.value.layout)) {
      const payload = new FormData();
      payload.append("_method", "put");
      payload.append("locale", formValues.value.locale);
      payload.append("value", formValues.value.value);

      await POST(`admin-panel/settings/${settingID.value}`, payload);
    } else {
      let valueToUpdate;
      switch (setting.value.layout) {
        case "checkbox":
          valueToUpdate = formValues.value.is_active ? "1" : "0";
          break;
        case "range":
          valueToUpdate = String(formValues.value.range);
          break;
        case "number":
          valueToUpdate = String(formValues.value.max_value);
          break;
        default:
          valueToUpdate = "";
      }

      await UPDATEBothLocales(
        `admin-panel/settings/${settingID.value}`,
        valueToUpdate
      );
    }

    router.push("/settings");
    notificationStore.setNotification(
      t("notifications.setting_update_success"),
      "success"
    );
  } catch (error) {
    notificationStore.setNotification(
      t("notifications.setting_update_error"),
      "error"
    );
  } finally {
    updatingBothLocales.value = false;
  }
};

// Computed properties
const formattedKey = computed(() => {
  return setting.value?.key
    ? t(`settings.${setting.value.key}`, setting.value.key)
    : "";
});

// Lifecycle hooks
onMounted(() => {
  if (route.params.id) {
    settingID.value = route.params.id;
    fetchSetting();
  }
});
</script>

<style scoped>

</style>