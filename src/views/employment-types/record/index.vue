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
      :refreshEvent="'employment-type-updated'"
      class="rounded-lg"
    >
      <template #visibility="{ item }">
        <ToggleVisibility
          class="d-flex align-center"
          :record="{ ...item, resource: 'employment-types' }"
          :payload="getEmploymentTypePayload"
          @visibility-toggled="handleVisibilityToggled"
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
          :record="item"
          :resource="'employment-types'"
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
import { useEventBus } from "../../../composables/eventBus";
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
  router.push("/employment-types/add");
};

const handleEdit = (id) => {
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
  eventBus.emit("employment-type-updated");
};
</script>

<style scoped></style>
