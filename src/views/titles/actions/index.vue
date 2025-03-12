<template>
  <div class="pa-12 mt-12">
    <h2 class="mb-5">{{ isEdit ? $t("editTitle") : $t("addTitle") }}</h2>
    <Form v-slot="{ handleSubmit }">
      <v-form @submit.prevent="handleSubmit(submitForm)">
        <!-- Name Input -->
        <TextInput
          v-model="form.name"
          :label="$t('name')"
          :placeholder="$t('enterName')"
          name="name"
          rules="alpha"
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
          :rules="(value) => value !== null && value !== undefined ? true : $t('errorMsgs.required')"
        />

        <!-- Locale Select for edit only -->
        <LocaleSelector
          v-if="isEdit"
          name="locale"
          rules="required"
          v-model="form.locale"
          :label="$t('actions.language')"
        />

        <!-- Action Buttons -->
        <div class="d-flex mt-5 gap-3">
          <v-btn @click="goBack" variant="outlined">
            {{ $t("cancel") }}
          </v-btn>
          <v-btn type="submit" color="primary" :loading="loading">
            {{ isEdit ? $t("update") : $t("add") }}
          </v-btn>
        </div>
      </v-form>
    </Form>
  </div>
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
      notificationStore.setNotification(
        "Title updated successfully!",
        "success"
      );
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
