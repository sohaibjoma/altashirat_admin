<template>
  <v-container>
    <v-card class="pa-5 rounded-lg">
      <v-card-title class="border-s-xl border-primary">
        {{ formattedKey }}
      </v-card-title>

      <v-card-text>
        <Form v-slot="{ handleSubmit }">
          <form @submit.prevent="handleSubmit(updateSetting)">
            <LocaleSelector
              name="locale"
              v-model="data.locale"
              :label="t('actions.language')"
            />

            <TextArea
              v-if="setting?.layout === 'textarea'"
              name="textArea"
              v-model="data.value"
              :label="t('settings.edit')"
            />

            <BooleanCheckbox
              v-if="setting?.layout === 'checkbox'"
              name="is_active"
              v-model="data.is_active"
              :label="t('settings.active')"
            />

            <RangeInput
              v-if="setting?.layout === 'range'"
              name="range"
              v-model="data.range"
              :label="t('settings.range')"
              :min="0"
              :max="100"
              :step="1"
            />

            <NumberInput
              v-if="setting?.layout === 'number'"
              name="max_value"
              rules="numberRule"
              v-model="data.max_value"
              :label="t('settings.max_value')"
            />

            <TextInput
              v-if="setting?.layout === 'text'"
              name="text"
              v-model="data.value"
              :label="t('settings.text')"
            />

            <div class="text-end">
              <MainButton color="secondary" width="135px" type="submit">
                {{ t("titles.edit") }}
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
import { Form } from "vee-validate";
import { useNotificationStore } from "../../../stores/notification";

const { GET, POST } = useApi();
const route = useRoute();
const router = useRouter();
const notificationStore = useNotificationStore();

const settingID = ref("");
const setting = ref(null);
const loading = ref(true);

const data = ref({
  value: null,
  locale: "",
  is_active: null,
  max_value: null,
  range: null,
});

const fetchSetting = async () => {
  try {
    const response = await GET(`admin-panel/settings/${settingID.value}`);

    if (response.data.setting) {
      setting.value = response.data.setting;
      data.value = {
        value:
          setting.value.value !== null ? String(setting.value.value) : null,
        locale: setting.value.locale || localStorage.getItem("locale") || "en",
        is_active: setting.value.value === 1 ? 1 : 0,
        max_value:
          setting.value.value !== null ? Number(setting.value.value) : null,
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

const updateSetting = async () => {
  try {
    const payload = new FormData();
    payload.append("_method", "put");
    payload.append("locale", data.value.locale);

    switch (setting.value.layout) {
      case "textarea":
      case "text":
        payload.append("value", data.value.value || "");
        break;
      case "checkbox":
        payload.append("value", data.value.is_active=== 1 ? 1 : 0);
        break;
      case "range":
        payload.append(
          "value",
          data.value.range !== null ? String(data.value.range) : 0
        );
        break;
      case "number":
        const maxValue =
          data.value.max_value !== null ? Number(data.value.max_value) : null;
        payload.append("value", maxValue !== null ? String(maxValue) : "");
        break;
    }

    const response = await POST(
      `admin-panel/settings/${settingID.value}`,
      payload
    );
    router.push("/settings");
    notificationStore.setNotification(
      t("notifications.setting_update_success"),
      "success"
    );
  } catch (error) {
    console.error("Error updating setting:", error);
    notificationStore.setNotification(
      t("notifications.setting_update_error"),
      "error"
    );
  }
};

const formattedKey = computed(() => {
  return setting.value?.key
    ? t(`settings.${setting.value.key}`, setting.value.key)
    : "";
});

onMounted(() => {
  if (route.params.id) {
    settingID.value = route.params.id;
    fetchSetting();
  }
});
</script>
<style scoped></style>
