<template>
  <div>
    <v-icon :color="isBlocked ? 'error' : 'success'" @click="openDialog">
      {{ isBlocked ? "mdi-account-cancel" : "mdi-account-check" }}
    </v-icon>

    <v-dialog v-model="dialog" max-width="400">
      <v-card>
        <v-card-title>
          {{ isBlocked ? "Unblock User" : "Block User" }}
        </v-card-title>
        <v-card-text>
          Are you sure you want to {{ isBlocked ? "unblock" : "block" }} this
          user?
        </v-card-text>
        <v-card-actions>
          <v-btn @click="closeDialog">Cancel</v-btn>
          <v-btn :color="isBlocked ? 'success' : 'error'" @click="confirmBlock">
            {{ isBlocked ? "Unblock" : "Block" }}
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

const emit = defineEmits(["update:blocked"]);

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
      `User ${isBlocked.value ? "unblocked" : "blocked"} successfully`,
      "success"
    );

    emit("update:blocked", !isBlocked.value);
    eventBus.emit("reloadData");
    closeDialog();
  } catch (error) {
    console.error("Failed to update user block status:", error);
    notificationStore.setNotification(
      "Failed to update user block status",
      "error"
    );
  }
};
</script>

<style scoped></style>
