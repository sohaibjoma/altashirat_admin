<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="10" lg="8" xl="7">
        <v-card class="mt-5 pa-4 w-100">
          <v-card-title class="text-h5 pt-4 pb-2">
            {{
              isEdit ? $t("actions.editVisaType") : $t("actions.addVisaType")
            }}
          </v-card-title>
          <v-card-text>
            <Form v-slot="{ handleSubmit }">
              <v-form @submit.prevent="handleSubmit(submitForm)">
                <TextInput
                  v-model="form.name"
                  :label="$t('name')"
                  :placeholder="$t('enterName')"
                  name="name"
                  rules="alpha"
                  class="mb-3"
                />

                <Select
                  v-model="form.visible"
                  :label="$t('visible')"
                  :placeholder="$t('selectVisibility')"
                  :items="[
                    { text: $t('visible'), value: 1 },
                    { text: $t('hidden'), value: 0 },
                  ]"
                  name="visible"
                  :rules="
                    (value) =>
                      value !== null && value !== undefined
                        ? true
                        : $t('errorMsgs.required')
                  "
                />

                <LocaleSelector
                  v-if="isEdit"
                  name="locale"
                  rules="required"
                  v-model="form.locale"
                  :label="$t('actions.language')"
                />

                <div class="d-flex flex-wrap mt-5 gap-3">
                  <v-btn @click="goBack" variant="outlined">
                    {{ $t("cancel") }}
                  </v-btn>
                  <v-btn type="submit" color="primary" :loading="loading">
                    {{ isEdit ? $t("update") : $t("add") }}
                  </v-btn>
                </div>
              </v-form>
            </Form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { Form } from "vee-validate";
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useApi } from "../../../composables/api";
import { useErrorStore } from "../../../stores/errors";
import { useNotificationStore } from "../../../stores/notification";
import { useEventBus } from "../../../composables/eventBus";

const route = useRoute();
const router = useRouter();
const { POST, GET, loading } = useApi();
const errorStore = useErrorStore();
const notificationStore = useNotificationStore();
const { emit } = useEventBus();

const isEdit = ref(false);
const form = ref({
  name: "",
  visible: 1,
  locale: "en",
});

const createFormData = () => {
  const formData = new FormData();
  formData.append("name", form.value.name);
  formData.append("visible", form.value.visible.toString());
  formData.append("locale", form.value.locale);
  return formData;
};

const updateFormData = () => {
  const formData = new FormData();
  formData.append("name", form.value.name);
  formData.append("visible", form.value.visible.toString());
  formData.append("locale", form.value.locale);
  formData.append("_method", "put");
  return formData;
};

const fetchVisaType = async (id) => {
  try {
    const response = await GET(`/admin-panel/visa-types/${id}`);
    if (response.data && response.data.visa_type) {
      form.value = {
        name: response.data.visa_type.name || "",
        visible: response.data.visa_type.visible ? 1 : 0,
        locale: response.data.visa_type.locale || "en",
      };
    } else {
      console.error("Invalid API response structure:", response);
      notificationStore.setNotification(
        "Failed to load visa type data.",
        "error"
      );
    }
  } catch (error) {
    console.error("Failed to fetch visa type:", error);
    notificationStore.setNotification(
      "Failed to load visa type data.",
      "error"
    );
  }
};

watch(
  () => route.params.id,
  async (newId) => {
    if (newId) {
      isEdit.value = true;
      await fetchVisaType(newId);
    } else {
      isEdit.value = false;
      form.value = {
        name: "",
        visible: 1,
        locale: "en",
      };
    }
  },
  { immediate: true }
);

const submitForm = async () => {
  errorStore.clearErrors();

  try {
    if (isEdit.value) {
      await POST(
        `/admin-panel/visa-types/${route.params.id}`,
        updateFormData()
      );
      notificationStore.setNotification(
        "Visa Type updated successfully!",
        "success"
      );
      emit("visa-type-updated");
    } else {
      await POST("/admin-panel/visa-types", createFormData());
      notificationStore.setNotification(
        "Visa Type added successfully!",
        "success"
      );
      emit("visa-type-added");
    }
    router.push("/visa-types");
  } catch (error) {
    console.error("Form submission error:", error);
    if (error.response?.status === 422 || error.response?.status === 409) {
      errorStore.setErrors(error.response.data.errors);
      notificationStore.setNotification(
        "Please fix the errors in the form.",
        "error"
      );
    } else {
      notificationStore.setNotification(
        "An unexpected error occurred.",
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
