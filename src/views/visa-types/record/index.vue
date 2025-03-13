<template>
  <v-app class="bg-gray">
    <div class="d-flex pe-4 justify-space-between align-center">
      <v-breadcrumbs
        :items="[$t('drawer.visaTypes')]"
        class="dashboard__breadcrumb me-3 rounded-te-lg rounded-be-lg"
      />
      <div>
        <mainButton class="me-auto" color="secondary" width="135px">
          <router-link
            to="/visa-types/add"
            class="text-decoration-none text-white"
          >
            {{ $t("create") }}
          </router-link>
        </mainButton>
      </div>
    </div>
    <customTable
      :URLEndpoint="`/admin-panel/visa-types?page=${page}`"
      :tableHeaders="['id', 'name', 'actions']"
      :page="page"
      @update:page="page = $event"
      class="rounded-lg"
    >
      <template #actions="{ item }">
        <ToggleVisibility
          :record="{ ...item, resource: 'visa-types' }"
          :payload="getVisaTypePayload"
          class="me-2"
        />
        <EditFiring :record="item" :resource="'visa-types'" class="me-2" />
        <DeleteDialog :record="item" :resource="'visa-types'" class="mt-3" />
      </template>
    </customTable>
  </v-app>
</template>

<script setup>
import { ref, onUnmounted } from "vue";
import { useEventBus } from "../../../composables/eventBus";

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
</script>

<style scoped></style>
