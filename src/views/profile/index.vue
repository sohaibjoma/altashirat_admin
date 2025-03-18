<template>
  <v-layout class="d-flex align-center bg-gray">
    <v-container class="d-flex flex-column">
      <v-card class="mt-64 pt-8 pb-8 w-75 ms-auto me-auto">
        <!-- Edit Profile Form -->
        <h1 class="text-start border-s-xl ps-3 border-secondary">
          {{ $t("profile.title") }}
        </h1>
        <EditProfileForm @submit="handleEditProfileSubmit" />
      </v-card>
      <!-- Change Password Form -->
      <v-card class="pb-8 w-75 ms-auto me-auto mt-12">
        <h1 class="text-start border-s-xl ps-3 border-secondary mt-12">
          {{ $t("profile.change_password") }}
        </h1>
        <ChangePasswordForm @submit="handleChangePasswordSubmit" />
      </v-card>
    </v-container>
  </v-layout>
</template>

<script setup>
import { useApi } from "../../composables/api";
import { ref } from "vue";
import { useNotificationStore } from "../../stores/notification";
import EditProfileForm from "../../components/shared/Forms/EditProfile/index.vue";
import ChangePasswordForm from "../../components/shared/Forms/ChangePassword/index.vue";
import { useAuthStore } from "../../stores/auth";
import { useI18n } from "vue-i18n";

const { POST } = useApi();
const notificationStore = useNotificationStore();
const authStore = useAuthStore();
const loading = ref(false);
const { t } = useI18n();

async function handleEditProfileSubmit(values, setErrors) {
  try {
    loading.value = true;
    const res = await POST("/update-account", values);
    console.log("Update response:", res);

    if (res.data) {
      const updatedUser = res.data.user || res.data;
      authStore.setUser(updatedUser);

      notificationStore.setNotification(
        t("notifications.profile_updated_success"),
        "success"
      );
    }
  } catch (error) {
    if (error.response) {
      if (error.response.status === 422 || error.response.status === 409) {
        console.log("backend errors:", error.response.data.errors);
        setErrors(error.response.data.errors);
        notificationStore.setNotification(
          t("notifications.profile_updated_error"),
          "error"
        );
      } else {
        console.error("Unexpected error:", error);
        notificationStore.setNotification(
          t("notifications.unexpected_error"),
          "error"
        );
      }
    }
  } finally {
    loading.value = false;
  }
}

async function handleChangePasswordSubmit(values, setErrors) {
  try {
    loading.value = true;
    const res = await POST("/change-password", values);
    console.log("Change password response:", res);

    if (res.data) {
      notificationStore.setNotification(
        t("notifications.password_changed_success"),
        "success"
      );
    }
  } catch (error) {
    if (error.response) {
      if (error.response.status === 422 || error.response.status === 409) {
        console.log("backend errors:", error.response.data.errors);
        setErrors(error.response.data.errors);
        notificationStore.setNotification(
          t("notifications.password_changed_error"),
          "error"
        );
      } else {
        console.error("Unexpected error:", error);
        notificationStore.setNotification(
          t("notifications.unexpected_error"),
          "error"
        );
      }
    }
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped></style>
