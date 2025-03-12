<template>
  <v-app class="bg-gray">
    <div class="d-flex pe-4 justify-space-between align-center mt-2">
      <v-breadcrumbs
        :items="[$t('drawer.countries')]"
        class="dashboard__breadcrumb mt-3 me-3 rounded-te-lg rounded-be-lg"
      ></v-breadcrumbs>
    </div>
    <customTable
      :URLEndpoint="`/admin-panel/countries?page=${page}`"
      :tableHeaders="['id', 'name', 'actions']"
      :page="page"
      @update:page="page = $event"
    >
      <template #actions="{ item }">
        <ToggleVisibility
          :record="{ ...item, resource: 'countries' }"
          :payload="getCountryPayload"
          class="me-2"
        />
      </template>
    </customTable>
  </v-app>
</template>

<script setup>
import { ref } from "vue";

let page = ref(1);

function getCountryPayload(responseData) {
  const formData = new FormData();
  formData.append("_method", "put");
  formData.append("visible", responseData.country.visible ? "0" : "1");
  return formData;
}
</script>

<style scoped></style>
