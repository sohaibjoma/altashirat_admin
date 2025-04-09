<template>
  <v-app class="bg-gray">
    <div class="d-flex pe-4 justify-space-between align-center">
      <v-breadcrumbs
        :items="[$t('drawer.titles')]"
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
      :URLEndpoint="`/admin-panel/titles?page=${page}`"
      :tableHeaders="['id', 'name', 'visibility', 'actions']"
      :page="page"
      @update:page="page = $event"
      :refreshEvent="'title-updated'"
      class="rounded-lg"
    >
      <template #visibility="{ item }">
        <ToggleVisibility
          class="d-flex justify-center"
          :record="{ ...item, resource: 'titles' }"
          :payload="getTitlePayload"
          @visibility-toggled="handleVisibilityToggled"
        />
      </template>
      <template #actions="{ item }">
        <EditFiring
          :record="item"
          :resource="'titles'"
          class="mb-2"
          @edit-clicked="handleEdit(item.id)"
        />
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
import { useEventBus } from "../../../composables/eventBus";
import { useRouter } from "vue-router";

const { t } = useI18n();
const notificationStore = useNotificationStore();
const eventBus = useEventBus();
const router = useRouter();

const page = ref(1);

function getTitlePayload(responseData) {
  const formData = new FormData();
  formData.append("_method", "put");
  formData.append("visible", responseData.title.visible ? "0" : "1");
  formData.append("name", responseData.title.name);
  formData.append("locale", "en");
  return formData;
}

const handleCreate = () => {
  eventBus.emit("create-title");
  router.push("/titles/add");
};

const handleEdit = (id) => {
  eventBus.emit("edit-title", { id });
  router.push(`/titles/edit/${id}`);
};

const handleVisibilityToggled = () => {
  notificationStore.setNotification(
    t("notifications.title_visibility_toggled"),
    "success"
  );
  eventBus.emit("title-updated");
};

const handleItemDeleted = () => {
  notificationStore.setNotification(
    t("notifications.title_deleted_success"),
    "success"
  );
  eventBus.emit("title-updated");
};
</script>

<style scoped></style>
