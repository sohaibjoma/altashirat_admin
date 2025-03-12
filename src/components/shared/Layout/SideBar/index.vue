<template>
  <!-- Drawer -->
    <v-navigation-drawer v-model="drawer" app class="rounded-ts-xl">
      <div class="drawer__logo">
        <Image name="logo.png" alt="logo" class="drawer__logo__img"/>
      </div>
      <v-list class="pt-4">
        <!-- Dashboard -->
        <v-list-item v-for="(route, i) in displayedRoutes" :key="i"
          :class="{ 'active-class': activeItem === route.meta.title }"
          class="mt-2"
          @click="setActive(route.meta.title)"
        >
          <v-list-item-title class="align-center pb-2 pt-1">
            <div class="d-flex align-center">
              <Image
              :name="activeItem === route.meta.title ? 'active-nav-icon.png' : 'nav-icon.png'"
              alt="dash"
              class="pe-4 nav__icon"
            />
            <router-link v-if="route.path" :to=route.path class="text-decoration-none text-black">
            {{ route.meta.title }}
            </router-link>
            </div>
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useDrawerStore } from "../../../../stores/drawer";
import { storeToRefs } from "pinia";
import mainLayoutRoute from "../../../../router/modules/layouts/mainLayout";

const displayedRoutes = ref([]);

onMounted(() => {
  displayedRoutes.value = mainLayoutRoute.children.filter(route => route.meta && !route.meta.hidden);
  if (displayedRoutes.value.length > 0) {
    activeItem.value = displayedRoutes.value[0].meta.title;
  }
});


const drawerStore = useDrawerStore();
let {drawer} = storeToRefs(drawerStore);
// Track the currently active list item
const activeItem = ref("");
// Set the active item dynamically
const setActive = (item) => {
  activeItem.value = item;
};
</script>

<style></style>
