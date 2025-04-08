<template>
  <v-app class="bg-gray">
    <div class="d-flex pe-4 justify-space-between align-center">
      <v-breadcrumbs
        :items="[$t('drawer.visaTypes')]"
        class="dashboard__breadcrumb me-3 rounded-te-lg rounded-be-lg"
      />
      <div>
        <mainButton
          color="primary"
          width="135px"
          @click="handleCreate"
        >
          {{ $t("create") }}
        </mainButton>
      </div>
    </div>
    <customTable
      width="100%"
      :URLEndpoint="`/admin-panel/visa-types?page=${page}`"
      :tableHeaders="['id', 'name', 'visibility', 'actions']"
      :page="page"
      :loading="loading"
      @update:page="page = $event"
      class="rounded-lg"
    >
      <template #visibility="{ item }">
        <ToggleVisibility
          class="d-flex align-center"
          :record="{ ...item, resource: 'visa-types' }"
          :payload="getVisaTypePayload"
          @visibility-toggled="handleVisibilityToggled"
        />
      </template>
      <template #actions="{ item }">
        <EditFiring
          :record="item"
          :resource="'visa-types'"
          class="ma-2"
          @edit-clicked="handleEdit(item.id)"
        />
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
import { ref, onMounted, onUnmounted } from "vue";
import { useEventBus } from "../../../composables/eventBus";
import { useNotificationStore } from "../../../stores/notification";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

const { t } = useI18n();
const notificationStore = useNotificationStore();
const eventBus = useEventBus();
const router = useRouter();

const page = ref(1);

function getVisaTypePayload(responseData) {
  const formData = new FormData();
  formData.append("_method", "put");
  formData.append("visible", responseData.visa_type.visible ? "0" : "1");
  formData.append("name", responseData.visa_type.name);
  formData.append("locale", responseData.visa_type.locale || "en");
  return formData;
}

const handleCreate = () => {
  eventBus.emit("create-visa-type");
  router.push("/visa-types/add");
};

const handleEdit = (id) => {
  eventBus.emit("edit-visa-type", { id });
  router.push(`/visa-types/edit/${id}`);
};

const handleVisibilityToggled = () => {
  notificationStore.setNotification(
    t("notifications.visa_type_visibility_toggled"),
    "success"
  );
  eventBus.emit("visa-type-updated");
};

const handleItemDeleted = () => {
  notificationStore.setNotification(
    t("notifications.visa_type_deleted_success"),
    "success"
  );
  eventBus.emit("visa-type-deleted");
};

onMounted(() => {
  eventBus.on("visa-type-added", refreshData);
  eventBus.on("visa-type-updated", refreshData);
  eventBus.on("visa-type-deleted", refreshData);
});

onUnmounted(() => {
  eventBus.off("visa-type-added", refreshData);
  eventBus.off("visa-type-updated", refreshData);
  eventBus.off("visa-type-deleted", refreshData);
});

const refreshData = () => {
  page.value = 1;
};
</script>

<style scoped></style>
