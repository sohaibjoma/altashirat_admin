<template>
  <v-app class="bg-gray">
    <div class="d-flex pe-4 justify-space-between align-center">
      <v-breadcrumbs
        :items="[$t('drawer.tourismVisa')]"
        class="dashboard__breadcrumb me-3 rounded-te-lg rounded-be-lg"
      />
      <div>
        <MainButton color="primary" width="135px" @click="handleCreate">
          {{ $t("create") }}
        </MainButton>
      </div>
    </div>
    <CustomTable
      width="100%"
      :URLEndpoint="`/admin-panel/tourism-visa`"
      :headerFieldMapping="{
        order_id: 'order_id.id',
        user: 'user',
        date: 'created_at',
        status: 'status',
      }"
      :tableHeaders="['order_id', 'user', 'date', 'status', 'actions']"
      :page="page"
      @update:page="page = $event"
      :refreshEvent="'tourism-visa-updated'"
      class="rounded-lg"
    >
      
     

      <!-- User Column Template -->
      <template #user="{ item }">
        <div v-if="item.user">{{ item.user.name }} ({{ item.user.email }})</div>
        <span v-else>N/A</span>
      </template>

      

      
        <DeleteDialog
          :record="item"
          :resource="'tourism-visa'"
          class="mt-3"
          @item-deleted="handleItemDeleted"
        />
     
     </CustomTable>
  </v-app>
</template>

<script setup>
import { ref } from "vue";
import { useEventBus } from "../../../composables/eventBus";
import { useNotificationStore } from "../../../stores/notification";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

const { t } = useI18n();
const notificationStore = useNotificationStore();
const eventBus = useEventBus();
const router = useRouter();

const page = ref(1);

function getTourismVisaPayload(responseData) {
  const formData = new FormData();
  formData.append("_method", "put");
  formData.append("visible", responseData.tourism_visa.visible ? "0" : "1");
  formData.append("name", responseData.tourism_visa.name);
  formData.append("locale", responseData.tourism_visa.locale || "en");
  return formData;
}

const handleCreate = () => {
  router.push("/tourism-visa/add");
};

const handleEdit = (id) => {
  router.push(`/tourism-visa/edit/${id}`);
};

const handleVisibilityToggled = () => {
  notificationStore.setNotification(
    t("notifications.tourism_visa_visibility_toggled"),
    "success"
  );
  eventBus.emit("tourism-visa-updated");
};

const handleItemDeleted = () => {
  notificationStore.setNotification(
    t("notifications.tourism_visa_deleted_success"),
    "success"
  );
  eventBus.emit("tourism-visa-updated");
};
</script>
