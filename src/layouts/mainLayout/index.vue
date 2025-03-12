<template>
  <v-app class="bg-gray pt-2">
    <SideBar />
    <VueHeader />
    <v-main class="me-4 ms-4">
      <router-view></router-view>
    </v-main>
  </v-app>


</template>

<script setup>
import SideBar from '../../components/shared/Layout/SideBar/index.vue'; 
import VueHeader from '../../components/shared/Layout/VueHeader/index.vue'
</script>

<style></style>
