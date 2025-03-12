<template>
  <v-app class="bg-gray">
    <div class="d-flex pe-4 justify-space-between align-center">
      <v-breadcrumbs
        :items="[$t('drawer.titles')]"
        class="dashboard__breadcrumb me-3 rounded-te-lg rounded-be-lg"
      />
      <div>
        <mainButton class="me-auto" color="secondary" width="135px">
          <router-link to="/titles/add" class="text-decoration-none text-white">
            {{ $t("create") }}
          </router-link>
        </mainButton>
      </div>
    </div>
    <customTable
      :URLEndpoint="`/admin-panel/titles?page=${page}`"
      :tableHeaders="['id', 'name', 'actions']"
      :page="page"
      @update:page="page = $event"
      class="rounded-lg"
    >
      <template #actions="{ item }">
        <ToggleVisibility
          :record="{ ...item, resource: 'titles' }"
          :payload="getTitlePayload"
          class="me-2"
        />
        <EditFiring :title="item" class="me-2" />
        <deleteDialog :title="item" class="mt-3" />
      </template>
    </customTable>
  </v-app>
</template>

<script setup>
import { ref } from "vue";

let page = ref(1);

function getTitlePayload(responseData) {
  const formData = new FormData();
  formData.append("_method", "put");
  formData.append("visible", responseData.title.visible ? "0" : "1");
  formData.append("name", responseData.title.name);
  formData.append("locale", "en");
  return formData;
}
</script>

<style scoped></style>
