<template>
  <v-app class="bg-gray">
    <div class="d-flex pe-4 justify-space-between align-center">
      <v-breadcrumbs
        :items="[$t('drawer.countries')]"
        class="dashboard__breadcrumb me-3 rounded-te-lg rounded-be-lg"
      ></v-breadcrumbs>
    </div>
    <customTable
      :URLEndpoint="`/admin-panel/countries?page=${page}`"
      :tableHeaders="['id', 'name', 'actions']"
      max-width="800px"
      width="100%"
      :page="page"
      @update:page="page = $event"
      class="rounded-lg"
    >
      <template #actions="{ item }">
        <ToggleVisibility
          class="d-flex align-center mx-2"
          :record="{ ...item, resource: 'countries' }"
          :payload="getCountryPayload"
          @visibility-toggled="handleVisibilityToggled"
        />
        <DeleteDialog
          :record="item"
          :resource="'countries'"
          class="mt-2"
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

let page = ref(1);

function getCountryPayload(responseData) {
  const formData = new FormData();
  formData.append("_method", "put");
  formData.append("visible", responseData.country.visible ? "0" : "1");
  return formData;
}

const handleVisibilityToggled = () => {
  notificationStore.setNotification(
    t("notifications.country_visibility_toggled"),
    "success"
  );
};

const handleItemDeleted = () => {
  notificationStore.setNotification(
    t("notifications.country_deleted_success"),
    "success"
  );
};
</script>

<style scoped></style>
