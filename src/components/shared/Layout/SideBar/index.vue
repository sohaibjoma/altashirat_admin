<template>
  <v-navigation-drawer v-model="drawer" app class="rounded-ts-xl mt-2">
    <div class="drawer__logo">
      <Image name="logo.png" alt="logo" class="drawer__logo__img" />
    </div>
    <v-list class="pt-4">
      <router-link
        v-for="(route, i) in displayedRoutes"
        :key="i"
        :to="route.path"
        class="text-decoration-none text-black"
      >
        <v-list-item
          :class="{ 'active-class': activeItem === route.meta.title }"
          class="mt-2"
          @click="setActive(route.meta.title)"
        >
          <v-list-item-title class="align-center pb-2 pt-1">
            <div class="d-flex align-center">
              <Image
                :name="
                  activeItem === route.meta.title
                    ? 'active-nav-icon.png'
                    : 'nav-icon.png'
                "
                alt="dash"
                class="pe-4 nav__icon"
              />
              {{ route.meta.title }}
            </div>
          </v-list-item-title>
        </v-list-item>
      </router-link>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { useDrawerStore } from "../../../../stores/drawer";
import { storeToRefs } from "pinia";
import mainLayoutRoute from "../../../../router/modules/layouts/mainLayout";
import { useRoute } from "vue-router";

const route = useRoute();
const displayedRoutes = ref([]);
const ACTIVE_ITEM_KEY = "activeDrawerItem";

onMounted(() => {
  displayedRoutes.value = mainLayoutRoute.children.filter(
    (route) => route.meta && !route.meta.hidden
  );

  updateActiveItemBasedOnRoute();
});

const drawerStore = useDrawerStore();
let { drawer } = storeToRefs(drawerStore);

const activeItem = ref("");

const setActive = (item) => {
  activeItem.value = item;
  localStorage.setItem(ACTIVE_ITEM_KEY, item);
};

// Function to update active item based on current route
const updateActiveItemBasedOnRoute = () => {
  const currentRoutePath = route.path;
  
  // Handle profile route specifically - clear selection
  if (currentRoutePath === '/profile') {
    activeItem.value = '';
    localStorage.removeItem(ACTIVE_ITEM_KEY);
    return;
  }
  
  // Handle settings route - ensure it's selected when navigated to from anywhere
  if (currentRoutePath === '/settings') {
    const settingsRoute = displayedRoutes.value.find(r => r.path === '/settings');
    if (settingsRoute) {
      setActive(settingsRoute.meta.title);
      return;
    }
  }
  
  // For other routes, find matching route from displayed routes
  const foundRoute = displayedRoutes.value.find(
    (r) => r.path === currentRoutePath || currentRoutePath.startsWith(r.path + '/')
  );
  
  if (foundRoute) {
    setActive(foundRoute.meta.title);
  } else {
    // If no matching route found, try to restore from localStorage
    const storedActiveItem = localStorage.getItem(ACTIVE_ITEM_KEY);
    if (storedActiveItem) {
      activeItem.value = storedActiveItem;
    } else if (displayedRoutes.value.length > 0) {
      // Default to first item if nothing stored and not on profile
      activeItem.value = displayedRoutes.value[0].meta.title;
      localStorage.setItem(ACTIVE_ITEM_KEY, activeItem.value);
    }
  }
};

// Watch for route changes to update the active item
watch(
  () => route.path,
  () => {
    updateActiveItemBasedOnRoute();
  }
);

onMounted(() => {
  // Initial update based on current route
  updateActiveItemBasedOnRoute();
});
</script>

<style scoped></style>