<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="10" lg="8" xl="7">
        <v-card class="mt-5 py-4">
          <v-card-title
            class="pt-4 pb-2 pink-border font-weight-bold"
          >
            {{
              isEdit ? $t("actions.editVisaType") : $t("actions.addVisaType")
            }}
          </v-card-title>
          <v-card-text>
            <Form 
              v-if="!loading && visaType"
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
                    {{ isEdit ? $t("actions.update") : $t("actions.add") }}
                  </MainButton>
                  <OutlinedButton
                    @click="goBack"
                    color="secondary"
                    width="120"
                    height="40"
                    class="mx-2"
                  >
                    {{ $t("actions.cancel") }}
                  </OutlinedButton>
                </div>
              </v-form>
            </Form>
            <v-skeleton-loader 
              v-else
              type="article, actions" 
              class="mt-4"
            />
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
const visaType = ref(null);
const form = ref(null);

// Form values structure
const formValues = ref({
  name: "",
  visible: 1,
  locale: "en",
});

onMounted(() => {
  if (route.params.id) {
    isEdit.value = true;
    fetchVisaType(route.params.id);
    eventBus.emit("edit-visa-type-started", { id: route.params.id });
  } else {
    isEdit.value = false;
    visaType.value = {}; // Set an empty object to indicate the form is ready
    formValues.value = {
      name: "",
      visible: 1,
      locale: "en",
    };
    eventBus.emit("create-visa-type-started");
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
  const formData = new FormData();
  formData.append("name", formValues.value.name);
  formData.append("visible", formValues.value.visible.toString());
  formData.append("locale", formValues.value.locale);
  formData.append("_method", "put");
  return formData;
};

const fetchVisaType = async (id) => {
  try {
    const response = await GET(`/admin-panel/visa-types/${id}`);
    if (response.data && response.data.visa_type) {
      visaType.value = response.data.visa_type;
      formValues.value = {
        name: response.data.visa_type.name || "",
        visible: response.data.visa_type.visible ? 1 : 0,
        locale: response.data.visa_type.locale || "en",
      };
    } else {
      notificationStore.setNotification(
        t("notifications.visa_type_load_error"),
        "error"
      );
    }
  } catch (error) {
    notificationStore.setNotification(
      t("notifications.visa_type_load_error"),
      "error"
    );
  }
};

const submitForm = async () => {
  errorStore.clearErrors();

  try {
    if (isEdit.value) {
      await POST(
        `/admin-panel/visa-types/${route.params.id}`,
        updateFormData()
      );
      notificationStore.setNotification(
        t("notifications.visa_type_updated_success"),
        "success"
      );
      eventBus.emit("visa-type-updated");
    } else {
      await POST("/admin-panel/visa-types", createFormData());
      notificationStore.setNotification(
        t("notifications.visa_type_added_success"),
        "success"
      );
      eventBus.emit("visa-type-added");
    }
    router.push("/visa-types");
  } catch (error) {
    if (error.response?.status === 422 || error.response?.status === 409) {
      errorStore.setErrors(error.response.data.errors);
      notificationStore.setNotification(
        t("notifications.form_validation_error"),
        "error"
      );
    } else {
      notificationStore.setNotification(
        t("notifications.unexpected_error"),
        "error"
      );
    }
  }
};

const goBack = () => {
  router.push("/visa-types");
};
</script>

<style scoped></style>