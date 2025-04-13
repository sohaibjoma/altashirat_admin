<template>
  <div class="text-center">
    <OutlinedButton
      icon
      color="error"
      variant="text"
      class="ma-2"
      @click="dialog = true"
    >
      <img
        src="../../../assets/imgs/logout.png"
        alt="Logout"
        class="logout-icon"
        style="width: 24px; height: 24px"
      />
    </OutlinedButton>

    <v-dialog
      v-model="dialog"
      max-width="450"
      transition="dialog-bottom-transition"
    >
      <v-card :loading="loading" elevation="8" rounded="lg">
        <v-card-title class="bg-red-darken-2 white--text py-4 px-6">
          <v-icon color="white" class="me-2">mdi-logout</v-icon>
          {{ t("actions.logout") || "Logout" }}
        </v-card-title>
        <h4 class="pa-4 mb-3 text-grey-darken-1">
          {{ t("logoutDialog.message") || "Are you sure you want to logout?" }}
        </h4>
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <OutlinedButton
            color="grey"
            width="100"
            height="40"
            rounded
            @click="dialog = false"
            class="mx-2"
          >
            {{ t("actions.cancel") || "Cancel" }}
          </OutlinedButton>
          <MainButton
            color="error"
            variant="flat"
            width="130"
            height="40"
            rounded
            @click="confirmLogout"
            :loading="loading"
          >
            {{ t("actions.logout") || "Logout" }}
          </MainButton>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../../stores/auth";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const router = useRouter();
const authStore = useAuthStore();

const loading = ref(false);
const dialog = ref(false);

async function confirmLogout() {
  loading.value = true;
  try {
    await authStore.logout();
    dialog.value = false;
    router.push("/login");
  } catch (error) {
    console.error("Error logging out:", error);
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.logout-icon {
  transition: transform 0.2s ease;
}

.v-btn:hover .logout-icon {
  transform: scale(1.1);
}
</style>
