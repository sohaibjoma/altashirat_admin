<template>
  <v-app class="bg-gray">
    <div class="d-flex pe-4 justify-space-between align-center">
      <v-breadcrumbs
        :items="[$t('drawer.employmentTypes')]"
        class="dashboard__breadcrumb me-3 rounded-te-lg rounded-be-lg"
      />
      <div>
        <mainButton
          class="me-auto"
          color="secondary"
          width="135px"
          @click="$router.push('/employment-types/add')"
        >
          {{ $t("create") }}
        </mainButton>
      </div>
    </div>
    <customTable
      max-width="800px"
      width="100%"
      :URLEndpoint="`/admin-panel/employment-types?page=${page}`"
      :tableHeaders="['id', 'name', 'actions']"
      :page="page"
      @update:page="page = $event"
      class="rounded-lg"
    >
      <template #actions="{ item }">
        <ToggleVisibility
          @visibility-toggled="handleVisibilityToggled"
          class="d-flex align-center"
          :record="{ ...item, resource: 'employment-types' }"
          :payload="getEmploymentTypePayload"
        />
        <EditFiring
          :record="item"
          :resource="'employment-types'"
          class="mb-2"
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
import { ref } from "vue";
import { useNotificationStore } from "../../../stores/notification";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const notificationStore = useNotificationStore();

const page = ref(1);

function getEmploymentTypePayload(responseData) {
  const formData = new FormData();
  formData.append("_method", "put");
  formData.append("visible", responseData.employment_type.visible ? "0" : "1");
  formData.append("name", responseData.employment_type.name);
  formData.append("locale", "en");
  return formData;
}

const handleVisibilityToggled = () => {
  notificationStore.setNotification(
    t("notifications.employment_type_visibility_toggled"),
    "success"
  );
};

const handleItemDeleted = () => {
  notificationStore.setNotification(
    t("notifications.employment_type_deleted_success"),
    "success"
  );
};
</script>

<style scoped></style>
