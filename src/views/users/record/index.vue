<template>
  <v-app class="bg-gray">
    <v-breadcrumbs
      :items="[$t('drawer.users')]"
      class="dashboard__breadcrumb me-3 rounded-te-lg rounded-be-lg"
    />
    <customTable
      width="100%"
      :URLEndpoint="`/admin-panel/users?page=${page}`"
      :tableHeaders="['name', 'phone', 'email', 'role', 'profile', 'actions']"
      :page="page"
      @update:page="page = $event"
      class="rounded-lg"
      :headerFieldMapping="{
        name: 'username',
        phone: 'phone.number',
        email: 'email',
        role: 'roles.0.name',
        profile: '',
      }"
    >
      <template #profile="{ item }">
        <ShowProfile :userId="item.id" />
      </template>
      <template #actions="{ item }">
        <BlockUser
          :userId="item.id"
          :blocked="item.blocked"
          @update:blocked="(value) => (item.blocked = value)"
          url="/admin-panel/users"
          @user-blocked="handleUserBlocked"
          @user-unblocked="handleUserUnblocked"
        />
      </template>
    </customTable>
  </v-app>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useNotificationStore } from "../../../stores/notification";
import { useI18n } from "vue-i18n";
import { useEventBus } from "../../../composables/eventBus";
import ShowProfile from "../../../components/shared/ShowProfile/index.vue";

const { t } = useI18n();
const notificationStore = useNotificationStore();
const eventBus = useEventBus();

const page = ref(1);

const handleUserBlocked = () => {
  notificationStore.setNotification(
    t("notifications.user_blocked_success"),
    "success"
  );
  eventBus.emit("user-blocked");
};

const handleUserUnblocked = () => {
  notificationStore.setNotification(
    t("notifications.user_unblocked_success"),
    "success"
  );
  eventBus.emit("user-unblocked");
};

onMounted(() => {
  eventBus.on("user-blocked", refreshData);
  eventBus.on("user-unblocked", refreshData);
});

onUnmounted(() => {
  eventBus.off("user-blocked", refreshData);
  eventBus.off("user-unblocked", refreshData);
});

const refreshData = () => {
  console.log("refreshing data");
};
</script>

<style scoped></style>
