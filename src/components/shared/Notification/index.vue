<template>
  <v-snackbar
    v-model="visible"
    :class="['notification-snackbar', snackbarColor]"
    location="bottom right"
    :timeout="8000"
    elevation="10"
    rounded="lg"
    content-class="snackbar-content"
  >
    <div class="d-flex align-center justify-center px-15">
      <v-icon
        :icon="type === 'success' ? 'mdi-check-circle' : 'mdi-close-circle'"
        class="me-3"
        :class="type === 'success' ? 'success-icon' : 'error-icon'"
      ></v-icon>
      <span>{{ message }}</span>
    </div>
  </v-snackbar>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { useNotificationStore } from "../../../stores/notification";
import { storeToRefs } from "pinia";

const notificationStore = useNotificationStore();
const { message, type } = storeToRefs(notificationStore);

const visible = ref(false);
let timeoutId = null;

const snackbarColor = computed(() => {
  return type.value === "success" ? "success-bg" : "error-bg";
});

watch(message, (newMessage) => {
  if (newMessage) {
    visible.value = true;

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      visible.value = false;
      notificationStore.clearNotification();
    }, 8000);
  }
});
</script>
