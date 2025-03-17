<template>
  <v-app class="bg-gray">
    <div class="d-flex pe-4 justify-space-between align-center">
      <v-breadcrumbs
        :items="[$t('drawer.titles')]"
        class="dashboard__breadcrumb me-3 rounded-te-lg rounded-be-lg"
      />
      <div>
        <mainButton class="me-auto" color="secondary" width="135px">
          <router-link to="/titles/add" class="text-decoration-none text-white">
            {{ $t("create") }}
          </router-link>
        </mainButton>
      </div>
    </div>
    <customTable
      max-width="800px"
      width="100%"
      :URLEndpoint="`/admin-panel/titles?page=${page}`"
      :tableHeaders="['id', 'name', 'actions']"
      :page="page"
      @update:page="page = $event"
      class="rounded-lg"
    >
      <template #actions="{ item }">
        <ToggleVisibility
          class="d-flex align-center"
          :record="{ ...item, resource: 'titles' }"
          :payload="getTitlePayload"
          @visibility-toggled="handleVisibilityToggled"
        />
        <EditFiring :record="item" :resource="'titles'" class="mb-2" />
        <DeleteDialog
          :record="item"
          :resource="'titles'"
          class="mt-3"
          @item-deleted="handleItemDeleted"
        />
      </template>
    </customTable>
  </v-app>
</template>

<script setup>
import { ref } from "vue";
import { useNotificationStore } from "../../../stores/notification";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const notificationStore = useNotificationStore();

const page = ref(1);

function getTitlePayload(responseData) {
  const formData = new FormData();
  formData.append("_method", "put");
  formData.append("visible", responseData.title.visible ? "0" : "1");
  formData.append("name", responseData.title.name);
  formData.append("locale", "en");
  return formData;
}

const handleVisibilityToggled = () => {
  notificationStore.setNotification(
    t("notifications.title_visibility_toggled"),
    "success"
  );
};

const handleItemDeleted = () => {
  notificationStore.setNotification(
    t("notifications.title_deleted_success"),
    "success"
  );
};
</script>

<style scoped></style>
