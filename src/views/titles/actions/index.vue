<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <v-card class="mt-5 pa-2">
          <v-card-title class="text-h5 pt-4 pb-2">
            {{ isEdit ? $t("editTitle") : $t("addTitle") }}
          </v-card-title>
          <v-card-text>
            <Form v-slot="{ handleSubmit }">
              <v-form @submit.prevent="handleSubmit(submitForm)">
                <!-- Name Input -->
                <TextInput
                  v-model="form.name"
                  :label="$t('name')"
                  :placeholder="$t('enterName')"
                  name="name"
                  rules="alpha"
                  class="mb-3"
                />

                <!-- Visible Select -->
                <Select
                  v-model="form.visible"
                  :label="$t('visible')"
                  :placeholder="$t('selectVisibility')"
                  :items="[
                    { text: $t('visible'), value: 1 },
                    { text: $t('hidden'), value: 0 },
                  ]"
                  name="visible"
                  rules="required"
                  class="mb-3"
                />

                <!-- Locale Select for edit only -->
                <Select
                  v-if="isEdit"
                  v-model="form.locale"
                  :label="$t('locale')"
                  :placeholder="$t('selectLocale')"
                  :items="[
                    { text: 'English', value: 'en' },
                    { text: 'العربية', value: 'ar' },
                  ]"
                  name="locale"
                  rules="required"
                  class="mb-3"
                />
              </v-form>
            </Form>
          </v-card-text>
          <v-card-actions class="px-4 pb-4">
            <v-spacer></v-spacer>
            <v-btn @click="goBack" variant="outlined" class="mr-2">
              {{ $t("cancel") }}
            </v-btn>
            <v-btn 
              color="primary" 
              :loading="loading" 
              @click="submitForm"
            >
              {{ isEdit ? $t("update") : $t("add") }}
            </v-btn>
          </v-card-actions>
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

const route = useRoute();
const router = useRouter();
const { POST, GET, loading } = useApi();
const errorStore = useErrorStore();
const notificationStore = useNotificationStore();

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

const fetchTitle = async (id) => {
  try {
    const response = await GET(`/admin-panel/titles/${id}`);
    if (response.data && response.data.title) {
      form.value = {
        name: response.data.title.name || "",
        visible: response.data.title.visible ? 1 : 0,
        locale: response.data.title.locale || "en",
      };
    } else {
      console.error("Invalid API response structure:", response);
      notificationStore.setNotification("Failed to load title data.", "error");
    }
  } catch (error) {
    console.error("Failed to fetch title:", error);
    notificationStore.setNotification("Failed to load title data.", "error");
  }
};

watch(
  () => route.params.id,
  async (newId) => {
    if (newId) {
      isEdit.value = true;
      await fetchTitle(newId);
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
      await POST(`/admin-panel/titles/${route.params.id}`, updateFormData());
      notificationStore.setNotification("Title updated successfully!", "success");
    } else {
      await POST("/admin-panel/titles", createFormData());
      notificationStore.setNotification("Title added successfully!", "success");
    }

    router.push("/titles");
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
  router.push("/titles");
};
</script>