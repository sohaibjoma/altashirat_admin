<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="10" lg="8" xl="7">
        <v-card class="mt-5 pa-4">
          <v-card-title class="text-h5 pt-4 pb-2">
            {{ isEdit ? $t("actions.editTitle") : $t("actions.addTitle") }}
          </v-card-title>
          <v-card-text>
            <Form v-slot="{ handleSubmit }">
              <v-form @submit.prevent="handleSubmit(submitForm)">
                <TextInput
                  v-model="form.name"
                  :label="$t('table.name')"
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
                />

                <LocaleSelector
                  v-if="isEdit"
                  name="locale"
                  v-model="form.locale"
                  :label="$t('actions.language')"
                />

                <div class="d-flex mt-5 align-center">
                  <MainButton
                    type="submit"
                    color="primary"
                    width="100"
                    height="40"
                    rounded
                    class="mx-2"
                    :loading="loading"
                  >
                    {{ isEdit ? $t("update") : $t("add") }}
                  </MainButton>
                  <OutlinedButton
                    @click="goBack"
                    rounded
                    width="100"
                    height="40"
                    class="mx-2"
                  >
                    {{ $t("cancel") }}
                  </OutlinedButton>
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
const form = ref({
  name: "",
  visible: 1,
  locale: "en",
});

onMounted(() => {
  if (isEdit.value) {
    eventBus.emit("edit-title-started", { id: route.params.id });
  } else {
    eventBus.emit("create-title-started");
  }
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
      notificationStore.setNotification(
        t("notifications.title_load_error"),
        "error"
      );
    }
  } catch (error) {
    notificationStore.setNotification(
      t("notifications.title_load_error"),
      "error"
    );
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
        t("notifications.title_updated_success"),
        "success"
      );
      eventBus.emit("title-updated");
    } else {
      await POST("/admin-panel/titles", createFormData());
      notificationStore.setNotification(
        t("notifications.title_added_success"),
        "success"
      );
      eventBus.emit("title-added");
    }
    router.push("/titles");
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
  router.push("/titles");
};
</script>
