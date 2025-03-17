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
import { onMounted, ref } from "vue";
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

  const storedActiveItem = localStorage.getItem(ACTIVE_ITEM_KEY);
  if (storedActiveItem) {
    activeItem.value = storedActiveItem;
  } else if (displayedRoutes.value.length > 0) {
    activeItem.value = displayedRoutes.value[0].meta.title;
    localStorage.setItem(ACTIVE_ITEM_KEY, activeItem.value);
  }
});

const drawerStore = useDrawerStore();
let { drawer } = storeToRefs(drawerStore);

const activeItem = ref("");

const setActive = (item) => {
  activeItem.value = item;
  localStorage.setItem(ACTIVE_ITEM_KEY, item);
};

onMounted(() => {
  const currentRouteName = route.name;
  if (currentRouteName) {
    const foundRoute = displayedRoutes.value.find(
      (r) => r.name === currentRouteName
    );
    if (foundRoute) {
      setActive(foundRoute.meta.title);
    }
  }
});
</script>

<style scoped></style>
