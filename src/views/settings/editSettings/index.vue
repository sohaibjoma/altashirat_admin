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
              rules="required"
              v-model="data.locale"
              :label="$t('actions.language')"
            />

            <TextArea
              v-if="setting?.layout === 'textarea'"
              name="textArea"
              rules="required"
              v-model="data.value"
              @update:modelValue="updateField('value', $event)"
              :label="$t('settings.edit')"
            />

            <BooleanCheckbox
              v-if="setting?.layout === 'checkbox'"
              name="is_active"
              v-model="data.is_active"
              @update:modelValue="updateField('is_active', $event)"
              :label="$t('settings.active')"
            />

            <NumberInput
              v-if="setting?.layout === 'number'"
              name="max_value"
              rules="required"
              v-model="data.max_value"
              @update:modelValue="updateField('max_value', $event)"
              :label="$t('settings.max_value')"
              :min="0"
              :max="100"
              :step="1"
            />

            <RangeInput
              v-if="setting?.layout === 'range'"
              name="range"
              rules="required"
              v-model="data.range"
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
              v-model="data.value"
              @update:modelValue="updateField('value', $event)"
              :label="$t('settings.text')"
            />

            <div class="text-end">
              <MainButton color="secondary" width="135px" type="submit">
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
import { useSettingsStore } from "../../../stores/settings";
import { Form } from "vee-validate";

const settingsStore = useSettingsStore();
const { GET, POST } = useApi();
const route = useRoute();
const router = useRouter();

const settingID = ref("");
const setting = ref(null);
const loading = ref(true);
const changedFields = ref({});

const data = ref({
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
      data.value = {
        value: setting.value.value?.toString() || "",
        locale: setting.value.locale || localStorage.getItem("locale") || "en",
        is_active: !!setting.value.is_active,
        max_value: setting.value.max_value || 0,
        range: setting.value.value || 0,
      };
    }
  } catch (error) {
    console.error("Error fetching setting:", error);
  } finally {
    loading.value = false;
  }
};

const updateField = (field, value) => {
  let newValue =
    field === "range" || field === "max_value" ? Number(value) : value;
  if (field === "is_active") newValue = value;

  console.log(
    `Field '${field}' changed from '${data.value[field]}' to '${newValue}'`
  );
  data.value[field] = newValue;
  changedFields.value[field] = newValue;
};

const updateSetting = async () => {
  try {
    const payload = new FormData();
    payload.append("_method", "put");
    payload.append("locale", data.value.locale);

    for (const key in changedFields.value) {
      if (key === "range" || key === "max_value") {
        payload.append(key, changedFields.value[key]);
      } else if (key === "is_active") {
        payload.append(key, changedFields.value[key] ? '1' : '0');
      } else {
        payload.append(key, changedFields.value[key]);
      }
    }
    console.log("Payload:", payload);
    const response = await POST(
      `admin-panel/settings/${settingID.value}`,
      payload
    ).then(()=>{
    router.push("/settings");
    }
    )

  } catch (error) {
    console.error("Error updating setting:", error);
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