<template>
  <v-app class="bg-gray">
    <v-breadcrumbs
      :items="[$t('drawer.users')]"
      class="dashboard__breadcrumb me-3 rounded-te-lg rounded-be-lg"
    />
    <customTable
      width="100%"
      :URLEndpoint="`/admin-panel/users?page=${page}`"
      :tableHeaders="['name', 'phone', 'email', 'role', 'actions']"
      :page="page"
      @update:page="page = $event"
      class="rounded-lg"
      :headerFieldMapping="{
        name: 'username',
        phone: 'phone.number',
        email: 'email',
        role: 'roles.0.name',
      }"
    >
      <template #actions="{ item }">
        <BlockUser
          :userId="item.id"
          :blocked="item.blocked"
          @update:blocked="(value) => (item.blocked = value)"
          url="/admin-panel/users"
        />
      </template>
    </customTable>
  </v-app>
</template>

<script setup>
import { ref, onMounted, inject } from "vue";

const page = ref(1);
const emitter = inject("emitter");

function fetchData() {
  emitter.emit("reload");
}

onMounted(() => {
  emitter.on("reload", fetchData);
});
</script>

<style scoped></style>
