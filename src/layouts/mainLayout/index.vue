<template>
  <v-app class="bg-gray pt-4 ps-4 pe-4">
    <SideBar />
    <VueHeader />
    <v-main class="mx-4">
      <router-view></router-view>
    </v-main>
  </v-app>


</template>

<script setup>
import SideBar from '../../components/shared/Layout/SideBar/index.vue'; 
import VueHeader from '../../components/shared/Layout/VueHeader/index.vue'
</script>

<style></style>
