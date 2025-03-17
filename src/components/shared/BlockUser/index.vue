<template>
  <div>
    <OutlinedButton
      :color="isBlocked ? 'error' : 'success'"
      @click="openDialog"
      class="me-2"
    >
      <v-icon :color="isBlocked ? 'error' : 'success'">
        {{ isBlocked ? "mdi-account-cancel" : "mdi-account-check" }}
      </v-icon>
      {{ isBlocked ? $t("actions.unblock") : $t("actions.block") }}
    </OutlinedButton>

    <v-dialog v-model="dialog" max-width="400">
      <v-card>
        <v-card-title>
          {{ isBlocked ? $t("actions.unblockUser") : $t("actions.blockUser") }}
        </v-card-title>
        <v-card-text>
          {{ $t("actions.areYouSure") }}
          {{ isBlocked ? $t("actions.unblock") : $t("actions.block") }}
          {{ $t("actions.thisUser") }}?
        </v-card-text>
        <v-card-actions>
          <v-btn @click="closeDialog">{{ $t("cancel") }}</v-btn>
          <v-btn :color="isBlocked ? 'success' : 'error'" @click="confirmBlock">
            {{ isBlocked ? $t("actions.unblock") : $t("actions.block") }}
          </v-btn>
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

<style scoped></style>
