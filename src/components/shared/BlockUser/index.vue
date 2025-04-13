<template>
  <div>
    <OutlinedButton
      :color="isBlocked ? 'error' : 'success'"
      @click="openDialog"
      class="block-btn me-2"
      :class="{ 'blocked-state': isBlocked, 'unblocked-state': !isBlocked }"
    >
      <v-icon :color="isBlocked ? 'error' : 'success'" class="me-2">
        {{ isBlocked ? "mdi-account-cancel" : "mdi-account-check" }}
      </v-icon>
      {{ isBlocked ? t("actions.unblock") : t("actions.block") }}
    </OutlinedButton>

    <v-dialog
      v-model="dialog"
      max-width="450"
      transition="dialog-bottom-transition"
    >
      <v-card class="block-dialog-card">
        <v-card-title class="block-dialog-header pa-3">
          <v-icon :color="isBlocked ? 'success' : 'error'" class="mr-2">
            {{ isBlocked ? "mdi-account-check" : "mdi-account-cancel" }}
          </v-icon>
          {{ isBlocked ? t("actions.unblockUser") : t("actions.blockUser") }}
        </v-card-title>
        <v-card-text class="pt-4 text-grey-darken-1">
          {{ t("actions.areYouSure") }}
          <strong :class="isBlocked ? 'text-success' : 'text-error'">{{
            isBlocked ? t("actions.unblock") : t("actions.block")
          }}</strong>
          {{ t("actions.thisUser") }}?
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <OutlinedButton
            color="grey"
            rounded
            width="100"
            @click="closeDialog"
            class="cancel-btn"
          >
            {{ t("actions.cancel") }}
          </OutlinedButton>
          <OutlinedButton
            :color="isBlocked ? 'success' : 'error'"
            rounded
            width="100"
            variant="flat"
            @click="confirmBlock"
            class="action-btn"
          >
            {{ isBlocked ? $t("actions.unblock") : $t("actions.block") }}
          </OutlinedButton>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useApi } from "../../../composables/api";
import { useNotificationStore } from "../../../stores/notification";
import { useEventBus } from "../../../composables/eventBus";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = defineProps({
  userId: {
    type: [String, Number],
    required: true,
  },
  blocked: {
    type: Boolean,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["update:blocked", "user-blocked", "user-unblocked"]);

const { POST } = useApi();
const notificationStore = useNotificationStore();
const eventBus = useEventBus();

const dialog = ref(false);
const isBlocked = computed(() => props.blocked);

const openDialog = () => {
  dialog.value = true;
};

const closeDialog = () => {
  dialog.value = false;
};

const confirmBlock = async () => {
  try {
    const formData = new FormData();
    formData.append("_method", "patch");
    formData.append("blocked", isBlocked.value ? 0 : 1);

    await POST(`${props.url}/${props.userId}`, formData);

    notificationStore.setNotification(
      t(
        `notifications.user_${
          isBlocked.value ? "unblocked" : "blocked"
        }_success`
      ),
      "success"
    );

    emit("update:blocked", !isBlocked.value);
    eventBus.emit("reloadData");
    closeDialog();
    if (isBlocked.value) {
      emit("user-unblocked");
    } else {
      emit("user-blocked");
    }
  } catch (error) {
    console.error("Failed to update user block status:", error);
    notificationStore.setNotification(
      t("notifications.user_block_status_update_error"),
      "error"
    );
  }
};
</script>

<style scoped>
.block-btn {
  transition: all 0.3s ease;
  border-radius: 8px;
  padding: 6px 12px;
  text-transform: capitalize;
  font-weight: 500;
}

.block-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.blocked-state {
  border-color: var(--error-text);
  background: var(--error-bg);
}

.unblocked-state {
  border-color: var(--correct-text);
  background: var(--correct-bg);
}
</style>
