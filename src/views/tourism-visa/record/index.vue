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
        id: 'id',
        user: 'user',
        date: 'created_at',
        status: 'status',
        phone_id: 'phone_id.id',
        passport_number: 'passport',
       
      }"
      :tableHeaders="['id','user', 'date', 'phone', 'passport_number', 'editStatus']"
      :page="page"
      @update:page="page = $event"
      :refreshEvent="'tourism-visa-updated'"
      class="rounded-lg"
    >
      <!-- User Column Template -->
      <template #user="{ item }">
        <div>{{ item.user.name }} ({{ item.user.firstname }})</div>
      </template>
      <template #phone="{ item }">
        <div>
          {{ formatPhoneNumber(item.user.phone) || t("profile.N/A") }}
        </div>
      </template>
      <template #passport_number="{ item }">
        <div>
          {{ item.passport_number || t("profile.N/A") }}
        </div>
      </template>

      <template #date="{ item }">
        <div>
          {{ item.user.name }} ({{
            new Date(item.statuses[0].activated_at).toLocaleDateString("en-GB")
          }})
        </div>
      </template>

      <template #editStatus="{ item }">
        <EditFiring
          :record="item"
          :resource="'tourism-visa'"
          class="mb-2"
          @edit-clicked="handleEdit(item.id)"
        />
      </template>
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

// function getTourismVisaPayload(responseData) {
//   const formData = new FormData();
//   formData.append("_method", "put");
//   formData.append("visible", responseData.tourism_visa.visible ? "0" : "1");
//   formData.append("name", responseData.tourism_visa.name);
//   formData.append("locale", responseData.tourism_visa.locale || "en");
//   return formData;
// }

const formatPhoneNumber = (phoneObj) => {
  if (!phoneObj?.number) return null;

  const fullNumber = [phoneObj.country_code, phoneObj.number]
    .filter(Boolean)
    .join(" ");

  return fullNumber.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
};
</script>
