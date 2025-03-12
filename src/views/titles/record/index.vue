<template>
  <v-app class="bg-gray">
      <div class="d-flex pe-4 justify-space-between align-center mt-2">
        <v-breadcrumbs
          :items="[$t('drawer.titles')]"
          class="dashboard__breadcrumb mt-3 me-3 rounded-te-lg rounded-be-lg"
        ></v-breadcrumbs>
        <div class="pt-4">
          <mainButton class="me-auto" color="secondary" width="135px">
            <router-link
              to="/titles/actions"
              class="text-decoration-none text-white"
            >
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
      >
        <template #actions="{ title }">
          <ToggleVisibility :title="title" class="me-2"></ToggleVisibility>
          <EditFiring :title="title" class="me-2"></EditFiring>
          <deleteDialog :title="title" class="mt-3"></deleteDialog>
        </template>
      </customTable>
  </v-app>
</template>

<script setup>
import { ref } from "vue";

let page = ref(1);
</script>

<style></style>
