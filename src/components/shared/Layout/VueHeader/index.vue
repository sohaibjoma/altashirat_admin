<template>

  <v-container fluid>
      <v-app-bar 
    class="rounded-te-xl rounded-be-xl ps-8 pe-8 pt-2 pb-2 bg-white me-3"
    >
      <v-toolbar class="bg-white"
    >
      <v-app-bar-nav-icon @click.stop="toggleDrawer">
        <v-icon icon="mdi-menu" class="icon--pink"></v-icon>
      </v-app-bar-nav-icon>

      <router-link to="/profile">
              <Image 
        name="avatar.png"
        class="v-toolbar__avatar"
      />
      </router-link>
      <div class="ps-4 text-start d-flex flex-column" v-if="userName">
        <span class="font-weight-bold">{{userName}}</span>
        <span class="text-body-2">{{ $t('drawer.superAdmin') }}</span>
      </div>
      <v-spacer></v-spacer>
      
      <v-select
        variant="outlined"
        :items="['ar', 'en']"
        class="mt-5 me-2"
        max-width="70px"
        base-color="secondary"
        v-model="localed"
      >
        <template #prepend-inner>
          <div class="d-flex align-center">
            <Image
              name="locale.svg"
              alt="localization-icon"
              class="v-toolbar__avatar"
            />
          </div>
        </template>
      </v-select>

      <div class="ms-3 me-3 bg-error-bg pt-2 ps-2 pe-2 rounded-lg cursor-pointer" @click="logout">
        <Image name="logout.png" alt="logout" class="header__icon"/>
      </div>

      <div class="ps-3 border-s-sm cursor-pointer" @click="goToSettings">
        <div class="bg-primary-2 pt-2 ps-2 pe-2 rounded-lg">
        <Image name="settings.png" alt="settings" class="header__icon"/>
        </div>
      </div>
    </v-toolbar>
     </v-app-bar>
    </v-container>

</template>

<script setup>
import { computed, watch, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../../../stores/auth";
import { useDrawerStore } from "../../../../stores/drawer";
import { useAppLocale } from "../../../../stores/appLocale";
import i18n from "../../../../plugins/I18n";
import vuetify from "../../../../plugins/vuetify";

// Handling drawer state
const drawerStore = useDrawerStore();
const { toggleDrawer } = drawerStore;

const appLocale = useAppLocale();
const { setAppLocale } = appLocale;

// Reactive reference for the selected locale
const localed = ref(localStorage.getItem("locale") || "en");

// Function to update the locale settings
const setLocale = () => {
  localStorage.setItem("locale", localed.value);
  i18n.global.locale = localed.value;
  vuetify.locale.current = localed.value;
  vuetify.locale.rtl = localed.value === "ar";
  setAppLocale(localed.value);
  window.location.reload();
};

// Watch for changes in the selected locale
watch(localed, (newLocale) => {
  console.log("Locale changed to:", newLocale);
  setLocale();
});

// Logout functionality
const authStore = useAuthStore();
const logout = () => authStore.logout();

// Settings functionality
const router = useRouter();
const goToSettings = () => router.push("/settings");

// Ensure user is reactive
const user = computed(() => authStore.user?.user || authStore.user || {});
const userName = computed(() => user.value?.firstname || "Guest");
</script>


<style>

</style>