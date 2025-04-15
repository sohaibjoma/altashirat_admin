<!-- <template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="10" lg="8" xl="7">
        <v-card class="mt-5 py-4">
          <v-card-title class="pt-4 pb-2 text-start pink-border font-weight-bold">
            {{ isEdit ? t("actions.editTourismVisa") : t("actions.addTourismVisa  ") }}
          </v-card-title>
          <v-card-text>
            <Form
              v-if="!loading && tourismVisa"
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

                <TextInput
                  v-model="formValues.duration"
                  :label="$t('duration')"
                  :placeholder="$t('enterDuration')"
                  name="duration"
                  rules="required"
                  class="mb-3"
                />

                <TextInput
                  v-model="formValues.cost"
                  :label="$t('cost')"
                  :placeholder="$t('enterCost')"
                  name="cost"
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
import { debounce } from "lodash-es";

// Constants
const BASE_API_PATH = "/admin-panel/tourism-visa";
const DEBOUNCE_DELAY = 1000;

// Composables
const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const { POST, GET, loading } = useApi();
const errorStore = useErrorStore();
const notificationStore = useNotificationStore();
const eventBus = useEventBus();

// Refs
const isEdit = ref(false);
const tourismVisa = ref(null);
const form = ref(null);
const isSubmitting = ref(false);

// Form schema
const validationSchema = {
  name: 'required|min:3|max:50',
  duration: 'required|numeric|min_value:1',
  cost: 'required|decimal:2|min_value:0',
  visible: 'required|boolean'
};

// Form values
const formValues = ref({
  name: "",
  duration: "",
  cost: "",
  visible: 1,
  locale: getSafeLocale(),
});

// Utility functions
function getSafeLocale() {
  try {
    return localStorage.getItem("locale") || "en";
  } catch {
    return "en";
  }
}

function showError(messageKey, error = null) {
  console.error("API Error:", error);
  notificationStore.setNotification({
    message: t(messageKey),
    type: "error",
    duration: 5000
  });
}

function showSuccess(messageKey) {
  notificationStore.setNotification({
    message: t(messageKey),
    type: "success",
    duration: 3000
  });
}

// Data operations
const fetchTourismVisa = async (id) => {
  try {
    loading.value = true;
    const response = await GET(`/admin-panel/tourism-visa/${id}`, {
      headers: { "x-locale": formValues.value.locale },
    });

    if (response.data?.tourism_visa) {
      tourismVisa.value = response.data.tourism_visa;
      formValues.value = {
        name: response.data.tourism_visa.name || "",
        duration: response.data.tourism_visa.duration || "",
        cost: parseFloat(response.data.tourism_visa.cost || 0).toFixed(2),
        visible: response.data.tourism_visa.visible ? 1 : 0,
        locale: response.data.tourism_visa.locale || getSafeLocale(),
      };
    } else {
      showError("notifications.tourism_visa_load_error");
    }
  } catch (error) {
    if (error.response?.status === 401) {
      router.push("/login");
    }
    showError("notifications.tourism_visa_load_error", error);
  } finally {
    loading.value = false;
  }
};

const handleLocaleChange = async (newLocale) => {
  if (!newLocale || !tourismVisa.value) return;

  try {
    loading.value = true;
    localStorage.setItem("locale", newLocale);

    const response = await GET(`${BASE_API_PATH}/${route.params.id}`, {
      headers: { "x-locale": newLocale },
    });

    if (response?.data?.tourism_visa) {
      formValues.value = {
        ...formValues.value,
        name: response.data.tourism_visa.name || "",
        duration: response.data.tourism_visa.duration || "",
        cost: parseFloat(response.data.tourism_visa.cost || 0).toFixed(2),
        visible: response.data.tourism_visa.visible ? 1 : 0,
        locale: newLocale,
      };
    }
  } catch (error) {
    showError("notifications.locale_data_load_error", error);
  } finally {
    loading.value = false;
  }
};

// Form operations
const createFormData = () => {
  const formData = new FormData();
  formData.append("name", formValues.value.name.trim());
  formData.append("duration", parseInt(formValues.value.duration));
  formData.append("cost", parseFloat(formValues.value.cost).toFixed(2));
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
  if (isSubmitting.value) return;
  
  formValues.value = {
    name: "",
    duration: "",
    cost: "",
    visible: 1,
    locale: getSafeLocale(),
  };
};

const submitForm = async () => {
  errorStore.clearErrors();
  isSubmitting.value = true;

  try {
    const endpoint = isEdit.value
      ? `${BASE_API_PATH}/${route.params.id}`
      : BASE_API_PATH;

    const formData = isEdit.value ? updateFormData() : createFormData();

    await POST(endpoint, formData);

    showSuccess(
      `notifications.tourism_visa_${isEdit.value ? "updated" : "added"}_success`
    );

    eventBus.emit("tourism-visa-updated");
    
    // Delay for better UX
    await new Promise(resolve => setTimeout(resolve, 1000));
    router.push("/tourism-visa");
  } catch (error) {
    if (error.response?.status === 401) {
      router.push("/login");
    } else if (error.response?.status === 422 || error.response?.status === 409) {
      errorStore.setErrors(error.response.data.errors);
      showError("notifications.form_validation_error", error);
    } else {
      showError("notifications.unexpected_error", error);
    }
  } finally {
    isSubmitting.value = false;
  }
};

const goBack = () => {
  if (confirm(t("confirmations.discard_changes"))) {
    router.push("/tourism-visa");
  }
};

// Auto-save draft for new entries
watch(
  formValues,
  debounce((newVal) => {
    if (!isEdit.value && newVal.name) {
      try {
        localStorage.setItem(
          "tourism_visa_draft",
          JSON.stringify(newVal)
        );
      } catch (error) {
        console.warn("Failed to save draft:", error);
      }
    }
  }, DEBOUNCE_DELAY),
  { deep: true }
);

// Lifecycle hooks
onMounted(() => {
  if (route.params.id) {
    isEdit.value = true;
    fetchTourismVisa(route.params.id);
    eventBus.emit("edit-tourism-visa-started", { id: route.params.id });
  } else {
    // Load draft if exists
    try {
      const draft = localStorage.getItem("tourism_visa_draft");
      if (draft) {
        formValues.value = JSON.parse(draft);
      }
    } catch {
      localStorage.removeItem("tourism_visa_draft");
    }
    eventBus.emit("create-tourism-visa-started");
  }
});

// Route watcher
watch(
  () => route.params.id,
  async (newId) => {
    if (newId) {
      isEdit.value = true;
      await fetchTourismVisa(newId);
    } else {
      isEdit.value = false;
      resetForm();
    }
  },
  { immediate: true }
);
</script> -->