<template>
  <v-app class="bg-gray">
    <div class="d-flex pe-4 justify-space-between align-center">
      <v-breadcrumbs
        :items="[$t('drawer.employmentTypes')]"
        class="dashboard__breadcrumb me-3 rounded-te-lg rounded-be-lg"
      />
      <div>
        <mainButton color="primary" width="135px" @click="handleCreate">
          {{ $t("create") }}
        </mainButton>
      </div>
    </div>
    <customTable
      width="100%"
      :URLEndpoint="`/admin-panel/employment-types?page=${page}`"
      :tableHeaders="['id', 'name', 'visibility', 'actions']"
      :page="page"
      @update:page="page = $event"
      class="rounded-lg"
    >
      <template #visibility="{ item }">
        <ToggleVisibility
          @visibility-toggled="handleVisibilityToggled"
          class="d-flex align-center"
          :record="{ ...item, resource: 'employment-types' }"
          :payload="getEmploymentTypePayload"
        />
      </template>
      <template #actions="{ item }">
        <EditFiring
          :record="item"
          :resource="'employment-types'"
          class="mb-2"
          @edit-clicked="handleEdit(item.id)"
        />
        <DeleteDialog
          @item-deleted="handleItemDeleted"
          :record="item"
          :resource="'employment-types'"
          class="mt-3"
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

function getEmploymentTypePayload(responseData) {
  const formData = new FormData();
  formData.append("_method", "put");
  formData.append("visible", responseData.employment_type.visible ? "0" : "1");
  formData.append("name", responseData.employment_type.name);
  formData.append("locale", "en");
  return formData;
}

const handleCreate = () => {
  eventBus.emit("create-employment-type");
  router.push("/employment-types/add");
};

const handleEdit = (id) => {
  eventBus.emit("edit-employment-type", { id });
  router.push(`/employment-types/edit/${id}`);
};

const handleVisibilityToggled = () => {
  notificationStore.setNotification(
    t("notifications.employment_type_visibility_toggled"),
    "success"
  );
  eventBus.emit("employment-type-updated");
};

const handleItemDeleted = () => {
  notificationStore.setNotification(
    t("notifications.employment_type_deleted_success"),
    "success"
  );
  eventBus.emit("employment-type-deleted");
};

onMounted(() => {
  eventBus.on("employment-type-updated", refreshData);
  eventBus.on("employment-type-deleted", refreshData);
});

onUnmounted(() => {
  eventBus.off("employment-type-updated", refreshData);
  eventBus.off("employment-type-deleted", refreshData);
});

const refreshData = () => {
  page.value = 1;
};
</script>

<style scoped></style>
