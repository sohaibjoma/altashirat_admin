<template>
  <v-app class="bg-gray">
    <div class="d-flex pe-4 justify-space-between align-center">
      <v-breadcrumbs
        :items="[$t('drawer.visaTypes')]"
        class="dashboard__breadcrumb me-3 rounded-te-lg rounded-be-lg"
      />
      <div>
        <mainButton
          class="me-auto"
          color="primary"
          width="135px"
          @click="$router.push('/visa-types/add')"
        >
          {{ $t("create") }}
        </mainButton>
      </div>
    </div>
    <customTable
      max-width="800px"
      width="100%"
      :URLEndpoint="`/admin-panel/visa-types?page=${page}`"
      :tableHeaders="['id', 'name', 'actions']"
      :page="page"
      :loading="loading"
      @update:page="page = $event"
      class="rounded-lg"
    >
      <template #actions="{ item }">
        <ToggleVisibility
          class="d-flex align-center"
          :record="{ ...item, resource: 'visa-types' }"
          :payload="getVisaTypePayload"
          @visibility-toggled="handleVisibilityToggled"
        />
        <EditFiring :record="item" :resource="'visa-types'" class="ma-2" />
        <DeleteDialog
          :record="item"
          :resource="'visa-types'"
          class="mt-2"
          @item-deleted="handleItemDeleted"
        />
      </template>
    </customTable>
  </v-app>
</template>

<script setup>
import { ref, onUnmounted } from "vue";
import { useEventBus } from "../../../composables/eventBus";
import { useNotificationStore } from "../../../stores/notification";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const notificationStore = useNotificationStore();

const { on, off } = useEventBus();
const page = ref(1);

const handleUpdate = () => {
  console.log("Visa type updated or added event received");
};

on("visa-type-updated", handleUpdate);
on("visa-type-added", handleUpdate);

onUnmounted(() => {
  off("visa-type-updated", handleUpdate);
  off("visa-type-added", handleUpdate);
});

function getVisaTypePayload(responseData) {
  const formData = new FormData();
  formData.append("_method", "put");
  formData.append("visible", responseData.visa_type.visible ? "0" : "1");
  formData.append("name", responseData.visa_type.name);
  formData.append("locale", responseData.visa_type.locale || "en");
  return formData;
}

const handleVisibilityToggled = () => {
  notificationStore.setNotification(
    t("notifications.visa_type_visibility_toggled"),
    "success"
  );
};

const handleItemDeleted = () => {
  notificationStore.setNotification(
    t("notifications.visa_type_deleted_success"),
    "success"
  );
};
</script>

<style scoped></style>
