<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="10" lg="8" xl="7">
        <v-card class="mt-5 py-4">
          <v-card-title
            class="pt-4 pb-2 text-start pink-border font-weight-bold"
          >
            {{
              isEdit
                ? t("actions.editEmploymentType")
                : t("actions.addEmploymentType")
            }}
          </v-card-title>
          <v-card-text>
            <Form
              v-if="!loading && employmentType"
              v-slot="{ handleSubmit }"
              :initial-values="formValues"
              ref="form"
            >
              <v-form @submit.prevent="handleSubmit(submitForm)">
                <TextInput
                  v-model="formValues.name"
                  :label="$t('table.name')"
                  :placeholder="$t('enterName')"
                  name="name"
                  rules="required"
                  class="mb-3"
                />

                <Select
                  v-model="formValues.visible"
                  :label="$t('visible')"
                  :placeholder="$t('selectVisibility')"
                  :items="[
                    { text: $t('visible'), value: 1 },
                    { text: $t('hidden'), value: 0 },
                  ]"
                  name="visible"
                />

                <LocaleSelector
                  v-if="isEdit"
                  name="locale"
                  v-model="formValues.locale"
                  :label="$t('actions.language')"
                  @update:modelValue="handleLocaleChange"
                />

                <div class="d-flex mt-5 align-center justify-end">
                  <MainButton
                    type="submit"
                    color="secondary"
                    width="120"
                    height="40"
                    class="mx-2"
                    :loading="loading"
                  >
                    {{ isEdit ? t("actions.update") : t("actions.add") }}
                  </MainButton>
                  <OutlinedButton
                    @click="goBack"
                    color="secondary"
                    width="120"
                    height="40"
                    class="mx-2"
                  >
                    {{ t("actions.cancel") }}
                  </OutlinedButton>
                </div>
              </v-form>
            </Form>
            <v-skeleton-loader v-else type="article, actions" class="mt-4" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { Form } from "vee-validate";
import { ref, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useApi } from "../../../composables/api";
import { useErrorStore } from "../../../stores/errors";
import { useNotificationStore } from "../../../stores/notification";
import { useEventBus } from "../../../composables/eventBus";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const { POST, GET, loading } = useApi();
const errorStore = useErrorStore();
const notificationStore = useNotificationStore();
const eventBus = useEventBus();

const isEdit = ref(false);
const employmentType = ref(null);
const form = ref(null);

const formValues = ref({
  name: "",
  visible: 1,
  locale: localStorage.getItem("locale") || "en",
});

const fetchEmploymentType = async (id) => {
  try {
    const response = await GET(`/admin-panel/employment-types/${id}`, {
      headers: { "x-locale": formValues.value.locale },
    });

    if (response.data?.employment_type) {
      employmentType.value = response.data.employment_type;
      formValues.value = {
        name: response.data.employment_type.name || "",
        visible: response.data.employment_type.visible ? 1 : 0,
        locale:
          response.data.employment_type.locale ||
          localStorage.getItem("locale") ||
          "en",
      };
    } else {
      showError("notifications.employment_type_load_error");
    }
  } catch (error) {
    showError("notifications.employment_type_load_error");
  }
};

const handleLocaleChange = async (newLocale) => {
  if (!newLocale || !employmentType.value) return;

  try {
    loading.value = true;
    localStorage.setItem("locale", newLocale);

    const response = await GET(
      `/admin-panel/employment-types/${route.params.id}`,
      {
        headers: { "x-locale": newLocale },
      }
    );

    if (response?.data?.employment_type) {
      formValues.value = {
        name: response.data.employment_type.name || "",
        visible: response.data.employment_type.visible ? 1 : 0,
        locale: newLocale,
      };
    }
  } catch (error) {
    showError("notifications.locale_data_load_error");
  } finally {
    loading.value = false;
  }
};

const showError = (messageKey) => {
  notificationStore.setNotification(t(messageKey), "error");
};

onMounted(() => {
  if (route.params.id) {
    isEdit.value = true;
    fetchEmploymentType(route.params.id);
    eventBus.emit("edit-employment-type-started", { id: route.params.id });
  } else {
    isEdit.value = false;
    employmentType.value = {};
    resetForm();
    eventBus.emit("create-employment-type-started");
  }
});

const createFormData = () => {
  const formData = new FormData();
  formData.append("name", formValues.value.name);
  formData.append("visible", formValues.value.visible.toString());
  formData.append("locale", formValues.value.locale);
  return formData;
};

const updateFormData = () => {
  const formData = createFormData();
  formData.append("_method", "put");
  return formData;
};

const resetForm = () => {
  formValues.value = {
    name: "",
    visible: 1,
    locale: localStorage.getItem("locale") || "en",
  };
};

watch(
  () => route.params.id,
  async (newId) => {
    if (newId) {
      isEdit.value = true;
      await fetchEmploymentType(newId);
    } else {
      isEdit.value = false;
      resetForm();
    }
  },
  { immediate: true }
);

const submitForm = async () => {
  errorStore.clearErrors();

  try {
    const endpoint = isEdit.value
      ? `/admin-panel/employment-types/${route.params.id}`
      : "/admin-panel/employment-types";

    const formData = isEdit.value ? updateFormData() : createFormData();

    await POST(endpoint, formData);

    notificationStore.setNotification(
      t(
        `notifications.employment_type_${
          isEdit.value ? "updated" : "added"
        }_success`
      ),
      "success"
    );

    eventBus.emit("employment-type-updated");
    router.push("/employment-types");
  } catch (error) {
    if (error.response?.status === 422 || error.response?.status === 409) {
      errorStore.setErrors(error.response.data.errors);
      showError("notifications.form_validation_error");
    } else {
      showError("notifications.unexpected_error");
    }
  }
};

const goBack = () => {
  router.push("/employment-types");
};
</script>

<style scoped></style>
